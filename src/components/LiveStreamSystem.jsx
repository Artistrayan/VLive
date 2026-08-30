import React, { useState, useEffect } from 'react';
import { 
  Video, Flame, ShieldCheck, Lock, Unlock, Crown, Users, Eye, Search, Plus, 
  Filter, Sparkles, MessageSquare, Heart, Gift, AlertTriangle, X, Check, 
  ChevronRight, Mic, MicOff, Camera, RefreshCw, Radio, Tag, ShieldAlert, FileText
} from 'lucide-react';
import { apiLive, apiAdmin } from '../services/api';

export default function LiveStreamSystem({
  currentUser,
  currentUsername,
  userRole,
  userGender,
  isUserRayan,
  isUserSuperAdmin,
  isVerified,
  userCoins,
  setUserCoins,
  vipPlan,
  setVipPlan,
  streamsList,
  setStreamsList,
  viewingStream,
  setViewingStream,
  showToast,
  setActiveTab,
  handleInitiateCall,
  addAdminAuditLog,
  setAdminReportsList,
  setIsHostLiveOpen,
  setIsLiveStudioOpen,
  setIsBecomeStreamerModalOpen,
  isStreamerUser,
  kycApplications
}) {
  // Category & Subtab Switchers
  const [liveTypeTab, setLiveTypeTab] = useState('standard'); // 'standard' | 'adult'
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 18+ Access Control States
  const [isAge18Verified, setIsAge18Verified] = useState(() => {
    return localStorage.getItem('vlive_age_18_verified') === 'true';
  });
  const [acceptedAdultRules, setAcceptedAdultRules] = useState(() => {
    return localStorage.getItem('vlive_adult_rules_accepted') === 'true';
  });
  const [isAdultVipModalOpen, setIsAdultVipModalOpen] = useState(false);

  // Check if Adult Access is fully granted
  const isAdultVipActive = vipPlan === 'VIP Adult' || vipPlan === 'VIP Platinum' || currentUser?.isAdultVip;
  const hasAdultAccess = isAge18Verified && acceptedAdultRules && isAdultVipActive;

  // Streamer Start Live Setup Modal States
  const [isStartLiveModalOpen, setIsStartLiveModalOpen] = useState(false);
  const [newLiveType, setNewLiveType] = useState('standard');
  const [newLiveTitle, setNewLiveTitle] = useState('');
  const [newLiveCategory, setNewLiveCategory] = useState('Gaming');
  const [newLiveDesc, setNewLiveDesc] = useState('');
  const [newLiveThumbnail, setNewLiveThumbnail] = useState('');
  const [newLiveTags, setNewLiveTags] = useState('#game #chat');

  // Check Streamer Permission (Includes verified streamers and verified Admins)
  const isUserAdmin = Boolean(
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    isUserRayan ||
    isUserSuperAdmin ||
    currentUser?.role === 'admin' || 
    currentUser?.role === 'super_admin' || 
    currentUser?.isUserRayan || 
    currentUser?.isUserSuperAdmin ||
    String(currentUser?.username || '').toLowerCase() === 'rayan' ||
    String(currentUsername || '').toLowerCase() === 'rayan' ||
    String(currentUser?.telegram_id || '').trim() === '8933698119'
  );

  const isApprovedStreamer = Boolean(
    isUserAdmin || 
    isStreamerUser ||
    userRole === 'streamer' ||
    currentUser?.role === 'streamer' ||
    currentUser?.user_type === 'STREAMER' ||
    currentUser?.isStreamer || 
    currentUser?.isVerifiedStreamer || 
    currentUser?.is_streamer ||
    currentUser?.isHost ||
    (isVerified && currentUser?.role !== 'user') ||
    (kycApplications && Array.isArray(kycApplications) && kycApplications.some(a => (a.username === (currentUsername || currentUser?.username) || a.user_id === currentUser?.id) && a.status === 'Approved'))
  );

  const userGenderVal = userGender || currentUser?.gender || '';
  const isFemaleUser = Boolean(
    String(userGenderVal).trim().toLowerCase() === 'female' ||
    userGenderVal === 'خانم' ||
    userGenderVal === 'زن'
  );

  const isFemaleApprovedStreamer = Boolean((isFemaleUser || isUserAdmin) && isApprovedStreamer);

  // Fetch / Sync streams from Supabase on load
  useEffect(() => {
    const fetchStreams = async () => {
      const dbStreams = await apiLive.getLiveStreams(liveTypeTab);
      if (Array.isArray(dbStreams)) {
        setStreamsList(dbStreams);
      }
    };
    fetchStreams();
  }, [liveTypeTab]);

  // Handle Age 18 Verification save
  const handleVerifyAge18 = (verified) => {
    setIsAge18Verified(verified);
    localStorage.setItem('vlive_age_18_verified', verified ? 'true' : 'false');
    apiLive.saveAdultAccess({
      age_verified: verified,
      rules_accepted: acceptedAdultRules,
      adult_vip_active: isAdultVipActive
    });
  };

  const handleAcceptAdultRules = (accepted) => {
    setAcceptedAdultRules(accepted);
    localStorage.setItem('vlive_adult_rules_accepted', accepted ? 'true' : 'false');
    apiLive.saveAdultAccess({
      age_verified: isAge18Verified,
      rules_accepted: accepted,
      adult_vip_active: isAdultVipActive
    });
  };

  // Handle Upgrade to Adult VIP
  const handleUpgradeToAdultVip = () => {
    setVipPlan('VIP Adult');
    localStorage.setItem('vlive_vip_plan', 'VIP Adult');
    showToast(window.loc('🎉 اشتراک Adult VIP شما با موفقیت فعال گردید!', '🎉 Your Adult VIP subscription has been successfully activated!'));
    setIsAdultVipModalOpen(false);
    apiLive.saveAdultAccess({
      age_verified: isAge18Verified,
      rules_accepted: acceptedAdultRules,
      adult_vip_active: true
    });
  };

  // Standard Categories list
  const standardCategories = [
    { id: 'all', label: window.loc('همه', 'everyone') },
    { id: 'Gaming', label: window.loc('گیمینگ 🎮', 'Gaming 🎮') },
    { id: 'Music', label: window.loc('موسیقی 🎵', 'Music 🎵') },
    { id: 'Chat', label: window.loc('چت آنلاین 💬', 'Online chat 💬') },
    { id: 'Dance', label: window.loc('رقص & هنر 💃', 'Dance & Art 💃') },
    { id: 'Trending', label: window.loc('محبوب‌ترین‌ها 🔥', 'The most popular 🔥') }
  ];

  // Adult 18+ Categories list
  const adultCategories = [
    { id: 'all', label: window.loc('همه ۱۸+', 'All 18+') },
    { id: 'VIP Chat', label: window.loc('چت اختصاصی 🔞', 'Private chat 🔞') },
    { id: 'Hot Dance', label: window.loc('رقص داغ 🔥', 'Hot dance 🔥') },
    { id: 'Romance', label: window.loc('گپ عاشقانه ❤️', 'Romantic chat ❤️') },
    { id: 'Private Live', label: window.loc('استریم خصوصی 💥', 'Private stream 💥') }
  ];

  // Filter streams according to active tab, categories, and search query
  const filteredStreams = (streamsList || []).filter(stream => {
    const isAdultStream = stream.live_type === 'adult' || stream.isVip18 || stream.is18Plus;
    
    // STRICT RULE: Never mix Standard and Adult streams!
    if (liveTypeTab === 'standard' && isAdultStream) return false;
    if (liveTypeTab === 'adult' && !isAdultStream) return false;

    // Subcategory Filter
    if (selectedSubCategory !== 'all' && stream.category !== selectedSubCategory) {
      return false;
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (stream.title || '').toLowerCase().includes(q);
      const matchHost = (stream.host || '').toLowerCase().includes(q);
      const matchCategory = (stream.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchHost && !matchCategory) return false;
    }

    return true;
  });

  // Handle approved streamer starting a live stream
  const handleStartLiveStream = async () => {
    if (!newLiveTitle.trim()) {
      showToast(window.loc('⚠️ لطفاً عنوان لایواستریم را وارد کنید', '⚠️ Please enter the title of the live stream'));
      return;
    }

    // Generate secure LiveKit token for authorized broadcaster
    const roomName = `room_${currentUser?.id || 'broadcaster'}_${Date.now()}`;
    const tokenRes = await apiLive.generateLiveKitToken({
      roomName: roomName
    });

    if (!tokenRes.success) {
      showToast(window.loc(`⛔ خطا در احراز هویت لایو‌کیت: ${tokenRes.error}`, `⛔ LiveKit Auth Error: ${tokenRes.error}`));
      return;
    }

    const streamPayload = {
      host: currentUser?.name || currentUsername || 'Streamer',
      host_id: currentUser?.id,
      avatar: currentUser?.avatar || '',
      title: newLiveTitle.trim(),
      category: newLiveCategory,
      live_type: newLiveType,
      description: newLiveDesc,
      thumbnail: newLiveThumbnail || '',
      tags: newLiveTags,
      livekit_token: tokenRes.token,
      livekit_room: tokenRes.roomName,
      livekit_server_url: tokenRes.serverUrl,
      is_broadcaster_authorized: true
    };

    // Save to Supabase DB
    const res = await apiLive.createLiveStream(streamPayload);
    const createdData = res.success ? res.data : streamPayload;
    const streamId = createdData.id || `stream_${Date.now()}`;

    const newStreamObj = {
      id: streamId,
      host: streamPayload.host,
      avatar: streamPayload.avatar,
      title: streamPayload.title,
      category: streamPayload.category,
      live_type: streamPayload.live_type,
      thumbnail: streamPayload.thumbnail,
      viewers: 1,
      isSelfStream: true,
      status: 'active',
      livekit_token: tokenRes.token,
      livekit_room: tokenRes.roomName,
      livekit_server_url: tokenRes.serverUrl,
      is_broadcaster_authorized: true
    };

    setStreamsList(prev => [newStreamObj, ...prev]);
    setViewingStream(newStreamObj);
    setIsStartLiveModalOpen(false);
    showToast(window.loc(`🎥 پخش زنده ${newLiveType === 'adult' ? window.loc('۱۸+', '18+') : window.loc('استاندارد', 'Standard')} شما با موفقیت شروع شد!`, `🎥 پخش زنده ${newLiveType === 'adult' ? window.loc('۱۸+', '18+') : window.loc('استاندارد', 'Standard')} شما با موفقیت شروع شد!`));
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      
      {/* 1. TOP SECTION HEADER & CATEGORY SWITCHER (Standard vs Adult 18+) */}
      <div className="card-3d p-4 bg-slate-900/95 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl space-y-3 dir-rtl">
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-0.5 shadow-lg shadow-pink-500/30 flex items-center justify-center">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-1.5">
                <span>V.LIVE</span>
                <span className="text-[10px] bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full border border-pink-500/30">{window.loc('زنده', 'alive')}</span>
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold">{window.loc('پخش زنده استریمرهای تایید شده', 'Live streaming from verified streamers')}</p>
            </div>
          </div>

          {isFemaleApprovedStreamer && (
            <button
              onClick={() => {
                if (setIsLiveStudioOpen) {
                  setIsLiveStudioOpen(true);
                } else if (setIsHostLiveOpen) {
                  setIsHostLiveOpen(true);
                } else {
                  setIsStartLiveModalOpen(true);
                }
              }}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 hover:opacity-95 text-white font-black text-xs shadow-lg flex items-center gap-1.5 hover:scale-102 active:scale-95 transition shadow-pink-500/30 shrink-0"
            >
              <Video className="w-4 h-4 animate-pulse" />
              <span>{window.loc('ورود به Live Studio 🎥', 'Open Live Studio 🎥')}</span>
            </button>
          )}
        </div>

        {/* MAIN TYPE TOGGLE (Standard Live vs Adult Live 18+) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              setLiveTypeTab('standard');
              setSelectedSubCategory('all');
            }}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              liveTypeTab === 'standard'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 ring-1 ring-pink-400/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Video className="w-4 h-4 text-cyan-300" />
            <span>{window.loc('📺 پخش زنده استاندارد', '📺 Standard live broadcast')}</span>
          </button>

          <button
            onClick={() => {
              setLiveTypeTab('adult');
              setSelectedSubCategory('all');
            }}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
              liveTypeTab === 'adult'
                ? 'bg-gradient-to-r from-rose-600 via-purple-700 to-amber-500 text-white shadow-lg shadow-rose-500/40 ring-1 ring-amber-400/60'
                : 'text-rose-400 hover:text-rose-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{window.loc('🔥 پخش زنده ۱۸+ (Adult)', '🔥 Live streaming 18+ (Adult)')}</span>
          </button>
        </div>

        {/* SEARCH BAR FOR STREAMS */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={liveTypeTab === 'adult' ? window.loc('جستجو در لایوهای ۱۸+ ...', 'Search in 18+ live...') : window.loc('جستجوی نام استریمر یا عنوان لایو ...', 'Search streamer name or live title...')}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white outline-none focus:border-pink-500 placeholder-slate-500 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>

        {/* SUBCATEGORY PILLS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar dir-rtl">
          {(liveTypeTab === 'adult' ? adultCategories : standardCategories).map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedSubCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedSubCategory === cat.id
                  ? liveTypeTab === 'adult'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                    : 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

      </div>

      {/* 2. ADULT 18+ ACCESS CONTROL GATE (If user selected Adult tab but lacks 18+ access) */}
      {liveTypeTab === 'adult' && !hasAdultAccess && (
        <div className="card-3d p-6 rounded-3xl bg-slate-900/95 border border-rose-500/50 backdrop-blur-xl shadow-2xl text-center space-y-5 animate-fadeIn dir-rtl">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8 text-rose-400 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-white flex items-center justify-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>{window.loc('محدودیت دسترسی به بخش لایوهای ۱۸+', 'Restricted access to the 18+ live section')}</span>
            </h3>
          </div>

          {/* CHECKBOXES & VERIFICATION STEPS */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right space-y-3">
            
            {/* Step 1: Age 18 Check */}
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-900/60 transition">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`w-4 h-4 ${isAge18Verified ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-slate-200">{window.loc('تایید سن بالای ۱۸ سال دارم', 'I am over 18 years old')}</span>
              </div>
              <input
                type="checkbox"
                checked={isAge18Verified}
                onChange={(e) => handleVerifyAge18(e.target.checked)}
                className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
              />
            </label>

            {/* Step 2: Accept Adult Rules */}
            <label className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-900/60 transition">
              <div className="flex items-center gap-2">
                <FileText className={`w-4 h-4 ${acceptedAdultRules ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-slate-200">{window.loc('پذیرش قوانین و حریم خصوصی ۱۸+', 'Acceptance of 18+ privacy rules')}</span>
              </div>
              <input
                type="checkbox"
                checked={acceptedAdultRules}
                onChange={(e) => handleAcceptAdultRules(e.target.checked)}
                className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
              />
            </label>

            {/* Step 3: Adult VIP Status */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <Crown className={`w-4 h-4 ${isAdultVipActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-slate-200">{window.loc('وضعیت اشتراک Adult VIP', 'Adult VIP subscription status')}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${isAdultVipActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
                {isAdultVipActive ? window.loc('فعال ✅', 'active') : window.loc('غیرفعال ❌', 'Disabled ❌')}
              </span>
            </div>

          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={() => {
              if (!isAge18Verified || !acceptedAdultRules) {
                showToast(window.loc('⚠️ لطفاً ابتدا سن بالای ۱۸ سال و قوانین را تایید کنید', '⚠️ Please confirm the age above 18 years and the rules first'));
                return;
              }
              if (!isAdultVipActive) {
                setIsAdultVipModalOpen(true);
              }
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span>{isAdultVipActive ? window.loc('بازکردن محتوای ۱۸+', 'Unlocking 18+ content') : window.loc('ارتقا به اشتراک Adult VIP', 'Upgrade to Adult VIP subscription')}</span>
          </button>
        </div>
      )}

      {/* 3. STREAMS GRID DISPLAY */}
      {(liveTypeTab === 'standard' || hasAdultAccess) && (
        <div>
          {filteredStreams.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 dir-rtl">
              <Video className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
              <h4 className="text-sm font-black text-white">{window.loc('هیچ لایواستریمی در این بخش یافت نشد', 'No live streams were found in this section')}</h4>
              <p className="text-xs text-slate-400">
                {window.loc('در حال حاضر لایواستریم مستقیمی در دسته‌بندی', 'Currently livestreaming directly in the category')} {selectedSubCategory} {window.loc('قرار ندارد.', 'not supposed to')}
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {filteredStreams.map(stream => {
                const isAdult = stream.live_type === 'adult' || stream.isVip18;

                return (
                  <div
                    key={stream.id}
                    onClick={() => setViewingStream(stream)}
                    className="card-3d bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 group relative cursor-pointer shadow-lg hover:border-pink-500/50 transition duration-300"
                  >
                    {/* THUMBNAIL CONTAINER */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-slate-950">
                      {stream.thumbnail || stream.avatar ? (
                        <img
                          src={stream.thumbnail || stream.avatar}
                          alt={stream.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-600 font-bold text-xs">
                          {window.loc('بدون تصویر', 'No Image')}
                        </div>
                      )}

                      {/* DARK GRADIENT OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                      {/* TOP BADGES */}
                      <div className="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between">
                        {/* Live Badge */}
                        <div className="flex items-center gap-1 bg-rose-600/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-rose-400/40 text-[9px] font-black text-white shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          <span>LIVE</span>
                        </div>

                        {/* Viewers Badge */}
                        <div className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-800 text-[10px] font-bold text-slate-200">
                          <Eye className="w-3 h-3 text-cyan-400" />
                          <span>{(stream.viewers || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* 18+ VIP BADGE IF ADULT */}
                      {isAdult && (
                        <div className="absolute top-9 right-2.5 bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1">
                          <Crown className="w-3 h-3 text-slate-950" />
                          <span>ADULT 18+</span>
                        </div>
                      )}

                      {/* BOTTOM INFORMATION OVERLAY */}
                      <div className="absolute bottom-3 right-3 left-3 space-y-1 text-right dir-rtl">
                        <span className="inline-block px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-[9px] font-bold text-pink-300">
                          {stream.category || 'General'}
                        </span>
                        
                        <h4 className="text-xs font-black text-white truncate drop-shadow">
                          {stream.title || window.loc('پخش زنده اختصاسی', 'Special live broadcast')}
                        </h4>

                        <div className="flex items-center gap-1.5 pt-0.5">
                          {stream.avatar ? (
                            <img
                              src={stream.avatar}
                              alt={stream.host}
                              className="w-4 h-4 rounded-full object-cover border border-white/40"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[8px] font-bold text-white">
                              {stream.host ? stream.host.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <span className="text-[10px] font-bold text-slate-300 truncate">
                            {stream.host}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. APPROVED STREAMER START LIVE SETUP MODAL */}
      {isStartLiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn dir-rtl">
          <div className="card-3d w-full max-w-md bg-slate-900 rounded-3xl border border-pink-500/40 p-5 shadow-[0_0_50px_rgba(236,72,153,0.3)] space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{window.loc('تنظیمات شروع پخش زنده', 'Live broadcast start settings')}</h3>
                  <p className="text-[11px] text-slate-400">{window.loc('تنظیم عنوان، رده‌بندی و نوع پخش استریم', 'Setting the title, classification and type of streaming')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsStartLiveModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5 text-xs text-right">
              
              {/* SELECT LIVE TYPE (Standard vs Adult 18+) */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {window.loc('🎯 انتخاب نوع لایواستریم:', '🎯 Choosing the type of live stream:')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewLiveType('standard');
                      setNewLiveCategory('Gaming');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      newLiveType === 'standard'
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Video className="w-4 h-4 text-pink-400" />
                    <span>{window.loc('استاندارد (عمومی)', 'standard (general)')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewLiveType('adult');
                      setNewLiveCategory('VIP Chat');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                      newLiveType === 'adult'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>{window.loc('بزرگسال (۱۸+)', 'adult (18+)')}</span>
                  </button>
                </div>
              </div>

              {/* LIVE TITLE */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {window.loc('✏️ عنوان لایواستریم:', '✏️ Live stream title:')}
                </label>
                <input
                  type="text"
                  value={newLiveTitle}
                  onChange={(e) => setNewLiveTitle(e.target.value)}
                  placeholder={window.loc('مثال: پخش زنده گپ و گفت شبانه 🎵', 'Example: live broadcast of night chat 🎵')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
                />
              </div>

              {/* CATEGORY SELECTOR */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {window.loc('📂 دسته‌بندی موضوعی:', '📂 Subject category:')}
                </label>
                <select
                  value={newLiveCategory}
                  onChange={(e) => setNewLiveCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500"
                >
                  {newLiveType === 'standard' ? (
                    <>
                      <option value="Gaming">{window.loc('گیمینگ 🎮', 'Gaming 🎮')}</option>
                      <option value="Music">{window.loc('موسیقی 🎵', 'Music 🎵')}</option>
                      <option value="Chat">{window.loc('چت آنلاین 💬', 'Online chat 💬')}</option>
                      <option value="Dance">{window.loc('رقص & هنر 💃', 'Dance & Art 💃')}</option>
                      <option value="IRL">{window.loc('زندگی روزمره 📹', 'Daily life 📹')}</option>
                    </>
                  ) : (
                    <>
                      <option value="VIP Chat">{window.loc('چت اختصاصی 🔞', 'Private chat 🔞')}</option>
                      <option value="Hot Dance">{window.loc('رقص داغ 🔥', 'Hot dance 🔥')}</option>
                      <option value="Romance">{window.loc('گپ عاشقانه ❤️', 'Romantic chat ❤️')}</option>
                      <option value="Private Live">{window.loc('استریم خصوصی 💥', 'Private stream 💥')}</option>
                    </>
                  )}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {window.loc('📝 توضیحات مختصر (بیو لایو):', '📝 Brief description (Bio Live):')}
                </label>
                <textarea
                  rows={2}
                  value={newLiveDesc}
                  onChange={(e) => setNewLiveDesc(e.target.value)}
                  placeholder={window.loc('توضیحاتی برای بینندگان خود بنویسید ...', 'Write a description for your viewers...')}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold outline-none focus:border-pink-500 resize-none"
                />
              </div>

              {/* THUMBNAIL URL */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {window.loc('🖼️ آدرس کاور استریم (Thumbnail):', '🖼️ Address of cover stream (Thumbnail):')}
                </label>
                <input
                  type="text"
                  value={newLiveThumbnail}
                  onChange={(e) => setNewLiveThumbnail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] outline-none focus:border-pink-500"
                />
              </div>

              {/* TAGS */}
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {window.loc('🏷️ برچسب‌ها (Tags):', 'Tags:')}
                </label>
                <input
                  type="text"
                  value={newLiveTags}
                  onChange={(e) => setNewLiveTags(e.target.value)}
                  placeholder="#music #chat #vlive"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs outline-none focus:border-pink-500"
                />
              </div>

            </div>

            {/* START LIVE ACTION BUTTON */}
            <button
              onClick={handleStartLiveStream}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-400 text-white font-black text-xs shadow-lg hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{window.loc('شروع رسمی پخش زنده', 'The official start of the live stream')}</span>
            </button>

          </div>
        </div>
      )}

      {/* 5. ADULT VIP PURCHASE MODAL */}
      {isAdultVipModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn dir-rtl">
          <div className="card-3d w-full max-w-md bg-slate-900 rounded-3xl border border-amber-500/40 p-5 shadow-[0_0_50px_rgba(245,158,11,0.3)] space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{window.loc('ارتقا به اشتراک Adult VIP', 'Upgrade to Adult VIP subscription')}</h3>
                  <p className="text-[11px] text-slate-400">{window.loc('دسترسی نامحدود به لایوها و دسته‌بندی‌های ۱۸+', 'Unlimited access to 18+ live streams and categories')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAdultVipModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2">
                <h4 className="font-black text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>{window.loc('مزایای اختصاصی Adult VIP:', 'Exclusive benefits of Adult VIP:')}</span>
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
                  <li>{window.loc('دسترسی کامل و بدون محدودیت به تمام لایواستریم‌های ۱۸+', 'Complete and unrestricted access to all 18+ livestreams')}</li>
                  <li>{window.loc('امکان جستجو و فیلتر اختصاصی در دسته ۱۸+', 'Ability to search and filter exclusively in the 18+ category')}</li>
                  <li>{window.loc('نشان ویژه Adult VIP طلایی روی پروفایل کاربری', 'Golden Adult VIP badge on user profile')}</li>
                  <li>{window.loc('امکان تماس تصویری مستقیم با استریمرهای ۱۸+', 'Possibility of direct video call with 18+ streamers')}</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleUpgradeToAdultVip}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 text-white font-black text-xs shadow-lg shadow-amber-500/30 hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>{window.loc('تایید و فعال‌سازی فوری اشتراک Adult VIP', 'Confirmation and instant activation of Adult VIP subscription')}</span>
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
