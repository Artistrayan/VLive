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
import com.example.model.Gender
import com.example.ui.components.NeonBadge
import com.example.ui.components.NeonButton
import com.example.ui.components.NeonGlassCard
import com.example.ui.theme.*
import com.example.util.Strings
import com.example.viewmodel.AppViewModel

@Composable
fun CryptoWalletWithdrawalScreen(
    viewModel: AppViewModel
) {
    val user by viewModel.userProfile.collectAsState()
    val withdrawals by viewModel.withdrawals.collectAsState()
    val currentLang by viewModel.currentLanguage.collectAsState()

    var withdrawAmountText by remember { mutableStateOf("") }
    var walletAddressText by remember { mutableStateOf("0x71C7656EC7ab88b098defB751B7401B5f6d8976F") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Wallet Overview Cards
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
                    Text(
                        text = Strings.get("wallet_title", currentLang),
                        style = MaterialTheme.typography.titleMedium,
                        color = NeonCyan
                    )
                    NeonBadge(text = "USDT (TRC20 / TON)", color = NeonGold)
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(
                            text = Strings.get("usdt_balance", currentLang),
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )
                        Text(
                            text = "$${String.format("%.2f", user.usdtBalance)}",
                            style = MaterialTheme.typography.headlineMedium,
                            color = Color.White
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = Strings.get("stars_balance", currentLang),
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )
                        Text(
                            text = "⭐️ ${user.starsBalance}",
                            style = MaterialTheme.typography.headlineMedium,
                            color = NeonGold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(
                        onClick = { viewModel.topUpWallet(50.0, 500) },
                        colors = ButtonDefaults.buttonColors(containerColor = NeonPurple),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.AddCard, contentDescription = null, tint = Color.White)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(Strings.get("quick_topup_50", currentLang))
                    }

                    Button(
                        onClick = { viewModel.topUpWallet(0.0, 1000) },
                        colors = ButtonDefaults.buttonColors(containerColor = NeonGold),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Default.Star, contentDescription = null, tint = Color.Black)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(Strings.get("buy_1000_stars", currentLang), color = Color.Black)
                    }
                }
            }
        }

        // Official Deposit TRC20 Wallet Card
        item {
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
                        Icon(
                            imageVector = Icons.Default.QrCodeScanner,
                            contentDescription = "Deposit TRC20",
                            tint = NeonGreen,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = Strings.get("deposit_usdt_title", currentLang),
                            style = MaterialTheme.typography.titleSmall,
                            color = Color.White
                        )
                    }
                    NeonBadge(text = "TRC20", color = NeonGreen)
                }

                Spacer(modifier = Modifier.height(10.dp))

                Surface(
                    color = Color(0xFF0D1117),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, NeonGreen.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "TRC20 Address:",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextSecondary
                            )
                            Text(
                                text = viewModel.officialDepositAddress,
                                style = MaterialTheme.typography.bodySmall,
                                color = NeonGreen
                            )
                        }

                        IconButton(onClick = {
                            viewModel.showNotification("آدرس TRC20 با موفقیت کپی شد! 📋")
                        }) {
                            Icon(Icons.Default.ContentCopy, contentDescription = "Copy Address", tint = NeonCyan)
                        }
                    }
                }
            }
        }
        item {
            NeonGlassCard(
                borderColor = NeonPink,
                glowColor = NeonPurple
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.CurrencyExchange,
                        contentDescription = "Withdrawal",
                        tint = NeonPink,
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = Strings.get("withdrawal_section_title", currentLang),
                        style = MaterialTheme.typography.titleSmall,
                        color = Color.White
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Rule Disclaimer Box
                Surface(
                    color = SurfaceDarkElevated.copy(alpha = 0.8f),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.border(1.dp, NeonPink.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            text = Strings.get("withdrawal_rule_1", currentLang),
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )
                        Text(
                            text = Strings.get("withdrawal_rule_2", currentLang),
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )
                        Text(
                            text = Strings.get("withdrawal_rule_3", currentLang),
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = withdrawAmountText,
                    onValueChange = { withdrawAmountText = it },
                    label = { Text(Strings.get("withdraw_amount_label", currentLang), color = TextSecondary) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = NeonPink,
                        unfocusedBorderColor = CardBorderNeon,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(10.dp))

                OutlinedTextField(
                    value = walletAddressText,
                    onValueChange = { walletAddressText = it },
                    label = { Text(Strings.get("wallet_address_label", currentLang), color = TextSecondary) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = NeonCyan,
                        unfocusedBorderColor = CardBorderNeon,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )

                Spacer(modifier = Modifier.height(14.dp))

                val amountDouble = withdrawAmountText.toDoubleOrNull() ?: 0.0
                val netPayout = if (amountDouble > 1.5) (amountDouble * 0.70) - 1.5 else 0.0

                if (amountDouble > 0) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(Strings.get("net_payout", currentLang), style = MaterialTheme.typography.labelSmall, color = TextSecondary)
                        Text("$${String.format("%.2f", netPayout)} USDT", style = MaterialTheme.typography.labelMedium, color = NeonGreen)
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                }

                NeonButton(
                    text = Strings.get("submit_withdrawal", currentLang),
                    onClick = {
                        viewModel.requestWithdrawal(amountDouble, walletAddressText)
                        withdrawAmountText = ""
                    },
                    primaryColor = NeonPink,
                    enabled = user.gender == Gender.FEMALE && amountDouble > 0
                )
            }
        }

        // Withdrawal History
        item {
            Text(
                text = Strings.get("withdrawal_history", currentLang),
                style = MaterialTheme.typography.titleMedium,
                color = TextPrimary
            )
        }

        items(withdrawals) { tx ->
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, CardBorderNeon, RoundedCornerShape(16.dp)),
                color = Color(0x33121420),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Request $${tx.amountUsdt} USDT",
                                style = MaterialTheme.typography.bodyMedium,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            NeonBadge(
                                text = when(tx.status) {
                                    "APPROVED" -> Strings.get("approved", currentLang)
                                    "REJECTED" -> Strings.get("rejected", currentLang)
                                    else -> Strings.get("pending_approval", currentLang)
                                },
                                color = when(tx.status) {
                                    "APPROVED" -> NeonGreen
                                    "REJECTED" -> ErrorRed
                                    else -> NeonGold
                                }
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Net Payout: $${String.format("%.2f", tx.netPayoutUsdt)} • ${tx.requestedAt}",
                            style = MaterialTheme.typography.labelSmall,
                            color = TextSecondary
                        )
                    }
                }
            }
        }
    }
}
