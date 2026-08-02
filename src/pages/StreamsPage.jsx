import React from 'react';
import {
  AlertTriangle,
  Award,
  BadgeCheck,
  Ban,
  Bot,
  Calendar,
  CheckCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  Crown,
  DollarSign,
  Eye,
  Flame,
  Gem,
  Gift,
  Globe,
  Heart,
  History,
  Image,
  Lock,
  MapPin,
  MessageSquare,
  Mic,
  MicOff,
  MoreVertical,
  Paperclip,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
  Pin,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Shuffle,
  Sliders,
  Smile,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  Video,
  VolumeX,
  Zap
} from 'lucide-react';
import CoinsIcon from '../components/CoinsIcon';
import { VerifiedBadge, VipStatusBadge } from './ProfilePage';

export default function StreamsPage({
  isRtl,
  loc,
  t,
  userCoins,
  setActiveTab,
  setIsVipModalOpen,
  setIsLevelUpModalOpen,
  userLevel,
  equippedBadge,
  userRole,
  streamSubTab,
  setStreamSubTab,
  streamCategoryFilter,
  setStreamCategoryFilter,
  streamSearchQuery,
  setStreamSearchQuery,
  liveStreamsList,
  setLiveStreamsList,
  handleStartLiveStream,
  setIsAddStoryModalOpen,
  advancedStories,
  handleDeleteUserStoryItem,
  handleUserStoryClick,
  posts,
  setIsAddPostModalOpen,
  showToast,
  handleStartPrivateCall,
  setIsGiftCatalogOpen,
  currentUsername,
  userAvatar,
  userName,
  setIsLanguageModalOpen,
  setIsDepositModalOpen,
  setIsWithdrawModalOpen,
  ...props
}) {
  return (
          <div className="space-y-6">

            {/* 1. SUB-HEADER / QUICK STATS BAR (زیر Header) */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-md overflow-x-auto no-scrollbar">
              {/* 👛 Coins Counter */}
              <button 
                onClick={() => setActiveTab('wallet')}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition active:scale-95 shrink-0"
              >
                <CoinsIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
                <span className="text-[11px] sm:text-xs font-black">{userCoins.toLocaleString()} {loc('سکه', 'Coins')}</span>
              </button>

              {/* 👑 VIP Badge */}
              <button 
                onClick={() => setIsVipModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 hover:scale-105 transition active:scale-95 shadow-sm shrink-0"
              >
                <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 fill-amber-400/30" />
                <span className="text-[11px] sm:text-xs font-black">👑 {loc('اشتراک VIP', 'VIP Club')}</span>
              </button>

              {/* 🔥 Online Counter */}
              <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-bold shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>🔥 {loc('۱۴,۰۰۰ کاربر آنلاین', '14,000 Online')}</span>
              </div>
            </div>

            {/* Quick Live Search Bar (If Toggled) */}
            {(isChatSearchOpen || homeSearchQuery) && (
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={homeSearchQuery}
                  onChange={e => setHomeSearchQuery(e.target.value)}
                  placeholder={loc('جستجوی نام استریمر، شناسه، شهر یا موضوع لایو...', 'Search live streamer name, ID, city, or topic...')}
                  className="w-full pr-10 pl-10 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 shadow-inner"
                />
                {homeSearchQuery && (
                  <button 
                    onClick={() => setHomeSearchQuery('')}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* 1.5 LIVE STORIES HORIZONTAL SLIDER */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-slate-300 px-1">
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-pink-500 animate-pulse" /> {loc('استوری‌های زنده', 'Live Stories')}</span>
                <span className="text-[11px] text-pink-400 font-bold cursor-pointer hover:underline" onClick={() => { setProfileSubPage('stories'); setActiveTab('profile'); }}>{loc('مشاهده همه', 'View All')}</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-1.5 no-scrollbar">
                {/* Add Story Button */}
                <button 
                  onClick={() => setIsCreateStoryOpen(true)}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                >
                  <div className="relative w-14 h-14 rounded-full border-2 border-dashed border-pink-500/60 p-0.5 flex items-center justify-center bg-slate-900 group-hover:scale-105 transition shadow-md">
                    <img src={userAvatar} alt="My Story" className="w-full h-full object-cover rounded-full opacity-60" />
                    <div className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 max-w-[60px] truncate">{loc('استوری شما', 'Your Story')}</span>
                </button>

                {/* Live Streamers Stories */}
                {usersList.slice(0, 10).map((u, idx) => (
                  <button 
                    key={u.id || u.username || idx}
                    onClick={() => {
                      setSelectedStreamerForProfile(u);
                      setIsProfileModalOpen(true);
                    }}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className="relative w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 group-hover:scale-105 transition shadow-lg shadow-pink-500/20">
                      <img src={u.avatar} alt={u.name} className="w-full h-full object-cover rounded-full border-2 border-slate-950" />
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full border border-slate-950 uppercase shadow">
                        LIVE
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 max-w-[64px] truncate">{u.name || u.username}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 1.8 QUICK ACTIONS GRID */}
            <div className="grid grid-cols-4 gap-2.5 p-3 rounded-3xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-xl">
              <button 
                onClick={() => setIsLiveModalOpen(true)}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-pink-600/20 to-rose-600/20 border border-pink-500/40 text-pink-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-md shadow-pink-600/30 group-hover:scale-110 transition">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('شروع لایو', 'Go Live')}</span>
              </button>

              <button 
                onClick={() => setActiveTab('match')}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/40 text-purple-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30 group-hover:scale-110 transition">
                  <Flame className="w-4 h-4 fill-white" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('مچ‌یابی', 'Match')}</span>
              </button>

              <button 
                onClick={() => setStreamSubTab('party')}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/40 text-cyan-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/30 group-hover:scale-110 transition">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('اتاق پارتی', 'Party Stage')}</span>
              </button>

              <button 
                onClick={() => setIsVipModalOpen(true)}
                className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-br from-amber-600/20 to-yellow-600/20 border border-amber-500/40 text-amber-300 hover:scale-105 active:scale-95 transition group"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30 group-hover:scale-110 transition font-black">
                  <Crown className="w-4 h-4 fill-slate-950" />
                </div>
                <span className="text-[10px] font-black mt-1 text-white">{loc('باشگاه VIP', 'VIP Club')}</span>
              </button>
            </div>

            {/* 2. HORIZONTAL CATEGORY SCROLL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                <span>Categories & Channels</span>
                <span className="text-pink-400 font-mono">10 Active Channels</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                  { id: 'all', label: '🌍 All', count: '2.8K' },
                  { id: 'trending', label: '🔥 Trending', count: '940' },
                  { id: 'gaming', label: '🎮 Gaming', count: '410' },
                  { id: 'music', label: '🎵 Music', count: '320' },
                  { id: 'dance', label: '💃 Dance', count: '280' },
                  { id: 'singing', label: '🎤 Singing', count: '210' },
                  { id: 'chat', label: '💬 Chat', count: '550' },
                  { id: 'education', label: '🎓 Education', count: '130' },
                  { id: 'dating', label: '❤️ Dating', count: '380' },
                  { id: 'vip', label: '👑 VIP 18+', count: '180' }
                ].map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setStreamModeFilter(cat.id)}
                    className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 border transition-all flex items-center gap-1.5 ${streamModeFilter === cat.id ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-105' : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'}`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${streamModeFilter === cat.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. TRENDING LIVE (کارت‌های بزرگ استریم) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-pink-500 animate-pulse" />
                  {loc('استریم‌های زنده داغ', 'Trending Live Streams')}
                </h3>
                <span className="text-xs text-pink-400 font-bold cursor-pointer" onClick={() => setStreamSubTab('lives')}>{loc('مشاهده همه', 'View All')}</span>
              </div>

                {/* Stream Cards Horizontal Slider */}
                <div className="flex items-center gap-4 overflow-x-auto pb-2.5 no-scrollbar">
                  {streamsList
                    .filter(s => {
                      if (homeSearchQuery) {
                        const q = homeSearchQuery.toLowerCase();
                        return s.title.toLowerCase().includes(q) || s.host.toLowerCase().includes(q);
                      }
                      if (streamModeFilter === 'vip') return s.isVip18;
                      return true;
                    })
                    .map(stream => (
                      <div 
                        key={stream.id} 
                        className="w-72 sm:w-80 shrink-0 card-3d rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/90 group hover:border-pink-500/50 transition duration-300 flex flex-col shadow-xl"
                      >
                        {/* Thumbnail Container */}
                        <div className="relative aspect-video overflow-hidden bg-slate-950">
                          <img 
                            src={stream.thumbnail} 
                            alt={stream.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                          {/* Top Left: LIVE Badge & VIP Status */}
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-lg border border-red-400/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                              LIVE
                            </span>
                            {(stream.is_vip || stream.isVip || stream.isVip18) && (
                              <VipStatusBadge size="small" showText={true} />
                            )}
                          </div>

                          {/* Top Right: Viewers Count */}
                          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-200 flex items-center gap-1 border border-slate-800 shadow-md">
                            <Eye className="w-3 h-3 text-cyan-400" />
                            <span>👁 {(stream.viewers || 2300).toLocaleString()}</span>
                          </div>

                          {/* Bottom Left / Details Overlay */}
                          <div className="absolute bottom-3 left-3 right-3 space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-white">
                              <div className="flex items-center gap-1.5">
                                <span>👤 {stream.host}</span>
                                <VerifiedBadge className="w-3.5 h-3.5" />
                                {(stream.is_vip || stream.isVip || stream.isVip18) && (
                                  <VipStatusBadge size="small" showText={false} />
                                )}
                              </div>
                              <span className="text-[10px] text-pink-300 font-mono flex items-center gap-0.5 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800">
                                <Clock className="w-2.5 h-2.5 text-pink-400" />
                                ⏱ 45m
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-300 font-medium line-clamp-1">
                              {stream.title}
                            </p>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                              <span className="flex items-center gap-1 text-pink-400 font-semibold">
                                <MapPin className="w-3 h-3" />
                                📍 {loc('تهران', 'Tehran')}
                              </span>
                              <span>•</span>
                              <span className="text-amber-300 flex items-center gap-0.5">
                                <Gift className="w-3 h-3 text-amber-400" />
                                {loc('۱.۴ هزار هدیه', '1.4K Gifts')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="p-3 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {loc('ورودی:', 'Fee:')} {stream.entryFee > 0 ? `${stream.entryFee} ${loc('سکه', 'coins')}` : loc('رایگان', 'FREE')}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Boost Stream Button */}
                            <button 
                              onClick={() => {
                                if (userCoins < 100) {
                                  showToast(loc('برای بوست لایو به ۱۰۰ سکه نیاز دارید', '100 coins required to Boost live stream'));
                                  return;
                                }
                                setUserCoins(prev => prev - 100);
                                showToast(loc(`لایو ${stream.host} با موفقیت بوست شد!`, `Live stream by ${stream.host} Boosted to top!`));
                              }}
                              className="p-1.5 px-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[10px] font-bold flex items-center gap-1"
                              title="Boost Live to Top (100 coins)"
                            >
                              <Zap className="w-3.5 h-3.5 text-amber-400" />
                              {loc('بوست ⚡', 'Boost ⚡')}
                            </button>

                            {/* Watch Live Button */}
                            <button 
                              onClick={() => handleTryEnterStream(stream)}
                              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              {loc('ورود به لایو', 'Enter Live')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            {/* DISCOVER & SEARCH APPROVED USERS SUBTAB */}
            {streamSubTab === 'users' && (
              <div className="space-y-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
                {/* Search Bar & Filter Controls */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                  <div className="relative">
                    <Search className="w-4 h-4 text-pink-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      value={homeSearchQuery}
                      onChange={e => setHomeSearchQuery(e.target.value)}
                      placeholder={loc('جستجوی کاربران تأییدشده دیتابیس (نام، شهر، بیو)...', 'Search approved database users (name, city, bio)...')}
                      className="w-full pr-10 pl-10 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500 shadow-inner"
                    />
                    {homeSearchQuery && (
                      <button onClick={() => setHomeSearchQuery('')} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {[
                      { id: 'all', label: loc('🌍 همه کاربران', '🌍 All Users') },
                      { id: 'online', label: loc('🟢 آنلاین‌ها', '🟢 Online') },
                      { id: 'top', label: loc('👑 برترین‌ها', '👑 Top Hosts') },
                      { id: 'verified', label: loc('✅ تأییدشده‌ها', '✅ Verified') }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setUserFilter(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition ${userFilter === f.id ? 'bg-pink-600 text-white border-pink-400 shadow' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'}`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Approved User Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {usersList
                    .filter(u => u.status === 'approved' || u.isApproved !== false)
                    .filter(u => u.username !== currentUsername)
                    .filter(u => {
                      if (homeSearchQuery) {
                        const q = homeSearchQuery.toLowerCase();
                        return (u.name && u.name.toLowerCase().includes(q)) || 
                               (u.username && u.username.toLowerCase().includes(q)) || 
                               (u.city && u.city.toLowerCase().includes(q)) || 
                               (u.bio && u.bio.toLowerCase().includes(q));
                      }
                      if (userFilter === 'online') return true; // Everyone is online for now
                      if (userFilter === 'top') return u.isTop || u.is_vip || u.isVip;
                      if (userFilter === 'verified') return u.isVerified || u.is_verified;
                      return true;
                    })
                    .map(u => (
                      <div key={u.id || u.username} className="card-3d p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-pink-500/50 transition flex flex-col justify-between space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-pink-500/60 shrink-0">
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            {u.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />}
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-1">
                              <h4 className="text-xs font-black text-white truncate">{u.name || u.username}</h4>
                              <VerifiedBadge className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[10px] text-pink-400 font-bold">@{u.username}</p>
                            <span className="text-[9px] text-slate-400 font-medium">📍 {u.city || 'Tehran'}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 line-clamp-2 italic">"{u.bio || 'استریمر تأییدشده V.Live+'}"</p>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <span className="text-[10px] font-mono text-amber-400 font-bold">🪙 {(u.coins || 5000).toLocaleString()}</span>
                          <button
                            onClick={() => {
                              setSelectedHostForCall({
                                name: u.name,
                                username: u.username,
                                avatar: u.avatar,
                                role: u.role || 'VIP Host',
                                isVerified: true,
                                online: u.online !== false,
                                isVip: u.isVip !== false
                              });
                              setIsDirectCallModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-[11px] shadow hover:scale-105 active:scale-95 transition"
                          >
                            {loc('تماس / چت', 'Call / Chat')}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {streamSubTab === 'party' && (
              <div className="space-y-4">
                <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-pink-900/40 border border-purple-500/40 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      {loc('استیج پارتی چندنفره صوتی و تصویری', 'Multi-Guest Voice & Video Party Stage')}
                    </h3>
                    <p className="text-[10px] text-purple-300">{loc('روی استیج بنشینید، با میزبان چت کنید و هدیه گروهی بفرستید', 'Take a seat on stage, chat with hosts & send group gifts')}</p>
                  </div>

                  <button 
                    onClick={() => {
                      const newRoom = {
                        id: `party_${Date.now()}`,
                        title: loc(`اتاق VIP ${userName}`, `${userName}'s VIP Lounge`),
                        hostName: userName,
                        hostAvatar: userAvatar,
                        totalSeats: 9,
                        occupiedSeats: 1,
                        seats: Array.from({ length: 9 }).map((_, i) => ({
                          index: i,
                          user: i === 0 ? userName : null,
                          avatar: i === 0 ? userAvatar : null,
                          isHost: i === 0,
                          isMuted: false
                        }))
                      };
                      setPartyRoomsList(prev => [newRoom, ...prev]);
                      setActivePartyRoom(newRoom);
                      setMySeatIndex(0);
                      showToast(loc('اتاق پارتی شما با موفقیت ساخته شد!', 'Your Party Lounge has been created!'));
                    }}
                    className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 shrink-0 hover:brightness-110 active:scale-95 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {loc('ساخت اتاق پارتی', 'Create Party Room')}
                  </button>
                </div>

                {/* Party Rooms Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partyRoomsList.map(room => (
                    <div key={room.id} className="card-3d p-4 rounded-3xl border border-purple-500/30 bg-slate-900/90 space-y-3">
                      <div className="flex items-center gap-3">
                        <img src={room.hostAvatar} alt={room.hostName} className="w-12 h-12 rounded-2xl object-cover border-2 border-purple-500 shadow-md shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{room.title}</h4>
                          <p className="text-[10px] text-purple-300">{loc('میزبان:', 'Host:')} @{room.hostName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30 text-[9px] font-bold">
                              {room.occupiedSeats} / {room.totalSeats} {loc('صندلی پر است', 'Seats Occupied')}
                            </span>
                            <span className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {loc('اتاق فعال', 'Active Lounge')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mini Seats Preview Grid */}
                      <div className="flex items-center gap-1.5 bg-slate-950 p-2.5 rounded-2xl overflow-x-auto border border-slate-800">
                        {room.seats.map((seat, idx) => (
                          <div key={idx} className="w-8 h-8 rounded-full border border-purple-500/40 bg-slate-900 flex items-center justify-center shrink-0 overflow-hidden relative">
                            {seat.avatar ? (
                              <img src={seat.avatar} alt="Seat" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[9px] text-slate-500 font-bold">#{idx + 1}</span>
                            )}
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => setActivePartyRoom(room)}
                        className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        {loc('ورود به استیج و نشستن', 'Enter Stage & Take Seat')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REDESIGNED ADVANCED DAILY MISSIONS & REWARDS CENTER */}
            {streamSubTab === 'quests' && (
              <div className="space-y-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
                
                {/* 1. TOP HEADER & PROGRESS METER */}
                <div className="card-3d p-5 rounded-3xl bg-gradient-to-br from-cyan-950/60 via-slate-900 to-purple-950/60 border border-cyan-500/40 space-y-4 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-500 p-0.5 shadow-lg shadow-cyan-500/20">
                        <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                          <Target className="w-6 h-6 text-cyan-400" />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          🎯 مأموریت‌های روزانه (Daily Missions)
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                            Season Pass
                          </span>
                        </h2>
                        <p className="text-xs text-slate-300 mt-0.5">مأموریت‌ها را انجام دهید، سکه، الماس و پاداش‌های VIP آزاد کنید!</p>
                      </div>
                    </div>

                    {/* Streak & Level Info Pill */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <div className="px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 text-amber-300 text-xs font-black shadow-md">
                        <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
                        <span>{loginStreakDays} روز استریک متوالی</span>
                      </div>
                      <div className="px-3 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-1.5 text-purple-300 text-xs font-black shadow-md">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span>Level {userLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Daily Completion Progress Bar & XP Level Pass */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 relative z-10">
                    {/* Missions Completion Rate */}
                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">پیشرفت کل مأموریت‌ها:</span>
                        <span className="font-black font-mono text-cyan-400">
                          {allMissions.filter(m => m.completed).length} / {allMissions.length} (
                          {Math.round((allMissions.filter(m => m.completed).length / allMissions.length) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                          style={{ width: `${(allMissions.filter(m => m.completed).length / allMissions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Level XP Meter */}
                    <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-300">امتیاز تجربی (Level Pass XP):</span>
                        <span className="font-black font-mono text-purple-400">{userXP} / {userMaxXP} XP</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                          style={{ width: `${(userXP / userMaxXP) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 30-DAY DAILY LOGIN REWARD CALENDAR */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-black text-white">تقویم ۳۰ روزه جایزه ورود روزانه (Daily Login Calendar)</h3>
                    </div>
                    <button
                      onClick={handleClaimDailyCheckIn}
                      disabled={claimedCheckInDays.includes(todayCheckInDay)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1 shadow-md ${claimedCheckInDays.includes(todayCheckInDay) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'btn-neon-pink animate-pulse'}`}
                    >
                      <Gift className="w-3.5 h-3.5" />
                      <span>{claimedCheckInDays.includes(todayCheckInDay) ? 'ورود امروز ثبت شد ✅' : 'دریافت جایزه امروز 🎁'}</span>
                    </button>
                  </div>

                  {/* Horizontal Scrollable Days */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                      const isClaimed = claimedCheckInDays.includes(day);
                      const isToday = day === todayCheckInDay;
                      const isMilestone = day === 7 || day === 14 || day === 21 || day === 30;

                      return (
                        <div
                          key={day}
                          className={`flex flex-col items-center justify-between p-2 rounded-2xl min-w-[70px] h-24 border transition shrink-0 relative overflow-hidden ${
                            isToday ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-2 ring-amber-400/50' :
                            isClaimed ? 'bg-slate-950/80 border-slate-800 opacity-60' :
                            isMilestone ? 'bg-purple-950/40 border-purple-500/50' : 'bg-slate-950 border-slate-800'
                          }`}
                        >
                          {isMilestone && (
                            <span className="absolute top-0 right-0 left-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[8px] font-black text-center py-0.5 uppercase">
                              {day === 7 ? '🎨 Frame' : day === 14 ? '👑 VIP' : day === 21 ? '💎 50' : '🏆 Badge'}
                            </span>
                          )}

                          <span className="text-[10px] font-bold text-slate-400 mt-1">روز {day}</span>
                          
                          <div className="my-1">
                            {isClaimed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : isMilestone ? (
                              <Crown className="w-5 h-5 text-amber-300 animate-pulse" />
                            ) : (
                              <Coins className="w-5 h-5 text-amber-400" />
                            )}
                          </div>

                          <span className="text-[9px] font-black text-white font-mono">
                            +{day * 10 + 30} 🪙
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. BONUS LUCKY MISSION & MYSTERY CHESTS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Daily Bonus Lucky Mission */}
                  <div className="card-3d p-3.5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900 border border-purple-500/40 space-y-2 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-purple-300 flex items-center gap-1 bg-purple-500/20 px-2 py-0.5 rounded-lg border border-purple-500/30">
                        🎲 مأموریت شانس روزانه
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">+{bonusMission.rewardCoins} 🪙</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{bonusMission.title}</h4>
                    <button
                      onClick={handleClaimBonusMission}
                      disabled={bonusMission.claimed}
                      className={`w-full py-1.5 rounded-xl text-xs font-black transition ${bonusMission.claimed ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md animate-pulse'}`}
                    >
                      {bonusMission.claimed ? 'دریافت شده ✅' : 'دریافت جایزه شانس 🎲'}
                    </button>
                  </div>

                  {/* Weekly Mystery Box */}
                  <div className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-2 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-cyan-300 flex items-center gap-1 bg-cyan-500/20 px-2 py-0.5 rounded-lg border border-cyan-500/30">
                        🎁 جعبه هفتگی (Weekly Chest)
                      </span>
                      <span className="text-[10px] font-mono text-cyan-300 font-bold">{weeklyChest.completed}/{weeklyChest.required}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-bold">{weeklyChest.reward}</p>
                    <button
                      onClick={handleClaimWeeklyChest}
                      disabled={weeklyChest.claimed || weeklyChest.completed < weeklyChest.required}
                      className={`w-full py-1.5 rounded-xl text-xs font-black transition ${weeklyChest.claimed ? 'bg-slate-800 text-slate-500' : weeklyChest.completed >= weeklyChest.required ? 'bg-cyan-500 text-slate-950 shadow-md animate-bounce' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                    >
                      {weeklyChest.claimed ? 'باز شده ✅' : weeklyChest.completed >= weeklyChest.required ? 'باز کردن جعبه هفتگی 🎁' : 'در حال تکمیل...'}
                    </button>
                  </div>

                  {/* Monthly Mega Reward Chest */}
                  <div className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-2 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-amber-300 flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/30">
                        🎉 ابر جعبه ماهانه (Mega Chest)
                      </span>
                      <span className="text-[10px] font-mono text-amber-300 font-bold">{monthlyChest.completed}/{monthlyChest.required}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-bold">{monthlyChest.reward}</p>
                    <button
                      onClick={handleClaimMonthlyChest}
                      disabled={monthlyChest.claimed || monthlyChest.completed < monthlyChest.required}
                      className={`w-full py-1.5 rounded-xl text-xs font-black transition ${monthlyChest.claimed ? 'bg-slate-800 text-slate-500' : monthlyChest.completed >= monthlyChest.required ? 'btn-neon-pink shadow-md animate-bounce' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                    >
                      {monthlyChest.claimed ? 'باز شده ✅' : monthlyChest.completed >= monthlyChest.required ? 'باز کردن ابر جعبه 🎉' : 'در حال تکمیل...'}
                    </button>
                  </div>
                </div>

                {/* 4. CATEGORY SUBTABS NAVIGATION BAR */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
                  {[
                    { id: 'daily', label: '🎯 روزانه (Daily)', count: allMissions.filter(m => m.category === 'daily').length },
                    { id: 'weekly', label: '📅 هفتگی (Weekly)', count: allMissions.filter(m => m.category === 'weekly').length },
                    { id: 'monthly', label: '📆 ماهانه (Monthly)', count: allMissions.filter(m => m.category === 'monthly').length },
                    { id: 'streamer', label: '🎥 استریمر (Streamer)', count: allMissions.filter(m => m.category === 'streamer').length },
                    { id: 'vip', label: '👑 ویژه VIP', count: allMissions.filter(m => m.category === 'vip').length },
                    { id: 'history', label: '📜 تاریخچه جوایز', count: claimedMissionsHistory.length }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setMissionActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                        missionActiveTab === tab.id ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{tab.count}</span>
                    </button>
                  ))}
                </div>

                {/* 5. MISSIONS CARDS LIST */}
                {missionActiveTab !== 'history' ? (
                  <div className="space-y-3">
                    {allMissions.filter(m => m.category === missionActiveTab).map(m => (
                      <div 
                        key={m.id} 
                        className={`card-3d p-4 rounded-3xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md ${
                          m.isVipExclusive ? 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/50' :
                          m.isStreamerExclusive ? 'bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-900 border-purple-500/40' :
                          m.completed ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-900/70 border-slate-800/80'
                        }`}
                      >
                        {/* Left Info Column */}
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Difficulty Tag */}
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                              m.difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              m.difficulty === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {m.difficulty === 'easy' ? '🟢 آسان' : m.difficulty === 'medium' ? '🟡 متوسط' : '🔴 سخت'}
                            </span>

                            {m.isVipExclusive && (
                              <span className="px-2 py-0.5 rounded-lg bg-amber-500 text-slate-950 text-[9px] font-black flex items-center gap-1">
                                <Crown className="w-3 h-3 fill-slate-950" /> VIP Exclusive
                              </span>
                            )}

                            {m.isStreamerExclusive && (
                              <span className="px-2 py-0.5 rounded-lg bg-purple-600 text-white text-[9px] font-black flex items-center gap-1">
                                <Radio className="w-3 h-3" /> Streamer Quest
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{m.title}</h4>
                          <p className="text-[10px] text-slate-400">{m.desc}</p>

                          {/* Progress Meter Bar */}
                          <div className="space-y-1 max-w-md pt-1">
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                              <span>میزان پیشرفت:</span>
                              <span className="font-bold text-cyan-300">{m.progress} / {m.total}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                              <div 
                                className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, (m.progress / m.total) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right Rewards & Action Column */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                          <div className="flex flex-col items-start sm:items-end">
                            <div className="flex items-center gap-1 text-xs font-black text-amber-300">
                              {m.rewardType === 'coins' ? <Coins className="w-3.5 h-3.5 text-amber-400" /> :
                               m.rewardType === 'diamonds' ? <Gem className="w-3.5 h-3.5 text-cyan-400" /> :
                               m.rewardType === 'vip_trial' ? <Crown className="w-3.5 h-3.5 text-amber-400" /> :
                               <Gift className="w-3.5 h-3.5 text-pink-400" />}
                              <span>{typeof m.rewardVal === 'number' ? `+${m.rewardVal} ${m.rewardType.toUpperCase()}` : m.rewardVal}</span>
                            </div>
                            <span className="text-[10px] font-mono text-purple-400 font-bold">+{m.xpVal} XP</span>
                          </div>

                          <button
                            onClick={() => handleMissionAction(m)}
                            className={`px-4 py-2.5 rounded-2xl text-xs font-black shrink-0 transition shadow-lg flex items-center gap-1.5 active:scale-95 ${
                              m.claimed ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' :
                              m.completed ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black animate-pulse shadow-emerald-500/20' :
                              'bg-slate-950 text-pink-400 border border-pink-500/40 hover:bg-pink-600 hover:text-white'
                            }`}
                          >
                            {m.claimed ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span>دریافت شده</span>
                              </>
                            ) : m.completed ? (
                              <>
                                <Gift className="w-4 h-4 fill-slate-950" />
                                <span>دریافت جایزه (Claim)</span>
                              </>
                            ) : (
                              <>
                                <span>انجام مأموریت</span>
                                <ChevronRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* HISTORY LOG TAB */
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-purple-400" />
                        سوابق جوایز دریافت شده مأموریت‌ها ({claimedMissionsHistory.length})
                      </span>
                    </div>

                    {claimedMissionsHistory.map(h => (
                      <div key={h.id} className="card-3d p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{h.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-white">{h.title}</h4>
                            <span className="text-[10px] text-slate-400 font-mono">{h.date}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-emerald-400 font-mono">{h.reward}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
{/* LEADERBOARD RANKING SUBTAB */}
            {streamSubTab === 'leaderboard' && (
              <div className="space-y-4 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
                {/* Header & Season Info */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-yellow-900/20 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20">
                      <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                        <Trophy className="w-7 h-7 text-amber-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        لیدربرد جهانی
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] border border-pink-500/30">
                          {lbSeason}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">رقابت کنید، مدال بگیرید و جایزه ببرید!</p>
                    </div>
                  </div>

                  {/* My Rank Card */}
                  <div className="bg-slate-950/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center relative z-10">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Rank</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-amber-400 font-black text-xl">#158</span>
                    </div>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Category Tabs */}
                  <div className="flex-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 flex items-center overflow-x-auto no-scrollbar">
                    {[
                      { id: 'streamers', icon: Video, label: 'استریمرها' },
                      { id: 'gifters', icon: Gift, label: 'حمایت‌کنندگان' },
                      { id: 'earnings', icon: DollarSign, label: 'درآمدها' },
                      { id: 'popular', icon: Heart, label: 'محبوب‌ترین' },
                      { id: 'rising', icon: TrendingUp, label: 'در حال رشد' },
                      { id: 'vip', icon: Crown, label: 'وی‌آی‌پی' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setLbMainTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${lbMainTab === tab.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                      >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Time & Region Filters */}
                  <div className="flex gap-2">
                    <select 
                      value={lbTimeFilter}
                      onChange={e => setLbTimeFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 outline-none cursor-pointer"
                    >
                      <option value="today">امروز</option>
                      <option value="week">این هفته</option>
                      <option value="month">این ماه</option>
                      <option value="year">امسال</option>
                      <option value="all">تمام زمان‌ها</option>
                    </select>

                    <select 
                      value={lbRegionFilter}
                      onChange={e => setLbRegionFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl px-3 outline-none cursor-pointer"
                    >
                      <option value="global">🌍 جهانی</option>
                      <option value="country">🌏 کشور</option>
                      <option value="city">📍 شهر</option>
                    </select>
                  </div>
                </div>

                {/* Top 3 Podium (Only show for first page of ranking) */}
                <div className="flex items-end justify-center gap-2 sm:gap-6 mt-12 mb-8 h-48 px-2">
                  {/* Rank 2 - Silver */}
                  {leaderboardData[1] && (
                    <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '100ms' }}>
                      <div className="relative mb-2">
                        <img src={leaderboardData[1].avatar} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-slate-300 shadow-[0_0_15px_rgba(203,213,225,0.5)]" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 border-2 border-slate-900 flex items-center justify-center font-black text-slate-900 text-sm shadow-lg">2</div>
                      </div>
                      <span className="text-white font-bold text-xs max-w-[80px] truncate text-center">{leaderboardData[1].user}</span>
                      <span className="text-slate-400 text-[10px]">{leaderboardData[1].score}</span>
                      <div className="w-16 sm:w-20 h-24 bg-gradient-to-t from-slate-400/20 to-slate-400/5 mt-2 rounded-t-xl border-t-2 border-slate-400/50" />
                    </div>
                  )}

                  {/* Rank 1 - Gold */}
                  {leaderboardData[0] && (
                    <div className="flex flex-col items-center animate-slideUp z-10" style={{ animationDelay: '0ms' }}>
                      <div className="relative mb-2">
                        <Crown className="w-8 h-8 text-amber-400 absolute -top-8 left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                        <img src={leaderboardData[0].avatar} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.6)]" />
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-400 border-4 border-slate-900 flex items-center justify-center font-black text-slate-900 text-lg shadow-lg">1</div>
                      </div>
                      <span className="text-white font-black text-sm max-w-[100px] truncate text-center">{leaderboardData[0].user}</span>
                      <span className="text-amber-400 text-xs font-bold">{leaderboardData[0].score}</span>
                      <div className="w-20 sm:w-24 h-32 bg-gradient-to-t from-amber-400/30 to-amber-400/5 mt-2 rounded-t-xl border-t-2 border-amber-400/50 flex flex-col items-center justify-start pt-4">
                        <span className="text-amber-300 text-[10px] font-bold">10000 🪙</span>
                      </div>
                    </div>
                  )}

                  {/* Rank 3 - Bronze */}
                  {leaderboardData[2] && (
                    <div className="flex flex-col items-center animate-slideUp" style={{ animationDelay: '200ms' }}>
                      <div className="relative mb-2">
                        <img src={leaderboardData[2].avatar} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-4 border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.5)]" />
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700 border-2 border-slate-900 flex items-center justify-center font-black text-amber-100 text-sm shadow-lg">3</div>
                      </div>
                      <span className="text-white font-bold text-xs max-w-[70px] truncate text-center">{leaderboardData[2].user}</span>
                      <span className="text-slate-400 text-[10px]">{leaderboardData[2].score}</span>
                      <div className="w-14 sm:w-16 h-16 bg-gradient-to-t from-amber-700/20 to-amber-700/5 mt-2 rounded-t-xl border-t-2 border-amber-700/50" />
                    </div>
                  )}
                </div>

                {/* List View */}
                <div className="space-y-3">
                  {leaderboardData.slice(3).map((item, idx) => (
                    <div 
                      key={item.rank} 
                      onClick={() => showToast(`مشاهده پروفایل ${item.user}`)}
                      className={`card-3d p-4 rounded-3xl border flex items-center justify-between gap-3 cursor-pointer transition hover:bg-slate-800 ${item.isMe ? 'bg-amber-950/30 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-slate-900 border-slate-800'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 font-black text-slate-500 text-sm text-center">
                          {item.rank}
                        </div>
                        <img src={item.avatar} alt={item.user} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-700 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            {item.user}
                            {item.isMe && <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[9px] font-black uppercase">You</span>}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400 font-medium bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                              LVL {item.level}
                            </span>
                            <span className="text-[10px] text-amber-400 font-bold">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="text-sm font-black text-white flex items-center gap-1">
                          {item.score}
                          <span className="text-[10px] text-slate-400 font-normal">{item.label}</span>
                        </div>
                        {lbMainTab === 'streamers' && (
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                            <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {item.viewers}</span>
                            <span className="flex items-center gap-0.5"><Gift className="w-3 h-3 text-pink-500/70" /> {item.gifts}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* STORIES REEL CAROUSEL BAR */}
            <div className="bg-slate-900/80 p-3.5 rounded-3xl border border-slate-800/90 shadow-lg space-y-2" dir={isRtl ? "rtl" : "ltr"}>
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  استوری‌های لحظه‌ای (Stories)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsStoryArchiveOpen(true)}
                    className="text-[10px] font-bold text-slate-400 hover:text-pink-400 flex items-center gap-1 transition"
                  >
                    <History className="w-3 h-3" />
                    آرشیو استوری‌ها
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {/* Create Story Button */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => setIsCreateStoryOpen(true)}
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-950 p-0.5 border-2 border-dashed border-pink-500/60 hover:border-pink-400 transition flex items-center justify-center group shadow-md"
                  >
                    <img src={userAvatar} alt="My Avatar" className="w-full h-full rounded-full object-cover group-hover:scale-105 transition" />
                    <div className="absolute inset-0 bg-slate-950/40 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-pink-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                  <span className="text-[10px] font-bold text-slate-300">افزودن استوری</span>
                </div>

                {/* Story Circles */}
                {advancedStories.map(story => (
                  <div 
                    key={story.id} 
                    onClick={() => handleOpenStory(story)}
                    className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                  >
                    <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 transition group-hover:scale-105 shadow-md ${story.hasUnseen ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 animate-pulse' : 'bg-slate-700'}`}>
                      <div className="w-full h-full bg-slate-950 rounded-full p-0.5">
                        <img src={story.user.avatar} alt={story.user.name} className="w-full h-full rounded-full object-cover" />
                      </div>
                      {story.user.isVip && (
                        <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 shadow-md">
                          <Crown className="w-3 h-3 fill-slate-950" />
                        </div>
                      )}
                      {story.user.isPromo && (
                        <div className="absolute -bottom-1 -left-1 bg-pink-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase border border-slate-900 shadow">
                          Ad
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 max-w-[65px] truncate text-center">
                      {story.isMe ? 'استوری من' : story.user.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. SUBTABS NAVIGATION BAR */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800/80">
              <button
                onClick={() => setCallMainSubTab('recent')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'recent' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <Clock className="w-4 h-4" />
                <span>تاریخچه اخیر (Recent Calls)</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{callHistoryList.length}</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('contacts')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'contacts' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <Users className="w-4 h-4" />
                <span>مخاطبین (Contacts)</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('favorites')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'favorites' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                <span>علاقه‌مندی‌ها (Favorites)</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{favoriteContacts.length}</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('scheduled')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'scheduled' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>تماس‌های برنامه‌ریزی‌شده</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">{scheduledCallsList.length}</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('tariffs')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'tariffs' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>تعرفه و تنظیمات پولی</span>
              </button>

              <button
                onClick={() => setCallMainSubTab('dialpad')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition whitespace-nowrap ${callMainSubTab === 'dialpad' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'}`}
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>شماره‌گیر (Dialpad)</span>
              </button>
            </div>

            {/* SUBTAB 1: RECENT CALLS */}
            {callMainSubTab === 'recent' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {['all', 'voice', 'video', 'missed', 'rejected', 'paid'].map(f => (
                      <button
                        key={f}
                        onClick={() => setCallLogFilter(f)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition ${callLogFilter === f ? 'bg-pink-500 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'}`}
                      >
                        {f === 'all' ? 'همه' : f === 'voice' ? 'صوتی 📞' : f === 'video' ? 'تصویری 📹' : f === 'missed' ? 'از دست رفته 🔴' : f === 'rejected' ? 'رد شده 🚫' : 'پولی 🪙'}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      value={callSearchQuery}
                      onChange={e => setCallSearchQuery(e.target.value)}
                      placeholder="جستجو در تاریخچه تماس..."
                      className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {callHistoryList
                    .filter(item => {
                      if (callLogFilter === 'voice' && item.type !== 'voice') return false;
                      if (callLogFilter === 'video' && item.type !== 'video') return false;
                      if (callLogFilter === 'missed' && item.direction !== 'missed') return false;
                      if (callLogFilter === 'rejected' && item.direction !== 'rejected') return false;
                      if (callLogFilter === 'paid' && !item.isPaid) return false;
                      if (callSearchQuery && !item.user.name.toLowerCase().includes(callSearchQuery.toLowerCase())) return false;
                      return true;
                    })
                    .map(log => (
                      <div key={log.id} className="card-3d p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 hover:border-pink-500/40 flex items-center justify-between gap-3 transition">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img src={log.user.avatar} alt={log.user.name} className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-700" />
                            <span className={`absolute -bottom-1 -left-1 p-1 rounded-full border border-slate-950 text-[10px] ${log.type === 'video' ? 'bg-purple-600 text-white' : 'bg-cyan-600 text-white'}`}>
                              {log.type === 'video' ? <Video className="w-2.5 h-2.5" /> : <PhoneCall className="w-2.5 h-2.5" />}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-white">{log.user.name}</h4>
                              {log.user.isVip && <Crown className="w-3 h-3 text-amber-400 fill-amber-400/20" />}
                              {log.isPaid && <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">پولی</span>}
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                {log.direction === 'missed' ? <PhoneMissed className="w-3 h-3 text-rose-500" /> : log.direction === 'incoming' ? <PhoneIncoming className="w-3 h-3 text-emerald-400" /> : <PhoneOutgoing className="w-3 h-3 text-cyan-400" />}
                                <span className={log.direction === 'missed' ? 'text-rose-400 font-bold' : ''}>
                                  {log.direction === 'missed' ? 'از دست رفته' : log.direction === 'rejected' ? 'رد شده' : log.direction === 'incoming' ? 'ورودی' : 'خروجی'}
                                </span>
                              </span>
                              <span>•</span>
                              <span>{log.time} ({log.duration})</span>
                              {log.coinsSpent > 0 && (
                                <span className="text-amber-400 font-mono flex items-center gap-0.5">
                                  <Coins className="w-2.5 h-2.5" /> {log.coinsSpent} سکه
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleInitiateCall(log.user, 'voice', '1on1')}
                            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 hover:bg-cyan-600 hover:text-white transition"
                            title="تماس صوتی"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleInitiateCall(log.user, 'video', '1on1')}
                            className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:bg-pink-500 hover:text-white transition"
                            title="تماس تصویری"
                          >
                            <Video className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* SUBTAB 2: CONTACTS */}
            {callMainSubTab === 'contacts' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {conversations.map(conv => (
                    <div key={conv.id} className="card-3d p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={conv.user.avatar} alt={conv.user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-pink-500/30" />
                          <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-slate-950 ${conv.user.online ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-white">{conv.user.name}</h4>
                            {conv.user.isVerified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />}
                            {conv.user.isVip && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                          </div>
                          <p className="text-[10px] text-slate-400">{conv.user.role || 'کاربر رسمی'} • {conv.user.city || 'ایران'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleFavoriteContact(conv.user.username)}
                          className={`p-2 rounded-xl border transition ${favoriteContacts.includes(conv.user.username) ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleInitiateCall(conv.user, 'voice', '1on1')}
                          className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 hover:bg-cyan-600 hover:text-white transition"
                          title="Voice Call"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleInitiateCall(conv.user, 'video', '1on1')}
                          className="px-3 py-2 rounded-xl btn-neon-pink text-xs font-bold flex items-center gap-1"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>تماس</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 3: FAVORITES */}
            {callMainSubTab === 'favorites' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {conversations.filter(c => favoriteContacts.includes(c.user.username)).map(c => (
                  <div key={c.id} className="card-3d p-4 rounded-3xl bg-slate-900 border border-amber-500/30 flex flex-col items-center text-center space-y-3 relative overflow-hidden">
                    <span className="absolute top-2 right-2 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                    </span>
                    <img src={c.user.avatar} alt={c.user.name} className="w-16 h-16 rounded-3xl object-cover ring-2 ring-amber-400/50 shadow-lg" />
                    <div>
                      <h4 className="text-sm font-black text-white">{c.user.name}</h4>
                      <p className="text-[10px] text-amber-300 font-semibold">{c.user.role || 'مخاطب ویژه'}</p>
                    </div>
                    <div className="flex items-center gap-2 w-full pt-1">
                      <button
                        onClick={() => handleInitiateCall(c.user, 'voice', '1on1')}
                        className="flex-1 py-2 rounded-2xl bg-slate-950 text-cyan-300 border border-slate-800 text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> صوتی
                      </button>
                      <button
                        onClick={() => handleInitiateCall(c.user, 'video', '1on1')}
                        className="flex-1 py-2 rounded-2xl btn-neon-pink text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Video className="w-3.5 h-3.5" /> تصویری
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUBTAB 4: SCHEDULED CALLS */}
            {callMainSubTab === 'scheduled' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white">تماس‌های رزرو شده آینده</h3>
                  <button
                    onClick={() => setIsScheduleCallModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl btn-neon-pink text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> افزودن رزرو جدید
                  </button>
                </div>

                <div className="space-y-2">
                  {scheduledCallsList.map(sch => (
                    <div key={sch.id} className="card-3d p-4 rounded-2xl bg-slate-900 border border-purple-500/30 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img src={sch.user.avatar} alt={sch.user.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/40" />
                        <div>
                          <h4 className="text-xs font-bold text-white">{sch.user.name}</h4>
                          <p className="text-[10px] text-purple-300 font-medium">{sch.note}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-cyan-400" /> {sch.dateTime}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleInitiateCall(sch.user, sch.type, '1on1')}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                      >
                        <Video className="w-4 h-4" />
                        <span>ورود به لابی</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 5: TARIFFS & CALL PRIVACY SETTINGS */}
            {callMainSubTab === 'tariffs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-amber-500/40 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="text-sm font-black text-white">تعرفه تماس پولی اختصاصی</h3>
                      <p className="text-[10px] text-slate-400">تنظیم نرخ دریافت سکه از کاربران برای تماس‌های خصوصی 1 در 1</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <span className="text-xs font-bold text-white">فعال‌سازی تماس‌های پولی</span>
                    <input
                      type="checkbox"
                      checked={streamerPaidCallEnabled}
                      onChange={e => setStreamerPaidCallEnabled(e.target.checked)}
                      className="w-4 h-4 accent-pink-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">نرخ تماس (سکه در هر دقیقه):</label>
                    <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-2xl border border-slate-800">
                      <Coins className="w-4 h-4 text-amber-400" />
                      <input
                        type="number"
                        value={streamerCallTariffPerMin}
                        onChange={e => setStreamerCallTariffPerMin(Number(e.target.value))}
                        className="w-full bg-transparent text-xs font-bold text-amber-300 outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                    💡 درآمد حاصل از تماس‌های پولی به بخش Earnings و کیف پول شما منتقل می‌شود (سهم ۸۰٪ استریمر).
                  </div>
                </div>

                <div className="card-3d p-5 rounded-3xl bg-slate-900 border border-cyan-500/40 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="text-sm font-black text-white">حریم خصوصی و امنیت تماس</h3>
                      <p className="text-[10px] text-slate-400">مدیریت افراد مجاز برای برقراری تماس و رمزنگاری 256 بیتی</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">دریافت تماس فقط از:</label>
                    <select
                      value={privacyWhoCall}
                      onChange={e => setPrivacyWhoCall(e.target.value)}
                      className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="Everyone">همه کاربران (Everyone)</option>
                      <option value="Friends">فقط دوستان (Friends Only)</option>
                      <option value="Followers">فقط دنبال‌کنندگان (Followers Only)</option>
                      <option value="VIP Only">فقط اعضای VIP 👑</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">رمزنگاری سرتاسری (256-Bit E2E)</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">فعال 🔒</span>
                  </div>
                </div>
              </div>
            )}
            {/* SUBTAB 6: INTERACTIVE DIALPAD */}
            {callMainSubTab === 'dialpad' && (
              <div className="max-w-md mx-auto space-y-5 animate-fadeIn" dir={isRtl ? "rtl" : "ltr"}>
                {/* Input Display Screen */}
                <div className="card-3d p-4 rounded-3xl bg-slate-900 border border-purple-500/40 flex flex-col items-center justify-center space-y-2 relative overflow-hidden shadow-2xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">شماره‌گیر مستقیم P2P</span>
                  <div className="flex items-center justify-between w-full px-4 py-2 bg-slate-950 rounded-2xl border border-slate-800">
                    <input
                      type="text"
                      value={dialpadInput}
                      onChange={e => setDialpadInput(e.target.value)}
                      placeholder="شماره یا آیدی کاربر..."
                      className="bg-transparent text-lg font-black font-mono text-emerald-400 outline-none w-full text-center tracking-widest"
                    />
                    {dialpadInput && (
                      <button 
                        onClick={() => setDialpadInput(prev => prev.slice(0, -1))}
                        className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { num: '1', sub: '' },
                    { num: '2', sub: 'ABC' },
                    { num: '3', sub: 'DEF' },
                    { num: '4', sub: 'GHI' },
                    { num: '5', sub: 'JKL' },
                    { num: '6', sub: 'MNO' },
                    { num: '7', sub: 'PQRS' },
                    { num: '8', sub: 'TUV' },
                    { num: '9', sub: 'WXYZ' },
                    { num: '*', sub: '' },
                    { num: '0', sub: '+' },
                    { num: '#', sub: '' }
                  ].map(k => (
                    <button
                      key={k.num}
                      onClick={() => setDialpadInput(prev => prev + k.num)}
                      className="card-3d py-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-pink-500/50 hover:bg-slate-800 transition flex flex-col items-center justify-center shadow-md active:scale-95"
                    >
                      <span className="text-xl font-black text-white font-mono">{k.num}</span>
                      {k.sub && <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{k.sub}</span>}
                    </button>
                  ))}
                </div>

                {/* Call Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (!dialpadInput) {
                        showToast("لطفاً شماره یا آیدی کاربر را وارد کنید");
                        return;
                      }
                      const matchedUser = conversations.find(c => c.user.username.toLowerCase().includes(dialpadInput.toLowerCase()) || c.user.name.toLowerCase().includes(dialpadInput.toLowerCase()))?.user || {
                        username: dialpadInput,
                        name: `User ${dialpadInput}`,
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                        isVip: false
                      };
                      handleInitiateCall(matchedUser, 'voice', '1on1');
                      showToast(`برقراری تماس صوتی با ${matchedUser.name}...`);
                    }}
                    className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>تماس صوتی</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!dialpadInput) {
                        showToast("لطفاً شماره یا آیدی کاربر را وارد کنید");
                        return;
                      }
                      const matchedUser = conversations.find(c => c.user.username.toLowerCase().includes(dialpadInput.toLowerCase()) || c.user.name.toLowerCase().includes(dialpadInput.toLowerCase()))?.user || {
                        username: dialpadInput,
                        name: `User ${dialpadInput}`,
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                        isVip: true
                      };
                      handleInitiateCall(matchedUser, 'video', '1on1');
                      showToast(`برقراری تماس تصویری HD با ${matchedUser.name}...`);
                    }}
                    className="flex-1 py-3.5 rounded-2xl btn-neon-pink text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition"
                  >
                    <Video className="w-4 h-4" />
                    <span>تماس تصویری</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB: REDESIGNED PREMIUM INTERACTIVE MATCH EXPERIENCE */}
        {activeTab === 'match' && (
          <div className="space-y-4 max-w-md mx-auto animate-fadeIn pb-12">
            
            {/* 1. Top Header & Smart Filter Bar */}
            <div className="card-3d p-3.5 rounded-3xl bg-slate-900/90 border border-pink-500/30 flex items-center justify-between gap-3 backdrop-blur-xl shadow-[0_0_40px_rgba(236,72,153,0.2)]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Flame className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-1.5">
                    <span>V.Live Match</span>
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">VIP</span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{matchDeckProfiles.length} Online Matches</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRandomMatch}
                  className="px-3 py-2 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 active:scale-95 transition flex items-center gap-1.5 text-xs font-bold shadow-md"
                  title="Random Discovery"
                >
                  <Shuffle className="w-4 h-4 text-indigo-400" />
                  <span className="hidden xs:inline">🎲 Random</span>
                </button>
                <button
                  onClick={() => setIsMatchFilterOpen(true)}
                  className="p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-pink-400 border border-slate-700 active:scale-95 transition flex items-center gap-1.5 shadow-md"
                  title="Smart Match Filters"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 2. Sub-Tabs Switcher */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
              <button
                onClick={() => setMatchSubTab('swipe')}
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'swipe' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🔥</span>
                <span>Match Deck</span>
              </button>
              <button
                onClick={() => setMatchSubTab('roulette')}
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'roulette' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>🎲</span>
                <span>30s Video</span>
              </button>
              <button
                onClick={() => setMatchSubTab('likes')}
                className={`py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${matchSubTab === 'likes' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span>👑</span>
                <span>Liked You</span>
              </button>
            </div>

            {/* 3. SUB-TAB 1: SWIPE MATCH DECK */}
            {matchSubTab === 'swipe' && (
              <div className="space-y-4">
                {matchCardIndex < matchDeckProfiles.length && matchDeckProfiles[matchCardIndex] ? (
                  <div 
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      setIsSwipeDragging(true);
                      swipeStartPos.current = { x: touch.clientX, y: touch.clientY };
                    }}
                    onTouchMove={(e) => {
                      if (!isSwipeDragging) return;
                      const touch = e.touches[0];
                      setSwipeDragPos({
                        x: touch.clientX - swipeStartPos.current.x,
                        y: touch.clientY - swipeStartPos.current.y
                      });
                    }}
                    onTouchEnd={() => {
                      if (!isSwipeDragging) return;
                      setIsSwipeDragging(false);
                      if (swipeDragPos.x > 80) triggerMatchAction('like');
                      else if (swipeDragPos.x < -80) triggerMatchAction('reject');
                      else if (swipeDragPos.y < -80) triggerMatchAction('superlike');
                      else setSwipeDragPos({ x: 0, y: 0 });
                    }}
                    onMouseDown={(e) => {
                      setIsSwipeDragging(true);
                      swipeStartPos.current = { x: e.clientX, y: e.clientY };
                    }}
                    onMouseMove={(e) => {
                      if (!isSwipeDragging) return;
                      setSwipeDragPos({
                        x: e.clientX - swipeStartPos.current.x,
                        y: e.clientY - swipeStartPos.current.y
                      });
                    }}
                    onMouseUp={() => {
                      if (!isSwipeDragging) return;
                      setIsSwipeDragging(false);
                      if (swipeDragPos.x > 80) triggerMatchAction('like');
                      else if (swipeDragPos.x < -80) triggerMatchAction('reject');
                      else if (swipeDragPos.y < -80) triggerMatchAction('superlike');
                      else setSwipeDragPos({ x: 0, y: 0 });
                    }}
                    onMouseLeave={() => {
                      if (isSwipeDragging) {
                        setIsSwipeDragging(false);
                        setSwipeDragPos({ x: 0, y: 0 });
                      }
                    }}
                    style={{
                      transform: `translate(${swipeDragPos.x}px, ${swipeDragPos.y}px) rotate(${swipeDragPos.x * 0.05}deg)`,
                      transition: isSwipeDragging ? 'none' : 'transform 0.3s ease'
                    }}
                    className="relative min-h-[480px] sm:min-h-[520px] rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/30 shadow-[0_0_60px_rgba(236,72,153,0.3)] flex flex-col justify-end select-none touch-none cursor-grab active:cursor-grabbing group"
                  >
                    {/* Blurred Image Backdrop for Depth */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-45 scale-125 pointer-events-none"
                      style={{ backgroundImage: `url(${matchDeckProfiles[matchCardIndex].avatar})` }}
                    />

                    {/* Main Profile Photo */}
                    <img 
                      src={matchDeckProfiles[matchCardIndex].avatar} 
                      alt={matchDeckProfiles[matchCardIndex].name} 
                      className="absolute inset-0 w-full h-full object-cover filter brightness-95 pointer-events-none group-hover:scale-105 transition duration-700" 
                    />

                    {/* Gradient Vignette Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />

                    {/* Gesture Stamps */}
                    {isSwipeDragging && swipeDragPos.x > 30 && (
                      <div className="absolute top-12 left-6 z-30 px-5 py-2 rounded-2xl border-4 border-emerald-400 bg-emerald-500/20 text-emerald-300 font-black text-2xl uppercase tracking-widest rotate-[-12deg] backdrop-blur-md shadow-2xl animate-pulse">
                        ❤️ LIKE
                      </div>
                    )}
                    {isSwipeDragging && swipeDragPos.x < -30 && (
                      <div className="absolute top-12 right-6 z-30 px-5 py-2 rounded-2xl border-4 border-rose-500 bg-rose-500/20 text-rose-300 font-black text-2xl uppercase tracking-widest rotate-[12deg] backdrop-blur-md shadow-2xl animate-pulse">
                        ❌ PASS
                      </div>
                    )}
                    {isSwipeDragging && swipeDragPos.y < -30 && (
                      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-2xl border-4 border-amber-400 bg-amber-500/20 text-amber-300 font-black text-2xl uppercase tracking-widest backdrop-blur-md shadow-2xl animate-pulse">
                        ⭐ SUPER LIKE
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                      <div className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-xs font-black flex items-center gap-1.5 shadow-lg">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{matchDeckProfiles[matchCardIndex].distance}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {matchDeckProfiles[matchCardIndex].isVerified && (
                          <div className="px-3 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/40 text-blue-300 text-xs font-black flex items-center gap-1 shadow-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Verified</span>
                          </div>
                        )}
                        {matchDeckProfiles[matchCardIndex].isVip && (
                          <div className="px-3 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-300 text-xs font-black flex items-center gap-1 shadow-lg">
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            <span>VIP</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Info Section at Bottom (Minimal Text, Pure Icons & Badges) */}
                    <div className="relative z-20 p-5 space-y-3.5 pointer-events-auto">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
                            <span>{matchDeckProfiles[matchCardIndex].name}</span>
                            <span className="px-2.5 py-0.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-bold">
                              {matchDeckProfiles[matchCardIndex].age}
                            </span>
                          </h2>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-200 font-bold mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-pink-400" />
                            {matchDeckProfiles[matchCardIndex].city}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Active Now
                          </span>
                        </div>
                      </div>

                      {/* Interest Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {matchDeckProfiles[matchCardIndex].interests.map((tag, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* ACTION BUTTONS BAR (Row of 6 sleek 3D round buttons) */}
                      <div className="grid grid-cols-6 gap-2 pt-2">
                        
                        {/* 1. Pass / Reject */}
                        <button 
                          onClick={() => triggerMatchAction('reject')}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-rose-500/40 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                          title="Pass"
                        >
                          <X className="w-6 h-6 group-hover:scale-110 transition" />
                        </button>

                        {/* 2. Instant Gift */}
                        <button 
                          onClick={() => triggerMatchAction('gift')}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                          title="Send Virtual Gift"
                        >
                          <Gift className="w-6 h-6 group-hover:scale-110 transition animate-bounce" />
                        </button>

                        {/* 3. Super Like */}
                        <button 
                          onClick={() => triggerMatchAction('superlike')}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                          title="Super Like"
                        >
                          <Star className="w-6 h-6 group-hover:scale-110 transition text-amber-400 fill-amber-400" />
                        </button>

                        {/* 4. Like */}
                        <button 
                          onClick={() => triggerMatchAction('like')}
                          className="h-12 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.6)] active:scale-90 transition group"
                          title="Like"
                        >
                          <Heart className="w-7 h-7 fill-white group-hover:scale-125 transition" />
                        </button>

                        {/* 5. Direct Message */}
                        <button 
                          onClick={() => {
                            const target = matchDeckProfiles[matchCardIndex];
                            setIsMatchModalOpen(false);
                            setActiveTab('messages');
                            showToast(`💬 Opened chat with @${target.name || target.username}`);
                          }}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-purple-500/40 text-purple-300 hover:bg-purple-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                          title="Chat"
                        >
                          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition" />
                        </button>

                        {/* 6. Video Call */}
                        <button 
                          onClick={() => {
                            const target = matchDeckProfiles[matchCardIndex];
                            handleInitiateCall(target, 'video', '1on1');
                            setIsMatchModalOpen(false);
                            showToast(`📹 Calling ${target.name}...`);
                          }}
                          className="h-12 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 flex items-center justify-center shadow-lg active:scale-90 transition group"
                          title="1on1 Video Call"
                        >
                          <Video className="w-6 h-6 group-hover:scale-110 transition" />
                        </button>

                      </div>

                    </div>
                  </div>
                ) : (
                  /* Empty State */
                  <div className="py-16 text-center space-y-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl shadow-xl">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/40 flex items-center justify-center text-4xl animate-bounce shadow-lg">
                      ✨
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-white">All Profiles Viewed!</h4>
                      <p className="text-xs text-slate-400">Refresh the deck or adjust smart filters to discover more matches.</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setMatchCardIndex(0)}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Refresh Deck</span>
                      </button>
                      <button
                        onClick={() => setIsMatchFilterOpen(true)}
                        className="px-5 py-3 rounded-2xl bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 hover:bg-slate-700 active:scale-95 transition flex items-center gap-2"
                      >
                        <Sliders className="w-4 h-4 text-pink-400" />
                        <span>Adjust Filters</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 2: 30S VIDEO ROULETTE */}
            {matchSubTab === 'roulette' && (
              <div className="card-3d p-5 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-xl space-y-5 text-center">
                {matchState === 'idle' && (
                  <div className="space-y-4 py-4">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/40 flex items-center justify-center shadow-lg">
                      <Video className="w-10 h-10 text-pink-400 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-white">30s Live Video Roulette</h4>
                      <p className="text-xs text-slate-400">Instant video call pairing with verified online users.</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400 flex items-center justify-between">
                      <span>Daily Free Quota:</span>
                      <span className="text-white bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-500/40">{freeMatchCallsLeft} / 3</span>
                    </div>
                    <button
                      onClick={() => {
                        if (freeMatchCallsLeft <= 0) {
                          showToast('⚠️ Daily free roulette quota reached.');
                          return;
                        }
                        setMatchState('searching');
                        setTimeout(() => {
                          const realPartners = (Array.isArray(usersList) && usersList.length > 0)
                            ? usersList.filter(u => u && u.username !== currentUsername && u.user_type !== 'TEST_USER' && u.user_type !== 'DEMO_USER' && (u.status === 'approved' || u.isApproved !== false))
                            : [
                                { name: 'Sara Maleki', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', city: 'Tehran', isVerified: true },
                                { name: 'Elnaz Karimi', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', city: 'Shiraz', isVerified: true },
                                { name: 'Sahar Miller', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', city: 'Tehran', isVerified: true }
                              ];
                          const randomPartner = realPartners[Math.floor(Math.random() * realPartners.length)] || realPartners[0];
                          setMatchedMatchUser(randomPartner);
                          setMatchState('connected');
                          setFreeMatchCallsLeft(prev => Math.max(0, prev - 1));
                          setMatchCallSeconds(30);
                          showToast(`🎉 Connected with @${randomPartner.name || randomPartner.username}!`);
                        }, 2200);
                      }}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-white" />
                      <span>Start 30s Video Roulette</span>
                    </button>
                  </div>
                )}

                {matchState === 'searching' && (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full border-4 border-pink-500 border-t-transparent animate-spin shadow-lg" />
                    <h4 className="text-sm font-black text-white">Matching with Random Partner...</h4>
                    <p className="text-xs text-slate-400">Connecting video stream in 4K resolution...</p>
                  </div>
                )}

                {matchState === 'connected' && matchedMatchUser && (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-pink-500/40 shadow-2xl flex items-center justify-center">
                      <img src={matchedMatchUser.avatar} alt={matchedMatchUser.name} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                      
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-pink-500/40 text-pink-400 font-black text-xs flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{matchCallSeconds}s</span>
                      </div>

                      <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between">
                        <div className="text-left">
                          <h4 className="text-sm font-black text-white flex items-center gap-1">
                            {matchedMatchUser.name}
                            {matchedMatchUser.isVerified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                          </h4>
                          <p className="text-[10px] text-slate-300 font-bold">📍 {matchedMatchUser.city}</p>
                        </div>
                        <button
                          onClick={() => {
                            setMatchState('idle');
                            showToast('📞 Call ended.');
                          }}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg active:scale-95 transition"
                        >
                          End Call
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-TAB 3: WHO LIKED YOU (VIP) */}
            {matchSubTab === 'likes' && (
              <div className="space-y-3">
                <div className="card-3d p-4 rounded-3xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-xl shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-black">
                      👑
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white">Who Liked Your Profile</h4>
                      <p className="text-[10px] text-slate-400">See all active members who swiped right on you</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black border border-amber-500/40">VIP Perk</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {matchDeckProfiles.slice(0, 4).map((p, idx) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-lg group">
                      <img src={p.avatar} alt={p.name} className="absolute inset-0 w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-pink-500/80 backdrop-blur-md text-white text-[9px] font-black flex items-center gap-1 shadow">
                        ❤️ Liked You
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 text-left space-y-1">
                        <h5 className="text-xs font-black text-white flex items-center gap-1">
                          {p.name}, {p.age}
                        </h5>
                        <div className="grid grid-cols-2 gap-1 pt-1">
                          <button 
                            onClick={() => {
                              setMatchResultPopup(p);
                            }}
                            className="py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-[10px] shadow"
                          >
                            Match ❤️
                          </button>
                          <button 
                            onClick={() => {
                              handleInitiateCall(p, 'video', '1on1');
                              showToast(`📹 Calling ${p.name}...`);
                            }}
                            className="py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-[10px]"
                          >
                            Video 📹
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: COMPLETE REDESIGNED MESSAGES & DIRECT CHAT SYSTEM */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* 1. HEADER: USER AVATAR, TITLE, SEARCH & CREATION ACTIONS */}
            <div className="card-3d p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 flex-wrap backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/40 shadow-md" 
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                      💬 Messages (پیام‌ها)
                    </h2>
                    {totalUnreadMessages > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white font-black text-[10px] shadow-lg animate-pulse">
                        {totalUnreadMessages} New
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Secure Encrypted Chat & LiveKit Calls</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsChatSearchOpen(!isChatSearchOpen)}
                  className={"p-2.5 rounded-2xl border transition " + (isChatSearchOpen ? "bg-pink-500 text-white border-pink-400" : "bg-slate-950 text-slate-300 border-slate-800 hover:border-pink-500/40")}
                  title="Search Messages"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCreateGroupModalOpen(true)}
                  className="px-3 py-2 rounded-2xl bg-purple-600/20 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-purple-600/30 transition shadow-md"
                >
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="hidden sm:inline">Create Group</span>
                </button>

                <button
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="px-3.5 py-2 rounded-2xl btn-neon-pink text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Chat</span>
                </button>
              </div>
            </div>

            {/* 2. ADVANCED SEARCH BAR (NAME, ID, PHONE, CITY) */}
            {isChatSearchOpen && (
              <div className="card-3d p-3 rounded-2xl bg-slate-900 border border-pink-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  <Search className="w-4 h-4 text-pink-400 shrink-0" />
                  <input 
                    type="text"
                    value={msgSearchQuery}
                    onChange={e => setMsgSearchQuery(e.target.value)}
                    placeholder="Search by Name, Username ID, City, or Phone..."
                    className="w-full bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
                  />
                  {msgSearchQuery && (
                    <button onClick={() => setMsgSearchQuery('')} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold text-slate-400">
                  <span className="text-slate-500 shrink-0">Filter By:</span>
                  {[
                    { id: 'all', label: 'All Fields' },
                    { id: 'name', label: 'Name' },
                    { id: 'id', label: 'Username ID' },
                    { id: 'city', label: 'City (شهر)' },
                    { id: 'phone', label: 'Phone' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setMsgSearchField(f.id)}
                      className={"px-2.5 py-1 rounded-lg shrink-0 transition " + (msgSearchField === f.id ? "bg-pink-600 text-white font-black" : "bg-slate-950 border border-slate-800 hover:text-slate-200")}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CATEGORY TABS: ALL, PRIVATE, GROUPS, CALLS, ARCHIVED */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
              {[
                { id: 'all', label: 'All', icon: MessageSquare, badge: conversations.length },
                { id: 'private', label: 'Private (خصوصی)', icon: User, badge: conversations.filter(c => !c.isGroup && !c.archived).length },
                { id: 'groups', label: 'Groups (گروه‌ها)', icon: Users, badge: conversations.filter(c => c.isGroup).length },
                { id: 'calls', label: 'Calls (تماس‌ها)', icon: Phone, badge: conversations.filter(c => c.type === 'call').length },
                { id: 'archived', label: 'Archived (بایگانی)', icon: Archive, badge: conversations.filter(c => c.archived).length }
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = msgFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMsgFilterTab(tab.id)}
                    className={"px-4 py-2.5 rounded-2xl flex items-center gap-2 shrink-0 transition border " + (isActive ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-pink-400 shadow-lg shadow-pink-500/20" : "bg-slate-900/80 text-slate-400 border-slate-800/80 hover:bg-slate-800 hover:text-slate-200")}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                    <span className={"px-2 py-0.5 rounded-full text-[9px] " + (isActive ? "bg-white/20 text-white font-black" : "bg-slate-950 text-slate-400")}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* MAIN MESSAGES LAYOUT: SIDEBAR + CHAT THREAD */}
            <div className="card-3d rounded-3xl border border-slate-800 bg-slate-950/90 overflow-hidden h-[620px] flex flex-col md:flex-row shadow-2xl relative">
              
              {/* CONVERSATIONS LIST SIDEBAR */}
              <div className={"w-full md:w-80 border-r border-slate-800/80 flex flex-col bg-slate-950 " + (activeConversationId ? "hidden md:flex" : "flex")}>
                <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Recent Conversations</span>
                  <span className="text-[10px] text-pink-400">Live Sync</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
                  {conversations
                    .filter(conv => {
                      if (msgFilterTab === 'private' && (conv.isGroup || conv.archived)) return false;
                      if (msgFilterTab === 'groups' && !conv.isGroup) return false;
                      if (msgFilterTab === 'calls' && conv.type !== 'call') return false;
                      if (msgFilterTab === 'archived' && !conv.archived) return false;
                      if (msgFilterTab === 'all' && conv.archived) return false;

                      if (msgSearchQuery.trim()) {
                        const q = msgSearchQuery.toLowerCase();
                        const nameMatch = conv.user.name?.toLowerCase().includes(q);
                        const idMatch = conv.user.username?.toLowerCase().includes(q);
                        const cityMatch = conv.user.city?.toLowerCase().includes(q);
                        const phoneMatch = conv.user.phone?.includes(q);

                        if (msgSearchField === 'name') return nameMatch;
                        if (msgSearchField === 'id') return idMatch;
                        if (msgSearchField === 'city') return cityMatch;
                        if (msgSearchField === 'phone') return phoneMatch;
                        return nameMatch || idMatch || cityMatch || phoneMatch;
                      }

                      return true;
                    })
                    .map(conv => {
                      const isSelected = activeConversationId === conv.id;
                      return (
                        <button
                          key={conv.id}
                          onClick={() => {
                            setActiveConversationId(conv.id);
                            setConversations(prev => prev.map(c => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
                          }}
                          className={"w-full p-3 rounded-2xl flex items-center gap-3 transition text-left border relative group " + (isSelected ? "bg-gradient-to-r from-pink-500/20 via-purple-500/10 to-transparent border-pink-500/50 shadow-md" : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-900 hover:border-slate-700")}
                        >
                          <div className="relative shrink-0">
                            <img src={conv.user.avatar} alt={conv.user.name} className="w-11 h-11 rounded-2xl object-cover ring-1 ring-slate-700" />
                            {conv.user.online && !conv.isGroup && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                            )}
                            {conv.isGroup && (
                              <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-purple-600 text-white ring-2 ring-slate-950">
                                <Users className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                                {conv.user.name}
                                {conv.user.isVerified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                                {conv.pinned && <Pin className="w-3 h-3 text-amber-400 shrink-0 fill-amber-400" />}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono shrink-0">{conv.lastTime}</span>
                            </div>

                            <div className="flex items-center justify-between text-[11px]">
                              <p className="text-slate-400 truncate flex-1 pr-2">
                                {conv.lastMessage}
                              </p>

                              {conv.unreadCount > 0 ? (
                                <span className="px-1.5 py-0.5 rounded-full bg-pink-500 text-slate-950 font-black text-[9px] shrink-0 shadow-sm">
                                  {conv.unreadCount}
                                </span>
                              ) : conv.muted ? (
                                <VolumeX className="w-3 h-3 text-slate-600 shrink-0" />
                              ) : null}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* CHAT THREAD VIEW */}
              <div className={"flex-1 flex flex-col bg-slate-950/60 relative " + (!activeConversationId ? "hidden md:flex" : "flex")}>
                {activeConversationId ? (
                  (() => {
                    const currentConv = conversations.find(c => c.id === activeConversationId);
                    if (!currentConv) return null;

                    return (
                      <>
                        {/* 1. CHAT THREAD TOP HEADER */}
                        <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-2 z-10">
                          <div className="flex items-center gap-3 min-w-0">
                            <button 
                              onClick={() => setActiveConversationId(null)}
                              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="relative shrink-0">
                              <img src={currentConv.user.avatar} alt={currentConv.user.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-pink-500/30" />
                              {currentConv.user.online && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-xs font-bold text-white truncate">{currentConv.user.name}</h3>
                                {currentConv.user.isVerified && <VerifiedBadge className="w-3.5 h-3.5 shrink-0" />}
                              </div>
                              <p className="text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                🟢 Online & Ready
                              </p>
                            </div>
                          </div>

                          {/* Direct Action Buttons in Header */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                handleInitiateCall(currentConv.user, 'voice', '1on1');
                                showToast("Initiating Voice Call with " + currentConv.user.name + "...");
                              }}
                              className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 font-bold transition shadow-md"
                              title="Voice Call"
                            >
                              <Phone className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                handleInitiateCall(currentConv.user, 'video', '1on1');
                                showToast("Initiating 4K Video Call with " + currentConv.user.name + "...");
                              }}
                              className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600 hover:text-white font-bold transition shadow-md"
                              title="Video Call"
                            >
                              <Video className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => setIsSendGiftInChatOpen(true)}
                              className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 font-bold transition shadow-md"
                              title="Send Gift"
                            >
                              <Gift className="w-4 h-4" />
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setShowChatOptionsMenu(!showChatOptionsMenu)}
                                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {showChatOptionsMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 text-xs font-semibold space-y-1 animate-fadeIn">
                                  <button
                                    onClick={() => {
                                      setIsChatLocked(!isChatLocked);
                                      setShowChatOptionsMenu(false);
                                      showToast(isChatLocked ? 'Chat unlocked' : '🔒 Chat locked with passcode security');
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-amber-300 flex items-center gap-2"
                                  >
                                    <Lock className="w-3.5 h-3.5" />
                                    {isChatLocked ? 'Unlock Chat' : '🔒 Lock Chat'}
                                  </button>

                                  <button
                                    onClick={() => {
                                      setIsChatGalleryOpen(true);
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                                  >
                                    <Image className="w-3.5 h-3.5 text-cyan-400" />
                                    Media Gallery
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('Chat muted');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                                  >
                                    <VolumeX className="w-3.5 h-3.5 text-purple-400" />
                                    Mute Notifications
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('User reported to moderation');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-amber-400 flex items-center gap-2"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Report User
                                  </button>

                                  <button
                                    onClick={() => {
                                      showToast('User blocked');
                                      setShowChatOptionsMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-rose-400 flex items-center gap-2"
                                  >
                                    <Ban className="w-3.5 h-3.5" />
                                    Block User
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* PINNED MESSAGE BANNER */}
                        {pinnedMessage && (
                          <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
                            <div className="flex items-center gap-2 truncate">
                              <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                              <span className="font-bold text-[10px] text-amber-400">Pinned:</span>
                              <span className="truncate text-[11px]">{pinnedMessage.text}</span>
                            </div>
                            <button onClick={() => setPinnedMessage(null)} className="p-1 text-slate-400 hover:text-white">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* MESSAGES SCROLL AREA */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/80 custom-scrollbar">
                          {currentConv.messages.map(msg => {
                            const isMe = msg.sender === 'me';
                            return (
                              <div 
                                key={msg.id} 
                                className={"flex flex-col " + (isMe ? "items-end" : "items-start") + " group transition"}
                              >
                                {msg.senderName && !isMe && (
                                  <span className="text-[9px] font-bold text-purple-400 mb-0.5 px-1">{msg.senderName}</span>
                                )}

                                <div className="relative group max-w-[82%]">
                                  <div 
                                    className={"p-3.5 rounded-3xl text-xs space-y-1.5 shadow-xl transition-all duration-300 relative border " + (isMe ? "bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white rounded-br-xs border-pink-400/40" : "bg-slate-900/90 text-slate-100 rounded-bl-xs border-slate-800")}
                                  >
                                    {msg.type === 'gift' ? (
                                      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/60 border border-amber-500/30 text-amber-300 font-bold">
                                        <span className="text-2xl">👑</span>
                                        <div>
                                          <p className="text-xs text-white">{msg.text}</p>
                                          <span className="text-[10px] text-amber-400 font-black">+500 Coins Value</span>
                                        </div>
                                      </div>
                                    ) : msg.type === 'coins' ? (
                                      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-950/60 border border-emerald-500/30 text-emerald-300 font-bold">
                                        <span className="text-2xl">💸</span>
                                        <div>
                                          <p className="text-xs text-white">{msg.text}</p>
                                          <span className="text-[10px] text-emerald-400 font-black">Direct Transfer Completed</span>
                                        </div>
                                      </div>
                                    ) : msg.type === 'voice' ? (
                                      <div className="flex items-center gap-3 p-2 bg-slate-950/60 rounded-2xl border border-slate-800">
                                        <button className="w-8 h-8 rounded-full bg-pink-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                                          ▶
                                        </button>
                                        <div className="flex-1 h-3 flex items-center gap-0.5">
                                          {[40, 70, 30, 90, 100, 60, 80, 50, 90, 40, 70, 100].map((h, i) => (
                                            <div key={i} className="flex-1 bg-pink-400/60 rounded-full" style={{ height: h + "%" }} />
                                          ))}
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-300">0:12</span>
                                      </div>
                                     ) : (
                                       <>
                                         <p className="leading-relaxed whitespace-pre-wrap">
                                           {msg.translated && msg.translation ? (
                                             <span className="block">{msg.translation}</span>
                                           ) : (
                                             msg.text
                                           )}
                                         </p>
                                         {msg.translated && msg.translation && (
                                           <span className="inline-flex items-center gap-1 text-[9px] text-cyan-300 font-mono bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30 w-fit mt-1">
                                             <Globe className="w-2.5 h-2.5 text-cyan-400" />
                                             🌐 {t('translated', 'ترجمه‌شده')} ({msg.translationLang || langCode})
                                           </span>
                                         )}
                                       </>
                                     )}

                                    {msg.reactions && msg.reactions.length > 0 && (
                                      <div className="flex items-center gap-1 mt-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800 shrink-0 w-fit text-[11px]">
                                        {msg.reactions.map((r, i) => <span key={i}>{r}</span>)}
                                      </div>
                                    )}

                                    <div className="flex items-center justify-end gap-1 text-[8px] text-slate-300 pt-1">
                                      <span>{msg.time}</span>
                                      {isMe && (
                                        <CheckCheck className="w-3 h-3 text-cyan-300" title="Read" />
                                      )}
                                    </div>
                                  </div>

                                  <div className="hidden group-hover:flex items-center gap-1 absolute -top-3 right-2 bg-slate-900 border border-slate-700 rounded-full px-2 py-0.5 shadow-xl text-[10px] z-20">
                                    <button 
                                      onClick={() => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.map(m => m.id === msg.id ? { ...m, reactions: [...(m.reactions || []), '❤️'] } : m)
                                            };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="hover:scale-125 transition"
                                      title="React Heart"
                                    >
                                      ❤️
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setConversations(prev => prev.map(c => {
                                          if (c.id === activeConversationId) {
                                            return {
                                              ...c,
                                              messages: c.messages.map(m => m.id === msg.id ? { ...m, reactions: [...(m.reactions || []), '🔥'] } : m)
                                            };
                                          }
                                          return c;
                                        }));
                                      }}
                                      className="hover:scale-125 transition"
                                      title="React Fire"
                                    >
                                      🔥
                                    </button>
                                    <button 
                                      onClick={() => handleTranslateChatMessage(msg.id, msg.text)}
                                      className="text-cyan-400 hover:text-white font-bold ml-1 flex items-center gap-0.5"
                                      title="Translate Message"
                                    >
                                      🌍 {msg.translated ? 'Original' : 'Translate'}
                                    </button>
                                    <button 
                                      onClick={() => setPinnedMessage(msg)}
                                      className="text-amber-400 hover:text-white ml-1"
                                      title="Pin Message"
                                    >
                                      📌
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* POPOVERS: AI ASSISTANT, EMOJIS, ATTACHMENTS */}
                        {showAiAssistant && (
                          <div className="p-3 bg-slate-900 border-t border-purple-500/40 space-y-2 animate-fadeIn z-20">
                            <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                              <span className="flex items-center gap-1.5">
                                <Bot className="w-4 h-4 text-purple-400" />
                                🤖 AI Chat Assistant (هوش مصنوعی)
                              </span>
                              <button onClick={() => setShowAiAssistant(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-bold">
                              {[
                                'Thanks for your live! 💖',
                                "Let's do a video call 📹",
                                'How are you doing today? 😊',
                                'Sent you a gift! 🎁'
                              ].map((suggestion, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setDirectInputText(suggestion);
                                    setShowAiAssistant(false);
                                  }}
                                  className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:bg-purple-600 hover:text-white transition text-left truncate"
                                >
                                  ✨ {suggestion}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {showEmojiPicker && (
                          <div className="p-3 bg-slate-900 border-t border-slate-800 animate-fadeIn z-20">
                            <div className="flex items-center justify-between mb-2 text-xs font-bold text-slate-300">
                              <span>😀 Emojis & Quick Reaction</span>
                              <button onClick={() => setShowEmojiPicker(false)} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xl">
                              {['😀', '😂', '😍', '🔥', '👑', '💖', '👍', '🏎️', '🎉', '🚀', '💎', '🌹', '💯', '✨', '👏'].map((emoji, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setDirectInputText(prev => prev + emoji);
                                    setShowEmojiPicker(false);
                                  }}
                                  className="hover:scale-125 transition p-1"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {showAttachmentMenu && (
                          <div className="p-3 bg-slate-900 border-t border-slate-800 grid grid-cols-4 gap-2 text-center text-xs font-bold animate-fadeIn z-20">
                            <button onClick={() => { showToast('Attach photo'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-pink-400 hover:border-pink-500 flex flex-col items-center gap-1">
                              <Image className="w-5 h-5" /> Photo
                            </button>
                            <button onClick={() => { showToast('Attach video'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-purple-400 hover:border-purple-500 flex flex-col items-center gap-1">
                              <Video className="w-5 h-5" /> Video
                            </button>
                            <button onClick={() => { showToast('Attach file'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400 hover:border-cyan-500 flex flex-col items-center gap-1">
                              <Paperclip className="w-5 h-5" /> File
                            </button>
                            <button onClick={() => { showToast('Share location'); setShowAttachmentMenu(false); }} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 hover:border-emerald-500 flex flex-col items-center gap-1">
                              <MapPin className="w-5 h-5" /> Location
                            </button>
                          </div>
                        )}

                        {isRecordingAudio ? (
                          <div className="p-3 bg-pink-950/80 border-t border-pink-500/50 flex items-center justify-between text-xs font-bold animate-pulse z-20">
                            <div className="flex items-center gap-2 text-pink-300">
                              <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping" />
                              <span>Recording Voice Note... ({audioRecordingSeconds}s)</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setIsRecordingAudio(false)} 
                                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 text-[10px] hover:text-white"
                              >
                                Cancel
                              </button>

                              <button 
                                onClick={() => {
                                  setIsRecordingAudio(false);
                                  const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                  setConversations(prev => prev.map(c => {
                                    if (c.id === activeConversationId) {
                                      const newMsg = {
                                        id: Date.now(),
                                        sender: 'me',
                                        text: '🎤 Voice Note (0:12)',
                                        type: 'voice',
                                        time: nowTime
                                      };
                                      return { ...c, lastMessage: '🎤 Voice Note', lastTime: nowTime, messages: [...c.messages, newMsg] };
                                    }
                                    return c;
                                  }));
                                  showToast('Voice note sent!');
                                }}
                                className="px-4 py-1.5 rounded-xl btn-neon-pink text-[10px] text-white font-black"
                              >
                                Send Voice
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 flex items-center gap-2 z-10 flex-wrap sm:flex-nowrap">
                            <button 
                              onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false); setShowAiAssistant(false); }}
                              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 transition"
                              title="Emoji"
                            >
                              <Smile className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => { setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); setShowAiAssistant(false); }}
                              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-purple-400 transition"
                              title="Attachment"
                            >
                              <Paperclip className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => { setShowAiAssistant(!showAiAssistant); setShowEmojiPicker(false); setShowAttachmentMenu(false); }}
                              className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white transition shadow-md"
                              title="AI Assistant"
                            >
                              <Bot className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={() => setIsSendCoinsInChatOpen(true)}
                              className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition font-black text-xs hidden sm:flex items-center gap-1"
                              title="Send Coins"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>

                            <input 
                              type="text"
                              value={directInputText}
                              onChange={e => setDirectInputText(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSendDirectMessage()}
                              placeholder="Write a message... (تایپ پیام)"
                              className="flex-1 min-w-[120px] px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-pink-500/80 transition"
                            />

                            <button 
                              onClick={() => setIsRecordingAudio(true)}
                              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-pink-400 transition"
                              title="Record Voice"
                            >
                              <Mic className="w-4 h-4" />
                            </button>

                            <button 
                              onClick={handleSendDirectMessage}
                              className="p-2.5 rounded-2xl btn-neon-pink shadow-lg hover:scale-105 active:scale-95 transition"
                            >
                              <Send className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 space-y-3 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-pink-400 shadow-xl animate-bounce">
                      <MessageSquare className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Select a conversation to start messaging</h3>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Send text, voice notes, photos, gifts, or start a 4K LiveKit video call with hosts directly inside V.Live.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* IN-CHAT ACTIVE CALL OVERLAY MODAL */}
            {activeChatCall && (
              <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-between p-8 text-white animate-fadeIn">
                <div className="text-center space-y-2 mt-8">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5 justify-center mx-auto w-fit">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Live LiveKit {activeChatCall.type === 'video' ? '4K Video' : 'HD Voice'} Call Active
                  </span>
                  <h3 className="text-2xl font-black">{activeChatCall.user.name}</h3>
                  <p className="text-sm text-slate-400 font-mono">Duration: {Math.floor(chatCallSeconds / 60).toString().padStart(2, '0')}:{(chatCallSeconds % 60).toString().padStart(2, '0')}</p>
                </div>

                <div className="relative my-auto flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full ring-4 ring-pink-500/50 shadow-[0_0_50px_rgba(236,72,153,0.5)] overflow-hidden animate-pulse">
                    <img src={activeChatCall.user.avatar} alt={activeChatCall.user.name} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <button 
                    onClick={() => setIsChatCallMuted(!isChatCallMuted)}
                    className={"p-4 rounded-full border transition " + (isChatCallMuted ? "bg-rose-600 text-white border-rose-500" : "bg-slate-900 text-slate-200 border-slate-700")}
                  >
                    {isChatCallMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  <button 
                    onClick={() => {
                      setActiveChatCall(null);
                      showToast('Call ended');
                    }}
                    className="p-5 rounded-full bg-rose-600 text-white shadow-2xl hover:scale-110 active:scale-95 transition ring-4 ring-rose-500/40"
                    title="End Call"
                  >
                    <Phone className="w-8 h-8 rotate-[135deg]" />
                  </button>
                </div>
              </div>
            )}

            {/* IN-CHAT SEND COINS MODAL */}
            {isSendCoinsInChatOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 max-w-sm w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      💸 Send Coins Direct Transfer
                    </h3>
                    <button onClick={() => setIsSendCoinsInChatOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300">
                    Send coins instantly from your balance ({userCoins.toLocaleString()} Coins) to recipient wallet.
                  </p>

                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-400 block font-bold">Coins Amount</label>
                    <input 
                      type="number"
                      value={sendCoinsInChatAmount}
                      onChange={e => setSendCoinsInChatAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold text-sm outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (userCoins < sendCoinsInChatAmount) {
                        showToast('Insufficient coins balance!');
                        setIsDepositModalOpen(true);
                        return;
                      }

                      setUserCoins(prev => prev - sendCoinsInChatAmount);
                      const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                      setConversations(prev => prev.map(c => {
                        if (c.id === activeConversationId) {
                          const newMsg = {
                            id: Date.now(),
                            sender: 'me',
                            text: "Sent +" + sendCoinsInChatAmount + " Coins 💸",
                            type: 'coins',
                            time: nowTime
                          };
                          return { ...c, lastMessage: "Sent +" + sendCoinsInChatAmount + " Coins", lastTime: nowTime, messages: [...c.messages, newMsg] };
                        }
                        return c;
                      }));

                      setIsSendCoinsInChatOpen(false);
                      showToast("Successfully sent " + sendCoinsInChatAmount + " Coins!");
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition"
                  >
                    Confirm & Send Coins
                  </button>
                </div>
              </div>
            )}

            {/* IN-CHAT SEND GIFT MODAL */}
            {isSendGiftInChatOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-amber-500/40 max-w-md w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Gift className="w-4 h-4 text-amber-400" />
                      🎁 Send Gift in Direct Chat
                    </h3>
                    <button onClick={() => setIsSendGiftInChatOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {[
                      { name: 'Rose', icon: '🌹', coins: 10 },
                      { name: 'Heart', icon: '❤️', coins: 50 },
                      { name: 'Diamond', icon: '💎', coins: 500 },
                      { name: 'Crown', icon: '👑', coins: 2500 }
                    ].map((g, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (userCoins < g.coins) {
                            showToast('Insufficient coin balance!');
                            setIsDepositModalOpen(true);
                            return;
                          }

                          setUserCoins(prev => prev - g.coins);
                          const nowTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                          setConversations(prev => prev.map(c => {
                            if (c.id === activeConversationId) {
                              const newMsg = {
                                id: Date.now(),
                                sender: 'me',
                                text: "Sent " + g.name + " " + (g.emoji || '🎁'),
                                type: 'gift',
                                time: nowTime
                              };
                              return { ...c, lastMessage: "Sent " + g.name + " " + (g.emoji || '🎁'), lastTime: nowTime, messages: [...c.messages, newMsg] };
                            }
                            return c;
                          }));

                          setIsSendGiftInChatOpen(false);
                          showToast("Sent " + g.name + " " + (g.emoji || '🎁') + "!");
                        }}
                        className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 space-y-1 transition"
                      >
                        <span className="text-2xl flex items-center justify-center text-amber-300">
                          {g.emoji ? g.emoji : <g.icon className="w-6 h-6 mx-auto" />}
                        </span>
                        <p className="font-bold text-white text-[11px]">{g.name}</p>
                        <span className="text-[10px] text-amber-300 font-black">{g.coins} Coins</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CREATE GROUP MODAL */}
            {isCreateGroupModalOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-purple-500/40 max-w-sm w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      👥 Create New Group (ساخت گروه جدید)
                    </h3>
                    <button onClick={() => setIsCreateGroupModalOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-400 text-[10px] block font-bold mb-1">Group Name (نام گروه)</label>
                      <input 
                        type="text"
                        value={newGroupName}
                        onChange={e => setNewGroupName(e.target.value)}
                        placeholder="e.g. VIP Streamers Club"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 text-[10px] block font-bold mb-1">Description (توضیحات)</label>
                      <input 
                        type="text"
                        value={newGroupDesc}
                        onChange={e => setNewGroupDesc(e.target.value)}
                        placeholder="Group purpose & rules..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!newGroupName.trim()) {
                        showToast('Please enter a group name');
                        return;
                      }

                      const newGroup = {
                        id: "group_" + Date.now(),
                        type: 'group',
                        isGroup: true,
                        groupName: newGroupName,
                        user: {
                          username: "group_" + Date.now(),
                          name: newGroupName,
                          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                          isVerified: true,
                          role: 'Group Admin',
                          online: true
                        },
                        lastMessage: 'Group created',
                        lastTime: 'Just now',
                        unreadCount: 0,
                        messages: [
                          { id: 1, sender: 'them', senderName: 'System', text: "Group \"" + newGroupName + "\" created successfully.", time: 'Just now', status: 'read', type: 'text' }
                        ]
                      };

                      setConversations(prev => [newGroup, ...prev]);
                      setIsCreateGroupModalOpen(false);
                      setNewGroupName('');
                      setNewGroupDesc('');
                      showToast("Group \"" + newGroupName + "\" created successfully!");
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition"
                  >
                    Create Group Now
                  </button>
                </div>
              </div>
            )}

            {/* MEDIA GALLERY MODAL */}
            {isChatGalleryOpen && (
              <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
                <div className="card-3d p-6 rounded-3xl bg-slate-900 border border-slate-800 max-w-md w-full space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Image className="w-4 h-4 text-cyan-400" />
                      🖼️ Shared Media Gallery
                    </h3>
                    <button onClick={() => setIsChatGalleryOpen(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
                      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                    ].map((img, i) => (
                      <img key={i} src={img} alt="media" className="w-full h-24 rounded-2xl object-cover ring-1 ring-slate-800" />
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
  );
}
