import React, { useState, useEffect } from 'react';
import { 
  Video, Flame, ShieldCheck, Lock, Unlock, Crown, Users, Eye, Plus, 
  Filter, Sparkles, MessageSquare, Heart, Gift, AlertTriangle, X, Check, 
  ChevronRight, Mic, MicOff, Camera, RefreshCw, Radio, Tag, ShieldAlert, FileText
} from 'lucide-react';
import { apiLive, apiHome, apiAdmin } from '../services/api';
import { safeStorage } from '../utils/safeStorage';
import LiveStreamCardWithPreview from './LiveStreamCard';

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

  // 18+ Access Control States
  const [isAge18Verified, setIsAge18Verified] = useState(() => {
    return localStorage.getItem('vlive_age_18_verified') === 'true';
  });
  const [acceptedAdultRules, setAcceptedAdultRules] = useState(() => {
    return localStorage.getItem('vlive_adult_rules_accepted') === 'true';
  });
  const [isAdultVipModalOpen, setIsAdultVipModalOpen] = useState(false);
  const [isAdultGateModalOpen, setIsAdultGateModalOpen] = useState(false);

  // Streamer Start Live Setup Modal States
  const [isStartLiveModalOpen, setIsStartLiveModalOpen] = useState(false);
  const [newLiveType, setNewLiveType] = useState('standard');
  const [newLiveTitle, setNewLiveTitle] = useState('');
  const [newLiveCategory, setNewLiveCategory] = useState('Trending');
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

  const userGenderVal = String(userGender || currentUser?.gender || safeStorage.getItem('vlive_user_gender') || '').trim().toLowerCase();
  const isFemaleUser = Boolean(
    userGenderVal === 'female' ||
    userGenderVal === 'خانم' ||
    userGenderVal === 'زن' ||
    userGenderVal === 'f'
  );

  // Check if Adult Access is fully granted
  const isAdultVipActive = vipPlan === 'VIP Adult' || vipPlan === 'VIP Platinum' || currentUser?.isAdultVip;
  const hasAdultAccess = isAge18Verified && acceptedAdultRules && (isAdultVipActive || isFemaleUser || isUserAdmin);

  const isManagementApproved = Boolean(
    isUserAdmin ||
    
    isStreamerUser ||
    userRole === 'streamer' ||
    userRole === 'admin' ||
    userRole === 'super_admin' ||
    currentUser?.role === 'streamer' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.user_type === 'STREAMER' ||
    currentUser?.isStreamer || 
    currentUser?.is_streamer ||
    currentUser?.isHost ||
    (kycApplications && Array.isArray(kycApplications) && kycApplications.some(a => (a.username === (currentUsername || currentUser?.username) || a.user_id === currentUser?.id) && a.status === 'Approved'))
  );

  // STRICT RULE: Streamer = Female Gender AND Management Approval together for regular users. Admin has full access.
  const isFemaleApprovedStreamer = Boolean(isUserAdmin || (isFemaleUser && isManagementApproved));
  const isApprovedStreamer = isFemaleApprovedStreamer;

  // Fetch / Sync streams from Supabase on load and listen for real-time updates
  useEffect(() => {
    let isMounted = true;
    const fetchStreams = async () => {
      try {
        const dbStreams = await apiHome.getActiveStreams();
        if (isMounted && Array.isArray(dbStreams)) {
          setStreamsList(dbStreams);
        }
      } catch (err) {
        console.warn('LiveStreamSystem fetchStreams error:', err);
      }
    };

    fetchStreams();

    // Periodic sync every 4 seconds to catch any newly started lives from other devices/users immediately
    const syncInterval = setInterval(fetchStreams, 4000);

    const handleStreamStarted = (e) => {
      if (e?.detail) {
        setStreamsList(prev => {
          const list = Array.isArray(prev) ? prev : [];
          const exists = list.some(s => s.id === e.detail.id);
          if (exists) {
            return list.map(s => s.id === e.detail.id ? { ...s, ...e.detail } : s);
          }
          return [e.detail, ...list];
        });
      }
    };

    const handleStreamEnded = (e) => {
      const endedId = e?.detail?.streamId;
      if (endedId) {
        setStreamsList(prev => (Array.isArray(prev) ? prev.filter(s => s.id !== endedId && s.livekit_room !== endedId) : []));
      }
    };

    window.addEventListener('vlive_stream_started', handleStreamStarted);
    window.addEventListener('vlive_stream_ended', handleStreamEnded);

    return () => {
      isMounted = false;
      clearInterval(syncInterval);
      window.removeEventListener('vlive_stream_started', handleStreamStarted);
      window.removeEventListener('vlive_stream_ended', handleStreamEnded);
    };
  }, []);

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
    { id: 'Trending', label: window.loc('محبوب‌ترین‌ها 🔥', 'The most popular 🔥') }
  ];

  // Adult 18+ Categories list (Private & Exclusive removed for privacy protection)
  const adultCategories = [
    { id: 'all', label: window.loc('همه ۱۸+', 'All 18+') }
  ];

  // Filter streams according to active tab, categories, and search query (Only ACTIVE streams)
  const filteredStreams = (streamsList || []).filter(stream => {
    // STRICT RULE: Only show active live streams (exclude ended ones)
    if (!stream || stream.status === 'ended' || (stream.status && stream.status !== 'active') || stream.is_live === false) {
      return false;
    }

    // STRICT PRIVACY PROTECTION (حفظ کامل حریم خصوصی):
    // Streams marked as private, exclusive or 1-on-1 are NEVER shown in public listings
    if (
      stream.is_private || 
      stream.isPrivate || 
      stream.is_exclusive ||
      stream.isExclusive ||
      stream.visibility === 'private' || 
      stream.category === 'Private Live' || 
      stream.category === 'VIP Chat' ||
      stream.category === 'Private' ||
      stream.access_type === 'private' ||
      stream.privacy === 'private'
    ) {
      return false;
    }

    // Exclude the user's own live stream from their feed
    if (currentUser && (stream.host === currentUser.username || stream.host_id === currentUser.id)) {
      return false;
    }

    const isAdultStream = stream.live_type === 'adult' || stream.isVip18 || stream.is18Plus;
    
    // STRICT RULE: Never mix Standard and Adult streams!
    if (liveTypeTab === 'standard' && isAdultStream) return false;
    if (liveTypeTab === 'adult' && !isAdultStream) return false;

    // Subcategory Filter
    if (selectedSubCategory !== 'all' && stream.category !== selectedSubCategory) {
      return false;
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
      viewers: 0,
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
      
      {/* 1. TOP SECTION (Standard vs Adult 18+ Toggle and Sub-Categories) */}
      <div className="card-3d p-3 bg-slate-900/95 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-xl space-y-3 dir-rtl">
        
        {/* MAIN TYPE TOGGLE (Standard Live vs Adult Live 18+) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              setLiveTypeTab('standard');
              setSelectedSubCategory('all');
            }}
            title={window.loc('پخش استاندارد', 'Standard')}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
              liveTypeTab === 'standard'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30 ring-1 ring-pink-400/50'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Video className="w-5 h-5 text-cyan-300" />
          </button>

          <button
            onClick={() => {
              setLiveTypeTab('adult');
              setSelectedSubCategory('all');
            }}
            title={window.loc('پخش زنده ۱۸+', '18+ Live')}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center ${
              liveTypeTab === 'adult'
                ? 'bg-gradient-to-r from-rose-600 via-purple-700 to-amber-500 text-white shadow-lg shadow-rose-500/40 ring-1 ring-amber-400/60'
                : 'text-rose-400 hover:text-rose-200 hover:bg-slate-900/60'
            }`}
          >
            <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          </button>
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

      {/* 2. ADULT 18+ ACCESS STATUS BANNER (Compact informational banner when regular user visits 18+ tab) */}
      {liveTypeTab === 'adult' && !hasAdultAccess && (
        <div className="card-3d p-3 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-950/90 to-slate-900/90 border border-amber-500/40 backdrop-blur-xl shadow-lg flex items-center justify-between gap-3 dir-rtl animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                <span>{window.loc('پخش زنده ۱۸+ (مخصوص VIP)', '18+ Live Broadcast (VIP Only)')}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">VIP</span>
              </h4>
              <p className="text-[10px] text-slate-400 font-medium">{window.loc('برای مشاهده و ورود به لایوها، تایید سن و اشتراک VIP لازم است', 'Age verification and VIP membership required to watch full streams')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdultGateModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[10px] shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition shrink-0 flex items-center gap-1"
          >
            <Crown className="w-3 h-3 text-slate-950" />
            <span>{window.loc('بازکردن قفل', 'Unlock')}</span>
          </button>
        </div>
      )}

      {/* 3. STREAMS GRID DISPLAY (Always visible for all users - with blur, lock and VIP badge on 18+ for regular users) */}
      <div>
        {filteredStreams.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-2">
            <Radio className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
            <p className="text-xs font-bold text-slate-400">
              {liveTypeTab === 'adult'
                ? window.loc('در حال حاضر لایواستریم ۱۸+ فعالی وجود ندارد', 'No active 18+ live streams at the moment')
                : window.loc('در حال حاضر پخش زنده‌ای در دسترس نیست', 'No live streams available at the moment')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {filteredStreams.map(stream => {
              const isAdult = stream.live_type === 'adult' || stream.isVip18 || stream.is18Plus;
              const isLocked = isAdult && !hasAdultAccess;

              return (
                <LiveStreamCardWithPreview
                  key={stream.id}
                  stream={stream}
                  isAdult={isAdult}
                  isLocked={isLocked}
                  currentUser={currentUser}
                  onUnlockRequest={() => setIsAdultGateModalOpen(true)}
                  onSelectStream={(selected) => setViewingStream(selected)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 18+ UNLOCK & VERIFICATION MODAL */}
      {isAdultGateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn dir-rtl">
          <div className="card-3d w-full max-w-md bg-slate-900 rounded-3xl border border-amber-500/40 p-5 shadow-[0_0_50px_rgba(245,158,11,0.25)] space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{window.loc('دسترسی به بخش لایوهای ۱۸+', '18+ Live Section Access')}</h3>
                  <p className="text-[11px] text-slate-400">{window.loc('احراز سن و فعال‌سازی اشتراک VIP', 'Age verification & VIP membership')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAdultGateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
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
                  setIsAdultGateModalOpen(false);
                  setIsAdultVipModalOpen(true);
                } else {
                  setIsAdultGateModalOpen(false);
                  showToast(window.loc('✅ دسترسی ۱۸+ شما فعال است', '✅ Your 18+ access is active'));
                }
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 hover:scale-102 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{isAdultVipActive ? window.loc('مشاهده لایوهای ۱۸+', 'Watch 18+ livestreams') : window.loc('ارتقا به اشتراک Adult VIP', 'Upgrade to Adult VIP subscription')}</span>
            </button>

          </div>
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
                      setNewLiveCategory('Trending');
                    }}
                    title={window.loc('پخش استاندارد', 'Standard')}
                    className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center ${
                      newLiveType === 'standard'
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Video className="w-5 h-5 text-pink-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewLiveType('adult');
                      setNewLiveCategory('General 18+');
                    }}
                    title={window.loc('پخش زنده ۱۸+', '18+ Live')}
                    className={`py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center ${
                      newLiveType === 'adult'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-black'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
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
                  placeholder={window.loc('مثال: پخش زنده شبانه 🎵', 'Example: night live stream 🎵')}
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
                      <option value="Trending">{window.loc('محبوب‌ترین‌ها 🔥', 'Popular 🔥')}</option>
                      <option value="IRL">{window.loc('زندگی روزمره 📹', 'Daily life 📹')}</option>
                    </>
                  ) : (
                    <>
                      <option value="General 18+">{window.loc('پخش عمومی ۱۸+ 🔞', 'General 18+ 🔞')}</option>
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
