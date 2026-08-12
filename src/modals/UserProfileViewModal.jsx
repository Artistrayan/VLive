import React, { useState } from 'react';
import { isUserAnAdmin } from '../utils/usernameUtils';
import { 
  X, Heart, MessageSquare, PhoneCall, Video, Gift, Share2, ShieldAlert,
  Crown, CheckCircle, MapPin, Sparkles, UserCheck, UserX, Ban, Flag,
  Radio, Camera, Play, Flame, Star, Lock, Eye, AlertCircle, ShieldCheck,
  Zap, Award, Globe, Briefcase, GraduationCap, Copy, Check, Users, Shield
} from 'lucide-react';
import { CoinsIcon, VerifiedBadge, VipStatusBadge, StreamerScoresBadges } from '../components/CommonBadges';

export default function UserProfileViewModal({
  isOpen,
  onClose,
  user,
  currentUser = {},
  isUserRayan = false,
  isSuperAdmin = false,
  showToast = (() => {}),
  loc = ((a, b) => b || a),
  onFollowToggle = (() => {}),
  onStartMessage = (() => {}),
  onStartCall = (() => {}),
  onSendGift = (() => {}),
  onReportUser = (() => {}),
  onBlockUser = (() => {}),
  onAdminAction = (() => {})
}) {
  if (!isOpen || !user) return null;

  const isAdminUser = currentUser?.role === 'admin' && String(currentUser?.telegram_id || '').trim() === '8933698119';

  // --- STATE FOR INTERACTION ---
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || user.followed || false);
  const [isLiked, setIsLiked] = useState(user.isLiked || false);
  const [isSuperLiked, setIsSuperLiked] = useState(user.isSuperLiked || false);
  const [likesCount, setLikesCount] = useState(user.likes || user.likesCount || 0);
  const [followersCount, setFollowersCount] = useState(user.followers || user.followersCount || 0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'media' | 'lives' | 'about'
  
  // Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('fake_account');
  const [reportNotes, setReportNotes] = useState('');

  // Admin Actions State
  const [isBanned, setIsBanned] = useState(user.isBanned || false);
  const [isVerified, setIsVerified] = useState(user.isVerified || user.verified || false);
  const [isStreamer, setIsStreamer] = useState(user.isStreamer || user.is_streamer || user.isHost || false);
  const [adminNote, setAdminNote] = useState('');

  const userName = user.name || user.fullName || user.hostName || 'User';
  const username = user.username || user.host || user.id || 'user_vlive';
  const avatar = user.avatar || user.thumbnail || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  const cover = user.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  const age = user.age || 23;
  const city = user.city || user.location || 'Tehran, Iran';
  const bio = user.bio || user.description || 'V.Live active host & streamer. Enjoy live video streams and private chats!';
  const isOnline = user.online !== false;
  const isVip = user.isVip || user.is_vip || user.vip || false;
  const matchScore = user.matchScore || 95;
  const distance = user.distance || '2.4 km away';

  // Sample User Media
  const publicPhotos = user.photos || [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
  ];

  const toggleFollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowersCount(prev => nextState ? prev + 1 : prev - 1);
    onFollowToggle(user, nextState);
    showToast(nextState ? window.loc(`با موفقیت ${userName} را دنبال کردید 👤`, `با موفقیت ${userName} را دنبال کردید 👤`) : window.loc(`دنبال کردن لغو شد`, `دنبال کردن لغو شد`));
  };

  const toggleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount(prev => nextState ? prev + 1 : prev - 1);
    showToast(nextState ? window.loc(`💖 لایک برای ${userName} ارسال شد`, `💖 لایک برای ${userName} ارسال شد`) : window.loc(`لایک برداشته شد`, `لایک برداشته شد`));
  };

  const triggerSuperLike = () => {
    setIsSuperLiked(true);
    showToast(window.loc(`🌟 سوپرلایک طلایی برای ${userName} فرستاده شد!`, `🌟 سوپرلایک طلایی برای ${userName} فرستاده شد!`));
  };

  const submitReport = () => {
    onReportUser(user.id || username, reportReason, reportNotes);
    setIsReportModalOpen(false);
    setReportNotes('');
    showToast(window.loc('🚩 گزارش تخلف با موفقیت ثبت شد و بررسی خواهد شد', '🚩 Violation report has been successfully registered and will be reviewed'));
  };

  const handleAdminBanToggle = () => {
    const nextState = !isBanned;
    setIsBanned(nextState);
    onAdminAction('ban', { userId: user.id, username, isBanned: nextState });
    showToast(nextState ? window.loc(`🚫 کاربر ${userName} مسدود شد`, `🚫 کاربر ${userName} مسدود شد`) : window.loc('عملیات لغو شد', 'Action cancelled'));
  };

  const handleAdminVerifyToggle = () => {
    const nextState = !isVerified;
    setIsVerified(nextState);
    onAdminAction('verify', { userId: user.id, username, isVerified: nextState });
    showToast(nextState ? window.loc(`✅ نشان تایید برای ${userName} فعال شد`, `✅ نشان تایید برای ${userName} فعال شد`) : window.loc('عملیات لغو شد', 'Action cancelled'));
  };

  const handleAdminStreamerToggle = () => {
    const nextState = !isStreamer;
    setIsStreamer(nextState);
    onAdminAction('streamer', { userId: user.id, username, isStreamer: nextState });
    showToast(nextState ? window.loc(`🎥 مقام استریمر به ${userName} اعطا شد`, `🎥 مقام استریمر به ${userName} اعطا شد`) : window.loc('عملیات لغو شد', 'Action cancelled'));
  };

  return (
    <div className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-xl flex flex-col justify-end sm:justify-center p-0 sm:p-4 overflow-y-auto animate-fadeIn dir-ltr">
      <div className="w-full max-w-xl mx-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 rounded-t-3xl sm:rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden my-0 sm:my-auto max-h-[92vh] flex flex-col">
        
        {/* ================= HEADER COVER & PROFILE PHOTO ================= */}
        <div className="relative h-44 sm:h-52 shrink-0 bg-slate-900 overflow-hidden">
          <img src={cover} alt="Cover" className="w-full h-full object-cover opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          {/* Close & Share Buttons */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 text-white flex items-center justify-center font-bold backdrop-blur-md border border-white/20 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast(window.loc('لینک پروفایل کپی شد 🔗', 'The profile link was copied'));
                }}
                className="w-10 h-10 rounded-full bg-slate-950/70 hover:bg-slate-900 text-cyan-300 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg"
                title="Share Profile"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="w-10 h-10 rounded-full bg-rose-950/70 hover:bg-rose-900 text-rose-300 flex items-center justify-center backdrop-blur-md border border-rose-500/30 shadow-lg"
                title="Report Account"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Compatibility Match Badge */}
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-black shadow-lg flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>{matchScore}% Match</span>
          </div>
        </div>

        {/* ================= USER DETAILS CONTENT ================= */}
        <div className="px-5 pb-6 overflow-y-auto flex-1 space-y-5 -mt-14 relative z-10 scrollbar-none">
          
          {/* Avatar & Online Row */}
          <div className="flex items-end justify-between">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-2xl">
                <img src={avatar} alt={userName} className="w-full h-full object-cover rounded-full bg-slate-900" />
              </div>
              {isOnline && (
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-950 rounded-full shadow-lg" title="Online Now" />
              )}
            </div>

            {/* Quick Follow & Like Buttons */}
            <div className="flex items-center gap-2 pb-1">
              <button
                onClick={toggleLike}
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition shadow-lg ${
                  isLiked 
                    ? 'bg-rose-600 border-rose-400 text-white' 
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={triggerSuperLike}
                className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition shadow-lg ${
                  isSuperLiked 
                    ? 'bg-amber-400 border-amber-300 text-slate-950 font-black' 
                    : 'bg-slate-900 border-amber-500/40 text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <Star className={`w-5 h-5 ${isSuperLiked ? 'fill-slate-950' : ''}`} />
              </button>

              <button
                onClick={toggleFollow}
                className={`px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg transition flex items-center gap-1.5 ${
                  isFollowing
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white shadow-pink-500/30'
                }`}
              >
                {isFollowing ? <UserCheck className="w-4 h-4 text-emerald-400" /> : <Users className="w-4 h-4" />}
                <span>{isFollowing ? window.loc('دنبال می‌کنید', 'Following') : window.loc('دنبال کردن', 'Follow')}</span>
              </button>
            </div>
          </div>

          {/* Identity & Badges */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white">{userName}</h2>
              {isVerified && <VerifiedBadge showLabel={false} className="w-5 h-5" />}
              {isVip && <VipStatusBadge size="normal" showText={true} />}
              {isStreamer && (
                <span className="bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <Video className="w-3 h-3 fill-white" />
                  <span>Streamer Host</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
              <span className="text-cyan-400 font-mono">@{username}</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">{age} yrs</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3 h-3 text-pink-400" />
                {city} ({distance})
              </span>
            </div>

                        <p className="text-xs text-slate-300 leading-relaxed pt-1 dir-rtl">{bio}</p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {['Music', 'Live Stream', 'Fitness', 'Travel', 'Art'].map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-medium text-slate-300">
                  #{tag.trim()}
                </span>
              ))}
            </div>

            {/* STREAMER SCORES 3 INDEPENDENT BADGES */}
            {isStreamer && (
              <div className="pt-2">
                <StreamerScoresBadges userObj={user} compact={false} />
              </div>
            )}
          </div>

          {/* Action Row: Message, Audio Call, Video Call, Gift */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <button
              onClick={() => {
                onClose();
                onStartMessage(user);
              }}
              className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-bold text-xs flex flex-col items-center gap-1 shadow-md transition"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>{window.loc('پیام', 'Message')}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartCall(user, 'audio');
              }}
              className="py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-bold text-xs flex flex-col items-center gap-1 shadow-md transition"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{window.loc('تماس صوتی', 'Voice Call')}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartCall(user, 'video');
              }}
              className="py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs flex flex-col items-center gap-1 shadow-lg hover:opacity-90 transition"
            >
              <Video className="w-4 h-4 fill-white" />
              <span>{window.loc('تماس تصویری', 'Video Call')}</span>
            </button>

            <button
              onClick={() => {
                onSendGift(user);
              }}
              className="py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs flex flex-col items-center gap-1 shadow-md transition"
            >
              <Gift className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{window.loc('ارسال هدیه', 'Send Gift')}</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center text-xs">
            <div>
              <span className="block font-black text-white text-sm">{followersCount.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">{window.loc('دنبال‌کننده', 'Followers')}</span>
            </div>
            <div>
              <span className="block font-black text-pink-400 text-sm">{likesCount.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">{window.loc('لایک‌ها', 'Likes')}</span>
            </div>
            <div>
              <span className="block font-black text-cyan-400 text-sm">{publicPhotos.length}</span>
              <span className="text-[10px] text-slate-400">{window.loc('عکس/فیلم', 'Media')}</span>
            </div>
            <div>
              <span className="block font-black text-amber-400 text-sm">Lv.22</span>
              <span className="text-[10px] text-slate-400">{window.loc('سطح', 'Level')}</span>
            </div>
          </div>

          {/* STREAMER LIVE BANNER (IF STREAMER) */}
          {isStreamer && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-pink-950/80 via-slate-900 to-slate-900 border border-pink-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-pink-300 font-black text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                  <span>{window.loc('میزبان فعال استریم و تماس ویدئویی', 'Active Live Streamer')}</span>
                </span>
                <span className="text-amber-400 text-xs font-black">10 🪙 / min</span>
              </div>
              <p className="text-[11px] text-slate-300 dir-rtl">
                {window.loc('امکان برقراری تماس تصویری مستقیم یا شرکت در روم‌های اختصاصی و لایواستریم این استریمر.', 'The possibility of making a direct video call or participating in the dedicated rooms and live stream of this streamer.')}
              </p>
            </div>
          )}

          {/* DEDICATED ADMIN CONTROL CARD FOR ADMIN USERS */}
          {isAdminUser && (
            <div className="p-4 rounded-3xl bg-rose-950/60 border border-rose-500/50 space-y-3">
              <div className="flex items-center justify-between border-b border-rose-500/30 pb-2">
                <span className="text-xs font-black text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>{window.loc('ابزارهای نظارت مدیر (Super Admin Tools)', 'Super Admin Tools')}</span>
                </span>
                <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">ADMIN</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleAdminBanToggle}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                    isBanned
                      ? 'bg-emerald-600 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  <Ban className="w-3.5 h-3.5" />
                  <span>{isBanned ? window.loc('رفع مسدودی', 'Unblock') : window.loc('مسدود کردن', 'blocking')}</span>
                </button>

                <button
                  onClick={handleAdminVerifyToggle}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                    isVerified
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-cyan-600 text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isVerified ? window.loc('لغو نشان', 'cancel badge') : window.loc('اعطای تایید', 'Grant approval')}</span>
                </button>

                <button
                  onClick={handleAdminStreamerToggle}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                    isStreamer
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-pink-600 text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{isStreamer ? window.loc('لغو استریمر', 'Cancel streamer') : window.loc('اعطای لایو', 'grant live')}</span>
                </button>
              </div>
            </div>
          )}

          {/* SUB-TABS: OVERVIEW & MEDIA */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
              {[
                { id: 'overview', label: window.loc('آلبوم تصاویر', 'Photos') },
                { id: 'about', label: window.loc('درباره و علاقه‌ها', 'About') }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition ${
                    activeTab === t.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: PHOTOS */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-2 gap-2.5 animate-fadeIn">
                {publicPhotos.map((p, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden aspect-square bg-slate-900 border border-slate-800 relative group">
                    <img src={p} alt="User media" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                ))}
              </div>
            )}

            {/* TAB CONTENT: ABOUT */}
            {activeTab === 'about' && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold">{window.loc('زبان‌ها:', 'Languages:')}</span>
                  <p className="text-white font-medium">Persian, English, Turkish</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold">{window.loc('علاقه‌مندی‌ها:', 'Interests:')}</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Music', 'Live Stream', 'Fitness', 'Travel', 'Art'].map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 font-medium">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ================= REPORT MODAL POPUP ================= */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[80] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4 shadow-2xl dir-rtl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-500" />
                <span>{window.loc('گزارش تخلف کاربر', 'User violation report')}</span>
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">{window.loc('علت گزارش:', 'Reason for report:')}</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
              >
                <option value="fake_account">{window.loc('اکانت جعلی یا فیک', 'Fake or fake account')}</option>
                <option value="spam">{window.loc('اسپم و تبلیغات مزاحم', 'Spam and annoying ads')}</option>
                <option value="harassment">{window.loc('مزاحمت و رفتار نامناسب', 'Harassment and inappropriate behavior')}</option>
                <option value="fake_photos">{window.loc('تصاویر غیرواقعی', 'Unreal images')}</option>
                <option value="other">{window.loc('سایر موارد', 'Other cases')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">{window.loc('توضیحات تکمیلی (اختیاری):', 'Additional information (optional):')}</label>
              <textarea
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                placeholder={window.loc('توضیح کوتاه درباره علت گزارش...', 'Brief explanation about the reason for the report...')}
                className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs outline-none h-20 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={submitReport}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg"
              >
                {window.loc('ثبت و ارسال گزارش', 'Record and send reports')}
              </button>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                {window.loc('انصراف', 'opt out')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
