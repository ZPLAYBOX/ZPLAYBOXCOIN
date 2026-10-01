import React from 'react';
import { RobloxLogoSvg } from './RobloxLogoSvg';
import { COINS_PER_ROBUX, LEAGUES } from '../utils/constants';
import { Volume2, VolumeX, Smartphone, User, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from '../utils/audio';

interface HeaderBannerProps {
  coins: number;
  robloxUsername: string;
  telegramUsername: string;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onOpenProfile: () => void;
  onOpenClaim: () => void;
  selectedTitle: string;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  coins,
  robloxUsername,
  telegramUsername,
  soundEnabled,
  hapticsEnabled,
  onToggleSound,
  onToggleHaptics,
  onOpenProfile,
  onOpenClaim,
  selectedTitle,
}) => {
  const currentRobux = (coins / COINS_PER_ROBUX).toFixed(2);
  const formattedCoins = new Intl.NumberFormat('en-US').format(Math.floor(coins));

  // Determine user's current league
  const currentLeague = LEAGUES.slice().reverse().find(l => coins >= l.minCoins) || LEAGUES[0];

  return (
    <header className="w-full max-w-lg mx-auto pt-3 px-3.5 pb-2 flex flex-col gap-2.5 z-20">
      {/* Top User Status & Quick Controls */}
      <div className="flex items-center justify-between px-1">
        {/* User profile trigger */}
        <button
          onClick={() => {
            triggerHaptic('light', hapticsEnabled);
            onOpenProfile();
          }}
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 active:scale-95 transition-all text-left group"
        >
          <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs text-white">
            <User className="w-3.5 h-3.5 text-zinc-300" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-semibold text-zinc-100 flex items-center gap-1">
              {robloxUsername || telegramUsername || 'Miner_01'}
              <ShieldCheck className="w-3 h-3 text-white" />
            </span>
            <span className="text-[9px] text-zinc-400 font-medium">
              {selectedTitle || currentLeague.name}
            </span>
          </div>
        </button>

        {/* Audio & Haptic Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              triggerHaptic('light', hapticsEnabled);
              onToggleSound();
            }}
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            aria-label="Toggle Sound"
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
              soundEnabled
                ? 'bg-zinc-900 border-zinc-700 text-white'
                : 'bg-black/60 border-zinc-800 text-zinc-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium', true);
              onToggleHaptics();
            }}
            title={hapticsEnabled ? 'Disable Haptics' : 'Enable Haptics'}
            aria-label="Toggle Haptics"
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
              hapticsEnabled
                ? 'bg-zinc-900 border-zinc-700 text-white'
                : 'bg-black/60 border-zinc-800 text-zinc-600'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ROUND TYPE BANNER BAR - Show Collected Coins and 1000 = 1 ROBLOX */}
      <div className="relative w-full rounded-3xl p-[1.5px] bg-gradient-to-r from-zinc-700 via-white to-zinc-700 shadow-[0_8px_30px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Ambient background blur inside */}
        <div className="relative w-full rounded-[22px] bg-zinc-950/95 backdrop-blur-xl px-5 py-3.5 flex flex-col items-center justify-center text-center">
          {/* Subtle shine sweep */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[22px]">
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shine" />
          </div>

          {/* Rate conversion badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 bg-zinc-900/90 border border-zinc-800/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              1,000 COINS = 1 ROBUX (R$)
            </span>
          </div>

          {/* Bold Poppins Coin Counter */}
          <div className="flex items-center justify-center gap-2.5 my-0.5">
            <RobloxLogoSvg size={28} glow={false} />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Poppins'] tabular-nums drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              {formattedCoins}
            </h1>
            <span className="text-xs font-semibold text-zinc-400 tracking-wider self-end mb-1">
              COINS
            </span>
          </div>

          {/* Conversion Equivalent Bar & Claim Button */}
          <div className="w-full mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400 text-[11px] font-medium">Robux Value:</span>
              <span className="font-bold text-white font-['Space_Grotesk'] text-sm tracking-wide bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span className="text-[11px] text-zinc-400">R$</span> {currentRobux}
              </span>
            </div>

            <button
              onClick={() => {
                triggerHaptic('medium', hapticsEnabled);
                onOpenClaim();
              }}
              className="px-3.5 py-1 rounded-full bg-white text-black font-bold text-xs hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center gap-1"
            >
              <span>Claim R$</span>
              <span className="text-[10px]">→</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
