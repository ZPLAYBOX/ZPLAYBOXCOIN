import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RobloxLogoSvg } from './RobloxLogoSvg';
import { sound, triggerHaptic } from '../utils/audio';
import { Sparkles, Zap, Flame } from 'lucide-react';

interface TapFloater {
  id: number;
  x: number;
  y: number;
  value: number;
  isCrit: boolean;
}

interface RobloxTapCoinProps {
  multitapLevel: number;
  critChanceLevel: number;
  energy: number;
  maxEnergy: number;
  isFrenzyActive: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onTapSuccess: (amount: number, energyUsed: number) => void;
  onOpenTurboBoost?: () => void;
}

export const RobloxTapCoin: React.FC<RobloxTapCoinProps> = ({
  multitapLevel,
  critChanceLevel,
  energy,
  isFrenzyActive,
  soundEnabled,
  hapticsEnabled,
  onTapSuccess,
}) => {
  const [floaters, setFloaters] = useState<TapFloater[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0, scale: 1 });
  const [combo, setCombo] = useState<number>(1.0);
  const [tapStreak, setTapStreak] = useState<number>(0);
  const coinContainerRef = useRef<HTMLDivElement>(null);
  const comboTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear floaters after animation
  useEffect(() => {
    if (floaters.length === 0) return;
    const timer = setTimeout(() => {
      setFloaters((prev) => prev.slice(Math.max(0, prev.length - 20)));
    }, 900);
    return () => clearTimeout(timer);
  }, [floaters]);

  // Combo decay
  useEffect(() => {
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(1.0);
      setTapStreak(0);
    }, 1800);
    return () => {
      if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    };
  }, [tapStreak]);

  const handleTapCoord = useCallback(
    (clientX: number, clientY: number) => {
      const effectiveMultitap = multitapLevel;
      const energyNeeded = isFrenzyActive ? 0 : effectiveMultitap;

      if (energy < energyNeeded && energy <= 0 && !isFrenzyActive) {
        // Out of energy shake
        triggerHaptic('heavy', hapticsEnabled);
        setTilt({ x: (Math.random() - 0.5) * 15, y: (Math.random() - 0.5) * 15, scale: 0.95 });
        setTimeout(() => setTilt({ x: 0, y: 0, scale: 1 }), 120);
        return;
      }

      // Calculate critical strike
      const critChance = critChanceLevel * 4; // 4% per level
      const isCrit = Math.random() * 100 < critChance;
      const critMultiplier = isCrit ? 10 : 1;

      // Update combo
      const newStreak = tapStreak + 1;
      setTapStreak(newStreak);
      let newCombo = 1.0;
      if (newStreak >= 40) newCombo = 2.5;
      else if (newStreak >= 25) newCombo = 2.0;
      else if (newStreak >= 15) newCombo = 1.5;
      else if (newStreak >= 5) newCombo = 1.2;

      if (isFrenzyActive) {
        newCombo *= 2.0;
      }
      setCombo(newCombo);

      const baseAmount = effectiveMultitap * critMultiplier;
      const earnedCoins = Math.round(baseAmount * newCombo);
      const actualEnergyUsed = isFrenzyActive ? 0 : Math.min(energy, effectiveMultitap);

      // Trigger Audio & Haptic
      if (isCrit) {
        sound.playCrit(soundEnabled);
        triggerHaptic('heavy', hapticsEnabled);
      } else {
        sound.playTap(newCombo, soundEnabled);
        triggerHaptic('light', hapticsEnabled);
      }

      // Compute relative coordinate for floater
      let relX = clientX;
      let relY = clientY;
      if (coinContainerRef.current) {
        const rect = coinContainerRef.current.getBoundingClientRect();
        relX = clientX - rect.left;
        relY = clientY - rect.top;

        // Calculate 3D tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltY = ((relX - centerX) / centerX) * 18;
        const tiltX = -((relY - centerY) / centerY) * 18;

        setTilt({ x: tiltX, y: tiltY, scale: 0.96 });
        setTimeout(() => {
          setTilt({ x: 0, y: 0, scale: 1 });
        }, 90);
      }

      // Add floating number
      const floaterId = Date.now() + Math.random();
      setFloaters((prev) => [
        ...prev,
        {
          id: floaterId,
          x: relX + (Math.random() * 20 - 10),
          y: relY + (Math.random() * 20 - 10),
          value: earnedCoins,
          isCrit,
        },
      ]);

      onTapSuccess(earnedCoins, actualEnergyUsed);
    },
    [
      multitapLevel,
      critChanceLevel,
      energy,
      isFrenzyActive,
      tapStreak,
      soundEnabled,
      hapticsEnabled,
      onTapSuccess,
    ]
  );

  // Multi-touch handler for mobile touch screens
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      handleTapCoord(touch.clientX, touch.clientY);
    }
  };

  // Mouse click fallback for desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    handleTapCoord(e.clientX, e.clientY);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center my-auto py-2 select-none">
      {/* Dynamic Combo & Streak Indicator */}
      <div className="h-9 flex items-center justify-center mb-1">
        {tapStreak >= 5 ? (
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all transform animate-bounce ${
              isFrenzyActive || combo >= 2.0
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.6)]'
                : 'bg-zinc-900 border border-zinc-700 text-zinc-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="font-['Space_Grotesk'] tracking-wider">
              {combo.toFixed(1)}x {isFrenzyActive ? 'FRENZY RUSH' : 'STREAK COMBO'}
            </span>
            <span className="text-[10px] opacity-75 font-mono">({tapStreak} taps)</span>
          </div>
        ) : isFrenzyActive ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FRENZY ACTIVE (2x BOOST)</span>
          </div>
        ) : (
          <p className="text-zinc-500 text-xs font-medium tracking-wide">
            Tap Roblox Coin to mine coins
          </p>
        )}
      </div>

      {/* Main Interactive Roblox Coin */}
      <div
        ref={coinContainerRef}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        style={{
          transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.scale})`,
          transition: 'transform 0.08s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative w-64 h-64 sm:w-72 sm:h-72 cursor-pointer flex items-center justify-center touch-manipulation active:cursor-grabbing"
      >
        {/* Outer ambient glow rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 via-zinc-800/20 to-white/5 blur-2xl pointer-events-none" />
        
        {/* Outer Orbit Ring with subtle pulse */}
        <div className="absolute inset-2 rounded-full border border-zinc-800/80 border-dashed pointer-events-none animate-spin [animation-duration:35s]" />
        
        <div className="absolute inset-6 rounded-full border border-white/10 pointer-events-none" />

        {/* Central 3D Roblox Coin Body */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-zinc-800 via-zinc-950 to-black p-2 border-2 border-zinc-600/80 shadow-[0_20px_50px_rgba(0,0,0,0.95)] flex items-center justify-center group">
          {/* Internal reflective ring */}
          <div className="absolute inset-1.5 rounded-full border border-white/20 pointer-events-none" />
          <div className="absolute inset-3 rounded-full bg-radial from-zinc-800/60 to-transparent pointer-events-none" />

          {/* Roblox 3D Emblem in the center */}
          <div className="relative z-10 transform transition-transform group-hover:scale-105 duration-200">
            <RobloxLogoSvg size={140} glow={true} />
          </div>

          {/* Coin Inner Bevel Rim Text */}
          <div className="absolute bottom-2 text-[9px] uppercase tracking-[0.25em] text-zinc-500 font-bold font-mono">
            ROBLOX MINER
          </div>
        </div>

        {/* Floating Tap Particles (+1, +2, CRIT!) */}
        {floaters.map((f) => (
          <div
            key={f.id}
            style={{ left: f.x, top: f.y }}
            className="absolute pointer-events-none select-none z-30"
          >
            <div
              className={`font-['Poppins'] font-black transform -translate-x-1/2 -translate-y-1/2 animate-[float-up_0.9s_ease-out_forwards] flex items-center gap-1 ${
                f.isCrit
                  ? 'text-white text-2xl drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] scale-125'
                  : 'text-zinc-100 text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
              }`}
            >
              {f.isCrit && <Sparkles className="w-4 h-4 text-white inline fill-current" />}
              <span>+{f.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tap Rate Multiplier Info */}
      <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-zinc-300" />
          <span>+{multitapLevel} per tap</span>
        </span>
        <span className="text-zinc-700">·</span>
        <span className="text-zinc-400">
          {critChanceLevel > 0 ? `${critChanceLevel * 4}% Crit Chance` : 'Multi-touch enabled'}
        </span>
      </div>
    </div>
  );
};
