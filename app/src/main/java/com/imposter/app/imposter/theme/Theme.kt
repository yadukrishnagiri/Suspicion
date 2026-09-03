package com.imposter.app.imposter.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = NeonCyan,
    onPrimary = CyberBackground,
    primaryContainer = CyberSurfaceElevated,
    onPrimaryContainer = NeonCyan,
    secondary = NeonAmber,
    onSecondary = CyberBackground,
    tertiary = NeonPurple,
    error = NeonCrimson,
    onError = TextPrimary,
    background = CyberBackground,
    onBackground = TextPrimary,
    surface = CyberSurface,
    onSurface = TextPrimary,
    surfaceVariant = CyberSurfaceElevated,
    onSurfaceVariant = TextSecondary,
    outline = CyberSurfaceBorder
)

@Composable
fun ImposterTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
