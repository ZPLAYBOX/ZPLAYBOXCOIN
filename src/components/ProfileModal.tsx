import React, { useState } from 'react';
import { AVATAR_PRESETS, TITLES } from '../utils/constants';
import { RobloxLogoSvg } from './RobloxLogoSvg';
import { triggerHaptic } from '../utils/audio';
import {
  X,
  User,
  ShieldCheck,
  Award,
  Volume2,
  VolumeX,
  Smartphone,
  Trash2,
  Check,
  Flame,
  Zap,
} from 'lucide-react';

interface ProfileModalProps {
  robloxUsername: string;
  telegramUsername: string;
  selectedTitle: string;
  selectedAvatarIndex: number;
  totalCoinsMined: number;
  totalRobuxClaimed: number;
  totalTaps: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onClose: () => void;
  onSaveProfile: (updates: {
    robloxUsername: string;
    selectedTitle: string;
    selectedAvatarIndex: number;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
  }) => void;
  onResetGame: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  robloxUsername,
  telegramUsername,
  selectedTitle,
  selectedAvatarIndex,
  totalCoinsMined,
  totalRobuxClaimed,
  totalTaps,
  soundEnabled,
  hapticsEnabled,
  onClose,
  onSaveProfile,
  onResetGame,
}) => {
  const [username, setUsername] = useState(robloxUsername || '');
  const [title, setTitle] = useState(selectedTitle || TITLES[0]);
  const [avatarIdx, setAvatarIdx] = useState(selectedAvatarIndex || 0);
  const [soundState, setSoundState] = useState(soundEnabled);
  const [hapticState, setHapticState] = useState(hapticsEnabled);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    triggerHaptic('medium', hapticState);
    onSaveProfile({
      robloxUsername: username.trim(),
      selectedTitle: title,
      selectedAvatarIndex: avatarIdx,
      soundEnabled: soundState,
      hapticsEnabled: hapticState,
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 600);
  };

  const selectedPreset = AVATAR_PRESETS[avatarIdx] || AVATAR_PRESETS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Poppins']">
                Roblox Virtual Profile
              </h2>
              <p className="text-[11px] text-zinc-400">
                Customize avatar, titles and mining identity
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light', hapticState);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Avatar & Badge Showcase */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-20 h-20 rounded-2xl bg-zinc-900 border-2 border-zinc-600 flex items-center justify-center text-3xl shadow-inner relative">
              <span>{selectedPreset.badge}</span>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-['Poppins']">
                {username || telegramUsername || 'Miner_01'}
              </h3>
              <span className="text-xs text-zinc-400 font-mono">
                {title}
              </span>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block uppercase">Total Mined</span>
              <span className="text-xs font-bold text-white font-mono">
                {Math.floor(totalCoinsMined).toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block uppercase">Claimed R$</span>
              <span className="text-xs font-bold text-white font-mono">
                {totalRobuxClaimed} R$
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block uppercase">Total Taps</span>
              <span className="text-xs font-bold text-white font-mono">
                {totalTaps.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Roblox Username Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Roblox Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Builderman99"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Avatar Style Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Roblox Avatar Insignia
            </label>
            <div className="grid grid-cols-3 gap-2">
              {AVATAR_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    triggerHaptic('light', hapticState);
                    setAvatarIdx(p.id);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    avatarIdx === p.id
                      ? 'bg-zinc-800 border-white text-white shadow-sm'
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-400'
                  }`}
                >
                  <span className="text-xl">{p.badge}</span>
                  <span className="text-[10px] font-semibold truncate w-full">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              Miner Title
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {TITLES.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    triggerHaptic('light', hapticState);
                    setTitle(t);
                  }}
                  className={`p-2 rounded-xl border text-left text-[11px] font-medium transition-all ${
                    title === t
                      ? 'bg-zinc-800 border-white text-white'
                      : 'bg-zinc-900/50 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Audio & Haptic Toggles */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-300 flex items-center gap-2">
                {soundState ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
                Sound Effects
              </span>
              <button
                onClick={() => setSoundState(!soundState)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  soundState ? 'bg-white' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-black transition-transform ${
                    soundState ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-300 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-white" />
                Telegram Tactile Haptics
              </span>
              <button
                onClick={() => setHapticState(!hapticState)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  hapticState ? 'bg-white' : 'bg-zinc-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-black transition-transform ${
                    hapticState ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-zinc-800/80">
            <button
              onClick={() => {
                if (confirm('Reset your mining progress and start fresh?')) {
                  onResetGame();
                  onClose();
                }
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Game Data (Restart)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-md"
          >
            {savedMessage ? <Check className="w-4 h-4" /> : null}
            <span>{savedMessage ? 'Profile Saved!' : 'Save & Update Profile'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
