import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, Bell, Coins, Plus, Crown, Heart, Eye, Flame, ShieldAlert,
  SlidersHorizontal, Radio, Video, MessageSquare, Sparkles, Filter,
  Battery, Wifi, ChevronRight, CheckCircle2, User, Globe
} from 'lucide-react';
import LiveStreamCardWithPreview from '../LiveStreamCard';

export default function UltraModernHome({
  currentUser,
  currentUsername,
  userName,
  userAvatar,
  userCoins,
  userRole,
  isVip,
  vipPlan,
  isUserAdmin,
  isUserSuperAdmin,
  isFemaleUser,
  usersList = [],
  streamsList = [],
  advancedStories = [],
  isLoggedIn,
  notificationsList = [],
  totalUnreadMessages = 0,
  setActiveTab,
  setSelectedUser,
  setIsUserProfileModalOpen,
  setIsAddStoryModalOpen,
  setActiveStoryView,
  setViewingStream,
  handleInitiateCall,
  handleToggleLikeUserCard,
  likedUsersMap = {},
  setIsNotificationsOpen,
  setIsSettingsModalOpen,
  setIsVipModalOpen,
  loc,
  isRtl = true,
  liveMode = 'normal', // 'normal' | 'adult'
  setLiveMode
}) {
  // Top Live Mode toggle: 'normal' vs 'adult'
  const [internalLiveMode, setInternalLiveMode] = useState(liveMode || 'normal');
  const activeMode = setLiveMode ? liveMode : internalLiveMode;
  const handleModeChange = (mode) => {
    if (setLiveMode) setLiveMode(mode);
    setInternalLiveMode(mode);
  };

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'normal' | 'adult' | 'vip' | 'nearby'
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  // Status Bar live clock
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter VIP Users for Horizontal Carousel
  const vipUsers = useMemo(() => {
    const seen = new Set();
    const list = [];
    (usersList || []).forEach(u => {
      if (!u || u.status === 'banned' || u.isBanned) return;
      const uid = String(u.id || u.username);
      if (seen.has(uid)) return;
      seen.add(uid);

      const isUserVip = Boolean(
        u.isVip || u.is_vip || u.vip ||
        (u.vip_plan && u.vip_plan !== 'none' && u.vip_plan !== 'null') ||
        u.isTop ||
        String(u.role || '').toLowerCase() === 'admin'
      );
      if (isUserVip) {
        list.push(u);
      }
    });
    return list;
  }, [usersList]);

  // Group Stories
  const groupedStories = useMemo(() => {
    const map = new Map();
    (advancedStories || []).forEach(story => {
      if (!story) return;
      const key = String(story.userId || story.user_id || story.username || story.id);
      if (!map.has(key)) {
        const isMe = Boolean(
          (currentUser?.id && (String(story.userId) === String(currentUser.id) || String(story.user_id) === String(currentUser.id))) ||
          (currentUsername && story.username && story.username.toLowerCase() === currentUsername.toLowerCase())
        );
        map.set(key, {
          id: key,
          userId: story.userId || story.user_id,
          username: story.username,
          isMe: isMe,
          user: {
            id: story.userId || story.user_id,
            username: story.username,
            name: story.username || (isMe ? (currentUser?.name || currentUsername) : 'User'),
            avatar: story.userAvatar || story.avatar || (isMe ? (currentUser?.avatar || userAvatar) : ''),
            isVip: Boolean(story.isVip || story.is_vip || (isMe && vipPlan && vipPlan !== 'none'))
          },
          items: []
        });
      }
      map.get(key).items.push({
        id: story.id,
        url: story.media_url || story.imageUrl || story.url || story.videoUrl,
        type: story.media_type || (story.videoUrl ? 'video' : 'image'),
        caption: story.caption || story.title || '',
        time: story.time || (story.created_at ? new Date(story.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'هم‌اکنون'),
        views: Number(story.views_count || story.views || 0)
      });
    });
    return Array.from(map.values());
  }, [advancedStories, currentUser, currentUsername, userAvatar, vipPlan]);

  // Mixed and Filtered Streamers & Live Users List
  const liveCards = useMemo(() => {
    const activeStreams = (streamsList || []).filter(s => {
      if (!s || s.status === 'ended' || s.is_live === false) return false;
      // Exclude private
      if (s.is_private || s.isPrivate || s.visibility === 'private' || s.category === 'Private Live' || s.category === 'VIP Chat') {
        return false;
      }
      return true;
    });

    // Build unified cards list from active streams + online users
    const cards = [];
    const addedUserIds = new Set();

    // 1. Add active streams
    activeStreams.forEach(stream => {
      const isAdultStream = Boolean(stream.live_type === 'adult' || stream.isVip18 || stream.is18Plus);
      cards.push({
        id: `stream_${stream.id}`,
        type: 'stream',
        streamData: stream,
        isLive: true,
        isAdult: isAdultStream,
        title: stream.title || loc('پخش زنده استودیویی', 'Live Broadcast'),
        username: stream.host || stream.username || 'Host',
        userId: stream.host_id,
        avatar: stream.avatar || stream.thumbnail,
        thumbnail: stream.thumbnail || stream.avatar,
        viewers: stream.viewers || Math.floor(Math.random() * 80) + 12,
        likes: stream.likes || 120,
        age: 22,
        countryFlag: '🇮🇷',
        countryName: 'Iran',
        category: stream.category || (isAdultStream ? '18+ Adult' : 'Live Chat'),
        isVip: Boolean(stream.isVip || stream.is_vip)
      });
      if (stream.host_id) addedUserIds.add(String(stream.host_id));
    });

    // 2. Add remaining users from usersList (who have live or active presence)
    (usersList || []).forEach(user => {
      if (!user || user.status === 'banned') return;
      const uid = String(user.id || user.username);
      if (addedUserIds.has(uid)) return;
      addedUserIds.add(uid);

      const isAdultUser = Boolean(user.is_adult || user.isAdult || user.age >= 18 && (user.tariffPerMin > 150 || user.category === 'Adult'));
      const isUserLive = Boolean(user.online && (user.isStreamer || user.is_streamer || user.role === 'streamer' || user.isVip));

      cards.push({
        id: `user_${user.id || user.username}`,
        type: 'user',
        userData: user,
        isLive: isUserLive,
        isAdult: isAdultUser,
        title: user.bio || loc('آماده چت و ارتباط ویدیویی', 'Ready for video call'),
        username: user.name || user.username || 'User',
        userId: user.id,
        avatar: user.avatar,
        thumbnail: user.avatar,
        viewers: user.online ? Math.floor(Math.random() * 45) + 8 : 0,
        likes: Number(user.likes_count || user.likes || 15),
        age: user.age || 21,
        countryFlag: user.country_flag || (user.city ? '🇮🇷' : '🌐'),
        countryName: user.city || 'Iran',
        category: isAdultUser ? '18+ Adult' : 'Video Chat',
        isVip: Boolean(user.isVip || user.is_vip || user.vip)
      });
    });

    // Filter by Top Toggle Mode (Normal vs +18)
    return cards.filter(card => {
      // Top Mode check
      if (activeMode === 'normal' && card.isAdult) return false;
      if (activeMode === 'adult' && !card.isAdult) return false;

      // Filter button check
      if (activeFilter === 'vip' && !card.isVip) return false;
      if (activeFilter === 'normal' && card.isAdult) return false;
      if (activeFilter === 'adult' && !card.isAdult) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = card.title?.toLowerCase().includes(q);
        const matchUser = card.username?.toLowerCase().includes(q);
        const matchCat = card.category?.toLowerCase().includes(q);
        if (!matchTitle && !matchUser && !matchCat) return false;
      }

      return true;
    });
  }, [streamsList, usersList, activeMode, activeFilter, searchQuery, loc]);

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-4 pb-20 select-none text-slate-100 font-sans">
      
      {/* =========================================================================
          1. TOP SECTION: 8K MOBILE STATUS BAR & HEADER
         ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950/70 backdrop-blur-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)] p-3.5 space-y-3.5">
        
        {/* Soft Ambient Cinematic Light Beams */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Mobile Status Bar (Time, Wifi, Battery) */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 border-b border-white/5 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white tracking-wider">{currentTime}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold">5G 8K</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Brand Row: Logo, Search Bar, Notification & Wallet Icons */}
        <div className="flex items-center justify-between gap-2.5">
          {/* App Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 p-0.5 shadow-[0_0_20px_rgba(0,243,255,0.4)] group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Video className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-wider bg-gradient-to-r from-cyan-300 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                V.LIVE
              </span>
              <span className="text-[8px] font-mono font-bold text-cyan-400 -mt-1 tracking-widest">
                ULTRA 8K
              </span>
            </div>
          </div>

          {/* Glassmorphic Search Bar */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={loc('جستجوی استریمرها، کاربران، تگ‌ها...', 'Search streamers, users, tags...')}
              className="w-full h-9 pl-8 pr-8 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(0,243,255,0.2)] transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-[10px]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right Action Icons: Wallet & Notification */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Wallet Button */}
            <button
              onClick={() => setActiveTab('wallet')}
              className="h-9 px-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/20 border border-amber-400/40 text-amber-300 hover:border-amber-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95 transition-all"
              title={loc('کیف پول و سکه‌ها', 'Wallet & Coins')}
            >
              <Coins className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-[11px] font-mono font-black text-amber-200">
                {(userCoins || 0).toLocaleString()}
              </span>
            </button>

            {/* Notification Button */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-pink-500/50 flex items-center justify-center relative hover:scale-105 active:scale-95 transition-all"
              title={loc('اعلان‌ها', 'Notifications')}
            >
              <Bell className="w-4 h-4" />
              {notificationsList.some(n => n.unread) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.9)] animate-ping" />
              )}
            </button>
          </div>
        </div>

        {/* =========================================================================
            TWO LARGE NEON DUAL-MODE TOGGLE TABS
            1. لایو عادی (Normal Live) – soft blue neon glow
            2. لایو بزرگسالان +۱۸ (Adult Live +18) – deep red/pink neon glow with subtle warning icon
           ========================================================================= */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* Tab 1: Normal Live */}
          <button
            onClick={() => handleModeChange('normal')}
            className={`relative py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 font-black text-xs sm:text-sm transition-all duration-300 overflow-hidden ${
              activeMode === 'normal'
                ? 'bg-gradient-to-r from-blue-600/30 via-cyan-500/25 to-blue-600/30 text-cyan-200 border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.45)] scale-[1.02]'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-300 hover:bg-white/10 hover:border-cyan-500/30'
            }`}
          >
            {activeMode === 'normal' && (
              <div className="absolute inset-0 bg-cyan-400/10 animate-pulse pointer-events-none" />
            )}
            <div className={`w-2.5 h-2.5 rounded-full ${
              activeMode === 'normal' 
                ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,1)] animate-ping' 
                : 'bg-slate-600'
            }`} />
            <Radio className={`w-4 h-4 ${activeMode === 'normal' ? 'text-cyan-300' : 'text-slate-500'}`} />
            <span className="tracking-wide">
              {loc('لایو عادی', 'Normal Live')}
            </span>
          </button>

          {/* Tab 2: Adult Live +18 */}
          <button
            onClick={() => handleModeChange('adult')}
            className={`relative py-3 px-4 rounded-2xl flex items-center justify-center gap-2.5 font-black text-xs sm:text-sm transition-all duration-300 overflow-hidden ${
              activeMode === 'adult'
                ? 'bg-gradient-to-r from-rose-900/40 via-red-600/30 to-pink-900/40 text-rose-200 border-2 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.55)] scale-[1.02]'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 hover:border-rose-500/30'
            }`}
          >
            {activeMode === 'adult' && (
              <div className="absolute inset-0 bg-rose-600/10 animate-pulse pointer-events-none" />
            )}
            <ShieldAlert className={`w-4 h-4 ${
              activeMode === 'adult' 
                ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]' 
                : 'text-slate-500'
            }`} />
            <span className="tracking-wide">
              {loc('لایو بزرگسالان +۱۸', 'Adult Live +18')}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-rose-500/30 border border-rose-400/50 text-rose-200">
              18+
            </span>
          </button>
        </div>

      </div>

      {/* =========================================================================
          2. STORIES ROW (HORIZONTAL SCROLL)
          - Circular story rings with colorful gradients
          - VIP stories have gold border and crown icon
          - “Add Story” button on the left
         ========================================================================= */}
      <div className="relative bg-slate-950/60 backdrop-blur-xl rounded-3xl p-3.5 border border-white/10 shadow-lg">
        <div className="flex items-center justify-between pb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
            <h3 className="text-xs font-black text-slate-200 tracking-wide">
              {loc('استوری‌های زنده و برتر', 'Live & Trending Stories')}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            {groupedStories.length} {loc('استوری فعال', 'Active')}
          </span>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto pb-1 no-scrollbar px-1">
          {/* Add Story Button on the Left */}
          <div
            onClick={() => setIsAddStoryModalOpen(true)}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-pink-500/80 bg-gradient-to-tr from-pink-500/20 via-purple-600/10 to-transparent flex items-center justify-center group-hover:border-pink-400 group-hover:bg-pink-500/30 group-hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
              <Plus className="w-6 h-6 text-pink-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-[10px] font-bold text-pink-300 group-hover:text-white max-w-[62px] truncate text-center">
              {loc('استوری شما', 'Add Story')}
            </span>
          </div>

          {/* Story Ring Avatars */}
          {groupedStories.map(group => {
            const isGroupVip = group.user?.isVip;
            return (
              <div
                key={group.id}
                onClick={() => setActiveStoryView({ group, currentIndex: 0 })}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  {/* Outer Glowing Ring */}
                  <div className={`w-14 h-14 rounded-full p-[2.5px] transition-all duration-300 group-hover:scale-105 ${
                    isGroupVip
                      ? 'bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/40'
                      : 'bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                  }`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 border-2 border-slate-950">
                      {group.user?.avatar ? (
                        <img
                          src={group.user.avatar}
                          alt={group.user.name || group.user.username}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-black text-white">
                          {(group.user?.name || group.user?.username || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VIP Crown Badge */}
                  {isGroupVip && (
                    <div 
                      className="absolute -top-1 -right-1 z-10 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-600 border border-amber-200 shadow-md flex items-center justify-center pointer-events-none -rotate-12"
                      title="VIP Story"
                    >
                      <Crown className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                    </div>
                  )}

                  {/* Unread Counter Badge */}
                  {group.items.length > 1 && (
                    <div className="absolute -bottom-1 -left-1 z-10 px-1 py-0.2 rounded-full bg-pink-600 text-white font-mono text-[8px] font-black border border-slate-950">
                      {group.items.length}
                    </div>
                  )}
                </div>

                <span className={`text-[10px] font-bold max-w-[62px] truncate text-center ${
                  isGroupVip ? 'text-amber-300 group-hover:text-amber-200' : 'text-slate-300 group-hover:text-white'
                }`}>
                  {group.user?.name || group.user?.username}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          3. VIP USERS SECTION (HORIZONTAL CAROUSEL)
          - Gold frames, crown badges, online green dots, and “VIP” tags
          - Soft golden glow around them
         ========================================================================= */}
      {vipUsers.length > 0 && (
        <div className="relative bg-gradient-to-r from-amber-950/25 via-slate-950/80 to-amber-950/25 backdrop-blur-xl rounded-3xl p-3.5 border border-amber-500/30 shadow-[0_10px_35px_rgba(245,158,11,0.15)]">
          <div className="flex items-center justify-between pb-2 px-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
                <Crown className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-amber-300 tracking-wide flex items-center gap-1.5">
                <span>{loc('کاربران ویژه VIP سلطنتی', 'Royal VIP Star Members')}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                  EXCLUSIVE
                </span>
              </h3>
            </div>
            <button
              onClick={() => setIsVipModalOpen(true)}
              className="text-[10px] font-bold text-amber-400 hover:text-amber-200 flex items-center gap-0.5"
            >
              <span>{loc('ارتقا به VIP', 'Upgrade')}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1.5 no-scrollbar px-1">
            {vipUsers.map(user => {
              const isOnline = Boolean(user.online || user.isOnline);
              return (
                <div
                  key={user.id || user.username}
                  onClick={() => {
                    setSelectedUser(user);
                    setIsUserProfileModalOpen(true);
                  }}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  <div className="relative">
                    {/* Golden Frame with Glow */}
                    <div className="w-14 h-14 rounded-2xl p-[2px] bg-gradient-to-b from-amber-300 via-yellow-500 to-orange-600 shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-all duration-300">
                      <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950 border border-slate-900">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name || user.username}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-black text-amber-300">
                            {(user.name || user.username || 'V').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* VIP Tag & Crown */}
                    <div className="absolute -top-1.5 -right-1.5 z-10 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 border border-amber-200 text-slate-950 text-[8px] font-black shadow-md flex items-center gap-0.5">
                      <Crown className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
                      <span>VIP</span>
                    </div>

                    {/* Online Dot */}
                    {isOnline && (
                      <div className="absolute -bottom-1 -left-1 z-10 w-3.5 h-3.5 rounded-full bg-slate-950 flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] animate-pulse" />
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-black text-amber-300 group-hover:text-white max-w-[64px] truncate text-center">
                    {user.name || user.username}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          4. MAIN CONTENT AREA – LIVE USER LIST (VERTICAL CARDS GRID)
          - Each card shows:
            - Live thumbnail with real-time viewer count
            - Username + age + country flag
            - “LIVE” badge (blue for normal, red for +18)
            - Heart and viewer icons
            - “Match” button with glowing pink/red effect
          - Mix of normal and adult (+18) streams clearly separated by color coding
         ========================================================================= */}
      <div className="space-y-3">
        {/* Section Title & Filter Toggle Bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              activeMode === 'adult' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]'
            }`} />
            <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
              {activeMode === 'adult' 
                ? loc('پخش‌های زنده بزرگسالان +۱۸', 'Adult 18+ Live Broadcasts') 
                : loc('پخش‌های زنده استودیویی و کاربران آنلاین', 'Live Broadcasts & Online Streamers')}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-bold">
              {liveCards.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: loc('همه', 'All') },
              { id: 'vip', label: 'VIP' },
              { id: 'nearby', label: loc('نزدیک', 'Nearby') }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                  activeFilter === f.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live User Cards Grid */}
        {liveCards.length === 0 ? (
          <div className="p-12 text-center bg-slate-950/60 rounded-3xl border border-white/10 space-y-3">
            <Radio className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
            <p className="text-xs font-bold text-slate-400">
              {activeMode === 'adult'
                ? loc('در حال حاضر هیچ لایواستریم ۱۸+ فعالی یافت نشد', 'No active 18+ live streams found right now')
                : loc('در حال حاضر هیچ لایو فعالی در دسترس نیست', 'No active live streams currently available')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {liveCards.map(card => {
              const isAdultCard = card.isAdult;
              return (
                <div
                  key={card.id}
                  className={`group relative rounded-3xl overflow-hidden bg-slate-950 border transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1 ${
                    isAdultCard
                      ? 'border-rose-500/40 hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]'
                      : 'border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.35)]'
                  }`}
                >
                  {/* Thumbnail & Aspect Ratio Container */}
                  <div 
                    onClick={() => {
                      if (card.type === 'stream' && card.streamData) {
                        setViewingStream(card.streamData);
                      } else if (card.userData) {
                        setSelectedUser(card.userData);
                        setIsUserProfileModalOpen(true);
                      }
                    }}
                    className="aspect-[3/4] relative overflow-hidden cursor-pointer"
                  >
                    {/* Image / Thumbnail */}
                    {card.thumbnail ? (
                      <img
                        src={card.thumbnail}
                        alt={card.username}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-600 font-black text-sm">
                        {card.username.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                    {/* Top Row Badges: LIVE Badge (Blue for Normal, Red for +18) & Viewers Count */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      {/* LIVE Badge */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black text-white shadow-lg backdrop-blur-md ${
                        isAdultCard
                          ? 'bg-rose-600/90 border border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.8)]'
                          : 'bg-blue-600/90 border border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.8)]'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span className="tracking-widest">LIVE</span>
                        {isAdultCard && <span className="font-mono text-[8px]">+18</span>}
                      </div>

                      {/* Viewers Badge */}
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-200 text-[9px] font-bold">
                        <Eye className="w-3 h-3 text-cyan-400" />
                        <span>{(card.viewers || 0).toLocaleString()}</span>
                      </div>
                    </div>

                    {/* VIP Ribbon if applicable */}
                    {card.isVip && (
                      <div className="absolute top-9 left-2.5 z-10 flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[8px] font-black shadow-md">
                        <Crown className="w-2.5 h-2.5 fill-slate-950" />
                        <span>VIP</span>
                      </div>
                    )}

                    {/* Bottom Info on Thumbnail: Username + Age + Flag + Category */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 z-10 space-y-0.5 text-right dir-rtl pointer-events-none">
                      <div className="flex items-center gap-1 text-white font-black text-xs drop-shadow-md truncate">
                        <span className="truncate">{card.username}</span>
                        {card.age && <span className="text-slate-300 font-mono text-[10px]">,{card.age}</span>}
                        <span className="text-xs">{card.countryFlag}</span>
                      </div>
                      <p className="text-[9px] text-slate-300/80 truncate font-medium">
                        {card.title}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Heart Icon, Quick Match Glowing Button */}
                  <div className="p-2 bg-slate-950/95 border-t border-white/10 flex items-center gap-1.5">
                    {/* Heart Like Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (handleToggleLikeUserCard) {
                          handleToggleLikeUserCard(card.userId, e);
                        }
                      }}
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all active:scale-90 shrink-0 ${
                        likedUsersMap[card.userId]
                          ? 'bg-pink-500/20 border-pink-500 text-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.4)]'
                          : 'bg-white/5 hover:bg-pink-500/20 border-white/10 hover:border-pink-500/40 text-pink-400'
                      }`}
                      title={loc('لایک', 'Like')}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedUsersMap[card.userId] ? 'fill-pink-500 text-pink-500' : 'fill-pink-500/40 text-pink-400 hover:fill-pink-500'}`} />
                    </button>

                    {/* “Match” Button with Glowing Pink/Red Effect */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const targetUser = card.userData || {
                          id: card.userId,
                          name: card.username,
                          username: card.username,
                          avatar: card.avatar
                        };
                        handleInitiateCall(targetUser, 'video');
                      }}
                      className={`flex-1 h-8 rounded-xl font-black text-[11px] flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 group ${
                        isAdultCard
                          ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.55)] border border-rose-400/50'
                          : 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/50'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                      <span>{loc('Match', 'Match')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          5. ADDITIONAL FLOATING ELEMENTS
          - Quick Match floating button with pulse animation
          - Filter floating button
         ========================================================================= */}
      {/* Quick Match Floating Action Button */}
      <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
        <button
          onClick={() => setActiveTab('match')}
          className="relative px-4 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white font-black text-xs flex items-center gap-2 shadow-[0_0_30px_rgba(244,63,94,0.8)] border-2 border-white/25 hover:scale-105 active:scale-95 transition-all group"
          title={loc('مچ سریع و رادار', 'Quick Match')}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
          <Flame className="w-4 h-4 group-hover:scale-125 transition-transform drop-shadow" />
          <span className="tracking-wide">{loc('Quick Match', 'Quick Match')}</span>
        </button>
      </div>

    </div>
  );
}
