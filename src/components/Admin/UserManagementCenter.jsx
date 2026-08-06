import React, { useState } from 'react';
import { 
  Users, Search, Filter, ShieldCheck, ShieldAlert, Ban, UserX, UserCheck, 
  Crown, Video, CheckCircle2, AlertTriangle, Key, Trash2, RefreshCw, Eye, 
  MapPin, Smartphone, Clock, DollarSign, Gift, MessageSquare, History, FileText,
  Lock, Unlock, ChevronRight, Sparkles, MoreVertical, Shield
} from 'lucide-react';

export default function UserManagementCenter({
  usersList = [],
  setUsersList = (() => {}),
  addAdminAuditLog = (() => {}),
  showToast = (() => {}),
  loc = ((a, b) => b || a),
  isRtl = true
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL'); // ALL, ONLINE, VERIFIED, VIP, STREAMERS, BANNED, MUTED, SUSPENDED
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Filtering users logic
  const filteredUsers = usersList.filter(user => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      !q || 
      (user.name || '').toLowerCase().includes(q) ||
      (user.username || '').toLowerCase().includes(q) ||
      (user.email || '').toLowerCase().includes(q) ||
      (user.city || '').toLowerCase().includes(q) ||
      (user.id || '').toString().includes(q);

    if (!matchesQuery) return false;

    if (filterCategory === 'ONLINE') return user.online === true;
    if (filterCategory === 'VERIFIED') return user.isVerified || user.verified;
    if (filterCategory === 'VIP') return user.isVip || user.is_vip || user.vip;
    if (filterCategory === 'STREAMERS') return user.isStreamer || user.isHost || user.is_streamer;
    if (filterCategory === 'BANNED') return user.isBanned === true;
    if (filterCategory === 'MUTED') return user.isMuted === true;
    if (filterCategory === 'SUSPENDED') return user.isSuspended === true;

    return true;
  });

  // Action handlers
  const handleToggleBan = (user) => {
    const nextBanned = !user.isBanned;
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, isBanned: nextBanned } : u));
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail(prev => ({ ...prev, isBanned: nextBanned }));
    }
    addAdminAuditLog(`Admin Action: ${nextBanned ? 'Banned' : 'Unbanned'} user @${user.username || user.name}`);
    showToast(nextBanned ? window.loc(`🚫 کاربر @${user.username} مسدود شد`, `🚫 User @${user.username} banned`) : window.loc(`انسداد کاربر @${user.username} لغو شد`, `User @${user.username} unbanned`));
  };

  const handleToggleMute = (user) => {
    const nextMuted = !user.isMuted;
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, isMuted: nextMuted } : u));
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail(prev => ({ ...prev, isMuted: nextMuted }));
    }
    addAdminAuditLog(`Admin Action: ${nextMuted ? 'Muted' : 'Unmuted'} user @${user.username}`);
    showToast(nextMuted ? window.loc(`🔇 کاربر @${user.username} بی صدا شد`, `🔇 User @${user.username} muted`) : window.loc(`صدای کاربر @${user.username} فعال شد`, `User @${user.username} unmuted`));
  };

  const handleToggleVerify = (user) => {
    const nextVerified = !(user.isVerified || user.verified);
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, isVerified: nextVerified, verified: nextVerified } : u));
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail(prev => ({ ...prev, isVerified: nextVerified, verified: nextVerified }));
    }
    addAdminAuditLog(`Admin Action: ${nextVerified ? 'Granted' : 'Removed'} verification for @${user.username}`);
    showToast(nextVerified ? window.loc(`✅ نشان تایید آبی به @${user.username} اعطا شد`, `✅ Verification granted to @${user.username}`) : window.loc(`نشان تایید @${user.username} لغو شد`, `Verification removed from @${user.username}`));
  };

  const handleToggleStreamer = (user) => {
    const nextStreamer = !(user.isStreamer || user.isHost);
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, isStreamer: nextStreamer, isHost: nextStreamer } : u));
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail(prev => ({ ...prev, isStreamer: nextStreamer, isHost: nextStreamer }));
    }
    addAdminAuditLog(`Admin Action: ${nextStreamer ? 'Promoted to Streamer' : 'Demoted Streamer'} @${user.username}`);
    showToast(nextStreamer ? window.loc(`🎥 مقام استریمر به @${user.username} داده شد`, `🎥 Streamer status granted to @${user.username}`) : window.loc(`مقام استریمر @${user.username} لغو شد`, `Streamer status removed from @${user.username}`));
  };

  const handleResetPassword = (user) => {
    addAdminAuditLog(`Admin Action: Reset password & session tokens for @${user.username}`);
    showToast(window.loc(`🔑 لینک بازنشانی رمز عبور برای @${user.username} ارسال گردید`, `🔑 لینک بازنشانی رمز عبور برای @${user.username} ارسال گردید`));
  };

  const handleSaveAdminNote = (user) => {
    if (!adminNoteInput.trim()) return;
    const updatedNotes = [...(user.adminNotes || []), { text: adminNoteInput, date: new Date().toLocaleString() }];
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, adminNotes: updatedNotes } : u));
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail(prev => ({ ...prev, adminNotes: updatedNotes }));
    }
    addAdminAuditLog(`Admin Note Added for @${user.username}: ${adminNoteInput}`);
    setAdminNoteInput('');
    showToast(window.loc('📜 یادداشت مدیریتی ذخیره شد', '📜 Management note saved'));
  };

  return (
    <div className="space-y-4 text-xs">
      
      {/* ================= HEADER SUMMARY ================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-950 p-4 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black shadow-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <span>{window.loc('مرکز تخصصی مدیریت کاربران (User Management Center)', 'User Management Center')}</span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-500/30">
                {usersList.length} USERS
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              {window.loc('جستجوی پیشرفته، وضعیت آنلاین، سابقه ورود و IP، وضعیت مالی، تعلیق و مسدودی', 'Advanced search, online status, login and IP history, financial status, suspension and blocking')}
            </p>
          </div>
        </div>

        {/* Quick Stats Chips */}
        <div className="flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{window.loc('آنلاین:', 'Online:')} {usersList.filter(u => u.online).length}</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-bold flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" />
            <span>VIP: {usersList.filter(u => u.isVip || u.vip).length}</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-pink-400 font-bold flex items-center gap-1">
            <Video className="w-3.5 h-3.5" />
            <span>{window.loc('استریمر:', 'Streamer:')} {usersList.filter(u => u.isStreamer || u.isHost).length}</span>
          </span>
        </div>
      </div>

      {/* ================= SEARCH & CATEGORY FILTERS ================= */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={window.loc('جستجو بر اساس نام، نام کاربری، شناسه، ایمیل یا شهر...', 'Search by name, username, ID, email or city...')}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          {[
            { id: 'ALL', label: window.loc('همه کاربران', 'All users') },
            { id: 'ONLINE', label: window.loc('🟢 آنلاین', '🟢 online') },
            { id: 'VERIFIED', label: window.loc('✅ تاییدشده', '✅ Confirmed') },
            { id: 'VIP', label: window.loc('👑 اعضای VIP', '👑 VIP members') },
            { id: 'STREAMERS', label: window.loc('🎥 استریمرها', '🎥 Streamers') },
            { id: 'BANNED', label: window.loc('🚫 مسدودشده', '🚫 Blocked') },
            { id: 'MUTED', label: window.loc('🔇 بی صدا', '🔇 Silently') }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterCategory(f.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap border ${
                filterCategory === f.id
                  ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= USERS TABLE & LIST ================= */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                <th className="p-3.5">{window.loc('کاربر', 'user')}</th>
                <th className="p-3.5">{window.loc('نقش و نشان‌ها', 'Roles and badges')}</th>
                <th className="p-3.5">{window.loc('موقعیت / کشور', 'Location / Country')}</th>
                <th className="p-3.5">{window.loc('موجودی سکه', 'Coin inventory')}</th>
                <th className="p-3.5">{window.loc('وضعیت آنلاین', 'online status')}</th>
                <th className="p-3.5">{window.loc('اقدامات سریع مدیر', 'Quick actions of the manager')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500 font-bold">
                    {window.loc('هیچ کاربری با این مشخصات یافت نشد.', 'No users were found with this profile.')}
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id || u.username} className="hover:bg-slate-850 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={u.avatar || u.thumbnail || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                          alt="" 
                          className="w-9 h-9 rounded-full object-cover border border-slate-700" 
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-white">{u.name || u.fullName || 'User'}</span>
                            {u.isBanned && <span className="bg-rose-500/20 text-rose-300 text-[9px] px-1.5 rounded font-bold">BANNED</span>}
                          </div>
                          <span className="text-[10px] text-cyan-400 font-mono">@{u.username}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {(u.isVerified || u.verified) && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                            Verified
                          </span>
                        )}
                        {(u.isVip || u.vip) && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                            VIP
                          </span>
                        )}
                        {(u.isStreamer || u.isHost) && (
                          <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/30 text-[10px] font-bold">
                            Streamer
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-300">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-pink-400" />
                        {u.city || u.location || 'Tehran, Iran'}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-amber-400">
                      {(u.coins || u.userCoins || 0).toLocaleString()} 🪙
                    </td>

                    <td className="p-3.5">
                      {u.online ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          {window.loc('آنلاین', 'Online')}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">{window.loc('آفلاین', 'Offline')}</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedUserDetail(u)}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-[10px] flex items-center gap-1 transition"
                        >
                          <Eye className="w-3 h-3" />
                          <span>{window.loc('جزئیات', 'Details')}</span>
                        </button>

                        <button
                          onClick={() => handleToggleBan(u)}
                          className={`p-1.5 rounded-xl border transition ${
                            u.isBanned 
                              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30' 
                              : 'bg-rose-600/20 text-rose-300 border-rose-500/30 hover:bg-rose-600 hover:text-white'
                          }`}
                          title={u.isBanned ? window.loc('رفع مسدودی', 'Unblock') : window.loc('مسدود کردن', 'blocking')}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleVerify(u)}
                          className="p-1.5 rounded-xl bg-slate-800 text-cyan-300 hover:bg-cyan-600 hover:text-white transition"
                          title={window.loc('تغییر تایید هویت', 'Change authentication')}
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= USER DETAIL DRAWER / MODAL ================= */}
      {selectedUserDetail && (
        <div className="p-5 rounded-3xl bg-slate-950 border border-cyan-500/40 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <img src={selectedUserDetail.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400" />
              <div>
                <h3 className="font-bold text-white text-sm">{selectedUserDetail.name || selectedUserDetail.username}</h3>
                <span className="text-xs text-cyan-400 font-mono">@{selectedUserDetail.username} • ID: {selectedUserDetail.id || 'N/A'}</span>
              </div>
            </div>

            <button onClick={() => setSelectedUserDetail(null)} className="text-slate-400 hover:text-white font-bold">{window.loc('✕ بستن', '✕ Close')}</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">{window.loc('دستگاه و IP ثبت‌شده:', 'Registered device and IP:')}</span>
              <p className="font-mono text-slate-200 text-xs">IP: 185.102.40.12</p>
              <p className="text-[10px] text-slate-400">Device: iPhone 14 Pro / iOS 17</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">{window.loc('کیف پول و فعالیت:', 'Wallet and Activity:')}</span>
              <p className="font-mono text-amber-400 font-bold text-xs">{(selectedUserDetail.coins || 0).toLocaleString()} Coins</p>
              <p className="text-[10px] text-slate-400">{window.loc('پیام‌ها: 1,420 • لایوها: 14', 'Messages: 1,420 • Lives: 14')}</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">{window.loc('اقدامات مدیریتی:', 'Management measures:')}</span>
              <div className="flex items-center gap-1.5 pt-1">
                <button onClick={() => handleToggleBan(selectedUserDetail)} className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px]">
                  {selectedUserDetail.isBanned ? window.loc('رفع Ban', 'Fix Ban') : window.loc('Ban کاربر', 'Ban the user')}
                </button>
                <button onClick={() => handleToggleMute(selectedUserDetail)} className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[10px]">
                  {selectedUserDetail.isMuted ? window.loc('رفع Mute', 'Fix Mute') : window.loc('Mute کاربر', 'Mute the user')}
                </button>
                <button onClick={() => handleResetPassword(selectedUserDetail)} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold text-[10px]">
                  {window.loc('ریست رمز', 'password reset')}
                </button>
              </div>
            </div>
          </div>

          {/* Admin Notes Section */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-300 text-xs">{window.loc('یادداشت‌ها و اخطارهای ادمین:', 'Admin notes and warnings:')}</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={adminNoteInput}
                onChange={e => setAdminNoteInput(e.target.value)}
                placeholder={window.loc('افزودن یادداشت جدید درباره این کاربر...', 'Add new note about this user...')}
                className="flex-1 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
              />
              <button
                onClick={() => handleSaveAdminNote(selectedUserDetail)}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-slate-950 font-bold text-xs"
              >
                {window.loc('ذخیره یادداشت', 'Save note')}
              </button>
            </div>

            {selectedUserDetail.adminNotes?.map((note, i) => (
              <div key={i} className="text-[11px] text-slate-300 p-2 rounded-xl bg-slate-950 border border-slate-800/60 flex items-center justify-between">
                <span>{note.text}</span>
                <span className="text-[9px] text-slate-500 font-mono">{note.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
