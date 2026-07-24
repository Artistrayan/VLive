package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.unit.dp
import com.example.model.Gender
import com.example.model.LiveStream
import com.example.ui.theme.*
import com.example.util.AppLanguage
import com.example.util.Strings
import com.example.viewmodel.AppViewModel

@Composable
fun MainMiniAppContainer(
    viewModel: AppViewModel
) {
    var selectedTab by remember { mutableStateOf(0) }
    val activeStream by viewModel.activeStream.collectAsState()
    val userNotification by viewModel.userNotification.collectAsState()
    val user by viewModel.userProfile.collectAsState()
    val currentLang by viewModel.currentLanguage.collectAsState()

    var showStartLiveModal by remember { mutableStateOf(false) }
    var showRulesModal by remember { mutableStateOf(false) }
    var newLiveTitleText by remember { mutableStateOf("") }

    val rulesAccepted by viewModel.rulesAccepted.collectAsState()

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = BackgroundDark,
        topBar = {
            if (activeStream == null) {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    color = Color.Transparent
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "V.LIVE +18",
                                style = MaterialTheme.typography.titleLarge,
                                color = NeonPink
                            )
                        }

                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            // Rules & Terms Modal Trigger Button
                            Surface(
                                modifier = Modifier
                                    .border(1.dp, ErrorRed, RoundedCornerShape(16.dp))
                                    .clickable { showRulesModal = true },
                                color = Color(0x33330000),
                                shape = RoundedCornerShape(16.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Gavel,
                                        contentDescription = "Rules",
                                        tint = ErrorRed,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "قوانین / Rules",
                                        style = MaterialTheme.typography.labelSmall,
                                        color = Color.White
                                    )
                                }
                            }

                            // Language Switcher Button (EN / FA)
                            Surface(
                                modifier = Modifier
                                    .border(1.dp, NeonCyan, RoundedCornerShape(16.dp))
                                    .clickable {
                                        val nextLang = if (currentLang == AppLanguage.ENGLISH) AppLanguage.PERSIAN else AppLanguage.ENGLISH
                                        viewModel.setLanguage(nextLang)
                                    },
                                color = Color(0x33121420),
                                shape = RoundedCornerShape(16.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Language,
                                        contentDescription = "Switch Language",
                                        tint = NeonCyan,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = currentLang.label,
                                        style = MaterialTheme.typography.labelSmall,
                                        color = Color.White
                                    )
                                }
                            }
                        }
                    }
                }
            }
        },
        bottomBar = {
            if (activeStream == null) {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                        .navigationBarsPadding()
                        .border(1.dp, CardBorderNeon, RoundedCornerShape(28.dp)),
                    color = Color(0xDD121420),
                    shape = RoundedCornerShape(28.dp)
                ) {
                    NavigationBar(
                        containerColor = Color.Transparent,
                        contentColor = Color.White
                    ) {
                        NavigationBarItem(
                            selected = selectedTab == 0,
                            onClick = { selectedTab = 0 },
                            icon = { Icon(Icons.Default.LiveTv, contentDescription = "Live Streams") },
                            label = { Text(Strings.get("tab_streams", currentLang)) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = NeonPink,
                                unselectedIconColor = TextSecondary,
                                selectedTextColor = NeonPink,
                                indicatorColor = NeonPink.copy(alpha = 0.2f)
                            )
                        )

                        NavigationBarItem(
                            selected = selectedTab == 1,
                            onClick = { selectedTab = 1 },
                            icon = { Icon(Icons.Default.AccountBalanceWallet, contentDescription = "Wallet") },
                            label = { Text(Strings.get("tab_wallet", currentLang)) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = NeonCyan,
                                unselectedIconColor = TextSecondary,
                                selectedTextColor = NeonCyan,
                                indicatorColor = NeonCyan.copy(alpha = 0.2f)
                            )
                        )

                        NavigationBarItem(
                            selected = selectedTab == 2,
                            onClick = { selectedTab = 2 },
                            icon = { Icon(Icons.Default.Person, contentDescription = "Profile & VIP") },
                            label = { Text(Strings.get("tab_profile", currentLang)) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = NeonGold,
                                unselectedIconColor = TextSecondary,
                                selectedTextColor = NeonGold,
                                indicatorColor = NeonGold.copy(alpha = 0.2f)
                            )
                        )

                        NavigationBarItem(
                            selected = selectedTab == 3,
                            onClick = { selectedTab = 3 },
                            icon = { Icon(Icons.Default.AdminPanelSettings, contentDescription = "Admin") },
                            label = { Text(Strings.get("tab_admin", currentLang)) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = NeonPurple,
                                unselectedIconColor = TextSecondary,
                                selectedTextColor = NeonPurple,
                                indicatorColor = NeonPurple.copy(alpha = 0.2f)
                            )
                        )
                    }
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            if (activeStream != null) {
                VideoCallStreamRoomScreen(
                    viewModel = viewModel,
                    stream = activeStream!!,
                    onCloseClick = { viewModel.selectStream(null) }
                )
            } else {
                when (selectedTab) {
                    0 -> LiveStreamListScreen(
                        viewModel = viewModel,
                        onSelectStream = { stream -> viewModel.selectStream(stream) },
                        onStartLiveClick = { showStartLiveModal = true },
                        onOpenVipClick = { selectedTab = 2 }
                    )
                    1 -> CryptoWalletWithdrawalScreen(viewModel = viewModel)
                    2 -> ProfileAndVipScreen(viewModel = viewModel)
                    3 -> AdminAndAiSecurityScreen(viewModel = viewModel)
                }
            }

            // Global Neon Toast Notification
            AnimatedVisibility(
                visible = userNotification != null,
                enter = fadeIn(),
                exit = fadeOut(),
                modifier = Modifier
                    .align(Alignment.TopCenter)
                    .padding(top = 16.dp, start = 16.dp, end = 16.dp)
            ) {
                userNotification?.let { msg ->
                    Surface(
                        color = Color(0xEE121420),
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(1.2.dp, NeonPink, RoundedCornerShape(20.dp))
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.Notifications, contentDescription = null, tint = NeonCyan)
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = msg,
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.White,
                                modifier = Modifier.weight(1f)
                            )
                            IconButton(
                                onClick = { viewModel.clearNotification() },
                                modifier = Modifier.size(24.dp)
                            ) {
                                Icon(Icons.Default.Close, contentDescription = "Close", tint = TextSecondary)
                            }
                        }
                    }
                }
            }

            // Female Start Live Stream Dialog Modal
            if (showStartLiveModal) {
                AlertDialog(
                    onDismissRequest = { showStartLiveModal = false },
                    containerColor = Color(0xFF16192B),
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Videocam, contentDescription = null, tint = NeonPink)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(Strings.get("start_live_modal_title", currentLang), color = Color.White)
                        }
                    },
                    text = {
                        Column {
                            Text(
                                text = Strings.get("start_live_prompt", currentLang),
                                style = MaterialTheme.typography.bodySmall,
                                color = TextSecondary
                            )
                            Spacer(modifier = Modifier.height(10.dp))
                            OutlinedTextField(
                                value = newLiveTitleText,
                                onValueChange = { newLiveTitleText = it },
                                placeholder = { Text("مثال: چت و گفتگو زنده با طرفداران ✨", color = TextMuted) },
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = NeonPink,
                                    unfocusedBorderColor = CardBorderNeon,
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                shape = RoundedCornerShape(12.dp)
                            )
                        }
                    },
                    confirmButton = {
                        Button(
                            onClick = {
                                if (newLiveTitleText.isNotBlank()) {
                                    viewModel.startFemaleLiveStream(newLiveTitleText)
                                    showStartLiveModal = false
                                    newLiveTitleText = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonPink)
                        ) {
                            Text("شروع بث زنده")
                        }
                    },
                    dismissButton = {
                        TextButton(onClick = { showStartLiveModal = false }) {
                            Text("انصراف", color = TextSecondary)
                        }
                    }
                )
            }

            // Strict App Terms & Rules Dialog Modal (Male vs Female Rules)
            if (showRulesModal) {
                AlertDialog(
                    onDismissRequest = { showRulesModal = false },
                    containerColor = Color(0xFF121420),
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Gavel, contentDescription = null, tint = ErrorRed)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(Strings.get("app_rules_modal_title", currentLang), color = Color.White, style = MaterialTheme.typography.titleMedium)
                        }
                    },
                    text = {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .heightIn(max = 400.dp)
                        ) {
                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.dp, NeonCyan.copy(alpha = 0.5f), RoundedCornerShape(12.dp)),
                                color = Color(0x2200FFFF),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Text(
                                        text = Strings.get("rules_male_title", currentLang),
                                        style = MaterialTheme.typography.titleSmall,
                                        color = NeonCyan
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = Strings.get("rules_male_text", currentLang),
                                        style = MaterialTheme.typography.labelSmall,
                                        color = Color.White
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Surface(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .border(1.dp, NeonPink.copy(alpha = 0.5f), RoundedCornerShape(12.dp)),
                                color = Color(0x22FF007F),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Text(
                                        text = Strings.get("rules_female_title", currentLang),
                                        style = MaterialTheme.typography.titleSmall,
                                        color = NeonPink
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = Strings.get("rules_female_text", currentLang),
                                        style = MaterialTheme.typography.labelSmall,
                                        color = Color.White
                                    )
                                }
                            }
                        }
                    },
                    confirmButton = {
                        Button(
                            onClick = {
                                viewModel.acceptRules()
                                showRulesModal = false
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonGreen),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(Strings.get("rules_accept_button", currentLang), color = Color.Black, style = MaterialTheme.typography.labelSmall)
                        }
                    }
                )
            }
        }
    }
}
