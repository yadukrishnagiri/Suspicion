package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.GameCategory
import com.example.data.GameMode
import com.example.ui.components.NeoButton
import com.example.ui.components.NeoPill
import com.example.ui.theme.AccentAmber
import com.example.ui.theme.AccentCoral
import com.example.ui.theme.AccentMint
import com.example.ui.theme.AccentPurple
import com.example.ui.theme.CanvasDeep
import com.example.ui.theme.SurfaceBorder
import com.example.ui.theme.SurfaceDark
import com.example.ui.theme.SurfaceElevated
import com.example.ui.theme.TextDark
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextSubtle
import com.example.ui.theme.TextWhite
import com.example.viewmodel.GameUiState

/**
 * Step 1: Sleek, systematic, single-panel Players & Roles configuration.
 * Avoids card clutter by consolidating game balance controls into one unified, elegant panel.
 */
@Composable
fun SetupPlayersScreen(
    state: GameUiState,
    onPlayerCountChange: (Int) -> Unit,
    onImposterCountChange: (Int) -> Unit,
    onPlayerNameChange: (Int, String) -> Unit,
    onAddPlayer: (String) -> Unit,
    onRemovePlayer: (Int) -> Unit,
    onContinueToGameOptions: () -> Unit,
    modifier: Modifier = Modifier
) {
    var editingPlayerIndex by remember { mutableStateOf<Int?>(null) }
    var editingPlayerName by remember { mutableStateOf("") }
    var isAddingPlayerDialog by remember { mutableStateOf(false) }
    var newPlayerNameInput by remember { mutableStateOf("") }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(CanvasDeep)
            .statusBarsPadding()
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // ==========================================
            // HEADER BAR: Clean brand mark + PLAYERS title + Step pill
            // ==========================================
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .clip(CircleShape)
                            .background(Color.White),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "🕵️",
                            fontSize = 20.sp
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column {
                        Text(
                            text = "PLAYERS",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = (-0.5).sp
                            ),
                            color = TextWhite
                        )
                        Text(
                            text = "PASS & PLAY DECK",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            ),
                            color = TextSubtle
                        )
                    }
                }

                NeoPill(
                    text = "Step 1 of 2",
                    backgroundColor = SurfaceElevated,
                    textColor = AccentAmber,
                    dotColor = AccentAmber
                )
            }

            // ==========================================
            // MAIN CONTENT: Unified configuration container
            // ==========================================
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                contentPadding = PaddingValues(top = 8.dp, bottom = 110.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Unified Game Setup Panel
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(24.dp))
                            .background(SurfaceDark)
                            .border(1.dp, SurfaceBorder, RoundedCornerShape(24.dp))
                            .padding(20.dp)
                    ) {
                        Column {
                            // Section 1: Total Players Stepper
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "TOTAL PLAYERS",
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            fontWeight = FontWeight.Black,
                                            letterSpacing = 1.sp
                                        ),
                                        color = TextWhite
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "3 to 15 in this match",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = TextSubtle
                                    )
                                }

                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(38.dp)
                                            .clip(CircleShape)
                                            .background(SurfaceElevated)
                                            .clickable(
                                                interactionSource = remember { MutableInteractionSource() },
                                                indication = ripple(color = Color.White),
                                                onClick = { onPlayerCountChange(state.totalPlayerCount - 1) }
                                            )
                                            .testTag("btn_decrease_players"),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Remove,
                                            contentDescription = "Decrease",
                                            tint = TextWhite,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }

                                    Box(
                                        modifier = Modifier
                                            .size(42.dp)
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(SurfaceElevated)
                                            .border(1.dp, SurfaceBorder, RoundedCornerShape(12.dp)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = String.format("%02d", state.totalPlayerCount),
                                            style = MaterialTheme.typography.titleMedium.copy(
                                                fontWeight = FontWeight.Black
                                            ),
                                            color = AccentAmber
                                        )
                                    }

                                    Box(
                                        modifier = Modifier
                                            .size(38.dp)
                                            .clip(CircleShape)
                                            .background(SurfaceElevated)
                                            .clickable(
                                                interactionSource = remember { MutableInteractionSource() },
                                                indication = ripple(color = Color.White),
                                                onClick = { onPlayerCountChange(state.totalPlayerCount + 1) }
                                            )
                                            .testTag("btn_increase_players"),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Add,
                                            contentDescription = "Increase",
                                            tint = TextWhite,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(1.dp)
                                    .background(SurfaceBorder)
                            )
                            Spacer(modifier = Modifier.height(16.dp))

                            // Section 2: Imposters Stepper
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "IMPOSTERS",
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            fontWeight = FontWeight.Black,
                                            letterSpacing = 1.sp
                                        ),
                                        color = TextWhite
                                    )
                                    Spacer(modifier = Modifier.height(2.dp))
                                    Text(
                                        text = "Max ${state.maxImpostersAllowed} allowed",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = TextSubtle
                                    )
                                }

                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(38.dp)
                                            .clip(CircleShape)
                                            .background(SurfaceElevated)
                                            .clickable(
                                                interactionSource = remember { MutableInteractionSource() },
                                                indication = ripple(color = Color.White),
                                                onClick = { onImposterCountChange(state.imposterCount - 1) }
                                            )
                                            .testTag("btn_decrease_imposters"),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Remove,
                                            contentDescription = "Decrease",
                                            tint = TextWhite,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }

                                    Box(
                                        modifier = Modifier
                                            .size(42.dp)
                                            .clip(RoundedCornerShape(12.dp))
                                            .background(AccentCoral.copy(alpha = 0.15f))
                                            .border(1.dp, AccentCoral, RoundedCornerShape(12.dp)),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            text = String.format("%02d", state.imposterCount),
                                            style = MaterialTheme.typography.titleMedium.copy(
                                                fontWeight = FontWeight.Black
                                            ),
                                            color = AccentCoral
                                        )
                                    }

                                    Box(
                                        modifier = Modifier
                                            .size(38.dp)
                                            .clip(CircleShape)
                                            .background(SurfaceElevated)
                                            .clickable(
                                                interactionSource = remember { MutableInteractionSource() },
                                                indication = ripple(color = Color.White),
                                                onClick = { onImposterCountChange(state.imposterCount + 1) }
                                            )
                                            .testTag("btn_increase_imposters"),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Add,
                                            contentDescription = "Increase",
                                            tint = TextWhite,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }

                            Spacer(modifier = Modifier.height(16.dp))

                            // Section 3: Ratio pill
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(SurfaceElevated)
                                    .padding(horizontal = 14.dp, vertical = 10.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(CircleShape)
                                            .background(AccentMint)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "${state.totalPlayerCount - state.imposterCount} Civilians vs ${state.imposterCount} Imposter${if (state.imposterCount > 1) "s" else ""}",
                                        style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold),
                                        color = TextWhite
                                    )
                                }
                                Text(
                                    text = "BALANCED",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontWeight = FontWeight.Black,
                                        letterSpacing = 1.sp
                                    ),
                                    color = AccentMint
                                )
                            }
                        }
                    }
                }

                // ==========================================
                // PARTICIPANT ROSTER (Unified container)
                // ==========================================
                item {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "PARTICIPANTS",
                                style = MaterialTheme.typography.labelMedium.copy(
                                    fontWeight = FontWeight.Black,
                                    letterSpacing = 1.sp
                                ),
                                color = TextSubtle
                            )
                            Text(
                                text = "Passing order for private reveal",
                                style = MaterialTheme.typography.bodySmall,
                                color = TextSubtle
                            )
                        }

                        if (state.participantNames.size < 15) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(50))
                                    .background(SurfaceDark)
                                    .border(1.dp, SurfaceBorder, RoundedCornerShape(50))
                                    .clickable {
                                        newPlayerNameInput = "Player ${state.participantNames.size + 1}"
                                        isAddingPlayerDialog = true
                                    }
                                    .padding(horizontal = 12.dp, vertical = 6.dp)
                                    .testTag("btn_open_add_player")
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.Add,
                                        contentDescription = null,
                                        tint = AccentMint,
                                        modifier = Modifier.size(14.dp)
                                    )
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text(
                                        text = "ADD",
                                        style = MaterialTheme.typography.labelSmall.copy(
                                            fontWeight = FontWeight.Bold,
                                            letterSpacing = 0.5.sp
                                        ),
                                        color = TextWhite
                                    )
                                }
                            }
                        }
                    }
                }

                // Unified Roster List
                itemsIndexed(state.participantNames) { index, name ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(16.dp))
                            .background(SurfaceDark)
                            .border(1.dp, SurfaceBorder, RoundedCornerShape(16.dp))
                            .clickable {
                                editingPlayerIndex = index
                                editingPlayerName = name
                            }
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                            .testTag("player_row_$index"),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(30.dp)
                                    .clip(CircleShape)
                                    .background(SurfaceElevated),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "${index + 1}",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontWeight = FontWeight.Black
                                    ),
                                    color = AccentAmber
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Text(
                                text = name,
                                style = MaterialTheme.typography.titleSmall.copy(
                                    fontWeight = FontWeight.Bold
                                ),
                                color = TextWhite
                            )
                        }

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            IconButton(
                                onClick = {
                                    editingPlayerIndex = index
                                    editingPlayerName = name
                                },
                                modifier = Modifier.size(32.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Edit,
                                    contentDescription = "Edit name",
                                    tint = TextMuted,
                                    modifier = Modifier.size(15.dp)
                                )
                            }

                            if (state.participantNames.size > 3) {
                                IconButton(
                                    onClick = { onRemovePlayer(index) },
                                    modifier = Modifier
                                        .size(32.dp)
                                        .testTag("btn_remove_player_$index")
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.Close,
                                        contentDescription = "Remove player",
                                        tint = TextSubtle,
                                        modifier = Modifier.size(15.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // ==========================================
        // PINNED BOTTOM ACTION BAR
        // ==========================================
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        listOf(
                            Color.Transparent,
                            CanvasDeep.copy(alpha = 0.95f),
                            CanvasDeep
                        )
                    )
                )
                .padding(horizontal = 20.dp)
                .navigationBarsPadding()
                .padding(bottom = 16.dp)
        ) {
            NeoButton(
                text = "NEXT: CATEGORIES",
                onClick = onContinueToGameOptions,
                containerColor = Color.White,
                contentColor = TextDark,
                icon = Icons.AutoMirrored.Filled.ArrowForward,
                testTag = "btn_continue_to_modes"
            )
        }

        // Dialog: Edit Player Name
        if (editingPlayerIndex != null) {
            AlertDialog(
                onDismissRequest = { editingPlayerIndex = null },
                containerColor = SurfaceDark,
                title = {
                    Text(
                        text = "Edit Player #${(editingPlayerIndex ?: 0) + 1}",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        color = TextWhite
                    )
                },
                text = {
                    OutlinedTextField(
                        value = editingPlayerName,
                        onValueChange = { editingPlayerName = it },
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = TextWhite,
                            unfocusedTextColor = TextWhite,
                            focusedBorderColor = AccentAmber,
                            unfocusedBorderColor = SurfaceBorder
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_edit_player_name")
                    )
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            editingPlayerIndex?.let { idx ->
                                onPlayerNameChange(idx, editingPlayerName)
                            }
                            editingPlayerIndex = null
                        },
                        modifier = Modifier.testTag("btn_confirm_edit_player")
                    ) {
                        Text("SAVE", color = AccentAmber, fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { editingPlayerIndex = null }) {
                        Text("CANCEL", color = TextMuted)
                    }
                }
            )
        }

        // Dialog: Add Player
        if (isAddingPlayerDialog) {
            AlertDialog(
                onDismissRequest = { isAddingPlayerDialog = false },
                containerColor = SurfaceDark,
                title = {
                    Text(
                        text = "Add Participant",
                        style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
                        color = TextWhite
                    )
                },
                text = {
                    OutlinedTextField(
                        value = newPlayerNameInput,
                        onValueChange = { newPlayerNameInput = it },
                        singleLine = true,
                        placeholder = { Text("Enter name", color = TextSubtle) },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = TextWhite,
                            unfocusedTextColor = TextWhite,
                            focusedBorderColor = AccentAmber,
                            unfocusedBorderColor = SurfaceBorder
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_add_player_name")
                    )
                },
                confirmButton = {
                    TextButton(
                        onClick = {
                            onAddPlayer(newPlayerNameInput)
                            isAddingPlayerDialog = false
                        },
                        modifier = Modifier.testTag("btn_confirm_add_player")
                    ) {
                        Text("ADD", color = AccentAmber, fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { isAddingPlayerDialog = false }) {
                        Text("CANCEL", color = TextMuted)
                    }
                }
            )
        }
    }
}

/**
 * Backward compatibility signature for SetupScreen
 */
@Composable
fun SetupScreen(
    state: GameUiState,
    onPlayerCountChange: (Int) -> Unit,
    onImposterCountChange: (Int) -> Unit,
    onPlayerNameChange: (Int, String) -> Unit,
    onAddPlayer: (String) -> Unit,
    onRemovePlayer: (Int) -> Unit,
    onSelectMode: (GameMode) -> Unit = {},
    onSelectCategory: (GameCategory) -> Unit = {},
    onStartGame: () -> Unit = {},
    onContinue: () -> Unit = onStartGame,
    modifier: Modifier = Modifier
) {
    SetupPlayersScreen(
        state = state,
        onPlayerCountChange = onPlayerCountChange,
        onImposterCountChange = onImposterCountChange,
        onPlayerNameChange = onPlayerNameChange,
        onAddPlayer = onAddPlayer,
        onRemovePlayer = onRemovePlayer,
        onContinueToGameOptions = onContinue,
        modifier = modifier
    )
}
