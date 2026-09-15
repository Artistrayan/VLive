import React, { useState, useEffect } from 'react';
import { 
  Video, Flame, ShieldCheck, Lock, Unlock, Crown, Users, Eye, Plus, 
  Filter, Sparkles, MessageSquare, Heart, Gift, AlertTriangle, X, Check, 
  ChevronRight, Mic, MicOff, Camera, RefreshCw, Radio, Tag, ShieldAlert
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

  // Age verification from profile (set upon initial onboarding/profile completion)
  const userAge = Number(
    currentUser?.age || 
    safeStorage.getItem('vlive_profile_age') || 
    (currentUser?.birth_date ? new Date().getFullYear() - new Date(currentUser.birth_date).getFullYear() : 0) ||
    (safeStorage.getItem('vlive_profile_completed') === 'true' ? 18 : 0)
  );
  const isUnder18 = userAge > 0 && userAge < 18;

  // Check if Adult Access is granted
  const isAdultVipActive = Boolean(vipPlan === 'VIP Adult' || vipPlan === 'VIP Platinum' || currentUser?.isAdultVip || currentUser?.vip_plan === 'VIP Adult' || currentUser?.vip_plan === 'VIP Platinum');
  const hasAdultAccess = Boolean(isUserAdmin || isFemaleUser || (!isUnder18 && isAdultVipActive));

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

  // Handler for locked 18+ stream click
  const handleLockedStreamClick = () => {
    if (isUnder18) {
      showToast(window.loc('⚠️ دسترسی غیرمجاز: سن شما کمتر از ۱۸ سال است و امکان مشاهده این لایو را ندارید', '⚠️ Access restricted: You are under 18 years old and cannot view this live stream'));
    } else if (!isAdultVipActive) {
      showToast(window.loc('⚠️ این پخش زنده مخصوص مشترکین VIP و افراد بالای ۱۸ سال است', '⚠️ This live stream is for 18+ VIP members only'));
    } else {
      showToast(window.loc('⚠️ این محتوا مخصوص افراد بالای ۱۸ سال است', '⚠️ This content is restricted to 18+ users'));
    }
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

      {/* 2. STREAMS GRID DISPLAY (Always visible for all users - with blur, lock and VIP badge on 18+ for regular users) */}
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
                  onUnlockRequest={handleLockedStreamClick}
                  onSelectStream={(selected) => setViewingStream(selected)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 3. APPROVED STREAMER START LIVE SETUP MODAL */}
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

    </div>
  );
}
