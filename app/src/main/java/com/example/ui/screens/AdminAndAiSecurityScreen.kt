package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.ui.components.NeonBadge
import com.example.ui.components.NeonButton
import com.example.ui.components.NeonGlassCard
import com.example.ui.theme.*
import com.example.viewmodel.AppViewModel

@Composable
fun AdminAndAiSecurityScreen(
    viewModel: AppViewModel
) {
    val aiAlerts by viewModel.aiAlerts.collectAsState()
    val withdrawals by viewModel.withdrawals.collectAsState()
    val userProfile by viewModel.userProfile.collectAsState()
    val userReports by viewModel.userReports.collectAsState()
    val bannedUsernames by viewModel.bannedUsernames.collectAsState()
    val securityLogs by viewModel.securityDeviceLogs.collectAsState()
    val currentLang by viewModel.currentLanguage.collectAsState()


    var selectedTab by remember { mutableStateOf(0) }
    var loginUsernameInput by remember { mutableStateOf("") }
    var loginPasswordInput by remember { mutableStateOf("") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Super Admin Login / Active Status Card
        item {
            NeonGlassCard(
                borderColor = if (userProfile.isSuperAdmin) NeonGold else NeonPurple,
                glowColor = NeonPink
            ) {
                if (!userProfile.isSuperAdmin) {
                    Text(
                        text = com.example.util.Strings.get("super_admin_title", currentLang),
                        style = MaterialTheme.typography.titleMedium,
                        color = NeonGold
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = loginUsernameInput,
                        onValueChange = { loginUsernameInput = it },
                        label = { Text("Username (Rayan)", color = TextSecondary) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = NeonGold,
                            unfocusedBorderColor = CardBorderNeon,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = loginPasswordInput,
                        onValueChange = { loginPasswordInput = it },
                        label = { Text("Password (Rayan0935)", color = TextSecondary) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = NeonGold,
                            unfocusedBorderColor = CardBorderNeon,
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        shape = RoundedCornerShape(12.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    NeonButton(
                        text = com.example.util.Strings.get("login_button", currentLang),
                        onClick = {
                            viewModel.loginSuperAdmin(loginUsernameInput, loginPasswordInput)
                        },
                        primaryColor = NeonGold
                    )
                } else {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = NeonGold, modifier = Modifier.size(28.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = "RAYAN (SUPER ADMIN)",
                                    style = MaterialTheme.typography.titleMedium,
                                    color = NeonGold
                                )
                                Text(
                                    text = com.example.util.Strings.get("super_admin_badge", currentLang),
                                    style = MaterialTheme.typography.labelSmall,
                                    color = NeonGreen
                                )
                            }
                        }
                        NeonBadge(text = "UNLIMITED 👑", color = NeonGold)
                    }
                }
            }
        }

        // Anti-Harassment Notice Warning Banner
        item {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, ErrorRed, RoundedCornerShape(16.dp)),
                color = Color(0x33330000),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Icon(Icons.Default.ReportProblem, contentDescription = "Warning", tint = ErrorRed, modifier = Modifier.size(28.dp))
                    Spacer(modifier = Modifier.width(10.dp))
                    Column {
                        Text(
                            text = com.example.util.Strings.get("harassment_warning_title", currentLang),
                            style = MaterialTheme.typography.titleSmall,
                            color = ErrorRed
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = com.example.util.Strings.get("harassment_warning_text", currentLang),
                            style = MaterialTheme.typography.labelSmall,
                            color = Color.White
                        )
                    }
                }
            }
        }

        // Admin Header Summary & Tabs
        item {
            NeonGlassCard(
                borderColor = NeonPurple,
                glowColor = NeonPink
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.AdminPanelSettings, contentDescription = "Admin", tint = NeonPink)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = com.example.util.Strings.get("admin_panel_title", currentLang),
                                style = MaterialTheme.typography.titleMedium,
                                color = Color.White
                            )
                        }
                    }
                    NeonBadge(text = "ADMIN ACTIVE", color = NeonGreen)
                }

                Spacer(modifier = Modifier.height(14.dp))

                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = selectedTab == 0,
                            onClick = { selectedTab = 0 },
                            label = { Text("AI Security (${aiAlerts.size})") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = NeonPink,
                                selectedLabelColor = Color.White
                            )
                        )

                        FilterChip(
                            selected = selectedTab == 1,
                            onClick = { selectedTab = 1 },
                            label = { Text("Payouts (${withdrawals.count { it.status == "PENDING" }})") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = NeonCyan,
                                selectedLabelColor = Color.Black
                            )
                        )
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(
                            selected = selectedTab == 2,
                            onClick = { selectedTab = 2 },
                            label = { Text("Reports (${userReports.count { it.status == "PENDING" }})") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = ErrorRed,
                                selectedLabelColor = Color.White
                            )
                        )

                        FilterChip(
                            selected = selectedTab == 3,
                            onClick = { selectedTab = 3 },
                            label = { Text("Banned (${bannedUsernames.size})") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = NeonPurple,
                                selectedLabelColor = Color.White
                            )
                        )

                        FilterChip(
                            selected = selectedTab == 4,
                            onClick = { selectedTab = 4 },
                            label = { Text("Security Audit") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = NeonGold,
                                selectedLabelColor = Color.Black
                            )
                        )
                    }

                }
            }
        }

        if (selectedTab == 0) {
            // AI Fraud System Status
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
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Psychology, contentDescription = "AI", tint = NeonCyan, modifier = Modifier.size(28.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = com.example.util.Strings.get("ai_engine_title", currentLang),
                                    style = MaterialTheme.typography.titleSmall,
                                    color = Color.White
                                )
                            }
                        }
                    }
                }
            }

            items(aiAlerts) { alert ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, ErrorRed.copy(alpha = 0.6f), RoundedCornerShape(16.dp)),
                    color = Color(0x33121420),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Warning, contentDescription = null, tint = ErrorRed)
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(
                                    text = "@${alert.username}",
                                    style = MaterialTheme.typography.titleSmall,
                                    color = Color.White
                                )
                            }
                            NeonBadge(text = "Risk: ${alert.riskScore}%", color = ErrorRed)
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = alert.details,
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = alert.timestamp,
                                style = MaterialTheme.typography.labelSmall,
                                color = TextMuted
                            )
                            Button(
                                onClick = { viewModel.banUserAndRevokeSubscription(alert.username) },
                                colors = ButtonDefaults.buttonColors(containerColor = ErrorRed),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
                            ) {
                                Text(com.example.util.Strings.get("block_immediately", currentLang), style = MaterialTheme.typography.labelSmall)
                            }
                        }
                    }
                }
            }
        } else if (selectedTab == 1) {
            // Manual Withdrawal Approval List
            items(withdrawals) { tx ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            1.dp,
                            if (tx.status == "PENDING") NeonGold else CardBorderNeon,
                            RoundedCornerShape(16.dp)
                        ),
                    color = Color(0x33121420),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text(
                                    text = "Host: ${tx.username}",
                                    style = MaterialTheme.typography.titleSmall,
                                    color = Color.White
                                )
                                Text(
                                    text = "Address: ${tx.walletAddress}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = TextSecondary
                                )
                            }
                            NeonBadge(
                                text = tx.status,
                                color = when (tx.status) {
                                    "APPROVED" -> NeonGreen
                                    "REJECTED" -> ErrorRed
                                    else -> NeonGold
                                }
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Amount: $${tx.amountUsdt} USDT", style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                            Text("Admin Fee (30%): $${String.format("%.2f", tx.amountUsdt * 0.30)} USDT", style = MaterialTheme.typography.labelSmall, color = NeonGold)
                        }

                        if (tx.status == "PENDING") {
                            Spacer(modifier = Modifier.height(12.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(
                                    onClick = { viewModel.approveWithdrawal(tx.id) },
                                    colors = ButtonDefaults.buttonColors(containerColor = NeonGreen),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text(com.example.util.Strings.get("approve_payout", currentLang), color = Color.Black)
                                }
                                Button(
                                    onClick = { viewModel.rejectWithdrawal(tx.id) },
                                    colors = ButtonDefaults.buttonColors(containerColor = ErrorRed),
                                    modifier = Modifier.weight(1f)
                                ) {
                                    Text(com.example.util.Strings.get("reject_request", currentLang))
                                }
                            }
                        }
                    }
                }
            }
        } else if (selectedTab == 2) {
            // User Reports List
            items(userReports) { report ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, ErrorRed, RoundedCornerShape(16.dp)),
                    color = Color(0x33121420),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Reported User: @${report.reportedUsername}",
                                style = MaterialTheme.typography.titleSmall,
                                color = Color.White
                            )
                            NeonBadge(text = report.status, color = if (report.status == "PENDING") ErrorRed else NeonGreen)
                        }

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = "Reporter: @${report.reporterUsername} • Reason: ${report.reason}",
                            style = MaterialTheme.typography.bodySmall,
                            color = TextSecondary
                        )
                        Text(
                            text = report.timestamp,
                            style = MaterialTheme.typography.labelSmall,
                            color = TextMuted
                        )

                        if (report.status == "PENDING") {
                            Spacer(modifier = Modifier.height(10.dp))
                            Button(
                                onClick = { viewModel.banUserAndRevokeSubscription(report.reportedUsername) },
                                colors = ButtonDefaults.buttonColors(containerColor = ErrorRed),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text(com.example.util.Strings.get("ban_user_button", currentLang), style = MaterialTheme.typography.labelSmall)
                            }
                        }
                    }
                }
            }
        } else if (selectedTab == 3) {
            // Banned Users Tab
            items(bannedUsernames) { bannedUser ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, ErrorRed.copy(alpha = 0.4f), RoundedCornerShape(16.dp)),
                    color = Color(0x22121420),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Block, contentDescription = null, tint = ErrorRed)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("@$bannedUser", style = MaterialTheme.typography.titleSmall, color = Color.White)
                        }
                        NeonBadge(text = "PERMANENTLY BANNED (0 REFUND)", color = ErrorRed)
                    }
                }
            }
        } else {
            // Security Audit & Anti-Capture Logs
            items(securityLogs) { log ->
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, NeonGold.copy(alpha = 0.5f), RoundedCornerShape(16.dp)),
                    color = Color(0x33121420),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("User: @${log.username}", style = MaterialTheme.typography.titleSmall, color = Color.White)
                            NeonBadge(text = "FLAG_SECURE ACTIVE 🛡️", color = NeonGreen)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("IP: ${log.ipAddress} • Device: ${log.deviceModel}", style = MaterialTheme.typography.bodySmall, color = TextSecondary)
                        Text("Timestamp: ${log.timestamp}", style = MaterialTheme.typography.labelSmall, color = TextMuted)
                    }
                }
            }
        }
    }
}


