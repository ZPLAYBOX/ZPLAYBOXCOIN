import React, { useState } from 'react';
import { LeaderboardUser } from '../types/game';
import { RobloxLogoSvg } from './RobloxLogoSvg';
import { Trophy, Medal, Crown, Flame, Shield } from 'lucide-react';

interface LeaderboardPanelProps {
  users: LeaderboardUser[];
  userCoins: number;
  userRobuxClaimed: number;
  robloxUsername: string;
}

export const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({
  users,
  userCoins,
  userRobuxClaimed,
  robloxUsername,
}) => {
  const [filter, setFilter] = useState<'all' | 'weekly'>('all');

  // Insert or highlight user in leaderboard
  const sortedUsers = [...users].sort((a, b) => b.coinsMined - a.coinsMined);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shadow-[0_0_12px_rgba(255,255,255,0.7)]">
            <Crown className="w-4 h-4 fill-current" />
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded-full bg-zinc-300 text-black flex items-center justify-center font-bold text-xs">
            2
          </div>
        );
      case 3:
        return (
          <div className="w-7 h-7 rounded-full bg-zinc-400 text-black flex items-center justify-center font-bold text-xs">
            3
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center font-mono text-xs font-semibold">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-24 px-4 space-y-4 select-none">
      {/* Top Pool Prize Banner */}
      <div className="p-4 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <Trophy className="w-5 h-5 text-zinc-100" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-['Poppins']">
                Global Roblox Mining League
              </h2>
              <p className="text-[11px] text-zinc-400">
                Top 10 miners win weekly Robux bonus pool
              </p>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-[10px] text-zinc-500 block uppercase">Weekly Pool</span>
            <span className="text-xs font-bold text-white">100,000 R$</span>
          </div>
        </div>

        {/* Filter Switcher */}
        <div className="flex p-1 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All-Time Masters
          </button>
          <button
            onClick={() => setFilter('weekly')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'weekly'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Weekly Sprint
          </button>
        </div>
      </div>

      {/* User's Own Standings Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-600 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-600 text-white font-bold text-xs flex items-center justify-center">
            #14
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">
                @{robloxUsername || 'You'}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-medium">
                You
              </span>
            </div>
            <span className="text-[10px] text-zinc-400">
              Claimed: {userRobuxClaimed} R$
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 font-bold text-white font-mono text-xs justify-end">
            <RobloxLogoSvg size={12} glow={false} />
            <span>{Math.floor(userCoins).toLocaleString()}</span>
          </div>
          <span className="text-[9px] text-zinc-500">Mined Coins</span>
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1">
          Top Roblox Miners
        </h3>

        <div className="space-y-2">
          {sortedUsers.map((u) => (
            <div
              key={u.rank}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                u.rank === 1
                  ? 'bg-zinc-900/90 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                  : 'bg-zinc-950/80 border-zinc-800/80'
              }`}
            >
              <div className="flex items-center gap-3">
                {getRankBadge(u.rank)}

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate max-w-[140px]">
                      {u.username}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">
                      @{u.robloxUsername}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">
                    {u.tier} · {u.robuxClaimed.toLocaleString()} R$ Claimed
                  </span>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs font-bold text-white block">
                  {u.coinsMined.toLocaleString()}
                </span>
                <span className="text-[9px] text-zinc-500">coins</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
