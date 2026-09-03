package com.imposter.app.imposter.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
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
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.NorthEast
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
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
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.imposter.app.imposter.domain.model.GameConfig
import com.imposter.app.imposter.domain.model.GameMode
import com.imposter.app.imposter.theme.AccentGold
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
import com.imposter.app.imposter.ui.components.NeoStepper
import com.imposter.app.imposter.ui.components.NeoTopBar
import com.imposter.app.imposter.ui.components.PlayerAvatar
import com.imposter.app.imposter.ui.viewmodel.SetupViewModel

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun SetupScreen(
    viewModel: SetupViewModel,
    onBack: () -> Unit,
    onStartGame: (GameConfig) -> Unit
) {
    val config by viewModel.config.collectAsState()
    val validationError by viewModel.validationError.collectAsState()
    val categories = viewModel.availableCategories
    val recentPlayers by viewModel.recentPlayers.collectAsState()

    Scaffold(
        containerColor = SheetBlack,
        bottomBar = {
            // --- PINNED / STICKY BOTTOM ACTION BAR ---
            Surface(
                color = SheetBlack,
                border = BorderStroke(1.dp, SheetCardBorder),
                shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 14.dp)
                        .navigationBarsPadding()
                ) {
                    if (validationError != null) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 8.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Warning,
                                contentDescription = null,
                                tint = ImposterCrimson,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = validationError ?: "",
                                fontSize = 12.sp,
                                color = ImposterCrimson,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    NeoButton(
                        text = "Start Game (${config.playerCount} Players)",
                        onClick = {
                            if (viewModel.validate()) {
                                onStartGame(config)
                            }
                        },
                        testTag = "start_game_setup_button"
                    )
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(SheetBlack)
                .verticalScroll(rememberScrollState())
        ) {
            // --- TOP ORANGE SECTION (Header & Stat Steppers) ---
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp))
                    .background(HeroOrange)
                    .padding(bottom = 18.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                NeoTopBar(
                    title = "Room Setup",
                    onBack = onBack,
                    rightBadgeText = "Reset ↺",
                    onRightBadgeClick = {
                        viewModel.setPlayerCount(4)
                        viewModel.setImposterCount(1)
                        viewModel.setGameMode(GameMode.WORD_VS_WORD)
                    },
                    isDarkHeader = false
                )

                Spacer(modifier = Modifier.height(6.dp))

                // Two Stat Cards with clean single numbers and [-] [+] buttons
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    // Players Card
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(22.dp))
                            .background(Color.White.copy(alpha = 0.2f))
                            .border(1.2.dp, Color.White.copy(alpha = 0.35f), RoundedCornerShape(22.dp))
                            .padding(14.dp)
                    ) {
                        Column(horizontalAlignment = Alignment.Start) {
                            Text(
                                text = "TOTAL PLAYERS",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = Color(0xFF141518),
                                letterSpacing = 0.5.sp
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = config.playerCount.toString(),
                                    fontSize = 32.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color.White
                                )

                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    // Minus Button
                                    Box(
                                        modifier = Modifier
                                            .size(34.dp)
                                            .clip(CircleShape)
                                            .background(if (config.playerCount > 3) Color.Black.copy(alpha = 0.25f) else Color.Black.copy(alpha = 0.1f))
                                            .border(1.dp, Color.White.copy(alpha = 0.3f), CircleShape)
                                            .clickable(enabled = config.playerCount > 3) {
                                                viewModel.setPlayerCount(config.playerCount - 1)
                                            }
                                            .testTag("total_players_decrement"),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Remove,
                                            contentDescription = "Decrease Players",
                                            tint = if (config.playerCount > 3) Color.White else Color.White.copy(alpha = 0.35f),
                                            modifier = Modifier.size(15.dp)
                                        )
                                    }

                                    // Plus Button
                                    Box(
                                        modifier = Modifier
                                            .size(34.dp)
                                            .clip(CircleShape)
                                            .background(if (config.playerCount < 15) Color.Black.copy(alpha = 0.25f) else Color.Black.copy(alpha = 0.1f))
                                            .border(1.dp, Color.White.copy(alpha = 0.3f), CircleShape)
                                            .clickable(enabled = config.playerCount < 15) {
                                                viewModel.setPlayerCount(config.playerCount + 1)
                                            }
                                            .testTag("total_players_increment"),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Add,
                                            contentDescription = "Increase Players",
                                            tint = if (config.playerCount < 15) Color.White else Color.White.copy(alpha = 0.35f),
                                            modifier = Modifier.size(15.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }

                    // Imposters Card
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(22.dp))
                            .background(Color.White.copy(alpha = 0.2f))
                            .border(1.2.dp, Color.White.copy(alpha = 0.35f), RoundedCornerShape(22.dp))
                            .padding(14.dp)
                    ) {
                        Column(horizontalAlignment = Alignment.Start) {
                            Text(
                                text = "IMPOSTERS",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = Color(0xFF141518),
                                letterSpacing = 0.5.sp
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            val maxImposters = ((config.playerCount - 1) / 2).coerceAtLeast(1)
                            val canDec = config.imposterCount > 1
                            val canInc = config.imposterCount < maxImposters

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = config.imposterCount.toString(),
                                    fontSize = 32.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color.White
                                )

                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    // Minus Button
                                    Box(
                                        modifier = Modifier
                                            .size(34.dp)
                                            .clip(CircleShape)
                                            .background(if (canDec) Color.Black.copy(alpha = 0.25f) else Color.Black.copy(alpha = 0.1f))
                                            .border(1.dp, Color.White.copy(alpha = 0.3f), CircleShape)
                                            .clickable(enabled = canDec) {
                                                viewModel.setImposterCount(config.imposterCount - 1)
                                            }
                                            .testTag("imposters_decrement"),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Remove,
                                            contentDescription = "Decrease Imposters",
                                            tint = if (canDec) Color.White else Color.White.copy(alpha = 0.35f),
                                            modifier = Modifier.size(15.dp)
                                        )
                                    }

                                    // Plus Button
                                    Box(
                                        modifier = Modifier
                                            .size(34.dp)
                                            .clip(CircleShape)
                                            .background(if (canInc) Color.Black.copy(alpha = 0.25f) else Color.Black.copy(alpha = 0.1f))
                                            .border(1.dp, Color.White.copy(alpha = 0.3f), CircleShape)
                                            .clickable(enabled = canInc) {
                                                viewModel.setImposterCount(config.imposterCount + 1)
                                            }
                                            .testTag("imposters_increment"),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Add,
                                            contentDescription = "Increase Imposters",
                                            tint = if (canInc) Color.White else Color.White.copy(alpha = 0.35f),
                                            modifier = Modifier.size(15.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // --- DARK CONTENT CONTAINER ---
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(SheetBlack)
                    .padding(horizontal = 20.dp, vertical = 20.dp)
            ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                // Section 1: Game Modes Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "GAME MODE",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        color = TextMuted,
                        letterSpacing = 1.sp
                    )

                    Text(
                        text = when (config.gameMode) {
                            GameMode.WORD_VS_WORD -> "Word vs Word"
                            GameMode.WORD_VS_HINT -> "Word vs Hint"
                            GameMode.BLIND_IMPOSTER -> "Blind Imposter"
                        },
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = HeroOrange
                    )
                }

                // Game Mode Cards (Inspired by the Reference cards)
                NeoModeCard(
                    title = "Word vs Word",
                    subtitle = "Citizens and Imposters get close words. Subtlety is key.",
                    tags = listOf("Standard" to HeroOrange, "Balanced" to CitizenEmerald),
                    isSelected = config.gameMode == GameMode.WORD_VS_WORD,
                    onClick = { viewModel.setGameMode(GameMode.WORD_VS_WORD) },
                    testTag = "mode_word_vs_word"
                )

                NeoModeCard(
                    title = "Category Hint",
                    subtitle = "Citizens receive the exact word; Imposters only get the category.",
                    tags = listOf("Clue Mode" to Color(0xFF8B5CF6), "Bluffing" to AccentGold),
                    isSelected = config.gameMode == GameMode.WORD_VS_HINT,
                    onClick = { viewModel.setGameMode(GameMode.WORD_VS_HINT) },
                    testTag = "mode_word_vs_hint"
                )

                NeoModeCard(
                    title = "Blind Imposter",
                    subtitle = "Imposter has zero information and must bluff solely from cues.",
                    tags = listOf("Hardcore" to ImposterCrimson, "High Stakes" to AccentGold),
                    isSelected = config.gameMode == GameMode.BLIND_IMPOSTER,
                    onClick = { viewModel.setGameMode(GameMode.BLIND_IMPOSTER) },
                    testTag = "mode_blind_imposter"
                )

                // Section 2: Word Category Pills
                Text(
                    text = "WORD CATEGORY",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    color = TextMuted,
                    letterSpacing = 1.sp
                )

                // Horizontal scrollable pill chip row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val allCategories = listOf("All Categories") + categories
                    allCategories.forEach { catName ->
                        val isSelected = (config.category == null && catName == "All Categories") ||
                                (config.category == catName)

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(if (isSelected) HeroOrange else SheetCardElevated)
                                .border(
                                    1.dp,
                                    if (isSelected) HeroOrange else SheetCardBorder,
                                    RoundedCornerShape(20.dp)
                                )
                                .clickable { viewModel.setCategory(catName) }
                                .padding(horizontal = 16.dp, vertical = 9.dp)
                                .testTag("category_$catName"),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = catName,
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else TextPrimary
                            )
                        }
                    }
                }

                // Section 3: Player Names & Saved Players
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "PLAYER ROSTER (${config.playerNames.size})",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        color = TextMuted,
                        letterSpacing = 1.sp
                    )
                }

                // Quick Saved Players
                if (recentPlayers.isNotEmpty()) {
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        recentPlayers.forEach { savedName ->
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(SheetCardElevated)
                                    .border(1.dp, SheetCardBorder, RoundedCornerShape(12.dp))
                                    .clickable { viewModel.applyRecentPlayerName(savedName) }
                                    .padding(horizontal = 10.dp, vertical = 5.dp)
                            ) {
                                Text(
                                    text = "+ $savedName",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = HeroOrange
                                )
                            }
                        }
                    }
                }

                // Player text fields
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    config.playerNames.forEachIndexed { index, name ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(18.dp))
                                .background(SheetCard)
                                .border(1.dp, SheetCardBorder, RoundedCornerShape(18.dp))
                                .padding(horizontal = 14.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            PlayerAvatar(
                                name = name.ifBlank { "P${index + 1}" },
                                modifier = Modifier.size(34.dp),
                                accentColor = HeroOrange
                            )

                            Spacer(modifier = Modifier.width(10.dp))

                            OutlinedTextField(
                                value = name,
                                onValueChange = { viewModel.updatePlayerName(index, it) },
                                label = { Text("Player ${index + 1}", fontSize = 11.sp) },
                                singleLine = true,
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = HeroOrange,
                                    unfocusedBorderColor = Color.Transparent,
                                    focusedTextColor = TextPrimary,
                                    unfocusedTextColor = TextPrimary,
                                    focusedLabelColor = HeroOrange,
                                    unfocusedLabelColor = TextMuted,
                                    cursorColor = HeroOrange
                                ),
                                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words),
                                modifier = Modifier
                                    .weight(1f)
                                    .testTag("player_name_input_$index")
                            )
                        }
                    }
                }

                if (validationError != null) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(14.dp))
                            .background(ImposterCrimson.copy(alpha = 0.15f))
                            .border(1.dp, ImposterCrimson.copy(alpha = 0.5f), RoundedCornerShape(14.dp))
                            .padding(14.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Warning,
                                contentDescription = null,
                                tint = ImposterCrimson,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = validationError ?: "",
                                fontSize = 13.sp,
                                color = ImposterCrimson,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

/**
 * Game Mode Card matching the reference card design:
 * Left avatar circle, title, description, tags, and right circular check/arrow.
 */
@Composable
private fun NeoModeCard(
    title: String,
    subtitle: String,
    tags: List<Pair<String, Color>>,
    isSelected: Boolean,
    onClick: () -> Unit,
    testTag: String
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(if (isSelected) SheetCardElevated else SheetCard)
            .border(
                1.2.dp,
                if (isSelected) HeroOrange else SheetCardBorder,
                RoundedCornerShape(20.dp)
            )
            .clickable { onClick() }
            .padding(16.dp)
            .testTag(testTag)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Spacer(modifier = Modifier.height(3.dp))
                Text(
                    text = subtitle,
                    fontSize = 12.sp,
                    color = TextSecondary,
                    lineHeight = 16.sp
                )

                Spacer(modifier = Modifier.height(10.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    tags.forEach { (tagText, tagColor) ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(10.dp))
                                .background(tagColor.copy(alpha = 0.15f))
                                .border(1.dp, tagColor.copy(alpha = 0.35f), RoundedCornerShape(10.dp))
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = tagText,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = tagColor
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            // Right Selection / Arrow Circle
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(CircleShape)
                    .background(if (isSelected) HeroOrange else SheetCardElevated)
                    .border(
                        1.dp,
                        if (isSelected) HeroOrange else SheetCardBorder,
                        CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                if (isSelected) {
                    Icon(
                        imageVector = Icons.Default.Check,
                        contentDescription = "Selected",
                        tint = Color.White,
                        modifier = Modifier.size(18.dp)
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.NorthEast,
                        contentDescription = "Select",
                        tint = TextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}
