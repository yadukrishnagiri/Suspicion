package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.AccentCoral
import com.example.ui.theme.AccentCream
import com.example.ui.theme.AccentMint
import com.example.ui.theme.AccentPurple
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceDark
import com.example.ui.theme.SurfaceElevated
import com.example.ui.theme.TextDark
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextWhite

/**
 * Neo-Editorial Pill Badge
 */
@Composable
fun NeoPill(
    text: String,
    modifier: Modifier = Modifier,
    backgroundColor: Color = SurfaceElevated,
    textColor: Color = TextWhite,
    icon: ImageVector? = null,
    dotColor: Color? = null,
    testTag: String = "neo_pill"
) {
    Box(
        modifier = modifier
            .testTag(testTag)
            .clip(RoundedCornerShape(50))
            .background(backgroundColor)
            .border(1.dp, SurfaceBorder.copy(alpha = 0.5f), RoundedCornerShape(50))
            .padding(horizontal = 14.dp, vertical = 7.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (dotColor != null) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(dotColor)
                )
                Spacer(modifier = Modifier.width(6.dp))
            }
            if (icon != null) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = textColor,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
            }
            Text(
                text = text.uppercase(),
                style = MaterialTheme.typography.labelMedium.copy(
                    letterSpacing = 1.2.sp,
                    fontWeight = FontWeight.Bold
                ),
                color = textColor
            )
        }
    }
}

/**
 * Primary Chunky Button with circular icon badge
 */
@Composable
fun NeoButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    containerColor: Color = AccentCoral,
    contentColor: Color = TextWhite,
    icon: ImageVector = Icons.AutoMirrored.Filled.ArrowForward,
    enabled: Boolean = true,
    testTag: String = "neo_button"
) {
    val interactionSource = remember { MutableInteractionSource() }
    val animatedBg = animateColorAsState(
        targetValue = if (enabled) containerColor else SurfaceElevated,
        animationSpec = tween(200),
        label = "btn_bg"
    )

    Box(
        modifier = modifier
            .testTag(testTag)
            .fillMaxWidth()
            .height(62.dp)
            .clip(RoundedCornerShape(22.dp))
            .background(animatedBg.value)
            .border(
                1.dp,
                if (enabled) containerColor.copy(alpha = 0.8f) else SurfaceBorder,
                RoundedCornerShape(22.dp)
            )
            .clickable(
                interactionSource = interactionSource,
                indication = ripple(color = Color.White.copy(alpha = 0.3f)),
                enabled = enabled,
                onClick = onClick
            )
            .padding(horizontal = 20.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = text.uppercase(),
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.2.sp
                ),
                color = if (enabled) contentColor else TextMuted
            )

            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(
                        if (enabled) (if (containerColor == AccentCream) TextDark else Color.White)
                        else SurfaceBorder
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = if (enabled) (if (containerColor == AccentCream) AccentCream else containerColor) else TextMuted,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

/**
 * Chunky Card container matching user's reference designs
 */
@Composable
fun NeoCard(
    modifier: Modifier = Modifier,
    backgroundColor: Color = SurfaceDark,
    borderColor: Color = SurfaceBorder,
    cornerRadius: Dp = 26.dp,
    content: @Composable () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(cornerRadius))
            .background(backgroundColor)
            .border(1.dp, borderColor, RoundedCornerShape(cornerRadius))
    ) {
        content()
    }
}

/**
 * Circular Action Button
 */
@Composable
fun NeoCircleButton(
    icon: ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    containerColor: Color = AccentCoral,
    iconTint: Color = TextWhite,
    size: Dp = 52.dp,
    contentDescription: String? = null,
    testTag: String = "circle_button"
) {
    Box(
        modifier = modifier
            .testTag(testTag)
            .size(size)
            .clip(CircleShape)
            .background(containerColor)
            .border(1.dp, SurfaceBorder.copy(alpha = 0.4f), CircleShape)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = ripple(color = Color.White.copy(alpha = 0.3f)),
                onClick = onClick
            ),
        contentAlignment = Alignment.Center
    ) {
        Icon(
            imageVector = icon,
            contentDescription = contentDescription,
            tint = iconTint,
            modifier = Modifier.size(size * 0.45f)
        )
    }
}
