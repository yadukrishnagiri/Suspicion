package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Campaign
import androidx.compose.material.icons.filled.FastForward
import androidx.compose.material.icons.filled.Gavel
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.Player
import com.example.ui.components.NeoButton
import com.example.ui.components.NeoCard
import com.example.ui.components.NeoPill
import com.example.ui.theme.*
import com.example.viewmodel.GameUiState

@Composable
fun DiscussionScreen(
    state: GameUiState,
    onAdvanceRound: () -> Unit,
    onSelectPlayerForElimination: (Player) -> Unit,
    onConfirmElimination: (Player) -> Unit,
    onCancelElimination: () -> Unit,
    modifier: Modifier = Modifier
) {
    val starter = state.players.getOrNull(state.discussionStarterIndex)
    val activeCount = state.players.count { !it.isEliminated }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(CanvasDark)
            .statusBarsPadding()
            .navigationBarsPadding()
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 12.dp)
        ) {
            // ==========================================
            // 1. TOP STATUS BAR (Round & Active Count)
            // ==========================================
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                NeoPill(
                    text = "ROUND ${state.discussionRound}",
                    backgroundColor = SurfaceElevated,
                    textColor = AccentAmber,
                    dotColor = AccentAmber
                )

                NeoPill(
                    text = "$activeCount OF ${state.players.size} ACTIVE",
                    backgroundColor = SurfaceElevated,
                    textColor = AccentMint,
                    dotColor = AccentMint
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // ==========================================
            // 2. SLEEK STARTER SPOTLIGHT BAR
            // ==========================================
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(AccentPurple.copy(alpha = 0.15f))
                    .border(1.dp, AccentPurpleLight.copy(alpha = 0.45f), RoundedCornerShape(16.dp))
                    .padding(horizontal = 14.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(34.dp)
                            .clip(CircleShape)
                            .background(AccentPurple),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Campaign,
                            contentDescription = "Starter Icon",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Text(
                            text = "SPEAKS FIRST THIS ROUND",
                            style = MaterialTheme.typography.labelSmall.copy(
                                letterSpacing = 1.sp,
                                fontWeight = FontWeight.Bold,
                                fontSize = 10.sp
                            ),
                            color = AccentPurpleLight
                        )
                        Text(
                            text = starter?.name ?: "Discussion Starter",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Black
                            ),
                            color = TextWhite,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }

                Box(
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(AccentPurple.copy(alpha = 0.3f))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = null,
                            tint = AccentPurpleLight,
                            modifier = Modifier.size(12.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "STARTER",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                fontSize = 10.sp
                            ),
                            color = AccentPurpleLight
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // ==========================================
            // 3. PLAYING CARDS GRID (FILLING THE SCREEN)
            // ==========================================
            // 2 columns creates authentic playing-card proportions (2x2 for 4 players)
            // without empty black voids or squished horizontal pills
            val columns = 2

            LazyVerticalGrid(
                columns = GridCells.Fixed(columns),
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(bottom = 12.dp)
            ) {
                itemsIndexed(state.players) { index, player ->
                    val isStarter = index == state.discussionStarterIndex
                    val isEliminated = player.isEliminated

                    NeoCard(
                        modifier = Modifier
                            .fillMaxWidth()
                            .aspectRatio(0.72f)
                            .clickable(enabled = !isEliminated) {
                                onSelectPlayerForElimination(player)
                            }
                            .testTag("player_card_${index}"),
                        backgroundColor = if (isEliminated) EliminatedGrey else SurfaceElevated,
                        borderColor = if (isEliminated) SurfaceBorder else if (isStarter) AccentPurpleLight else SurfaceBorder,
                        cornerRadius = 20.dp
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(12.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.SpaceBetween
                        ) {
                            // Top Row of Card: Card Number Pip & Starter Star
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(26.dp)
                                        .clip(CircleShape)
                                        .background(if (isEliminated) SurfaceDark else CanvasDark)
                                        .border(1.dp, SurfaceBorder, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "${index + 1}",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Black
                                        ),
                                        color = if (isEliminated) TextSubtle else TextWhite
                                    )
                                }

                                if (isStarter && !isEliminated) {
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(8.dp))
                                            .background(AccentPurple.copy(alpha = 0.3f))
                                            .border(1.dp, AccentPurpleLight.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                                            .padding(horizontal = 6.dp, vertical = 2.dp)
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(
                                                imageVector = Icons.Default.Star,
                                                contentDescription = "Starter",
                                                tint = AccentPurpleLight,
                                                modifier = Modifier.size(11.dp)
                                            )
                                            Spacer(modifier = Modifier.width(3.dp))
                                            Text(
                                                text = "STARTER",
                                                style = MaterialTheme.typography.labelSmall.copy(
                                                    fontSize = 8.sp,
                                                    fontWeight = FontWeight.Bold
                                                ),
                                                color = AccentPurpleLight
                                            )
                                        }
                                    }
                                }
                            }

                            // Card Centerpiece: Player Avatar & Name
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(if (state.players.size <= 4) 52.dp else 42.dp)
                                        .clip(CircleShape)
                                        .background(
                                            if (isEliminated) SurfaceDark
                                            else if (isStarter) AccentPurple.copy(alpha = 0.25f)
                                            else CanvasDark
                                        )
                                        .border(
                                            1.5.dp,
                                            if (isEliminated) SurfaceBorder
                                            else if (isStarter) AccentPurpleLight
                                            else SurfaceBorder,
                                            CircleShape
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = player.name.firstOrNull()?.uppercase() ?: "?",
                                        style = MaterialTheme.typography.titleLarge.copy(
                                            fontWeight = FontWeight.Black,
                                            fontSize = if (state.players.size <= 4) 22.sp else 18.sp
                                        ),
                                        color = if (isEliminated) TextSubtle else if (isStarter) AccentPurpleLight else TextWhite
                                    )
                                }

                                Spacer(modifier = Modifier.height(8.dp))

                                Text(
                                    text = player.name,
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Bold,
                                        fontSize = if (state.players.size <= 4) 16.sp else 14.sp
                                    ),
                                    color = if (isEliminated) TextSubtle else TextWhite,
                                    textAlign = TextAlign.Center,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )

                                Text(
                                    text = if (isEliminated) "Eliminated" else if (isStarter) "Speaks First" else "Active",
                                    style = MaterialTheme.typography.bodySmall.copy(
                                        fontSize = 11.sp
                                    ),
                                    color = if (isEliminated) TextSubtle else TextMuted
                                )
                            }

                            // Card Bottom: Action Area
                            if (isEliminated) {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(34.dp)
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(SurfaceDark),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = "ELIMINATED",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 10.sp,
                                            letterSpacing = 1.sp
                                        ),
                                        color = TextSubtle
                                    )
                                }
                            } else {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(36.dp)
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(AccentCoral.copy(alpha = 0.15f))
                                        .border(1.dp, AccentCoral.copy(alpha = 0.6f), RoundedCornerShape(10.dp))
                                        .clickable { onSelectPlayerForElimination(player) },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Gavel,
                                            contentDescription = "Vote",
                                            tint = AccentCoral,
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = "VOTE OUT",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 11.sp
                                            ),
                                            color = AccentCoral
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // ==========================================
            // 4. BOTTOM ACTION BAR (NEXT WORD ROUND)
            // ==========================================
            NeoButton(
                text = "NEXT WORD ROUND",
                onClick = onAdvanceRound,
                containerColor = AccentAmber,
                contentColor = TextDark,
                icon = Icons.Default.FastForward,
                testTag = "btn_next_round"
            )
        }

        // ==========================================
        // 5. ELIMINATION CONFIRMATION DIALOG
        // ==========================================
        val pendingPlayer = state.pendingEliminationPlayer
        if (pendingPlayer != null) {
            AlertDialog(
                onDismissRequest = onCancelElimination,
                containerColor = SurfaceDark,
                title = {
                    Text(
                        text = "Eliminate ${pendingPlayer.name}?",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        color = TextWhite
                    )
                },
                text = {
                    Column {
                        Text(
                            text = "The group has voted to eliminate ${pendingPlayer.name}.\n\nTheir role will be revealed (Citizen or Impostor). Their secret word will NEVER be revealed.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = TextMuted
                        )
                    }
                },
                confirmButton = {
                    TextButton(
                        onClick = { onConfirmElimination(pendingPlayer) }
                    ) {
                        Text(
                            text = "CONFIRM & REVEAL ROLE",
                            color = AccentCoral,
                            fontWeight = FontWeight.Black
                        )
                    }
                },
                dismissButton = {
                    TextButton(onClick = onCancelElimination) {
                        Text("CANCEL", color = TextMuted)
                    }
                }
            )
        }
    }
}
