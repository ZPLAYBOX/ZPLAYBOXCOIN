export interface ClaimOrder {
  id: string;
  timestamp: number;
  robloxUsername: string;
  robuxAmount: number;
  coinsSpent: number;
  status: 'completed' | 'processing' | 'verifying';
  claimCode: string;
  method: 'gift_code' | 'group_payout' | 'gamepass';
}

export interface UpgradeItem {
  id: string;
  name: string;
  description: string;
  category: 'tap' | 'energy' | 'passive' | 'luck';
  level: number;
  baseCost: number;
  costMultiplier: number;
  currentBenefit: number;
  benefitPerLevel: number;
  benefitUnit: string;
  iconName: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardRobux: number;
  type: 'telegram' | 'daily' | 'social' | 'milestone';
  link?: string;
  currentProgress: number;
  targetProgress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  icon: string;
}

export interface DailyStreakDay {
  day: number;
  coins: number;
  robux: number;
  isClaimed: boolean;
  isCurrent: boolean;
}

export interface LeaderboardUser {
  rank: number;
  username: string;
  robloxUsername: string;
  avatarSeed: string;
  coinsMined: number;
  robuxClaimed: number;
  tier: string;
  isCurrentUser?: boolean;
}

export interface GameState {
  coins: number;
  totalCoinsMined: number;
  totalRobuxClaimed: number;
  energy: number;
  maxEnergy: number;
  energyRegenRate: number; // energy per second
  multitapLevel: number;
  autoMinerLevel: number;
  energyTankLevel: number;
  critChanceLevel: number;
  lastActiveTimestamp: number;
  
  // Profile
  robloxUsername: string;
  telegramUsername: string;
  telegramUserId?: string;
  selectedTitle: string;
  selectedAvatarIndex: number;
  
  // Settings
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  
  // Claim history
  claimHistory: ClaimOrder[];
  
  // Quests & Streaks
  completedQuestIds: string[];
  claimedQuestIds: string[];
  dailyStreak: number;
  lastDailyClaimTimestamp: number;
  totalTaps: number;
  
  // Boosters
  turboChargesAvailable: number;
  lastTurboResetTimestamp: number;
}
