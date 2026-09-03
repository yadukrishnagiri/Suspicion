package com.imposter.app.imposter.ui.screens

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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.HowToVote
import androidx.compose.material.icons.filled.NorthEast
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.app.imposter.theme.HeroOrange
import com.imposter.app.imposter.theme.SheetBlack
import com.imposter.app.imposter.theme.SheetCard
import com.imposter.app.imposter.theme.SheetCardBorder
import com.imposter.app.imposter.theme.SheetCardElevated
import com.imposter.app.imposter.theme.TextMuted
import com.imposter.app.imposter.theme.TextPrimary
import com.imposter.app.imposter.theme.TextSecondary
import com.imposter.app.imposter.ui.components.NeoButton
import com.imposter.app.imposter.ui.components.NeoPillChip
import com.imposter.app.imposter.ui.components.NeoTimingDial
import com.imposter.app.imposter.ui.components.NeoTopBar
import com.imposter.app.imposter.ui.components.PlayerAvatar
import com.imposter.app.imposter.ui.viewmodel.GameViewModel
import kotlinx.coroutines.delay

@Composable
fun DiscussionStarterScreen(
    viewModel: GameViewModel,
    onProceedToBoard: () -> Unit
) {
    val state by viewModel.gameState.collectAsState()
    val starter = state.discussionStarter ?: state.players.firstOrNull()

    var timerSeconds by remember { mutableIntStateOf(120) }
    var isTimerRunning by remember { mutableStateOf(false) }

    LaunchedEffect(isTimerRunning, timerSeconds) {
        if (isTimerRunning && timerSeconds > 0) {
            delay(1000)
            timerSeconds -= 1
        } else if (timerSeconds == 0) {
            isTimerRunning = false
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SheetBlack)
    ) {
        // --- TOP ORANGE HERO SECTION ---
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp))
                .background(HeroOrange)
                .padding(bottom = 14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            NeoTopBar(
                title = "Discussion",
                rightBadgeText = "Round 1",
                isDarkHeader = false
            )

            // Designated Speaker Capsule Pill
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color.White.copy(alpha = 0.25f))
                    .border(1.dp, Color.White.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
                    .padding(horizontal = 16.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "🎙️ FIRST SPEAKER: ",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    color = Color(0xFF141518)
                )
                Text(
                    text = starter?.name ?: "Player 1",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            // Operational Radial Timing Dial (compact size 165.dp)
            NeoTimingDial(
                secondsRemaining = timerSeconds,
                totalSeconds = 120,
                dialSize = 165.dp,
                label = if (isTimerRunning) "Time Left" else "Tap Play"
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Timer Play / Pause / Reset Control Row
            Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                NeoPillChip(
                    text = if (isTimerRunning) "Pause ⏸" else "Start Timer ▶",
                    backgroundColor = Color.White.copy(alpha = 0.35f),
                    textColor = Color(0xFF141518),
                    borderColor = Color.White.copy(alpha = 0.5f),
                    onClick = { isTimerRunning = !isTimerRunning }
                )

                NeoPillChip(
                    text = "Reset ↺",
                    backgroundColor = Color.Black.copy(alpha = 0.2f),
                    textColor = Color.White,
                    borderColor = Color.White.copy(alpha = 0.3f),
                    onClick = {
                        isTimerRunning = false
                        timerSeconds = 120
                    }
                )
            }
        }

        // --- BOTTOM DARK SECTION (Fills rest of screen seamlessly) ---
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .background(SheetBlack)
                .padding(horizontal = 20.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                // Section Title
                Text(
                    text = "ROUND INSTRUCTIONS",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    color = TextMuted,
                    letterSpacing = 1.sp
                )

                // Instruction Card
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .background(SheetCard)
                        .border(1.dp, SheetCardBorder, RoundedCornerShape(18.dp))
                        .padding(16.dp)
                ) {
                    Column {
                        Text(
                            text = "How to play this round:",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "• ${starter?.name ?: "First player"} says a clue word or short phrase.\n• Go clockwise: every player gives one clue.\n• Keep clues subtle — don't give the word away!\n• Imposter must bluff and blend in.",
                            fontSize = 13.sp,
                            color = TextSecondary,
                            lineHeight = 19.sp
                        )
                    }
                }
            }

            // Bottom CTA Button to Move Forward - Always visible & prominent!
            NeoButton(
                text = "Proceed to Voting",
                onClick = {
                    viewModel.proceedToActiveBoard()
                    onProceedToBoard()
                },
                testTag = "open_player_board_button"
            )
        }
    }
}
