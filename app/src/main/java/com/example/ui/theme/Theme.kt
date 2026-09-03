package com.example.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = AccentCoral,
    onPrimary = Color.White,
    primaryContainer = SurfaceElevated,
    onPrimaryContainer = Color.White,
    secondary = AccentPurple,
    onSecondary = Color.White,
    secondaryContainer = AccentPurpleLight,
    onSecondaryContainer = Color.White,
    tertiary = AccentAmber,
    onTertiary = TextDark,
    background = CanvasDark,
    onBackground = TextWhite,
    surface = SurfaceDark,
    onSurface = TextWhite,
    surfaceVariant = SurfaceElevated,
    onSurfaceVariant = TextMuted,
    outline = SurfaceBorder
)

@Composable
fun MyApplicationTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
