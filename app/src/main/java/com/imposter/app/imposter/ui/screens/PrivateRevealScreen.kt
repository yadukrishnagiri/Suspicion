package com.imposter.app.imposter.ui.screens

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
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.app.imposter.domain.model.GameMode
import com.imposter.app.imposter.theme.CitizenEmerald
import com.imposter.app.imposter.theme.HeroOrange
import com.imposter.app.imposter.theme.ImposterCrimson
import com.imposter.app.imposter.theme.SheetBlack
import com.imposter.app.imposter.theme.SheetCard
import com.imposter.app.imposter.theme.SheetCardBorder
import com.imposter.app.imposter.theme.SheetCardElevated
import com.imposter.app.imposter.theme.TextMuted
import com.imposter.app.imposter.theme.TextPrimary
import com.imposter.app.imposter.theme.TextSecondary
import com.imposter.app.imposter.ui.components.NeoButton
import com.imposter.app.imposter.ui.components.NeoPillChip
import com.imposter.app.imposter.ui.components.NeoTopBar
import com.imposter.app.imposter.ui.components.PlayerAvatar
import com.imposter.app.imposter.ui.viewmodel.GameViewModel

@Composable
fun PrivateRevealScreen(
    viewModel: GameViewModel,
    onAllRevealed: () -> Unit
) {
    val state by viewModel.gameState.collectAsState()
    val player = state.currentPlayerForReveal
    val word = state.wordEntry

    if (player == null || word == null) {
        onAllRevealed()
        return
    }

    val isLastPlayer = state.currentRevealIndex == state.players.lastIndex
    val isRevealed = state.isWordRevealed
    val isImposter = player.isImposter

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SheetBlack)
    ) {
        // --- TOP SECTION ---
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp))
                .background(HeroOrange)
                .padding(bottom = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            NeoTopBar(
                title = "Secret Role",
                rightBadgeText = "${state.currentRevealIndex + 1} of ${state.players.size}",
                isDarkHeader = false
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Player pass capsule
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.White.copy(alpha = 0.25f))
                    .border(1.dp, Color.White.copy(alpha = 0.4f), RoundedCornerShape(24.dp))
                    .padding(horizontal = 18.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "PASS PHONE TO: ",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    color = Color(0xFF141518)
                )
                Text(
                    text = player.name.uppercase(),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
            }
        }

        // --- BOTTOM DARK SHEET ---
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .background(SheetBlack)
                .padding(horizontal = 20.dp, vertical = 20.dp)
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                if (!isRevealed) {
                    // Locked / Hidden State
                    Spacer(modifier = Modifier.height(10.dp))

                    Box(
                        modifier = Modifier
                            .size(76.dp)
                            .clip(CircleShape)
                            .background(SheetCardElevated)
                            .border(1.dp, SheetCardBorder, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lock,
                            contentDescription = "Hidden",
                            tint = HeroOrange,
                            modifier = Modifier.size(34.dp)
                        )
                    }

                    Text(
                        text = player.name,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Black,
                        color = TextPrimary
                    )

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(SheetCard)
                            .border(1.dp, SheetCardBorder, RoundedCornerShape(20.dp))
                            .padding(20.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "Only ${player.name} should view this screen.\nMake sure nobody is peeking!",
                            fontSize = 13.sp,
                            color = TextSecondary,
                            textAlign = TextAlign.Center,
                            lineHeight = 18.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    NeoButton(
                        text = "Reveal Word",
                        icon = Icons.Default.Visibility,
                        onClick = { viewModel.toggleReveal(true) },
                        testTag = "reveal_secret_button"
                    )
                } else {
                    // Revealed Secret State
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(24.dp))
                            .background(SheetCard)
                            .border(
                                1.5.dp,
                                if (isImposter) ImposterCrimson else HeroOrange,
                                RoundedCornerShape(24.dp)
                            )
                            .padding(24.dp)
                    ) {
                        Column(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            // Role Badge
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(if (isImposter) ImposterCrimson.copy(alpha = 0.2f) else CitizenEmerald.copy(alpha = 0.2f))
                                    .padding(horizontal = 14.dp, vertical = 6.dp)
                            ) {
                                Text(
                                    text = if (isImposter) "YOU ARE THE IMPOSTER" else "YOU ARE A CITIZEN",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Black,
                                    color = if (isImposter) ImposterCrimson else CitizenEmerald,
                                    letterSpacing = 0.5.sp
                                )
                            }

                            Spacer(modifier = Modifier.height(20.dp))

                            when {
                                !isImposter -> {
                                    Text(
                                        text = "SECRET WORD",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Black,
                                        color = TextMuted,
                                        letterSpacing = 1.sp
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = word.mainWord,
                                        fontSize = 38.sp,
                                        fontWeight = FontWeight.Black,
                                        color = TextPrimary
                                    )
                                    Spacer(modifier = Modifier.height(12.dp))
                                    Text(
                                        text = "Category: ${word.category}",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = HeroOrange
                                    )
                                }
                                state.config.gameMode == GameMode.WORD_VS_WORD -> {
                                    Text(
                                        text = "YOUR SECRET WORD",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Black,
                                        color = ImposterCrimson,
                                        letterSpacing = 1.sp
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = word.imposterWord,
                                        fontSize = 38.sp,
                                        fontWeight = FontWeight.Black,
                                        color = ImposterCrimson
                                    )
                                    Spacer(modifier = Modifier.height(12.dp))
                                    Text(
                                        text = "Category: ${word.category}",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = ImposterCrimson
                                    )
                                }
                                state.config.gameMode == GameMode.WORD_VS_HINT -> {
                                    Text(
                                        text = "CATEGORY HINT",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Black,
                                        color = ImposterCrimson,
                                        letterSpacing = 1.sp
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = word.hint.ifBlank { word.category },
                                        fontSize = 28.sp,
                                        fontWeight = FontWeight.Black,
                                        color = ImposterCrimson,
                                        textAlign = TextAlign.Center
                                    )
                                }
                                else -> {
                                    Text(
                                        text = "BLIND IMPOSTER",
                                        fontSize = 28.sp,
                                        fontWeight = FontWeight.Black,
                                        color = ImposterCrimson,
                                        textAlign = TextAlign.Center
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = "Zero info. Listen closely to clues & bluff.",
                                        fontSize = 13.sp,
                                        color = TextSecondary
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    NeoButton(
                        text = if (isLastPlayer) "Finish & Start Round" else "Hide & Pass Device",
                        icon = if (isLastPlayer) Icons.Default.CheckCircle else Icons.Default.VisibilityOff,
                        onClick = {
                            viewModel.passToNextPlayer()
                            if (isLastPlayer) {
                                onAllRevealed()
                            }
                        },
                        testTag = "pass_phone_button"
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}
