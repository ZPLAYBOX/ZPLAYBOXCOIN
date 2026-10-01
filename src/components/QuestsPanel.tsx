import React from 'react';
import { Quest, DailyStreakDay } from '../types/game';
import { RobloxLogoSvg } from './RobloxLogoSvg';
import { sound, triggerHaptic, triggerNotificationHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Send,
  UserCheck,
  Target,
  Flame,
  Users,
  Gift,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface QuestsPanelProps {
  quests: Quest[];
  dailyStreak: number;
  lastDailyClaimTimestamp: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onClaimQuest: (questId: string, coins: number, robux: number) => void;
  onClaimDaily: (day: number, coins: number, robux: number) => void;
  onOpenProfile: () => void;
}

const DAILY_REWARDS_DATA = [
  { day: 1, coins: 1500, robux: 1 },
  { day: 2, coins: 3000, robux: 2 },
  { day: 3, coins: 6000, robux: 5 },
  { day: 4, coins: 12000, robux: 10 },
  { day: 5, coins: 25000, robux: 20 },
  { day: 6, coins: 40000, robux: 35 },
  { day: 7, coins: 75000, robux: 75 },
];

export const QuestsPanel: React.FC<QuestsPanelProps> = ({
  quests,
  dailyStreak,
  lastDailyClaimTimestamp,
  soundEnabled,
  hapticsEnabled,
  onClaimQuest,
  onClaimDaily,
  onOpenProfile,
}) => {
  // Check if daily reward can be claimed today (once per 20 hours)
  const now = Date.now();
  const canClaimDaily = now - lastDailyClaimTimestamp > 20 * 60 * 60 * 1000;
  const currentStreakDay = ((dailyStreak) % 7) + 1;

  const getQuestIcon = (iconName: string) => {
    switch (iconName) {
      case 'Send':
        return <Send className="w-4 h-4 text-white" />;
      case 'UserCheck':
        return <UserCheck className="w-4 h-4 text-white" />;
      case 'Target':
        return <Target className="w-4 h-4 text-white" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-white" />;
      case 'Users':
        return <Users className="w-4 h-4 text-white" />;
      default:
        return <Gift className="w-4 h-4 text-white" />;
    }
  };

  const handleClaimQuestAction = (quest: Quest) => {
    if (!quest.isCompleted || quest.isClaimed) return;
    sound.playClaimSuccess(soundEnabled);
    triggerNotificationHaptic('success', hapticsEnabled);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}
    onClaimQuest(quest.id, quest.rewardCoins, quest.rewardRobux);
  };

  const handleQuestInteract = (quest: Quest) => {
    if (quest.id === 'roblox_link') {
      onOpenProfile();
      return;
    }
    if (quest.link) {
      if (window.Telegram?.WebApp?.openTelegramLink && quest.link.startsWith('https://t.me/')) {
        window.Telegram.WebApp.openTelegramLink(quest.link);
      } else {
        window.open(quest.link, '_blank');
      }
    }
    // Auto complete social tasks upon opening link
    if (!quest.isCompleted && (quest.type === 'telegram' || quest.type === 'social')) {
      setTimeout(() => {
        onClaimQuest(quest.id, 0, 0); // Mark completed
      }, 1500);
    }
  };

  const handleClaimDailyClick = (reward: { day: number; coins: number; robux: number }) => {
    if (!canClaimDaily || reward.day !== currentStreakDay) return;
    sound.playClaimSuccess(soundEnabled);
    triggerNotificationHaptic('success', hapticsEnabled);
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {}
    onClaimDaily(reward.day, reward.coins, reward.robux);
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 px-4 space-y-4 select-none">
      {/* 7-Day Login Streak Box */}
      <div className="p-4 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-['Poppins'] flex items-center gap-1.5">
                Daily Login Rewards
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                  Day {dailyStreak} Streak
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Log in every day for free coins and Robux!
              </p>
            </div>
          </div>
        </div>

        {/* 7 Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {DAILY_REWARDS_DATA.map((r) => {
            const isClaimed = dailyStreak >= r.day;
            const isCurrent = canClaimDaily && r.day === currentStreakDay;

            return (
              <button
                key={r.day}
                onClick={() => handleClaimDailyClick(r)}
                disabled={!isCurrent}
                className={`p-2 rounded-xl flex flex-col items-center justify-between min-h-[64px] border transition-all text-center relative overflow-hidden ${
                  isCurrent
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-pulse active:scale-95'
                    : isClaimed
                    ? 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
                    : 'bg-zinc-950 border-zinc-800/80 text-zinc-400'
                }`}
              >
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  D{r.day}
                </span>

                <div className="my-0.5">
                  {r.day === 7 ? (
                    <Sparkles className="w-4 h-4 text-amber-300 mx-auto fill-current" />
                  ) : (
                    <RobloxLogoSvg size={14} glow={false} />
                  )}
                </div>

                <span className="text-[8px] font-mono font-bold leading-tight">
                  {r.coins >= 1000 ? `${r.coins / 1000}k` : r.coins}
                </span>

                {isClaimed && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {canClaimDaily && (
          <button
            onClick={() => {
              const currentReward = DAILY_REWARDS_DATA.find((r) => r.day === currentStreakDay);
              if (currentReward) handleClaimDailyClick(currentReward);
            }}
            className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-1 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Claim Day {currentStreakDay} Free Reward</span>
          </button>
        )}
      </div>

      {/* Quests & Tasks */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          Quests & Community Tasks
        </h2>

        <div className="space-y-2">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 hover:border-zinc-700 transition-all flex items-center justify-between gap-3 shadow-md"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                {getQuestIcon(quest.icon)}
              </div>

              {/* Quest Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">
                  {quest.title}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                  {quest.description}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1 font-bold text-white">
                    +{quest.rewardCoins.toLocaleString()} Coins
                  </span>
                  {quest.rewardRobux > 0 && (
                    <span className="text-zinc-400">
                      (+{quest.rewardRobux} R$)
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {quest.isClaimed ? (
                <div className="px-3 py-1.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-500 text-xs font-medium flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Done</span>
                </div>
              ) : quest.isCompleted ? (
                <button
                  onClick={() => handleClaimQuestAction(quest)}
                  className="px-3.5 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 active:scale-95 shadow-md shadow-white/10 shrink-0"
                >
                  Claim
                </button>
              ) : (
                <button
                  onClick={() => handleQuestInteract(quest)}
                  className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold active:scale-95 flex items-center gap-1 shrink-0"
                >
                  <span>Start</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
