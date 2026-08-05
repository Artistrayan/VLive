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
  loc = ((a, b) => b || a)
}) {
  const [streamerSubTab, setStreamerSubTab] = useState('streamers'); // 'streamers' | 'scores' | 'kyc' | 'history' | 'ai_risk' | 'settings' | 'logs'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Selected streamer for score editing
  const [editingStreamer, setEditingStreamer] = useState(null);
  const [editXp, setEditXp] = useState(4250);
  const [editReputation, setEditReputation] = useState(9);
  const [editRank, setEditRank] = useState(7);
  const [editReason, setEditReason] = useState('تعدیل دستی توسط ادمین ارشد');

  // Level History Logs State
  const [levelHistoryLogs, setLevelHistoryLogs] = useState([
    { id: 'LOG-101', username: 'Rayan_Streamer', oldLevel: 'Level 2 Bronze', newLevel: 'Level 3 Silver', xp: 3200, reason: 'تکمیل ۵۰ ساعت لایواستریم فعال', date: '2026-08-04 14:20', admin: 'AI Studio System' },
    { id: 'LOG-102', username: 'Elnaz_Live', oldLevel: 'Level 1 New', newLevel: 'Level 2 Bronze', xp: 1100, reason: 'احراز هویت و اولین استریم موفق', date: '2026-08-05 09:10', admin: 'Admin_Super' }
  ]);

  // Admin Config State for Levels
  const [levelConfigs, setLevelConfigs] = useState(STREAMER_LEVELS);

  // Extract streamers & pending applicants
  const streamersList = usersList.filter(u => u.isStreamer || u.isHost || u.is_streamer);
  
  // Simulated Pending KYC Applications
  const [kycApplications, setKycApplications] = useState([
    {
      id: 'KYC-801',
      username: 'Elnaz_Live',
      name: 'الناز محمدی',
      age: 22,
      city: 'Shiraz',
      submittedAt: '2026-08-05 10:30',
      idCardPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      selfiePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      status: 'Pending Review',
      aiConfidence: '98% Pass'
    },
    {
      id: 'KYC-802',
      username: 'Nigar_Host',
      name: 'نگار احمدی',
      age: 24,
      city: 'Tehran',
      submittedAt: '2026-08-05 09:15',
      idCardPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      selfiePhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
      status: 'Pending Review',
      aiConfidence: '94% Pass'
    }
  ]);

  const handleApproveKyc = (app) => {
    setKycApplications(prev => prev.filter(a => a.id !== app.id));
    setUsersList(prev => prev.map(u => u.username === app.username ? { ...u, isStreamer: true, isHost: true, isVerified: true, xp: 1000, reputationScore: 10, creatorRank: 5 } : u));
    addAdminAuditLog(`Approved Streamer KYC Application #${app.id} for @${app.username}`);
    showToast(`✅ درخواست استریمی @${app.username} با موفقیت تایید شد`);
    setSelectedApplication(null);
  };

  const handleRejectKyc = (app) => {
    setKycApplications(prev => prev.filter(a => a.id !== app.id));
    addAdminAuditLog(`Rejected Streamer KYC Application #${app.id} for @${app.username}`);
    showToast(`✕ درخواست استریمی @${app.username} رد شد`);
    setSelectedApplication(null);
  };

  const handleToggleFreezeIncome = (streamer) => {
    const nextFrozen = !streamer.incomeFrozen;
    setUsersList(prev => prev.map(u => u.id === streamer.id ? { ...u, incomeFrozen: nextFrozen } : u));
    addAdminAuditLog(`Admin Action: ${nextFrozen ? 'Frozen' : 'Unfrozen'} streamer income for @${streamer.username}`);
    showToast(nextFrozen ? `🧊 درآمد و تسویه‌حساب @${streamer.username} مسدود شد` : `🔥 تسویه‌حساب @${streamer.username} فعال گردید`);
  };

  // Handle manual score/level updates by admin
  const handleSaveStreamerScores = () => {
    if (!editingStreamer) return;
    
    const scores = getStreamerScores({ xp: editXp, reputationScore: editReputation, creatorRank: editRank });

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
    showToast(`✅ امتیازات استریمر @${editingStreamer.username} بروزرسانی شد`);
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
              <span>مرکز مدیریت سطح، اعتبار و رتبه‌بندی استریمرها</span>
              <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono px-2 py-0.5 rounded-full border border-pink-500/30">
                {streamersList.length} HOSTS
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              مدیریت ۳ شاخص مستقل (Level, Reputation, Creator Rank)، آنتی‌چیت هوشمند و پیکربندی سطح‌ها
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-2 text-[11px]">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-300 font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>درخواست‌های معلق: {kycApplications.length}</span>
          </span>
        </div>
      </div>

      {/* ================= NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'streamers', label: '🎥 استریمرهای فعال' },
          { id: 'scores', label: '👑 امتیازبندی و مدال‌ها (3 Badges)' },
          { id: 'kyc', label: '🔑 احراز هویت (KYC)', badge: kycApplications.length },
          { id: 'ai_risk', label: '🤖 آنتی‌چیت و ریسک' },
          { id: 'settings', label: '⚙️ پیکربندی ۱۰ سطح' },
          { id: 'logs', label: '📜 تاریخچه ارتقا (Logs)' }
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
                      <img src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-pink-500" />
                      <div>
                        <h4 className="font-bold text-white text-xs flex items-center gap-1">
                          <span>{s.name || s.username}</span>
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        </h4>
                        <span className="text-[10px] text-pink-400 font-mono block">@{s.username}</span>
                        <span className="text-[10px] text-slate-400">دنبال‌کنندگان: {(s.followers || 1200).toLocaleString()}</span>
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
                        {s.incomeFrozen ? '🧊 درآمد توقیف‌شده' : 'توقیف واریز تسویه'}
                      </button>
                    </div>
                  </div>

                  {/* 3 INDEPENDENT SCORE BADGES ROW */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80 text-center">
                    {/* Badge 1: LEVEL */}
                    <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-[9px] text-slate-400 block font-bold">۱. سطح استریمر</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r ${scores.badgeColor} text-white inline-block shadow`}>
                        Lvl {scores.level} {scores.levelName}
                      </span>
                    </div>

                    {/* Badge 2: REPUTATION */}
                    <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-[9px] text-slate-400 block font-bold">۲. اعتبار (Reputation)</span>
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-block">
                        {scores.reputationScore}/10 ({scores.reputationStatus})
                      </span>
                    </div>

                    {/* Badge 3: CREATOR RANK */}
                    <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-0.5">
                      <span className="text-[9px] text-slate-400 block font-bold">۳. رتبه محتوا (Rank)</span>
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
              <span>تعدیل و ارتقای دستی امتیازات ۳ گانه استریمرها</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              سطح (Level)، اعتبار (Reputation) و رتبه (Creator Rank) کاملاً مستقل بوده و می‌توانند بر اساس عملکرد ارزیابی شوند.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {streamersList.map(s => {
                const sc = getStreamerScores(s);
                return (
                  <div key={s.id || s.username} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt="" className="w-10 h-10 rounded-full object-cover" />
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
                        setEditXp(s.xp || 4250);
                        setEditReputation(s.reputationScore ?? 9);
                        setEditRank(s.creatorRank ?? 7);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] shadow"
                    >
                      ویرایش امتیازات
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
                  ویرایش امتیازات استریمر: @{editingStreamer.username || editingStreamer.name}
                </span>
                <button onClick={() => setEditingStreamer(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. XP / Level */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-amber-300 block">۱. مقدار امتیاز XP (تغییر سطح):</label>
                  <input
                    type="number"
                    value={editXp}
                    onChange={(e) => setEditXp(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs outline-none"
                  />
                  <span className="text-[9px] text-slate-400 block">سطح محاسبه‌شده: Lvl {getStreamerScores({ xp: editXp }).level} ({getStreamerScores({ xp: editXp }).levelName})</span>
                </div>

                {/* 2. Reputation */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-emerald-300 block">۲. امتیاز اعتبار (Reputation 1-10):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editReputation}
                    onChange={(e) => setEditReputation(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs outline-none"
                  />
                  <span className="text-[9px] text-slate-400 block">وضعیت: {editReputation >= 8 ? 'عالی 🟢' : editReputation >= 5 ? 'متوسط 🟡' : 'ریسک بالا 🔴'}</span>
                </div>

                {/* 3. Creator Rank */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <label className="text-[10px] font-bold text-cyan-300 block">۳. رتبه تولیدکننده (Rank 1-10):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editRank}
                    onChange={(e) => setEditRank(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs outline-none"
                  />
                  <span className="text-[9px] text-slate-400 block">رتبه: Class {editRank} Creator</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-300 block mb-1">دلیل تغییر و ثبت در تاریخچه:</label>
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
                  تایید و ذخیره‌سازی امتیازات جدید
                </button>
                <button
                  onClick={() => setEditingStreamer(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs"
                >
                  انصراف
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: KYC APPLICATIONS ================= */}
      {streamerSubTab === 'kyc' && (
        <div className="space-y-4 animate-fadeIn">
          {kycApplications.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <span>کلیه درخواست‌های احراز هویت استریمرها بررسی شده‌اند.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kycApplications.map(app => (
                <div key={app.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-white text-xs">{app.name} (@{app.username})</h4>
                      <span className="text-[10px] text-slate-400 font-mono">شهر: {app.city} • سن: {app.age}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                      {app.aiConfidence}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold">عکس کارت ملی / پاسپورت:</span>
                      <img src={app.idCardPhoto} alt="ID Card" className="w-full h-28 object-cover rounded-2xl border border-slate-800" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 font-bold">سلفی تایید چهره:</span>
                      <img src={app.selfiePhoto} alt="Selfie" className="w-full h-28 object-cover rounded-2xl border border-slate-800" />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleApproveKyc(app)}
                      className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                    >
                      ✓ تایید نهایی و اعطای استریمر
                    </button>
                    <button
                      onClick={() => handleRejectKyc(app)}
                      className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow"
                    >
                      ✕ رد درخواست مدارک
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
              <span>پایش هوشمند آنتی‌چیت و آنومالی رشد لایوها (Anti-Cheat Engine)</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              شناسایی هوشمند بینندگان فیک، هدیه‌های مشکوک، اسپم فالوور و تبانی. هشدارهای هوش مصنوعی نیازمند تصمیم نهایی ادمین می‌باشند.
            </p>

            {/* Simulated Alerts */}
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
                  <div>
                    <h4 className="font-bold text-rose-300 text-xs">هشدار رشد غیرطبیعی: @Elnaz_Live</h4>
                    <p className="text-[10px] text-slate-300">افزایش ۶۰۰٪ بینندگان لایو در ۳ دقیقه بدون لینک معرف خروجی.</p>
                  </div>
                </div>
                <button
                  onClick={() => showToast('🔒 حساب @Elnaz_Live تحت نظارت موقت قرار گرفت')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-[10px]"
                >
                  بررسی و جریمه XP
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="font-bold text-amber-300 text-xs">احتمال هدیه سفارشی فیک: @Rayan_Streamer</h4>
                    <p className="text-[10px] text-slate-300">دریافت ۴۰ هزار سکه از ۳ اکانت تازه ساخت در کمتر از ۱۰ دقیقه.</p>
                  </div>
                </div>
                <button
                  onClick={() => showToast('✅ بررسی هدیه‌ها تایید گردید')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-[10px]"
                >
                  تایید دستی
                </button>
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
              <span>تنظیمات و پیکربندی سطح‌های ۱۰ گانه استریمرها</span>
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
                      <span className="text-[10px] text-slate-400 block font-mono">حداقل XP: {lvl.minXp.toLocaleString()} • ساعت: {lvl.minHours}h • بیننده: {lvl.minViewers}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-pink-300 font-bold bg-pink-500/10 px-2 py-1 rounded-xl border border-pink-500/20">
                    مزایا: {lvl.benefits.length} مورد
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
              <span>تاریخچه ارتقا، تنزیل و تغییرات سطح استریمرها</span>
            </h3>

            <div className="space-y-2">
              {levelHistoryLogs.map(log => (
                <div key={log.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-white">@{log.username}</span>
                    <span className="text-slate-400 block text-[10px]">
                      از {log.oldLevel} ➔ {log.newLevel} (XP: {log.xp})
                    </span>
                    <span className="text-slate-500 text-[9px]">دلیل: {log.reason}</span>
                  </div>
                  <div className="text-left font-mono text-[9px] text-slate-400">
                    <span>{log.date}</span>
                    <span className="block text-pink-400">توسط: {log.admin}</span>
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

