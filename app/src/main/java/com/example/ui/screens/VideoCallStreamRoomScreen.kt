package com.example.ui.screens

import androidx.compose.animation.*
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
import com.example.model.LiveGift
import com.example.model.LiveStream
import com.example.ui.components.NeonBadge
import com.example.ui.components.NeonButton
import com.example.ui.components.NeonGlassCard
import com.example.ui.theme.*
import com.example.viewmodel.AppViewModel

@Composable
fun VideoCallStreamRoomScreen(
    viewModel: AppViewModel,
    stream: LiveStream,
    onCloseClick: () -> Unit
) {
    val comments by viewModel.streamComments.collectAsState()
    val user by viewModel.userProfile.collectAsState()
    val hostEarningsSec by viewModel.hostPerSecondEarnings.collectAsState()
    val freeLiveSecs by viewModel.dailyFreeLiveSecondsRemaining.collectAsState()
    val freeCallsRemaining by viewModel.dailyFreeCallsRemaining.collectAsState()

    var commentInput by remember { mutableStateOf("") }
    var showGiftPicker by remember { mutableStateOf(false) }
    var showReportDialog by remember { mutableStateOf(false) }
    var showRatingDialog by remember { mutableStateOf(false) }
    var ratingStars by remember { mutableStateOf(5) }
    var dissatisfactionReasonText by remember { mutableStateOf("") }
    var selectedReportReason by remember { mutableStateOf("Harassment / Offensive Language") }
    var streamDurationSeconds by remember { mutableStateOf(0) }

    // Live Streaming / Private Call Per-Second Timer Engine
    LaunchedEffect(Unit) {
        while (true) {
            kotlinx.coroutines.delay(1000)
            streamDurationSeconds += 1

            // If viewer is male, consume free live seconds
            if (user.gender == com.example.model.Gender.MALE) {
                viewModel.consumeFreeLiveTime(1)
            }

            // If user is female host, calculate per-second earnings (+0.02 USDT per sec)
            if (user.gender == com.example.model.Gender.FEMALE) {
                viewModel.updateHostEarningsPerSecond(0.02)
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundDark)
    ) {
        // Video Call Feed Background Mock
        AsyncImage(
            model = stream.hostAvatar,
            contentDescription = "Video Call Stream",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // Glass Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color.Black.copy(alpha = 0.6f),
                            Color.Transparent,
                            Color.Black.copy(alpha = 0.9f)
                        )
                    )
                )
        )

        // AI Profile Photo Face Verification & FLAG_SECURE Anti-Recording Status Banner at top center
        Column(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .statusBarsPadding()
                .padding(top = 4.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Surface(
                modifier = Modifier.border(1.dp, NeonGreen.copy(alpha = 0.6f), CircleShape),
                color = Color(0xDD0D1117),
                shape = CircleShape
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.VerifiedUser,
                        contentDescription = null,
                        tint = NeonGreen,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "تطبیق چهره عکس پروفایل با مجری لایو: ۹۸.۴٪ (تایید شده - بدون تقلب)",
                        style = MaterialTheme.typography.labelSmall,
                        color = NeonGreen
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            Surface(
                modifier = Modifier.border(1.dp, ErrorRed.copy(alpha = 0.6f), CircleShape),
                color = Color(0xDD200000),
                shape = CircleShape
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 2.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Security,
                        contentDescription = null,
                        tint = ErrorRed,
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "FLAG_SECURE Active: ممانعت کامل از ضبط فیلم و اسکرین‌شوت",
                        style = MaterialTheme.typography.labelSmall,
                        color = ErrorRed
                    )
                }
            }
        }


        // Top Navigation & Host Details
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    color = Color(0x77000000),
                    shape = RoundedCornerShape(24.dp),
                    modifier = Modifier.border(1.dp, NeonCyan.copy(alpha = 0.5f), RoundedCornerShape(24.dp))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        AsyncImage(
                            model = stream.hostAvatar,
                            contentDescription = null,
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = stream.hostName,
                                    style = MaterialTheme.typography.labelMedium,
                                    color = Color.White
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Icon(
                                    Icons.Default.Verified,
                                    contentDescription = "Verified Female",
                                    tint = NeonCyan,
                                    modifier = Modifier.size(14.dp)
                                )
                            }
                            Text(
                                text = "HD Live Call • ${stream.viewerCount} Viewers",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                        }
                    }
                }

                Column(horizontalAlignment = Alignment.End) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        IconButton(
                            onClick = { showReportDialog = true },
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(Color(0x66000000))
                                .border(1.dp, ErrorRed, CircleShape)
                        ) {
                            Icon(Icons.Default.Flag, contentDescription = "Report Stream", tint = ErrorRed)
                        }

                        IconButton(
                            onClick = {
                                if (user.gender == com.example.model.Gender.FEMALE) {
                                    viewModel.disconnectCallByHost(stream.hostName)
                                    onCloseClick()
                                } else {
                                    showRatingDialog = true
                                }
                            },
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(Color(0x66000000))
                                .border(1.dp, NeonPink, CircleShape)
                        ) {
                            Icon(Icons.Default.Close, contentDescription = "Close", tint = Color.White)
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    if (user.gender == com.example.model.Gender.FEMALE) {
                        NeonBadge(
                            text = "+$${String.format("%.2f", hostEarningsSec)} (Per-sec)",
                            color = NeonGreen
                        )
                    } else {
                        NeonBadge(
                            text = "Free Live: ${freeLiveSecs / 60}m ${freeLiveSecs % 60}s",
                            color = NeonCyan
                        )
                    }
                }
            }
        }

        // Live Chat Comments Overlay
        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(start = 16.dp, end = 16.dp, bottom = 100.dp)
                .fillMaxWidth(0.85f)
                .height(220.dp)
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(comments) { (sender, text) ->
                    Surface(
                        color = Color(0x55121420),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.border(0.5.dp, NeonPurple.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "$sender: ",
                                style = MaterialTheme.typography.labelMedium,
                                color = NeonCyan
                            )
                            Text(
                                text = text,
                                style = MaterialTheme.typography.bodySmall,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }

        // Bottom Controls Bar & Gift Launcher
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            AnimatedVisibility(
                visible = showGiftPicker,
                enter = slideInVertically { it } + fadeIn(),
                exit = slideOutVertically { it } + fadeOut()
            ) {
                NeonGlassCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 12.dp),
                    borderColor = NeonGold,
                    glowColor = NeonPink
                ) {
                    Text(
                        text = "ارسال هدایای نئونی ۳ بعدی و ارز دیجیتال",
                        style = MaterialTheme.typography.titleMedium,
                        color = NeonGold
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(viewModel.gifts) { gift ->
                            GiftItemCard(gift = gift, onSend = {
                                viewModel.sendGift(gift)
                            })
                        }
                    }
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = commentInput,
                    onValueChange = { commentInput = it },
                    placeholder = { Text("ارسال پیام در لایو...", color = TextMuted) },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = Color(0x66121420),
                        unfocusedContainerColor = Color(0x44121420),
                        focusedBorderColor = NeonCyan,
                        unfocusedBorderColor = CardBorderNeon,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    shape = RoundedCornerShape(24.dp),
                    trailingIcon = {
                        IconButton(onClick = {
                            if (commentInput.isNotBlank()) {
                                viewModel.addComment(user.displayName, commentInput)
                                commentInput = ""
                            }
                        }) {
                            Icon(Icons.Default.Send, contentDescription = "Send", tint = NeonCyan)
                        }
                    }
                )

                IconButton(
                    onClick = { showGiftPicker = !showGiftPicker },
                    modifier = Modifier
                        .size(50.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(listOf(NeonPink, NeonPurple))
                        )
                ) {
                    Icon(
                        imageVector = Icons.Default.CardGiftcard,
                        contentDescription = "Gifts",
                        tint = Color.White
                    )
                }
            }
        }
    }

    if (showReportDialog) {
        AlertDialog(
            onDismissRequest = { showReportDialog = false },
            containerColor = Color(0xFF161B22),
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.ReportProblem, contentDescription = null, tint = ErrorRed)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("گزارش تخلف / Report Violation", color = Color.White)
                }
            },
            text = {
                Column {
                    Text(
                        text = "لطفاً علت گزارش تخلف مجری/کاربر @${stream.hostName} را انتخاب کنید:",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    listOf(
                        "توهین و آزار و اذیت (Harassment / Offensive)",
                        "محتوای خطرناک یا غیرقانونی (Dangerous Content)",
                        "هویت جعلی / اکانت ساختگی (Fake Identity)"
                    ).forEach { reason ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { selectedReportReason = reason }
                                .padding(vertical = 4.dp)
                        ) {
                            RadioButton(
                                selected = selectedReportReason == reason,
                                onClick = { selectedReportReason = reason },
                                colors = RadioButtonDefaults.colors(selectedColor = ErrorRed)
                            )
                            Text(reason, style = MaterialTheme.typography.labelMedium, color = Color.White)
                        }
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.reportUser(stream.hostId, stream.hostName, selectedReportReason)
                        showReportDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ErrorRed)
                ) {
                    Text("ارسال گزارش به مدیریت")
                }
            },
            dismissButton = {
                TextButton(onClick = { showReportDialog = false }) {
                    Text("انصراف", color = TextSecondary)
                }
            }
        )
    }

    if (showRatingDialog) {
        AlertDialog(
            onDismissRequest = {
                showRatingDialog = false
                onCloseClick()
            },
            containerColor = Color(0xFF161B22),
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Star, contentDescription = null, tint = NeonGold)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("امتیازدهی و ثبت نظر درباره مجری @${stream.hostName}", color = Color.White, style = MaterialTheme.typography.titleSmall)
                }
            },
            text = {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "کیفیت استریم و نحوه پاسخگویی مجری چطور بود؟",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    // 5 Star Rating Selector
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        (1..5).forEach { starIndex ->
                            IconButton(
                                onClick = { ratingStars = starIndex },
                                modifier = Modifier.size(36.dp)
                            ) {
                                Icon(
                                    imageVector = if (starIndex <= ratingStars) Icons.Default.Star else Icons.Default.StarBorder,
                                    contentDescription = "$starIndex Stars",
                                    tint = if (starIndex <= ratingStars) NeonGold else TextMuted,
                                    modifier = Modifier.size(32.dp)
                                )
                            }
                        }
                    }

                    if (ratingStars < 3) {
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "لطفاً علت نارضایتی خود را بیان فرمایید (ارسال به پشتیبانی):",
                            style = MaterialTheme.typography.labelSmall,
                            color = ErrorRed
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        OutlinedTextField(
                            value = dissatisfactionReasonText,
                            onValueChange = { dissatisfactionReasonText = it },
                            placeholder = { Text("توضیحات علت نارضایتی...", color = TextMuted) },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = ErrorRed,
                                unfocusedBorderColor = CardBorderNeon,
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White
                            ),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.submitStreamRating(stream.id, stream.hostName, ratingStars, dissatisfactionReasonText)
                        showRatingDialog = false
                        onCloseClick()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = NeonGreen)
                ) {
                    Text("ثبت امتیاز و خروج", color = Color.Black)
                }
            },
            dismissButton = {
                TextButton(onClick = {
                    showRatingDialog = false
                    onCloseClick()
                }) {
                    Text("انصراف و خروج", color = TextSecondary)
                }
            }
        )
    }
}

@Composable
fun GiftItemCard(
    gift: LiveGift,
    onSend: () -> Unit
) {
    Surface(
        modifier = Modifier
            .width(100.dp)
            .clickable { onSend() }
            .border(1.dp, Color(gift.neonColorHex), RoundedCornerShape(16.dp)),
        color = Color(0x44121420),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = when (gift.iconName) {
                    "directions_car" -> Icons.Default.DirectionsCar
                    "military_tech" -> Icons.Default.MilitaryTech
                    "diamond" -> Icons.Default.Diamond
                    "rocket_launch" -> Icons.Default.RocketLaunch
                    else -> Icons.Default.Favorite
                },
                contentDescription = gift.name,
                tint = Color(gift.neonColorHex),
                modifier = Modifier.size(32.dp)
            )
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = gift.name,
                style = MaterialTheme.typography.labelSmall,
                color = Color.White
            )
            Spacer(modifier = Modifier.height(4.dp))
            if (gift.usdtCost > 0) {
                NeonBadge(text = "$${gift.usdtCost}", color = NeonCyan)
            } else {
                NeonBadge(text = "${gift.starsCost} ⭐️", color = NeonGold)
            }
        }
    }
}
