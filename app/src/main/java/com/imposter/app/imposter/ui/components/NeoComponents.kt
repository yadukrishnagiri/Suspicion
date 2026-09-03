package com.imposter.app.imposter.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.NorthEast
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.app.imposter.theme.HeroOrange
import com.imposter.app.imposter.theme.HeroOrangeDark
import com.imposter.app.imposter.theme.SheetBlack
import com.imposter.app.imposter.theme.SheetCard
import com.imposter.app.imposter.theme.SheetCardBorder
import com.imposter.app.imposter.theme.SheetCardElevated
import com.imposter.app.imposter.theme.TextMuted
import com.imposter.app.imposter.theme.TextPrimary
import com.imposter.app.imposter.theme.TextSecondary
import kotlin.math.cos
import kotlin.math.sin

/**
 * Clean Top Bar matching the user's reference:
 * Circular outline back / action button, uppercase title, and pill dropdown badge.
 */
@Composable
fun NeoTopBar(
    title: String,
    modifier: Modifier = Modifier,
    onBack: (() -> Unit)? = null,
    leftIcon: ImageVector? = null,
    onLeftAction: (() -> Unit)? = null,
    rightBadgeText: String? = null,
    onRightBadgeClick: (() -> Unit)? = null,
    isDarkHeader: Boolean = false
) {
    val contentColor = if (isDarkHeader) TextPrimary else Color(0xFF141518)
    val circleBorder = if (isDarkHeader) SheetCardBorder else Color.Black.copy(alpha = 0.2f)
    val circleBg = if (isDarkHeader) SheetCardElevated else Color.White.copy(alpha = 0.25f)

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 14.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Left Circular Button
        if (onBack != null || onLeftAction != null) {
            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(circleBg)
                    .border(1.2.dp, circleBorder, CircleShape)
                    .clickable { onBack?.invoke() ?: onLeftAction?.invoke() }
                    .testTag("neo_topbar_back"),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = leftIcon ?: Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = contentColor,
                    modifier = Modifier.size(18.dp)
                )
            }
        } else {
            Spacer(modifier = Modifier.size(42.dp))
        }

        // Center Uppercase Title
        Text(
            text = title.uppercase(),
            fontSize = 17.sp,
            fontWeight = FontWeight.Black,
            color = contentColor,
            letterSpacing = 1.sp
        )

        // Right Pill Badge / Dropdown
        if (rightBadgeText != null) {
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(circleBg)
                    .border(1.2.dp, circleBorder, RoundedCornerShape(20.dp))
                    .clickable(enabled = onRightBadgeClick != null) { onRightBadgeClick?.invoke() }
                    .padding(horizontal = 14.dp, vertical = 8.dp)
                    .testTag("neo_topbar_badge"),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = rightBadgeText,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = contentColor
                )
            }
        } else {
            Spacer(modifier = Modifier.size(42.dp))
        }
    }
}

/**
 * Capsule Pill Chip matching the reference: e.g. [ 54 This week ] [ 5 Points ]
 */
@Composable
fun NeoPillChip(
    text: String,
    modifier: Modifier = Modifier,
    textColor: Color = Color(0xFF141518),
    backgroundColor: Color = Color.White.copy(alpha = 0.35f),
    borderColor: Color = Color.Black.copy(alpha = 0.15f),
    fontSize: Int = 13,
    onClick: (() -> Unit)? = null
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(24.dp))
            .background(backgroundColor)
            .border(1.dp, borderColor, RoundedCornerShape(24.dp))
            .then(if (onClick != null) Modifier.clickable { onClick() } else Modifier)
            .padding(horizontal = 16.dp, vertical = 10.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            fontSize = fontSize.sp,
            fontWeight = FontWeight.Bold,
            color = textColor
        )
    }
}

/**
 * Neo Dark Action Card matching the reference with diagonal arrow ( ↗ ):
 * Left circular avatar, bold white title, subtitle, pill badges, and top-right diagonal arrow.
 */
@Composable
fun NeoActionCard(
    title: String,
    subtitle: String,
    modifier: Modifier = Modifier,
    avatarText: String? = null,
    avatarColor: Color = HeroOrange,
    tags: List<Pair<String, Color>> = emptyList(),
    onClick: () -> Unit,
    testTag: String = "neo_action_card"
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(22.dp))
            .background(SheetCard)
            .border(1.dp, SheetCardBorder, RoundedCornerShape(22.dp))
            .clickable { onClick() }
            .padding(18.dp)
            .testTag(testTag)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (avatarText != null) {
                    Box(
                        modifier = Modifier
                            .size(46.dp)
                            .clip(CircleShape)
                            .background(avatarColor.copy(alpha = 0.2f))
                            .border(1.dp, avatarColor.copy(alpha = 0.5f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = avatarText,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = avatarColor
                        )
                    }
                    Spacer(modifier = Modifier.width(14.dp))
                }

                Column {
                    Text(
                        text = title,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                    Spacer(modifier = Modifier.height(3.dp))
                    Text(
                        text = subtitle,
                        fontSize = 12.sp,
                        color = TextSecondary,
                        lineHeight = 16.sp
                    )

                    if (tags.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            tags.forEach { (tagText, tagColor) ->
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(tagColor.copy(alpha = 0.15f))
                                        .border(1.dp, tagColor.copy(alpha = 0.35f), RoundedCornerShape(12.dp))
                                        .padding(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text(
                                        text = tagText,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.SemiBold,
                                        color = tagColor
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // Upper Right Circular Diagonal Arrow Button ( ↗ )
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(SheetCardElevated)
                    .border(1.dp, SheetCardBorder, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.NorthEast,
                    contentDescription = "Open",
                    tint = TextPrimary,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

/**
 * Tactile Counter Stepper Capsule matching the reference:
 * Decrement [-] capsule, large bold number, Increment [+] capsule.
 */
@Composable
fun NeoStepper(
    value: Int,
    onDecrement: () -> Unit,
    onIncrement: () -> Unit,
    canDecrement: Boolean,
    canIncrement: Boolean,
    modifier: Modifier = Modifier,
    label: String? = null,
    testTagPrefix: String = "neo_stepper"
) {
    Row(
        modifier = modifier
            .clip(RoundedCornerShape(24.dp))
            .background(SheetCardElevated)
            .border(1.dp, SheetCardBorder, RoundedCornerShape(24.dp))
            .padding(horizontal = 8.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Minus Button
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(if (canDecrement) SheetCard else SheetCard.copy(alpha = 0.4f))
                .border(1.dp, SheetCardBorder, CircleShape)
                .clickable(enabled = canDecrement) { onDecrement() }
                .testTag("${testTagPrefix}_decrement"),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Remove,
                contentDescription = "Decrease",
                tint = if (canDecrement) TextPrimary else TextMuted,
                modifier = Modifier.size(16.dp)
            )
        }

        // Value text
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(horizontal = 10.dp)
        ) {
            Text(
                text = value.toString(),
                fontSize = 20.sp,
                fontWeight = FontWeight.Black,
                color = TextPrimary
            )
            if (label != null) {
                Text(
                    text = label.uppercase(),
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextSecondary,
                    letterSpacing = 0.5.sp
                )
            }
        }

        // Plus Button
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(if (canIncrement) HeroOrange else SheetCard.copy(alpha = 0.4f))
                .clickable(enabled = canIncrement) { onIncrement() }
                .testTag("${testTagPrefix}_increment"),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "Increase",
                tint = if (canIncrement) Color.White else TextMuted,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

/**
 * Circular Operational Timing Dial Gauge:
 * Inspired directly by the "OPERATIONAL TIMING" screen in reference image 1 & 3!
 * Features radial tick ring, animated sweep indicator needle, and large digital readout.
 */
@Composable
fun NeoTimingDial(
    secondsRemaining: Int,
    totalSeconds: Int = 120,
    modifier: Modifier = Modifier,
    dialSize: Dp = 175.dp,
    label: String = "Discussion Time"
) {
    val progress = (secondsRemaining.toFloat() / totalSeconds.coerceAtLeast(1).toFloat()).coerceIn(0f, 1f)
    val animatedProgress by animateFloatAsState(targetValue = progress, label = "dial_progress")

    val minutes = secondsRemaining / 60
    val secs = secondsRemaining % 60
    val timeFormatted = String.format("%02d:%02d", minutes, secs)

    Column(
        modifier = modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier.size(dialSize),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.fillMaxSize().padding(10.dp)) {
                val center = Offset(size.width / 2f, size.height / 2f)
                val radius = size.minDimension / 2f

                // Draw outer radial ticks
                val tickCount = 48
                for (i in 0 until tickCount) {
                    val angleDeg = (i.toFloat() / tickCount.toFloat()) * 360f - 90f
                    val angleRad = Math.toRadians(angleDeg.toDouble())
                    val isMajor = i % 4 == 0
                    val tickLen = if (isMajor) 11f else 6f
                    val tickColor = if (isMajor) Color(0xFF6B7280) else Color(0xFF374151)

                    val startX = center.x + (radius - tickLen) * cos(angleRad).toFloat()
                    val startY = center.y + (radius - tickLen) * sin(angleRad).toFloat()
                    val endX = center.x + radius * cos(angleRad).toFloat()
                    val endY = center.y + radius * sin(angleRad).toFloat()

                    drawLine(
                        color = tickColor,
                        start = Offset(startX, startY),
                        end = Offset(endX, endY),
                        strokeWidth = if (isMajor) 2.2f else 1.2f,
                        cap = StrokeCap.Round
                    )
                }

                // Draw active orange progress arc
                val sweepAngle = animatedProgress * 360f
                drawArc(
                    color = HeroOrange,
                    startAngle = -90f,
                    sweepAngle = sweepAngle,
                    useCenter = false,
                    topLeft = Offset(center.x - radius + 18f, center.y - radius + 18f),
                    size = androidx.compose.ui.geometry.Size((radius - 18f) * 2f, (radius - 18f) * 2f),
                    style = Stroke(width = 7f, cap = StrokeCap.Round)
                )

                // Draw central indicator needle pointing to current progress
                val needleAngleDeg = (animatedProgress * 360f) - 90f
                val needleAngleRad = Math.toRadians(needleAngleDeg.toDouble())
                val needleLen = radius - 24f
                val needleTipX = center.x + needleLen * cos(needleAngleRad).toFloat()
                val needleTipY = center.y + needleLen * sin(needleAngleRad).toFloat()

                drawLine(
                    color = Color.White,
                    start = center,
                    end = Offset(needleTipX, needleTipY),
                    strokeWidth = 3f,
                    cap = StrokeCap.Round
                )

                // Central pivot dot
                drawCircle(
                    color = Color.White,
                    radius = 4.5f,
                    center = center
                )
            }

            // Center Content
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = label.uppercase(),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF141518).copy(alpha = 0.75f),
                    letterSpacing = 1.sp
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = timeFormatted,
                    fontSize = 30.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White,
                    letterSpacing = 0.5.sp
                )
            }
        }
    }
}

/**
 * Big Rounded Pill Button matching the reference:
 * Vibrant tangerine with bold all-caps text and diagonal arrow `↗`.
 */
@Composable
fun NeoButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    backgroundColor: Color = HeroOrange,
    textColor: Color = Color.White,
    icon: ImageVector? = Icons.Default.NorthEast,
    testTag: String = "neo_button"
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
            .clip(RoundedCornerShape(28.dp))
            .background(backgroundColor)
            .clickable { onClick() }
            .testTag(testTag),
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Text(
                text = text.uppercase(),
                fontSize = 15.sp,
                fontWeight = FontWeight.Black,
                color = textColor,
                letterSpacing = 0.5.sp
            )
            if (icon != null) {
                Spacer(modifier = Modifier.width(8.dp))
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = textColor,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}
