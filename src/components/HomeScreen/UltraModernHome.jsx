import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bell, Coins, Plus, Crown, Heart, Eye, Flame, ShieldAlert,
  Radio, Video, ChevronRight, CheckCircle2, User, Globe, Shield,
  Wifi, Battery, Sparkles, SlidersHorizontal, Lock, MessageSquare, ShieldCheck,
  Trophy, UserCheck
} from 'lucide-react';
import { getStreamerScores } from '../../services/streamerScoring';

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
  setActiveTab,
  setSelectedUser,
  setIsUserProfileModalOpen,
  setIsAddStoryModalOpen,
  setActiveStoryView,
  setViewingStream,
  handleInitiateCall,
  handleToggleLikeUserCard,
  handleOpenDirectChat,
  likedUsersMap = {},
  setIsNotificationsOpen,
  setIsSettingsModalOpen,
  setIsVipModalOpen,
  setIsBecomeStreamerModalOpen,
  loc,
  isRtl = true,
  liveMode = 'all', // 'all' | 'normal' | 'adult'
  setLiveMode,
  followedUsers = []
}) {
  // Mode selection: 'all' | 'normal' | 'adult'
  const [internalLiveMode, setInternalLiveMode] = useState(liveMode || 'all');
  const activeMode = setLiveMode ? liveMode : internalLiveMode;
  const handleModeChange = (mode) => {
    if (setLiveMode) setLiveMode(mode);
    setInternalLiveMode(mode);
    // Reset sub-filter to 'all' when switching top mode tabs
    setActiveFilter('all');
  };

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'online' | 'vip' | 'live'

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

  // 2.1 WEEKLY TOP STREAMERS (FOR NORMAL LIVE TAB): Top ranked female streamers
  const weeklyTopStreamers = useMemo(() => {
    const list = [];
    const seen = new Set();
    (usersList || []).forEach(u => {
      if (!u || u.status === 'banned' || u.isBanned) return;
      if (!isFemaleProfile(u)) return;
      const uid = String(u.id || u.username);
      if (seen.has(uid)) return;
      seen.add(uid);

      const score = getStreamerScores(u);
      const level = Number(u.level || u.user_level || score.level || 1);
      const weeklyLikes = Number(u.weekly_likes || u.likes_count || u.likes || 0);
      const giftsCount = Number(u.received_gifts_count || u.gifts_count || 0);

      list.push({
        user: u,
        level,
        weeklyLikes,
        giftsCount,
        score: (level * 100) + weeklyLikes + (giftsCount * 5)
      });
    });

    return list
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [usersList]);

  // 3. MAIN USER LIST (GRID): All Users displayed
  const liveCards = useMemo(() => {
    const activeStreams = (streamsList || []).filter(s => {
      if (!s || s.status === 'ended' || s.is_live === false) return false;
      if (s.is_private || s.isPrivate || s.visibility === 'private') return false;
      return true;
    });

    const cards = [];
    const addedUserIds = new Set();

    // Helper to check if a user is followed by the current user
    const isCardFollowed = (card) => {
      const targetId = card.userId;
      const targetUsername = card.username;
      if (Array.isArray(followedUsers)) {
        if (targetId && followedUsers.includes(targetId)) return true;
        if (targetUsername && followedUsers.includes(targetUsername)) return true;
      }
      try {
        const stored = localStorage.getItem('vlive_user_following_list');
        if (stored) {
          const list = JSON.parse(stored);
          return list.some(u => 
            (targetId && String(u.id) === String(targetId)) ||
            (targetUsername && String(u.username).toLowerCase() === String(targetUsername).toLowerCase())
          );
        }
      } catch (e) {}
      return false;
    };

    // Helper to extract user/streamer level (for top level ranking)
    const getCardLevel = (card) => {
      const u = card.userData;
      if (u?.level && Number(u.level) > 0) return Number(u.level);
      if (u?.user_level && Number(u.user_level) > 0) return Number(u.user_level);
      const score = getStreamerScores(u || card.streamData);
      return score?.level || 1;
    };

    // Add active streams with visibility rules
    activeStreams.forEach(stream => {
      const isAdultStream = Boolean(stream.live_type === 'adult' || stream.isVip18 || stream.is18Plus);
      const hostUser = (usersList || []).find(
        u => String(u.id) === String(stream.host_id) || u.username === stream.host || u.username === stream.username
      );

      const isVerified = Boolean(hostUser?.is_verified || hostUser?.isVerified || hostUser?.verified);
      const isAdmin = Boolean(hostUser?.role === 'admin' || hostUser?.role === 'super_admin' || hostUser?.is_admin || hostUser?.user_type === 'ADMIN' || hostUser?.user_type === 'SUPER_ADMIN');
      const hostLevel = hostUser?.level || hostUser?.user_level || getStreamerScores(hostUser || stream).level || 1;

      // Filter logic: 
      // 1. All users can see normal streams.
      // 2. Only VIP, Admin, or SuperAdmin can see 18+ streams.
      if (isAdultStream && !isVip && !isUserAdmin && !isUserSuperAdmin) {
        return; // Skip this stream
      }

      cards.push({
        id: `stream_${stream.id}`,
        type: 'stream',
        streamData: stream,
        userData: hostUser,
        isLive: true,
        isAdult: isAdultStream,
        isVerified: isVerified,
        isAdmin: isAdmin,
        level: hostLevel,
        title: stream.title || '',
        username: stream.host || stream.username || hostUser?.name || 'Host',
        userId: stream.host_id || hostUser?.id,
        avatar: stream.avatar || stream.thumbnail || hostUser?.avatar,
        thumbnail: stream.thumbnail || stream.avatar || hostUser?.avatar,
        viewers: Number(stream.viewers || 0),
        likes: Number(stream.likes || hostUser?.likes_count || hostUser?.likes || 0),
        age: hostUser?.age || 22,
        distance: hostUser?.distance || '',
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
      const isVerified = Boolean(user.is_verified || user.isVerified || user.verified);
      const isAdmin = Boolean(user.role === 'admin' || user.role === 'super_admin' || user.is_admin || user.user_type === 'ADMIN' || user.user_type === 'SUPER_ADMIN');
      const userLevel = user.level || user.user_level || getStreamerScores(user).level || 1;

      cards.push({
        id: `user_${uid}`,
        type: 'user',
        userData: user,
        isLive: isUserLive,
        isAdult: isAdultUser,
        isVerified: isVerified,
        isAdmin: isAdmin,
        level: userLevel,
        title: user.bio || '',
        username: user.name || user.username || 'User',
        userId: user.id,
        avatar: user.avatar,
        thumbnail: user.avatar,
        viewers: 0,
        likes: Number(user.likes_count || user.likes || 0),
        age: user.age || 21,
        distance: user.distance || '',
        countryFlag: user.country_flag || '🇮🇷',
        isOnline: Boolean(user.online || user.online_status === 'online' || user.status === 'online'),
        isVip: Boolean(user.isVip || user.is_vip || user.vip)
      });
    });

    // Apply Filters & Search
    const filtered = cards.filter(card => {
      // 1. Filter by Active Mode Tabs:
      // Mode 'normal': only normal lives and normal profiles (hide adult 18+)
      if (activeMode === 'normal') {
        if (card.isAdult) return false;
      }
      // Mode 'adult': only adult +18 lives and adult profiles
      else if (activeMode === 'adult') {
        if (!card.isAdult) return false;
      }
      // Mode 'all': shows all female users (both standard & 18+)

      // 2. Sub-filters:
      if (activeFilter === 'online' && !card.isOnline) return false;
      if (activeFilter === 'followed' && !isCardFollowed(card)) return false;
      if (activeFilter === 'live' && !card.isLive) return false;
      if (activeFilter === 'vip' && !card.isVip) return false;

      // 3. Search Query:
      // Search disabled
      
      return true;
    });

    // 4. Sort cards according to activeFilter or default priority:
    return filtered.sort((a, b) => {
      // Filter: برترین (از نظر سطح / رنک کریتور)
      if (activeFilter === 'top_level') {
        const lvlA = getCardLevel(a);
        const lvlB = getCardLevel(b);
        if (lvlB !== lvlA) return lvlB - lvlA;
        return (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0);
      }

      // Filter: محبوب‌ترین (از نظر بیشترین لایک)
      if (activeFilter === 'most_liked') {
        const likesA = Number(a.likes || a.userData?.likes_count || a.userData?.likes || 0);
        const likesB = Number(b.likes || b.userData?.likes_count || b.userData?.likes || 0);
        if (likesB !== likesA) return likesB - likesA;
        return (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0);
      }

      // Filter: داغ (پخش زنده و بیشترین تعامل و بیننده)
      if (activeFilter === 'hot') {
        const scoreA = (a.isLive ? 10000 : 0) + (a.isOnline ? 1000 : 0) + (a.viewers || 0) * 10 + (a.likes || 0);
        const scoreB = (b.isLive ? 10000 : 0) + (b.isOnline ? 1000 : 0) + (b.viewers || 0) * 10 + (b.likes || 0);
        return scoreB - scoreA;
      }

      // Default sorting: Live streams first, then Online users, then VIPs, then others
      if (a.isLive !== b.isLive) return a.isLive ? -1 : 1;
      if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
      if (a.isVip !== b.isVip) return a.isVip ? -1 : 1;
      return 0;
    });
  }, [streamsList, usersList, activeMode, activeFilter, loc, followedUsers]);

  return (
    <div className="relative w-full max-w-4xl mx-auto space-y-3 pb-24 select-none text-slate-100 font-sans">
      
      {/* Dark Atmospheric Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-900/15 rounded-full blur-[100px]" />
      </div>

      {/* SEARCH BAR (WHEN SEARCH TAB IS ACTIVE) */}
      {/* Search disabled */}

      {/* =========================================================================
          1. STORIES ROW (HORIZONTAL SCROLL) - ABOVE TABS
         ========================================================================= */}
      {activeMode === 'all' && femaleStories.length > 0 && (
        <div className="relative z-10 pb-2">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar px-1">
            {/* Female Story Ring Avatars - With Soft 3D Shadow */}
            {femaleStories.map(group => {
              const isGroupVip = group.user?.isVip;
              return (
                <div
                  key={group.id}
                  onClick={() => setActiveStoryView({ group, currentIndex: 0 })}
                  className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
                >
                  <div className="relative">
                    {/* Circle Image with 3D Soft Shadow (Removed outer colored ring padding) */}
                    <div className={`w-14 h-14 rounded-full transition-all duration-300 group-hover:scale-105 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.6),0_6px_10px_-3px_rgba(244,63,94,0.3)] bg-slate-900 border border-white/10`}>
                      <div className="w-full h-full rounded-full overflow-hidden">
                        {group.user?.avatar ? (
                          <img
                            src={group.user.avatar}
                            alt={group.user.name || group.user.username}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-sm font-black text-rose-300">
                            {(group.user?.name || group.user?.username || 'F').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* VIP Crown */}
                    {isGroupVip && (
                      <div className="absolute -top-1 -right-1 z-10 w-4 h-4 rounded-full bg-gradient-to-tr from-amber-300 to-amber-500 shadow-md flex items-center justify-center pointer-events-none">
                        <Crown className="w-2.5 h-2.5 text-slate-950 fill-slate-950" />
                      </div>
                    )}

                    {/* Unread Counter Badge */}
                    {group.items.length > 1 && (
                      <div className="absolute -bottom-1 -left-1 z-10 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black border-2 border-slate-950 flex items-center justify-center shadow-sm">
                        {group.items.length}
                      </div>
                    )}
                  </div>

                  <span className={`text-[10px] font-bold max-w-[56px] truncate text-center ${
                    isGroupVip ? 'text-amber-300' : 'text-slate-300'
                  }`}>
                    {group.user?.name || group.user?.username}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          2. THREE MODE TABS (CLEAN & CONCISE)
         ========================================================================= */}
      <div className="relative z-10 rounded-2xl bg-slate-950/85 backdrop-blur-2xl border border-white/10 p-1 mb-2">
        <div className="grid grid-cols-3 gap-1">
          {/* Tab 1: All */}
          <button
            onClick={() => handleModeChange('all')}
            className={`py-3 px-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
              activeMode === 'all'
                ? 'bg-gradient-to-r from-emerald-950/60 via-emerald-600/40 to-teal-950/60 border border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'hover:bg-white/5'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${activeMode === 'all' ? 'text-emerald-300' : 'text-slate-500'}`} />
          </button>

          {/* Tab 2: Live */}
          <button
            onClick={() => handleModeChange('normal')}
            className={`py-3 px-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
              activeMode === 'normal'
                ? 'bg-gradient-to-r from-cyan-900/50 via-cyan-600/40 to-blue-900/50 border border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'hover:bg-white/5'
            }`}
          >
            <Radio className={`w-5 h-5 ${activeMode === 'normal' ? 'text-cyan-300 animate-pulse' : 'text-slate-500'}`} />
          </button>

          {/* Tab 3: 18+ */}
          <button
            onClick={() => handleModeChange('adult')}
            className={`py-3 px-2 rounded-xl flex items-center justify-center transition-all duration-300 ${
              activeMode === 'adult'
                ? 'bg-gradient-to-r from-rose-950/70 via-red-600/50 to-pink-950/70 border border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                : 'hover:bg-white/5'
            }`}
          >
            <ShieldAlert className={`w-5 h-5 ${activeMode === 'adult' ? 'text-rose-400' : 'text-slate-500'}`} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. WEEKLY TOP STREAMERS BAR (FOR NORMAL LIVE TAB)
         ========================================================================= */}
      {activeMode === 'normal' && weeklyTopStreamers.length > 0 && (
        <div className="relative z-10 bg-slate-950/70 backdrop-blur-xl rounded-2xl p-2.5 border border-cyan-500/20 shadow-md">
          <div className="flex items-center justify-between pb-1.5 px-1">
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <h3 className="text-xs font-black text-cyan-200 tracking-wide">
                {loc('برترین استریمرهای هفتگی', 'Weekly Top Streamers')}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-cyan-400 font-mono">
              TOP 10
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar px-1">
            {weeklyTopStreamers.map((item, idx) => {
              const u = item.user;
              const isOnline = Boolean(u.online || u.isOnline || u.online_status === 'online');
              const rank = idx + 1;
              const rankColor = rank === 1 ? 'from-amber-300 via-yellow-400 to-amber-600 shadow-[0_0_12px_rgba(245,158,11,0.5)]' :
                                rank === 2 ? 'from-slate-200 via-gray-300 to-slate-400 shadow-[0_0_10px_rgba(203,213,225,0.4)]' :
                                rank === 3 ? 'from-amber-600 via-orange-600 to-amber-800 shadow-[0_0_10px_rgba(217,119,6,0.4)]' :
                                'from-cyan-500 to-blue-600';

              return (
                <div
                  key={u.id || u.username}
                  onClick={() => {
                    setSelectedUser(u);
                    setIsUserProfileModalOpen(true);
                  }}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                >
                  <div className="relative">
                    {/* Rank Badge */}
                    <div className={`absolute -top-1.5 -left-1.5 z-20 w-4 h-4 rounded-full flex items-center justify-center font-black text-[8.5px] text-slate-950 shadow-md ${
                      rank === 1 ? 'bg-gradient-to-r from-amber-300 to-yellow-400 ring-1 ring-amber-200' :
                      rank === 2 ? 'bg-gradient-to-r from-slate-200 to-slate-300 ring-1 ring-white' :
                      rank === 3 ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white ring-1 ring-amber-400' :
                      'bg-cyan-600 text-white'
                    }`}>
                      {rank}
                    </div>

                    {/* Avatar Ring */}
                    <div className={`w-11 h-11 rounded-2xl p-[1.5px] bg-gradient-to-tr ${rankColor} group-hover:scale-105 transition-all duration-300`}>
                      <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950">
                        {u.avatar ? (
                          <img
                            src={u.avatar}
                            alt={u.name || u.username}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-black text-cyan-300">
                            {(u.name || u.username || 'S').charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Online Dot */}
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 z-10 w-3 h-3 rounded-full bg-slate-950 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)] animate-pulse" />
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-slate-200 group-hover:text-cyan-300 max-w-[56px] truncate text-center">
                    {u.name || u.username}
                  </span>
                  <span className="text-[8.5px] font-mono font-bold text-cyan-400 -mt-0.5">
                    Lv.{item.level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          3. VIP CAROUSEL
         ========================================================================= */}
      {vipFemaleUsers.length > 0 && (
        <div className="relative z-10 bg-slate-950/70 backdrop-blur-xl rounded-2xl p-2.5 border border-amber-500/20 shadow-md">
          <div className="flex items-center justify-between pb-1.5 px-1">
            <div className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <h3 className="text-xs font-black text-amber-300 tracking-wide">
                VIP
              </h3>
            </div>
            <button
              onClick={() => setIsVipModalOpen(true)}
              className="text-[10px] font-bold text-amber-400 hover:text-amber-200 flex items-center gap-0.5"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar px-1">
            {vipFemaleUsers.map(user => {
              const isOnline = Boolean(user.online || user.isOnline || user.online_status === 'online');
              return (
                <div
                  key={user.id || user.username}
                  onClick={() => {
                    setSelectedUser(user);
                    setIsUserProfileModalOpen(true);
                  }}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                >
                  <div className="relative">
                    {/* Gold Frame */}
                    <div className="w-13 h-13 rounded-2xl p-[1.5px] bg-gradient-to-b from-amber-300 via-yellow-500 to-orange-600 shadow-[0_0_12px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-all duration-300">
                      <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950">
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

                    {/* Online Status Dot */}
                    {isOnline && (
                      <div className="absolute -bottom-0.5 -left-0.5 z-10 w-3 h-3 rounded-full bg-slate-950 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)] animate-pulse" />
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-bold text-amber-300 group-hover:text-white max-w-[56px] truncate text-center">
                    {user.name || user.username}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          4. MAIN USER LIST (GRID) WITH DEDICATED SUB-FILTERS
         ========================================================================= */}
      <div className="relative z-10 space-y-2.5">
        {/* Header & Sub-filter Chips Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-rose-300 font-bold">
              {liveCards.length}
            </span>
          </div>

          {/* Sub-filters Chips Bar: Exclusively visible in 'همه' (All) Tab */}
          {activeMode === 'all' && (
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'all', label: loc('همه', 'All'), icon: Sparkles },
                { id: 'online', label: loc('آنلاین', 'Online'), isDot: true },
                { id: 'top_level', label: loc('برترین', 'Top Rank'), icon: Trophy },
                { id: 'hot', label: loc('داغ', 'Hot'), icon: Flame },
                { id: 'most_liked', label: loc('محبوب‌ترین', 'Most Popular'), icon: Heart },
                { id: 'followed', label: loc('فالو', 'Following'), icon: UserCheck }
              ].map(f => {
                const IconComp = f.icon;
                const isSelected = activeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md scale-[1.02]'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {f.isDot && (
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-400 animate-pulse'}`} />
                    )}
                    {IconComp && <IconComp className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-400'}`} />}
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User Cards Grid */}
        {liveCards.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-white/5 space-y-2">
            <Radio className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
            <p className="text-xs text-slate-500">
              {activeFilter === 'followed'
                ? loc('شما هنوز هیچ کاربری را فالو نکرده‌اید.', 'You are not following any users yet.')
                : loc('موردی با این فیلتر یافت نشد', 'No items found for this filter')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
            {liveCards.map(card => {
              const isStreaming = card.isLive;
              const isAdult = card.isAdult;
              const isVerifiedUser = card.isVerified;
              const isAdminUser = card.isAdmin;
              const cardLevel = card.level || 1;
              
              const isStreamLocked = isAdult && !isVip && !isUserAdmin && !isUserSuperAdmin;

              const handleCardMainClick = () => {
                if (isStreamLocked) {
                  if (setIsVipModalOpen) setIsVipModalOpen(true);
                  return;
                }
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
              };

              return (
                <div
                  key={card.id}
                  className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-white/10 hover:border-rose-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:-translate-y-0.5"
                >
                  {/* Aspect Ratio 3:4 Thumbnail Container */}
                  <div 
                    onClick={handleCardMainClick}
                    className="aspect-[3/4] relative overflow-hidden cursor-pointer"
                  >
                    {card.thumbnail ? (
                      <img
                        src={card.thumbnail}
                        alt={card.username}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isStreamLocked ? 'filter blur-md scale-105' : 'group-hover:scale-105'
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 font-bold text-sm">
                        {card.username.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Locked +18 Overlay */}
                    {isStreamLocked && (
                      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 text-center z-15">
                        <div className="w-8 h-8 rounded-full bg-rose-600/30 border border-rose-500/60 flex items-center justify-center mb-1">
                          <Lock className="w-3.5 h-3.5 text-rose-300" />
                        </div>
                        <span className="text-[9px] font-black text-rose-200">
                          VIP 18+
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* LIVE badge */}
                    {isStreaming && (
                      <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-600 text-[8px] font-black text-white shadow animate-pulse pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        <span>LIVE</span>
                        {isAdult && <span className="text-[7px]">18+</span>}
                      </div>
                    )}

                    {/* Top Right Badges */}
                    <div className="absolute top-2 right-2 z-20 flex items-center gap-1 pointer-events-none flex-wrap justify-end">
                      {/* Level Badge (Highlighted for Top Level or level > 1) */}
                      {cardLevel > 1 && (
                        <div className="px-1 py-0.2 rounded bg-indigo-600/90 text-white text-[7.5px] font-black shadow flex items-center gap-0.5">
                          <span>Lv.{cardLevel}</span>
                        </div>
                      )}

                      {/* Admin Badge */}
                      {isAdminUser && (
                        <div className="p-0.5 rounded-md bg-purple-600 text-white shadow">
                          <ShieldCheck className="w-3 h-3" />
                        </div>
                      )}

                      {/* VIP Badge */}
                      {card.isVip && (
                        <div className="px-1 py-0.2 rounded bg-amber-400 text-slate-950 text-[7.5px] font-black shadow">
                          VIP
                        </div>
                      )}

                      {/* Verified Badge */}
                      {isVerifiedUser && (
                        <div className="p-0.5 rounded-full bg-cyan-500 text-white shadow">
                          <CheckCircle2 className="w-3 h-3 text-white fill-cyan-400" />
                        </div>
                      )}

                      {/* Online Status Dot */}
                      <span className={`w-2 h-2 rounded-full ${card.isOnline ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)]' : 'bg-slate-600'}`} />
                    </div>

                    {/* Bottom Info on Thumbnail: Username + Age + Flag */}
                    <div className="absolute bottom-1.5 left-2 right-2 z-10 space-y-0.5 text-right dir-rtl pointer-events-none">
                      <div className="flex items-center gap-1 text-white font-black text-xs drop-shadow truncate">
                        <span className="truncate">{card.username}</span>
                        {card.age && <span className="text-rose-300 font-mono text-[10px]">,{card.age}</span>}
                        <span className="text-[11px]">{card.countryFlag}</span>
                      </div>
                      {card.title ? (
                        <p className="text-[9px] text-slate-300/80 truncate font-normal">
                          {card.title}
                        </p>
                      ) : null}
                      {/* Likes count indicator when most_liked is selected or user has likes */}
                      {activeFilter === 'most_liked' && card.likes > 0 && (
                        <div className="flex items-center gap-0.5 text-rose-300 text-[8.5px] font-bold">
                          <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                          <span>{card.likes.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-1.5 bg-slate-950 border-t border-white/5 flex items-center gap-1">
                    {/* Heart Like Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (handleToggleLikeUserCard) {
                          handleToggleLikeUserCard(card.userId, e);
                        }
                      }}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all active:scale-90 shrink-0 ${
                        likedUsersMap[card.userId]
                          ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                          : 'bg-white/5 hover:bg-rose-500/10 border-white/5 text-slate-400 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedUsersMap[card.userId] ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                    </button>

                    {/* Message Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const targetUser = card.userData || {
                          id: card.userId,
                          name: card.username,
                          username: card.username,
                          avatar: card.avatar
                        };
                        if (handleOpenDirectChat) {
                          handleOpenDirectChat(targetUser);
                        } else if (setActiveTab) {
                          setActiveTab('messages');
                        }
                      }}
                      className="w-7 h-7 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-all active:scale-90 shrink-0"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    {/* Action Button: Live or Call */}
                    {isStreaming ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isStreamLocked) {
                            if (setIsVipModalOpen) setIsVipModalOpen(true);
                            return;
                          }
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
                        className={`flex-1 h-7 rounded-lg font-black text-[10px] flex items-center justify-center gap-1 transition-all active:scale-95 ${
                          isStreamLocked
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow animate-pulse'
                        }`}
                      >
                        {isStreamLocked ? (
                          <>
                            <Lock className="w-3 h-3" />
                            <span>VIP</span>
                          </>
                        ) : (
                          <>
                            <Radio className="w-3 h-3" />
                            <span>{loc('لایو', 'Live')}</span>
                          </>
                        )}
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
                        className="flex-1 h-7 rounded-lg font-black text-[10px] flex items-center justify-center gap-1 transition-all active:scale-95 bg-cyan-600/80 hover:bg-cyan-500 text-white"
                      >
                        <Video className="w-3 h-3" />
                        <span>{loc('تماس', 'Call')}</span>
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
          5. “START LIVE” FAB (ADMIN & APPROVED FEMALE STREAMERS ONLY)
         ========================================================================= */}
      {canAccessBroadcasting && (
        <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2.5 pointer-events-auto">
          <button
            onClick={() => {
              if (handleOpenLiveBroadcast) {
                handleOpenLiveBroadcast();
              }
            }}
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.7)] border border-white/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            <span>{loc('شروع لایو', 'Start Live')}</span>
          </button>
        </div>
      )}

    </div>
  );
}
