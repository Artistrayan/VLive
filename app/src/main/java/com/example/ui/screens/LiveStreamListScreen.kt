package com.example.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.model.Gender
import com.example.model.LiveStream
import com.example.ui.components.NeonBadge
import com.example.ui.components.NeonButton
import com.example.ui.components.NeonGlassCard
import com.example.ui.theme.*
import com.example.viewmodel.AppViewModel

import com.example.util.Strings

@Composable
fun LiveStreamListScreen(
    viewModel: AppViewModel,
    onSelectStream: (LiveStream) -> Unit,
    onStartLiveClick: () -> Unit,
    onOpenVipClick: () -> Unit
) {
    val streams by viewModel.liveStreams.collectAsState()
    val user by viewModel.userProfile.collectAsState()
    val adsEnabled by viewModel.telegramAdsEnabled.collectAsState()
    val currentLang by viewModel.currentLanguage.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Banner Hero Section
        item {
            NeonGlassCard(
                borderColor = NeonPink,
                glowColor = NeonPurple
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = Strings.get("app_title", currentLang),
                                style = MaterialTheme.typography.titleLarge,
                                color = NeonCyan
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            NeonBadge(text = Strings.get("live_3d", currentLang), color = NeonPink)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = Strings.get("app_subtitle", currentLang),
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.Videocam,
                        contentDescription = "Live Icon",
                        tint = NeonPink,
                        modifier = Modifier.size(42.dp)
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                if (user.gender == Gender.FEMALE) {
                    NeonButton(
                        text = Strings.get("start_live_female_only", currentLang),
                        onClick = onStartLiveClick,
                        primaryColor = NeonPink,
                        icon = { Icon(Icons.Default.RadioButtonChecked, contentDescription = null, tint = Color.White) }
                    )
                } else {
                    Surface(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.dp, NeonPurple.copy(alpha = 0.5f), RoundedCornerShape(12.dp)),
                        color = SurfaceDarkElevated.copy(alpha = 0.6f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Female, contentDescription = null, tint = NeonPink)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = Strings.get("female_live_rule_notice", currentLang),
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                        }
                    }
                }
            }
        }

        // Telegram Ad Banner Sample
        if (adsEnabled) {
            item {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, NeonGold.copy(alpha = 0.6f), RoundedCornerShape(16.dp)),
                    color = Color(0x33FFB800),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                            Icon(Icons.Default.Campaign, contentDescription = "Ads", tint = NeonGold)
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = Strings.get("telegram_ad_title", currentLang),
                                    style = MaterialTheme.typography.labelMedium,
                                    color = Color.White
                                )
                                Text(
                                    text = Strings.get("telegram_ad_desc", currentLang),
                                    style = MaterialTheme.typography.labelSmall,
                                    color = TextSecondary
                                )
                            }
                        }
                        TextButton(onClick = onOpenVipClick) {
                            Text("VIP", color = NeonGold)
                        }
                    }
                }
            }
        }

        // Section Filter Chips / Sub-Tabs
        item {
            var selectedSubTab by remember { mutableStateOf(0) } // 0: Live Streams, 1: Media Vault, 2: Leaderboard, 3: Private Call Calendar

            Column {
                ScrollableTabRow(
                    selectedTabIndex = selectedSubTab,
                    containerColor = Color.Transparent,
                    contentColor = NeonCyan,
                    edgePadding = 0.dp,
                    divider = {}
                ) {
                    Tab(
                        selected = selectedSubTab == 0,
                        onClick = { selectedSubTab = 0 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Videocam, contentDescription = null, tint = if (selectedSubTab == 0) NeonPink else TextMuted, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("استریم‌ها", color = if (selectedSubTab == 0) NeonPink else TextMuted)
                            }
                        }
                    )

                    Tab(
                        selected = selectedSubTab == 1,
                        onClick = { selectedSubTab = 1 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Lock, contentDescription = null, tint = if (selectedSubTab == 1) NeonPurple else TextMuted, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("آلبوم اختصاصی (Vault)", color = if (selectedSubTab == 1) NeonPurple else TextMuted)
                            }
                        }
                    )

                    Tab(
                        selected = selectedSubTab == 2,
                        onClick = { selectedSubTab = 2 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.EmojiEvents, contentDescription = null, tint = if (selectedSubTab == 2) NeonGold else TextMuted, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("جدول رتبه‌بندی", color = if (selectedSubTab == 2) NeonGold else TextMuted)
                            }
                        }
                    )

                    Tab(
                        selected = selectedSubTab == 3,
                        onClick = { selectedSubTab = 3 },
                        text = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Event, contentDescription = null, tint = if (selectedSubTab == 3) NeonCyan else TextMuted, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("رزرو تماس خصوصی", color = if (selectedSubTab == 3) NeonCyan else TextMuted)
                            }
                        }
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                when (selectedSubTab) {
                    0 -> {
                        // Streams Grid List
                        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(10.dp)
                                            .clip(CircleShape)
                                            .background(NeonPink)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = Strings.get("active_streams", currentLang),
                                        style = MaterialTheme.typography.titleMedium,
                                        color = TextPrimary
                                    )
                                }
                                NeonBadge(text = "${streams.size} ${Strings.get("online_count", currentLang)}", color = NeonCyan)
                            }

                            streams.forEach { stream ->
                                LiveStreamCard(stream = stream, onClick = { onSelectStream(stream) })
                            }
                        }
                    }

                    1 -> {
                        // Pay-Per-View Media Vault Section
                        val vaultItems by viewModel.vaultMediaItems.collectAsState()
                        var showPublishVaultDialog by remember { mutableStateOf(false) }
                        var newVaultTitleText by remember { mutableStateOf("") }
                        var newVaultPriceStars by remember { mutableStateOf("150") }

                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = Strings.get("vault_title", currentLang),
                                    style = MaterialTheme.typography.titleMedium,
                                    color = NeonPurple
                                )

                                if (user.gender == Gender.FEMALE) {
                                    Button(
                                        onClick = { showPublishVaultDialog = true },
                                        colors = ButtonDefaults.buttonColors(containerColor = NeonPurple)
                                    ) {
                                        Icon(Icons.Default.AddAPhoto, contentDescription = null, tint = Color.White, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text("انتشار آلبوم", style = MaterialTheme.typography.labelSmall)
                                    }
                                }
                            }

                            vaultItems.forEach { vaultItem ->
                                NeonGlassCard(
                                    borderColor = if (vaultItem.isUnlocked) NeonGreen else NeonPurple,
                                    glowColor = NeonPink
                                ) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(80.dp)
                                                .clip(RoundedCornerShape(12.dp))
                                                .background(SurfaceDarkElevated),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = if (vaultItem.isUnlocked) Icons.Default.LockOpen else Icons.Default.Lock,
                                                contentDescription = null,
                                                tint = if (vaultItem.isUnlocked) NeonGreen else NeonPurple,
                                                modifier = Modifier.size(36.dp)
                                            )
                                        }

                                        Spacer(modifier = Modifier.width(12.dp))

                                        Column(modifier = Modifier.weight(1f)) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Text("@${vaultItem.hostUsername}", style = MaterialTheme.typography.titleSmall, color = Color.White)
                                                Spacer(modifier = Modifier.width(6.dp))
                                                NeonBadge(text = if (vaultItem.isVideo) "VIDEO 4K" else "PHOTO 4K", color = NeonCyan)
                                            }
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text(vaultItem.title, style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                                            Spacer(modifier = Modifier.height(6.dp))

                                            if (vaultItem.isUnlocked) {
                                                Text("✅ قفل باز شده و آماده مشاهده است", style = MaterialTheme.typography.labelSmall, color = NeonGreen)
                                            } else {
                                                Button(
                                                    onClick = { viewModel.unlockVaultMedia(vaultItem.id) },
                                                    colors = ButtonDefaults.buttonColors(containerColor = NeonPurple)
                                                ) {
                                                    Icon(Icons.Default.Star, contentDescription = null, tint = NeonGold, modifier = Modifier.size(16.dp))
                                                    Spacer(modifier = Modifier.width(4.dp))
                                                    Text("باز کردن قفل (${vaultItem.unlockCostStars} Stars)", style = MaterialTheme.typography.labelSmall)
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            if (showPublishVaultDialog) {
                                AlertDialog(
                                    onDismissRequest = { showPublishVaultDialog = false },
                                    containerColor = Color(0xFF121420),
                                    title = { Text("انتشار آلبوم اختصاصی جدید", color = Color.White) },
                                    text = {
                                        Column {
                                            OutlinedTextField(
                                                value = newVaultTitleText,
                                                onValueChange = { newVaultTitleText = it },
                                                label = { Text("عنوان آلبوم / عکس", color = TextSecondary) },
                                                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = NeonPurple, focusedTextColor = Color.White)
                                            )
                                            Spacer(modifier = Modifier.height(8.dp))
                                            OutlinedTextField(
                                                value = newVaultPriceStars,
                                                onValueChange = { newVaultPriceStars = it },
                                                label = { Text("قیمت قفل‌گشایی (Stars)", color = TextSecondary) },
                                                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = NeonPurple, focusedTextColor = Color.White)
                                            )
                                        }
                                    },
                                    confirmButton = {
                                        Button(
                                            onClick = {
                                                viewModel.publishVaultMedia(
                                                    title = newVaultTitleText.ifBlank { "آلبوم اختصاصی ۴K" },
                                                    unlockCostStars = newVaultPriceStars.toLongOrNull() ?: 150L,
                                                    isVideo = false
                                                )
                                                showPublishVaultDialog = false
                                            },
                                            colors = ButtonDefaults.buttonColors(containerColor = NeonPurple)
                                        ) {
                                            Text("انتشار در آلبوم")
                                        }
                                    }
                                )
                            }
                        }
                    }

                    2 -> {
                        // Leaderboard Section
                        val topHosts by viewModel.leaderboardHosts.collectAsState()
                        val topSupporters by viewModel.leaderboardSupporters.collectAsState()

                        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                            Text(Strings.get("leaderboard_title", currentLang), style = MaterialTheme.typography.titleMedium, color = NeonGold)

                            Text(Strings.get("top_hosts", currentLang), style = MaterialTheme.typography.titleSmall, color = NeonPink)
                            topHosts.forEach { host ->
                                NeonGlassCard(borderColor = NeonGold, glowColor = NeonPink) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Text("#${host.rank}", style = MaterialTheme.typography.titleLarge, color = NeonGold)
                                            Spacer(modifier = Modifier.width(12.dp))
                                            Column {
                                                Text("@${host.username}", style = MaterialTheme.typography.titleSmall, color = Color.White)
                                                Text(host.badgeTitle, style = MaterialTheme.typography.labelSmall, color = NeonPink)
                                            }
                                        }
                                        NeonBadge(text = "${host.scoreAmount} Stars", color = NeonGold)
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(Strings.get("top_supporters", currentLang), style = MaterialTheme.typography.titleSmall, color = NeonCyan)
                            topSupporters.forEach { supporter ->
                                NeonGlassCard(borderColor = NeonCyan, glowColor = NeonPurple) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Text("#${supporter.rank}", style = MaterialTheme.typography.titleLarge, color = NeonCyan)
                                            Spacer(modifier = Modifier.width(12.dp))
                                            Column {
                                                Text("@${supporter.username}", style = MaterialTheme.typography.titleSmall, color = Color.White)
                                                Text(supporter.badgeTitle, style = MaterialTheme.typography.labelSmall, color = NeonCyan)
                                            }
                                        }
                                        NeonBadge(text = "${supporter.scoreAmount} Stars", color = NeonGreen)
                                    }
                                }
                            }
                        }
                    }

                    3 -> {
                        // Private Call Booking Calendar Section
                        val bookings by viewModel.privateBookings.collectAsState()
                        var showBookingDialog by remember { mutableStateOf(false) }
                        var targetHostName by remember { mutableStateOf("Sogand_Live") }
                        var bookingDate by remember { mutableStateOf("2026-07-25") }
                        var bookingTimeSlot by remember { mutableStateOf("22:00 - 22:30") }

                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(Strings.get("booking_title", currentLang), style = MaterialTheme.typography.titleMedium, color = NeonCyan)

                                Button(
                                    onClick = { showBookingDialog = true },
                                    colors = ButtonDefaults.buttonColors(containerColor = NeonCyan)
                                ) {
                                    Icon(Icons.Default.Add, contentDescription = null, tint = Color.Black)
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("رزرو وقت جدید", color = Color.Black, style = MaterialTheme.typography.labelSmall)
                                }
                            }

                            bookings.forEach { book ->
                                NeonGlassCard(borderColor = NeonCyan, glowColor = NeonPurple) {
                                    Column {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text("رزرو تماس ۱ به ۱ با @${book.hostUsername}", style = MaterialTheme.typography.titleSmall, color = Color.White)
                                            NeonBadge(text = book.status, color = NeonGreen)
                                        }
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text("📅 تاریخ: ${book.date} • ⏰ زمان: ${book.timeSlot}", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                                        Text("هزینه رزرو: ${book.costStars} Stars", style = MaterialTheme.typography.labelSmall, color = NeonGold)
                                    }
                                }
                            }

                            if (showBookingDialog) {
                                AlertDialog(
                                    onDismissRequest = { showBookingDialog = false },
                                    containerColor = Color(0xFF121420),
                                    title = { Text("رزرو زمان تماس خصوصی با مجری", color = Color.White) },
                                    text = {
                                        Column {
                                            OutlinedTextField(
                                                value = targetHostName,
                                                onValueChange = { targetHostName = it },
                                                label = { Text("نام مجری", color = TextSecondary) },
                                                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = NeonCyan, focusedTextColor = Color.White)
                                            )
                                            Spacer(modifier = Modifier.height(8.dp))
                                            OutlinedTextField(
                                                value = bookingDate,
                                                onValueChange = { bookingDate = it },
                                                label = { Text("تاریخ رزرو (مثال: 2026-07-25)", color = TextSecondary) },
                                                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = NeonCyan, focusedTextColor = Color.White)
                                            )
                                            Spacer(modifier = Modifier.height(8.dp))
                                            OutlinedTextField(
                                                value = bookingTimeSlot,
                                                onValueChange = { bookingTimeSlot = it },
                                                label = { Text("بازه زمانی (مثال: 22:00 - 22:30)", color = TextSecondary) },
                                                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = NeonCyan, focusedTextColor = Color.White)
                                            )
                                        }
                                    },
                                    confirmButton = {
                                        Button(
                                            onClick = {
                                                viewModel.bookPrivateCallSlot(targetHostName, bookingDate, bookingTimeSlot, 500L)
                                                showBookingDialog = false
                                            },
                                            colors = ButtonDefaults.buttonColors(containerColor = NeonCyan)
                                        ) {
                                            Text("تایید و پرداخت ۵۰۰ سکه", color = Color.Black)
                                        }
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }

        // Section Title (Legacy header removed because handled inside subtab 0)

    }
}

@Composable
fun LiveStreamCard(
    stream: LiveStream,
    onClick: () -> Unit
) {
    NeonGlassCard(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        borderColor = NeonCyan.copy(alpha = 0.6f),
        glowColor = NeonPurple
    ) {
        Column {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(180.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(SurfaceDarkElevated)
            ) {
                // Background image preview
                AsyncImage(
                    model = stream.hostAvatar,
                    contentDescription = stream.title,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )

                // Dark gradient overlay
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.85f))
                            )
                        )
                )

                // Top Status Badges
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = Color(0xDDFF007A),
                        shape = RoundedCornerShape(20.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(Color.White)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "LIVE 3D",
                                style = MaterialTheme.typography.labelSmall,
                                color = Color.White
                            )
                        }
                    }

                    Surface(
                        color = Color(0x99000000),
                        shape = RoundedCornerShape(20.dp)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Visibility,
                                contentDescription = "Viewers",
                                tint = NeonCyan,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "${stream.viewerCount}",
                                style = MaterialTheme.typography.labelSmall,
                                color = Color.White
                            )
                        }
                    }
                }

                // Bottom Overlay info
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(12.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = stream.hostName,
                            style = MaterialTheme.typography.titleMedium,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Icon(
                            imageVector = Icons.Default.Verified,
                            contentDescription = "Female Verified",
                            tint = NeonCyan,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = stream.title,
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary,
                        maxLines = 1
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    stream.tags.forEach { tag ->
                        NeonBadge(text = tag, color = NeonPurple)
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = "Stars Rate",
                        tint = NeonGold,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${stream.pricePerMinStars} Stars/دقیقه",
                        style = MaterialTheme.typography.labelSmall,
                        color = NeonGold
                    )
                }
            }
        }
    }
}
