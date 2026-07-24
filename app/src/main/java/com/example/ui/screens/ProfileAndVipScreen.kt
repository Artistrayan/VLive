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

    var usernameText by remember(user) { mutableStateOf(user.username) }
    var displayNameText by remember(user) { mutableStateOf(user.displayName) }
    var selectedGender by remember(user) { mutableStateOf(user.gender) }

    val vipPlans = listOf(
        VipPlan(
            id = "vip_1",
            title = "VIP 1 Month Subscription",
            durationDays = 30,
            usdtPrice = 19.99,
            starsPrice = 500,
            features = listOf("Golden 3D VIP Badge", "Neon Highlighted Comments", "Access to Private Video Calls")
        ),
        VipPlan(
            id = "vip_2",
            title = "Super VIP 3 Months 🚀",
            durationDays = 90,
            usdtPrice = 49.99,
            starsPrice = 1200,
            features = listOf("Golden 3D VIP Badge", "20% Discount on Gifts", "24/7 Dedicated Support", "HD Video Stream Quality")
        )
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Direct Messages & Auto-Translate Chat Card
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
                            text = if (autoTranslate) "Auto Translate: ON 🌐" else "Auto Translate: OFF",
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
                        .height(160.dp)
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
                        placeholder = { Text("ارسال پیام مستقیم / Support...", color = TextMuted) },
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
                        Text("ارسال", color = Color.Black)
                    }
                }
            }
        }

        // User Profile Header Card

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
                                .size(90.dp)
                                .clip(CircleShape)
                                .border(2.dp, if (user.isVip) NeonGold else NeonPink, CircleShape),
                            contentScale = ContentScale.Crop
                        )
                        if (user.isVip) {
                            Icon(
                                imageVector = Icons.Default.WorkspacePremium,
                                contentDescription = "VIP",
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
                            Icon(Icons.Default.Verified, contentDescription = "Verified", tint = NeonCyan, modifier = Modifier.size(18.dp))
                        }
                    }

                    Text(
                        text = "@${user.username}",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        NeonBadge(
                            text = if (user.gender == Gender.FEMALE) "Female (Host)" else "Male (Viewer)",
                            color = if (user.gender == Gender.FEMALE) NeonPink else NeonCyan
                        )
                        NeonBadge(text = "+18 Verified 🔞", color = NeonGreen)
                    }
                }
            }
        }

        // Female Host 40% Commission Badge & Pricing Controls (if Female)
        if (user.gender == Gender.FEMALE) {
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
                    Text(
                        text = Strings.get("daily_gift_title", currentLang),
                        style = MaterialTheme.typography.titleSmall,
                        color = NeonGreen
                    )
                    NeonBadge(
                        text = if (giftClaimed) Strings.get("daily_gift_claimed", currentLang) else "+50 Stars 🎁",
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

        // Live Stream Viewing Packages
        item {
            Text(
                text = Strings.get("live_stream_packages", currentLang),
                style = MaterialTheme.typography.titleMedium,
                color = TextPrimary
            )
        }

        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, NeonCyan, RoundedCornerShape(16.dp)),
                    color = SurfaceDarkElevated,
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("3-Day Live Pass 🎟️", style = MaterialTheme.typography.titleSmall, color = NeonCyan)
                        Text("Unlimited Stream Access", style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("$4.99 USDT", style = MaterialTheme.typography.titleMedium, color = Color.White)
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = { viewModel.topUpWallet(4.99, 100) },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonCyan),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Buy", color = Color.Black)
                        }
                    }
                }

                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, NeonPink, RoundedCornerShape(16.dp)),
                    color = SurfaceDarkElevated,
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("Monthly Pass 🌟", style = MaterialTheme.typography.titleSmall, color = NeonPink)
                        Text("All Hosts Unlimited", style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("$14.99 USDT", style = MaterialTheme.typography.titleMedium, color = Color.White)
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = { viewModel.topUpWallet(14.99, 300) },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonPink),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Buy", color = Color.White)
                        }
                    }
                }
            }
        }

        // Private Call Token Packages
        item {
            Text(
                text = Strings.get("private_call_packages", currentLang),
                style = MaterialTheme.typography.titleMedium,
                color = TextPrimary
            )
        }

        item {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, NeonGold, RoundedCornerShape(16.dp)),
                    color = SurfaceDarkElevated,
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("500 Call Stars 🪙", style = MaterialTheme.typography.titleSmall, color = NeonGold)
                        Text("~ 20 Mins Private Call", style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("$9.99 USDT", style = MaterialTheme.typography.titleMedium, color = Color.White)
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = { viewModel.topUpWallet(9.99, 500) },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonGold),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Buy", color = Color.Black)
                        }
                    }
                }

                Surface(
                    modifier = Modifier
                        .weight(1f)
                        .border(1.dp, NeonPurple, RoundedCornerShape(16.dp)),
                    color = SurfaceDarkElevated,
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("2000 Call Stars 💎", style = MaterialTheme.typography.titleSmall, color = NeonPurple)
                        Text("~ 80 Mins HD Call", style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("$29.99 USDT", style = MaterialTheme.typography.titleMedium, color = Color.White)
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = { viewModel.topUpWallet(29.99, 2000) },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonPurple),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Buy", color = Color.White)
                        }
                    }
                }
            }
        }
        item {
            NeonGlassCard(
                borderColor = NeonCyan,
                glowColor = NeonPurple
            ) {
                Text(
                    text = Strings.get("language_switch_title", currentLang),
                    style = MaterialTheme.typography.titleMedium,
                    color = NeonCyan
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    AppLanguage.values().forEach { lang ->
                        FilterChip(
                            selected = currentLang == lang,
                            onClick = { viewModel.setLanguage(lang) },
                            label = { Text(lang.label) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = NeonCyan,
                                selectedLabelColor = Color.Black,
                                containerColor = SurfaceDarkElevated,
                                labelColor = TextSecondary
                            ),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }

        // Edit Profile Form
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
                        viewModel.updateProfile(usernameText, displayNameText, selectedGender)
                    },
                    primaryColor = NeonCyan
                )
            }
        }

        // VIP Purchase Section
        item {
            Text(
                text = Strings.get("buy_vip_title", currentLang),
                style = MaterialTheme.typography.titleMedium,
                color = TextPrimary
            )
        }

        items(vipPlans) { plan ->
            NeonGlassCard(
                borderColor = NeonGold,
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
                            color = NeonGold
                        )
                        Text(
                            text = "Duration: ${plan.durationDays} days",
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = "$${plan.usdtPrice} USDT",
                            style = MaterialTheme.typography.titleMedium,
                            color = Color.White
                        )
                        Text(
                            text = "or ${plan.starsPrice} Stars ⭐️",
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

                NeonButton(
                    text = Strings.get("buy_with_usdt", currentLang),
                    onClick = { viewModel.buyVipPlan(plan) },
                    primaryColor = NeonGold
                )
            }
        }
    }
}
