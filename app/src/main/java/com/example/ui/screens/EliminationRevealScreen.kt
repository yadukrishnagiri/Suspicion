package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.scaleIn
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.PersonOff
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.EliminationOutcome
import com.example.ui.components.NeoButton
import com.example.ui.components.NeoCard
import com.example.ui.components.NeoPill
import com.example.ui.theme.*
import com.example.ui.theme.TextSubtle
import com.example.ui.theme.TextWhite

@Composable
fun EliminationRevealScreen(
    outcome: EliminationOutcome,
    onContinue: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scale = remember { Animatable(0.7f) }

    LaunchedEffect(Unit) {
        scale.animateTo(
            targetValue = 1f,
            animationSpec = tween(durationMillis = 400, easing = FastOutSlowInEasing)
        )
    }

    val wasImposter = outcome.wasImposter
    val themeColor = if (wasImposter) ImposterRed else CitizenBlue

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(CanvasDark)
            .padding(20.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top Label
            NeoPill(
                text = "ELIMINATION RESULT",
                backgroundColor = SurfaceElevated,
                textColor = AccentAmber,
                dotColor = AccentAmber
            )

            // Dramatic Center Card
            NeoCard(
                modifier = Modifier
                    .fillMaxWidth()
                    .scale(scale.value)
                    .testTag("card_elimination_reveal"),
                backgroundColor = if (wasImposter) ImposterRed else SurfaceDark,
                borderColor = themeColor,
                cornerRadius = 28.dp
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(28.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Big Icon Badge
                    Box(
                        modifier = Modifier
                            .size(100.dp)
                            .clip(CircleShape)
                            .background(
                                if (wasImposter) Color.White else CitizenBlue.copy(alpha = 0.2f)
                            )
                            .border(
                                2.dp,
                                if (wasImposter) Color.White else CitizenBlue,
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = if (wasImposter) Icons.Default.Close else Icons.Default.Shield,
                            contentDescription = null,
                            tint = if (wasImposter) ImposterRed else CitizenBlue,
                            modifier = Modifier.size(54.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    Text(
                        text = outcome.player.name.uppercase(),
                        style = MaterialTheme.typography.titleLarge,
                        color = if (wasImposter) Color.White.copy(alpha = 0.8f) else TextMuted
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Role Revelation Text (SPEC SECTION 12 & 13)
                    Text(
                        text = if (wasImposter) "IMPOSTOR FOUND" else "NOT THE IMPOSTOR",
                        style = MaterialTheme.typography.headlineLarge.copy(
                            fontWeight = FontWeight.Black,
                            letterSpacing = 0.5.sp
                        ),
                        color = Color.White,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = if (wasImposter) "ROLE: IMPOSTOR" else "ROLE: CITIZEN",
                        style = MaterialTheme.typography.labelLarge,
                        color = if (wasImposter) Color.White else CitizenBlue
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    // Critical rule badge (Spec: NEVER REVEAL THE WORD)
                    NeoPill(
                        text = "Secret word remains private",
                        backgroundColor = Color.Black.copy(alpha = 0.3f),
                        textColor = Color.White.copy(alpha = 0.8f)
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    // Status Summary
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(
                                if (wasImposter) Color.Black.copy(alpha = 0.25f) else SurfaceElevated
                            )
                            .padding(14.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (outcome.isGameOver) {
                                if (outcome.didPlayersWin) "ALL IMPOSTORS FOUND!" else "IMPOSTORS EQUAL OR EXCEED CITIZENS!"
                            } else {
                                "${outcome.impostersRemaining} Imposter${if (outcome.impostersRemaining > 1) "s" else ""} • ${outcome.citizensRemaining} Citizens Active"
                            },
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold),
                            color = Color.White,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }

            // Bottom Continue Action
            NeoButton(
                text = if (outcome.isGameOver) "SEE GAME RESULT" else "CONTINUE DISCUSSION",
                onClick = onContinue,
                containerColor = if (outcome.isGameOver) AccentCoral else AccentMint,
                contentColor = if (outcome.isGameOver) Color.White else TextDark,
                icon = Icons.AutoMirrored.Filled.ArrowForward,
                testTag = "btn_continue_after_elimination"
            )
        }
    }
}
