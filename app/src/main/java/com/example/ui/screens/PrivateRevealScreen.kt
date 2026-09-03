package com.example.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
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
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.GameMode
import com.example.data.Player
import com.example.data.WordPair
import com.example.ui.components.NeoButton
import com.example.ui.components.NeoCard
import com.example.ui.components.NeoPill
import com.example.ui.theme.*
import com.example.viewmodel.GameUiState

@Composable
fun PrivateRevealScreen(
    state: GameUiState,
    onToggleReveal: () -> Unit,
    onProceedNext: () -> Unit,
    modifier: Modifier = Modifier
) {
    val currentPlayerIndex = state.currentRevealPlayerIndex
    val currentPlayer: Player? = state.players.getOrNull(currentPlayerIndex)
    val wordPair: WordPair? = state.currentWordPair
    val isLastPlayer = currentPlayerIndex == state.players.size - 1

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(CanvasDark)
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top App Bar / Progress Header
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    NeoPill(
                        text = "PLAYER ${currentPlayerIndex + 1} OF ${state.players.size}",
                        backgroundColor = SurfaceElevated,
                        textColor = AccentAmber,
                        dotColor = AccentAmber
                    )

                    NeoPill(
                        text = state.selectedCategory.title,
                        backgroundColor = SurfaceElevated,
                        textColor = TextMuted
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Pass Instruction Header
                NeoCard(
                    modifier = Modifier.fillMaxWidth(),
                    backgroundColor = SurfaceElevated
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(AccentPurple),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Shield,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(14.dp))
                        Column {
                            Text(
                                text = "HAND PHONE TO",
                                style = MaterialTheme.typography.labelSmall,
                                color = TextMuted
                            )
                            Text(
                                text = currentPlayer?.name ?: "Current Player",
                                style = MaterialTheme.typography.headlineMedium.copy(
                                    fontWeight = FontWeight.Black
                                ),
                                color = TextWhite
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Main Interactive Privacy Card
            Box(modifier = Modifier.weight(1f)) {
                if (!state.isCardContentRevealed) {
                    // HIDDEN STATE: Privacy Shield
                    NeoCard(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onToggleReveal() }
                            .testTag("card_privacy_shield"),
                        backgroundColor = SurfaceDark,
                        borderColor = SurfaceBorder
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(90.dp)
                                    .clip(CircleShape)
                                    .background(SurfaceElevated)
                                    .border(2.dp, SurfaceBorder, CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.VisibilityOff,
                                    contentDescription = "Hidden",
                                    tint = AccentAmber,
                                    modifier = Modifier.size(44.dp)
                                )
                            }

                            Spacer(modifier = Modifier.height(24.dp))

                            Text(
                                text = "PRIVATE INFORMATION",
                                style = MaterialTheme.typography.labelLarge,
                                color = AccentAmber
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "Tap anywhere to reveal\nyour secret assignment",
                                style = MaterialTheme.typography.titleMedium,
                                color = TextWhite,
                                textAlign = TextAlign.Center
                            )

                            Spacer(modifier = Modifier.height(16.dp))

                            NeoPill(
                                text = "Keep screen hidden from others",
                                backgroundColor = Color.Black.copy(alpha = 0.3f),
                                textColor = TextMuted
                            )
                        }
                    }
                } else {
                    // REVEALED STATE: Secret Information
                    val isImposter = currentPlayer?.isImposter == true
                    val cardBg = if (isImposter) SurfaceElevated else AccentCream
                    val cardBorder = if (isImposter) ImposterRed else AccentMint

                    NeoCard(
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("card_secret_content"),
                        backgroundColor = cardBg,
                        borderColor = cardBorder
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(24.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.SpaceBetween
                        ) {
                            // Role Badge
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                NeoPill(
                                    text = if (isImposter) "YOU ARE THE IMPOSTOR" else "YOU ARE A CITIZEN",
                                    backgroundColor = if (isImposter) ImposterRed else AccentMint,
                                    textColor = Color.White
                                )

                                NeoPill(
                                    text = state.selectedMode.tag,
                                    backgroundColor = if (isImposter) Color.Black.copy(alpha = 0.3f) else AccentCreamDark,
                                    textColor = if (isImposter) TextMuted else TextDark
                                )
                            }

                            // Secret Word / Clue Presentation
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                when {
                                    !isImposter -> {
                                        // Citizen: Gets Main Word
                                        Text(
                                            text = "YOUR SECRET WORD",
                                            style = MaterialTheme.typography.labelMedium,
                                            color = TextDark.copy(alpha = 0.6f)
                                        )
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text(
                                            text = wordPair?.mainWord ?: "Main Word",
                                            style = MaterialTheme.typography.displayLarge.copy(
                                                fontWeight = FontWeight.Black,
                                                letterSpacing = (-0.5).sp
                                            ),
                                            color = TextDark,
                                            textAlign = TextAlign.Center
                                        )
                                        Spacer(modifier = Modifier.height(16.dp))
                                        Text(
                                            text = "Say one word related to this during discussion.",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = TextDark.copy(alpha = 0.7f),
                                            textAlign = TextAlign.Center
                                        )
                                    }

                                    isImposter && state.selectedMode == GameMode.EVERYONE_GETS_A_WORD -> {
                                        // Mode 1: Imposter Gets Imposter Word
                                        Text(
                                            text = "YOUR IMPOSTER WORD",
                                            style = MaterialTheme.typography.labelMedium,
                                            color = ImposterRed
                                        )
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text(
                                            text = wordPair?.imposterWord ?: "Imposter Word",
                                            style = MaterialTheme.typography.displayLarge.copy(
                                                fontWeight = FontWeight.Black,
                                                letterSpacing = (-0.5).sp
                                            ),
                                            color = TextWhite,
                                            textAlign = TextAlign.Center
                                        )
                                        Spacer(modifier = Modifier.height(16.dp))
                                        Text(
                                            text = "Your word is subtly different from the Citizens' word. Blend in!",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = TextMuted,
                                            textAlign = TextAlign.Center
                                        )
                                    }

                                    isImposter && state.selectedMode == GameMode.IMPOSTER_GETS_A_CLUE -> {
                                        // Mode 2: Imposter Gets Clue (NO word)
                                        Text(
                                            text = "YOU HAVE NO WORD • YOU GET A CLUE",
                                            style = MaterialTheme.typography.labelMedium,
                                            color = AccentAmber
                                        )
                                        Spacer(modifier = Modifier.height(12.dp))
                                        Box(
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .clip(RoundedCornerShape(18.dp))
                                                .background(CanvasDark)
                                                .border(1.dp, SurfaceBorder, RoundedCornerShape(18.dp))
                                                .padding(18.dp),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = "\"${wordPair?.imposterHint ?: "Indirect clue"}\"",
                                                style = MaterialTheme.typography.headlineSmall.copy(
                                                    fontWeight = FontWeight.Bold
                                                ),
                                                color = AccentAmber,
                                                textAlign = TextAlign.Center
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(16.dp))
                                        Text(
                                            text = "This clue points toward the Citizens' word. Figure it out and pretend you know it!",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = TextMuted,
                                            textAlign = TextAlign.Center
                                        )
                                    }

                                    else -> {
                                        // Mode 3: Blind Imposter (Zero Info)
                                        Text(
                                            text = "BLIND IMPOSTER",
                                            style = MaterialTheme.typography.labelLarge,
                                            color = ImposterRed
                                        )
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text(
                                            text = "NO WORD\nNO CLUE",
                                            style = MaterialTheme.typography.headlineLarge.copy(
                                                fontWeight = FontWeight.Black
                                            ),
                                            color = TextWhite,
                                            textAlign = TextAlign.Center
                                        )
                                        Spacer(modifier = Modifier.height(16.dp))
                                        Text(
                                            text = "Listen closely to what other players say, deduce the theme, and bluff!",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = TextMuted,
                                            textAlign = TextAlign.Center
                                        )
                                    }
                                }
                            }

                            // Tap to hide toggle
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(
                                        if (isImposter) SurfaceDark else AccentCreamDark
                                    )
                                    .clickable { onToggleReveal() }
                                    .padding(horizontal = 16.dp, vertical = 10.dp)
                            ) {
                                Text(
                                    text = "TAP TO HIDE SECRET",
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        fontWeight = FontWeight.Bold
                                    ),
                                    color = if (isImposter) TextMuted else TextDark
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Action Button: Done / Next Player / Start Discussion
            val nextPlayerName = state.players.getOrNull(currentPlayerIndex + 1)?.name
            NeoButton(
                text = if (isLastPlayer) {
                    if (state.hasCurrentPlayerViewed) "START DISCUSSION" else "TAP CARD TO VIEW FIRST"
                } else {
                    if (state.hasCurrentPlayerViewed) "PASS TO $nextPlayerName" else "TAP CARD TO VIEW FIRST"
                },
                onClick = onProceedNext,
                enabled = state.hasCurrentPlayerViewed,
                containerColor = if (isLastPlayer) AccentCoral else AccentPurple,
                contentColor = Color.White,
                icon = if (isLastPlayer) Icons.Default.Check else Icons.AutoMirrored.Filled.ArrowForward,
                testTag = "btn_proceed_reveal"
            )
        }
    }
}
