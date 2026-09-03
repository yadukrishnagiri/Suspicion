package com.imposter.app.imposter.ui.screens

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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.NorthEast
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.app.imposter.domain.model.GamePhase
import com.imposter.app.imposter.domain.model.Player
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
import com.imposter.app.imposter.ui.components.NeoPillChip
import com.imposter.app.imposter.ui.components.NeoTopBar
import com.imposter.app.imposter.ui.components.PlayerAvatar
import com.imposter.app.imposter.ui.viewmodel.GameViewModel

@Composable
fun PlayerBoardScreen(
    viewModel: GameViewModel,
    onGameOver: () -> Unit,
    onExitGame: () -> Unit
) {
    val state by viewModel.gameState.collectAsState()
    var selectedPlayerForElimination by remember { mutableStateOf<Player?>(null) }
    var revealedEliminationPlayer by remember { mutableStateOf<Player?>(null) }

    LaunchedEffect(state.phase) {
        if (state.phase == GamePhase.GAME_RESULT) {
            onGameOver()
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(HeroOrange)
    ) {
        // --- TOP ORANGE SECTION ---
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            NeoTopBar(
                title = "Voting Round",
                onBack = onExitGame,
                rightBadgeText = "End Match",
                onRightBadgeClick = onExitGame,
                isDarkHeader = false
            )

            // Status metric pills
            Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                NeoPillChip(
                    text = "${state.activeCitizensCount} Citizens",
                    backgroundColor = Color.White.copy(alpha = 0.25f),
                    textColor = Color(0xFF141518),
                    borderColor = Color.White.copy(alpha = 0.4f)
                )

                NeoPillChip(
                    text = "${state.activeImpostersCount} Imposters",
                    backgroundColor = Color.Black.copy(alpha = 0.2f),
                    textColor = Color.White,
                    borderColor = Color.White.copy(alpha = 0.3f)
                )
            }
        }

        // --- BOTTOM DARK SHEET ---
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clip(RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp))
                .background(SheetBlack)
                .padding(top = 20.dp)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 24.dp, vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "VOTE A SUSPECT",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        color = TextMuted,
                        letterSpacing = 1.sp
                    )

                    Text(
                        text = "Tap to eliminate",
                        fontSize = 11.sp,
                        color = TextSecondary
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Suspects Grid
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(horizontal = 20.dp, vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxSize()
                ) {
                    items(state.players) { player ->
                        val isEliminated = player.isEliminated

                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .background(if (isEliminated) SheetCard.copy(alpha = 0.4f) else SheetCard)
                                .border(
                                    1.dp,
                                    if (isEliminated) SheetCardBorder.copy(alpha = 0.4f) else SheetCardBorder,
                                    RoundedCornerShape(20.dp)
                                )
                                .clickable(enabled = !isEliminated) {
                                    selectedPlayerForElimination = player
                                }
                                .padding(16.dp)
                                .testTag("player_card_${player.name}")
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.End
                                ) {
                                    if (!isEliminated) {
                                        Box(
                                            modifier = Modifier
                                                .size(28.dp)
                                                .clip(CircleShape)
                                                .background(SheetCardElevated)
                                                .border(1.dp, SheetCardBorder, CircleShape),
                                            contentAlignment = Alignment.Center
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.NorthEast,
                                                contentDescription = null,
                                                tint = TextSecondary,
                                                modifier = Modifier.size(13.dp)
                                            )
                                        }
                                    }
                                }

                                PlayerAvatar(
                                    name = player.name,
                                    isEliminated = isEliminated,
                                    accentColor = HeroOrange,
                                    modifier = Modifier.size(48.dp)
                                )

                                Spacer(modifier = Modifier.height(10.dp))

                                Text(
                                    text = player.name,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isEliminated) TextMuted else TextPrimary,
                                    maxLines = 1
                                )

                                Spacer(modifier = Modifier.height(6.dp))

                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(if (isEliminated) SheetCardElevated.copy(alpha = 0.5f) else HeroOrange.copy(alpha = 0.15f))
                                        .padding(horizontal = 10.dp, vertical = 4.dp)
                                ) {
                                    Text(
                                        text = if (isEliminated) "Eliminated" else "Vote Out",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isEliminated) TextMuted else HeroOrange
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Vote Confirmation Dialog
        if (selectedPlayerForElimination != null) {
            val suspect = selectedPlayerForElimination!!
            AlertDialog(
                onDismissRequest = { selectedPlayerForElimination = null },
                containerColor = SheetCard,
                title = {
                    Text(
                        text = "Eliminate ${suspect.name}?",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                },
                text = {
                    Text(
                        text = "Did the group vote to eliminate ${suspect.name}? Their true role will be revealed immediately.",
                        fontSize = 14.sp,
                        color = TextSecondary
                    )
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            val eliminated = suspect
                            selectedPlayerForElimination = null
                            viewModel.eliminatePlayer(eliminated)
                            revealedEliminationPlayer = eliminated
                        },
                        modifier = Modifier.testTag("confirm_eliminate_button")
                    ) {
                        Text(
                            text = "Confirm Elimination",
                            color = ImposterCrimson,
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                dismissButton = {
                    TextButton(onClick = { selectedPlayerForElimination = null }) {
                        Text("Cancel", color = TextSecondary)
                    }
                }
            )
        }

        // Role Revealed Dialog
        if (revealedEliminationPlayer != null) {
            val eliminated = revealedEliminationPlayer!!
            val wasImposter = eliminated.isImposter
            val titleText = if (wasImposter) "${eliminated.name} was an Imposter!" else "${eliminated.name} was a Citizen!"
            val titleColor = if (wasImposter) CitizenEmerald else ImposterCrimson

            AlertDialog(
                onDismissRequest = { revealedEliminationPlayer = null },
                containerColor = SheetCard,
                title = {
                    Text(
                        text = titleText,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = titleColor
                    )
                },
                text = {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        PlayerAvatar(
                            name = eliminated.name,
                            isEliminated = true,
                            modifier = Modifier.size(56.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = if (wasImposter) {
                                "Great detective work! One imposter is unmasked."
                            } else {
                                "An innocent citizen was eliminated. The imposter blends in."
                            },
                            fontSize = 14.sp,
                            color = TextSecondary,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "${state.activeCitizensCount} Citizens  •  ${state.activeImpostersCount} Imposters remaining",
                            fontSize = 12.sp,
                            color = TextMuted,
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                confirmButton = {
                    TextButton(
                        onClick = { revealedEliminationPlayer = null },
                        modifier = Modifier.testTag("continue_after_elimination_button")
                    ) {
                        Text(
                            text = "Continue",
                            color = HeroOrange,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            )
        }
    }
}
