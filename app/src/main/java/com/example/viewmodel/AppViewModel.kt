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

    // Current User Profile State
    private val _userProfile = MutableStateFlow(
        UserProfile(
            id = "usr_9981",
            username = "LuminaQueen",
            displayName = "الناز (تایید شده ✨)",
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

    // Gifts list
    val gifts = listOf(
        LiveGift("gift_1", "قلب نئونی", "favorite", usdtCost = 0.5, starsCost = 10, neonColorHex = 0xFFFF007A),
        LiveGift("gift_2", "ماسکراتی 3D", "directions_car", usdtCost = 5.0, starsCost = 100, neonColorHex = 0xFF00F0FF),
        LiveGift("gift_3", "تاج VIP نئون", "military_tech", usdtCost = 15.0, starsCost = 300, neonColorHex = 0xFFFFB800),
        LiveGift("gift_4", "الماس 3D درخشان", "diamond", usdtCost = 50.0, starsCost = 1000, neonColorHex = 0xFF9D00FF),
        LiveGift("gift_5", "موشک نئون 🚀", "rocket_launch", usdtCost = 100.0, starsCost = 2000, neonColorHex = 0xFF00FF66)
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
        showNotification(if (_autoTranslateChat.value) "ترجمه خودکار پیام‌ها فعال شد 🌐" else "ترجمه خودکار غیرفعال شد.")
    }

    // Host Studio Beauty Filter Selection
    private val _activeBeautyFilter = MutableStateFlow(BeautyFilter.STUDIO_GLOW)
    val activeBeautyFilter: StateFlow<BeautyFilter> = _activeBeautyFilter.asStateFlow()

    fun setBeautyFilter(filter: BeautyFilter) {
        _activeBeautyFilter.value = filter
        showNotification("افکت چهره لایو به '${filter.label}' تغییر یافت ✨")
    }

    // Direct Messaging (Chat System)
    private val _directMessages = MutableStateFlow<List<DirectMessage>>(
        listOf(
            DirectMessage(
                id = "dm_1",
                senderUsername = "LuminaSupport",
                receiverUsername = "LuminaUser",
                originalText = "Welcome to V.Live! Your account is protected with FLAG_SECURE anti-recording.",
                translatedText = "به V.Live خوش آمدید! حساب شما با سیستم ضد ضبط FLAG_SECURE محافظت می‌شود.",
                timestamp = "14:30",
                isSystemMessage = true
            ),
            DirectMessage(
                id = "dm_2",
                senderUsername = "Rayan",
                receiverUsername = "LuminaUser",
                originalText = "Hello! Super Admin support is active 24/7.",
                translatedText = "سلام! پشتیبانی مدیریت کل ۲۴/۷ فعال است.",
                timestamp = "14:35"
            )
        )
    )
    val directMessages: StateFlow<List<DirectMessage>> = _directMessages.asStateFlow()

    fun sendDirectMessage(receiverUsername: String, text: String) {
        val currentSender = _userProfile.value.username
        val simulatedTranslation = if (text.contains(Regex("[a-zA-Z]"))) "ترجمه: $text (پاسخ خودکار)" else "Translated: $text (Auto Translation)"
        val newDm = DirectMessage(
            id = "dm_${System.currentTimeMillis()}",
            senderUsername = currentSender,
            receiverUsername = receiverUsername,
            originalText = text,
            translatedText = simulatedTranslation,
            timestamp = "15:20"
        )
        _directMessages.value = _directMessages.value + newDm
        showNotification("پیام مستقیم ارسال شد 💬")
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
                title = "آلبوم اختصاصی ۴K نئونی استودیو",
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
                title = "ویدئوی اختصاصی پشت صحنه لایو VIP",
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
            showNotification("قفل آلبوم اختصاصی @${item.hostUsername} با موفقیت باز شد!")
        } else {
            showNotification("موجودی سکه کافی نیست! لطفاً کیف پول خود را شارژ کنید.")
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
        showNotification("محتوای اختصاصی قفل‌دار با موفقیت در آلبوم منتشر شد!")
    }

    // 2. Weekly Leaderboard & VIP Supporters
    private val _leaderboardHosts = MutableStateFlow<List<LeaderboardEntry>>(
        listOf(
            LeaderboardEntry(1, "Sogand_Live", "", 45200, true, "Golden Queen 👑"),
            LeaderboardEntry(2, "Elena_Stream", "", 38900, true, "Neon Goddess ✨"),
            LeaderboardEntry(3, "Sara_Vip", "", 29400, true, "Silver Host 💎"),
            LeaderboardEntry(4, "Niloofar_Live", "", 18500, true, "Top Streamer 🌟")
        )
    )
    val leaderboardHosts: StateFlow<List<LeaderboardEntry>> = _leaderboardHosts.asStateFlow()

    private val _leaderboardSupporters = MutableStateFlow<List<LeaderboardEntry>>(
        listOf(
            LeaderboardEntry(1, "Whale_King_99", "", 125000, false, "Diamond Donor 💎"),
            LeaderboardEntry(2, "Crypto_Lord", "", 98000, false, "Golden Whale 🐋"),
            LeaderboardEntry(3, "Rayan_Sponsor", "", 74000, false, "Super Sponsor 🚀"),
            LeaderboardEntry(4, "Vip_Viewer_007", "", 43000, false, "Top Supporter ⭐️")
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
            showNotification("زمان تماس خصوصی با @$hostUsername برای تاریخ $date نهایی شد!")
        } else {
            showNotification("موجودی سکه کافی نیست! لطفاً سکه خریداری نمایید.")
        }
    }

    fun acceptRules() {
        _rulesAccepted.value = true
        showNotification("قوانین برنامه تایید شد. خوش آمدید!")
    }

    fun disconnectCallByHost(hostUsername: String) {
        // Disconnection by host cancels earnings for this call and charges 0 fee to male viewer
        _hostPerSecondEarnings.value = 0.0
        showNotification("تماس توسط مجری قطع شد! طبق قوانین هیچ هزینه‌ای کسر نگردید و هیچ درآمدی برای مجری محاسبه نشد.")
    }

    fun submitStreamRating(streamId: String, hostName: String, stars: Int, dissatisfactionReason: String) {
        if (stars < 3) {
            // Report low rating / dissatisfaction to admin
            reportUser(
                reportedUserId = "host_$streamId",
                reportedUsername = hostName,
                reason = "Low Rating ($stars/5 Stars): $dissatisfactionReason"
            )
            showNotification("امتیاز $stars ستاره ثبت شد. بازخورد نارضایتی شما جهت بررسی کیفیت به مدیریت ارسال گردید.")
        } else {
            showNotification("با تشکر! امتیاز $stars ستاره شما برای مجری @$hostName ثبت گردید. ⭐️")
        }
    }

    fun loginSuperAdmin(user: String, pass: String): Boolean {
        if (user.trim().equals("Rayan", ignoreCase = true) && pass.trim() == "Rayan0935") {
            _userProfile.value = UserProfile(
                id = "admin_rayan_001",
                username = "Rayan",
                displayName = "Rayan (Super Admin 👑)",
                avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
                gender = Gender.FEMALE, // Allowed full host access & viewer access
                role = UserRole.ADMIN,
                ageVerified = true,
                genderVerified = true,
                isVip = true,
                vipExpiryDate = "UNLIMITED 2099 🚀",
                usdtBalance = 999999.00,
                starsBalance = 999999,
                totalEarningsUsdt = 999999.00,
                bio = "مدیریت کل و پشتیبانی رسمی V.Live (دسترسی کامل نامحدود) 👑",
                bioVerified = true,
                isSuperAdmin = true
            )
            showNotification("ورود موفق به عنوان مدیریت کل (Rayan) - دسترسی نامحدود به تمام امکانات فعال شد! 👑")
            return true
        } else {
            showNotification("نام کاربری یا رمز عبور اشتباه است!")
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
        showNotification("گزارش تخلف کاربر @$reportedUsername ثبت شد و جهت بررسی به مدیریت ارسال گردید.")
    }

    fun banUserAndRevokeSubscription(reportedUsername: String) {
        _bannedUsernames.value = _bannedUsernames.value + reportedUsername
        // Mark reports as resolved
        _userReports.value = _userReports.value.map { rep ->
            if (rep.reportedUsername == reportedUsername) rep.copy(status = "RESOLVED_BANNED") else rep
        }
        // Remove active streams hosted by this user
        _liveStreams.value = _liveStreams.value.filter { it.hostName != reportedUsername }
        showNotification("کاربر @$reportedUsername مسدود گردید. اشتراک فعال لغو شده و هیچ وجهی مسترد نمی‌گردد!")
    }

    fun setFreeLiveMode(isFree: Boolean) {
        _isFreeLive.value = isFree
        showNotification(if (isFree) "حالت لایو رایگان شد." else "حالت لایو پولی شد.")
    }

    fun setCallStarsPerMinRate(rate: Int) {
        _callStarsPerMin.value = rate
        showNotification("قیمت هر دقیقه تماس خصوصی به $rate سکه/Stars تنظیم شد.")
    }

    fun claimDailyGift() {
        if (!_dailyGiftClaimed.value) {
            _dailyGiftClaimed.value = true
            topUpWallet(0.0, 50)
            showNotification("هدیه روزانه ۵۰ سکه/Stars به حساب شما اضافه شد! 🎁")
        } else {
            showNotification("هدیه روزانه امروز قبلاً دریافت شده است!")
        }
    }

    fun useFreeCallQuota(): Boolean {
        if (_dailyFreeCallsRemaining.value > 0) {
            _dailyFreeCallsRemaining.value -= 1
            showNotification("یک تماس ۳۰ ثانیه‌ای رایگان روزانه فعال شد (باقیمانده: ${_dailyFreeCallsRemaining.value})")
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
                hostName = "الناز نئون",
                hostAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
                title = "چت نئونی شبانه و تماس تصویری VIP 🔥✨",
                viewerCount = 1420,
                pricePerMinStars = 25,
                tags = listOf("تایید هویت", "VIP", "پخش زنده"),
                isFemaleVerified = true
            ),
            LiveStream(
                id = "live_102",
                hostId = "host_2",
                hostName = "سارا لایو",
                hostAvatar = "https://images.unsplash.com/photo-1517841905240-472988babdf9",
                title = "پاسخ به سوالات شبی با استریم اختصاصی 💎",
                viewerCount = 890,
                pricePerMinStars = 20,
                tags = listOf("تماس خصوصی", "تایید جنسیت"),
                isFemaleVerified = true
            ),
            LiveStream(
                id = "live_103",
                hostId = "host_3",
                hostName = "رکسانا VIP",
                hostAvatar = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
                title = "استریم زنده ۳ بعدی و هدایای کریپتویی 🚀",
                viewerCount = 2300,
                pricePerMinStars = 50,
                tags = listOf("سوپر VIP", "ارز دیجیتال"),
                isFemaleVerified = true
            )
        )

        _streamComments.value = listOf(
            "امیر" to "سلام الناز جان! استریم حرفه‌ای نئونی عالیه 🔥",
            "رضا" to "برات الماس ۵۰ دلاری فرستادم! 💎",
            "کامران" to "کیفیت تماس تصویری فوق العاده است"
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
                requestedAt = "1403/05/01 14:20"
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
                requestedAt = "1403/04/30 18:10"
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
                details = "هوش مصنوعی عدم تطابق چهره زنانه در لایو را شناسایی کرد.",
                timestamp = "10 دقیقه پیش"
            ),
            AiSecurityAlert(
                id = "ai_2",
                userId = "usr_883",
                username = "BotViewer",
                alertType = "SUSPICIOUS_TRANSFER",
                riskScore = 85,
                status = "RESOLVED",
                details = "تلاش برای ارسال خودکار هدیه و اسپم شناسایی و مسدود شد.",
                timestamp = "1 ساعت پیش"
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
                    addComment(user.displayName, "هدیه ارسال کرد: ${gift.name} 🎁")
                    showNotification("هدیه ${gift.name} با موفقیت ارسال شد!")
                } else {
                    showNotification("موجودی USDT کافی نیست! لطفاً کیف پول خود را شارژ کنید.")
                }
            } else if (gift.starsCost > 0) {
                if (user.starsBalance >= gift.starsCost) {
                    _userProfile.value = user.copy(
                        starsBalance = user.starsBalance - gift.starsCost
                    )
                    addComment(user.displayName, "هدیه ارسال کرد: ${gift.name} ⭐️")
                    showNotification("هدیه ${gift.name} با Stars ارسال شد!")
                } else {
                    showNotification("موجودی Telegram Stars کافی نیست!")
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
                showNotification("خطا: برداشت درآمد فقط مخصوص مجریان خانم تایید شده می‌باشد.")
                return@launch
            }
            if (amountUsdt <= 0 || amountUsdt > user.usdtBalance) {
                showNotification("موجودی قابل برداشت نامعتبر است.")
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
                requestedAt = "هم اکنون"
            )

            _userProfile.value = user.copy(
                usdtBalance = user.usdtBalance - amountUsdt
            )
            _withdrawals.value = listOf(newTx) + _withdrawals.value
            showNotification("درخواست برداشت $amountUsdt USDT ثبت شد (در انتظار تایید دستی مدیریت).")
        }
    }

    fun approveWithdrawal(txId: String) {
        _withdrawals.value = _withdrawals.value.map {
            if (it.id == txId) it.copy(status = "APPROVED") else it
        }
        showNotification("درخواست برداشت تایید شد.")
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
            showNotification("درخواست برداشت رد و مبلغ به کیف پول بازگردانده شد.")
        }
    }

    fun topUpWallet(usdtAmount: Double, starsAmount: Long) {
        val current = _userProfile.value
        _userProfile.value = current.copy(
            usdtBalance = current.usdtBalance + usdtAmount,
            starsBalance = current.starsBalance + starsAmount
        )
        showNotification("کیف پول با موفقیت شارژ شد!")
    }

    fun buyVipPlan(plan: VipPlan) {
        val user = _userProfile.value
        if (user.usdtBalance >= plan.usdtPrice) {
            _userProfile.value = user.copy(
                usdtBalance = user.usdtBalance - plan.usdtPrice,
                isVip = true,
                vipExpiryDate = "1405/01/01"
            )
            // 40% Commission for female host pool
            val femaleCommissionUsdt = plan.usdtPrice * 0.40
            if (user.gender == Gender.FEMALE) {
                _userProfile.value = _userProfile.value.copy(
                    usdtBalance = _userProfile.value.usdtBalance + femaleCommissionUsdt,
                    totalEarningsUsdt = _userProfile.value.totalEarningsUsdt + femaleCommissionUsdt
                )
                showNotification("اشتراک VIP فعال شد (+ $femaleCommissionUsdt USDT پاداش ۴۰٪ درآمد خانم‌ها اضافه گردید) ✨")
            } else {
                showNotification("اشتراک VIP ${plan.title} فعال شد! (۴۰٪ کمیسیون این خرید به مجریان خانم تعلق گرفت) ✨")
            }
        } else {
            showNotification("موجودی USDT کافی نیست.")
        }
    }

    fun updateProfile(username: String, displayName: String, gender: Gender) {
        val current = _userProfile.value
        _userProfile.value = current.copy(
            username = username,
            displayName = displayName,
            gender = gender
        )
        showNotification("اطلاعات پروفایل به روز رسانی شد.")
    }

    fun startFemaleLiveStream(title: String) {
        val user = _userProfile.value
        if (user.gender != Gender.FEMALE || !user.genderVerified) {
            showNotification("خطا: شروع بث زنده/لایو طبق قوانین سیستم فقط مخصوص خانم‌های تایید هویت شده می‌باشد.")
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
            tags = listOf("زنده جدید", "تایید هویت"),
            isFemaleVerified = true
        )

        _liveStreams.value = listOf(newStream) + _liveStreams.value
        _activeStream.value = newStream
        showNotification("لایو شما با موفقیت پخش گردید 🚀")
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
