import { Quest, UpgradeItem, LeaderboardUser } from '../types/game';

export const COINS_PER_ROBUX = 1000;

export interface League {
  name: string;
  minCoins: number;
  multiplier: number;
  badge: string;
  color: string;
}

export const LEAGUES: League[] = [
  { name: 'Bronze Miner', minCoins: 0, multiplier: 1.0, badge: '🧱', color: '#a1a1aa' },
  { name: 'Silver Builder', minCoins: 10000, multiplier: 1.2, badge: '⚙️', color: '#e4e4e7' },
  { name: 'Gold Tycoon', minCoins: 50000, multiplier: 1.5, badge: '🪙', color: '#fafafa' },
  { name: 'Platinum Bloxer', minCoins: 200000, multiplier: 2.0, badge: '💎', color: '#ffffff' },
  { name: 'Diamond Master', minCoins: 1000000, multiplier: 3.0, badge: '👑', color: '#ffffff' },
  { name: 'Roblox Overlord', minCoins: 5000000, multiplier: 5.0, badge: '🌌', color: '#ffffff' },
];

export const INITIAL_UPGRADES: UpgradeItem[] = [
  {
    id: 'multitap',
    name: 'Multi-Tap Pickaxe',
    description: 'Increases coins mined per tap',
    category: 'tap',
    level: 1,
    baseCost: 100,
    costMultiplier: 1.7,
    currentBenefit: 1,
    benefitPerLevel: 1,
    benefitUnit: 'coins/tap',
    iconName: 'Pickaxe',
  },
  {
    id: 'energy_tank',
    name: 'Obsidian Capacitor',
    description: 'Expands your maximum energy storage capacity',
    category: 'energy',
    level: 1,
    baseCost: 200,
    costMultiplier: 1.6,
    currentBenefit: 1000,
    benefitPerLevel: 500,
    benefitUnit: 'max energy',
    iconName: 'BatteryCharging',
  },
  {
    id: 'energy_regen',
    name: 'Kinetic Dynamo',
    description: 'Accelerates energy replenishment rate',
    category: 'energy',
    level: 1,
    baseCost: 400,
    costMultiplier: 1.8,
    currentBenefit: 3,
    benefitPerLevel: 2,
    benefitUnit: 'energy/sec',
    iconName: 'Zap',
  },
  {
    id: 'auto_miner',
    name: 'Autonomous Roblox Bot',
    description: 'Mines coins automatically around the clock',
    category: 'passive',
    level: 0,
    baseCost: 1000,
    costMultiplier: 1.75,
    currentBenefit: 0,
    benefitPerLevel: 5,
    benefitUnit: 'coins/sec',
    iconName: 'Bot',
  },
  {
    id: 'crit_chance',
    name: 'Critical Overcharge',
    description: 'Chance to strike 10x critical Robux coin explosion',
    category: 'luck',
    level: 0,
    baseCost: 2500,
    costMultiplier: 2.0,
    currentBenefit: 0,
    benefitPerLevel: 4,
    benefitUnit: '% crit chance',
    iconName: 'Sparkles',
  },
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'tg_channel',
    title: 'Join Official Telegram Channel',
    description: 'Stay updated with exclusive Robux drop codes and announcements.',
    rewardCoins: 5000,
    rewardRobux: 5,
    type: 'telegram',
    link: 'https://t.me/BloxMineOfficial',
    currentProgress: 0,
    targetProgress: 1,
    isCompleted: false,
    isClaimed: false,
    icon: 'Send',
  },
  {
    id: 'roblox_link',
    title: 'Link Roblox Username',
    description: 'Set your Roblox profile username for fast automatic withdrawals.',
    rewardCoins: 3000,
    rewardRobux: 3,
    type: 'social',
    currentProgress: 0,
    targetProgress: 1,
    isCompleted: false,
    isClaimed: false,
    icon: 'UserCheck',
  },
  {
    id: 'mine_500_taps',
    title: 'Warm-Up Miner',
    description: 'Tap the Roblox coin 500 times to break in your drill.',
    rewardCoins: 2500,
    rewardRobux: 2,
    type: 'milestone',
    currentProgress: 0,
    targetProgress: 500,
    isCompleted: false,
    isClaimed: false,
    icon: 'Target',
  },
  {
    id: 'mine_5000_taps',
    title: 'Blox Hammer Master',
    description: 'Reach a milestone of 5,000 total taps.',
    rewardCoins: 15000,
    rewardRobux: 15,
    type: 'milestone',
    currentProgress: 0,
    targetProgress: 5000,
    isCompleted: false,
    isClaimed: false,
    icon: 'Flame',
  },
  {
    id: 'tg_invite',
    title: 'Share With 3 Friends',
    description: 'Invite 3 gaming buddies to mine Roblox coins together.',
    rewardCoins: 10000,
    rewardRobux: 10,
    type: 'telegram',
    link: 'https://t.me/share/url?url=https://t.me/BloxMineBot&text=Join%20me%20on%20BloxMine%20to%20mine%20coins%20and%20claim%20real%20Roblox%20Robux!',
    currentProgress: 0,
    targetProgress: 3,
    isCompleted: false,
    isClaimed: false,
    icon: 'Users',
  },
  {
    id: 'first_claim',
    title: 'Initiate First Robux Claim',
    description: 'Convert at least 10,000 coins into your first 10 R$ voucher.',
    rewardCoins: 5000,
    rewardRobux: 5,
    type: 'milestone',
    currentProgress: 0,
    targetProgress: 1,
    isCompleted: false,
    isClaimed: false,
    icon: 'Gift',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, username: 'Valkyrie_Legend', robloxUsername: 'ValkyrieKing_RBX', avatarSeed: '1', coinsMined: 14820000, robuxClaimed: 14820, tier: 'Roblox Overlord' },
  { rank: 2, username: 'Dominus_Lord', robloxUsername: 'DominusShadow99', avatarSeed: '2', coinsMined: 9430000, robuxClaimed: 9430, tier: 'Roblox Overlord' },
  { rank: 3, username: 'PixelBlox_Pro', robloxUsername: 'PixelBuilder2026', avatarSeed: '3', coinsMined: 6210000, robuxClaimed: 6210, tier: 'Diamond Master' },
  { rank: 4, username: 'CryptoMiner_TG', robloxUsername: 'AlexBloxReal', avatarSeed: '4', coinsMined: 4100000, robuxClaimed: 4100, tier: 'Platinum Bloxer' },
  { rank: 5, username: 'NoobToPro_YT', robloxUsername: 'NoobTycoon01', avatarSeed: '5', coinsMined: 3250000, robuxClaimed: 3250, tier: 'Platinum Bloxer' },
  { rank: 6, username: 'BloxQueen_X', robloxUsername: 'BloxStar_Mia', avatarSeed: '6', coinsMined: 1890000, robuxClaimed: 1890, tier: 'Gold Tycoon' },
  { rank: 7, username: 'TurboClicker', robloxUsername: 'TurboMax99', avatarSeed: '7', coinsMined: 1120000, robuxClaimed: 1120, tier: 'Gold Tycoon' },
  { rank: 8, username: 'SpeedyRobux', robloxUsername: 'FastClaimer_RBX', avatarSeed: '8', coinsMined: 740000, robuxClaimed: 740, tier: 'Silver Builder' },
];

export const AVATAR_PRESETS = [
  { id: 0, name: 'Obsidian Dominus', badge: '🖤', svgColor: '#18181b', stroke: '#ffffff' },
  { id: 1, name: 'Chrome Valkyrie', badge: '🤍', svgColor: '#27272a', stroke: '#e4e4e7' },
  { id: 2, name: 'Ghost Headless', badge: '👤', svgColor: '#09090b', stroke: '#a1a1aa' },
  { id: 3, name: 'Cyber Bloxer', badge: '🤖', svgColor: '#18181b', stroke: '#d4d4d8' },
  { id: 4, name: 'Valkyrie Helm', badge: '👑', svgColor: '#27272a', stroke: '#ffffff' },
  { id: 5, name: 'Stealth Ninja', badge: '🥷', svgColor: '#09090b', stroke: '#71717a' },
];

export const TITLES = [
  'Blox Rookie',
  'Robux Apprentice',
  'Coin Clicker',
  'Speed Miner',
  'Blox Tycoon',
  'VIP Developer',
  'Valkyrie Master',
  'Dominus Overlord',
];
