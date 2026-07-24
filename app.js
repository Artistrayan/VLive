// Telegram WebApp Initialization
let tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

// State
let state = {
    userCoins: 1250,
    streams: [
        { id: 'str_1', host: 'Sogand_Live', title: 'استودیو چت VIP و اجرای نئونی 4K', viewers: 1840, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sogand' },
        { id: 'str_2', host: 'Elena_Stream', title: 'گفتگوی خصوصی و پاسخ به سوالات حامیان', viewers: 1210, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
        { id: 'str_3', host: 'Sara_Vip', title: 'لایو موسیقی و رقص نور نئونی 💃', viewers: 950, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara' }
    ],
    vaultItems: [
        { id: 'vault_1', host: 'Sogand_Live', title: 'آلبوم اختصاصی ۴K نئونی استودیو', cost: 150, unlocked: false, isVideo: false },
        { id: 'vault_2', host: 'Elena_Stream', title: 'ویدئوی اختصاصی پشت صحنه VIP', cost: 300, unlocked: false, isVideo: true }
    ],
    leaderboardHosts: [
        { rank: 1, name: 'Sogand_Live', badge: 'Golden Queen 👑', score: '45,200 Stars' },
        { rank: 2, name: 'Elena_Stream', badge: 'Neon Goddess ✨', score: '38,900 Stars' },
        { rank: 3, name: 'Sara_Vip', badge: 'Silver Host 💎', score: '29,400 Stars' }
    ],
    leaderboardSupporters: [
        { rank: 1, name: 'Whale_King_99', badge: 'Diamond Donor 💎', score: '125,000 Stars' },
        { rank: 2, name: 'Crypto_Lord', badge: 'Golden Whale 🐋', score: '98,000 Stars' }
    ],
    bookings: [
        { id: 'b_1', host: 'Sogand_Live', date: '2026-07-25', time: '22:00 - 22:30', cost: 500, status: 'CONFIRMED ✅' }
    ]
};

// On Document Load
document.addEventListener('DOMContentLoaded', () => {
    initTelegramUser();
    renderStreams();
    renderVault();
    renderLeaderboard();
    renderBookings();
});

function initTelegramUser() {
    if (tg?.initDataUnsafe?.user) {
        const u = tg.initDataUnsafe.user;
        document.getElementById('user-name').innerText = u.first_name + (u.last_name ? ' ' + u.last_name : '');
        if (u.photo_url) {
            document.getElementById('user-avatar').src = u.photo_url;
        }
    }
}

// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`tab-${tabId}`).classList.add('active');
    event.currentTarget?.classList?.add('active');
}

// Toast
function showToast(msg) {
    const toast = document.getElementById('toast-notification');
    toast.innerText = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// 1. Render Live Streams
function renderStreams() {
    const container = document.getElementById('stream-grid-container');
    container.innerHTML = state.streams.map(s => `
        <div class="stream-card">
            <div class="stream-header">
                <div class="streamer-info-row">
                    <img src="${s.avatar}" alt="${s.host}">
                    <div>
                        <strong style="color:#FFF;">@${s.host}</strong>
                        <div style="font-size:11px; color:#00F5FF;">👁️ ${s.viewers} بیننده</div>
                    </div>
                </div>
            </div>
            <p class="stream-title">${s.title}</p>
            <button class="join-live-btn" onclick="openStreamModal('${s.host}', '${s.avatar}')">▶ ورود به لایو استریم</button>
        </div>
    `).join('');
}

function openStreamModal(host, avatar) {
    document.getElementById('active-streamer-name').innerText = '@' + host;
    document.getElementById('active-streamer-avatar').src = avatar;
    document.getElementById('stream-modal').classList.remove('hidden');
}

function closeStreamModal() {
    document.getElementById('stream-modal').classList.add('hidden');
}

function applyArFilter(filterName) {
    document.getElementById('active-ar-filter-name').innerText = '✨ فیلتر نئونی: ' + filterName;
    showToast('فیلتر ' + filterName + ' فعال شد!');
}

function sendGift(giftTitle) {
    if (state.userCoins >= 200) {
        state.userCoins -= 200;
        updateCoinDisplay();
        showToast('هدیه ' + giftTitle + ' برای مجری ارسال گردید!');
    } else {
        showToast('موجودی سکه کافی نیست!');
    }
}

// 2. Render Pay-Per-View Media Vault
function renderVault() {
    const container = document.getElementById('vault-grid-container');
    container.innerHTML = state.vaultItems.map(v => `
        <div class="vault-card">
            <div class="vault-row">
                <div class="vault-lock-icon">${v.unlocked ? '🔓' : '🔒'}</div>
                <div style="flex:1;">
                    <div style="font-size:14px; font-weight:bold; color:#FFF;">@${v.host}</div>
                    <div style="font-size:12px; color:#8E9BAE; margin:4px 0;">${v.title}</div>
                    ${v.unlocked ? 
                        '<span style="color:#39FF14; font-size:11px; font-weight:bold;">✅ قفل باز شد (مشاهده کامل)</span>' :
                        `<button class="unlock-btn" onclick="unlockVault('${v.id}')">باز کردن قفل (${v.cost} Stars ⭐)</button>`
                    }
                </div>
            </div>
        </div>
    `).join('');
}

function unlockVault(itemId) {
    const item = state.vaultItems.find(i => i.id === itemId);
    if (!item || item.unlocked) return;

    if (state.userCoins >= item.cost) {
        state.userCoins -= item.cost;
        item.unlocked = true;
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

function submitVaultMedia() {
    const title = document.getElementById('vault-title-input').value || 'آلبوم اختصاصی ۴K';
    const price = parseInt(document.getElementById('vault-price-input').value) || 150;

    state.vaultItems.unshift({
        id: 'vault_' + Date.now(),
        host: 'شما (مجری)',
        title: title,
        cost: price,
        unlocked: true,
        isVideo: false
    });

    renderVault();
    closeVaultModal();
    showToast('آلبوم اختصاصی در قفل منتشر شد!');
}

// 3. Render Leaderboard
function renderLeaderboard() {
    const hostsContainer = document.getElementById('leaderboard-hosts-list');
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

    const suppContainer = document.getElementById('leaderboard-supporters-list');
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

function toggleLeaderboardSubtab(sub) {
    document.getElementById('subtab-hosts-btn').classList.toggle('active', sub === 'hosts');
    document.getElementById('subtab-supporters-btn').classList.toggle('active', sub === 'supporters');

    document.getElementById('leaderboard-hosts-list').classList.toggle('hidden', sub !== 'hosts');
    document.getElementById('leaderboard-supporters-list').classList.toggle('hidden', sub !== 'supporters');
}

// 4. Render Booking Calendar
function renderBookings() {
    const container = document.getElementById('bookings-container');
    container.innerHTML = state.bookings.map(b => `
        <div class="booking-card">
            <div style="display:flex; justify-content:space-between;">
                <strong style="color:#FFF;">رزرو تماس با @${b.host}</strong>
                <span style="color:#39FF14; font-size:11px;">${b.status}</span>
            </div>
            <div style="font-size:12px; color:#8E9BAE; margin-top:6px;">📅 تاریخ: ${b.date} • ⏰ ساعت: ${b.time}</div>
            <div style="font-size:12px; color:#FFD700; margin-top:4px;">هزینه: ${b.cost} Stars ⭐</div>
        </div>
    `).join('');
}

function openBookingModal() {
    document.getElementById('booking-modal').classList.remove('hidden');
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.add('hidden');
}

function submitBooking() {
    const host = document.getElementById('booking-host-select').value;
    const date = document.getElementById('booking-date-input').value;
    const time = document.getElementById('booking-time-select').value;

    if (state.userCoins >= 500) {
        state.userCoins -= 500;
        updateCoinDisplay();

        state.bookings.unshift({
            id: 'b_' + Date.now(),
            host: host,
            date: date,
            time: time,
            cost: 500,
            status: 'CONFIRMED ✅'
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
    document.getElementById('coin-balance').innerText = state.userCoins.toLocaleString();
}

function buyCoins(method) {
    showToast('هدایت به درگاه پرداخت ' + method + '...');
}
