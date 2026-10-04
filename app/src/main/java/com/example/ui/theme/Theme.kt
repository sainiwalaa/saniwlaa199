package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColorScheme = lightColorScheme(
    primary = SaffronPrimary,
    onPrimary = Color.White,
    primaryContainer = SaffronLight,
    onPrimaryContainer = SaffronDark,
    secondary = JaipurRose,
    onSecondary = Color.White,
    secondaryContainer = JaipurRoseLight,
    onSecondaryContainer = JaipurRoseDark,
    tertiary = FlipkartBlue,
    onTertiary = Color.White,
    background = SurfaceBackground,
    onBackground = TextPrimary,
    surface = CardBackground,
    onSurface = TextPrimary,
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = TextSecondary,
    outline = BorderLight,
    outlineVariant = Color(0xFFCBD5E1)
)

private val DarkColorScheme = darkColorScheme(
    primary = SaffronGold,
    onPrimary = RoyalNavyDark,
    primaryContainer = RoyalNavyElevated,
    onPrimaryContainer = SaffronLight,
    secondary = JaipurRose,
    onSecondary = Color.White,
    secondaryContainer = RoyalNavySurface,
    onSecondaryContainer = JaipurRoseLight,
    tertiary = FlipkartBlue,
    onTertiary = Color.White,
    background = RoyalNavyDark,
    onBackground = Color(0xFFF8FAFC),
    surface = RoyalNavySurface,
    onSurface = Color(0xFFF8FAFC),
    surfaceVariant = RoyalNavyElevated,
    onSurfaceVariant = Color(0xFFCBD5E1),
    outline = Color(0xFF334155),
    outlineVariant = Color(0xFF1E293B)
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    // We intentionally enforce the brand identity color scheme for a consistent marketplace experience
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
