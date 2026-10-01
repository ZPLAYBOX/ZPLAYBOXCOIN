import React, { useState } from 'react';
import { RobloxLogoSvg } from './RobloxLogoSvg';
import { triggerHaptic } from '../utils/audio';
import { Users, Copy, Check, Send, Award, Gift } from 'lucide-react';

interface FriendsPanelProps {
  robloxUsername: string;
  telegramUsername: string;
  hapticsEnabled: boolean;
  onInviteFriend: () => void;
}

export const FriendsPanel: React.FC<FriendsPanelProps> = ({
  robloxUsername,
  telegramUsername,
  hapticsEnabled,
  onInviteFriend,
}) => {
  const [copied, setCopied] = useState(false);
  const refCode = (robloxUsername || telegramUsername || 'miner').toLowerCase().replace(/[^a-z0-9]/g, '');
  const referralLink = `https://t.me/BloxMineBot?start=ref_${refCode}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    triggerHaptic('light', hapticsEnabled);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTelegram = () => {
    triggerHaptic('medium', hapticsEnabled);
    const shareText = encodeURIComponent(
      `🎮 Join me on BloxMine! Tap the Roblox coin, mine coins, and claim real Robux (1,000 Coins = 1 R$). Start with +2,500 bonus coins!`
    );
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${shareText}`;

    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(tgUrl);
    } else {
      window.open(tgUrl, '_blank');
    }
    onInviteFriend();
  };

  // Mock list of active referred friends
  const referredFriends = [
    { username: 'RobloxGamer_Dan', coinsEarned: 14200, status: 'Active' },
    { username: 'BloxMiner_99', coinsEarned: 8900, status: 'Active' },
    { username: 'ShadowBuilder_RBX', coinsEarned: 24500, status: 'Mining' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto pb-24 px-4 space-y-4 select-none">
      {/* Invite Friends Hero */}
      <div className="p-4 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-3.5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 mx-auto flex items-center justify-center text-white shadow-lg">
          <Users className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-base font-bold text-white font-['Poppins']">
            Invite Friends & Earn Robux
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            Get <strong className="text-white">+2,500 Coins</strong> for each friend +{' '}
            <strong className="text-white">10% commission</strong> from all coins they mine!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <button
            onClick={handleShareTelegram}
            className="flex-1 py-3 px-4 rounded-xl bg-white text-black font-bold text-xs hover:bg-zinc-200 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span>Invite via Telegram</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </div>

      {/* Rewards Tier info */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-white" />
            <span>Instant Bonus</span>
          </div>
          <div className="text-base font-bold text-white font-mono">
            +2,500 Coins
          </div>
          <p className="text-[10px] text-zinc-500">Credited on friend start</p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-white" />
            <span>Passive Bonus</span>
          </div>
          <div className="text-base font-bold text-white font-mono">
            10% of Mined Coins
          </div>
          <p className="text-[10px] text-zinc-500">Auto-credited lifetime</p>
        </div>
      </div>

      {/* Referred Friends List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Your Squad ({referredFriends.length})
          </h3>
          <span className="text-[11px] text-zinc-500 font-mono">
            Total Earned: 47,600 coins
          </span>
        </div>

        <div className="space-y-2">
          {referredFriends.map((f, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white">
                  {f.username[0]}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    @{f.username}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    {f.status}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-white font-mono block">
                  +{f.coinsEarned.toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-500">Commission</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
