package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.example.model.Gender
import com.example.model.VipPlan
import com.example.ui.components.NeonBadge
import com.example.ui.components.NeonButton
import com.example.ui.components.NeonGlassCard
import com.example.ui.theme.*
import com.example.util.AppLanguage
import com.example.util.Strings
import com.example.viewmodel.AppViewModel

@Composable
fun ProfileAndVipScreen(
    viewModel: AppViewModel
) {
    val user by viewModel.userProfile.collectAsState()
    val currentLang by viewModel.currentLanguage.collectAsState()

    var activeSubTab by remember { mutableStateOf(0) }

    var usernameText by remember(user) { mutableStateOf(user.username) }
    var displayNameText by remember(user) { mutableStateOf(user.displayName) }
    var bioText by remember(user) { mutableStateOf(user.bio) }
    var selectedGender by remember(user) { mutableStateOf(user.gender) }

    val vipPlans = viewModel.vipPlans

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // User Profile Main Header Card
        item {
            NeonGlassCard(
                borderColor = if (user.isVip) NeonGold else NeonCyan,
                glowColor = NeonPurple
            ) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box {
                        AsyncImage(
                            model = user.avatarUrl,
                            contentDescription = "Avatar",
                            modifier = Modifier
                                .size(96.dp)
                                .clip(CircleShape)
                                .border(2.dp, if (user.isVip) NeonGold else NeonPink, CircleShape),
                            contentScale = ContentScale.Crop
                        )
                        if (user.isVip) {
                            Icon(
                                imageVector = Icons.Default.WorkspacePremium,
                                contentDescription = "VIP Badge",
                                tint = NeonGold,
                                modifier = Modifier
                                    .size(28.dp)
                                    .align(Alignment.BottomEnd)
                                    .background(Color.Black, CircleShape)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = user.displayName,
                            style = MaterialTheme.typography.titleMedium,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        if (user.genderVerified) {
                            Icon(
                                imageVector = Icons.Default.Verified,
                                contentDescription = "Verified",
                                tint = NeonCyan,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    Text(
                        text = "@${user.username}",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    NeonBadge(
                        text = "Exclusive ID: ID-${user.id}",
                        color = NeonGold
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        NeonBadge(
                            text = if (user.gender == Gender.FEMALE) "Female (Host)" else "Male (Viewer)",
                            color = if (user.gender == Gender.FEMALE) NeonPink else NeonCyan
                        )
                        NeonBadge(
                            text = if (user.isVip) "VIP Active" else "Standard User",
                            color = if (user.isVip) NeonGold else TextSecondary
                        )
                        NeonBadge(text = "+18 Verified", color = NeonGreen)
                    }
                }
            }
        }

        // Subtabs Navigation Row
        item {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, CardBorderNeon, RoundedCornerShape(20.dp)),
                color = Color(0xDD121420),
                shape = RoundedCornerShape(20.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(6.dp),
                    horizontalArrangement = Arrangement.SpaceAround
                ) {
                    FilterChip(
                        selected = activeSubTab == 0,
                        onClick = { activeSubTab = 0 },
                        label = { Text("Overview") },
                        leadingIcon = { Icon(Icons.Default.AccountBalanceWallet, contentDescription = null, modifier = Modifier.size(16.dp)) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = NeonCyan,
                            selectedLabelColor = Color.Black
                        )
                    )

                    FilterChip(
                        selected = activeSubTab == 1,
                        onClick = { activeSubTab = 1 },
                        label = { Text("VIP Pass") },
                        leadingIcon = { Icon(Icons.Default.Star, contentDescription = null, modifier = Modifier.size(16.dp)) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = NeonGold,
                            selectedLabelColor = Color.Black
                        )
                    )

                    FilterChip(
                        selected = activeSubTab == 2,
                        onClick = { activeSubTab = 2 },
                        label = { Text("Hosting & Media") },
                        leadingIcon = { Icon(Icons.Default.Videocam, contentDescription = null, modifier = Modifier.size(16.dp)) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = NeonPink,
                            selectedLabelColor = Color.White
                        )
                    )

                    FilterChip(
                        selected = activeSubTab == 3,
                        onClick = { activeSubTab = 3 },
                        label = { Text("Settings") },
                        leadingIcon = { Icon(Icons.Default.Settings, contentDescription = null, modifier = Modifier.size(16.dp)) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = NeonPurple,
                            selectedLabelColor = Color.White
                        )
                    )
                }
            }
        }

        // TAB 0: Overview & Balance Cards
        if (activeSubTab == 0) {
            item {
                Text(
                    text = "Wallet & Balance Overview",
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White
                )
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // USDT Balance Card
                    Surface(
                        modifier = Modifier
                            .weight(1f)
                            .border(1.dp, NeonGreen, RoundedCornerShape(16.dp)),
                        color = SurfaceDarkElevated,
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.AttachMoney, contentDescription = null, tint = NeonGreen, modifier = Modifier.size(20.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("USDT Balance", style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "$${String.format("%.2f", user.usdtBalance)}",
                                style = MaterialTheme.typography.titleMedium,
                                color = Color.White
                            )
                        }
                    }

                    // Stars Balance Card
                    Surface(
                        modifier = Modifier
                            .weight(1f)
                            .border(1.dp, NeonGold, RoundedCornerShape(16.dp)),
                        color = SurfaceDarkElevated,
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Stars, contentDescription = null, tint = NeonGold, modifier = Modifier.size(20.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Stars Balance", style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                            }
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "${user.starsBalance} Stars",
                                style = MaterialTheme.typography.titleMedium,
                                color = NeonGold
                            )
                        }
                    }
                }
            }

            // Total Host Earnings Card (If female or host)
            if (user.gender == Gender.FEMALE || user.totalEarningsUsdt > 0) {
                item {
                    NeonGlassCard(
                        borderColor = NeonPink,
                        glowColor = NeonPurple
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Savings, contentDescription = null, tint = NeonPink, modifier = Modifier.size(28.dp))
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text("Total Hosting & Call Earnings", style = MaterialTheme.typography.titleSmall, color = Color.White)
                                    Text("40% Female Creator Revenue Share Active", style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                                }
                            }
                            Text(
                                text = "$${String.format("%.2f", user.totalEarningsUsdt)}",
                                style = MaterialTheme.typography.titleMedium,
                                color = NeonGreen
                            )
                        }
                    }
                }
            }

            // Male Quotas & Daily Bonus Card
            item {
                val freeCalls by viewModel.dailyFreeCallsRemaining.collectAsState()
                val freeLiveSecs by viewModel.dailyFreeLiveSecondsRemaining.collectAsState()
                val giftClaimed by viewModel.dailyGiftClaimed.collectAsState()

                NeonGlassCard(
                    borderColor = NeonGreen,
                    glowColor = NeonCyan
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.CardGiftcard, contentDescription = null, tint = NeonGreen)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = Strings.get("daily_gift_title", currentLang),
                                style = MaterialTheme.typography.titleSmall,
                                color = NeonGreen
                            )
                        }
                        NeonBadge(
                            text = if (giftClaimed) Strings.get("daily_gift_claimed", currentLang) else "+50 Stars",
                            color = if (giftClaimed) Color.Gray else NeonGold
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    NeonButton(
                        text = if (giftClaimed) Strings.get("daily_gift_claimed", currentLang) else Strings.get("claim_daily_gift", currentLang),
                        onClick = { viewModel.claimDailyGift() },
                        primaryColor = NeonGreen,
                        enabled = !giftClaimed
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = Strings.get("free_call_quota", currentLang),
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                            Text(
                                text = "$freeCalls / 3",
                                style = MaterialTheme.typography.titleMedium,
                                color = NeonCyan
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = Strings.get("free_live_quota", currentLang),
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                            Text(
                                text = "${freeLiveSecs / 60}m ${freeLiveSecs % 60}s",
                                style = MaterialTheme.typography.titleMedium,
                                color = NeonCyan
                            )
                        }
                    }
                }
            }

            // Bio Card
            item {
                NeonGlassCard(
                    borderColor = NeonCyan,
                    glowColor = NeonPurple
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Bio & Account Summary", style = MaterialTheme.typography.titleSmall, color = NeonCyan)
                        if (user.bioVerified) {
                            NeonBadge(text = "Verified Bio", color = NeonGreen)
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = user.bio.ifBlank { "No biography added yet." },
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.White
                    )
                }
            }
        }

        // TAB 1: VIP Subscriptions
        if (activeSubTab == 1) {
            item {
                NeonGlassCard(
                    borderColor = NeonGold,
                    glowColor = NeonPink
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.WorkspacePremium, contentDescription = null, tint = NeonGold, modifier = Modifier.size(32.dp))
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text("Exclusive V.Live VIP Passes", style = MaterialTheme.typography.titleMedium, color = NeonGold)
                            Text("Unlock 4K streams, gift discounts & 3D badge", style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                        }
                    }
                }
            }

            items(vipPlans) { plan ->
                NeonGlassCard(
                    borderColor = when(plan.id) {
                        "vip_bronze" -> Color(0xFFCD7F32)
                        "vip_silver" -> Color(0xFFC0C0C0)
                        "vip_gold" -> NeonGold
                        "vip_platinum" -> NeonCyan
                        else -> NeonPurple
                    },
                    glowColor = NeonPurple
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = plan.title,
                                style = MaterialTheme.typography.titleMedium,
                                color = Color.White
                            )
                            Text(
                                text = "Duration: ${plan.durationDays} Days",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "$${plan.usdtPrice} USDT",
                                style = MaterialTheme.typography.titleMedium,
                                color = NeonGreen
                            )
                            Text(
                                text = "or ${plan.starsPrice} Stars",
                                style = MaterialTheme.typography.labelSmall,
                                color = NeonGold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    plan.features.forEach { feature ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(vertical = 2.dp)
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, tint = NeonGreen, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = feature, style = MaterialTheme.typography.labelMedium, color = TextSecondary)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = { viewModel.buyVipPlan(plan) },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonGold),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Buy with USDT", color = Color.Black)
                        }

                        Button(
                            onClick = { viewModel.subscribeToVipWithStars(plan) },
                            colors = ButtonDefaults.buttonColors(containerColor = SurfaceDarkElevated),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Buy with Stars", color = NeonGold)
                        }
                    }
                }
            }
        }

        // TAB 2: Host Settings & Media Vault
        if (activeSubTab == 2) {
            item {
                val isFreeLive by viewModel.isFreeLive.collectAsState()
                val callStarsRate by viewModel.callStarsPerMin.collectAsState()

                NeonGlassCard(
                    borderColor = NeonPink,
                    glowColor = NeonPurple
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.VolunteerActivism, contentDescription = null, tint = NeonPink)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = Strings.get("female_commission_badge", currentLang),
                            style = MaterialTheme.typography.labelMedium,
                            color = NeonPink
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = Strings.get("host_pricing_controls", currentLang),
                        style = MaterialTheme.typography.titleSmall,
                        color = Color.White
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = if (isFreeLive) Strings.get("toggle_free_live", currentLang) else Strings.get("toggle_paid_live", currentLang),
                            style = MaterialTheme.typography.labelMedium,
                            color = TextSecondary
                        )

                        Switch(
                            checked = !isFreeLive,
                            onCheckedChange = { viewModel.setFreeLiveMode(!it) },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = NeonPink,
                                checkedTrackColor = SurfaceDarkElevated
                            )
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = Strings.get("beauty_filter_title", currentLang),
                        style = MaterialTheme.typography.titleSmall,
                        color = NeonPink
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    val activeFilter by viewModel.activeBeautyFilter.collectAsState()
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        com.example.model.BeautyFilter.values().forEach { filter ->
                            FilterChip(
                                selected = activeFilter == filter,
                                onClick = { viewModel.setBeautyFilter(filter) },
                                label = { Text(filter.label) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = Color(filter.neonColor),
                                    selectedLabelColor = Color.Black,
                                    containerColor = SurfaceDarkElevated,
                                    labelColor = TextSecondary
                                ),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "${Strings.get("set_call_rate", currentLang)} $callStarsRate",
                        style = MaterialTheme.typography.labelMedium,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        listOf(10, 20, 30, 50, 100).forEach { rate ->
                            FilterChip(
                                selected = callStarsRate == rate,
                                onClick = { viewModel.setCallStarsPerMinRate(rate) },
                                label = { Text("$rate Stars") },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = NeonPink,
                                    selectedLabelColor = Color.White,
                                    containerColor = SurfaceDarkElevated,
                                    labelColor = TextSecondary
                                )
                            )
                        }
                    }
                }
            }
        }

        // TAB 3: Edit Profile & Messages / Settings
        if (activeSubTab == 3) {
            // Direct Messages Card
            item {
                val directMsgs by viewModel.directMessages.collectAsState()
                val autoTranslate by viewModel.autoTranslateChat.collectAsState()
                var dmInputText by remember { mutableStateOf("") }

                NeonGlassCard(
                    borderColor = NeonCyan,
                    glowColor = NeonPurple
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Chat, contentDescription = null, tint = NeonCyan)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = Strings.get("direct_messages_title", currentLang),
                                style = MaterialTheme.typography.titleSmall,
                                color = Color.White
                            )
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = if (autoTranslate) "Translate: ON" else "Translate: OFF",
                                style = MaterialTheme.typography.labelSmall,
                                color = if (autoTranslate) NeonGreen else TextSecondary
                            )
                            Switch(
                                checked = autoTranslate,
                                onCheckedChange = { viewModel.toggleAutoTranslate() },
                                colors = SwitchDefaults.colors(checkedThumbColor = NeonGreen)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(140.dp)
                            .background(Color(0x44000000), RoundedCornerShape(12.dp))
                            .padding(8.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        LazyColumn(modifier = Modifier.fillMaxSize()) {
                            items(directMsgs) { msg ->
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp)
                                ) {
                                    Text(
                                        text = "@${msg.senderUsername}: ${msg.originalText}",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = if (msg.isSystemMessage) NeonGold else Color.White
                                    )
                                    if (autoTranslate && msg.translatedText.isNotBlank()) {
                                        Text(
                                            text = msg.translatedText,
                                            style = MaterialTheme.typography.labelSmall,
                                            color = NeonCyan
                                        )
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = dmInputText,
                            onValueChange = { dmInputText = it },
                            placeholder = { Text("Send direct message to support...", color = TextMuted) },
                            modifier = Modifier.weight(1f),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = NeonCyan,
                                unfocusedBorderColor = CardBorderNeon,
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White
                            ),
                            shape = RoundedCornerShape(12.dp)
                        )

                        Button(
                            onClick = {
                                if (dmInputText.isNotBlank()) {
                                    viewModel.sendDirectMessage("Support", dmInputText)
                                    dmInputText = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonCyan)
                        ) {
                            Text("Send", color = Color.Black)
                        }
                    }
                }
            }

            // Edit Profile Form Card
            item {
                NeonGlassCard(
                    borderColor = NeonCyan,
                    glowColor = NeonPurple
                ) {
                    Text(
                        text = Strings.get("profile_edit_title", currentLang),
                        style = MaterialTheme.typography.titleMedium,
                        color = NeonCyan
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = displayNameText,
                        onValueChange = { displayNameText = it },
                        label = { Text(Strings.get("display_name_label", currentLang), color = TextSecondary) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = NeonCyan,
                            unfocusedBorderColor = CardBorderNeon,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = usernameText,
                        onValueChange = { usernameText = it },
                        label = { Text(Strings.get("username_label", currentLang), color = TextSecondary) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = NeonCyan,
                            unfocusedBorderColor = CardBorderNeon,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = bioText,
                        onValueChange = { bioText = it },
                        label = { Text("Biography & Profile Summary", color = TextSecondary) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = NeonCyan,
                            unfocusedBorderColor = CardBorderNeon,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(Strings.get("select_gender", currentLang), style = MaterialTheme.typography.labelMedium, color = TextSecondary)
                    Spacer(modifier = Modifier.height(6.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        FilterChip(
                            selected = selectedGender == Gender.FEMALE,
                            onClick = { selectedGender = Gender.FEMALE },
                            label = { Text(Strings.get("gender_female", currentLang)) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = NeonPink,
                                selectedLabelColor = Color.White
                            ),
                            modifier = Modifier.weight(1f)
                        )

                        FilterChip(
                            selected = selectedGender == Gender.MALE,
                            onClick = { selectedGender = Gender.MALE },
                            label = { Text(Strings.get("gender_male", currentLang)) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = NeonCyan,
                                selectedLabelColor = Color.Black
                            ),
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    NeonButton(
                        text = Strings.get("save_profile", currentLang),
                        onClick = {
                            viewModel.updateProfileDetails(displayNameText, usernameText, bioText, selectedGender)
                        },
                        primaryColor = NeonCyan
                    )
                }
            }
        }
    }
}
