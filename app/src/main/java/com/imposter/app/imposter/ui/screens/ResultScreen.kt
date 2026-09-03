package com.imposter.app.imposter.ui.screens

import androidx.compose.foundation.Image
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
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.app.imposter.R
import com.imposter.app.imposter.domain.model.GameWinner
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
fun ResultScreen(
    viewModel: GameViewModel,
    onPlayAgainSamePlayers: () -> Unit,
    onNewGameSetup: () -> Unit
) {
    val state by viewModel.gameState.collectAsState()
    val isCitizenWin = state.winner == GameWinner.CITIZENS
    val winTitle = if (isCitizenWin) "CITIZENS WIN!" else "IMPOSTERS WIN!"
    val winSub = if (isCitizenWin) {
        "The citizens detected and eliminated all imposters."
    } else {
        "The imposters blended in and outsmarted the citizens."
    }
    val winColor = if (isCitizenWin) CitizenEmerald else ImposterCrimson
    val word = state.wordEntry

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(SheetBlack)
    ) {
        // --- TOP SECTION (Celebration Mascot & Victory Pill) ---
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp))
                .background(HeroOrange)
                .padding(bottom = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            NeoTopBar(
                title = "Match Results",
                onBack = onNewGameSetup,
                rightBadgeText = if (isCitizenWin) "Citizens" else "Imposters",
                isDarkHeader = false
            )

            // Celebration Character Mascot
            Box(
                modifier = Modifier
                    .size(170.dp)
                    .clip(RoundedCornerShape(24.dp)),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.img_mascot_celebration),
                    contentDescription = "Celebration",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Victory Capsule
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(24.dp))
                    .background(Color.Black.copy(alpha = 0.25f))
                    .border(1.dp, Color.White.copy(alpha = 0.35f), RoundedCornerShape(24.dp))
                    .padding(horizontal = 20.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "🏆 $winTitle",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White,
                    letterSpacing = 0.5.sp
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
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
                // Revealed Words Card
                if (word != null) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(SheetCard)
                            .border(1.dp, SheetCardBorder, RoundedCornerShape(20.dp))
                            .padding(18.dp)
                    ) {
                        Column {
                            Text(
                                text = "WORDS REVEALED",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = TextMuted,
                                letterSpacing = 1.sp
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(14.dp))
                                        .background(SheetCardElevated)
                                        .padding(14.dp)
                                ) {
                                    Column {
                                        Text(
                                            text = "CITIZEN WORD",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = HeroOrange
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = word.mainWord,
                                            fontSize = 18.sp,
                                            fontWeight = FontWeight.Black,
                                            color = TextPrimary
                                        )
                                    }
                                }

                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(14.dp))
                                        .background(SheetCardElevated)
                                        .padding(14.dp)
                                ) {
                                    Column {
                                        Text(
                                            text = "IMPOSTER WORD",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = ImposterCrimson
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = word.imposterWord.ifBlank { "Blind (No Word)" },
                                            fontSize = 18.sp,
                                            fontWeight = FontWeight.Black,
                                            color = ImposterCrimson
                                        )
                                    }
                                }
                            }

                            if (word.hint.isNotBlank()) {
                                Spacer(modifier = Modifier.height(10.dp))
                                Text(
                                    text = "Category: ${word.category} • Hint: ${word.hint}",
                                    fontSize = 12.sp,
                                    color = TextSecondary
                                )
                            }
                        }
                    }
                }

                // Player Roles List
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(SheetCard)
                        .border(1.dp, SheetCardBorder, RoundedCornerShape(20.dp))
                        .padding(18.dp)
                ) {
                    Column {
                        Text(
                            text = "PLAYER IDENTITIES",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = TextMuted,
                            letterSpacing = 1.sp
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            state.players.forEach { player ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(SheetCardElevated)
                                        .padding(horizontal = 12.dp, vertical = 10.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        PlayerAvatar(
                                            name = player.name,
                                            modifier = Modifier.size(32.dp),
                                            isEliminated = player.isEliminated,
                                            accentColor = if (player.isImposter) ImposterCrimson else HeroOrange
                                        )
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Text(
                                            text = player.name,
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (player.isEliminated) TextMuted else TextPrimary
                                        )
                                    }

                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(8.dp))
                                            .background(
                                                if (player.isImposter) ImposterCrimson.copy(alpha = 0.2f)
                                                else HeroOrange.copy(alpha = 0.2f)
                                            )
                                            .padding(horizontal = 10.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = if (player.isImposter) "IMPOSTER" else "CITIZEN",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Black,
                                            color = if (player.isImposter) ImposterCrimson else HeroOrange
                                        )
                                    }
                                }
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Action Buttons
                NeoButton(
                    text = "Play Again (Same Players)",
                    icon = Icons.Default.Refresh,
                    onClick = {
                        viewModel.startNewGameSamePlayers()
                        onPlayAgainSamePlayers()
                    },
                    testTag = "play_again_button"
                )

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp)
                        .clip(RoundedCornerShape(26.dp))
                        .background(SheetCardElevated)
                        .border(1.dp, SheetCardBorder, RoundedCornerShape(26.dp))
                        .clickable {
                            viewModel.resetGame()
                            onNewGameSetup()
                        }
                        .testTag("new_game_setup_button"),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "CONFIGURE NEW ROOM",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Black,
                        color = TextPrimary,
                        letterSpacing = 0.5.sp
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}
