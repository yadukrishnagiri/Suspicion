package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Settings
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
import com.example.ui.components.NeoButton
import com.example.ui.components.NeoCard
import com.example.ui.components.NeoPill
import com.example.ui.theme.*
import com.example.viewmodel.GameUiState

@Composable
fun GameOverScreen(
    state: GameUiState,
    onPlayAgain: () -> Unit,
    onChangeSetup: () -> Unit,
    onToggleRevealSecrets: () -> Unit,
    modifier: Modifier = Modifier
) {
    val outcome = state.latestEliminationOutcome
    val didPlayersWin = outcome?.didPlayersWin ?: (state.activeImpostersCount == 0)
    val bannerColor = if (didPlayersWin) AccentMint else ImposterRed
    val wordPair = state.currentWordPair

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(CanvasDark)
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 120.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // ==========================================
            // VICTORY BANNER
            // ==========================================
            item {
                NeoCard(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("card_game_over_banner"),
                    backgroundColor = bannerColor,
                    borderColor = bannerColor
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(72.dp)
                                .clip(CircleShape)
                                .background(if (didPlayersWin) TextDark else Color.White),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.EmojiEvents,
                                contentDescription = null,
                                tint = if (didPlayersWin) AccentMint else ImposterRed,
                                modifier = Modifier.size(38.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        Text(
                            text = if (didPlayersWin) "PLAYERS WIN" else "IMPOSTORS WIN",
                            style = MaterialTheme.typography.displayLarge.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = (-0.5).sp
                            ),
                            color = if (didPlayersWin) TextDark else Color.White,
                            textAlign = TextAlign.Center
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        Text(
                            text = if (didPlayersWin) {
                                "All impostors were successfully identified and eliminated!"
                            } else {
                                "Active impostors reached parity with citizens!"
                            },
                            style = MaterialTheme.typography.bodyMedium,
                            color = if (didPlayersWin) TextDark.copy(alpha = 0.85f) else Color.White.copy(alpha = 0.85f),
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }

            // ==========================================
            // PLAYER ROLES BREAKDOWN
            // ==========================================
            item {
                NeoCard(
                    modifier = Modifier.fillMaxWidth(),
                    backgroundColor = SurfaceDark
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text(
                            text = "PLAYER IDENTITY REVEAL",
                            style = MaterialTheme.typography.labelLarge,
                            color = TextMuted
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            state.players.forEachIndexed { index, player ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(16.dp))
                                        .background(SurfaceElevated)
                                        .border(
                                            1.dp,
                                            if (player.isImposter) ImposterRed.copy(alpha = 0.5f) else SurfaceBorder,
                                            RoundedCornerShape(16.dp)
                                        )
                                        .padding(horizontal = 14.dp, vertical = 10.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Box(
                                            modifier = Modifier
                                                .size(28.dp)
                                                .clip(CircleShape)
                                                .background(if (player.isImposter) ImposterRed else CitizenBlue),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Text(
                                                text = "${index + 1}",
                                                style = MaterialTheme.typography.labelMedium,
                                                color = Color.White
                                            )
                                        }
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column {
                                            Text(
                                                text = player.name,
                                                style = MaterialTheme.typography.titleMedium,
                                                color = TextWhite
                                            )
                                            if (player.isEliminated) {
                                                Text(
                                                    text = "Eliminated",
                                                    style = MaterialTheme.typography.labelSmall,
                                                    color = TextSubtle
                                                )
                                            }
                                        }
                                    }

                                    NeoPill(
                                        text = if (player.isImposter) "IMPOSTOR" else "CITIZEN",
                                        backgroundColor = if (player.isImposter) ImposterRed else CitizenBlue.copy(alpha = 0.2f),
                                        textColor = if (player.isImposter) Color.White else CitizenBlue
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // ==========================================
            // POST-GAME WORD REVEAL (OPTIONAL ACCORDION)
            // ==========================================
            item {
                NeoCard(
                    modifier = Modifier.fillMaxWidth(),
                    backgroundColor = SurfaceDark
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { onToggleRevealSecrets() },
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "GAME SECRETS",
                                    style = MaterialTheme.typography.labelLarge,
                                    color = TextMuted
                                )
                                Text(
                                    text = if (state.revealSecretsInGameOver) "Tap to hide words" else "Tap to reveal words & clues",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = AccentAmber
                                )
                            }

                            Icon(
                                imageVector = if (state.revealSecretsInGameOver) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = "Toggle words",
                                tint = AccentAmber,
                                modifier = Modifier.size(24.dp)
                            )
                        }

                        AnimatedVisibility(visible = state.revealSecretsInGameOver) {
                            Column(
                                modifier = Modifier.padding(top = 16.dp),
                                verticalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                // Main Word
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(14.dp))
                                        .background(AccentCream)
                                        .padding(14.dp)
                                ) {
                                    Column {
                                        Text(
                                            text = "MAIN WORD (CITIZENS)",
                                            style = MaterialTheme.typography.labelSmall,
                                            color = TextDark.copy(alpha = 0.7f)
                                        )
                                        Text(
                                            text = wordPair?.mainWord ?: "—",
                                            style = MaterialTheme.typography.titleLarge.copy(
                                                fontWeight = FontWeight.Black
                                            ),
                                            color = TextDark
                                        )
                                    }
                                }

                                // Imposter Content
                                if (state.selectedMode == GameMode.EVERYONE_GETS_A_WORD) {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(RoundedCornerShape(14.dp))
                                            .background(ImposterRed.copy(alpha = 0.15f))
                                            .border(1.dp, ImposterRed.copy(alpha = 0.4f), RoundedCornerShape(14.dp))
                                            .padding(14.dp)
                                    ) {
                                        Column {
                                            Text(
                                                text = "IMPOSTER WORD",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = ImposterRed
                                            )
                                            Text(
                                                text = wordPair?.imposterWord ?: "—",
                                                style = MaterialTheme.typography.titleLarge.copy(
                                                    fontWeight = FontWeight.Black
                                                ),
                                                color = Color.White
                                            )
                                        }
                                    }
                                } else if (state.selectedMode == GameMode.IMPOSTER_GETS_A_CLUE) {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(RoundedCornerShape(14.dp))
                                            .background(AccentAmber.copy(alpha = 0.15f))
                                            .border(1.dp, AccentAmber.copy(alpha = 0.4f), RoundedCornerShape(14.dp))
                                            .padding(14.dp)
                                    ) {
                                        Column {
                                            Text(
                                                text = "IMPOSTER CLUE",
                                                style = MaterialTheme.typography.labelSmall,
                                                color = AccentAmber
                                            )
                                            Text(
                                                text = "\"${wordPair?.imposterHint ?: "—"}\"",
                                                style = MaterialTheme.typography.titleMedium.copy(
                                                    fontWeight = FontWeight.Bold
                                                ),
                                                color = TextWhite
                                            )
                                        }
                                    }
                                } else {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(RoundedCornerShape(14.dp))
                                            .background(SurfaceElevated)
                                            .padding(14.dp)
                                    ) {
                                        Text(
                                            text = "Blind Imposter mode: Imposters received zero information.",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = TextMuted
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // ==========================================
        // BOTTOM ACTION BAR: PLAY AGAIN / CHANGE SETUP
        // ==========================================
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(CanvasDark.copy(alpha = 0.95f))
                .border(1.dp, SurfaceBorder, RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
                .padding(16.dp)
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                // Play Again (Retains players & order, generates new game immediately)
                NeoButton(
                    text = "PLAY AGAIN (SAME PLAYERS)",
                    onClick = onPlayAgain,
                    containerColor = AccentCoral,
                    contentColor = Color.White,
                    icon = Icons.Default.PlayArrow,
                    testTag = "btn_play_again"
                )

                // Change Setup
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(SurfaceElevated)
                        .clickable { onChangeSetup() }
                        .testTag("btn_change_setup"),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Settings,
                            contentDescription = null,
                            tint = TextMuted,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "CHANGE MODE OR PLAYERS",
                            style = MaterialTheme.typography.labelMedium.copy(
                                fontWeight = FontWeight.Bold
                            ),
                            color = TextWhite
                        )
                    }
                }
            }
        }
    }
}
