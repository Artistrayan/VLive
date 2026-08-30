import { apiAdmin } from "../../services/api";
import React, { useState } from 'react';
import { 
  Video, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, 
  Crown, Gift, DollarSign, Clock, Users, Eye, FileText, Ban, Lock, Unlock, 
  Sparkles, Camera, Award, ArrowUpRight, Filter, Search, Sliders, TrendingUp, 
  ThumbsUp, Activity, Cpu, History, Zap, Settings, RefreshCw,
  ZoomIn, ZoomOut, RotateCw, Maximize2, Download, Image as ImageIcon,
  ExternalLink, Layers, Check, User
} from 'lucide-react';
import { STREAMER_LEVELS, AVAILABLE_BADGES, getStreamerScores, detectAntiCheatAnomalies } from '../../services/streamerScoring';

// Component for High-Definition, crisp image display with auto-fallback & shimmer
function HighQualityKycImage({ src, alt, className = "", onClick, badge = null, fallbackText = "بدون تصویر", isZoomable = true }) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(src));

  if (!src || hasError) {
    return (
      <div 
        onClick={onClick}
        className={`w-full h-full flex flex-col items-center justify-center bg-slate-950/90 border border-slate-800/80 text-slate-500 text-[10px] p-2 text-center select-none rounded-2xl ${className}`}
      >
        <Camera className="w-6 h-6 mb-1 text-slate-600 opacity-60" />
        <span className="text-[9px] font-mono text-slate-400">{fallbackText}</span>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-full group overflow-hidden bg-slate-950 rounded-2xl select-none ${isZoomable ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-1.5 z-10">
          <Sparkles className="w-5 h-5 text-pink-400 animate-spin" />
          <span className="text-[9px] text-pink-300/80 font-mono">بارگذاری تصویر HD...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt || "KYC Image"}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-300 ${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          imageRendering: 'auto',
          WebkitBackfaceVisibility: 'hidden'
        }}
      />
      
      {/* Visual Badges */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10 pointer-events-none">
        {badge && (
          <span className="bg-slate-950/90 backdrop-blur-md border border-pink-500/40 text-[9px] font-bold text-pink-300 px-2 py-0.5 rounded-lg shadow-lg">
            {badge}
          </span>
        )}
      </div>

      {isZoomable && (
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-2.5 py-1 rounded-xl bg-slate-900/90 text-white font-bold text-[10px] border border-pink-500/40 shadow-lg flex items-center gap-1 backdrop-blur-sm">
            <ZoomIn className="w-3.5 h-3.5 text-pink-400" />
            <span>بزرگنمایی و بازبینی HD</span>
          </span>
        </div>
      )}
    </div>
  );
}

export default function StreamerManagementCenter({
  usersList = [],
  setUsersList = (() => {}),
  adminWithdrawalsList = [],
  setAdminWithdrawalsList = (() => {}),
  addAdminAuditLog = (() => {}),
  showToast = (() => {}),
  kycApplications = [],
  setKycApplications = (() => {}),
  initialSubTab = null,
  loc = ((a, b) => b || a)
}) {
  // Combine passed kycApplications with dynamic requests derived from usersList
  const mergedKycApplications = React.useMemo(() => {
    const combined = [...(kycApplications || [])];
    (usersList || []).forEach(u => {
      if (u.kyc_status === 'pending' || u.wantToBeStreamer || u.isStreamerRequested) {
        const existingIdx = combined.findIndex(c => c.username === u.username || c.user_id === u.id);
        const dynamicApp = {
          id: 'user_kyc_' + (u.username || u.id),
          user_id: u.id,
          username: u.username,
          name: u.name || u.username,
          status: 'Pending',
          description: u.bio || `درخواست استریمر کاربر ${u.username} (ثبت نام)`,
          streamCategory: u.category || 'عمومی',
          streamTopic: u.topic || 'گپ و گفتگو',
          selfiePhoto: u.selfiePhoto || u.avatar || '',
          idCardPhoto: u.avatar || '',
          avatar: u.avatar || '',
          verificationType: 'ONBOARDING_APPLICATION',
          requestedPose: u.requestedPose || '✌️ ژست پپیروزی',
          created_at: u.created_at || new Date().toISOString()
        };
        if (existingIdx === -1) {
          combined.push(dynamicApp);
        } else if (combined[existingIdx].status === 'Pending') {
          // Enhance existing pending with any missing details
          combined[existingIdx] = { ...dynamicApp, ...combined[existingIdx], status: 'Pending' };
        }
      }
    });
    // Remove duplicates safely
    const unique = [];
    const seen = new Set();
    for (const app of combined) {
      const key = (app.id || app.username || Math.random()).toString().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(app);
      }
    }
    return unique.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }, [kycApplications, usersList]);

  const pendingKycCount = mergedKycApplications.filter(a => (a.status || '').toLowerCase() === 'pending').length;
  const defaultTab = initialSubTab || (pendingKycCount > 0 ? 'kyc' : 'kyc');
  const [streamerSubTab, setStreamerSubTab] = useState(defaultTab); // 'streamers' | 'scores' | 'kyc' | 'history' | 'ai_risk' | 'settings' | 'logs'
  const [kycStatusFilter, setKycStatusFilter] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected' | 'Correction'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // High-Resolution Image Inspector Modal State
  const [inspectorTab, setInspectorTab] = useState('compare'); // 'compare' | 'selfie' | 'profile'
  const [inspectorZoom, setInspectorZoom] = useState(1); // 1, 1.5, 2, 2.5, 3
  const [inspectorRotate, setInspectorRotate] = useState(0); // 0, 90, 180, 270
  const [inspectorGrid, setInspectorGrid] = useState(false);

  const openApplicationInspector = (app, initialTab = 'compare') => {
    setSelectedApplication(app);
    setInspectorTab(initialTab);
    setInspectorZoom(1);
    setInspectorRotate(0);
    setInspectorGrid(false);
  };

  // Selected streamer for score editing
  const [editingStreamer, setEditingStreamer] = useState(null);
  const [editXp, setEditXp] = useState(0);
  const [editReputation, setEditReputation] = useState(10);
  const [editRank, setEditRank] = useState(1);
  const [editReason, setEditReason] = useState('');

  // Level History Logs State
  const [levelHistoryLogs, setLevelHistoryLogs] = useState([]);

  // Admin Config State for Levels
  const [levelConfigs, setLevelConfigs] = useState(STREAMER_LEVELS);

  // Sync initialSubTab when parent changes it
  React.useEffect(() => {
    if (initialSubTab) {
      setStreamerSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Auto-refresh applications on mount and on KYC update event
  const handleRefreshApplications = async () => {
    setIsRefreshing(true);
    try {
      if (apiAdmin && typeof apiAdmin.getKycApplications === 'function') {
        const freshApps = await apiAdmin.getKycApplications();
        if (freshApps && Array.isArray(freshApps)) {
          setKycApplications(freshApps);
        }
      }
    } catch (e) {
      console.warn('Refresh KYC applications error:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    handleRefreshApplications();

    const handleKycEvent = () => {
      handleRefreshApplications();
    };
    window.addEventListener('vlive_kyc_updated', handleKycEvent);
    return () => window.removeEventListener('vlive_kyc_updated', handleKycEvent);
  }, []);

  // Extract streamers & pending applicants
  const streamersList = usersList.filter(u => u.isStreamer || u.isHost || u.is_streamer);
  
  const handleApproveKyc = async (app) => {
    if (apiAdmin && apiAdmin.updateKycStatus) {
      await apiAdmin.updateKycStatus(app.id, 'Approved', app.user_id, '', app.username);
    }
    setKycApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Approved' } : a));
    setUsersList(prev => prev.map(u => (u.username === app.username || u.id === app.user_id) ? { ...u, isStreamer: true, isHost: true, isVerified: true, role: 'streamer', user_type: 'STREAMER' } : u));
    addAdminAuditLog(`Approved Streamer KYC Application #${String(app.id).slice(0,6)} for @${app.username}`);
    showToast(window.loc(`✅ درخواست استریمی @${app.username} با موفقیت تایید شد`, `✅ Streamer app @${app.username} approved`));
    if (selectedApplication?.id === app.id) setSelectedApplication(null);
  };

  const handleRejectKyc = async (app) => {
    const reason = prompt(window.loc('دلیل رد درخواست (برای کاربر نمایش داده می‌شود):', 'Reason for rejection:')) || 'Rejected by admin';
    if (apiAdmin && apiAdmin.updateKycStatus) {
      await apiAdmin.updateKycStatus(app.id, 'Rejected', app.user_id, reason, app.username);
    }
    setKycApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Rejected', rejectionReason: reason, admin_notes: reason } : a));
    addAdminAuditLog(`Rejected Streamer KYC Application #${String(app.id).slice(0,6)} for @${app.username} (Reason: ${reason})`);
    showToast(window.loc(`✕ درخواست استریمی @${app.username} رد شد`, `✕ Streamer app @${app.username} rejected`));
    if (selectedApplication?.id === app.id) setSelectedApplication(null);
  };

  const handleCorrectionKyc = async (app) => {
    const msg = prompt(window.loc('پیام اصلاحیه برای کاربر:', 'Correction message:')) || 'Please update your documents';
    if (apiAdmin && apiAdmin.updateKycStatus) {
      await apiAdmin.updateKycStatus(app.id, 'Correction', app.user_id, msg, app.username);
    }
    setKycApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Correction', correctionMessage: msg, admin_notes: msg } : a));
    addAdminAuditLog(`Requested Correction for KYC Application #${String(app.id).slice(0,6)} for @${app.username}`);
    showToast(window.loc(`درخواست اصلاحیه برای @${app.username} ارسال شد`, `Correction request sent to @${app.username}`));
    if (selectedApplication?.id === app.id) setSelectedApplication(null);
  };

  const handleToggleFreezeIncome = (streamer) => {
    const nextFrozen = !streamer.incomeFrozen;
    setUsersList(prev => prev.map(u => u.id === streamer.id ? { ...u, incomeFrozen: nextFrozen } : u));
    addAdminAuditLog(`Admin Action: ${nextFrozen ? 'Frozen' : 'Unfrozen'} streamer income for @${streamer.username}`);
    showToast(nextFrozen ? window.loc(`🧊 درآمد و تسویه‌حساب @${streamer.username} مسدود شد`, `🧊 Income and settlement of @${streamer.username} frozen`) : window.loc(`رفع مسدودی درآمد @${streamer.username}`, `Income of @${streamer.username} unfrozen`));
  };

  // Handle manual score/level updates by admin
  const handleSaveStreamerScores = async () => {
    if (!editingStreamer) return;
    
    const scores = getStreamerScores({ xp: editXp, reputationScore: editReputation, creatorRank: editRank });

    if (apiAdmin && typeof apiAdmin.updateUserFields === 'function') {
      await apiAdmin.updateUserFields(editingStreamer.id, { 
        xp: editXp, 
        reputation_score: editReputation, 
        creator_rank: editRank 
      });
    }

    setUsersList(prev => prev.map(u => u.id === editingStreamer.id || u.username === editingStreamer.username ? {
      ...u,
      xp: editXp,
      reputationScore: editReputation,
      creatorRank: editRank
    } : u));

    // Log history
    const newLog = {
      id: `LOG-${Date.now()}`,
      username: editingStreamer.username || editingStreamer.name,
      oldLevel: `Lvl ${editingStreamer.level || 3}`,
      newLevel: `Lvl ${scores.level} ${scores.levelName}`,
      xp: editXp,
      reason: editReason,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      admin: 'Admin'
    };

    setLevelHistoryLogs(prev => [newLog, ...prev]);
    addAdminAuditLog(`Admin updated Streamer Scores for @${editingStreamer.username}: XP=${editXp}, Rep=${editReputation}, Rank=${editRank}`);
    showToast(window.loc(`✅ امتیازات استریمر @${editingStreamer.username} بروزرسانی شد`, `✅ امتیازات استریمر @${editingStreamer.username} بروزرسانی شد`));
    setEditingStreamer(null);
  };

  return (
    <div className="space-y-4 text-xs">
      
      {/* ================= STREAMER CENTER HEADER ================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-pink-950/80 via-purple-950/60 to-slate-950 p-4 rounded-3xl border border-pink-500/40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-500 text-white font-black shadow-lg">
            <Crown className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span>{window.loc('مرکز مدیریت سطح، اعتبار و رتبه‌بندی استریمرها', 'Level management center, credit and rating of streamers')}</span>
              <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono px-2 py-0.5 rounded-full border border-pink-500/30">
                {streamersList.length} HOSTS
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {window.loc('مدیریت ۳ شاخص مستقل (Level, Reputation, Creator Rank)، آنتی‌چیت هوشمند و پیکربندی سطح‌ها', 'Management of 3 independent indicators (Level, Reputation, Creator Rank), intelligent anti-cheat and level configuration')}
            </p>
          </div>
        </div>

        {/* Quick Stats & Live Refresh */}
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            onClick={handleRefreshApplications}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{isRefreshing ? window.loc('در حال بروزرسانی...', 'Updating...') : window.loc('بروزرسانی زنده', 'Live Refresh')}</span>
          </button>

          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-300 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{window.loc('درخواست‌های معلق:', 'Pending requests:')} {pendingKycCount}</span>
          </span>
        </div>
      </div>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'streamers', label: window.loc('🎥 استریمرهای فعال', '🎥 Active streamers') },
          { id: 'scores', label: window.loc('👑 امتیازبندی و مدال‌ها (3 Badges)', '👑 Rating and medals (3 Badges)') },
          { id: 'kyc', label: window.loc('🔑 احراز هویت (KYC)', '🔑 Authentication (KYC)'), badge: pendingKycCount },
          { id: 'ai_risk', label: window.loc('🤖 آنتی‌چیت و ریسک', '🤖 Anti-cheat and risk') },
          { id: 'settings', label: window.loc('⚙️ پیکربندی ۱۰ سطح', '⚙️ 10 level configuration') },
          { id: 'logs', label: window.loc('📜 تاریخچه ارتقا (Logs)', '📜 Upgrade History (Logs)') }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setStreamerSubTab(t.id)}
            className={`px-3.5 py-2 rounded-2xl font-bold text-xs transition border flex items-center gap-1.5 shrink-0 ${
              streamerSubTab === t.id
                ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-amber-500 text-white font-black border-pink-300 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{t.label}</span>
            {t.badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-mono animate-pulse">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ================= TAB 1: STREAMERS LIST WITH 3 BADGES ================= */}
      {streamerSubTab === 'streamers' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {streamersList.map(s => {
              const scores = getStreamerScores(s);
              return (
                <div key={s.id || s.username} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar || ''} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-pink-500" />
                      <div>
                        <h4 className="font-bold text-white text-xs flex items-center gap-1">
                          <span>{s.name || s.username}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        </h4>
                        <span className="text-[10px] text-pink-400 font-mono block">@{s.username}</span>
                        <span className="text-[10px] text-slate-400">{window.loc('دنبال‌کنندگان:', 'Followers:')} {(s.followers || 1200).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="block font-mono font-bold text-emerald-400 text-xs">$1,450.00 USDT</span>
                      <button
                        onClick={() => handleToggleFreezeIncome(s)}
                        className={`px-3 py-1 rounded-xl text-[10px] font-bold border transition ${
                          s.incomeFrozen
                            ? 'bg-rose-600 text-white border-rose-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-rose-900'
                        }`}
                      >
                        {s.incomeFrozen ? window.loc('🧊 درآمد توقیف‌شده', '🧊 Forfeited income') : window.loc('توقیف واریز تسویه', 'Seizure of settlement deposit')}
                      </button>
                    </div>
                  </div>

                  {/* 3 INDEPENDENT SCORE BADGES ROW */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80 text-center">
                    {/* Badge 1: LEVEL */}
                    <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-[9px] text-slate-400 block font-bold">{window.loc('۱. سطح استریمر', '1. streamer level')}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r ${scores.badgeColor} text-white inline-block shadow`}>
                        Lvl {scores.level} {scores.levelName}
                      </span>
                    </div>

                    {/* Badge 2: REPUTATION */}
                    <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-[9px] text-slate-400 block font-bold">{window.loc('۲. اعتبار (Reputation)', '2. reputation')}</span>
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block">
                        {scores.reputationScore}/10 ({scores.reputationStatus})
                      </span>
                    </div>

                    {/* Badge 3: CREATOR RANK */}
                    <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-[9px] text-slate-400 block font-bold">{window.loc('۳. رتبه محتوا (Rank)', '3. Content Rank')}</span>
                      <span className="text-[10px] font-black text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full inline-block">
                        {scores.creatorRank}/10 ({scores.creatorRankName})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: SCORE EDITING & MANAGEMENT ================= */}
      {streamerSubTab === 'scores' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{window.loc('تعدیل و ارتقای دستی امتیازات ۳ گانه استریمرها', 'Adjusting and manually upgrading the scores of the 3 streamers')}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {window.loc('سطح (Level)، اعتبار (Reputation) و رتبه (Creator Rank) کاملاً مستقل بوده و می‌توانند بر اساس عملکرد ارزیابی شوند.', 'Level, Reputation and Creator Rank are completely independent and can be evaluated based on performance.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {streamersList.map(s => {
                const sc = getStreamerScores(s);
                return (
                  <div key={s.id || s.username} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={s.avatar || ''} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-white text-xs block">{s.name || s.username}</span>
                        <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                          <span className="text-amber-300">Lvl {sc.level}</span> • 
                          <span className="text-emerald-300">Rep: {sc.reputationScore}/10</span> • 
                          <span className="text-cyan-300">Rank: {sc.creatorRank}/10</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingStreamer(s);
                        setEditXp(Number(s.xp || 0));
                        setEditReputation(Number(s.reputationScore ?? 10));
                        setEditRank(Number(s.creatorRank ?? 1));
                        setEditReason('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] shadow"
                    >
                      {window.loc('ویرایش امتیازات', 'Edit scores')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* EDIT SCORE MODAL / DRAWER */}
          {editingStreamer && (
            <div className="p-4 rounded-3xl bg-slate-900 border border-purple-500/50 space-y-4 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-black text-white text-xs">
                  {window.loc('ویرایش امتیازات استریمر: @', 'Edit Streamer Ratings: @')}{editingStreamer.username || editingStreamer.name}
                </span>
                <button onClick={() => setEditingStreamer(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. XP / Level */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-amber-300 block">{window.loc('۱. مقدار امتیاز XP (تغییر سطح):', '1. Amount of XP (level change):')}</label>
                  <input
                    type="number"
                    value={editXp}
                    onChange={(e) => setEditXp(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs outline-none"
                  />
                  <span className="text-[9px] text-slate-400 block">{window.loc('سطح محاسبه‌شده: Lvl', 'Calculated level: Lvl')} {getStreamerScores({ xp: editXp }).level} ({getStreamerScores({ xp: editXp }).levelName})</span>
                </div>

                {/* 2. Reputation */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-emerald-300 block">{window.loc('۲. امتیاز اعتبار (Reputation 1-10):', '2. Credit score (Reputation 1-10):')}</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editReputation}
                    onChange={(e) => setEditReputation(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs outline-none"
                  />
                  <span className="text-[9px] text-slate-400 block">{window.loc('وضعیت:', 'Status:')} {editReputation >= 8 ? window.loc('عالی 🟢', 'Excellent 🟢') : editReputation >= 5 ? window.loc('متوسط 🟡', 'Medium 🟡') : window.loc('ریسک بالا 🔴', 'High risk')}</span>
                </div>

                {/* 3. Creator Rank */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-cyan-300 block">{window.loc('۳. رتبه تولیدکننده (Rank 1-10):', '3. Producer rank (Rank 1-10):')}</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editRank}
                    onChange={(e) => setEditRank(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs outline-none"
                  />
                  <span className="text-[9px] text-slate-400 block">{window.loc('رتبه: Class', 'Rank: Class')} {editRank} Creator</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">{window.loc('دلیل تغییر و ثبت در تاریخچه:', 'The reason for the change and recording in the history:')}</label>
                <input
                  type="text"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveStreamerScores}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow"
                >
                  {window.loc('تایید و ذخیره‌سازی امتیازات جدید', 'Confirm and save new points')}
                </button>
                <button
                  onClick={() => setEditingStreamer(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs"
                >
                  {window.loc('انصراف', 'opt out')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: KYC APPLICATIONS ================= */}
      {streamerSubTab === 'kyc' && (
        <div className="space-y-4 animate-fadeIn">
          {/* SEARCH & STATUS FILTER BAR */}
          <div className="p-3.5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs">
              {[
                { id: 'All', label: window.loc('همه', 'All'), count: mergedKycApplications.length },
                { id: 'Pending', label: window.loc('در انتظار بررسی', 'Pending'), count: mergedKycApplications.filter(a => (a.status || '').toLowerCase() === 'pending').length, color: 'text-amber-400' },
                { id: 'Approved', label: window.loc('تأیید شده', 'Approved'), count: mergedKycApplications.filter(a => (a.status || '').toLowerCase() === 'approved').length, color: 'text-emerald-400' },
                { id: 'Rejected', label: window.loc('رد شده', 'Rejected'), count: mergedKycApplications.filter(a => (a.status || '').toLowerCase() === 'rejected').length, color: 'text-rose-400' },
                { id: 'Correction', label: window.loc('نیاز به اصلاح', 'Correction'), count: mergedKycApplications.filter(a => (a.status || '').toLowerCase() === 'correction').length, color: 'text-orange-400' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setKycStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shrink-0 border ${
                    kycStatusFilter === f.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-md font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${kycStatusFilter === f.id ? 'bg-white/20 text-white' : 'bg-slate-900 ' + (f.color || 'text-slate-300')}`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={window.loc('جستجوی نام کاربری، دسته‌بندی...', 'Search username, category...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-pink-500 transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs">✕</button>
              )}
            </div>
          </div>

          {/* APPLICATION LIST */}
          {(() => {
            const filteredApps = mergedKycApplications.filter(app => {
              const matchesStatus = kycStatusFilter === 'All' 
                ? true 
                : (app.status || '').toLowerCase() === kycStatusFilter.toLowerCase();
              
              const q = searchQuery.toLowerCase().trim();
              const matchesSearch = !q 
                || (app.username || '').toLowerCase().includes(q) 
                || (app.name || '').toLowerCase().includes(q)
                || (app.streamCategory || '').toLowerCase().includes(q)
                || (app.streamTopic || '').toLowerCase().includes(q)
                || (app.description || '').toLowerCase().includes(q);

              return matchesStatus && matchesSearch;
            });

            if (filteredApps.length === 0) {
              return (
                <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <p className="font-bold text-white text-sm">
                    {kycStatusFilter === 'Pending'
                      ? window.loc('هیچ درخواست معلقی در صف انتظار بررسی وجود ندارد.', 'No pending applications in the review queue.')
                      : window.loc('هیچ درخواستی با این فیلتر یافت نشد.', 'No applications found matching this filter.')}
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => { setKycStatusFilter('All'); setSearchQuery(''); }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                    >
                      {window.loc('نمایش همه درخواست‌ها', 'Show all applications')}
                    </button>
                    <button
                      onClick={handleRefreshApplications}
                      className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      {window.loc('بروزرسانی داده‌ها', 'Refresh data')}
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApps.map(app => {
                  const isPending = (app.status || '').toLowerCase() === 'pending';
                  const isApproved = (app.status || '').toLowerCase() === 'approved';
                  const isRejected = (app.status || '').toLowerCase() === 'rejected';
                  const isCorrection = (app.status || '').toLowerCase() === 'correction';

                  const profileImg = app.avatar || app.idCardPhoto || app.docUrl || app.document_url || '';
                  const selfieImg = app.selfiePhoto || app.selfie_url || '';

                  return (
                    <div key={app.id || app.username} className={`p-4 rounded-3xl bg-slate-900 border space-y-3 shadow-xl transition-all ${
                      isPending ? 'border-pink-500/50 shadow-pink-500/10' :
                      isApproved ? 'border-emerald-500/40' :
                      isRejected ? 'border-rose-500/40' : 'border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
                            <HighQualityKycImage
                              src={profileImg || selfieImg}
                              alt="Avatar"
                              className="w-full h-full"
                              fallbackText="👤"
                              isZoomable={false}
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-xs flex items-center gap-1">
                              <span>{app.name || app.username}</span>
                              <span className="text-[10px] text-pink-400 font-mono">(@{app.username})</span>
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {app.requestedPose ? `ژست درخواستی: ${app.requestedPose}` : `${window.loc('دسته‌بندی:', 'Category:')} ${app.streamCategory || 'عمومی'}`}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${
                            isPending ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse' :
                            isApproved ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            isRejected ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                            'bg-orange-500/20 text-orange-300 border-orange-500/30'
                          }`}>
                            {isPending ? '⏳ در انتظار بررسی' :
                             isApproved ? '✓ تایید شده' :
                             isRejected ? '✕ رد شده' : '⚠️ نیاز به اصلاح'}
                          </span>
                        </div>
                      </div>

                      {/* Topic & Description */}
                      <div className="bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/80 space-y-1">
                        {app.streamTopic && (
                          <p className="text-[10px] text-white font-bold">
                            <span className="text-slate-400 font-normal">{window.loc('موضوع لایو:', 'Stream Topic:')}</span> {app.streamTopic}
                          </p>
                        )}
                        <p className="text-[10px] text-slate-300 line-clamp-2">
                          <span className="font-bold text-slate-400">{window.loc('توضیحات:', 'Description:')}</span> {app.description || '-'}
                        </p>
                        {app.admin_notes && (
                          <p className="text-[10px] text-rose-300 font-mono">
                            <span className="font-bold text-slate-400">یادداشت مدیریت:</span> {app.admin_notes}
                          </p>
                        )}
                      </div>

                      {/* Photos Display (Profile vs Gesture Selfie) with HD quality */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between px-0.5">
                            <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                              <ImageIcon className="w-3 h-3 text-cyan-400" />
                              <span>{window.loc('عکس حساب/کارت:', 'Profile Photo:')}</span>
                            </span>
                            <span className="text-[8px] text-cyan-400 font-mono">HD</span>
                          </div>
                          <div className="w-full h-32 rounded-2xl border border-slate-800 hover:border-cyan-500/60 shadow-lg transition overflow-hidden">
                            <HighQualityKycImage
                              src={profileImg}
                              alt="Profile Photo"
                              badge="👤 پروفایل"
                              fallbackText="بدون تصویر پروفایل"
                              onClick={() => openApplicationInspector(app, 'profile')}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between px-0.5">
                            <span className="text-[10px] text-pink-300 font-bold flex items-center gap-1">
                              <Camera className="w-3 h-3 text-pink-400" />
                              <span>{window.loc('سلفی ژست دست (زنده):', 'Gesture Selfie:')}</span>
                            </span>
                            <span className="text-[8px] text-pink-400 font-mono">1080p</span>
                          </div>
                          <div className="w-full h-32 rounded-2xl border border-pink-500/40 hover:border-pink-400 shadow-lg shadow-pink-500/5 transition overflow-hidden">
                            {selfieImg ? (
                              <HighQualityKycImage
                                src={selfieImg}
                                alt="Live Gesture Selfie"
                                badge="✨ سلفی زنده"
                                fallbackText="بدون سلفی"
                                onClick={() => openApplicationInspector(app, 'selfie')}
                              />
                            ) : app.videoDemoUrl ? (
                              <video src={app.videoDemoUrl} className="w-full h-full object-cover rounded-2xl" controls />
                            ) : (
                              <div 
                                onClick={() => openApplicationInspector(app, 'selfie')}
                                className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-500 text-[10px] cursor-pointer rounded-2xl"
                              >
                                <Camera className="w-6 h-6 text-slate-600 mb-1" />
                                <span>سلفی ثبت نشده</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          onClick={() => handleApproveKyc(app)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{window.loc('✓ تایید نهایی و اعطای استریمر', '✓ Approve Streamer')}</span>
                        </button>
                        <button
                          onClick={() => handleCorrectionKyc(app)}
                          className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow transition"
                          title={window.loc('درخواست ارسال مدارک اصلاحی', 'Request Correction')}
                        >
                          {window.loc('اصلاحیه', 'Correction')}
                        </button>
                        <button
                          onClick={() => handleRejectKyc(app)}
                          className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1 transition"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{window.loc('رد', 'Reject')}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* ADVANCED HIGH-DEFINITION APPLICATION & PHOTO INSPECTOR MODAL */}
          {selectedApplication && (() => {
            const modalProfileImg = selectedApplication.avatar || selectedApplication.idCardPhoto || selectedApplication.docUrl || selectedApplication.document_url || '';
            const modalSelfieImg = selectedApplication.selfiePhoto || selectedApplication.selfie_url || '';

            return (
              <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
                <div className="w-full max-w-4xl bg-slate-900/95 border border-pink-500/40 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl animate-scaleIn max-h-[92vh] overflow-y-auto flex flex-col">
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-pink-500/20">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-black text-white text-sm sm:text-base flex items-center gap-2">
                          <span>{window.loc('بازبینی تخصصی و تطبیق هویت استریمر:', 'Streamer Identity & Photo Verification:')}</span>
                          <span className="text-pink-400">{selectedApplication.name || selectedApplication.username}</span>
                        </h3>
                        <span className="text-[11px] text-slate-400 font-mono">@{selectedApplication.username}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedApplication(null)} 
                      className="p-2 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Gesture Pose Details Banner */}
                  {selectedApplication.requestedPose && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/70 via-slate-900 to-purple-950/70 border border-pink-500/40 flex flex-wrap items-center justify-between gap-2 shadow-inner">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-lg">
                          ✋
                        </div>
                        <div>
                          <span className="text-[10px] text-pink-300 font-bold block">{window.loc('ژست تصادفی اختصاص‌یافته برای راستی‌آزمایی سلفی:', 'Assigned Verification Gesture Pose:')}</span>
                          <span className="text-xs sm:text-sm font-black text-white">{selectedApplication.requestedPose}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] border border-emerald-500/40 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>تطبیق بیومتریک و دستی</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Mode Tabs & High-Res Inspection Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => { setInspectorTab('compare'); setInspectorZoom(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          inspectorTab === 'compare' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{window.loc('تطبیق همزمان دو عکس', 'Side-by-Side Comparison')}</span>
                      </button>

                      <button
                        onClick={() => setInspectorTab('selfie')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          inspectorTab === 'selfie' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{window.loc('سلفی ژست زنده (HD)', 'Live Selfie (HD)')}</span>
                      </button>

                      <button
                        onClick={() => setInspectorTab('profile')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                          inspectorTab === 'profile' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>{window.loc('عکس حساب / کارت', 'Profile / ID')}</span>
                      </button>
                    </div>

                    {/* Image Viewer Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setInspectorZoom(prev => Math.min(prev + 0.5, 3))}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                        title="بزرگنمایی (+)"
                      >
                        <ZoomIn className="w-4 h-4 text-pink-400" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-300 px-1 font-bold">
                        {Math.round(inspectorZoom * 100)}%
                      </span>
                      <button
                        onClick={() => setInspectorZoom(prev => Math.max(prev - 0.5, 1))}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                        title="کوچک‌نمایی (-)"
                      >
                        <ZoomOut className="w-4 h-4 text-pink-400" />
                      </button>

                      <button
                        onClick={() => setInspectorRotate(prev => (prev + 90) % 360)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition ml-1"
                        title="چرخش ۹۰ درجه تصویر"
                      >
                        <RotateCw className="w-4 h-4 text-cyan-400" />
                      </button>

                      <button
                        onClick={() => setInspectorGrid(prev => !prev)}
                        className={`p-1.5 rounded-lg border transition ${inspectorGrid ? 'bg-pink-600/30 border-pink-500 text-pink-300' : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400'}`}
                        title="خطوط راهنمای تطبیق چهره"
                      >
                        <Sliders className="w-4 h-4" />
                      </button>

                      {(modalSelfieImg || modalProfileImg) && (
                        <a
                          href={inspectorTab === 'selfie' ? modalSelfieImg : modalProfileImg || modalSelfieImg}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                          title="مشاهده تصویر با کیفیت اصلی در تب جدید"
                        >
                          <ExternalLink className="w-4 h-4 text-emerald-400" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* PHOTO VIEWING STAGE */}
                  <div className="relative rounded-3xl bg-slate-950 border border-slate-800 p-3 min-h-[320px] max-h-[460px] overflow-hidden flex items-center justify-center">
                    
                    {/* Grid Overlay Guide if enabled */}
                    {inspectorGrid && (
                      <div className="absolute inset-0 pointer-events-none z-20 grid grid-cols-3 grid-rows-3 border border-pink-500/30 divide-x divide-y divide-pink-500/20">
                        <div /><div /><div /><div /><div /><div /><div /><div /><div />
                      </div>
                    )}

                    {/* Mode 1: SIDE BY SIDE COMPARISON */}
                    {inspectorTab === 'compare' && (
                      <div className="w-full h-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Profile Card */}
                        <div className="space-y-1.5 flex flex-col">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{window.loc('عکس حساب / پروفایل', 'Profile / ID Photo')}</span>
                            </span>
                            <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-500/30">HD Original</span>
                          </div>
                          <div className="flex-1 w-full min-h-[260px] rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden relative flex items-center justify-center">
                            <img
                              src={modalProfileImg || modalSelfieImg}
                              alt="Profile"
                              referrerPolicy="no-referrer"
                              crossOrigin="anonymous"
                              className="max-h-[360px] w-full object-contain transition-transform duration-300"
                              style={{
                                transform: `scale(${inspectorZoom}) rotate(${inspectorRotate}deg)`,
                                imageRendering: '-webkit-optimize-contrast'
                              }}
                            />
                          </div>
                        </div>

                        {/* Selfie Card */}
                        <div className="space-y-1.5 flex flex-col">
                          <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-bold text-pink-400 flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-pink-400" />
                              <span>{window.loc('عکس سلفی زنده با ژست دست', 'Live Selfie with Gesture')}</span>
                            </span>
                            <span className="text-[10px] text-pink-400 font-mono bg-pink-950/60 px-2 py-0.5 rounded-lg border border-pink-500/30">1080p Live Capture</span>
                          </div>
                          <div className="flex-1 w-full min-h-[260px] rounded-2xl bg-slate-900 border border-pink-500/40 overflow-hidden relative flex items-center justify-center">
                            {modalSelfieImg ? (
                              <img
                                src={modalSelfieImg}
                                alt="Selfie"
                                referrerPolicy="no-referrer"
                                crossOrigin="anonymous"
                                className="max-h-[360px] w-full object-contain transition-transform duration-300"
                                style={{
                                  transform: `scale(${inspectorZoom}) rotate(${inspectorRotate}deg)`,
                                  imageRendering: '-webkit-optimize-contrast'
                                }}
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-slate-500 text-xs p-4">
                                <Camera className="w-8 h-8 text-slate-600 mb-1" />
                                <span>{window.loc('سلفی بارگذاری نشده', 'No selfie uploaded')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mode 2: SINGLE FOCUS VIEW (Selfie or Profile) */}
                    {inspectorTab !== 'compare' && (
                      <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
                        <img
                          src={inspectorTab === 'selfie' ? modalSelfieImg : modalProfileImg || modalSelfieImg}
                          alt="Focused Full Inspection"
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          className="max-h-[400px] w-auto object-contain transition-transform duration-300 rounded-2xl shadow-2xl"
                          style={{
                            transform: `scale(${inspectorZoom}) rotate(${inspectorRotate}deg)`,
                            imageRendering: '-webkit-optimize-contrast'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Application Details Summary */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                        <span className="text-slate-400">{window.loc('دسته‌بندی استریم:', 'Stream Category:')}</span>
                        <span className="text-pink-300 font-bold">{selectedApplication.streamCategory || 'عمومی'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                        <span className="text-slate-400">{window.loc('موضوع لایو:', 'Stream Topic:')}</span>
                        <span className="text-white font-bold">{selectedApplication.streamTopic || '-'}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1 font-bold">{window.loc('بیوگرافی و برنامه تولید محتوا:', 'Bio & Content Plan:')}</span>
                      <p className="text-slate-200 bg-slate-900/90 p-2.5 rounded-xl leading-relaxed border border-slate-800/60">
                        {selectedApplication.description || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleApproveKyc(selectedApplication)}
                      className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{window.loc('✓ تایید نهایی مدارک و اعطای دسترسی استریمر', '✓ Approve & Grant Streamer')}</span>
                    </button>
                    <button
                      onClick={() => handleCorrectionKyc(selectedApplication)}
                      className="px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow transition"
                    >
                      {window.loc('درخواست اصلاحیه', 'Request Correction')}
                    </button>
                    <button
                      onClick={() => handleRejectKyc(selectedApplication)}
                      className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-1.5 transition"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{window.loc('رد درخواست', 'Reject')}</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ================= TAB 4: AI ANTI-CHEAT & RISK MONITOR ================= */}
      {streamerSubTab === 'ai_risk' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>{window.loc('پایش هوشمند آنتی‌چیت و آنومالی رشد لایوها (Anti-Cheat Engine)', 'Intelligent monitoring of anti-cheat and the anomaly of live growth (Anti-Cheat Engine)')}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {window.loc('شناسایی هوشمند بینندگان فیک، هدیه‌های مشکوک، اسپم فالوور و تبانی. هشدارهای هوش مصنوعی نیازمند تصمیم نهایی ادمین می‌باشند.', 'Intelligent detection of fake viewers, suspicious gifts, follower spam and collusion. Artificial intelligence alerts require the final decision of the admin.')}
            </p>

            {/* Simulated Alerts Removed */}
            <div className="space-y-2">
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-center text-slate-500 text-xs">
                {window.loc('هیچ هشدار آنومالی و تقلب فعالی یافت نشد.', 'No active anomaly or cheat alerts found.')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: ADMIN 10-LEVEL CONFIGURATION ================= */}
      {streamerSubTab === 'settings' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-amber-400" />
              <span>{window.loc('تنظیمات و پیکربندی سطح‌های ۱۰ گانه استریمرها', 'Settings and configuration of 10 levels of streamers')}</span>
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {levelConfigs.map(lvl => (
                <div key={lvl.level} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-full bg-gradient-to-r ${lvl.badgeColor} text-white font-black text-[10px] flex items-center justify-center`}>
                      {lvl.level}
                    </span>
                    <div>
                      <span className="font-bold text-white text-xs">{lvl.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{window.loc('حداقل XP:', 'Minimum XP:')} {lvl.minXp.toLocaleString()} {window.loc('• ساعت:', 'Clock:')} {lvl.minHours}{window.loc('h • بیننده:', 'h • viewer:')} {lvl.minViewers}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-pink-300 font-bold bg-pink-500/10 px-2 py-1 rounded-xl border border-pink-500/20">
                    {window.loc('مزایا:', 'Advantages:')} {lvl.benefits.length} {window.loc('مورد', 'item')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: LEVEL HISTORY LOGS ================= */}
      {streamerSubTab === 'logs' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              <span>{window.loc('تاریخچه ارتقا، تنزیل و تغییرات سطح استریمرها', 'History of upgrade, downgrade and level changes of streamers')}</span>
            </h3>

            <div className="space-y-2">
              {levelHistoryLogs.map(log => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-white">@{log.username}</span>
                    <span className="text-slate-400 block text-[10px]">
                      {window.loc('از', 'from')} {log.oldLevel} ➔ {log.newLevel} (XP: {log.xp})
                    </span>
                    <span className="text-slate-500 text-[9px]">{window.loc('دلیل:', 'Reason:')} {log.reason}</span>
                  </div>
                  <div className="text-left font-mono text-[9px] text-slate-400">
                    <span>{log.date}</span>
                    <span className="block text-pink-400">{window.loc('توسط:', 'by:')} {log.admin}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

