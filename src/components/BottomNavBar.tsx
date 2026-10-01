import React from 'react';
import { Pickaxe, Zap, Gift, ListTodo, Trophy, Users } from 'lucide-react';
import { RobloxLogoSvg } from './RobloxLogoSvg';
import { triggerHaptic } from '../utils/audio';

export type TabType = 'mine' | 'boosts' | 'claim' | 'quests' | 'ranks' | 'friends';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hapticsEnabled: boolean;
  unclaimedQuestsCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  hapticsEnabled,
  unclaimedQuestsCount,
}) => {
  const tabs = [
    { id: 'mine' as TabType, label: 'Mine', icon: Pickaxe },
    { id: 'boosts' as TabType, label: 'Upgrades', icon: Zap },
    { id: 'claim' as TabType, label: 'Claim R$', icon: Gift, isHighlight: true },
    { id: 'quests' as TabType, label: 'Quests', icon: ListTodo, badge: unclaimedQuestsCount },
    { id: 'ranks' as TabType, label: 'Ranks', icon: Trophy },
    { id: 'friends' as TabType, label: 'Friends', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/90 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-lg mx-auto grid grid-cols-6 items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light', hapticsEnabled);
                onTabChange(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 min-h-[44px] ${
                isActive
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {/* Highlight special style for Claim R$ button */}
              {tab.isHighlight ? (
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.6)]'
                      : 'bg-zinc-900 border border-zinc-700 text-white'
                  }`}
                >
                  <RobloxLogoSvg size={18} glow={false} />
                </div>
              ) : (
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'
                    }`}
                  />
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-white text-black font-bold text-[9px] flex items-center justify-center shadow-sm">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
              )}

              <span
                className={`text-[10px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-white font-bold' : 'text-zinc-500'
                }`}
              >
                {tab.label}
              </span>

              {isActive && !tab.isHighlight && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
