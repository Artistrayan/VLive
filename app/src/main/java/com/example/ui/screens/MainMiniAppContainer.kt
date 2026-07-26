package com.example.ui.screens

import android.annotation.SuppressLint
import android.os.Build
import android.util.Log
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.*
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebViewAssetLoader
import com.example.ui.components.NeonBadge
import com.example.ui.components.NeonGlassCard
import com.example.ui.theme.*
import com.example.util.AppLanguage
import com.example.util.Strings
import com.example.viewmodel.AppViewModel

@SuppressLint("SetJavaScriptEnabled")
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainMiniAppContainer(
    viewModel: AppViewModel
) {
    val currentLang by viewModel.currentLanguage.collectAsState()
    val activeStream by viewModel.activeStream.collectAsState()
    val notificationMsg by viewModel.userNotification.collectAsState()
    val userProfile by viewModel.userProfile.collectAsState()
    val isOled by viewModel.isOledDeepBlack.collectAsState()

    var selectedTab by remember { mutableStateOf(0) } // 0: Streams, 1: Wallet, 2: Profile & VIP, 3: Admin & AI Security, 4: Web Mini App
    var showStartLiveDialog by remember { mutableStateOf(false) }
    var streamTitleInput by remember { mutableStateOf("") }

    // Request permissions
    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { _ -> }

    LaunchedEffect(Unit) {
        val permissions = mutableListOf(
            android.Manifest.permission.CAMERA,
            android.Manifest.permission.RECORD_AUDIO
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            permissions.add(android.Manifest.permission.POST_NOTIFICATIONS)
            permissions.add(android.Manifest.permission.READ_MEDIA_IMAGES)
            permissions.add(android.Manifest.permission.READ_MEDIA_VIDEO)
        } else {
            permissions.add(android.Manifest.permission.READ_EXTERNAL_STORAGE)
        }
        permissionLauncher.launch(permissions.toTypedArray())
    }

    Scaffold(
        topBar = {
            if (activeStream == null) {
                TopAppBar(
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Videocam,
                                contentDescription = "Logo",
                                tint = NeonPink,
                                modifier = Modifier.size(28.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "V.Live+ 3D Neon",
                                style = MaterialTheme.typography.titleMedium,
                                color = NeonCyan
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            NeonBadge(text = "LIVE", color = NeonPink)
                        }
                    },
                    actions = {
                        // User Balance Badge
                        Surface(
                            modifier = Modifier
                                .border(1.dp, NeonGold.copy(alpha = 0.6f), RoundedCornerShape(20.dp))
                                .clickable { selectedTab = 1 },
                            color = Color(0x33FFB800),
                            shape = RoundedCornerShape(20.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Default.Stars, contentDescription = null, tint = NeonGold, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = "${userProfile.starsBalance}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = NeonGold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.width(8.dp))

                        // Language Switcher Button (EN / FA)
                        IconButton(onClick = {
                            viewModel.setLanguage(if (currentLang == AppLanguage.PERSIAN) AppLanguage.ENGLISH else AppLanguage.PERSIAN)
                        }) {
                            Icon(
                                imageVector = Icons.Default.Translate,
                                contentDescription = "Language",
                                tint = NeonCyan
                            )
                        }

                        // OLED Deep Black Theme Toggle Button
                        IconButton(onClick = { viewModel.toggleOledTheme() }) {
                            Icon(
                                imageVector = if (isOled) Icons.Default.Brightness2 else Icons.Default.WbSunny,
                                contentDescription = "OLED Theme",
                                tint = if (isOled) NeonPurple else NeonGold
                            )
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = if (isOled) Color.Black else SurfaceDarkElevated
                    )
                )
            }
        },
        bottomBar = {
            if (activeStream == null) {
                NavigationBar(
                    containerColor = if (isOled) Color.Black else SurfaceDarkElevated,
                    tonalElevation = 8.dp
                ) {
                    val navItems = listOf(
                        Triple(0, if (currentLang == AppLanguage.PERSIAN) "مینی اپ تلگرام" else "Telegram Mini App", Icons.Default.Language),
                        Triple(1, if (currentLang == AppLanguage.PERSIAN) "پخش زنده" else "Live Streams", Icons.Default.Videocam),
                        Triple(2, if (currentLang == AppLanguage.PERSIAN) "کیف پول" else "Crypto Wallet", Icons.Default.AccountBalanceWallet),
                        Triple(3, if (currentLang == AppLanguage.PERSIAN) "پروفایل VIP" else "Profile VIP", Icons.Default.Person),
                        Triple(4, if (currentLang == AppLanguage.PERSIAN) "امنیت و مدیریت" else "Admin & AI", Icons.Default.AdminPanelSettings)
                    )

                    navItems.forEach { (index, label, icon) ->
                        NavigationBarItem(
                            selected = selectedTab == index,
                            onClick = { selectedTab = index },
                            icon = {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = label,
                                    tint = if (selectedTab == index) NeonCyan else TextMuted
                                )
                            },
                            label = {
                                Text(
                                    text = label,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = if (selectedTab == index) NeonCyan else TextMuted
                                )
                            },
                            colors = NavigationBarItemDefaults.colors(
                                indicatorColor = NeonCyan.copy(alpha = 0.15f)
                            )
                        )
                    }
                }
            }
        },
        containerColor = if (isOled) Color.Black else BackgroundDark
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Active 3D Video Stream Room Overlay
            if (activeStream != null) {
                VideoCallStreamRoomScreen(
                    viewModel = viewModel,
                    stream = activeStream!!,
                    onCloseClick = { viewModel.selectStream(null) }
                )
            } else {
                // Main Tab Switcher
                when (selectedTab) {
                    0 -> WebMiniAppView()
                    1 -> LiveStreamListScreen(
                        viewModel = viewModel,
                        onSelectStream = { stream -> viewModel.selectStream(stream) },
                        onStartLiveClick = { showStartLiveDialog = true },
                        onOpenVipClick = { selectedTab = 3 }
                    )
                    2 -> CryptoWalletWithdrawalScreen(viewModel = viewModel)
                    3 -> ProfileAndVipScreen(viewModel = viewModel)
                    4 -> AdminAndAiSecurityScreen(viewModel = viewModel)
                }
            }

            // Global Notification Toast Banner
            notificationMsg?.let { msg ->
                Surface(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 16.dp, start = 16.dp, end = 16.dp)
                        .border(1.dp, NeonCyan, RoundedCornerShape(20.dp)),
                    color = Color(0xEE121420),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Default.Info, contentDescription = null, tint = NeonCyan, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = msg,
                            style = MaterialTheme.typography.bodySmall,
                            color = Color.White
                        )
                    }
                }
            }

            // Female Host Start Stream Dialog
            if (showStartLiveDialog) {
                AlertDialog(
                    onDismissRequest = { showStartLiveDialog = false },
                    containerColor = Color(0xFF121420),
                    title = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.RadioButtonChecked, contentDescription = null, tint = NeonPink)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Start Female Creator Stream", color = Color.White, style = MaterialTheme.typography.titleMedium)
                        }
                    },
                    text = {
                        Column {
                            Text(
                                text = "Enter broadcast title for your live video call room:",
                                style = MaterialTheme.typography.bodySmall,
                                color = TextSecondary
                            )
                            Spacer(modifier = Modifier.height(12.dp))
                            OutlinedTextField(
                                value = streamTitleInput,
                                onValueChange = { streamTitleInput = it },
                                placeholder = { Text("Nightly 3D Neon Live Broadcast...", color = TextMuted) },
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = NeonPink,
                                    unfocusedBorderColor = CardBorderNeon,
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                shape = RoundedCornerShape(12.dp),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }
                    },
                    confirmButton = {
                        Button(
                            onClick = {
                                if (streamTitleInput.isNotBlank()) {
                                    viewModel.startFemaleLiveStream(streamTitleInput)
                                    showStartLiveDialog = false
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = NeonPink)
                        ) {
                            Text("Start Stream", color = Color.White)
                        }
                    },
                    dismissButton = {
                        TextButton(onClick = { showStartLiveDialog = false }) {
                            Text("Cancel", color = TextSecondary)
                        }
                    }
                )
            }
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun WebMiniAppView() {
    AndroidView(
        factory = { context ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                WebView.setWebContentsDebuggingEnabled(true)
            }

            val assetLoader = WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context))
                .build()

            WebView(context).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )

                setBackgroundColor(android.graphics.Color.BLACK)

                webViewClient = object : WebViewClient() {
                    override fun shouldInterceptRequest(
                        view: WebView?,
                        request: WebResourceRequest?
                    ): WebResourceResponse? {
                        return request?.url?.let { assetLoader.shouldInterceptRequest(it) }
                    }

                    override fun onReceivedError(
                        view: WebView?,
                        request: WebResourceRequest?,
                        error: WebResourceError?
                    ) {
                        Log.e("WebMiniAppView", "WebView Error: ${error?.description} (code: ${error?.errorCode})")
                    }
                }

                webChromeClient = object : WebChromeClient() {
                    override fun onPermissionRequest(request: PermissionRequest?) {
                        post {
                            request?.grant(request.resources)
                        }
                    }

                    override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                        Log.d(
                            "WebMiniAppView",
                            "JS Console [${consoleMessage?.messageLevel()}]: ${consoleMessage?.message()} -- line ${consoleMessage?.lineNumber()} of ${consoleMessage?.sourceId()}"
                        )
                        return true
                    }
                }

                settings.apply {
                    javaScriptEnabled = true
                    domStorageEnabled = true
                    databaseEnabled = true
                    allowFileAccess = true
                    allowContentAccess = true
                    allowFileAccessFromFileURLs = true
                    allowUniversalAccessFromFileURLs = true
                    loadWithOverviewMode = true
                    useWideViewPort = true
                    mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
                    mediaPlaybackRequiresUserGesture = false
                }

                loadUrl("https://appassets.androidplatform.net/assets/www/index.html")
            }
        },
        modifier = Modifier.fillMaxSize()
    )
}
