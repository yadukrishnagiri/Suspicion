package com.imposter.app.imposter.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.app.imposter.theme.AccentBlue
import com.imposter.app.imposter.theme.DarkBackground
import com.imposter.app.imposter.theme.DarkSurface
import com.imposter.app.imposter.theme.DarkSurfaceBorder
import com.imposter.app.imposter.theme.DarkSurfaceElevated
import com.imposter.app.imposter.theme.DarkSurfaceHover
import com.imposter.app.imposter.theme.ImposterCrimson
import com.imposter.app.imposter.theme.TextMuted
import com.imposter.app.imposter.theme.TextPrimary
import com.imposter.app.imposter.theme.TextSecondary

/**
 * Minimalist, executive dark background container
 */
@Composable
fun AppContainer(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(DarkBackground)
    ) {
        content()
    }
}

/**
 * Clean, high-precision card container with subtle hairline border
 */
@Composable
fun AppCard(
    modifier: Modifier = Modifier,
    borderColor: Color = DarkSurfaceBorder,
    backgroundColor: Color = DarkSurface,
    borderWidth: Dp = 1.dp,
    content: @Composable () -> Unit
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        border = BorderStroke(borderWidth, borderColor)
    ) {
        content()
    }
}

/**
 * Professional Primary Action Button
 */
@Composable
fun PrimaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isDanger: Boolean = false,
    enabled: Boolean = true,
    leadingIcon: ImageVector? = null,
    testTag: String = "primary_button"
) {
    val bgColor = when {
        !enabled -> DarkSurfaceHover
        isDanger -> ImposterCrimson
        else -> AccentBlue
    }
    val textColor = when {
        !enabled -> TextMuted
        else -> Color.White
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(52.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(bgColor)
            .clickable(enabled = enabled) { onClick() }
            .testTag(testTag),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (leadingIcon != null) {
                Icon(
                    imageVector = leadingIcon,
                    contentDescription = null,
                    tint = textColor,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text(
                text = text,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = textColor,
                letterSpacing = 0.3.sp
            )
        }
    }
}

/**
 * Professional Outlined Secondary Button
 */
@Composable
fun SecondaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    borderColor: Color = DarkSurfaceBorder,
    testTag: String = "secondary_button"
) {
    OutlinedButton(
        onClick = onClick,
        border = BorderStroke(1.dp, borderColor),
        colors = ButtonDefaults.outlinedButtonColors(
            contentColor = TextPrimary,
            containerColor = DarkSurface.copy(alpha = 0.5f)
        ),
        shape = RoundedCornerShape(12.dp),
        modifier = modifier
            .fillMaxWidth()
            .height(50.dp)
            .testTag(testTag)
    ) {
        Text(
            text = text,
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextPrimary
        )
    }
}

/**
 * Minimal Top Header with screen title and optional back navigation
 */
@Composable
fun AppTopHeader(
    title: String,
    subtitle: String? = null,
    onBack: (() -> Unit)? = null,
    trailingAction: (@Composable () -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.weight(1f, fill = false)
        ) {
            if (onBack != null) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .padding(end = 6.dp)
                        .testTag("nav_back_button")
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "Back",
                        tint = TextPrimary
                    )
                }
            }
            Column {
                Text(
                    text = title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                if (!subtitle.isNullOrBlank()) {
                    Text(
                        text = subtitle,
                        fontSize = 12.sp,
                        color = TextSecondary
                    )
                }
            }
        }

        if (trailingAction != null) {
            trailingAction()
        }
    }
}

/**
 * Clean Player Monogram Avatar
 */
@Composable
fun PlayerAvatar(
    name: String,
    modifier: Modifier = Modifier,
    isEliminated: Boolean = false,
    accentColor: Color = AccentBlue
) {
    val initial = name.trim().firstOrNull()?.uppercaseChar()?.toString() ?: "P"
    Box(
        modifier = modifier
            .size(44.dp)
            .clip(CircleShape)
            .background(if (isEliminated) DarkSurfaceElevated else DarkSurfaceHover)
            .border(
                1.dp,
                if (isEliminated) ImposterCrimson.copy(alpha = 0.5f) else DarkSurfaceBorder,
                CircleShape
            ),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = initial,
            fontSize = 17.sp,
            fontWeight = FontWeight.Bold,
            color = if (isEliminated) TextMuted else TextPrimary
        )
    }
}

/**
 * Clean Badge Chip
 */
@Composable
fun BadgeChip(
    text: String,
    textColor: Color = TextSecondary,
    backgroundColor: Color = DarkSurfaceElevated,
    borderColor: Color = DarkSurfaceBorder,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(backgroundColor)
            .border(1.dp, borderColor, RoundedCornerShape(8.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(
            text = text,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = textColor
        )
    }
}

// -------------------------------------------------------------------------
// Backward compatibility bridge aliases ensuring full zero-breakage build
// -------------------------------------------------------------------------

@Composable
fun CyberContainer(
    modifier: Modifier = Modifier,
    accentGlowColor: Color = AccentBlue,
    content: @Composable BoxScope.() -> Unit
) {
    AppContainer(modifier = modifier, content = content)
}

@Composable
fun CyberCard(
    modifier: Modifier = Modifier,
    accentColor: Color = DarkSurfaceBorder,
    borderWidth: Dp = 1.dp,
    content: @Composable () -> Unit
) {
    AppCard(
        modifier = modifier,
        borderColor = if (accentColor == ImposterCrimson) ImposterCrimson.copy(alpha = 0.4f) else DarkSurfaceBorder,
        borderWidth = borderWidth,
        content = content
    )
}

@Composable
fun CyberButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isDanger: Boolean = false,
    enabled: Boolean = true,
    testTag: String = "primary_cyber_button"
) {
    PrimaryButton(
        text = text,
        onClick = onClick,
        modifier = modifier,
        isDanger = isDanger,
        enabled = enabled,
        testTag = testTag
    )
}

@Composable
fun CyberSecondaryButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    accentColor: Color = DarkSurfaceBorder,
    testTag: String = "secondary_cyber_button"
) {
    SecondaryButton(
        text = text,
        onClick = onClick,
        modifier = modifier,
        borderColor = DarkSurfaceBorder,
        testTag = testTag
    )
}

@Composable
fun CovertTopHeader(
    title: String,
    clearanceLevel: String = "",
    onBack: (() -> Unit)? = null,
    trailingAction: (@Composable () -> Unit)? = null
) {
    AppTopHeader(
        title = title,
        subtitle = clearanceLevel.ifBlank { null },
        onBack = onBack,
        trailingAction = trailingAction
    )
}

@Composable
fun OperativeAvatar(
    name: String,
    modifier: Modifier = Modifier,
    isEliminated: Boolean = false,
    accentColor: Color = AccentBlue
) {
    PlayerAvatar(
        name = name,
        modifier = modifier,
        isEliminated = isEliminated,
        accentColor = accentColor
    )
}

@Composable
fun PrimaryGoldButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    testTag: String = "primary_button"
) {
    PrimaryButton(text = text, onClick = onClick, modifier = modifier, enabled = enabled, testTag = testTag)
}

@Composable
fun SecondaryDarkButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    testTag: String = "secondary_button"
) {
    SecondaryButton(text = text, onClick = onClick, modifier = modifier, testTag = testTag)
}

@Composable
fun SurfaceCard(
    modifier: Modifier = Modifier,
    border: BorderStroke? = null,
    content: @Composable () -> Unit
) {
    AppCard(modifier = modifier, content = content)
}

@Composable
fun TopHeader(
    title: String,
    onBack: (() -> Unit)? = null,
    trailingAction: (@Composable () -> Unit)? = null
) {
    AppTopHeader(title = title, onBack = onBack, trailingAction = trailingAction)
}
