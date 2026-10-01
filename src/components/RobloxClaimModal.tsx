import React, { useState } from 'react';
import { RobloxLogoSvg } from './RobloxLogoSvg';
import { COINS_PER_ROBUX } from '../utils/constants';
import { ClaimOrder } from '../types/game';
import { sound, triggerHaptic, triggerNotificationHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Copy,
  Gift,
  History,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface RobloxClaimModalProps {
  coins: number;
  robloxUsername: string;
  claimHistory: ClaimOrder[];
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onClose: () => void;
  onConfirmClaim: (order: ClaimOrder) => void;
  onUpdateRobloxUsername: (name: string) => void;
}

const ROBUX_PACKAGES = [
  { robux: 10, coins: 10000, tag: 'Starter' },
  { robux: 25, coins: 25000, tag: 'Popular' },
  { robux: 50, coins: 50000, tag: 'Value' },
  { robux: 100, coins: 100000, tag: 'Pro' },
  { robux: 250, coins: 250000, tag: 'Elite' },
  { robux: 500, coins: 500000, tag: 'Tycoon' },
  { robux: 1000, coins: 1000000, tag: 'Overlord' },
];

export const RobloxClaimModal: React.FC<RobloxClaimModalProps> = ({
  coins,
  robloxUsername,
  claimHistory,
  soundEnabled,
  hapticsEnabled,
  onClose,
  onConfirmClaim,
  onUpdateRobloxUsername,
}) => {
  const [activeTab, setActiveTab] = useState<'claim' | 'history'>('claim');
  const [selectedPackage, setSelectedPackage] = useState(ROBUX_PACKAGES[0]);
  const [usernameInput, setUsernameInput] = useState(robloxUsername || '');
  const [claimMethod, setClaimMethod] = useState<'gift_code' | 'group_payout' | 'gamepass'>('gift_code');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [latestClaim, setLatestClaim] = useState<ClaimOrder | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const canAfford = coins >= selectedPackage.coins;

  const handleStartClaim = async () => {
    if (!usernameInput.trim()) {
      alert('Please enter your Roblox Username');
      return;
    }
    if (!canAfford) {
      alert(`You need ${new Intl.NumberFormat().format(selectedPackage.coins)} coins to claim ${selectedPackage.robux} R$.`);
      return;
    }

    onUpdateRobloxUsername(usernameInput.trim());
    setIsProcessing(true);
    triggerHaptic('medium', hapticsEnabled);

    // Simulated multi-step Roblox API validation
    setProcessingStep('Connecting to Roblox User Service...');
    await new Promise((r) => setTimeout(r, 700));

    setProcessingStep(`Verifying account "${usernameInput.trim()}"...`);
    await new Promise((r) => setTimeout(r, 700));

    setProcessingStep('Generating Robux cryptographic voucher token...');
    await new Promise((r) => setTimeout(r, 800));

    // Generate simulated gift code
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomHex2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedCode = `RBX-${selectedPackage.robux}-${randomHex}-${randomHex2}`;

    const newOrder: ClaimOrder = {
      id: `CLM-${Date.now()}`,
      timestamp: Date.now(),
      robloxUsername: usernameInput.trim(),
      robuxAmount: selectedPackage.robux,
      coinsSpent: selectedPackage.coins,
      status: 'completed',
      claimCode: generatedCode,
      method: claimMethod,
    };

    setIsProcessing(false);
    setLatestClaim(newOrder);
    onConfirmClaim(newOrder);

    // Audio & Confetti
    sound.playClaimSuccess(soundEnabled);
    triggerNotificationHaptic('success', hapticsEnabled);
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#d4d4d8', '#71717a', '#a1a1aa'],
      });
    } catch {}
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    triggerHaptic('light', hapticsEnabled);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <RobloxLogoSvg size={28} glow={false} />
            <div>
              <h2 className="text-base font-bold text-white font-['Poppins']">
                Roblox Reward Claiming
              </h2>
              <p className="text-[11px] text-zinc-400">
                1,000 Coins = 1 R$ (Robux)
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('light', hapticsEnabled);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-zinc-800/80 bg-zinc-900/40 p-1">
          <button
            onClick={() => setActiveTab('claim')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'claim'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Claim Robux</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History ({claimHistory.length})</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {latestClaim ? (
            /* Success Voucher Screen */
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-white mx-auto flex items-center justify-center text-white shadow-[0_0_25px_rgba(255,255,255,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-['Poppins']">
                  Robux Voucher Claimed!
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Successfully converted {latestClaim.coinsSpent.toLocaleString()} Coins to{' '}
                  <span className="text-white font-bold">{latestClaim.robuxAmount} Robux</span>
                </p>
              </div>

              {/* Gift Voucher Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-700 text-left relative overflow-hidden shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-400">
                      OFFICIAL VOUCHER PIN
                    </span>
                    <div className="text-lg font-bold text-white font-mono tracking-wider mt-0.5">
                      {latestClaim.claimCode}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyCode(latestClaim.claimCode)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-xs font-medium text-white flex items-center gap-1 active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Copied!' : 'Copy PIN'}</span>
                  </button>
                </div>

                <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Recipient: <strong className="text-white">@{latestClaim.robloxUsername}</strong></span>
                  <span>Amount: <strong className="text-white">{latestClaim.robuxAmount} R$</strong></span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-left text-xs text-zinc-300 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>How to Redeem in Roblox:</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  1. Visit <strong className="text-zinc-200">roblox.com/redeem</strong> on browser.
                </p>
                <p className="text-[11px] text-zinc-400">
                  2. Paste your exclusive Voucher PIN and click <strong>Redeem</strong>.
                </p>
                <p className="text-[11px] text-zinc-400">
                  3. Robux will be credited instantly to your account balance.
                </p>
              </div>

              <button
                onClick={() => setLatestClaim(null)}
                className="w-full py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 active:scale-98 transition-all"
              >
                Claim Another Reward
              </button>
            </div>
          ) : activeTab === 'claim' ? (
            /* Claim Flow Form */
            <>
              {/* Roblox Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Roblox Username</span>
                  <span className="text-[10px] text-zinc-500 font-normal">
                    Where Robux will be credited
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter your Roblox username (e.g., BloxGamer99)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                  />
                  {usernameInput && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Selection Grid */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300">
                  Select Robux Package
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ROBUX_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackage.robux === pkg.robux;
                    const canBuy = coins >= pkg.coins;
                    return (
                      <button
                        key={pkg.robux}
                        onClick={() => {
                          triggerHaptic('light', hapticsEnabled);
                          setSelectedPackage(pkg);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                          isSelected
                            ? 'bg-zinc-900 border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                            : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                        } ${!canBuy ? 'opacity-55' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold font-['Space_Grotesk'] text-white text-base">
                            <RobloxLogoSvg size={18} glow={false} />
                            <span>{pkg.robux} R$</span>
                          </div>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {pkg.tag}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-1 font-mono">
                          {pkg.coins.toLocaleString()} coins
                        </div>
                        {isSelected && (
                          <div className="absolute bottom-0 right-0 left-0 h-0.5 bg-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Withdrawal Method Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  Payout Method
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setClaimMethod('gift_code')}
                    className={`p-2 rounded-xl border text-center text-[10px] font-semibold transition-all ${
                      claimMethod === 'gift_code'
                        ? 'bg-zinc-800 border-white text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    🎟️ Digital PIN
                  </button>
                  <button
                    onClick={() => setClaimMethod('group_payout')}
                    className={`p-2 rounded-xl border text-center text-[10px] font-semibold transition-all ${
                      claimMethod === 'group_payout'
                        ? 'bg-zinc-800 border-white text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    👑 Group Funds
                  </button>
                  <button
                    onClick={() => setClaimMethod('gamepass')}
                    className={`p-2 rounded-xl border text-center text-[10px] font-semibold transition-all ${
                      claimMethod === 'gamepass'
                        ? 'bg-zinc-800 border-white text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                    }`}
                  >
                    🛍️ VIP Gamepass
                  </button>
                </div>
              </div>

              {/* Summary Box */}
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-zinc-400 block text-[10px]">Your Current Balance</span>
                  <span className="font-bold text-white font-mono text-sm">
                    {Math.floor(coins).toLocaleString()} Coins
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 block text-[10px]">Exchange Rate</span>
                  <span className="font-bold text-white text-xs">1,000 Coins = 1 R$</span>
                </div>
              </div>

              {/* Primary Claim CTA */}
              <button
                disabled={!canAfford || isProcessing}
                onClick={handleStartClaim}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  canAfford && !isProcessing
                    ? 'bg-white text-black hover:bg-zinc-200 active:scale-98 shadow-white/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>{processingStep}</span>
                  </div>
                ) : canAfford ? (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>
                      Claim {selectedPackage.robux} Robux (Costs{' '}
                      {selectedPackage.coins.toLocaleString()} Coins)
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <span>
                    Need {(selectedPackage.coins - coins).toLocaleString()} More Coins
                  </span>
                )}
              </button>
            </>
          ) : (
            /* History Tab */
            <div className="space-y-2.5">
              {claimHistory.length === 0 ? (
                <div className="text-center py-10 text-zinc-500">
                  <Gift className="w-10 h-10 mx-auto opacity-30 mb-2" />
                  <p className="text-sm font-semibold">No Claims Yet</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Mine coins and exchange them for Robux codes!
                  </p>
                </div>
              ) : (
                claimHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <RobloxLogoSvg size={16} glow={false} />
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm">
                            +{item.robuxAmount} R$ Robux
                          </span>
                          <span className="text-[10px] text-zinc-400 block">
                            @{item.robloxUsername}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
                        {item.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-black border border-zinc-800 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-zinc-300">
                        {item.claimCode}
                      </span>
                      <button
                        onClick={() => handleCopyCode(item.claimCode)}
                        className="text-[10px] font-bold text-white hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                      <span>Spent: {item.coinsSpent.toLocaleString()} coins</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
