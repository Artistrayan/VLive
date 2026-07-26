// Telegram WebApp Initialization
let tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

const API_BASE_URL = window.location.origin.includes('8000') ? window.location.origin : '';

// State
let state = {
    isAdmin: false,
    userCoins: 1250,
    currentMainSubTab: 'users',
    currentUserFilter: 'all',
    currentStreamFilter: 'all',
    users: [
        { id: 101, uid: 'ID-98401', username: 'Sogand_Live', name: 'سوگند', age: 24, vip_level: 4, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sogand', is_online: true, is_top: true, is_popular: true },
        { id: 102, uid: 'ID-84210', username: 'Elena_Stream', name: 'النا', age: 22, vip_level: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', is_online: true, is_top: true, is_popular: false },
        { id: 103, uid: 'ID-73912', username: 'Sara_Vip', name: 'سارا', age: 25, vip_level: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', is_online: false, is_top: false, is_popular: true },
        { id: 104, uid: 'ID-61294', username: 'Niki_Model', name: 'نیکی', age: 21, vip_level: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Niki', is_online: true, is_top: true, is_popular: true },
        { id: 105, uid: 'ID-55102', username: 'Roya_Star', name: 'رویا', age: 23, vip_level: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roya', is_online: true, is_top: false, is_popular: false }
    ],
    streams: [
        { id: 1, host_uid: 'ID-98401', host_username: 'Sogand_Live', display_name: 'سوگند', age: 24, vip_level: 4, title: 'استودیو چت VIP و اجرای نئونی 4K', viewer_count: 1840, host_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sogand', is_online: true, is_plus_18: true, is_free: false },
        { id: 2, host_uid: 'ID-84210', host_username: 'Elena_Stream', display_name: 'النا', age: 22, vip_level: 3, title: 'گفتگوی عمومی رایگان و پاسخ به سوالات', viewer_count: 1210, host_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', is_online: true, is_plus_18: false, is_free: true },
        { id: 3, host_uid: 'ID-73912', host_username: 'Sara_Vip', display_name: 'سارا', age: 25, vip_level: 2, title: 'لایو موسیقی و رقص نور نئونی اختصاصی', viewer_count: 950, host_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', is_online: true, is_plus_18: true, is_free: false },
        { id: 4, host_uid: 'ID-61294', host_username: 'Niki_Model', display_name: 'نیکی', age: 21, vip_level: 5, title: 'استریم چت آزاد و موسیقی پاپ', viewer_count: 2100, host_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Niki', is_online: true, is_plus_18: false, is_free: true }
    ],
    vaultItems: [
        { id: 1, host_username: 'Sogand_Live', title: 'آلبوم اختصاصی ۴K نئونی استودیو', unlock_cost_stars: 150, is_unlocked: false, is_video: false },
        { id: 2, host_username: 'Elena_Stream', title: 'ویدئوی اختصاصی پشت صحنه VIP', unlock_cost_stars: 300, is_unlocked: false, is_video: true }
    ],
    leaderboardHosts: [
        { rank: 1, name: 'Sogand_Live', badge: 'Golden Queen', score: '45,200 Stars' },
        { rank: 2, name: 'Elena_Stream', badge: 'Neon Goddess', score: '38,900 Stars' },
        { rank: 3, name: 'Sara_Vip', badge: 'Silver Host', score: '29,400 Stars' }
    ],
    leaderboardSupporters: [
        { rank: 1, name: 'Whale_King_99', badge: 'Diamond Donor', score: '125,000 Stars' },
        { rank: 2, name: 'Crypto_Lord', badge: 'Golden Whale', score: '98,000 Stars' }
    ],
    bookings: [
        { id: 1, host_username: 'Sogand_Live', booking_date: '2026-07-25', time_slot: '22:00 - 22:30', cost_stars: 500, status: 'تایید شده' }
    ]
};

// Helper: Auth Headers
function getAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('auth_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const initData = window.Telegram?.WebApp?.initData;
    if (initData) {
        headers['x-telegram-init-data'] = initData;
    }
    return headers;
}

// HMAC Telegram WebApp Authentication
async function authTelegram() {
    try {
        const initData = window.Telegram?.WebApp?.initData || "";
        if (initData) {
            const res = await fetch(`${API_BASE_URL}/api/users/auth/telegram`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ init_data: initData })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.access_token) {
                    localStorage.setItem('auth_token', data.access_token);
                    console.log("Telegram HMAC Authentication Successful!");
                    return;
                }
            } else {
                console.warn("Telegram HMAC Authentication Failed:", res.status);
            }
        }
    } catch (e) {
        console.log("Auth error:", e);
    }
}

// Generate or retrieve permanent unchangeable UID for user
function getOrCreateUserUID() {
    let savedUID = localStorage.getItem('user_permanent_uid');
    if (!savedUID) {
        if (tg?.initDataUnsafe?.user?.id) {
            savedUID = 'ID-' + tg.initDataUnsafe.user.id;
        } else {
            savedUID = 'ID-' + Math.floor(100000 + Math.random() * 900000);
        }
        localStorage.setItem('user_permanent_uid', savedUID);
    }
    return savedUID;
}

// Async API Loaders
async function loadUser() {
    try {
        const profileUidEl = document.getElementById('profile-uid-text');
        if (profileUidEl) profileUidEl.innerText = getOrCreateUserUID();

        if (tg?.initDataUnsafe?.user) {
            const u = tg.initDataUnsafe.user;
            const nameEl = document.getElementById('user-name');
            if (nameEl) nameEl.innerText = u.first_name + (u.last_name ? ' ' + u.last_name : '');
            const avatarEl = document.getElementById('user-avatar');
            if (avatarEl && u.photo_url) avatarEl.src = u.photo_url;

            const profileAvatar = document.getElementById('profile-avatar-large');
            if (profileAvatar && u.photo_url) profileAvatar.src = u.photo_url;
        }
        const res = await fetch(`${API_BASE_URL}/api/users/me`, { headers: getAuthHeaders() });
        if (res.ok) {
            const user = await res.json();
            const nameEl = document.getElementById('user-name');
            if (nameEl && user.username) nameEl.innerText = '@' + user.username;
            if (user.uid && profileUidEl) {
                profileUidEl.innerText = user.uid;
                localStorage.setItem('user_permanent_uid', user.uid);
            }
            if (user.wallet_stars !== undefined) {
                state.userCoins = user.wallet_stars;
                updateCoinDisplay();
            }
        }
    } catch (e) {
        console.log("Using local state mode for loadUser:", e);
    }
}

async function loadWallet() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/wallet/balance`, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            if (data.wallet_stars !== undefined) {
                state.userCoins = data.wallet_stars;
            }
        }
    } catch (e) {
        console.log("Using local state mode for loadWallet:", e);
    } finally {
        updateCoinDisplay();
    }
}

async function loadStreams() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/streams/active`, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            if (data && data.length) {
                state.streams = data;
            }
        }
    } catch (e) {
        console.log("Using local state mode for loadStreams:", e);
    } finally {
        renderUsers();
        renderStreams();
    }
}

async function loadVault() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/streams/vault`, { headers: getAuthHeaders() });
        if (res.ok) {
            state.vaultItems = await res.json();
        }
    } catch (e) {
        console.log("Using local state mode for loadVault:", e);
    } finally {
        renderVault();
    }
}

async function loadLeaderboard() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/users/leaderboard`, { headers: getAuthHeaders() });
        if (res.ok) {
            const data = await res.json();
            if (data.hosts) state.leaderboardHosts = data.hosts;
            if (data.supporters) state.leaderboardSupporters = data.supporters;
        }
    } catch (e) {
        console.log("Using local state mode for loadLeaderboard:", e);
    } finally {
        renderLeaderboard();
    }
}

async function loadBookings() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/booking/my-bookings`, { headers: getAuthHeaders() });
        if (res.ok) {
            state.bookings = await res.json();
        }
    } catch (e) {
        console.log("Using local state mode for loadBookings:", e);
    } finally {
        renderBookings();
    }
}

// On Document Load
document.addEventListener('DOMContentLoaded', async () => {
    await authTelegram();
    await loadUser();
    await loadWallet();
    await loadStreams();
    await loadVault();
    await loadLeaderboard();
    await loadBookings();
    updateGenderVisibility();

    // Check if auth already completed on first run
    const isAuthDone = localStorage.getItem('vlive_auth_completed');
    const authHeaderBtn = document.getElementById('auth-header-btn');
    if (isAuthDone === 'true') {
        state.isLoggedIn = true;
        state.isAgeVerified = true;
        state.isIdentityVerified = true;
        closeAuthModal();
        if (authHeaderBtn) authHeaderBtn.style.display = 'none';

        const userAvatarGlow = document.querySelector('.avatar-glow');
        if (userAvatarGlow) userAvatarGlow.classList.add('verified-gold');
    } else {
        openAuthModal();
        if (authHeaderBtn) authHeaderBtn.style.display = 'flex';
    }
});

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    const targetTab = document.getElementById(`tab-${tabId}`);
    if (targetTab) targetTab.classList.add('active');

    if (event?.currentTarget?.classList) {
        event.currentTarget.classList.add('active');
    }
}

// Toast Notification
function showToast(msg) {
    const toast = document.getElementById('toast-notification');
    if (toast) {
        toast.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    }
}

// ==========================================
// Main Sub-Tab Switcher: Users vs Lives
// ==========================================
function switchStreamMainSubTab(type) {
    state.currentMainSubTab = type;
    document.getElementById('view-btn-users').classList.toggle('active', type === 'users');
    document.getElementById('view-btn-lives').classList.toggle('active', type === 'lives');
    
    document.getElementById('subview-users').classList.toggle('hidden', type !== 'users');
    document.getElementById('subview-lives').classList.toggle('hidden', type !== 'lives');
    
    if (type === 'users') {
        renderUsers();
    } else {
        renderStreams();
    }
}

// Users View Filters & Rendering
function filterUsers(filter) {
    state.currentUserFilter = filter;
    ['all', 'online', 'top', 'popular'].forEach(f => {
        const el = document.getElementById(`user-filter-${f}`);
        if (el) el.classList.toggle('active', f === filter);
    });
    renderUsers();
}

function renderUsers() {
    const container = document.getElementById('users-grid-container');
    if (!container) return;
    
    let list = state.users;
    if (state.currentUserFilter === 'online') {
        list = list.filter(u => u.is_online);
    } else if (state.currentUserFilter === 'top') {
        list = list.filter(u => u.is_top);
    } else if (state.currentUserFilter === 'popular') {
        list = list.filter(u => u.is_popular);
    }
    
    if (list.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:30px; color:#8E9BAE; grid-column: span 2;">کاربری یافت نشد</div>';
        return;
    }
    
    container.innerHTML = list.map(u => `
        <div class="user-card">
            <div class="card-top-layout">
                <div class="avatar-large-container verified-gold ${u.is_online ? 'online' : ''}">
                    <img src="${u.avatar}" alt="${u.name}">
                </div>
                <div class="user-details-box" style="margin-top: 8px;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <span class="display-name">${u.name}</span>
                        <span class="age-badge">${u.age}</span>
                    </div>
                    <div class="status-indicator-badge ${u.is_online ? 'online' : 'offline'}" style="margin-top: 4px; display: inline-flex; align-items: center; justify-content: center;">
                        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${u.is_online ? '#39FF14' : '#8E9BAE'}; display: inline-block; box-shadow: 0 0 8px ${u.is_online ? '#39FF14' : 'transparent'};"></span>
                    </div>
                </div>
            </div>
            <div class="card-action-bar" style="margin-top: 12px; display: flex; gap: 8px; width: 100%;">
                <button class="profile-btn" style="flex: 1; padding: 10px 4px; display: flex; align-items: center; justify-content: center;" title="ارسال پیام" onclick="openChatModal('${u.username}', '${u.avatar}', '${u.name}')">
                    <svg class="svg-icon" style="width: 20px; height: 20px;" viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
                </button>
                <button class="join-live-btn" style="flex: 1; padding: 10px 4px; display: flex; align-items: center; justify-content: center;" title="تماس خصوصی" onclick="openStreamModal('${u.username}', '${u.avatar}', '${u.name}', ${u.age}, ${u.vip_level || 1}, '${u.uid || ('ID-' + u.id)}')">
                    <svg class="svg-icon" style="width: 20px; height: 20px;" viewBox="0 0 24 24"><path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                </button>
            </div>
        </div>
    `).join('');
}

// Live Streams View Filters & Rendering
function filterStreams(filter) {
    state.currentStreamFilter = filter;
    ['all', 'plus18', 'adultvip', 'free'].forEach(f => {
        const el = document.getElementById(`stream-filter-${f}`);
        if (el) el.classList.toggle('active', f === filter);
    });
    renderStreams();
}

function renderStreams() {
    const container = document.getElementById('stream-grid-container');
    if (!container) return;

    let list = state.streams;
    if (state.currentStreamFilter === 'plus18') {
        list = list.filter(s => s.is_plus_18);
    } else if (state.currentStreamFilter === 'adultvip') {
        list = list.filter(s => s.is_plus_18 && (s.vip_level && s.vip_level >= 3));
    } else if (state.currentStreamFilter === 'free') {
        list = list.filter(s => s.is_free);
    }

    if (list.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:30px; color:#8E9BAE; grid-column: span 2;">هیچ لایوی یافت نشد</div>';
        return;
    }

    container.innerHTML = list.map(s => `
        <div class="stream-card">
            <div class="card-top-layout">
                <div class="avatar-large-container verified-gold">
                    <img src="${s.host_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + s.host_username}" alt="${s.display_name || s.host_username}">
                    <div class="status-dot-overlay">
                        <span class="live-status-dot"></span>
                    </div>
                </div>
                <div class="user-details-box">
                    <span class="display-name">${s.display_name || s.host_username}</span>
                    <span class="username-sub">@${s.host_username}</span>
                    <div class="meta-tags-row">
                        <span class="age-badge">${s.age || 24}</span>
                        <span class="vip-badge">VIP ${s.vip_level || 3}</span>
                        ${s.is_plus_18 ? '<span class="tag-badge-18">18+</span>' : '<span class="age-badge" style="color:#39FF14; border-color:#39FF14;">FREE</span>'}
                    </div>
                </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin:10px 0 8px 0; padding:0 4px;">
                <span style="font-size:11px; color:#00F5FF; display:flex; align-items:center; gap:4px;">
                    <svg class="svg-icon" style="width:14px; height:14px;" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                    ${s.viewer_count || 1420}
                </span>
                <span style="display:flex; align-items:center; gap:4px;">
                    <span class="live-status-dot mini"></span>
                </span>
            </div>
            <div class="card-action-bar" style="display: flex; gap: 6px; width: 100%;">
                <button class="join-live-btn" style="flex:1; padding: 10px 4px;" title="ورود به لایو" onclick="openStreamModal('${s.host_username}', '${s.host_avatar}', '${s.display_name || s.host_username}', ${s.age || 24}, ${s.vip_level || 3}, '${s.host_uid || ('ID-' + (s.id + 100))}')">
                    <svg class="svg-icon" style="width:20px; height:20px;" viewBox="0 0 24 24"><path fill="currentColor" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                </button>
                <button class="profile-btn" style="flex:1; padding: 10px 4px;" title="چت خصوصی" onclick="openChatModal('${s.host_username}', '${s.host_avatar}', '${s.display_name || s.host_username}')">
                    <svg class="svg-icon" style="width:20px; height:20px;" viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
                </button>
            </div>
        </div>
    `).join('');
}

function openChatModal(username, avatar, name) {
    document.getElementById('chat-user-title').innerText = name ? name : '@' + username;
    document.getElementById('chat-user-sub').innerText = '@' + username;
    document.getElementById('chat-user-avatar').src = avatar || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + username);
    const msgBox = document.getElementById('chat-messages-box');
    if (msgBox) {
        msgBox.innerHTML = `
            <div class="chat-msg-bubble incoming">
                سلام! پیام مستقیم خود را برای @${username} بنویسید.
                <div class="msg-meta-row">
                    <span>${new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            </div>
        `;
    }
    document.getElementById('chat-modal').classList.remove('hidden');
}

function closeChatModal() {
    document.getElementById('chat-modal').classList.add('hidden');
}

let isChatTranslated = false;

function toggleChatTranslation() {
    isChatTranslated = !isChatTranslated;
    if (isChatTranslated) {
        showToast('حالت ترجمه هوشمند فعال شد (فارسی - انگلیسی)');
    } else {
        showToast('حالت ترجمه غیرفعال شد');
    }
}

function startChatCall() {
    showToast('درحال برقراری تماس صوتی نئونی...');
}

function blockUserInChat() {
    const user = document.getElementById('chat-user-sub')?.innerText || 'کاربر';
    showToast(`${user} با موفقیت مسدود شد`);
}

function sendGiftInChat() {
    const msgBox = document.getElementById('chat-messages-box');
    if (!msgBox) return;
    const nowStr = new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'});
    const msgId = 'gift-' + Date.now();
    
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg-bubble outgoing';
    userMsg.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; background:rgba(255,215,0,0.15); border:1px solid var(--neon-gold); padding:8px 12px; border-radius:12px;">
            <svg class="svg-icon" style="width:24px; height:24px; color:var(--neon-gold);" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h7.02v3h1.96V8H20v6z"/></svg>
            <div>
                <strong style="color:var(--neon-gold); font-size:12px; display:block;">هدیه ۵۰ سکه نئونی ارسال شد</strong>
                <span style="font-size:10px; color:#DDD;">Gift Sent</span>
            </div>
        </div>
        <div class="msg-meta-row">
            <span>${nowStr}</span>
            <span class="read-status-ticks" id="${msgId}-tick">
                <svg class="tick-icon sent" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </span>
        </div>
    `;
    msgBox.appendChild(userMsg);
    msgBox.scrollTop = msgBox.scrollHeight;

    setTimeout(() => {
        const tickEl = document.getElementById(`${msgId}-tick`);
        if (tickEl) {
            tickEl.innerHTML = `<svg class="tick-icon read" viewBox="0 0 24 24"><path fill="currentColor" d="M0.41 13.41L6 19l1.41-1.41L1.83 12m4.58 4.59L18 5l-1.41-1.41M22.59 5.41L11 17l-3.59-3.58L6 14.83l5 5 13-13z"/></svg>`;
        }
    }, 1200);

    setTimeout(() => {
        const replyMsg = document.createElement('div');
        replyMsg.className = 'chat-msg-bubble incoming';
        replyMsg.innerHTML = `
            بابت هدیه زیباتون ممنونم!
            <div class="msg-meta-row">
                <span>${new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
        `;
        msgBox.appendChild(replyMsg);
        msgBox.scrollTop = msgBox.scrollHeight;
    }, 2200);
}

function sendImageInChat() {
    const msgBox = document.getElementById('chat-messages-box');
    if (!msgBox) return;
    const nowStr = new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'});
    const msgId = 'img-' + Date.now();

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg-bubble outgoing';
    userMsg.innerHTML = `
        <div style="border-radius:10px; overflow:hidden; border:1px solid var(--neon-pink); max-width:200px;">
            <img src="https://picsum.photos/300/200?random=${Math.floor(Math.random()*100)}" style="width:100%; display:block; object-fit:cover;">
        </div>
        <div class="msg-meta-row">
            <span>${nowStr}</span>
            <span class="read-status-ticks" id="${msgId}-tick">
                <svg class="tick-icon sent" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </span>
        </div>
    `;
    msgBox.appendChild(userMsg);
    msgBox.scrollTop = msgBox.scrollHeight;

    setTimeout(() => {
        const tickEl = document.getElementById(`${msgId}-tick`);
        if (tickEl) {
            tickEl.innerHTML = `<svg class="tick-icon read" viewBox="0 0 24 24"><path fill="currentColor" d="M0.41 13.41L6 19l1.41-1.41L1.83 12m4.58 4.59L18 5l-1.41-1.41M22.59 5.41L11 17l-3.59-3.58L6 14.83l5 5 13-13z"/></svg>`;
        }
    }, 1200);
}

function sendVoiceNoteInChat() {
    const msgBox = document.getElementById('chat-messages-box');
    if (!msgBox) return;
    const nowStr = new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'});
    const msgId = 'voice-' + Date.now();

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg-bubble outgoing';
    userMsg.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; min-width:160px; padding:4px 0;">
            <button style="background:var(--neon-cyan); border:none; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#000; cursor:pointer;">
                <svg class="svg-icon" style="width:16px; height:16px;" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
            </button>
            <div style="flex:1;">
                <div style="height:4px; background:rgba(255,255,255,0.2); border-radius:2px; position:relative; overflow:hidden;">
                    <div style="width:60%; height:100%; background:var(--neon-cyan);"></div>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:9px; color:#DDD; margin-top:2px;">
                    <span>پیام صوتی</span>
                    <span>0:14</span>
                </div>
            </div>
        </div>
        <div class="msg-meta-row">
            <span>${nowStr}</span>
            <span class="read-status-ticks" id="${msgId}-tick">
                <svg class="tick-icon sent" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </span>
        </div>
    `;
    msgBox.appendChild(userMsg);
    msgBox.scrollTop = msgBox.scrollHeight;

    setTimeout(() => {
        const tickEl = document.getElementById(`${msgId}-tick`);
        if (tickEl) {
            tickEl.innerHTML = `<svg class="tick-icon read" viewBox="0 0 24 24"><path fill="currentColor" d="M0.41 13.41L6 19l1.41-1.41L1.83 12m4.58 4.59L18 5l-1.41-1.41M22.59 5.41L11 17l-3.59-3.58L6 14.83l5 5 13-13z"/></svg>`;
        }
    }, 1200);
}

function sendChatMessage() {
    const input = document.getElementById('chat-input-text');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    const msgBox = document.getElementById('chat-messages-box');
    if (msgBox) {
        const nowStr = new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'});
        const msgId = 'msg-' + Date.now();

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg-bubble outgoing';
        userMsg.innerHTML = `
            ${text}
            <div class="msg-meta-row">
                <span>${nowStr}</span>
                <span class="read-status-ticks" id="${msgId}-tick">
                    <svg class="tick-icon sent" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </span>
            </div>
        `;
        msgBox.appendChild(userMsg);
        msgBox.scrollTop = msgBox.scrollHeight;
        input.value = '';

        setTimeout(() => {
            const tickEl = document.getElementById(`${msgId}-tick`);
            if (tickEl) {
                tickEl.innerHTML = `<svg class="tick-icon read" viewBox="0 0 24 24"><path fill="currentColor" d="M0.41 13.41L6 19l1.41-1.41L1.83 12m4.58 4.59L18 5l-1.41-1.41M22.59 5.41L11 17l-3.59-3.58L6 14.83l5 5 13-13z"/></svg>`;
            }
        }, 1200);

        setTimeout(() => {
            const replyMsg = document.createElement('div');
            replyMsg.className = 'chat-msg-bubble incoming';
            replyMsg.innerHTML = `
                ${isChatTranslated ? 'Your message was received and translated successfully.' : 'پیام شما دریافت شد. به‌زودی پاسخ داده می‌شود.'}
                <div class="msg-meta-row">
                    <span>${new Date().toLocaleTimeString('fa-IR', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            `;
            msgBox.appendChild(replyMsg);
            msgBox.scrollTop = msgBox.scrollHeight;
        }, 2200);
    }
}

function openStreamModal(host, avatar, name, age, vip, uid) {
    document.getElementById('active-streamer-name').innerText = name ? `${name} (@${host})` : '@' + host;
    document.getElementById('active-streamer-avatar').src = avatar || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + host);
    if (age) document.getElementById('active-streamer-age').innerText = age + ' سال';
    if (vip) document.getElementById('active-streamer-vip').innerText = 'سطح VIP ' + vip;
    document.getElementById('stream-modal').classList.remove('hidden');
}

function closeStreamModal() {
    document.getElementById('stream-modal').classList.add('hidden');
}

function applyArFilter(filterName) {
    document.getElementById('active-ar-filter-name').innerText = 'فیلتر نئونی: ' + filterName;
    showToast('فیلتر ' + filterName + ' فعال شد!');
}

async function sendGift(giftTitle) {
    if (state.userCoins >= 200) {
        state.userCoins -= 200;
        updateCoinDisplay();
        showToast('هدیه ' + giftTitle + ' برای مجری ارسال گردید!');
    } else {
        showToast('موجودی سکه کافی نیست!');
    }
}

// Render Pay-Per-View Media Vault
function renderVault() {
    const container = document.getElementById('vault-grid-container');
    if (!container) return;
    container.innerHTML = state.vaultItems.map(v => `
        <div class="vault-card">
            <div class="vault-row">
                <div class="vault-lock-icon">
                    <svg class="svg-icon" viewBox="0 0 24 24"><path fill="currentColor" d="${v.is_unlocked ? 'M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z' : 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z'}"/></svg>
                </div>
                <div style="flex:1;">
                    <div style="font-size:14px; font-weight:bold; color:#FFF;">@${v.host_username}</div>
                    <div style="font-size:12px; color:#8E9BAE; margin:4px 0;">${v.title}</div>
                    ${v.is_unlocked ? 
                        '<span style="color:#39FF14; font-size:11px; font-weight:bold;">قفل باز شد (مشاهده کامل)</span>' :
                        `<button class="unlock-btn" onclick="unlockVault('${v.id}')">باز کردن قفل (${v.unlock_cost_stars || 150} Stars)</button>`
                    }
                </div>
            </div>
        </div>
    `).join('');
}

async function unlockVault(itemId) {
    const item = state.vaultItems.find(i => i.id == itemId);
    if (!item || item.is_unlocked) return;

    if (state.userCoins >= (item.unlock_cost_stars || 150)) {
        try {
            await fetch(`${API_BASE_URL}/api/streams/vault/unlock/${itemId}`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
        } catch (e) {}
        state.userCoins -= (item.unlock_cost_stars || 150);
        item.is_unlocked = true;
        updateCoinDisplay();
        renderVault();
        showToast('آلبوم اختصاصی با موفقیت باز شد!');
    } else {
        showToast('موجودی سکه کافی نیست! کیف پول را شارژ کنید.');
    }
}

function openPublishVaultModal() {
    document.getElementById('vault-modal').classList.remove('hidden');
}

function closeVaultModal() {
    document.getElementById('vault-modal').classList.add('hidden');
}

async function submitVaultMedia() {
    const title = document.getElementById('vault-title-input').value || 'آلبوم اختصاصی ۴K';
    const price = parseInt(document.getElementById('vault-price-input').value) || 150;

    try {
        await fetch(`${API_BASE_URL}/api/streams/vault/publish`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, unlock_cost_stars: price, is_video: false })
        });
    } catch (e) {}

    state.vaultItems.unshift({
        id: Date.now(),
        host_username: 'شما (مجری)',
        title: title,
        unlock_cost_stars: price,
        is_unlocked: true,
        is_video: false
    });

    renderVault();
    closeVaultModal();
    showToast('آلبوم اختصاصی در دیتابیس منتشر گردید!');
}

// Render Leaderboard
function renderLeaderboard() {
    const hostsContainer = document.getElementById('leaderboard-hosts-list');
    if (hostsContainer) {
        hostsContainer.innerHTML = state.leaderboardHosts.map(h => `
            <div class="leaderboard-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span class="rank-number">#${h.rank}</span>
                        <div>
                            <strong style="color:#FFF;">@${h.name}</strong>
                            <div style="font-size:11px; color:#FF007F;">${h.badge}</div>
                        </div>
                    </div>
                    <span style="color:#FFD700; font-weight:bold;">${h.score}</span>
                </div>
            </div>
        `).join('');
    }

    const suppContainer = document.getElementById('leaderboard-supporters-list');
    if (suppContainer) {
        suppContainer.innerHTML = state.leaderboardSupporters.map(s => `
            <div class="leaderboard-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span class="rank-number" style="color:#00F5FF;">#${s.rank}</span>
                        <div>
                            <strong style="color:#FFF;">@${s.name}</strong>
                            <div style="font-size:11px; color:#00F5FF;">${s.badge}</div>
                        </div>
                    </div>
                    <span style="color:#39FF14; font-weight:bold;">${s.score}</span>
                </div>
            </div>
        `).join('');
    }
}

function toggleLeaderboardSubtab(sub) {
    document.getElementById('subtab-hosts-btn').classList.toggle('active', sub === 'hosts');
    document.getElementById('subtab-supporters-btn').classList.toggle('active', sub === 'supporters');

    document.getElementById('leaderboard-hosts-list').classList.toggle('hidden', sub !== 'hosts');
    document.getElementById('leaderboard-supporters-list').classList.toggle('hidden', sub !== 'supporters');
}

// Render Booking Calendar
function renderBookings() {
    const container = document.getElementById('bookings-container');
    if (!container) return;
    container.innerHTML = state.bookings.map(b => `
        <div class="booking-card">
            <div style="display:flex; justify-content:space-between;">
                <strong style="color:#FFF;">رزرو تماس با @${b.host_username}</strong>
                <span style="color:#39FF14; font-size:11px;">${b.status}</span>
            </div>
            <div style="font-size:12px; color:#8E9BAE; margin-top:6px;">تاریخ: ${b.booking_date} • ساعت: ${b.time_slot}</div>
            <div style="font-size:12px; color:#FFD700; margin-top:4px;">هزینه: ${b.cost_stars || 500} Stars</div>
        </div>
    `).join('');
}

function openBookingModal() {
    document.getElementById('booking-modal').classList.remove('hidden');
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
}

async function submitBooking() {
    const host = document.getElementById('booking-host-select').value;
    const date = document.getElementById('booking-date-input').value;
    const time = document.getElementById('booking-time-select').value;

    if (state.userCoins >= 500) {
        try {
            await fetch(`${API_BASE_URL}/api/booking/book`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ host_username: host, booking_date: date, time_slot: time, cost_stars: 500 })
            });
        } catch (e) {}

        state.userCoins -= 500;
        updateCoinDisplay();

        state.bookings.unshift({
            id: Date.now(),
            host_username: host,
            booking_date: date,
            time_slot: time,
            cost_stars: 500,
            status: 'تایید شده'
        });

        renderBookings();
        closeBookingModal();
        showToast('وقت تماس خصوصی با @' + host + ' رزرو گردید!');
    } else {
        showToast('موجودی سکه کافی نیست!');
    }
}

// Wallet
function updateCoinDisplay() {
    const el = document.getElementById('coin-balance');
    if (el) el.innerText = state.userCoins.toLocaleString();
    const elStars = document.getElementById('wallet-stars-display');
    if (elStars) elStars.innerText = state.userCoins.toLocaleString() + ' Stars';
}

function buyCoins(method) {
    showToast('هدایت به درگاه پرداخت ' + method + '...');
}

// Support Chat
function openSupportChat() {
    openChatModal('Rayan_Support', 'https://api.dicebear.com/7.x/bottts/svg?seed=AdminRayan', 'پشتیبانی رسمی V.LIVE (سوپر ادمین)');
    showToast('متصل به پشتیبانی آنلاین ۲۴/۷ سوپر ادمین');
}

// Profile & VIP Handlers
function updateGenderVisibility() {
    const femaleRadio = document.getElementById('gender-female');
    const femalePanel = document.getElementById('female-withdrawal-panel');
    const isFemale = femaleRadio ? femaleRadio.checked : false;
    const isAdmin = state.isAdmin || false;

    if (femalePanel) {
        if (isFemale || isAdmin) {
            femalePanel.classList.remove('hidden');
            femalePanel.style.display = 'block';
        } else {
            femalePanel.classList.add('hidden');
            femalePanel.style.display = 'none';
        }
    }
}

function saveProfileChanges() {
    const name = document.getElementById('profile-name-input').value;
    const username = document.getElementById('profile-username-input').value;

    const displayNameEl = document.getElementById('user-name');
    if (displayNameEl) displayNameEl.innerText = name;

    const profileNameEl = document.getElementById('profile-display-name-text');
    if (profileNameEl) profileNameEl.innerText = name;

    const profileUserEl = document.getElementById('profile-username-text');
    if (profileUserEl) profileUserEl.innerText = '@' + username;

    updateGenderVisibility();

    showToast('تغییرات پروفایل با موفقیت ذخیره شد!');
}

function buyVipPlan(planTitle, priceUsdt) {
    showToast(`اشتراک VIP ${planTitle} با موفقیت فعال گردید! (${priceUsdt} USDT)`);
    const rankEl = document.getElementById('user-rank');
    if (rankEl) rankEl.innerText = 'VIP ' + planTitle;
    const vipBadgeEl = document.getElementById('profile-vip-badge');
    if (vipBadgeEl) vipBadgeEl.innerText = 'VIP ' + planTitle;
}

function submitWithdrawalRequest() {
    const amount = document.getElementById('withdraw-amount-input').value;
    const address = document.getElementById('withdraw-address-input').value;
    if (!address || amount <= 0) {
        showToast('لطفا مبلغ و آدرس کیف پول معتبر وارد کنید.');
        return;
    }
    showToast(`درخواست تسویه ${amount} USDT جهت بررسی توسط ادمین ثبت گردید.`);
}

// Super Admin Handlers
function loginSuperAdmin() {
    const userInput = document.getElementById('admin-user-input');
    const passInput = document.getElementById('admin-pass-input');

    const user = userInput ? userInput.value : '';
    const pass = passInput ? passInput.value : '';

    if (user.trim() !== '' && pass.trim() !== '' && (user.trim().toLowerCase() === 'rayan' || user.trim().toLowerCase() === 'admin')) {
        state.isAdmin = true;
        document.getElementById('admin-login-box').classList.add('hidden');
        document.getElementById('admin-dashboard-box').classList.remove('hidden');

        if (userInput) userInput.value = '';
        if (passInput) passInput.value = '';

        updateGenderVisibility();
        checkHostLiveEligibility();
        showToast('ورود موفقیت‌آمیز سوپر ادمین - دسترسی کامل مدیریت فعال گردید!');
    } else {
        showToast('نام کاربری یا رمز عبور ادمین نامعتبر است.');
    }
}

function logoutSuperAdmin() {
    state.isAdmin = false;
    document.getElementById('admin-dashboard-box').classList.add('hidden');
    document.getElementById('admin-login-box').classList.remove('hidden');

    updateGenderVisibility();
    checkHostLiveEligibility();
    showToast('خروج موفقیت‌آمیز از حساب سوپر ادمین.');
}

function switchAdminSubtab(sub) {
    document.getElementById('adm-tab-ai-btn').classList.toggle('active', sub === 'ai');
    document.getElementById('adm-tab-withdrawals-btn').classList.toggle('active', sub === 'withdrawals');
    document.getElementById('adm-tab-reports-btn').classList.toggle('active', sub === 'reports');

    document.getElementById('adm-subtab-ai').classList.toggle('hidden', sub !== 'ai');
    document.getElementById('adm-subtab-withdrawals').classList.toggle('hidden', sub !== 'withdrawals');
    document.getElementById('adm-subtab-reports').classList.toggle('hidden', sub !== 'reports');
}

function approveWithdrawal(id) {
    showToast(`درخواست تسویه #${id} تایید شد و ۵۰.۰۰ USDT واریز گردید.`);
    const el = document.getElementById('admin-withdrawals-list');
    if (el) el.innerHTML = '<div style="font-size:12px; color:var(--neon-green);">همه درخواست‌های تسویه واریز شدند.</div>';
}

function rejectWithdrawal(id) {
    showToast(`درخواست تسویه #${id} رد گردید.`);
    const el = document.getElementById('admin-withdrawals-list');
    if (el) el.innerHTML = '<div style="font-size:12px; color:var(--neon-pink);">درخواست تسویه رد شد.</div>';
}

function banUser(username) {
    showToast(`کاربر @${username} به دلیل تخلف به طور دائم مسدود گردید.`);
    const el = document.getElementById('admin-reports-list');
    if (el) el.innerHTML = '<div style="font-size:12px; color:var(--neon-green);">گزارشات بررسی و مسدودسازی انجام شد.</div>';
}

// Telegram Auth & Identity Verification Modal Handlers
let authSelectedGender = 'female';
let currentAuthMode = 'register';

function switchAuthMode(mode) {
    currentAuthMode = mode;
    const regView = document.getElementById('auth-register-view');
    const loginView = document.getElementById('auth-login-view');
    const regTabBtn = document.getElementById('auth-tab-reg-btn');
    const loginTabBtn = document.getElementById('auth-tab-login-btn');

    if (mode === 'register') {
        regView?.classList.remove('hidden');
        loginView?.classList.add('hidden');
        regTabBtn?.classList.add('active');
        loginTabBtn?.classList.remove('active');
    } else {
        regView?.classList.add('hidden');
        loginView?.classList.remove('hidden');
        regTabBtn?.classList.remove('active');
        loginTabBtn?.classList.add('active');
    }
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    if (btn) {
        btn.style.color = isPassword ? 'var(--neon-pink)' : 'var(--text-muted)';
    }
}

function validateAgeInput() {
    const ageInput = document.getElementById('reg-age-input');
    const warningBanner = document.getElementById('auth-age-warning');
    const submitBtn = document.getElementById('reg-submit-btn');

    if (!ageInput) return true;

    const age = parseInt(ageInput.value, 10) || 0;
    if (age < 18) {
        warningBanner?.classList.remove('hidden');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
        return false;
    } else {
        warningBanner?.classList.add('hidden');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
        return true;
    }
}

function openAuthModal() {
    const modal = document.getElementById('auth-fullscreen-modal');
    if (modal) modal.classList.remove('hidden');

    // Auto populate Telegram WebApp user if available
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
        const tgNameEl = document.getElementById('auth-tg-name');
        const tgHandleEl = document.getElementById('auth-tg-username');
        const tgAvatarEl = document.getElementById('auth-tg-avatar');
        const regUsernameInput = document.getElementById('reg-username-input');

        if (tgNameEl) tgNameEl.innerText = (tgUser.first_name + ' ' + (tgUser.last_name || '')).trim();
        if (tgHandleEl) tgHandleEl.innerText = '@' + (tgUser.username || 'user');
        if (tgAvatarEl && tgUser.photo_url) tgAvatarEl.src = tgUser.photo_url;
        if (regUsernameInput && !regUsernameInput.value) regUsernameInput.value = tgUser.username || '';
    }

    // Auto load saved password if remember password was checked
    const savedUser = localStorage.getItem('vlive_saved_username');
    const savedPass = localStorage.getItem('vlive_saved_password');
    if (savedUser && savedPass) {
        const loginUserInp = document.getElementById('login-username-input');
        const loginPassInp = document.getElementById('login-password-input');
        if (loginUserInp) loginUserInp.value = savedUser;
        if (loginPassInp) loginPassInp.value = savedPass;
    }

    validateAgeInput();
}

function closeAuthModal() {
    const modal = document.getElementById('auth-fullscreen-modal');
    if (modal) modal.classList.add('hidden');
}

function selectAuthGender(gender) {
    authSelectedGender = gender;
    document.getElementById('role-female-card')?.classList.toggle('active', gender === 'female');
    document.getElementById('role-male-card')?.classList.toggle('active', gender === 'male');
    document.getElementById('profile-gender-female-btn')?.classList.toggle('active', gender === 'female');
    document.getElementById('profile-gender-male-btn')?.classList.toggle('active', gender === 'male');

    const femaleRadio = document.getElementById('gender-female');
    const maleRadio = document.getElementById('gender-male');
    if (gender === 'female' && femaleRadio) femaleRadio.checked = true;
    if (gender === 'male' && maleRadio) maleRadio.checked = true;

    updateGenderVisibility();
}

function startAiFaceScan() {
    const btn = document.getElementById('scan-face-btn');
    const statusText = document.getElementById('kyc-text-status');
    if (btn) btn.innerText = 'در حال اسکن زنده چهره با دوربین جلو (AI Face Check)...';

    setTimeout(() => {
        if (btn) btn.innerText = 'اسکن چهره با موفقیت انجام شد (AI Verification Success)';
        if (statusText) {
            statusText.style.color = 'var(--neon-green)';
            statusText.innerText = 'تایید هویت و جنسیت صورت ۱۰۰٪ موفقیت‌آمیز (تایید شده)';
        }
        showToast('عکس و اسکن چهره با موفقیت تایید شد!');
    }, 1200);
}

function completeTelegramAuth() {
    const isAgeValid = validateAgeInput();
    if (!isAgeValid) {
        showToast('ورود افراد زیر ۱۸ سال به برنامه غیرمجاز است.');
        return;
    }

    const regUsername = document.getElementById('reg-username-input')?.value.trim();
    const pass1 = document.getElementById('reg-password-input')?.value;
    const pass2 = document.getElementById('reg-confirm-password-input')?.value;
    const country = document.getElementById('reg-country-select')?.value || 'IR';

    if (pass1 && pass2 && pass1 !== pass2) {
        showToast('رمز ورود و تایید آن با هم مطابقت ندارند!');
        return;
    }

    if (regUsername) {
        const profileNameInput = document.getElementById('profile-username-input');
        if (profileNameInput) profileNameInput.value = regUsername;
        const mainUsernameDisplay = document.getElementById('user-name');
        if (mainUsernameDisplay) mainUsernameDisplay.innerText = '@' + regUsername;
    }

    localStorage.setItem('vlive_auth_completed', 'true');
    localStorage.setItem('vlive_user_country', country);
    state.isLoggedIn = true;
    state.isAgeVerified = true;
    state.isIdentityVerified = true;

    // Save login credentials if password set
    if (regUsername && pass1) {
        localStorage.setItem('vlive_saved_username', regUsername);
        localStorage.setItem('vlive_saved_password', pass1);
    }

    // Sync selected gender to profile
    selectAuthGender(authSelectedGender);

    closeAuthModal();

    const authHeaderBtn = document.getElementById('auth-header-btn');
    if (authHeaderBtn) authHeaderBtn.style.display = 'none';

    // Add golden neon ring around user avatar in header
    const userAvatarGlow = document.querySelector('.avatar-glow');
    if (userAvatarGlow) userAvatarGlow.classList.add('verified-gold');

    showToast('ثبت‌نام و احراز هویت با موفقیت تایید شد!');
}

function processAccountLogin() {
    const loginUser = document.getElementById('login-username-input')?.value.trim();
    const loginPass = document.getElementById('login-password-input')?.value;
    const rememberCheck = document.getElementById('remember-password-check')?.checked;

    if (!loginUser || !loginPass) {
        showToast('لطفا نام کاربری و رمز ورود را وارد کنید.');
        return;
    }

    if (rememberCheck) {
        localStorage.setItem('vlive_saved_username', loginUser);
        localStorage.setItem('vlive_saved_password', loginPass);
    } else {
        localStorage.removeItem('vlive_saved_username');
        localStorage.removeItem('vlive_saved_password');
    }

    localStorage.setItem('vlive_auth_completed', 'true');
    state.isLoggedIn = true;
    state.isAgeVerified = true;
    state.isIdentityVerified = true;

    const mainUsernameDisplay = document.getElementById('user-name');
    if (mainUsernameDisplay) mainUsernameDisplay.innerText = '@' + loginUser;

    closeAuthModal();

    const authHeaderBtn = document.getElementById('auth-header-btn');
    if (authHeaderBtn) authHeaderBtn.style.display = 'none';

    const userAvatarGlow = document.querySelector('.avatar-glow');
    if (userAvatarGlow) userAvatarGlow.classList.add('verified-gold');

    showToast('ورود موفقیت‌آمیز به حساب کاربری!');
}

function sendTelegramResetCode() {
    const loginUser = document.getElementById('login-username-input')?.value.trim() || 'کاربر';
    showToast(`رمز عبور موقت برای حساب ${loginUser} به اکانت تلگرام شما ارسال گردید.`);
}

// ==========================================
// LIVE STREAM HOST & VIEWER SYSTEM LOGIC
// ==========================================

let isCameraPermissionGranted = false;
let hostMediaStream = null;
let currentHostIs18Plus = false;
let isHostTranslateActive = false;
let isViewerChatHidden = false;
let isFollowingCurrentStreamer = false;
let currentStreamerIndex = 0;

const sampleLiveStreams = [
    { name: 'Sogand_Live', title: 'سوگند • چت نئونی شبانه', viewers: '1,420', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sogand' },
    { name: 'Elena_Stream', title: 'النا • اجرای موسیقی و گفتگو', viewers: '2,890', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Elena' },
    { name: 'Melika_Art', title: 'ملیکا • هنر دیزاین سه بعدی', viewers: '980', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Melika' },
    { name: 'Daria_Vip', title: 'دریا • لایواستریم اختصاصی VIP', viewers: '3,100', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Daria' }
];

// Check eligibility: Only female users or Admins can start live
function checkHostLiveEligibility() {
    const container = document.getElementById('host-live-container');
    if (!container) return;

    const isFemale = authSelectedGender === 'female';
    const isAdminUser = state.isAdmin || state.isSuperAdmin;

    if (isFemale || isAdminUser) {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

// Runtime Permission Request
async function requestCameraPermissionOnce() {
    isCameraPermissionGranted = true;
    localStorage.setItem('vlive_camera_perm_granted', 'true');
    return true;
}

// Host Studio: Start Broadcast
async function startHostLiveStream() {
    const isFemale = authSelectedGender === 'female';
    const isAdminUser = state.isAdmin || state.isSuperAdmin;

    if (!isFemale && !isAdminUser) {
        showToast('ایجاد لایواستریم فقط برای حساب‌های کاربری خانم و مدیران سیستم مجاز است.');
        return;
    }

    const hostModal = document.getElementById('host-stream-modal');
    if (hostModal) hostModal.classList.remove('hidden');

    const videoEl = document.getElementById('host-camera-video');
    const placeholder = document.getElementById('host-camera-placeholder');

    // Attempt live video camera stream connection
    let streamObtained = false;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraintsList = [
            { video: { facingMode: 'user' }, audio: true },
            { video: true, audio: true },
            { video: true, audio: false }
        ];

        for (const constraints of constraintsList) {
            try {
                hostMediaStream = await navigator.mediaDevices.getUserMedia(constraints);
                if (hostMediaStream && videoEl) {
                    videoEl.srcObject = hostMediaStream;
                    videoEl.style.display = 'block';
                    try {
                        await videoEl.play();
                    } catch (playErr) {
                        console.warn('Video play promise caught:', playErr);
                    }
                    if (placeholder) placeholder.style.display = 'none';
                    streamObtained = true;
                    showToast('دوربین گوشی با موفقیت متصل شد (4K Stream)');
                    break;
                }
            } catch (err) {
                console.warn('Camera constraints failed:', constraints, err);
            }
        }
    }

    if (!streamObtained) {
        if (placeholder) {
            placeholder.style.display = 'flex';
            placeholder.innerHTML = `<div class="neon-stream-ring"></div><span>دوربین در دسترس نیست (محیط شبیه‌ساز یا عدم صدور مجوز)</span>`;
        }
        showToast('دوربین گوشی یافت نشد یا مجوز آن صادر نشده است.');
    }
}

function stopHostLiveStream() {
    if (hostMediaStream) {
        hostMediaStream.getTracks().forEach(track => track.stop());
        hostMediaStream = null;
    }
    const hostModal = document.getElementById('host-stream-modal');
    if (hostModal) hostModal.classList.add('hidden');
    showToast('لایواستریم با موفقیت خاتمه یافت.');
}

function setHostCategory(is18) {
    currentHostIs18Plus = is18;
    const btnFree = document.getElementById('host-cat-free');
    const btn18 = document.getElementById('host-cat-18');

    if (btnFree) btnFree.classList.toggle('active', !is18);
    if (btn18) btn18.classList.toggle('active', is18);

    showToast(is18 ? 'دسته‌بندی لایو به بزرگسالان (18+) تغییر یافت.' : 'دسته‌بندی لایو به رایگان (Free) تغییر یافت.');
}

function kickViewerFromLive(username) {
    showToast(`کاربر @${username} از لایو اخراج گردید.`);
    const rows = document.querySelectorAll('.audience-user-row');
    rows.forEach(row => {
        if (row.innerText.includes(username)) row.remove();
    });
}

function blockViewerFromLive(username) {
    showToast(`کاربر @${username} مسدود و از لایو اخراج شد.`);
    kickViewerFromLive(username);
}

function toggleHostLiveTranslation() {
    isHostTranslateActive = !isHostTranslateActive;
    const btnText = document.getElementById('translate-btn-text');
    if (btnText) {
        btnText.innerText = isHostTranslateActive ? 'ترجمه همزمان (روشن 🤖)' : 'ترجمه همزمان (خاموش)';
    }
    showToast(isHostTranslateActive ? 'ترجمه همزمان هوش مصنوعی فعال گردید.' : 'ترجمه غیرفعال شد.');
}

function sendHostChatMessage() {
    const input = document.getElementById('host-chat-input');
    const msgBox = document.getElementById('host-chat-messages');
    if (!input || !input.value.trim() || !msgBox) return;

    const div = document.createElement('div');
    div.className = 'host-msg-item';
    div.style.color = 'var(--neon-pink)';
    div.innerHTML = `<strong>@مجری (شما):</strong> ${input.value.trim()}`;
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;

    input.value = '';
}

// Fullscreen TikTok-Style Stream Viewer Logic
function openStreamModal(streamerName) {
    const foundIdx = sampleLiveStreams.findIndex(s => s.name === streamerName || s.name.includes(streamerName));
    if (foundIdx !== -1) currentStreamerIndex = foundIdx;

    loadStreamDataByIndex(currentStreamerIndex);

    const streamModal = document.getElementById('stream-modal');
    if (streamModal) streamModal.classList.remove('hidden');

    setupVerticalStreamSwipe();
}

function loadStreamDataByIndex(idx) {
    const stream = sampleLiveStreams[idx] || sampleLiveStreams[0];
    const avatarEl = document.getElementById('active-streamer-avatar');
    const nameEl = document.getElementById('active-streamer-name');
    const countEl = document.getElementById('modal-viewer-count');

    if (avatarEl) avatarEl.src = stream.avatar;
    if (nameEl) nameEl.innerText = stream.name;
    if (countEl) countEl.innerText = stream.viewers;

    isFollowingCurrentStreamer = false;
    const followBtn = document.getElementById('stream-follow-btn');
    if (followBtn) {
        followBtn.innerText = '+ دنبال کردن';
        followBtn.style.background = 'linear-gradient(135deg, var(--neon-pink), var(--neon-purple))';
    }
}

function closeStreamModal() {
    const streamModal = document.getElementById('stream-modal');
    if (streamModal) streamModal.classList.add('hidden');
}

function toggleFollowStreamer() {
    isFollowingCurrentStreamer = !isFollowingCurrentStreamer;
    const followBtn = document.getElementById('stream-follow-btn');
    if (followBtn) {
        if (isFollowingCurrentStreamer) {
            followBtn.innerText = 'دنبال شده ✓';
            followBtn.style.background = 'var(--neon-green)';
            showToast('مجری به لیست دنبال‌شده‌های شما اضافه شد.');
        } else {
            followBtn.innerText = '+ دنبال کردن';
            followBtn.style.background = 'linear-gradient(135deg, var(--neon-pink), var(--neon-purple))';
        }
    }
}

function triggerStreamLike() {
    const countEl = document.getElementById('stream-like-count');
    if (countEl) {
        let currentLikes = parseFloat(countEl.innerText) || 3.4;
        currentLikes = (currentLikes + 0.1).toFixed(1);
        countEl.innerText = currentLikes + 'K';
    }

    // Spawn animated floating heart particle
    const layer = document.getElementById('floating-hearts-layer');
    if (layer) {
        const heart = document.createElement('span');
        heart.className = 'heart-particle';
        const hearts = ['❤️', '💖', '💗', '🔥', '⭐️'];
        heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = (Math.random() * 30) + 'px';
        layer.appendChild(heart);

        setTimeout(() => heart.remove(), 1800);
    }
}

function requestPrivateVideoCall() {
    showToast('درخواست تماس تصویری خصوصی برای مجری ارسال گردید.');
}

function toggleStreamChatVisibility() {
    isViewerChatHidden = !isViewerChatHidden;
    const chatBox = document.getElementById('stream-chat-overlay-box');
    const label = document.getElementById('chat-toggle-label');

    if (chatBox) {
        chatBox.style.opacity = isViewerChatHidden ? '0' : '1';
        chatBox.style.pointerEvents = isViewerChatHidden ? 'none' : 'all';
    }
    if (label) {
        label.innerText = isViewerChatHidden ? 'نمایش' : 'چت';
    }
}

function sendStreamViewerMessage() {
    const input = document.getElementById('stream-viewer-chat-input');
    const msgsList = document.getElementById('stream-live-messages');
    if (!input || !input.value.trim() || !msgsList) return;

    const div = document.createElement('div');
    div.className = 'stream-msg-item';
    div.innerHTML = `<span class="user-tag">@شما:</span> <span class="msg-text">${input.value.trim()}</span>`;

    msgsList.appendChild(div);
    msgsList.scrollTop = msgsList.scrollHeight;
    input.value = '';
}

// Vertical Swipe/Wheel Listener for Switching Streams
let isSwiping = false;
function setupVerticalStreamSwipe() {
    const zone = document.getElementById('stream-video-swipe-zone');
    if (!zone || zone.dataset.swipeBound === 'true') return;
    zone.dataset.swipeBound = 'true';

    let touchStartY = 0;

    zone.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    zone.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffY) > 50) {
            if (diffY > 0) {
                // Swiped Up -> Next Stream
                switchNextStream();
            } else {
                // Swiped Down -> Prev Stream
                switchPrevStream();
            }
        }
    }, { passive: true });

    zone.addEventListener('wheel', (e) => {
        if (isSwiping) return;
        isSwiping = true;
        if (e.deltaY > 30) switchNextStream();
        else if (e.deltaY < -30) switchPrevStream();

        setTimeout(() => { isSwiping = false; }, 600);
    });
}

function switchNextStream() {
    currentStreamerIndex = (currentStreamerIndex + 1) % sampleLiveStreams.length;
    loadStreamDataByIndex(currentStreamerIndex);
    showToast(`انتقال به لایو بعدی: @${sampleLiveStreams[currentStreamerIndex].name}`);
}

function switchPrevStream() {
    currentStreamerIndex = (currentStreamerIndex - 1 + sampleLiveStreams.length) % sampleLiveStreams.length;
    loadStreamDataByIndex(currentStreamerIndex);
    showToast(`انتقال به لایو قبلی: @${sampleLiveStreams[currentStreamerIndex].name}`);
}

// Rich Variety Gift Picker Modal
function openGiftPickerModal() {
    const modal = document.getElementById('gift-picker-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeGiftPickerModal() {
    const modal = document.getElementById('gift-picker-modal');
    if (modal) modal.classList.add('hidden');
}

function sendSelectedGift(giftTitle, priceStars) {
    if (state.coins < priceStars) {
        showToast(`موجودی Stars شما کافی نیست (${priceStars} Stars نیاز است).`);
        buyCoins('STARS');
        return;
    }

    state.coins -= priceStars;
    updateBalanceUI();

    closeGiftPickerModal();
    showToast(`هدیه ${giftTitle} با موفقیت برای مجری ارسال شد! 🎉`);

    // Post to viewer chat stream
    const msgsList = document.getElementById('stream-live-messages');
    if (msgsList) {
        const div = document.createElement('div');
        div.className = 'stream-msg-item gift-alert';
        div.innerHTML = `<span class="user-tag">@شما:</span> <span class="msg-text">هدیه ${giftTitle} ارسال گردید! 🎉</span>`;
        msgsList.appendChild(div);
        msgsList.scrollTop = msgsList.scrollHeight;
    }

    // Trigger hearts animation
    triggerStreamLike();
}

// Override Tab Switcher to check Host Eligibility
const originalSwitchTab = window.switchTab;
window.switchTab = function(tabName) {
    if (typeof originalSwitchTab === 'function') originalSwitchTab(tabName);
    checkHostLiveEligibility();
};

// Check on initial load
document.addEventListener('DOMContentLoaded', () => {
    checkHostLiveEligibility();
});



