import React from 'react';
import { UpgradeItem } from '../types/game';
import { RobloxLogoSvg } from './RobloxLogoSvg';
import { sound, triggerHaptic, triggerNotificationHaptic } from '../utils/audio';
import {
  Pickaxe,
  BatteryCharging,
  Zap,
  Bot,
  Sparkles,
  Flame,
  Check,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface UpgradesPanelProps {
  coins: number;
  upgrades: UpgradeItem[];
  turboChargesAvailable: number;
  isFrenzyActive: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onPurchaseUpgrade: (upgradeId: string, cost: number) => void;
  onActivateTurbo: () => void;
}

export const UpgradesPanel: React.FC<UpgradesPanelProps> = ({
  coins,
  upgrades,
  turboChargesAvailable,
  isFrenzyActive,
  soundEnabled,
  hapticsEnabled,
  onPurchaseUpgrade,
  onActivateTurbo,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pickaxe':
        return <Pickaxe className="w-5 h-5 text-white" />;
      case 'BatteryCharging':
        return <BatteryCharging className="w-5 h-5 text-white" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-white" />;
      case 'Bot':
        return <Bot className="w-5 h-5 text-white" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-white" />;
      default:
        return <Zap className="w-5 h-5 text-white" />;
    }
  };

  const handleBuy = (upgrade: UpgradeItem) => {
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
    if (coins < cost) {
      triggerHaptic('heavy', hapticsEnabled);
      return;
    }

    sound.playUpgrade(soundEnabled);
    triggerNotificationHaptic('success', hapticsEnabled);
    onPurchaseUpgrade(upgrade.id, cost);
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 px-4 space-y-4 select-none">
      {/* Top Boosters Spotlight */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-700 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-['Poppins']">
                Turbo Charging & Frenzy
              </h3>
              <p className="text-[11px] text-zinc-400">
                Instant 100% Energy + 2x Coin Frenzy
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
          <div className="text-xs text-zinc-400">
            <span>Daily Boosts: </span>
            <strong className="text-white">{turboChargesAvailable} / 3 Remaining</strong>
          </div>

          <button
            onClick={() => {
              triggerHaptic('medium', hapticsEnabled);
              onActivateTurbo();
            }}
            disabled={isFrenzyActive || turboChargesAvailable <= 0}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isFrenzyActive
                ? 'bg-white text-black animate-pulse'
                : turboChargesAvailable > 0
                ? 'bg-white text-black hover:bg-zinc-200 active:scale-95 shadow-md shadow-white/10'
                : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFrenzyActive ? 'animate-spin' : ''}`} />
            <span>{isFrenzyActive ? 'Frenzy Active (15s)' : 'Use Turbo Free'}</span>
          </button>
        </div>
      </div>

      {/* Upgrades Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Mining Equipment Upgrades
          </h2>
          <span className="text-[11px] text-zinc-500 font-mono">
            {Math.floor(coins).toLocaleString()} coins available
          </span>
        </div>

        <div className="space-y-2">
          {upgrades.map((upgrade) => {
            const currentCost = Math.floor(
              upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level)
            );
            const canAfford = coins >= currentCost;

            return (
              <div
                key={upgrade.id}
                className="p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 hover:border-zinc-700 transition-all flex items-center justify-between gap-3 shadow-md"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                  {getIcon(upgrade.iconName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate">
                      {upgrade.name}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-zinc-900 border border-zinc-700 text-zinc-300">
                      lvl {upgrade.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {upgrade.description}
                  </p>
                  <div className="text-[10px] text-zinc-400 font-mono mt-1 flex items-center gap-1">
                    <span className="text-zinc-200 font-semibold">
                      +{upgrade.benefitPerLevel} {upgrade.benefitUnit}
                    </span>
                    <span>(Current: {upgrade.currentBenefit} {upgrade.benefitUnit})</span>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  disabled={!canAfford}
                  onClick={() => handleBuy(upgrade)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex flex-col items-center justify-center min-w-[84px] ${
                    canAfford
                      ? 'bg-zinc-100 text-black hover:bg-white active:scale-95 shadow-sm'
                      : 'bg-zinc-900/80 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <RobloxLogoSvg size={13} glow={false} />
                    <span className="font-mono text-[11px]">
                      {currentCost.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[9px] opacity-75 mt-0.5">Upgrade</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
