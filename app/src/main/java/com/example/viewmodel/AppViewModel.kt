package com.example.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.model.*
import com.example.util.AppLanguage
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AppViewModel : ViewModel() {

    // Current Selected Language (Default: ENGLISH)
    private val _currentLanguage = MutableStateFlow(AppLanguage.ENGLISH)
    val currentLanguage: StateFlow<AppLanguage> = _currentLanguage.asStateFlow()

    fun setLanguage(lang: AppLanguage) {
        _currentLanguage.value = lang
    }

    // OLED Deep Black Theme Toggle
    private val _isOledDeepBlack = MutableStateFlow(false)
    val isOledDeepBlack: StateFlow<Boolean> = _isOledDeepBlack.asStateFlow()

    fun toggleOledTheme() {
        _isOledDeepBlack.value = !_isOledDeepBlack.value
        showNotification(if (_isOledDeepBlack.value) "OLED Deep Black Theme Enabled" else "Cyber Neon Theme Enabled")
    }

    // Current User Profile State
    private val _userProfile = MutableStateFlow(
        UserProfile(
            id = "usr_9981",
            username = "LuminaQueen",
            displayName = "Elnaz (Verified Host)",
            avatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
            gender = Gender.FEMALE,
            role = UserRole.HOST,
            ageVerified = true,
            genderVerified = true,
            isVip = true,
            vipExpiryDate = "2026-12-31",
            usdtBalance = 480.25,
            starsBalance = 3450,
            totalEarningsUsdt = 1250.00
        )
    )
    val userProfile: StateFlow<UserProfile> = _userProfile.asStateFlow()

    // Live Streams list
    private val _liveStreams = MutableStateFlow<List<LiveStream>>(emptyList())
    val liveStreams: StateFlow<List<LiveStream>> = _liveStreams.asStateFlow()

    // Selected Active Stream
    private val _activeStream = MutableStateFlow<LiveStream?>(null)
    val activeStream: StateFlow<LiveStream?> = _activeStream.asStateFlow()

    // Gifts list (16 Diverse 3D & Neon Vector Icon Gifts)
    val gifts = listOf(
        LiveGift("gift_1", "Neon Heart", "favorite", usdtCost = 0.5, starsCost = 10, neonColorHex = 0xFFFF007A),
        LiveGift("gift_2", "Glowing Rose", "local_florist", usdtCost = 1.0, starsCost = 20, neonColorHex = 0xFFFF1493),
        LiveGift("gift_3", "Neon Cocktail", "local_bar", usdtCost = 2.5, starsCost = 50, neonColorHex = 0xFF00E5FF),
        LiveGift("gift_4", "Neon VIP Crown", "military_tech", usdtCost = 5.0, starsCost = 100, neonColorHex = 0xFFFFB800),
        LiveGift("gift_5", "3D Diamond Ring", "verified", usdtCost = 12.5, starsCost = 250, neonColorHex = 0xFF00F0FF),
        LiveGift("gift_6", "3D Sport Maserati", "directions_car", usdtCost = 15.0, starsCost = 300, neonColorHex = 0xFF00F0FF),
        LiveGift("gift_7", "Shining 3D Diamond", "diamond", usdtCost = 25.0, starsCost = 500, neonColorHex = 0xFF9D00FF),
        LiveGift("gift_8", "Cyberpunk Ferrari", "speed", usdtCost = 50.0, starsCost = 1000, neonColorHex = 0xFFFF3366),
        LiveGift("gift_9", "Cyber Neon Rocket", "rocket_launch", usdtCost = 75.0, starsCost = 1500, neonColorHex = 0xFF00FF66),
        LiveGift("gift_10", "3D Luxury Yacht", "sailing", usdtCost = 100.0, starsCost = 2000, neonColorHex = 0xFF00E5FF),
        LiveGift("gift_11", "3D Golden Shield", "shield", usdtCost = 150.0, starsCost = 3000, neonColorHex = 0xFFFFD700),
        LiveGift("gift_12", "3D Private Jet", "flight_takeoff", usdtCost = 200.0, starsCost = 4000, neonColorHex = 0xFFFFB800),
        LiveGift("gift_13", "3D Neon Castle", "castle", usdtCost = 250.0, starsCost = 5000, neonColorHex = 0xFFFF007A),
        LiveGift("gift_14", "3D Neon Dragon Flame", "whatshot", usdtCost = 375.0, starsCost = 7500, neonColorHex = 0xFFFF4500),
        LiveGift("gift_15", "3D Galactic Portal", "blur_circular", usdtCost = 400.0, starsCost = 8000, neonColorHex = 0xFF00F0FF),
        LiveGift("gift_16", "3D Starburst Explosion", "auto_awesome", usdtCost = 500.0, starsCost = 10000, neonColorHex = 0xFFFFD700)
    )

    // VIP Subscriptions list (5 Tiered Subscriptions)
    val vipPlans = listOf(
        VipPlan(
            id = "vip_bronze",
            title = "Bronze VIP Pass",
            durationDays = 7,
            usdtPrice = 9.99,
            starsPrice = 200,
            features = listOf("3D Bronze Chat Badge", "Highlighted Meta Messages", "Priority Video Call Queue")
        ),
        VipPlan(
            id = "vip_silver",
            title = "Silver Sport VIP",
            durationDays = 30,
            usdtPrice = 29.99,
            starsPrice = 600,
            features = listOf("3D Silver Neon Badge", "10% Discount on Gifts", "HD 1080p Stream Quality", "Dedicated VIP Support")
        ),
        VipPlan(
            id = "vip_gold",
            title = "Gold Royal VIP",
            durationDays = 90,
            usdtPrice = 79.99,
            starsPrice = 1600,
            features = listOf("3D Golden Crown Badge", "20% Discount on Gifts", "Access to Exclusive VIP Live Streams", "Neon Room Entrance Effects")
        ),
        VipPlan(
            id = "vip_platinum",
            title = "Platinum Cyber VIP",
            durationDays = 180,
            usdtPrice = 149.99,
            starsPrice = 3000,
            features = listOf("3D Platinum Glowing Aura", "30% Discount on All Gifts", "4K Ultra HD Live Streams", "24/7 VIP Concierge Support")
        ),
        VipPlan(
            id = "vip_diamond",
            title = "Diamond Supreme VIP",
            durationDays = 365,
            usdtPrice = 299.99,
            starsPrice = 6000,
            features = listOf("3D Kingdom Diamond Badge", "50% Discount on All Gifts", "Unlimited Private Video Calls", "Custom Animated Room Entry")
        )
    )

    // Chat messages in Live Stream
    private val _streamComments = MutableStateFlow<List<Pair<String, String>>>(emptyList())
    val streamComments: StateFlow<List<Pair<String, String>>> = _streamComments.asStateFlow()

    // Withdrawals
    private val _withdrawals = MutableStateFlow<List<WithdrawalRequest>>(emptyList())
    val withdrawals: StateFlow<List<WithdrawalRequest>> = _withdrawals.asStateFlow()

    // AI Security Alerts for Admin
    private val _aiAlerts = MutableStateFlow<List<AiSecurityAlert>>(emptyList())
    val aiAlerts: StateFlow<List<AiSecurityAlert>> = _aiAlerts.asStateFlow()

    // Telegram Ads status
    private val _telegramAdsEnabled = MutableStateFlow(true)
    val telegramAdsEnabled: StateFlow<Boolean> = _telegramAdsEnabled.asStateFlow()

    // Notification / Toast Message
    private val _userNotification = MutableStateFlow<String?>(null)
    val userNotification: StateFlow<String?> = _userNotification.asStateFlow()

    // Official TRC20 USDT Deposit Wallet Address
    val officialDepositAddress = "TBMvBiVB6mhu1gnaAAE1Pg5YohKvV1NSnB"

    // Male Free Quotas
    private val _dailyFreeCallsRemaining = MutableStateFlow(3) // 3 free 30s calls daily
    val dailyFreeCallsRemaining: StateFlow<Int> = _dailyFreeCallsRemaining.asStateFlow()

    private val _dailyFreeLiveSecondsRemaining = MutableStateFlow(15 * 60) // 15 mins daily
    val dailyFreeLiveSecondsRemaining: StateFlow<Int> = _dailyFreeLiveSecondsRemaining.asStateFlow()

    private val _dailyGiftClaimed = MutableStateFlow(false)
    val dailyGiftClaimed: StateFlow<Boolean> = _dailyGiftClaimed.asStateFlow()

    // Host Stream & Call Custom Controls
    private val _isFreeLive = MutableStateFlow(false)
    val isFreeLive: StateFlow<Boolean> = _isFreeLive.asStateFlow()

    private val _callStarsPerMin = MutableStateFlow(30)
    val callStarsPerMin: StateFlow<Int> = _callStarsPerMin.asStateFlow()

    private val _hostPerSecondEarnings = MutableStateFlow(0.0)
    val hostPerSecondEarnings: StateFlow<Double> = _hostPerSecondEarnings.asStateFlow()

    // Reports & Banned Users State
    private val _userReports = MutableStateFlow<List<UserReport>>(
        listOf(
            UserReport(
                id = "rep_101",
                reportedUserId = "usr_505",
                reportedUsername = "spammer_99",
                reporterUsername = "LuminaQueen",
                reason = "Harassment & Offensive Language",
                timestamp = "2026-07-23 14:10"
            )
        )
    )
    val userReports: StateFlow<List<UserReport>> = _userReports.asStateFlow()

    private val _bannedUsernames = MutableStateFlow<List<String>>(emptyList())
    val bannedUsernames: StateFlow<List<String>> = _bannedUsernames.asStateFlow()

    // Strict Rules Accepted State (First Time User Confirmation)
    private val _rulesAccepted = MutableStateFlow(true) // Set default true, or toggle via modal
    val rulesAccepted: StateFlow<Boolean> = _rulesAccepted.asStateFlow()

    // Auto-Translate Chat Messages System
    private val _autoTranslateChat = MutableStateFlow(true)
    val autoTranslateChat: StateFlow<Boolean> = _autoTranslateChat.asStateFlow()

    fun toggleAutoTranslate() {
        _autoTranslateChat.value = !_autoTranslateChat.value
        showNotification(if (_autoTranslateChat.value) "Auto chat translation enabled 🌐" else "Auto chat translation disabled.")
    }

    // Host Studio Beauty Filter Selection
    private val _activeBeautyFilter = MutableStateFlow(BeautyFilter.STUDIO_GLOW)
    val activeBeautyFilter: StateFlow<BeautyFilter> = _activeBeautyFilter.asStateFlow()

    fun setBeautyFilter(filter: BeautyFilter) {
        _activeBeautyFilter.value = filter
        showNotification("Beauty filter set to '${filter.label}'")
    }

    // Direct Messaging (Chat System)
    private val _directMessages = MutableStateFlow<List<DirectMessage>>(
        listOf(
            DirectMessage(
                id = "dm_1",
                senderUsername = "LuminaSupport",
                receiverUsername = "LuminaUser",
                originalText = "Welcome to V.Live! Your account is protected with FLAG_SECURE anti-recording.",
                translatedText = "Welcome to V.Live! Your account is protected with FLAG_SECURE anti-recording.",
                timestamp = "14:30",
                isSystemMessage = true
            ),
            DirectMessage(
                id = "dm_2",
                senderUsername = "Rayan",
                receiverUsername = "LuminaUser",
                originalText = "Hello! Super Admin support is active 24/7.",
                translatedText = "Hello! Super Admin support is active 24/7.",
                timestamp = "14:35"
            )
        )
    )
    val directMessages: StateFlow<List<DirectMessage>> = _directMessages.asStateFlow()

    fun sendDirectMessage(receiverUsername: String, text: String) {
        val currentSender = _userProfile.value.username
        val simulatedTranslation = "Translated: $text (Auto Translation)"
        val newDm = DirectMessage(
            id = "dm_${System.currentTimeMillis()}",
            senderUsername = currentSender,
            receiverUsername = receiverUsername,
            originalText = text,
            translatedText = simulatedTranslation,
            timestamp = "15:20"
        )
        _directMessages.value = _directMessages.value + newDm
        showNotification("Direct message sent")
    }

    // Security Audit Logs
    private val _securityDeviceLogs = MutableStateFlow<List<SecurityDeviceLog>>(
        listOf(
            SecurityDeviceLog(
                id = "log_101",
                username = "Rayan",
                ipAddress = "185.220.101.4",
                deviceModel = "Android Admin Terminal (FLAG_SECURE Active)",
                antiCaptureActive = true,
                biometricVerified = true,
                timestamp = "2026-07-23 15:20"
            ),
            SecurityDeviceLog(
                id = "log_102",
                username = "LuminaUser",
                ipAddress = "5.160.22.88",
                deviceModel = "Samsung Galaxy S24 Ultra",
                antiCaptureActive = true,
                biometricVerified = true,
                timestamp = "2026-07-23 15:15"
            )
        )
    )
    val securityDeviceLogs: StateFlow<List<SecurityDeviceLog>> = _securityDeviceLogs.asStateFlow()

    // 1. Pay-Per-View Media Vault State
    private val _vaultMediaItems = MutableStateFlow<List<VaultMediaItem>>(
        listOf(
            VaultMediaItem(
                id = "vault_1",
                hostUsername = "Sogand_Live",
                hostAvatar = "",
                title = "Exclusive 4K Studio Neon Album",
                previewUrl = "",
                unlockCostStars = 150,
                isUnlocked = false,
                isVideo = false,
                likesCount = 389
            ),
            VaultMediaItem(
                id = "vault_2",
                hostUsername = "Elena_Stream",
                hostAvatar = "",
                title = "Behind-the-Scenes VIP Video",
                previewUrl = "",
                unlockCostStars = 300,
                isUnlocked = false,
                isVideo = true,
                likesCount = 512
            )
        )
    )
    val vaultMediaItems: StateFlow<List<VaultMediaItem>> = _vaultMediaItems.asStateFlow()

    fun unlockVaultMedia(itemId: String) {
        val item = _vaultMediaItems.value.find { it.id == itemId } ?: return
        if (item.isUnlocked) return

        if (_userProfile.value.starsBalance >= item.unlockCostStars) {
            _userProfile.value = _userProfile.value.copy(
                starsBalance = _userProfile.value.starsBalance - item.unlockCostStars
            )
            _vaultMediaItems.value = _vaultMediaItems.value.map {
                if (it.id == itemId) it.copy(isUnlocked = true) else it
            }
            showNotification("Unlocked media vault for @${item.hostUsername}!")
        } else {
            showNotification("Insufficient Stars balance! Please top up your wallet.")
        }
    }

    fun publishVaultMedia(title: String, unlockCostStars: Long, isVideo: Boolean) {
        val newMedia = VaultMediaItem(
            id = "vault_${System.currentTimeMillis()}",
            hostUsername = _userProfile.value.username,
            hostAvatar = _userProfile.value.avatarUrl,
            title = title,
            previewUrl = "",
            unlockCostStars = unlockCostStars,
            isUnlocked = true, // Free/unlocked for host
            isVideo = isVideo,
            likesCount = 1
        )
        _vaultMediaItems.value = listOf(newMedia) + _vaultMediaItems.value
        showNotification("Exclusive album published successfully!")
    }

    // 2. Weekly Leaderboard & VIP Supporters
    private val _leaderboardHosts = MutableStateFlow<List<LeaderboardEntry>>(
        listOf(
            LeaderboardEntry(1, "Sogand_Live", "", 45200, true, "Golden Queen"),
            LeaderboardEntry(2, "Elena_Stream", "", 38900, true, "Neon Goddess"),
            LeaderboardEntry(3, "Sara_Vip", "", 29400, true, "Silver Host"),
            LeaderboardEntry(4, "Niloofar_Live", "", 18500, true, "Top Streamer")
        )
    )
    val leaderboardHosts: StateFlow<List<LeaderboardEntry>> = _leaderboardHosts.asStateFlow()

    private val _leaderboardSupporters = MutableStateFlow<List<LeaderboardEntry>>(
        listOf(
            LeaderboardEntry(1, "Whale_King_99", "", 125000, false, "Diamond Donor"),
            LeaderboardEntry(2, "Crypto_Lord", "", 98000, false, "Golden Whale"),
            LeaderboardEntry(3, "Rayan_Sponsor", "", 74000, false, "Super Sponsor"),
            LeaderboardEntry(4, "Vip_Viewer_007", "", 43000, false, "Top Supporter")
        )
    )
    val leaderboardSupporters: StateFlow<List<LeaderboardEntry>> = _leaderboardSupporters.asStateFlow()

    // 3. Private Call Booking Calendar
    private val _privateBookings = MutableStateFlow<List<PrivateCallBooking>>(
        listOf(
            PrivateCallBooking(
                id = "book_101",
                hostUsername = "Sogand_Live",
                hostAvatar = "",
                viewerUsername = "LuminaUser",
                date = "2026-07-24",
                timeSlot = "21:30 - 22:00",
                costStars = 500,
                status = "CONFIRMED"
            )
        )
    )
    val privateBookings: StateFlow<List<PrivateCallBooking>> = _privateBookings.asStateFlow()

    fun bookPrivateCallSlot(hostUsername: String, date: String, timeSlot: String, costStars: Long) {
        if (_userProfile.value.starsBalance >= costStars) {
            _userProfile.value = _userProfile.value.copy(
                starsBalance = _userProfile.value.starsBalance - costStars
            )
            val newBooking = PrivateCallBooking(
                id = "book_${System.currentTimeMillis()}",
                hostUsername = hostUsername,
                hostAvatar = "",
                viewerUsername = _userProfile.value.username,
                date = date,
                timeSlot = timeSlot,
                costStars = costStars,
                status = "CONFIRMED"
            )
            _privateBookings.value = listOf(newBooking) + _privateBookings.value
            showNotification("Private call slot booked with @$hostUsername for $date!")
        } else {
            showNotification("Insufficient Stars balance! Please buy more Stars.")
        }
    }

    fun acceptRules() {
        _rulesAccepted.value = true
        showNotification("Platform terms accepted. Welcome!")
    }

    fun disconnectCallByHost(hostUsername: String) {
        // Disconnection by host cancels earnings for this call and charges 0 fee to male viewer
        _hostPerSecondEarnings.value = 0.0
        showNotification("Call disconnected by host! 0 fees charged.")
    }

    fun submitStreamRating(streamId: String, hostName: String, stars: Int, dissatisfactionReason: String) {
        if (stars < 3) {
            // Report low rating / dissatisfaction to admin
            reportUser(
                reportedUserId = "host_$streamId",
                reportedUsername = hostName,
                reason = "Low Rating ($stars/5 Stars): $dissatisfactionReason"
            )
            showNotification("Rating $stars stars submitted and feedback sent to support.")
        } else {
            showNotification("Thank you! Rating $stars stars submitted for @$hostName.")
        }
    }

    fun loginSuperAdmin(user: String, pass: String): Boolean {
        if (user.trim().equals("Rayan", ignoreCase = true) && pass.trim() == "Rayan0935") {
            _userProfile.value = UserProfile(
                id = "admin_rayan_001",
                username = "Rayan",
                displayName = "Rayan (Super Admin)",
                avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
                gender = Gender.FEMALE, // Allowed full host access & viewer access
                role = UserRole.ADMIN,
                ageVerified = true,
                genderVerified = true,
                isVip = true,
                vipExpiryDate = "UNLIMITED 2099",
                usdtBalance = 999999.00,
                starsBalance = 999999,
                totalEarningsUsdt = 999999.00,
                bio = "Super Admin & Official Support for V.Live",
                bioVerified = true,
                isSuperAdmin = true
            )
            showNotification("Logged in as Super Admin (Rayan) - Unlimited Access Granted!")
            return true
        } else {
            showNotification("Invalid username or password!")
            return false
        }
    }

    fun reportUser(reportedUserId: String, reportedUsername: String, reason: String) {
        val newReport = UserReport(
            id = "rep_${System.currentTimeMillis()}",
            reportedUserId = reportedUserId,
            reportedUsername = reportedUsername,
            reporterUsername = _userProfile.value.username,
            reason = reason,
            timestamp = "2026-07-23 ${java.text.SimpleDateFormat("HH:mm", java.util.Locale.getDefault()).format(java.util.Date())}"
        )
        _userReports.value = listOf(newReport) + _userReports.value
        showNotification("Violation report for @$reportedUsername submitted to admin.")
    }

    fun banUserAndRevokeSubscription(reportedUsername: String) {
        _bannedUsernames.value = _bannedUsernames.value + reportedUsername
        // Mark reports as resolved
        _userReports.value = _userReports.value.map { rep ->
            if (rep.reportedUsername == reportedUsername) rep.copy(status = "RESOLVED_BANNED") else rep
        }
        // Remove active streams hosted by this user
        _liveStreams.value = _liveStreams.value.filter { it.hostName != reportedUsername }
        showNotification("User @$reportedUsername banned. Active subscriptions revoked.")
    }

    fun setFreeLiveMode(isFree: Boolean) {
        _isFreeLive.value = isFree
        showNotification(if (isFree) "Stream set to FREE mode." else "Stream set to PAID mode.")
    }

    fun setCallStarsPerMinRate(rate: Int) {
        _callStarsPerMin.value = rate
        showNotification("Private call rate set to $rate Stars/min.")
    }

    fun claimDailyGift() {
        if (!_dailyGiftClaimed.value) {
            _dailyGiftClaimed.value = true
            topUpWallet(0.0, 50)
            showNotification("Daily bonus 50 Stars added to your account!")
        } else {
            showNotification("Daily gift already claimed today!")
        }
    }

    fun useFreeCallQuota(): Boolean {
        if (_dailyFreeCallsRemaining.value > 0) {
            _dailyFreeCallsRemaining.value -= 1
            showNotification("1 Free 30s call activated (Remaining: ${_dailyFreeCallsRemaining.value})")
            return true
        }
        return false
    }

    fun consumeFreeLiveTime(seconds: Int) {
        val current = _dailyFreeLiveSecondsRemaining.value
        if (current > 0) {
            _dailyFreeLiveSecondsRemaining.value = (current - seconds).coerceAtLeast(0)
        }
    }

    fun updateHostEarningsPerSecond(femaleHostEarnsPerSecUsdt: Double) {
        _hostPerSecondEarnings.value += femaleHostEarnsPerSecUsdt
        val user = _userProfile.value
        if (user.gender == Gender.FEMALE) {
            _userProfile.value = user.copy(
                usdtBalance = user.usdtBalance + femaleHostEarnsPerSecUsdt,
                totalEarningsUsdt = user.totalEarningsUsdt + femaleHostEarnsPerSecUsdt
            )
        }
    }

    init {
        loadMockData()
    }

    private fun loadMockData() {
        _liveStreams.value = listOf(
            LiveStream(
                id = "live_101",
                hostId = "host_1",
                hostName = "Elnaz Neon",
                hostAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
                title = "Nightly Neon Chat & VIP Calls",
                viewerCount = 1420,
                pricePerMinStars = 25,
                tags = listOf("Verified", "VIP", "Live Stream"),
                isFemaleVerified = true
            ),
            LiveStream(
                id = "live_102",
                hostId = "host_2",
                hostName = "Sara Live",
                hostAvatar = "https://images.unsplash.com/photo-1517841905240-472988babdf9",
                title = "Nightly Q&A Stream",
                viewerCount = 890,
                pricePerMinStars = 20,
                tags = listOf("Private Call", "Gender Verified"),
                isFemaleVerified = true
            ),
            LiveStream(
                id = "live_103",
                hostId = "host_3",
                hostName = "Roxana VIP",
                hostAvatar = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
                title = "3D Stream & Crypto Gifts",
                viewerCount = 2300,
                pricePerMinStars = 50,
                tags = listOf("Super VIP", "Crypto"),
                isFemaleVerified = true
            )
        )

        _streamComments.value = listOf(
            "Amir" to "Great stream Elnaz!",
            "Reza" to "Sent a $50 Diamond gift!",
            "Kamran" to "HD Video Call quality is amazing!"
        )

        _withdrawals.value = listOf(
            WithdrawalRequest(
                id = "tx_901",
                userId = "usr_9981",
                username = "LuminaQueen",
                amountUsdt = 100.0,
                networkFeeUsdt = 1.5,
                adminCommissionPercentage = 30,
                netPayoutUsdt = 68.50,
                walletAddress = "0x71C...49b2",
                status = "PENDING",
                requestedAt = "2026-07-24 14:20"
            ),
            WithdrawalRequest(
                id = "tx_900",
                userId = "usr_9981",
                username = "LuminaQueen",
                amountUsdt = 250.0,
                networkFeeUsdt = 1.5,
                adminCommissionPercentage = 30,
                netPayoutUsdt = 173.50,
                walletAddress = "0x71C...49b2",
                status = "APPROVED",
                requestedAt = "2026-07-23 18:10"
            )
        )

        _aiAlerts.value = listOf(
            AiSecurityAlert(
                id = "ai_1",
                userId = "usr_772",
                username = "FakeAccount99",
                alertType = "GENDER_MISMATCH",
                riskScore = 92,
                status = "FLAGGED",
                details = "AI detected non-female face mismatch in live stream.",
                timestamp = "10 mins ago"
            ),
            AiSecurityAlert(
                id = "ai_2",
                userId = "usr_883",
                username = "BotViewer",
                alertType = "SUSPICIOUS_TRANSFER",
                riskScore = 85,
                status = "RESOLVED",
                details = "Automated gift spam attempt blocked.",
                timestamp = "1 hour ago"
            )
        )
    }

    fun selectStream(stream: LiveStream?) {
        _activeStream.value = stream
    }

    fun sendGift(gift: LiveGift) {
        viewModelScope.launch {
            val user = _userProfile.value
            if (gift.usdtCost > 0) {
                if (user.usdtBalance >= gift.usdtCost) {
                    _userProfile.value = user.copy(
                        usdtBalance = user.usdtBalance - gift.usdtCost
                    )
                    addComment(user.displayName, "Sent gift: ${gift.name} 🎁")
                    showNotification("Gift ${gift.name} sent successfully!")
                } else {
                    showNotification("Insufficient USDT balance! Please top up.")
                }
            } else if (gift.starsCost > 0) {
                if (user.starsBalance >= gift.starsCost) {
                    _userProfile.value = user.copy(
                        starsBalance = user.starsBalance - gift.starsCost
                    )
                    addComment(user.displayName, "Sent gift: ${gift.name} ⭐️")
                    showNotification("Gift ${gift.name} sent with Stars!")
                } else {
                    showNotification("Insufficient Telegram Stars balance!")
                }
            }
        }
    }

    fun addComment(sender: String, message: String) {
        _streamComments.value = _streamComments.value + (sender to message)
    }

    fun requestWithdrawal(amountUsdt: Double, walletAddress: String) {
        viewModelScope.launch {
            val user = _userProfile.value
            // Check female host restriction & 1 per day restriction
            if (user.gender != Gender.FEMALE) {
                showNotification("Error: Earnings withdrawal is restricted to verified female creators.")
                return@launch
            }
            if (amountUsdt <= 0 || amountUsdt > user.usdtBalance) {
                showNotification("Invalid withdrawal amount.")
                return@launch
            }

            val fee = 1.5
            val commission = amountUsdt * 0.30
            val netPayout = amountUsdt - commission - fee

            val newTx = WithdrawalRequest(
                id = "tx_${System.currentTimeMillis() % 10000}",
                userId = user.id,
                username = user.username,
                amountUsdt = amountUsdt,
                networkFeeUsdt = fee,
                adminCommissionPercentage = 30,
                netPayoutUsdt = netPayout,
                walletAddress = walletAddress,
                status = "PENDING",
                requestedAt = "Just now"
            )

            _userProfile.value = user.copy(
                usdtBalance = user.usdtBalance - amountUsdt
            )
            _withdrawals.value = listOf(newTx) + _withdrawals.value
            showNotification("Withdrawal request for $amountUsdt USDT submitted (Pending admin approval).")
        }
    }

    fun approveWithdrawal(txId: String) {
        _withdrawals.value = _withdrawals.value.map {
            if (it.id == txId) it.copy(status = "APPROVED") else it
        }
        showNotification("Withdrawal request approved.")
    }

    fun rejectWithdrawal(txId: String) {
        val tx = _withdrawals.value.find { it.id == txId }
        if (tx != null && tx.status == "PENDING") {
            _withdrawals.value = _withdrawals.value.map {
                if (it.id == txId) it.copy(status = "REJECTED") else it
            }
            // Refund user
            _userProfile.value = _userProfile.value.copy(
                usdtBalance = _userProfile.value.usdtBalance + tx.amountUsdt
            )
            showNotification("Withdrawal request rejected. Funds refunded to wallet.")
        }
    }

    fun topUpWallet(usdtAmount: Double, starsAmount: Long) {
        val current = _userProfile.value
        _userProfile.value = current.copy(
            usdtBalance = current.usdtBalance + usdtAmount,
            starsBalance = current.starsBalance + starsAmount
        )
        showNotification("Wallet topped up successfully!")
    }

    fun buyVipPlan(plan: VipPlan) {
        val user = _userProfile.value
        if (user.usdtBalance >= plan.usdtPrice) {
            _userProfile.value = user.copy(
                usdtBalance = user.usdtBalance - plan.usdtPrice,
                isVip = true,
                vipExpiryDate = "2027-01-01"
            )
            // 40% Commission for female host pool
            val femaleCommissionUsdt = plan.usdtPrice * 0.40
            if (user.gender == Gender.FEMALE) {
                _userProfile.value = _userProfile.value.copy(
                    usdtBalance = _userProfile.value.usdtBalance + femaleCommissionUsdt,
                    totalEarningsUsdt = _userProfile.value.totalEarningsUsdt + femaleCommissionUsdt
                )
                showNotification("VIP Pass activated (+ $femaleCommissionUsdt USDT 40% female creator share added) ✨")
            } else {
                showNotification("VIP Pass ${plan.title} activated! (40% commission contributed to female host pool) ✨")
            }
        } else {
            showNotification("Insufficient USDT balance.")
        }
    }

    fun subscribeToVipWithStars(plan: VipPlan) {
        val user = _userProfile.value
        if (user.starsBalance >= plan.starsPrice) {
            _userProfile.value = user.copy(
                starsBalance = user.starsBalance - plan.starsPrice,
                isVip = true,
                vipExpiryDate = "2026-12-31"
            )
            showNotification("Subscription ${plan.title} activated with ${plan.starsPrice} Stars!")
        } else {
            showNotification("Insufficient Stars balance! Required: ${plan.starsPrice} Stars.")
        }
    }

    fun updateProfileDetails(displayName: String, username: String, bio: String, gender: Gender) {
        val current = _userProfile.value
        _userProfile.value = current.copy(
            displayName = displayName,
            username = username,
            bio = bio,
            gender = gender
        )
        showNotification("Profile details updated successfully.")
    }

    fun unbanUser(username: String) {
        _bannedUsernames.value = _bannedUsernames.value.filter { it != username }
        showNotification("User @$username unbanned.")
    }

    fun dismissReport(reportId: String) {
        _userReports.value = _userReports.value.map { rep ->
            if (rep.id == reportId) rep.copy(status = "DISMISSED") else rep
        }
        showNotification("Report dismissed.")
    }

    fun toggleTelegramAds() {
        _telegramAdsEnabled.value = !_telegramAdsEnabled.value
        showNotification(if (_telegramAdsEnabled.value) "Telegram Ads enabled" else "Telegram Ads disabled")
    }

    fun updateProfile(username: String, displayName: String, gender: Gender) {
        val current = _userProfile.value
        _userProfile.value = current.copy(
            username = username,
            displayName = displayName,
            gender = gender
        )
        showNotification("Profile updated successfully.")
    }

    fun startFemaleLiveStream(title: String) {
        val user = _userProfile.value
        if (user.gender != Gender.FEMALE || !user.genderVerified) {
            showNotification("Error: Starting live stream is restricted to verified female creators.")
            return
        }

        val newStream = LiveStream(
            id = "live_new_${System.currentTimeMillis() % 1000}",
            hostId = user.id,
            hostName = user.displayName,
            hostAvatar = user.avatarUrl,
            title = title,
            viewerCount = 1,
            pricePerMinStars = 30,
            tags = listOf("New Stream", "Verified"),
            isFemaleVerified = true
        )

        _liveStreams.value = listOf(newStream) + _liveStreams.value
        _activeStream.value = newStream
        showNotification("Your stream is now live! 🚀")
    }

    fun showNotification(message: String) {
        viewModelScope.launch {
            _userNotification.value = message
            delay(3500)
            if (_userNotification.value == message) {
                _userNotification.value = null
            }
        }
    }

    fun clearNotification() {
        _userNotification.value = null
    }
}
