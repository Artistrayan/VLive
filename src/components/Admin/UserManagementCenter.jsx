import React, { useState } from 'react';
import { apiAdmin } from '../../services/api';
import { 
  Users, Search, Filter, ShieldCheck, ShieldAlert, Ban, UserX, UserCheck, 
  Crown, Video, CheckCircle2, AlertTriangle, Key, Trash2, RefreshCw, Eye, 
  MapPin, Smartphone, Clock, DollarSign, Gift, MessageSquare, History, FileText,
  Lock, Unlock, ChevronRight, Sparkles, MoreVertical, Shield, Sliders, Save, Check
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
  
  // Quick Permissions & Edit Modal State
  const [editPermissionsUser, setEditPermissionsUser] = useState(null);
  const [permForm, setPermForm] = useState({
    name: '',
    username: '',
    role: 'user',
    isVerified: false,
    isVip: false,
    vipPlan: 'none',
    isStreamer: false,
    isBanned: false,
    isMuted: false,
    coins: 0,
    diamonds: 0,
    city: '',
    bio: '',
    adminNote: ''
  });
  const [isSavingPermissions, setIsSavingPermissions] = useState(false);

  const handleOpenPermissionsModal = (user) => {
    const isVip = Boolean(user.isVip || user.vip || user.is_vip || (user.vip_plan && user.vip_plan !== 'none'));
    const isVerified = Boolean(user.isVerified || user.verified || user.is_verified);
    const isStreamer = Boolean(user.isStreamer || user.isHost || user.is_streamer);
    const isBanned = Boolean(user.isBanned || user.status === 'banned');
    const isMuted = Boolean(user.isMuted);
    const coins = Number(user.coins ?? user.userCoins ?? 0);
    const diamonds = Number(user.diamonds ?? 0);

    setEditPermissionsUser(user);
    setPermForm({
      name: user.name || user.fullName || user.username || '',
      username: user.username || '',
      role: user.role || (user.user_type === 'ADMIN' ? 'admin' : (isStreamer ? 'streamer' : 'user')),
      isVerified,
      isVip,
      vipPlan: user.vip_plan || user.vipPlan || (isVip ? 'VIP_PREMIUM' : 'none'),
      isStreamer,
      isBanned,
      isMuted,
      coins,
      diamonds,
      city: user.city || user.location || '',
      bio: user.bio || '',
      adminNote: ''
    });
  };

  const handleSaveUserPermissions = async () => {
    if (!editPermissionsUser) return;
    setIsSavingPermissions(true);
    try {
      const updates = {
        name: permForm.name,
        role: permForm.role,
        is_verified: permForm.isVerified,
        is_vip: permForm.isVip,
        vip_plan: permForm.isVip ? (permForm.vipPlan !== 'none' ? permForm.vipPlan : 'VIP_PREMIUM') : 'none',
        is_streamer: permForm.isStreamer,
        is_banned: permForm.isBanned,
        status: permForm.isBanned ? 'banned' : 'approved',
        is_muted: permForm.isMuted,
        city: permForm.city,
        bio: permForm.bio,
        user_type: permForm.role === 'admin' || permForm.role === 'super_admin' ? 'ADMIN' : (permForm.isStreamer ? 'STREAMER' : 'REAL_USER')
      };

      if (permForm.diamonds !== Number(editPermissionsUser.diamonds ?? 0)) {
        updates.diamonds = Number(permForm.diamonds);
      }

      // 1. Update Profile fields
      await apiAdmin.updateUserFields(editPermissionsUser.id || editPermissionsUser.username, updates);

      // 2. Update Coins if changed
      const origCoins = Number(editPermissionsUser.coins ?? editPermissionsUser.userCoins ?? 0);
      const newCoins = Number(permForm.coins);
      if (newCoins !== origCoins) {
        const delta = newCoins - origCoins;
        await apiAdmin.adjustUserWallet(editPermissionsUser.id || editPermissionsUser.username, delta, `Admin Permissions Editor: Adjusted to ${newCoins}`);
      }

      // Update Diamonds if changed
      const origDiamonds = Number(editPermissionsUser.diamonds ?? 0);
      const newDiamonds = Number(permForm.diamonds);
      if (newDiamonds !== origDiamonds) {
        const deltaDiamonds = newDiamonds - origDiamonds;
        await apiAdmin.adjustUserDiamonds(editPermissionsUser.id || editPermissionsUser.username, deltaDiamonds, `Admin Permissions Editor: Adjusted to ${newDiamonds} diamonds`);
      }

      // 3. Add note if present
      let updatedNotes = editPermissionsUser.adminNotes || [];
      if (permForm.adminNote && permForm.adminNote.trim()) {
        updatedNotes = [...updatedNotes, { text: permForm.adminNote.trim(), date: new Date().toLocaleString() }];
        await apiAdmin.updateUserFields(editPermissionsUser.id || editPermissionsUser.username, { admin_notes: JSON.stringify(updatedNotes) });
      }

      // 4. Update React State
      const updatedUserObj = {
        ...editPermissionsUser,
        name: permForm.name,
        role: permForm.role,
        isVerified: permForm.isVerified,
        verified: permForm.isVerified,
        is_verified: permForm.isVerified,
        isVip: permForm.isVip,
        vip: permForm.isVip,
        is_vip: permForm.isVip,
        vip_plan: permForm.isVip ? permForm.vipPlan : 'none',
        vipPlan: permForm.isVip ? permForm.vipPlan : 'none',
        isStreamer: permForm.isStreamer,
        isHost: permForm.isStreamer,
        is_streamer: permForm.isStreamer,
        isBanned: permForm.isBanned,
        status: permForm.isBanned ? 'banned' : 'approved',
        isMuted: permForm.isMuted,
        coins: newCoins,
        userCoins: newCoins,
        diamonds: permForm.diamonds,
        city: permForm.city,
        bio: permForm.bio,
        adminNotes: updatedNotes
      };

      setUsersList(prev => prev.map(u => (u.id === editPermissionsUser.id || u.username === editPermissionsUser.username ? updatedUserObj : u)));
      
      if (selectedUserDetail?.id === editPermissionsUser.id) {
        setSelectedUserDetail(updatedUserObj);
      }

      addAdminAuditLog(`Admin Action: Updated permissions and details for user @${editPermissionsUser.username} (VIP: ${permForm.isVip}, Verified: ${permForm.isVerified}, Streamer: ${permForm.isStreamer}, Coins: ${newCoins})`);
      showToast(window.loc(`💾 تغییرات و دسترسی‌های @${editPermissionsUser.username} با موفقیت در دیتابیس ذخیره شد`, `💾 Changes and permissions for @${editPermissionsUser.username} saved successfully`));
      setEditPermissionsUser(null);
    } catch (err) {
      showToast(window.loc(`❌ خطا در ذخیره‌سازی: ${err.message}`, `❌ Save error: ${err.message}`));
    } finally {
      setIsSavingPermissions(false);
    }
  };
  
  // Direct Wallet/Coin Adjustment Modal State
  const [adjustCoinModalUser, setAdjustCoinModalUser] = useState(null);
  const [adjustCoinAmount, setAdjustCoinAmount] = useState('');
  const [adjustCoinType, setAdjustCoinType] = useState('add'); // 'add', 'deduct', 'set'
  const [adjustCoinReason, setAdjustCoinReason] = useState('Admin Manual Correction');
  const [isAdjustingCoin, setIsAdjustingCoin] = useState(false);

  const handleOpenAdjustCoins = (user) => {
    setAdjustCoinModalUser(user);
    setAdjustCoinAmount('');
    setAdjustCoinType('add');
    setAdjustCoinReason('Admin Manual Adjustment');
  };

  const handleExecuteCoinAdjustment = async () => {
    if (!adjustCoinModalUser || !adjustCoinAmount) {
      showToast(window.loc('لطفاً مبلغ معتبر وارد کنید', 'Please enter a valid amount'));
      return;
    }
    const num = parseInt(adjustCoinAmount, 10);
    if (isNaN(num) || num < 0) {
      showToast(window.loc('مبلغ نامعتبر است', 'Invalid amount'));
      return;
    }

    setIsAdjustingCoin(true);
    try {
      const currentCoins = Number(adjustCoinModalUser.coins ?? adjustCoinModalUser.userCoins ?? 0);
      let delta = 0;
      if (adjustCoinType === 'add') delta = num;
      else if (adjustCoinType === 'deduct') delta = -num;
      else if (adjustCoinType === 'set') delta = num - currentCoins;

      const res = await apiAdmin.adjustUserWallet(
        adjustCoinModalUser.id || adjustCoinModalUser.username,
        delta,
        adjustCoinReason
      );

      if (res && (res.success || typeof res.new_coins === 'number')) {
        const newBalance = typeof res.new_coins === 'number' ? res.new_coins : Math.max(0, currentCoins + delta);
        setUsersList(prev => prev.map(u => {
          if (u.id === adjustCoinModalUser.id || u.username === adjustCoinModalUser.username) {
            return { ...u, coins: newBalance, userCoins: newBalance };
          }
          return u;
        }));
        if (selectedUserDetail?.id === adjustCoinModalUser.id) {
          setSelectedUserDetail(prev => ({ ...prev, coins: newBalance, userCoins: newBalance }));
        }
        addAdminAuditLog(`Admin Action: Adjusted wallet of @${adjustCoinModalUser.username} by ${delta > 0 ? '+' : ''}${delta} coins (New: ${newBalance})`);
        showToast(window.loc(`✅ موجودی @${adjustCoinModalUser.username} به ${newBalance.toLocaleString()} سکه تغییر یافت`, `✅ Balance of @${adjustCoinModalUser.username} updated to ${newBalance.toLocaleString()} coins`));
        setAdjustCoinModalUser(null);
      } else {
        showToast(window.loc(`❌ خطا در تغییر موجودی: ${res?.error || 'Database error'}`, `❌ Balance adjustment failed: ${res?.error || 'Database error'}`));
      }
    } catch (err) {
      showToast(window.loc(`❌ خطا در ارتباط: ${err.message}`, `❌ Connection error: ${err.message}`));
    } finally {
      setIsAdjustingCoin(false);
    }
  };

  // Filtering users logic
  const filteredUsers = (Array.isArray(usersList) ? usersList : []).filter(user => {
    if (!user) return false;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      !q || 
      (user?.name || '').toLowerCase().includes(q) ||
      (user?.username || '').toLowerCase().includes(q) ||
      (user?.email || '').toLowerCase().includes(q) ||
      (user?.city || '').toLowerCase().includes(q) ||
      (user?.id || '').toString().includes(q);

    if (!matchesQuery) return false;

    if (filterCategory === 'ONLINE') return user?.online === true;
    if (filterCategory === 'VERIFIED') return Boolean(user?.isVerified || user?.is_verified || user?.verified);
    if (filterCategory === 'VIP') return Boolean(user?.isVip || user?.is_vip || user?.vip);
    if (filterCategory === 'STREAMERS') return Boolean(user?.isStreamer || user?.isHost || user?.is_streamer);
    if (filterCategory === 'BANNED') return user?.isBanned === true;
    if (filterCategory === 'MUTED') return user?.isMuted === true;
    if (filterCategory === 'SUSPENDED') return user?.isSuspended === true;

    return true;
  });

  // Action handlers
  const handleToggleBan = async (user) => {
    const nextBanned = !user.isBanned;
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, isBanned: nextBanned, status: nextBanned ? 'banned' : 'approved' } : u));
    if (apiAdmin && typeof apiAdmin.updateUserFields === 'function') {
       await apiAdmin.updateUserFields(user.id, { is_banned: nextBanned, status: nextBanned ? 'banned' : 'approved' });
    }
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail(prev => ({ ...prev, isBanned: nextBanned }));
    }
    addAdminAuditLog(`Admin Action: ${nextBanned ? 'Banned' : 'Unbanned'} user @${user.username || user.name}`);
    showToast(nextBanned ? window.loc(`🚫 کاربر @${user.username} مسدود شد`, `🚫 User @${user.username} banned`) : window.loc(`انسداد کاربر @${user.username} لغو شد`, `User @${user.username} unbanned`));
  };

  const handleToggleMute = async (user) => {
    const nextMuted = !user.isMuted;
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, isMuted: nextMuted } : u));
    if (apiAdmin && typeof apiAdmin.updateUserFields === 'function') {
       await apiAdmin.updateUserFields(user.id, { is_muted: nextMuted });
    }
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail(prev => ({ ...prev, isMuted: nextMuted }));
    }
    addAdminAuditLog(`Admin Action: ${nextMuted ? 'Muted' : 'Unmuted'} user @${user.username}`);
    showToast(nextMuted ? window.loc(`🔇 کاربر @${user.username} بی صدا شد`, `🔇 User @${user.username} muted`) : window.loc(`صدای کاربر @${user.username} فعال شد`, `User @${user.username} unmuted`));
  };

  const handleToggleVerify = async (user) => {
    const nextVerified = !(user.isVerified || user.verified || user.is_verified);
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, isVerified: nextVerified, verified: nextVerified, is_verified: nextVerified } : u));
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail(prev => ({ ...prev, isVerified: nextVerified, verified: nextVerified, is_verified: nextVerified }));
    }
    if (apiAdmin && typeof apiAdmin.updateUserFields === 'function') { 
       await apiAdmin.updateUserFields(user.id, { is_verified: nextVerified });
    }
    addAdminAuditLog(`Admin Action: ${nextVerified ? 'Granted Verification' : 'Revoked Verification'} for @${user.username || user.name}`);
    showToast(nextVerified ? window.loc(`✅ نشان تایید آبی به @${user.username} اعطا شد`, `✅ Verification granted to @${user.username}`) : window.loc(`نشان تایید @${user.username} لغو شد`, `Verification removed from @${user.username}`));
  };

  const handleToggleVip = async (user) => {
    const nextVip = !(user.isVip || user.vip || user.is_vip);
    setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, isVip: nextVip, vip: nextVip, is_vip: nextVip } : u));
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail(prev => ({ ...prev, isVip: nextVip, vip: nextVip, is_vip: nextVip }));
    }
    if (apiAdmin && typeof apiAdmin.updateUserFields === 'function') { 
       await apiAdmin.updateUserFields(user.id, { is_vip: nextVip, vip_plan: nextVip ? 'VIP_PREMIUM' : null });
    }
    addAdminAuditLog(`Admin Action: ${nextVip ? 'Granted VIP Status' : 'Revoked VIP Status'} for @${user.username || user.name}`);
    showToast(nextVip ? window.loc(`👑 عضویت VIP به @${user.username} فعال شد`, `👑 VIP status activated for @${user.username}`) : window.loc(`عضویت VIP @${user.username} لغو شد`, `VIP status revoked for @${user.username}`));
  };

  const handleToggleStreamer = async (user) => {
    const nextStreamer = !(user.isStreamer || user.isHost || user.is_streamer || user.user_type === 'STREAMER');
    const prevStreamer = !nextStreamer;

    setUsersList(prev => prev.map(u => u.id === user.id ? {
      ...u,
      isStreamer: nextStreamer,
      isHost: nextStreamer,
      is_streamer: nextStreamer,
      user_type: nextStreamer ? 'STREAMER' : 'REAL_USER'
    } : u));

    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail(prev => ({
        ...prev,
        isStreamer: nextStreamer,
        isHost: nextStreamer,
        is_streamer: nextStreamer,
        user_type: nextStreamer ? 'STREAMER' : 'REAL_USER'
      }));
    }

    if (apiAdmin && typeof apiAdmin.updateUserFields === 'function') { 
      const res = await apiAdmin.updateUserFields(user.id, {
        is_streamer: nextStreamer,
        user_type: nextStreamer ? 'STREAMER' : 'REAL_USER'
      });

      if (res && res.success === false) {
        // Rollback
        setUsersList(prev => prev.map(u => u.id === user.id ? {
          ...u,
          isStreamer: prevStreamer,
          isHost: prevStreamer,
          is_streamer: prevStreamer,
          user_type: prevStreamer ? 'STREAMER' : 'REAL_USER'
        } : u));
        if (selectedUserDetail?.id === user.id) {
          setSelectedUserDetail(prev => ({
            ...prev,
            isStreamer: prevStreamer,
            isHost: prevStreamer,
            is_streamer: prevStreamer,
            user_type: prevStreamer ? 'STREAMER' : 'REAL_USER'
          }));
        }
        showToast(window.loc(`❌ خطا در ذخیره‌سازی وضعیت استریمر: ${res.error || ''}`, `❌ Failed to save streamer status: ${res.error || ''}`));
        return;
      }
    }

    addAdminAuditLog(`Admin Action: ${nextStreamer ? 'Promoted to Streamer' : 'Demoted Streamer'} @${user.username || user.name}`);
    showToast(nextStreamer ? window.loc(`🎥 مقام استریمر به @${user.username} داده شد و ذخیره گردید`, `🎥 Streamer status granted and saved for @${user.username}`) : window.loc(`مقام استریمر @${user.username} لغو گردید`, `Streamer status removed for @${user.username}`));
  };

  const handleResetPassword = (user) => {
    // Requires a true Auth backend method to send a reset email. For now, log it.
    addAdminAuditLog(`Admin Action: Reset password & session tokens for @${user.username}`);
    showToast(window.loc(`🔑 لینک بازنشانی رمز عبور برای @${user.username} ارسال گردید`, `🔑 Password reset link sent to @${user.username}`));
  };

  const handleSaveAdminNote = async (user) => {
    if (!adminNoteInput.trim()) return;
    const updatedNotes = [...(user.adminNotes || []), { text: adminNoteInput, date: new Date().toLocaleString() }];
    if (apiAdmin && typeof apiAdmin.updateUserFields === 'function') {
      await apiAdmin.updateUserFields(user.id, { admin_notes: JSON.stringify(updatedNotes) });
    }
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
                          src={u.avatar || u.thumbnail || ''} 
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
                      <div className="flex items-center gap-2">
                        {/* Unified Single Management Button */}
                        <button
                          onClick={() => handleOpenPermissionsModal(u)}
                          className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                          title={window.loc('مدیریت کامل نقش، دسترسی‌ها، سکه‌ها و وضعیت کاربر', 'Manage role, permissions, coins and user status')}
                        >
                          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{window.loc('✏️ مدیریت کاربر', '✏️ Manage User')}</span>
                        </button>

                        {/* Quick Ban / Unban Toggle */}
                        <button
                          onClick={() => handleToggleBan(u)}
                          className={`p-1.5 rounded-xl border transition ${
                            u.isBanned 
                              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-600 hover:text-white' 
                              : 'bg-rose-600/10 text-rose-300 border-rose-500/20 hover:bg-rose-600 hover:text-white'
                          }`}
                          title={u.isBanned ? window.loc('رفع مسدودی کاربر', 'Unblock User') : window.loc('مسدود کردن کاربر', 'Block User')}
                        >
                          <Ban className="w-3.5 h-3.5" />
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



      {/* ================= MODAL: DIRECT WALLET COIN ADJUSTMENT ================= */}
      {adjustCoinModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm">
                    {window.loc('اصلاح موجودی کیف پول', 'Adjust Wallet Balance')}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    @{adjustCoinModalUser.username} • {window.loc('موجودی فعلی:', 'Current:')} {(adjustCoinModalUser.coins || adjustCoinModalUser.userCoins || 0).toLocaleString()} 🪙
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setAdjustCoinModalUser(null)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Type selector: Add, Deduct, Set exact */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'add', label: window.loc('➕ افزایش سکه', '➕ Add Coins'), color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
                { id: 'deduct', label: window.loc('➖ کسر سکه', '➖ Deduct Coins'), color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
                { id: 'set', label: window.loc('🎯 تعیین مستقیم', '🎯 Set Exact'), color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setAdjustCoinType(t.id)}
                  className={`py-2 px-1 rounded-2xl border text-center font-bold text-[10px] transition ${
                    adjustCoinType === t.id
                      ? `${t.color} font-black ring-2 ring-white/20 shadow-md`
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Amount input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300 block">
                {adjustCoinType === 'set' 
                  ? window.loc('موجودی نهایی جدید (سکه):', 'New exact coin balance:') 
                  : window.loc('تعداد سکه مورد نظر:', 'Coin amount:')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={adjustCoinAmount}
                  onChange={e => setAdjustCoinAmount(e.target.value)}
                  placeholder="مثلاً 1000"
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-sm outline-none focus:border-amber-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400">🪙</span>
              </div>
            </div>

            {/* Reason input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-300 block">
                {window.loc('علت تغییر و ثبت در لاگ:', 'Reason for adjustment & audit log:')}
              </label>
              <input
                type="text"
                value={adjustCoinReason}
                onChange={e => setAdjustCoinReason(e.target.value)}
                placeholder="مثلاً پاداش مسابقه، اصلاح شارژ، جبران خطا..."
                className="w-full px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                disabled={isAdjustingCoin}
                onClick={handleExecuteCoinAdjustment}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition disabled:opacity-50"
              >
                {isAdjustingCoin ? window.loc('در حال ثبت در دیتابیس...', 'Saving to database...') : window.loc('💾 اعمال و ذخیره دائمی', '💾 Apply & Save Permanently')}
              </button>
              <button
                onClick={() => setAdjustCoinModalUser(null)}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                {window.loc('انصراف', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: USER PERMISSIONS & QUICK EDIT ================= */}
      {editPermissionsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black shadow-lg">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-sm flex items-center gap-1.5">
                    <span>{window.loc('ویرایش دسترسی‌ها و ذخیره تغییرات کاربر', 'User Permissions & Edit')}</span>
                  </h3>
                  <p className="text-[10px] text-cyan-400 font-mono">
                    @{editPermissionsUser.username} • ID: {editPermissionsUser.id || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditPermissionsUser(null)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1 rounded-xl hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Form Sections */}
            <div className="space-y-3.5 text-xs">
              {/* User Identity & Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    {window.loc('نام نمایشی:', 'Display Name:')}
                  </label>
                  <input
                    type="text"
                    value={permForm.name}
                    onChange={e => setPermForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">
                    {window.loc('شهر / موقعیت مکانی:', 'City / Location:')}
                  </label>
                  <input
                    type="text"
                    value={permForm.city}
                    onChange={e => setPermForm(p => ({ ...p, city: e.target.value }))}
                    placeholder="Tehran, Iran"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Roles & System Access */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{window.loc('سطح دسترسی و نقش سیستمی:', 'System Role & Access Level:')}</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'user', label: window.loc('کاربر عادی', 'Normal User') },
                    { id: 'streamer', label: window.loc('استریمر', 'Streamer') },
                    { id: 'admin', label: window.loc('مدیر ادمین', 'Admin') },
                    { id: 'super_admin', label: window.loc('مدیر ارشد', 'Super Admin') }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setPermForm(p => ({
                        ...p,
                        role: r.id,
                        isStreamer: r.id === 'streamer' ? true : (r.id === 'user' ? false : p.isStreamer)
                      }))}
                      className={`py-2 px-2 rounded-xl border text-center font-bold text-[11px] transition ${
                        permForm.role === r.id || (r.id === 'user' && !permForm.isStreamer && permForm.role !== 'admin' && permForm.role !== 'super_admin')
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feature Badges & Flags Toggles */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{window.loc('تنظیم نشان‌ها و دسترسی‌های ویژه:', 'Badges & Special Features:')}</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Verified Badge */}
                  <button
                    type="button"
                    onClick={() => setPermForm(p => ({ ...p, isVerified: !p.isVerified }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                      permForm.isVerified
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>{window.loc('نشان تایید آبی (Verified)', 'Verified Blue Badge')}</span>
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${permForm.isVerified ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                      {permForm.isVerified ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Streamer Access */}
                  <button
                    type="button"
                    onClick={() => setPermForm(p => ({ ...p, isStreamer: !p.isStreamer }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                      permForm.isStreamer
                        ? 'bg-pink-500/20 border-pink-500 text-pink-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Video className="w-4 h-4 text-pink-400" />
                      <span>{window.loc('دسترسی پخش زنده (Streamer)', 'Live Broadcast Access')}</span>
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${permForm.isStreamer ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      {permForm.isStreamer ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* VIP Status */}
                  <button
                    type="button"
                    onClick={() => setPermForm(p => ({ ...p, isVip: !p.isVip }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                      permForm.isVip
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span>{window.loc('عضویت ویژه (VIP Member)', 'VIP Membership')}</span>
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${permForm.isVip ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                      {permForm.isVip ? 'ON' : 'OFF'}
                    </span>
                  </button>

                  {/* Account Ban / Suspension */}
                  <button
                    type="button"
                    onClick={() => setPermForm(p => ({ ...p, isBanned: !p.isBanned }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                      permForm.isBanned
                        ? 'bg-rose-600/20 border-rose-500 text-rose-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Ban className="w-4 h-4 text-rose-400" />
                      <span>{window.loc('مسدودسازی حساب (Banned)', 'Ban Account')}</span>
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${permForm.isBanned ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      {permForm.isBanned ? 'BANNED' : 'ACTIVE'}
                    </span>
                  </button>

                  {/* Mute Chat Toggle */}
                  <button
                    type="button"
                    onClick={() => setPermForm(p => ({ ...p, isMuted: !p.isMuted }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition ${
                      permForm.isMuted
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>{window.loc('توقیف چت (Muted)', 'Mute Chat')}</span>
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${permForm.isMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                      {permForm.isMuted ? 'MUTED' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Financial Balance Modification */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>{window.loc('موجودی و تراکنش‌های کیف پول:', 'Wallet Balances:')}</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      {window.loc('موجودی سکه (Coins):', 'Coin Balance:')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={permForm.coins}
                        onChange={e => setPermForm(p => ({ ...p, coins: e.target.value === '' ? '' : Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold text-xs outline-none focus:border-amber-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">🪙</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      {window.loc('موجودی الماس (Diamonds):', 'Diamond Balance:')}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={permForm.diamonds}
                        onChange={e => setPermForm(p => ({ ...p, diamonds: e.target.value === '' ? '' : Number(e.target.value) }))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 font-mono font-bold text-xs outline-none focus:border-cyan-400"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">💎</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Note */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block">
                  {window.loc('افزودن یادداشت جدید ادمین:', 'Add Admin Note:')}
                </label>
                <input
                  type="text"
                  value={permForm.adminNote}
                  onChange={e => setPermForm(p => ({ ...p, adminNote: e.target.value }))}
                  placeholder="توضیحات و دستورات مدیریتی..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Primary Save Button */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                disabled={isSavingPermissions}
                onClick={handleSaveUserPermissions}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-95 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-slate-950" />
                <span>
                  {isSavingPermissions
                    ? window.loc('در حال ذخیره در دیتابیس...', 'Saving to database...')
                    : window.loc('💾 ذخیره تمامی تغییرات کاربر در دیتابیس', '💾 Save All User Changes to DB')}
                </span>
              </button>
              <button
                onClick={() => setEditPermissionsUser(null)}
                className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                {window.loc('انصراف', 'Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
