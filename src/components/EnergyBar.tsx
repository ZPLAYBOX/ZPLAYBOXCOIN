import React from 'react';
import { Zap, Flame } from 'lucide-react';
import { triggerHaptic } from '../utils/audio';

interface EnergyBarProps {
  energy: number;
  maxEnergy: number;
  energyRegenRate: number;
  turboChargesAvailable: number;
  isFrenzyActive: boolean;
  hapticsEnabled: boolean;
  onActivateTurbo: () => void;
}

export const EnergyBar: React.FC<EnergyBarProps> = ({
  energy,
  maxEnergy,
  energyRegenRate,
  turboChargesAvailable,
  isFrenzyActive,
  hapticsEnabled,
  onActivateTurbo,
}) => {
  const percentage = Math.min(100, Math.max(0, (energy / maxEnergy) * 100));

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-2 select-none">
      <div className="flex items-center justify-between text-xs mb-1.5 px-0.5">
        <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
          <Zap className="w-4 h-4 text-white fill-white" />
          <span className="font-['Space_Grotesk'] font-bold text-sm tracking-wide text-white">
            {Math.floor(energy)}
          </span>
          <span className="text-zinc-500 text-xs font-mono">/ {maxEnergy}</span>
          <span className="text-[10px] text-zinc-400 ml-1">
            (+{energyRegenRate}/s)
          </span>
        </div>

        {/* Turbo Booster Trigger */}
        <button
          onClick={() => {
            triggerHaptic('medium', hapticsEnabled);
            onActivateTurbo();
          }}
          disabled={isFrenzyActive || turboChargesAvailable <= 0}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
            isFrenzyActive
              ? 'bg-white text-black animate-pulse'
              : turboChargesAvailable > 0
              ? 'bg-zinc-800 border border-zinc-600 text-zinc-100 hover:bg-zinc-700 active:scale-95'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{isFrenzyActive ? 'Frenzy Active' : `Turbo (${turboChargesAvailable}/3)`}</span>
        </button>
      </div>

      {/* Energy Track Container */}
      <div className="relative w-full h-3 rounded-full bg-zinc-900/90 border border-zinc-800 p-0.5 overflow-hidden shadow-inner">
        <div
          style={{ width: `${percentage}%` }}
          className={`h-full rounded-full transition-all duration-150 ${
            isFrenzyActive
              ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]'
              : percentage > 25
              ? 'bg-gradient-to-r from-zinc-400 via-white to-zinc-300'
              : 'bg-gradient-to-r from-zinc-600 to-zinc-400'
          }`}
        />
      </div>
    </div>
  );
};
