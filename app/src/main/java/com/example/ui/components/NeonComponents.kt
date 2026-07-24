package com.example.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.example.ui.theme.*

@Composable
fun NeonGlassCard(
    modifier: Modifier = Modifier,
    shape: Shape = RoundedCornerShape(24.dp),
    borderColor: Color = NeonCyan,
    glowColor: Color = NeonPurple,
    content: @Composable ColumnScope.() -> Unit
) {
    Box(modifier = modifier) {
        // Glowing background layer
        Box(
            modifier = Modifier
                .matchParentSize()
                .offset(y = 2.dp)
                .clip(shape)
                .background(
                    Brush.radialGradient(
                        colors = listOf(glowColor.copy(alpha = 0.25f), Color.Transparent)
                    )
                )
        )
        // Glassmorphism Card
        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .clip(shape)
                .border(
                    width = 1.2.dp,
                    brush = Brush.linearGradient(
                        colors = listOf(borderColor, borderColor.copy(alpha = 0.2f), glowColor.copy(alpha = 0.6f))
                    ),
                    shape = shape
                ),
            color = Color(0x33121526),
            shape = shape
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                content = content
            )
        }
    }
}

@Composable
fun NeonButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    primaryColor: Color = NeonPink,
    secondaryColor: Color = NeonPurple,
    enabled: Boolean = true,
    icon: (@Composable () -> Unit)? = null
) {
    val infiniteTransition = rememberInfiniteTransition(label = "neon_pulse")
    val alphaPulse by infiniteTransition.animateFloat(
        initialValue = 0.7f,
        targetValue = 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier
            .fillMaxWidth()
            .height(54.dp)
            .border(
                width = 1.5.dp,
                brush = Brush.horizontalGradient(
                    colors = listOf(primaryColor, secondaryColor, primaryColor)
                ),
                shape = RoundedCornerShape(16.dp)
            ),
        colors = ButtonDefaults.buttonColors(
            containerColor = primaryColor.copy(alpha = 0.25f * alphaPulse),
            contentColor = Color.White
        ),
        shape = RoundedCornerShape(16.dp),
        contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (icon != null) {
                icon()
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text(
                text = text,
                style = MaterialTheme.typography.titleMedium,
                color = Color.White
            )
        }
    }
}

@Composable
fun NeonBadge(
    text: String,
    color: Color = NeonCyan,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .border(1.dp, color.copy(alpha = 0.8f), RoundedCornerShape(12.dp)),
        color = color.copy(alpha = 0.15f),
        shape = RoundedCornerShape(12.dp)
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelSmall,
            color = color,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}
