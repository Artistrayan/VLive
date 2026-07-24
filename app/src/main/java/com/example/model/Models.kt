package com.example.model

enum class Gender {
    MALE, FEMALE
}

enum class UserRole {
    VIEWER, HOST, ADMIN
}

data class UserProfile(
    val id: String = "usr_101",
    val username: String = "LuminaUser",
    val displayName: String = "کاربر لومینا",
    val avatarUrl: String = "",
    val gender: Gender = Gender.MALE,
    val role: UserRole = UserRole.VIEWER,
    val ageVerified: Boolean = true,
    val genderVerified: Boolean = true,
    val isVip: Boolean = false,
    val vipExpiryDate: String = "",
    val usdtBalance: Double = 145.50,
    val starsBalance: Long = 1250,
    val totalEarningsUsdt: Double = 320.00,
    val bio: String = "علاقه‌مند به گفتگو و استریم‌های نئونی ✨",
    val bioVerified: Boolean = true,
    val isSuperAdmin: Boolean = false,
    val isBanned: Boolean = false
)

data class UserReport(
    val id: String,
    val reportedUserId: String,
    val reportedUsername: String,
    val reporterUsername: String,
    val reason: String, // "Harassment / Offensive Language", "Dangerous Content", "Fake Identity"
    val timestamp: String,
    val status: String = "PENDING" // PENDING, RESOLVED_BANNED, DISMISSED
)

data class LiveStream(
    val id: String,
    val hostId: String,
    val hostName: String,
    val hostAvatar: String,
    val title: String,
    val viewerCount: Int,
    val pricePerMinStars: Long = 10,
    val tags: List<String>,
    val isPrivateCall: Boolean = false,
    val isLive: Boolean = true,
    val category: String = "پخش زنده داغ",
    val isFemaleVerified: Boolean = true
)

data class LiveGift(
    val id: String,
    val name: String,
    val iconName: String,
    val usdtCost: Double = 0.0,
    val starsCost: Long = 0,
    val neonColorHex: Long = 0xFFFF007A
)

data class WithdrawalRequest(
    val id: String,
    val userId: String,
    val username: String,
    val amountUsdt: Double,
    val networkFeeUsdt: Double = 1.5,
    val adminCommissionPercentage: Int = 30,
    val netPayoutUsdt: Double,
    val walletAddress: String,
    val status: String = "PENDING", // PENDING, APPROVED, REJECTED
    val requestedAt: String
)

data class AiSecurityAlert(
    val id: String,
    val userId: String,
    val username: String,
    val alertType: String, // "AGE_DISCREPANCY", "GENDER_MISMATCH", "RECORDING_ATTEMPT", "SUSPICIOUS_TRANSFER"
    val riskScore: Int, // 1 to 100
    val status: String, // "FLAGGED", "RESOLVED", "BLOCKED"
    val details: String,
    val timestamp: String
)

data class DirectMessage(
    val id: String,
    val senderUsername: String,
    val receiverUsername: String,
    val originalText: String,
    val translatedText: String = "",
    val timestamp: String,
    val isSystemMessage: Boolean = false
)

data class SecurityDeviceLog(
    val id: String,
    val username: String,
    val ipAddress: String,
    val deviceModel: String,
    val antiCaptureActive: Boolean = true,
    val biometricVerified: Boolean = true,
    val timestamp: String
)

enum class BeautyFilter(val label: String, val neonColor: Long) {
    STUDIO_GLOW("استودیو نئونی (Studio Glow)", 0xFFFF007F),
    HOLLYWOOD_GLAM("هالیوود گلم (Hollywood Glam)", 0xFFFFD700),
    NATURAL_SMOOTH("طبیعی ناعم (Natural Smooth)", 0xFF00F5FF),
    VIBRANT_AURA("آورا درخشان (Vibrant Aura)", 0xFF39FF14),
    CYBER_MASK("ماسک نئونی سایبرپانک (AR Cyber Mask)", 0xFF9D00FF)
}

data class VaultMediaItem(
    val id: String,
    val hostUsername: String,
    val hostAvatar: String,
    val title: String,
    val previewUrl: String,
    val unlockCostStars: Long,
    val isUnlocked: Boolean = false,
    val isVideo: Boolean = false,
    val likesCount: Int = 142
)

data class LeaderboardEntry(
    val rank: Int,
    val username: String,
    val avatarUrl: String,
    val scoreAmount: Long,
    val isHost: Boolean,
    val badgeTitle: String
)

data class PrivateCallBooking(
    val id: String,
    val hostUsername: String,
    val hostAvatar: String,
    val viewerUsername: String,
    val date: String,
    val timeSlot: String,
    val costStars: Long,
    val status: String = "CONFIRMED" // CONFIRMED, COMPLETED, CANCELLED
)

data class VipPlan(
    val id: String,
    val title: String,
    val durationDays: Int,
    val usdtPrice: Double,
    val starsPrice: Long,
    val features: List<String>
)

