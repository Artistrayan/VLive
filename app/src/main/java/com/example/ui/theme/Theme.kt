package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val NeonDarkColorScheme = darkColorScheme(
    primary = NeonPink,
    onPrimary = Color.White,
    primaryContainer = NeonPurple,
    onPrimaryContainer = Color.White,
    secondary = NeonCyan,
    onSecondary = Color.Black,
    tertiary = NeonGold,
    background = BackgroundDark,
    onBackground = TextPrimary,
    surface = SurfaceDark,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceDarkElevated,
    onSurfaceVariant = TextSecondary,
    outline = CardBorderNeon
)

private val OledDarkColorScheme = darkColorScheme(
    primary = NeonPink,
    onPrimary = Color.White,
    primaryContainer = NeonPurple,
    onPrimaryContainer = Color.White,
    secondary = NeonCyan,
    onSecondary = Color.Black,
    tertiary = NeonGold,
    background = BackgroundOledBlack,
    onBackground = TextPrimary,
    surface = SurfaceOledBlack,
    onSurface = TextPrimary,
    surfaceVariant = SurfaceOledElevated,
    onSurfaceVariant = TextSecondary,
    outline = CardBorderNeon
)

@Composable
fun MyApplicationTheme(
    isOledDeepBlack: Boolean = false,
    content: @Composable () -> Unit
) {
    val activeColorScheme = if (isOledDeepBlack) OledDarkColorScheme else NeonDarkColorScheme

    MaterialTheme(
        colorScheme = activeColorScheme,
        typography = Typography,
        content = content
    )
}
