const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Define the block to move
const targetBlock = `  // Telegram WebApp Auto Ready & One-Touch Authentication (ورود کاملا خودکار با تلگرام)
  useEffect(() => {
    async function initAuth() {
      try {
        const tgApp = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
        if (tgApp) {
          if (typeof tgApp.ready === 'function') tgApp.ready();
          if (typeof tgApp.expand === 'function') tgApp.expand();
          
          // Auto detect Telegram user profile if launched inside Telegram
          const tgUser = tgApp.initDataUnsafe?.user;
          if (tgUser) {
            const fullTgName = tgUser.first_name ? \`\${tgUser.first_name} \${tgUser.last_name || ''}\`.trim() : (tgUser.username || 'Telegram User');
            const tgUsername = tgUser.username || \`tg_\${tgUser.id}\`;
            const tgPhoto = tgUser.photo_url || userAvatar;
            const tgIdStr = String(tgUser.id);
            setUserName(fullTgName);
            setCurrentUsername(tgUsername);
            setAuthFullName(fullTgName);
            setAuthUsername(tgUsername);
            setAuthTelegramId(tgIdStr);
            setCurrentTelegramId(tgIdStr);
            if (tgIdStr === '8933698119') {
              setUserRole('admin');
            }
            if (tgPhoto) setUserAvatar(tgPhoto);
          }
        }

        // Attempt automatic Telegram login via backend API or session token
        const initData = window.Telegram?.WebApp?.initData || '';
        const alreadyLoggedIn = safeStorage.getItem('vlive_user_logged_in') === 'true';
        if (initData || tgApp?.initDataUnsafe?.user || getStoredToken() || alreadyLoggedIn) {
          const authRes = await apiAuth.loginWithTelegram(initData);
          if (authRes && authRes.user) {
            const u = authRes.user;
            setUserName(u.first_name ? \`\${u.first_name} \${u.last_name || ''}\`.trim() : (u.name || u.username));
            setCurrentUsername(u.username);
            if (u.wallet_stars) setUserCoins(u.wallet_stars);
            if (u.avatar_url || u.avatar) setUserAvatar(u.avatar_url || u.avatar);
            if (u.telegram_id) {
              const tgIdStr = String(u.telegram_id);
              setCurrentTelegramId(tgIdStr);
              setAuthTelegramId(tgIdStr);
              if (tgIdStr === '8933698119') {
                setUserRole('admin');
              } else if (u.role) {
                setUserRole(u.role);
              }
            } else if (tgApp?.initDataUnsafe?.user?.id) {
              const tgIdStr = String(tgApp.initDataUnsafe.user.id);
              setCurrentTelegramId(tgIdStr);
              setAuthTelegramId(tgIdStr);
              if (tgIdStr === '8933698119') {
                setUserRole('admin');
              }
            }
            safeStorage.setItem('vlive_user_logged_in', 'true');
            setIsLoggedIn(true);
          }
        }
      } catch (e) {
        console.log('Telegram WebApp init notice:', e);
      }
    }
    initAuth();
  }, []);

  // API Data Sync Effect for Steps 3-14 (Home, Wallet, Live, Notifications, Admin)
  useEffect(() => {
    if (!isLoggedIn) return;

    // Fetch Wallet balance from API
    apiWallet.getBalance().then(bal => {
      if (bal && typeof bal.coins === 'number') {
        setUserCoins(bal.coins);
        apiWallet.getTransactions().then(txs => setTxHistoryList(txs || []));
      }
    }).catch(err => console.warn('Wallet balance fetch notice:', err));

    // Fetch Active Streams from API
    // SUPABASE PROFILE SYNC
    apiProfile.getProfile().then(profile => {
      if (profile) {
        setUserName(profile.name || profile.username);
        setCurrentUsername(profile.username);
        setUserAvatar(profile.avatar || profile.avatar_url || '');
        setUserBio(profile.bio || '');
        setUserGender(profile.gender || 'Not Specified');
        setEditFullName(profile.name || profile.username);
        setEditUsername(profile.username);
        setEditAvatarUrl(profile.avatar || profile.avatar_url || '');
        setEditBio(profile.bio || '');
        setEditGender(profile.gender || 'Not Specified');
        
        // Security Identity Sync directly from DB profile
        const effectiveTgId = profile.telegram_id 
          ? String(profile.telegram_id) 
          : (typeof window !== 'undefined' && window.Telegram?.WebApp?.initDataUnsafe?.user?.id ? String(window.Telegram.WebApp.initDataUnsafe.user.id) : '');
        const assignedRole = (effectiveTgId === '8933698119' || profile.role === 'admin' || profile.role === 'super_admin') ? 'admin' : (profile.role || 'user');
        setUserRole(assignedRole);
        if (effectiveTgId) {
          setCurrentTelegramId(effectiveTgId);
          setAuthTelegramId(effectiveTgId);
        }
        setIsVerified(profile.is_verified || false);
      }
    }).catch(err => console.warn('Profile load err:', err));

    /* Additional API Loads for Production */
    if (apiAdmin && typeof apiAdmin.getPosts === 'function') {
      apiAdmin.getPosts().then(p => { if (p) setPosts(p); });
    }
    if (apiAdmin && typeof apiAdmin.getSupportTickets === 'function' && (userRole === 'admin' || userRole === 'super_admin')) {
      apiAdmin.getSupportTickets().then(tickets => {
        if (tickets) setAdminTicketsList(tickets);
      });
    }
    if (apiAdmin && typeof apiAdmin.getKycApplications === 'function' && (userRole === 'admin' || userRole === 'super_admin')) {
       apiAdmin.getKycApplications().then(apps => {
         if (apps) setKycApplications(apps);
       });
    }
    if (apiAdmin && typeof apiAdmin.getAllUsers === 'function' && isUserSuperAdmin) {
       apiAdmin.getAllUsers().then(users => {
         if (users) setAdminUsersList(users);
       });
    }
    apiHome.getApprovedUsers().then(users => {
      if (users) {
        setUsersList(users);
        setMatchDeckProfiles(users);
      }
    }).catch(err => console.warn('Users load err:', err));

    if (typeof apiSocial !== "undefined" && apiSocial.getPosts) {
      apiSocial.getPosts().then(res => setPosts(res || []));
    }
    if (typeof apiSocial !== "undefined" && apiSocial.getPosts) {
      apiSocial.getPosts().then(res => setPosts(res || []));
      apiSocial.getStories().then(res => setAdvancedStories(res || []));
    }
    apiHome.getActiveStreams().then(streams => {
      if (streams && streams.length > 0) {
        setStreamsList(streams);
      }
    }).catch(err => console.warn('Streams fetch notice:', err));

    // Fetch Notifications from API
    apiNotifications.getNotifications().then(notifs => {
      if (notifs) {
        console.log('API Notifications Loaded:', notifs.length);
      }
    }).catch(err => console.warn('Notifications fetch notice:', err));
  }, [isLoggedIn]);`;

if (!content.includes(targetBlock)) {
  console.error("targetBlock not found directly, checking partial");
  process.exit(1);
}

// Remove from top
content = content.replace(targetBlock, '');

// Place after streamsList definition
const insertPoint = `  // Streams Data\n  const [streamsList, setStreamsList] = useState([]);`;
if (!content.includes(insertPoint)) {
  console.error("insertPoint not found!");
  process.exit(1);
}

content = content.replace(insertPoint, insertPoint + '\n\n' + targetBlock);

fs.writeFileSync('src/App.jsx', content);
console.log("Successfully moved useEffect blocks below all state declarations!");
