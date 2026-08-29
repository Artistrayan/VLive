import { apiAdmin } from "../../services/api";
import React, { useState } from 'react';
import { 
  Video, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, 
  Crown, Gift, DollarSign, Clock, Users, Eye, FileText, Ban, Lock, Unlock, 
  Sparkles, Camera, Award, ArrowUpRight, Filter, Search, Sliders, TrendingUp, 
  ThumbsUp, Activity, Cpu, History, Zap, Settings, RefreshCw
} from 'lucide-react';
import { STREAMER_LEVELS, AVAILABLE_BADGES, getStreamerScores, detectAntiCheatAnomalies } from '../../services/streamerScoring';

export default function StreamerManagementCenter({
  usersList = [],
  setUsersList = (() => {}),
  adminWithdrawalsList = [],
  setAdminWithdrawalsList = (() => {}),
  addAdminAuditLog = (() => {}),
  showToast = (() => {}),
  kycApplications = [],
  setKycApplications = (() => {}),
  loc = ((a, b) => b || a)
}) {
  const [streamerSubTab, setStreamerSubTab] = useState('streamers'); // 'streamers' | 'scores' | 'kyc' | 'history' | 'ai_risk' | 'settings' | 'logs'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

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

  // Extract streamers & pending applicants
  const streamersList = usersList.filter(u => u.isStreamer || u.isHost || u.is_streamer);
  
  const handleApproveKyc = async (app) => {
    if (apiAdmin && apiAdmin.updateKycStatus) {
      await apiAdmin.updateKycStatus(app.id, 'Approved', app.user_id);
    }
    setKycApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Approved' } : a));
    setUsersList(prev => prev.map(u => u.username === app.username ? { ...u, isStreamer: true, isHost: true, isVerified: true, role: 'streamer' } : u));
    addAdminAuditLog(`Approved Streamer KYC Application #${app.id.slice(0,6)} for @${app.username}`);
    showToast(window.loc(`✅ درخواست استریمی @${app.username} با موفقیت تایید شد`, `✅ Streamer app @${app.username} approved`));
  };

  const handleRejectKyc = async (app) => {
    const reason = prompt(window.loc('دلیل رد درخواست (برای کاربر نمایش داده می‌شود):', 'Reason for rejection:')) || 'Rejected by admin';
    if (apiAdmin && apiAdmin.updateKycStatus) {
      await apiAdmin.updateKycStatus(app.id, 'Rejected', app.user_id);
    }
    setKycApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Rejected', rejectionReason: reason } : a));
    addAdminAuditLog(`Rejected Streamer KYC Application #${app.id.slice(0,6)} for @${app.username}`);
    showToast(window.loc(`✕ درخواست استریمی @${app.username} رد شد`, `✕ Streamer app @${app.username} rejected`));
  };

  const handleCorrectionKyc = async (app) => {
    const msg = prompt(window.loc('پیام اصلاحیه برای کاربر:', 'Correction message:')) || 'Please update your documents';
    if (apiAdmin && apiAdmin.updateKycStatus) {
      await apiAdmin.updateKycStatus(app.id, 'Correction', app.user_id);
    }
    setKycApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'Correction', correctionMessage: msg } : a));
    addAdminAuditLog(`Requested Correction for KYC Application #${app.id.slice(0,6)} for @${app.username}`);
    showToast(window.loc(`درخواست اصلاحیه برای @${app.username} ارسال شد`, `Correction request sent to @${app.username}`));
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

        {/* Quick Stats */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-300 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{window.loc('درخواست‌های معلق:', 'Pending requests:')} {kycApplications.length}</span>
          </span>
        </div>
      </div>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'streamers', label: window.loc('🎥 استریمرهای فعال', '🎥 Active streamers') },
          { id: 'scores', label: window.loc('👑 امتیازبندی و مدال‌ها (3 Badges)', '👑 Rating and medals (3 Badges)') },
          { id: 'kyc', label: window.loc('🔑 احراز هویت (KYC)', '🔑 Authentication (KYC)'), badge: kycApplications.length },
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
          {kycApplications.filter(a => a.status === 'Pending').length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <span>{window.loc('کلیه درخواست‌های احراز هویت استریمرها بررسی شده‌اند.', 'All streamers authentication requests have been checked.')}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kycApplications.filter(a => a.status === 'Pending').map(app => (
                <div key={app.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-white text-xs">{app.name || app.username} (@{app.username})</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {app.requestedPose ? `ژست درخواستی: ${app.requestedPose}` : `${window.loc('دسته‌بندی:', 'Category:')} ${app.streamCategory || 'N/A'}`}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-mono font-bold border border-pink-500/30">
                      {app.verificationType === 'MANUAL_GESTURE_SELFIE' ? 'احراز هویت دستی ✋' : (app.aiConfidence || 'بررسی هویت')}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-300">
                    <span className="font-bold text-slate-400">{window.loc('توضیحات:', 'Description:')}</span> {app.description || '-'}
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold">{window.loc('عکس انتخابی پروفایل:', 'Profile Photo:')}</span>
                      <img src={app.idCardPhoto || app.docUrl || app.avatar} alt="Profile Photo" className="w-full h-28 object-cover rounded-2xl border border-slate-800" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-pink-400 font-bold">{window.loc('سلفی ژست دست (دوربین):', 'Live Gesture Selfie:')}</span>
                      {app.selfiePhoto ? (
                        <img src={app.selfiePhoto} alt="Live Gesture Selfie" className="w-full h-28 object-cover rounded-2xl border border-pink-500/40" />
                      ) : app.videoDemoUrl ? (
                        <video src={app.videoDemoUrl} className="w-full h-28 object-cover rounded-2xl border border-slate-800" controls />
                      ) : (
                        <div className="w-full h-28 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500">
                          بدون سلفی
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleApproveKyc(app)}
                      className="flex-1 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                    >
                      {window.loc('✓ تایید نهایی', '✓ Approve')}
                    </button>
                    <button
                      onClick={() => handleCorrectionKyc(app)}
                      className="flex-1 py-2 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow"
                    >
                      {window.loc('! درخواست اصلاح', '! Request Correction')}
                    </button>
                    <button
                      onClick={() => handleRejectKyc(app)}
                      className="flex-1 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
                    >
                      {window.loc('✕ رد درخواست', '✕ Reject')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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

