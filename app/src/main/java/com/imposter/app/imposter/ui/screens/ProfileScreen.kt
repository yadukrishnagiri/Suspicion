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
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.app.imposter.data.repository.UserPreferencesRepository
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
import kotlinx.coroutines.launch

@Composable
fun ProfileScreen(
    preferencesRepo: UserPreferencesRepository,
    onBack: () -> Unit
) {
    val stats by preferencesRepo.gameStats.collectAsState(initial = null)
    val recentPlayers by preferencesRepo.recentPlayers.collectAsState(initial = emptyList())
    val coroutineScope = rememberCoroutineScope()
    var showResetDialog by remember { mutableStateOf(false) }

    val totalGames = stats?.gamesPlayed ?: 0
    val citizenWins = stats?.citizenWins ?: 0
    val imposterWins = stats?.imposterWins ?: 0

    val citizenPct = if (totalGames > 0) (citizenWins * 100 / totalGames) else 50
    val imposterPct = if (totalGames > 0) (imposterWins * 100 / totalGames) else 50

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
                title = "Performance",
                onBack = onBack,
                rightBadgeText = "$totalGames Games",
                isDarkHeader = false
            )

            // Metric pills in top header
            Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                NeoPillChip(
                    text = "Citizens: $citizenWins win",
                    backgroundColor = Color.White.copy(alpha = 0.25f),
                    textColor = Color(0xFF141518),
                    borderColor = Color.White.copy(alpha = 0.4f)
                )

                NeoPillChip(
                    text = "Imposters: $imposterWins win",
                    backgroundColor = Color.Black.copy(alpha = 0.2f),
                    textColor = Color.White,
                    borderColor = Color.White.copy(alpha = 0.3f)
                )
            }
        }

        // --- BOTTOM DARK CONTAINER ---
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clip(RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp))
                .background(SheetBlack)
                .padding(horizontal = 20.dp, vertical = 20.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Record Card
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
                            text = "CAREER RECORD",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = TextMuted,
                            letterSpacing = 1.sp
                        )

                        Spacer(modifier = Modifier.height(14.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "Total Matches",
                                    fontSize = 13.sp,
                                    color = TextSecondary
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "$totalGames",
                                    fontSize = 32.sp,
                                    fontWeight = FontWeight.Black,
                                    color = TextPrimary
                                )
                            }

                            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                                Column(horizontalAlignment = Alignment.End) {
                                    Text(
                                        text = "Citizen Wins",
                                        fontSize = 12.sp,
                                        color = HeroOrange,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "$citizenWins ($citizenPct%)",
                                        fontSize = 16.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimary
                                    )
                                }

                                Column(horizontalAlignment = Alignment.End) {
                                    Text(
                                        text = "Imposter Wins",
                                        fontSize = 12.sp,
                                        color = ImposterCrimson,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = "$imposterWins ($imposterPct%)",
                                        fontSize = 16.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = TextPrimary
                                    )
                                }
                            }
                        }

                        if (totalGames > 0) {
                            Spacer(modifier = Modifier.height(14.dp))
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(8.dp)
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(SheetCardElevated)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .weight(citizenPct.toFloat().coerceAtLeast(1f))
                                        .fillMaxSize()
                                        .background(HeroOrange)
                                )
                                Box(
                                    modifier = Modifier
                                        .weight(imposterPct.toFloat().coerceAtLeast(1f))
                                        .fillMaxSize()
                                        .background(ImposterCrimson)
                                )
                            }
                        }
                    }
                }

                // Saved Roster Card
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(SheetCard)
                        .border(1.dp, SheetCardBorder, RoundedCornerShape(20.dp))
                        .padding(18.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "SAVED PLAYERS",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = TextMuted,
                                letterSpacing = 1.sp
                            )
                            Text(
                                text = "${recentPlayers.size} Players",
                                fontSize = 12.sp,
                                color = TextSecondary
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        if (recentPlayers.isEmpty()) {
                            Text(
                                text = "No saved players yet. Players added during game setup are remembered here for fast autofill.",
                                fontSize = 13.sp,
                                color = TextSecondary,
                                lineHeight = 18.sp
                            )
                        } else {
                            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                recentPlayers.forEach { name ->
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(SheetCardElevated)
                                            .padding(horizontal = 12.dp, vertical = 8.dp),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            PlayerAvatar(
                                                name = name,
                                                accentColor = HeroOrange,
                                                modifier = Modifier.size(32.dp)
                                            )
                                            Spacer(modifier = Modifier.width(10.dp))
                                            Text(
                                                text = name,
                                                fontSize = 14.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = TextPrimary
                                            )
                                        }

                                        IconButton(
                                            onClick = {
                                                coroutineScope.launch {
                                                    preferencesRepo.removeRecentPlayer(name)
                                                }
                                            },
                                            modifier = Modifier.size(32.dp)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Delete,
                                                contentDescription = "Remove player",
                                                tint = TextMuted,
                                                modifier = Modifier.size(16.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Reset Button
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .clip(RoundedCornerShape(24.dp))
                        .background(SheetCardElevated)
                        .border(1.dp, SheetCardBorder, RoundedCornerShape(24.dp))
                        .clickable { showResetDialog = true }
                        .testTag("reset_stats_button"),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "RESET GAME STATS",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        color = ImposterCrimson,
                        letterSpacing = 0.5.sp
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }

        if (showResetDialog) {
            AlertDialog(
                onDismissRequest = { showResetDialog = false },
                containerColor = SheetCard,
                title = {
                    Text(
                        text = "Reset Statistics?",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary
                    )
                },
                text = {
                    Text(
                        text = "This will reset matches, citizen wins, and imposter wins to zero.",
                        fontSize = 14.sp,
                        color = TextSecondary
                    )
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            showResetDialog = false
                            coroutineScope.launch {
                                preferencesRepo.resetStats()
                            }
                        },
                        modifier = Modifier.testTag("confirm_reset_stats_button")
                    ) {
                        Text(
                            text = "Reset",
                            color = ImposterCrimson,
                            fontWeight = FontWeight.Bold
                        )
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showResetDialog = false }) {
                        Text("Cancel", color = TextSecondary)
                    }
                }
            )
        }
    }
}
