/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, ClaimOrder, UpgradeItem, Quest } from './types/game';
import {
  COINS_PER_ROBUX,
  INITIAL_UPGRADES,
  INITIAL_QUESTS,
  INITIAL_LEADERBOARD,
  TITLES,
  LEAGUES,
} from './utils/constants';
import { sound, triggerHaptic, triggerNotificationHaptic } from './utils/audio';
import { HeaderBanner } from './components/HeaderBanner';
import { RobloxTapCoin } from './components/RobloxTapCoin';
import { EnergyBar } from './components/EnergyBar';
import { RobloxClaimModal } from './components/RobloxClaimModal';
import { UpgradesPanel } from './components/UpgradesPanel';
import { QuestsPanel } from './components/QuestsPanel';
import { FriendsPanel } from './components/FriendsPanel';
import { LeaderboardPanel } from './components/LeaderboardPanel';
import { ProfileModal } from './components/ProfileModal';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { Sparkles, Bot, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'bloxmine_telegram_save_v1';

const INITIAL_GAME_STATE: GameState = {
  coins: 2500,
  totalCoinsMined: 2500,
  totalRobuxClaimed: 0,
  energy: 1000,
  maxEnergy: 1000,
  energyRegenRate: 3,
  multitapLevel: 1,
  autoMinerLevel: 0,
  energyTankLevel: 1,
  critChanceLevel: 0,
  lastActiveTimestamp: Date.now(),
  robloxUsername: '',
  telegramUsername: '',
  selectedTitle: TITLES[0],
  selectedAvatarIndex: 0,
  soundEnabled: true,
  hapticsEnabled: true,
  claimHistory: [],
  completedQuestIds: [],
  claimedQuestIds: [],
  dailyStreak: 1,
  lastDailyClaimTimestamp: 0,
  totalTaps: 0,
  turboChargesAvailable: 3,
  lastTurboResetTimestamp: Date.now(),
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_GAME_STATE, ...parsed };
      }
    } catch {}
    return INITIAL_GAME_STATE;
  });

  const [upgrades, setUpgrades] = useState<UpgradeItem[]>(() => {
    return INITIAL_UPGRADES.map((u) => {
      if (u.id === 'multitap') return { ...u, level: gameState.multitapLevel, currentBenefit: gameState.multitapLevel };
      if (u.id === 'energy_tank') return { ...u, level: gameState.energyTankLevel, currentBenefit: gameState.maxEnergy };
      if (u.id === 'energy_regen') return { ...u, level: Math.max(1, Math.floor(gameState.energyRegenRate / 2)), currentBenefit: gameState.energyRegenRate };
      if (u.id === 'auto_miner') return { ...u, level: gameState.autoMinerLevel, currentBenefit: gameState.autoMinerLevel * 5 };
      if (u.id === 'crit_chance') return { ...u, level: gameState.critChanceLevel, currentBenefit: gameState.critChanceLevel * 4 };
      return u;
    });
  });

  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [activeTab, setActiveTab] = useState<TabType>('mine');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isFrenzyActive, setIsFrenzyActive] = useState(false);
  const [offlineEarningsNotice, setOfflineEarningsNotice] = useState<number | null>(null);

  // Initialize Telegram WebApp SDK if present
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.expand?.();
        window.Telegram.WebApp.ready?.();

        const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (tgUser) {
          setGameState((prev) => ({
            ...prev,
            telegramUsername: tgUser.username || `${tgUser.first_name || 'Telegram'}_${tgUser.id || 'User'}`,
            telegramUserId: String(tgUser.id),
          }));
        }
      } catch {}
    }
  }, []);

  // Save game state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch {}
  }, [gameState]);

  // Offline passive earnings calculation on mount
  useEffect(() => {
    if (gameState.autoMinerLevel > 0) {
      const now = Date.now();
      const elapsedSeconds = Math.min(60 * 60 * 6, Math.floor((now - (gameState.lastActiveTimestamp || now)) / 1000));
      if (elapsedSeconds > 10) {
        const passiveRate = gameState.autoMinerLevel * 5;
        const earned = elapsedSeconds * passiveRate;
        if (earned > 0) {
          setOfflineEarningsNotice(earned);
          setGameState((prev) => ({
            ...prev,
            coins: prev.coins + earned,
            totalCoinsMined: prev.totalCoinsMined + earned,
            lastActiveTimestamp: now,
          }));
        }
      }
    }
  }, []);

  // Main Loop: Passive auto-mining & Energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => {
        const now = Date.now();
        // Energy refill
        const newEnergy = Math.min(prev.maxEnergy, prev.energy + prev.energyRegenRate);

        // Auto miner coin generation
        const passiveCoins = prev.autoMinerLevel * 5;
        const newCoins = prev.coins + passiveCoins;
        const newTotalMined = prev.totalCoinsMined + passiveCoins;

        // Reset turbo charges every 24h
        let turbos = prev.turboChargesAvailable;
        let lastTurboTime = prev.lastTurboResetTimestamp;
        if (now - lastTurboTime > 24 * 60 * 60 * 1000) {
          turbos = 3;
          lastTurboTime = now;
        }

        return {
          ...prev,
          energy: newEnergy,
          coins: newCoins,
          totalCoinsMined: newTotalMined,
          turboChargesAvailable: turbos,
          lastTurboResetTimestamp: lastTurboTime,
          lastActiveTimestamp: now,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Synchronize Quests progress based on total taps & coins
  useEffect(() => {
    setQuests((prevQuests) =>
      prevQuests.map((q) => {
        let isCompleted = q.isCompleted || gameState.completedQuestIds.includes(q.id);
        let progress = q.currentProgress;

        if (q.id === 'mine_500_taps') {
          progress = Math.min(500, gameState.totalTaps);
          if (progress >= 500) isCompleted = true;
        } else if (q.id === 'mine_5000_taps') {
          progress = Math.min(5000, gameState.totalTaps);
          if (progress >= 5000) isCompleted = true;
        } else if (q.id === 'roblox_link' && gameState.robloxUsername.trim().length > 0) {
          isCompleted = true;
          progress = 1;
        } else if (q.id === 'first_claim' && gameState.claimHistory.length > 0) {
          isCompleted = true;
          progress = 1;
        }

        const isClaimed = gameState.claimedQuestIds.includes(q.id);
        return { ...q, currentProgress: progress, isCompleted, isClaimed };
      })
    );
  }, [gameState.totalTaps, gameState.robloxUsername, gameState.claimHistory, gameState.completedQuestIds, gameState.claimedQuestIds]);

  // Tap handler
  const handleTapSuccess = useCallback((amount: number, energyUsed: number) => {
    setGameState((prev) => {
      const newCoins = prev.coins + amount;
      const newTotalCoins = prev.totalCoinsMined + amount;
      const newEnergy = Math.max(0, prev.energy - energyUsed);
      const newTotalTaps = prev.totalTaps + 1;

      return {
        ...prev,
        coins: newCoins,
        totalCoinsMined: newTotalCoins,
        energy: newEnergy,
        totalTaps: newTotalTaps,
      };
    });
  }, []);

  // Activate Turbo / Frenzy boost
  const handleActivateTurbo = () => {
    if (gameState.turboChargesAvailable <= 0 || isFrenzyActive) return;

    sound.playFrenzy(gameState.soundEnabled);
    triggerNotificationHaptic('success', gameState.hapticsEnabled);
    setIsFrenzyActive(true);

    setGameState((prev) => ({
      ...prev,
      energy: prev.maxEnergy,
      turboChargesAvailable: Math.max(0, prev.turboChargesAvailable - 1),
    }));

    // 15 seconds frenzy duration
    setTimeout(() => {
      setIsFrenzyActive(false);
    }, 15000);
  };

  // Purchase Upgrade
  const handlePurchaseUpgrade = (upgradeId: string, cost: number) => {
    setGameState((prev) => {
      let multitap = prev.multitapLevel;
      let maxEnergy = prev.maxEnergy;
      let energyRegen = prev.energyRegenRate;
      let autoMiner = prev.autoMinerLevel;
      let critChance = prev.critChanceLevel;
      let tankLvl = prev.energyTankLevel;

      if (upgradeId === 'multitap') multitap += 1;
      else if (upgradeId === 'energy_tank') {
        tankLvl += 1;
        maxEnergy += 500;
      } else if (upgradeId === 'energy_regen') energyRegen += 2;
      else if (upgradeId === 'auto_miner') autoMiner += 1;
      else if (upgradeId === 'crit_chance') critChance += 1;

      return {
        ...prev,
        coins: prev.coins - cost,
        multitapLevel: multitap,
        maxEnergy,
        energyTankLevel: tankLvl,
        energyRegenRate: energyRegen,
        autoMinerLevel: autoMiner,
        critChanceLevel: critChance,
      };
    });

    setUpgrades((prev) =>
      prev.map((u) => {
        if (u.id === upgradeId) {
          const nextLvl = u.level + 1;
          return {
            ...u,
            level: nextLvl,
            currentBenefit: u.currentBenefit + u.benefitPerLevel,
          };
        }
        return u;
      })
    );
  };

  // Claim Robux confirmation
  const handleConfirmClaim = (order: ClaimOrder) => {
    setGameState((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins - order.coinsSpent),
      totalRobuxClaimed: prev.totalRobuxClaimed + order.robuxAmount,
      claimHistory: [order, ...prev.claimHistory],
    }));
  };

  // Claim Quests reward
  const handleClaimQuest = (questId: string, rewardCoins: number, rewardRobux: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + rewardCoins,
      totalCoinsMined: prev.totalCoinsMined + rewardCoins,
      totalRobuxClaimed: prev.totalRobuxClaimed + rewardRobux,
      completedQuestIds: prev.completedQuestIds.includes(questId) ? prev.completedQuestIds : [...prev.completedQuestIds, questId],
      claimedQuestIds: prev.claimedQuestIds.includes(questId) ? prev.claimedQuestIds : [...prev.claimedQuestIds, questId],
    }));
  };

  // Claim Daily reward
  const handleClaimDaily = (day: number, rewardCoins: number, rewardRobux: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + rewardCoins,
      totalCoinsMined: prev.totalCoinsMined + rewardCoins,
      totalRobuxClaimed: prev.totalRobuxClaimed + rewardRobux,
      dailyStreak: prev.dailyStreak + 1,
      lastDailyClaimTimestamp: Date.now(),
    }));
  };

  // Profile save
  const handleSaveProfile = (updates: {
    robloxUsername: string;
    selectedTitle: string;
    selectedAvatarIndex: number;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
  }) => {
    setGameState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  // Reset simulation
  const handleResetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(INITIAL_GAME_STATE);
  };

  const unclaimedQuestsCount = quests.filter((q) => q.isCompleted && !q.isClaimed).length;

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col justify-between overflow-x-hidden select-none">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-b from-white/5 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-zinc-900/40 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Main Content Viewport */}
      <div className="relative z-10 flex-1 flex flex-col max-w-md mx-auto w-full">
        {/* TOP ROUND TYPE BANNER BAR */}
        <HeaderBanner
          coins={gameState.coins}
          robloxUsername={gameState.robloxUsername}
          telegramUsername={gameState.telegramUsername}
          soundEnabled={gameState.soundEnabled}
          hapticsEnabled={gameState.hapticsEnabled}
          onToggleSound={() => setGameState((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
          onToggleHaptics={() => setGameState((p) => ({ ...p, hapticsEnabled: !p.hapticsEnabled }))}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenClaim={() => setIsClaimModalOpen(true)}
          selectedTitle={gameState.selectedTitle}
        />

        {/* Offline Earnings Dialog if earned coins while offline */}
        {offlineEarningsNotice !== null && (
          <div className="mx-4 my-2 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block font-['Poppins']">
                  Roblox Auto-Miner Report
                </span>
                <span className="text-[11px] text-zinc-400">
                  Mined while you were offline: <strong className="text-white font-mono">+{offlineEarningsNotice.toLocaleString()} coins</strong>
                </span>
              </div>
            </div>
            <button
              onClick={() => setOfflineEarningsNotice(null)}
              className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 active:scale-95"
            >
              Collect
            </button>
          </div>
        )}

        {/* Dynamic Tab Views */}
        <main className="flex-1 flex flex-col justify-center">
          {activeTab === 'mine' && (
            <div className="flex-1 flex flex-col justify-between py-1">
              {/* Central Tap Coin */}
              <RobloxTapCoin
                multitapLevel={gameState.multitapLevel}
                critChanceLevel={gameState.critChanceLevel}
                energy={gameState.energy}
                maxEnergy={gameState.maxEnergy}
                isFrenzyActive={isFrenzyActive}
                soundEnabled={gameState.soundEnabled}
                hapticsEnabled={gameState.hapticsEnabled}
                onTapSuccess={handleTapSuccess}
                onOpenTurboBoost={handleActivateTurbo}
              />

              {/* Energy Bar at bottom of tap area */}
              <EnergyBar
                energy={gameState.energy}
                maxEnergy={gameState.maxEnergy}
                energyRegenRate={gameState.energyRegenRate}
                turboChargesAvailable={gameState.turboChargesAvailable}
                isFrenzyActive={isFrenzyActive}
                hapticsEnabled={gameState.hapticsEnabled}
                onActivateTurbo={handleActivateTurbo}
              />
            </div>
          )}

          {activeTab === 'boosts' && (
            <UpgradesPanel
              coins={gameState.coins}
              upgrades={upgrades}
              turboChargesAvailable={gameState.turboChargesAvailable}
              isFrenzyActive={isFrenzyActive}
              soundEnabled={gameState.soundEnabled}
              hapticsEnabled={gameState.hapticsEnabled}
              onPurchaseUpgrade={handlePurchaseUpgrade}
              onActivateTurbo={handleActivateTurbo}
            />
          )}

          {activeTab === 'claim' && (
            <div className="py-2 px-1">
              <RobloxClaimModal
                coins={gameState.coins}
                robloxUsername={gameState.robloxUsername}
                claimHistory={gameState.claimHistory}
                soundEnabled={gameState.soundEnabled}
                hapticsEnabled={gameState.hapticsEnabled}
                onClose={() => setActiveTab('mine')}
                onConfirmClaim={handleConfirmClaim}
                onUpdateRobloxUsername={(name) => setGameState((p) => ({ ...p, robloxUsername: name }))}
              />
            </div>
          )}

          {activeTab === 'quests' && (
            <QuestsPanel
              quests={quests}
              dailyStreak={gameState.dailyStreak}
              lastDailyClaimTimestamp={gameState.lastDailyClaimTimestamp}
              soundEnabled={gameState.soundEnabled}
              hapticsEnabled={gameState.hapticsEnabled}
              onClaimQuest={handleClaimQuest}
              onClaimDaily={handleClaimDaily}
              onOpenProfile={() => setIsProfileModalOpen(true)}
            />
          )}

          {activeTab === 'ranks' && (
            <LeaderboardPanel
              users={INITIAL_LEADERBOARD}
              userCoins={gameState.coins}
              userRobuxClaimed={gameState.totalRobuxClaimed}
              robloxUsername={gameState.robloxUsername || gameState.telegramUsername || 'Miner_01'}
            />
          )}

          {activeTab === 'friends' && (
            <FriendsPanel
              robloxUsername={gameState.robloxUsername}
              telegramUsername={gameState.telegramUsername}
              hapticsEnabled={gameState.hapticsEnabled}
              onInviteFriend={() => {
                // Award bonus for trying referral
                setGameState((p) => ({
                  ...p,
                  coins: p.coins + 500,
                  totalCoinsMined: p.totalCoinsMined + 500,
                }));
              }}
            />
          )}
        </main>
      </div>

      {/* Claim Modal Popup when triggered from Header button */}
      {isClaimModalOpen && (
        <RobloxClaimModal
          coins={gameState.coins}
          robloxUsername={gameState.robloxUsername}
          claimHistory={gameState.claimHistory}
          soundEnabled={gameState.soundEnabled}
          hapticsEnabled={gameState.hapticsEnabled}
          onClose={() => setIsClaimModalOpen(false)}
          onConfirmClaim={handleConfirmClaim}
          onUpdateRobloxUsername={(name) => setGameState((p) => ({ ...p, robloxUsername: name }))}
        />
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          robloxUsername={gameState.robloxUsername}
          telegramUsername={gameState.telegramUsername}
          selectedTitle={gameState.selectedTitle}
          selectedAvatarIndex={gameState.selectedAvatarIndex}
          totalCoinsMined={gameState.totalCoinsMined}
          totalRobuxClaimed={gameState.totalRobuxClaimed}
          totalTaps={gameState.totalTaps}
          soundEnabled={gameState.soundEnabled}
          hapticsEnabled={gameState.hapticsEnabled}
          onClose={() => setIsProfileModalOpen(false)}
          onSaveProfile={handleSaveProfile}
          onResetGame={handleResetGame}
        />
      )}

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <BottomNavBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'claim') {
            setIsClaimModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        hapticsEnabled={gameState.hapticsEnabled}
        unclaimedQuestsCount={unclaimedQuestsCount}
      />
    </div>
  );
}
