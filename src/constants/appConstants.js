import { 
  Flower, Heart, Sparkles, Smile, Gem, CircleDot, Wine, Crown, Car, Zap, 
  Box, Send, Anchor, Shield, Rocket, Flame, Globe, Star 
} from 'lucide-react';

export const PRESET_AVATARS = [
  '',
  '',
  '',
  '',
  '',
  ''
];

export const GIFTS_CATALOG = [
  { id: 'rose', name: 'Red Rose', coins: 10, category: 'Basic', icon: Flower, emoji: '🌹', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'heart', name: 'Red Heart', coins: 50, category: 'Basic', icon: Heart, emoji: '❤️', color: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'kiss', name: 'Magic Sparkles', coins: 100, category: 'Basic', icon: Sparkles, emoji: '✨', color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'teddy', name: 'Warm Smile', coins: 250, category: 'Popular', icon: Smile, emoji: '😊', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'diamond', name: 'Shining Gem', coins: 500, category: 'Luxury', icon: Gem, emoji: '💎', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'ring', name: 'Gold Ring', coins: 1000, category: 'Luxury', icon: CircleDot, emoji: '💍', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'champagne', name: 'Celebration Wine', coins: 1500, category: 'Party', icon: Wine, emoji: '🍷', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'crown', name: 'Royal Crown', coins: 2500, category: 'Royal', icon: Crown, emoji: '👑', color: 'text-amber-300', bg: 'bg-amber-500/20' },
  { id: 'sports_car', name: 'Sports Car', coins: 5000, category: 'VIP', icon: Car, emoji: '🏎️', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'supercar', name: 'VIP Supercar', coins: 8000, category: 'VIP', icon: Zap, emoji: '⚡', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'gold_bar', name: 'Gold Vault', coins: 10000, category: 'Asset', icon: Box, emoji: '📦', color: 'text-yellow-300', bg: 'bg-yellow-500/20' },
  { id: 'jet', name: 'Private Jet', coins: 15000, category: 'VIP', icon: Send, emoji: '🚀', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'yacht', name: 'Luxury Yacht', coins: 20000, category: 'Super VIP', icon: Anchor, emoji: '🛥️', color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { id: 'castle', name: 'Golden Fortress', coins: 25000, category: 'Super VIP', icon: Shield, emoji: '🏰', color: 'text-yellow-500', bg: 'bg-yellow-600/10' },
  { id: 'rocket', name: 'Space Rocket', coins: 30000, category: 'Super VIP', icon: Rocket, emoji: '🚀', color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'fireworks', name: 'VIP Fireworks', coins: 35000, category: 'Party', icon: Sparkles, emoji: '🎆', color: 'text-pink-300', bg: 'bg-pink-400/20' },
  { id: 'phoenix', name: 'Fire Phoenix', coins: 40000, category: 'Mythic', icon: Flame, emoji: '🔥', color: 'text-orange-500', bg: 'bg-orange-500/20' },
  { id: 'dragon', name: 'Golden Dragon', coins: 50000, category: 'Mythic', icon: Flame, emoji: '🐉', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: 'galaxy', name: 'Cosmic Galaxy', coins: 75000, category: 'Legendary', icon: Globe, emoji: '🌌', color: 'text-cyan-300', bg: 'bg-cyan-400/20' },
  { id: 'vip_star', name: 'Platinum Star', coins: 100000, category: 'Legendary', icon: Star, emoji: '⭐', color: 'text-amber-200', bg: 'bg-amber-300/20' }
];
