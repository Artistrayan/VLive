import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, Bell, Coins, Plus, Crown, Heart, Eye, Flame, ShieldAlert,
  Radio, Video, ChevronRight, CheckCircle2, User, Globe, Shield,
  Wifi, Battery, Sparkles, SlidersHorizontal
} from 'lucide-react';

/**
 * Helper to determine if a user/profile is female.
 * Strictly respects platform rules: male users are viewers only and never displayed in the streamer/matching lists.
 */
export const isFemaleProfile = (user) => {
  if (!user) return false;
  if (user.isFemale === true || user.is_female === true) return true;
  const genderStr = String(user.gender || user.user_gender || user.sex || '').trim().toLowerCase();
  if (
    genderStr === 'female' ||
    genderStr === 'خانم' ||
    genderStr === 'زن' ||
    genderStr === 'f' ||
    genderStr === 'woman'
  ) {
    return true;
  }
  // If explicitly marked as male, return false
  if (
    genderStr === 'male' ||
    genderStr === 'آقا' ||
    genderStr === 'مرد' ||
    genderStr === 'm' ||
    genderStr === 'man'
  ) {
    return false;
  }
  // In vLive adult streaming, female streamers may be designated by streamer role or host status
  return Boolean(user.is_streamer || user.isStreamer || user.role === 'streamer' || user.is_host || user.isHost);
};

export default function UltraModernHome({
  currentUser,
  currentUsername,
  userName,
  userAvatar,
  userCoins = 0,
  userRole,
  isVip,
  vipPlan,
  isUserAdmin,
  isUserSuperAdmin,
  isFemaleUser,
  isStreamerUser,
  isApprovedStreamerOrAdmin,
  handleOpenLiveBroadcast,
  setIsAdminPanelOpen,
  usersList = [],
  streamsList = [],
  advancedStories = [],
  isLoggedIn,
  notificationsList = [],
  totalUnreadMessages = 0,
  activeTab = 'home',
  isSearchTabActive = false,
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
  setIsBecomeStreamerModalOpen,
  loc,
  isRtl = true,
  liveMode = 'normal', // 'normal' | 'adult'
  setLiveMode
}) {
  // Mode selection: normal vs adult (+18)
  const [internalLiveMode, setInternalLiveMode] = useState(liveMode || 'normal');
  const activeMode = setLiveMode ? liveMode : internalLiveMode;
  const handleModeChange = (mode) => {
    if (setLiveMode) setLiveMode(mode);
    setInternalLiveMode(mode);
  };

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'online' | 'vip' | 'nearby'
  const searchInputRef = useRef(null);

  // When search tab is active, auto-focus search input
  useEffect(() => {
    if (isSearchTabActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchTabActive]);

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

  // Check if current user is an approved streamer or admin
  const canAccessBroadcasting = Boolean(
    isUserAdmin ||
    isUserSuperAdmin ||
    isApprovedStreamerOrAdmin ||
    (isFemaleUser && isStreamerUser)
  );

  // 1. FILTER STORIES ROW: Only Female Users' Stories
  const femaleStories = useMemo(() => {
    const map = new Map();
    (advancedStories || []).forEach(story => {
      if (!story) return;

      const storyUserId = story.userId || story.user_id;
      const matchedUser = (usersList || []).find(
        u => String(u.id) === String(storyUserId) || u.username === story.username
      );

      const isMe = Boolean(
        (currentUser?.id && String(storyUserId) === String(currentUser.id)) ||
        (currentUsername && story.username && story.username.toLowerCase() === currentUsername.toLowerCase())
      );

      // Gender check: only female stories (unless admin or verified female)
      const isFemale = isMe ? (isFemaleUser || isUserAdmin) : isFemaleProfile(matchedUser || story.user || story);
      if (!isFemale) return; // Completely hide male stories

      const key = String(storyUserId || story.username || story.id);
      if (!map.has(key)) {
        const isUserVip = Boolean(
          story.isVip ||
          story.is_vip ||
          (matchedUser && (matchedUser.isVip || matchedUser.is_vip || matchedUser.vip)) ||
          (isMe && isVip)
        );

        map.set(key, {
          id: key,
          userId: storyUserId,
          username: story.username,
          isMe: isMe,
          user: {
            id: storyUserId,
            username: story.username,
            name: story.username || (matchedUser?.name || (isMe ? (currentUser?.name || currentUsername) : 'User')),
            avatar: story.userAvatar || story.avatar || matchedUser?.avatar || (isMe ? userAvatar : ''),
            isVip: isUserVip,
            isOnline: Boolean(matchedUser?.online || matchedUser?.isOnline)
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
  }, [advancedStories, usersList, currentUser, currentUsername, userAvatar, isVip, isFemaleUser, isUserAdmin]);

  // 2. VIP FEMALE USERS CAROUSEL: Only Female VIP Users
  const vipFemaleUsers = useMemo(() => {
    const seen = new Set();
    const list = [];
    (usersList || []).forEach(u => {
      if (!u || u.status === 'banned' || u.isBanned) return;

      // Strictly female only!
      if (!isFemaleProfile(u)) return;

      const uid = String(u.id || u.username);
      if (seen.has(uid)) return;
      seen.add(uid);

      const isUserVip = Boolean(
        u.isVip || u.is_vip || u.vip ||
        (u.vip_plan && u.vip_plan !== 'none' && u.vip_plan !== 'null') ||
        u.isTop ||
        (u.tariffPerMin && u.tariffPerMin > 100)
      );

      if (isUserVip) {
        list.push(u);
      }
    });
    return list;
  }, [usersList]);

  // 3. MAIN USER LIST (GRID): Only Female Users displayed (Males are completely hidden)
  const femaleLiveCards = useMemo(() => {
    const activeStreams = (streamsList || []).filter(s => {
      if (!s || s.status === 'ended' || s.is_live === false) return false;
      if (s.is_private || s.isPrivate || s.visibility === 'private') return false;

      // Check if host is female
      const hostUser = (usersList || []).find(
        u => String(u.id) === String(s.host_id) || u.username === s.host || u.username === s.username
      );
      return isFemaleProfile(hostUser || s);
    });

    const cards = [];
    const addedUserIds = new Set();

    // Add active female streams
    activeStreams.forEach(stream => {
      const isAdultStream = Boolean(stream.live_type === 'adult' || stream.isVip18 || stream.is18Plus);
      const hostUser = (usersList || []).find(
        u => String(u.id) === String(stream.host_id) || u.username === stream.host || u.username === stream.username
      );

      cards.push({
        id: `stream_${stream.id}`,
        type: 'stream',
        streamData: stream,
        userData: hostUser,
        isLive: true,
        isAdult: isAdultStream,
        title: stream.title || loc('پخش زنده استودیویی', 'Live Broadcast'),
        username: stream.host || stream.username || hostUser?.name || 'Host',
        userId: stream.host_id || hostUser?.id,
        avatar: stream.avatar || stream.thumbnail || hostUser?.avatar,
        thumbnail: stream.thumbnail || stream.avatar || hostUser?.avatar,
        viewers: stream.viewers || Math.floor(Math.random() * 85) + 18,
        likes: stream.likes || 140,
        age: hostUser?.age || 22,
        distance: hostUser?.distance || '۲.۴ km',
        countryFlag: '🇮🇷',
        isOnline: true,
        isVip: Boolean(stream.isVip || stream.is_vip || hostUser?.isVip || hostUser?.is_vip || hostUser?.vip)
      });
      if (stream.host_id) addedUserIds.add(String(stream.host_id));
      if (hostUser?.id) addedUserIds.add(String(hostUser.id));
    });

    // Add female users from usersList (males are completely hidden)
    (usersList || []).forEach(user => {
      if (!user || user.status === 'banned' || user.isBanned) return;

      // STRICT RULE: Only female users are displayed in the list
      if (!isFemaleProfile(user)) return;

      const uid = String(user.id || user.username);
      if (addedUserIds.has(uid)) return;
      addedUserIds.add(uid);

      const isAdultUser = Boolean(
        user.is_adult || user.isAdult || (user.age >= 18 && (user.tariffPerMin > 150 || user.category === 'Adult'))
      );
      const isUserLive = Boolean(user.online && (user.isStreamer || user.is_streamer || user.role === 'streamer'));

      cards.push({
        id: `user_${uid}`,
        type: 'user',
        userData: user,
        isLive: isUserLive,
        isAdult: isAdultUser,
        title: user.bio || loc('آماده چت و تماس تصویری زنده', 'Ready for live video chat'),
        username: user.name || user.username || 'User',
        userId: user.id,
        avatar: user.avatar,
        thumbnail: user.avatar,
        viewers: user.online ? Math.floor(Math.random() * 45) + 6 : 0,
        likes: Number(user.likes_count || user.likes || 24),
        age: user.age || 21,
        distance: user.distance || '۳ km',
        countryFlag: user.country_flag || '🇮🇷',
        isOnline: Boolean(user.online || user.online_status === 'online' || user.status === 'online'),
        isVip: Boolean(user.isVip || user.is_vip || user.vip)
      });
    });

    // Apply Filters & Search
    return cards.filter(card => {
      // Filter by active mode (Normal Live vs Adult +18 Live)
      if (activeMode === 'normal' && card.isAdult) return false;
      if (activeMode === 'adult' && !card.isAdult) return false;

      // Filter chips
      if (activeFilter === 'live' && !card.isLive) return false;
      if (activeFilter === 'online' && !card.isOnline) return false;
      if (activeFilter === 'vip' && !card.isVip) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = card.title?.toLowerCase().includes(q);
        const matchUser = card.username?.toLowerCase().includes(q);
        if (!matchTitle && !matchUser) return false;
      }

      return true;
    });
  }, [streamsList, usersList, activeMode, activeFilter, searchQuery, loc]);

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-4 pb-24 select-none text-slate-100 font-sans">
      
      {/* Seductive Dark Atmospheric Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-900/15 rounded-full blur-[100px]" />
      </div>

      {/* =========================================================================
          1. TWO MODE TABS (ACCESSIBLE TO ALL USERS FOR EASY FILTERING)
         ========================================================================= */}
      <div className="relative z-10 rounded-2xl overflow-hidden bg-slate-950/80 backdrop-blur-2xl border border-rose-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.6)] p-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Tab 1: Normal Live */}
          <button
            onClick={() => handleModeChange('normal')}
            className={`relative py-2 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs sm:text-sm transition-all duration-300 overflow-hidden ${
              activeMode === 'normal'
                ? 'bg-gradient-to-r from-cyan-900/40 via-cyan-600/30 to-blue-900/40 text-cyan-200 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] scale-[1.01]'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-300 hover:bg-white/10 hover:border-cyan-500/30'
            }`}
          >
            <Radio className={`w-4 h-4 ${activeMode === 'normal' ? 'text-cyan-300 animate-pulse' : 'text-slate-500'}`} />
            <span className="tracking-wide">
              {loc('لایو عادی', 'Normal Live')}
            </span>
          </button>

          {/* Tab 2: Adult Live +18 */}
          <button
            onClick={() => handleModeChange('adult')}
            className={`relative py-2 px-3 sm:px-4 rounded-xl flex items-center justify-center gap-2 font-black text-xs sm:text-sm transition-all duration-300 overflow-hidden ${
              activeMode === 'adult'
                ? 'bg-gradient-to-r from-rose-950/60 via-red-600/40 to-pink-950/60 text-rose-200 border-2 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.55)] scale-[1.01]'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 hover:border-rose-500/30'
            }`}
          >
            <ShieldAlert className={`w-4 h-4 ${activeMode === 'adult' ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]' : 'text-slate-500'}`} />
            <span className="tracking-wide">
              {loc('لایو +۱۸', 'Live +18')}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-rose-500/30 border border-rose-400/50 text-rose-200 font-black">
              18+
            </span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. STORIES ROW (HORIZONTAL SCROLL)
          - ONLY female users’ stories with colorful rings
          - VIP female stories have gold border and crown
          - “Add Story” only for female/admin
         ========================================================================= */}
      <div className="relative z-10 bg-slate-950/70 backdrop-blur-xl rounded-3xl p-3.5 border border-rose-500/15 shadow-lg">
        <div className="flex items-center justify-between pb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <h3 className="text-xs font-black text-slate-200 tracking-wide">
              {loc('استوری‌های زنده', 'Live Stories')}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            {femaleStories.length} {loc('استوری', 'Stories')}
          </span>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto pb-1 no-scrollbar px-1">
          {/* Add Story Button (Visible for female users or admin) */}
          {(isFemaleUser || isUserAdmin) && (
            <div
              onClick={() => setIsAddStoryModalOpen(true)}
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full border-2 border-dashed border-rose-500/80 bg-gradient-to-tr from-rose-500/20 via-pink-600/10 to-transparent flex items-center justify-center group-hover:border-rose-400 group-hover:bg-rose-500/30 group-hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
                <Plus className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-[10px] font-bold text-rose-300 group-hover:text-white max-w-[62px] truncate text-center">
                {loc('افزودن استوری', 'Add Story')}
              </span>
            </div>
          )}

          {/* Female Story Ring Avatars */}
          {femaleStories.map(group => {
            const isGroupVip = group.user?.isVip;
            return (
              <div
                key={group.id}
                onClick={() => setActiveStoryView({ group, currentIndex: 0 })}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  {/* Outer Ring: VIP gets Gold Border, Regular gets Colorful Gradient Ring */}
                  <div className={`w-14 h-14 rounded-full p-[2.5px] transition-all duration-300 group-hover:scale-105 ${
                    isGroupVip
                      ? 'bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/50'
                      : 'bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  }`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 border-2 border-slate-950">
                      {group.user?.avatar ? (
                        <img
                          src={group.user.avatar}
                          alt={group.user.name || group.user.username}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-black text-rose-300">
                          {(group.user?.name || group.user?.username || 'F').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* VIP Crown for VIP Female Stories */}
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
                    <div className="absolute -bottom-1 -left-1 z-10 px-1 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[8px] font-black border border-slate-950">
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
          3. VIP FEMALE USERS CAROUSEL:
          - Horizontal list of ONLY female VIP users
          - Gold frames, crown badges, and online status
         ========================================================================= */}
      {vipFemaleUsers.length > 0 && (
        <div className="relative z-10 bg-gradient-to-r from-amber-950/25 via-slate-950/80 to-amber-950/25 backdrop-blur-xl rounded-3xl p-3.5 border border-amber-500/30 shadow-[0_10px_35px_rgba(245,158,11,0.15)]">
          <div className="flex items-center justify-between pb-2 px-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-md">
                <Crown className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              </div>
              <h3 className="text-xs sm:text-sm font-black text-amber-300 tracking-wide flex items-center gap-1.5">
                <span>{loc('ستارگان ویژه VIP خانم‌ها', 'VIP Female Star Users')}</span>
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
            {vipFemaleUsers.map(user => {
              const isOnline = Boolean(user.online || user.isOnline || user.online_status === 'online');
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
                    {/* Gold Frame with Ambient Glow */}
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

                    {/* Online Status Dot */}
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
          4. MAIN USER LIST (GRID):
          - ONLY female users displayed
          - Each card shows avatar, username, age, online status, “LIVE” badge (if streaming)
          - Male users are COMPLETELY HIDDEN (they only appear as spectators)
         ========================================================================= */}
      <div className="relative z-10 space-y-3">
        {/* Header & Filter Chips */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
            <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
              {loc('استریمرها و کاربران آنلاین', 'Streamers & Online Users')}
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-rose-300 font-bold">
              {femaleLiveCards.length}
            </span>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: loc('همه', 'All') },
              { id: 'live', label: `🔴 ${loc('پخش زنده', 'Live')}` },
              { id: 'online', label: loc('آنلاین', 'Online') },
              { id: 'vip', label: 'VIP' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                  activeFilter === f.id
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Cards Grid */}
        {femaleLiveCards.length === 0 ? (
          <div className="p-12 text-center bg-slate-950/70 rounded-3xl border border-rose-500/20 space-y-3">
            <Radio className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
            <p className="text-xs font-bold text-slate-400">
              {loc('هیچ موردی در این دسته‌بندی یافت نشد.', 'No items found in this category.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {femaleLiveCards.map(card => {
              const isStreaming = card.isLive;
              const isAdult = card.isAdult;
              return (
                <div
                  key={card.id}
                  className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-rose-500/25 hover:border-rose-400/80 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]"
                >
                  {/* Aspect Ratio 3:4 Thumbnail Container */}
                  <div 
                    onClick={() => {
                      if (card.type === 'stream' && card.streamData) {
                        setViewingStream(card.streamData);
                      } else if (card.isLive) {
                        const activeStream = (streamsList || []).find(s => String(s.host_id) === String(card.userId) || s.host === card.username);
                        if (activeStream) {
                          setViewingStream(activeStream);
                        } else if (card.userData) {
                          setSelectedUser(card.userData);
                          setIsUserProfileModalOpen(true);
                        }
                      } else if (card.userData) {
                        setSelectedUser(card.userData);
                        setIsUserProfileModalOpen(true);
                      }
                    }}
                    className="aspect-[3/4] relative overflow-hidden cursor-pointer"
                  >
                    {card.thumbnail ? (
                      <img
                        src={card.thumbnail}
                        alt={card.username}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 font-black text-sm">
                        {card.username.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Dark Seductive Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Top Row Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                      {/* LIVE Badge (if streaming) OR Online Status */}
                      {isStreaming ? (
                        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black text-white shadow-lg backdrop-blur-md ${
                          isAdult
                            ? 'bg-rose-600/90 border border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.8)]'
                            : 'bg-cyan-600/90 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="tracking-widest">LIVE</span>
                          {isAdult && <span className="font-mono text-[8px]">+18</span>}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300 text-[9px] font-bold">
                          <span className={`w-2 h-2 rounded-full ${card.isOnline ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse' : 'bg-slate-500'}`} />
                          <span>{card.isOnline ? loc('آنلاین', 'Online') : loc('آفلاین', 'Offline')}</span>
                        </div>
                      )}

                      {/* Viewers or Distance Badge */}
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-200 text-[9px] font-bold">
                        {isStreaming ? (
                          <>
                            <Eye className="w-3 h-3 text-rose-400" />
                            <span>{(card.viewers || 0).toLocaleString()}</span>
                          </>
                        ) : (
                          <span>{card.distance}</span>
                        )}
                      </div>
                    </div>

                    {/* VIP Crown Tag */}
                    {card.isVip && (
                      <div className="absolute top-9 left-2.5 z-10 flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[8px] font-black shadow-md pointer-events-none">
                        <Crown className="w-2.5 h-2.5 fill-slate-950" />
                        <span>VIP</span>
                      </div>
                    )}

                    {/* Bottom Info on Thumbnail: Username + Age + Flag */}
                    <div className="absolute bottom-2 left-2.5 right-2.5 z-10 space-y-0.5 text-right dir-rtl pointer-events-none">
                      <div className="flex items-center gap-1 text-white font-black text-xs drop-shadow-md truncate">
                        <span className="truncate">{card.username}</span>
                        {card.age && <span className="text-rose-300 font-mono text-[10px]">,{card.age}</span>}
                        <span className="text-xs">{card.countryFlag}</span>
                      </div>
                      <p className="text-[9px] text-slate-300/80 truncate font-medium">
                        {card.title}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Footer: Heart Like + Glowing Action Button */}
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
                          ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                          : 'bg-white/5 hover:bg-rose-500/20 border-white/10 hover:border-rose-500/40 text-rose-400'
                      }`}
                      title={loc('لایک', 'Like')}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedUsersMap[card.userId] ? 'fill-rose-500 text-rose-500' : 'fill-rose-500/40 text-rose-400 hover:fill-rose-500'}`} />
                    </button>

                    {/* If Streaming -> Direct "Watch Live" Button; Otherwise -> "Match / Call" */}
                    {isStreaming ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (card.type === 'stream' && card.streamData) {
                            setViewingStream(card.streamData);
                          } else {
                            const activeStream = (streamsList || []).find(s => String(s.host_id) === String(card.userId) || s.host === card.username);
                            if (activeStream) {
                              setViewingStream(activeStream);
                            } else if (card.userData) {
                              setSelectedUser(card.userData);
                              setIsUserProfileModalOpen(true);
                            }
                          }
                        }}
                        className="flex-1 h-8 rounded-xl font-black text-[11px] flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 group bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] border border-rose-400/60 animate-pulse"
                      >
                        <Radio className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                        <span>{loc('ورود به لایو', 'Watch Live')}</span>
                      </button>
                    ) : (
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
                        className="flex-1 h-8 rounded-xl font-black text-[11px] flex items-center justify-center gap-1.5 shadow-lg transition-all active:scale-95 group bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-500 hover:to-pink-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.55)] border border-rose-400/50"
                      >
                        <Flame className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                        <span>{loc('Match', 'Match')}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* =========================================================================
          5. “START LIVE / BECOME STREAMER” FLOATING ACTION BUTTON
          - For approved broadcasters / admins: opens Live Studio to stream
          - For regular users: opens "Become a Streamer" application modal
         ========================================================================= */}
      <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2.5 pointer-events-auto animate-bounce-gentle">
        {canAccessBroadcasting ? (
          <button
            onClick={() => {
              if (handleOpenLiveBroadcast) {
                handleOpenLiveBroadcast();
              }
            }}
            className="relative px-5 py-3 rounded-full bg-gradient-to-r from-rose-600 via-red-600 to-pink-600 text-white font-black text-xs flex items-center gap-2.5 shadow-[0_0_35px_rgba(244,63,94,0.9)] border-2 border-white/30 hover:scale-105 active:scale-95 transition-all group"
            title={loc('شروع پخش زنده (مخصوص استریمرهای تایید شده)', 'Start Live Broadcast')}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <Video className="w-4 h-4 group-hover:scale-125 transition-transform drop-shadow" />
            <span className="tracking-wide">{loc('شروع لایو', 'Start Live')}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (setIsBecomeStreamerModalOpen) {
                setIsBecomeStreamerModalOpen(true);
              }
            }}
            className="relative px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-black text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(219,39,119,0.7)] border border-white/20 hover:scale-105 active:scale-95 transition-all group backdrop-blur-md"
            title={loc('درخواست مجوز پخش زنده و استریمری', 'Apply to Become a Streamer')}
          >
            <Video className="w-3.5 h-3.5 text-pink-200 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">{loc('درخواست استریمری', 'Go Live / Streamer')}</span>
          </button>
        )}
      </div>

    </div>
  );
}
