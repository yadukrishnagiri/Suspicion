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
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import com.imposter.app.imposter.theme.AccentCoral
import com.imposter.app.imposter.theme.AccentGold
import com.imposter.app.imposter.theme.CitizenEmerald
import com.imposter.app.imposter.theme.HeroOrange
import com.imposter.app.imposter.theme.HeroOrangeDark
import com.imposter.app.imposter.theme.ImposterCrimson
import com.imposter.app.imposter.theme.SheetBlack
import com.imposter.app.imposter.theme.SheetCard
import com.imposter.app.imposter.theme.SheetCardBorder
import com.imposter.app.imposter.theme.SheetCardElevated
import com.imposter.app.imposter.theme.TextMuted
import com.imposter.app.imposter.theme.TextPrimary
import com.imposter.app.imposter.theme.TextSecondary
import com.imposter.app.imposter.ui.components.NeoActionCard
import com.imposter.app.imposter.ui.components.NeoButton
import com.imposter.app.imposter.ui.components.NeoPillChip
import com.imposter.app.imposter.ui.components.NeoTopBar

@Composable
fun HomeScreen(
    onStartGame: () -> Unit,
    onOpenRules: () -> Unit,
    onOpenProfile: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(HeroOrange)
            .verticalScroll(rememberScrollState())
    ) {
        // --- TOP ORANGE SECTION (Reference Hero Area) ---
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top Bar
            NeoTopBar(
                title = "Imposter",
                leftIcon = Icons.Default.BarChart,
                onLeftAction = onOpenProfile,
                rightBadgeText = "Offline",
                isDarkHeader = false
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Central Mascot Character Artwork (Rubber-hose sticker style from reference)
            Box(
                modifier = Modifier
                    .size(190.dp)
                    .clip(RoundedCornerShape(24.dp)),
                contentAlignment = Alignment.Center
            ) {
                Image(
                    painter = painterResource(id = R.drawable.img_mascot_imposter),
                    contentDescription = "Imposter Mascot",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Metric / Mode Pill Capsules (matching reference e.g. [ 54 This week ] [ 5 Points ])
            Row(
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                NeoPillChip(
                    text = "3–15 Players",
                    backgroundColor = Color.Black.copy(alpha = 0.18f),
                    textColor = Color.White,
                    borderColor = Color.White.copy(alpha = 0.25f)
                )

                NeoPillChip(
                    text = "3 Game Modes",
                    backgroundColor = Color.Black.copy(alpha = 0.18f),
                    textColor = Color.White,
                    borderColor = Color.White.copy(alpha = 0.25f)
                )

                NeoPillChip(
                    text = "Local Pass & Play",
                    backgroundColor = Color.Black.copy(alpha = 0.18f),
                    textColor = Color.White,
                    borderColor = Color.White.copy(alpha = 0.25f)
                )
            }
        }

        // --- BOTTOM DARK SHEET (Curving up with 32.dp rounded corners) ---
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f, fill = false)
                .clip(RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp))
                .background(SheetBlack)
                .padding(horizontal = 20.dp, vertical = 24.dp)
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Pill header search/ready bar matching reference
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(24.dp))
                        .background(SheetCard)
                        .border(1.dp, SheetCardBorder, RoundedCornerShape(24.dp))
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Tap a mode below to start playing...",
                        fontSize = 13.sp,
                        color = TextMuted
                    )

                    Box(
                        modifier = Modifier
                            .size(28.dp)
                            .clip(CircleShape)
                            .background(HeroOrange),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.PlayArrow,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                // Section Label
                Row(
                    modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp, vertical = 2.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "GAME LOBBIES",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = TextMuted,
                        letterSpacing = 1.sp
                    )

                    Text(
                        text = "Select & Launch",
                        fontSize = 11.sp,
                        color = TextSecondary
                    )
                }

                // Card 1: Custom Match Setup (Main Entrance)
                NeoActionCard(
                    title = "Custom Match Setup",
                    subtitle = "Customize player count, imposters, words & categories",
                    avatarText = "⚙️",
                    avatarColor = HeroOrange,
                    tags = listOf(
                        "Configurable" to HeroOrange,
                        "3–15 Players" to Color(0xFF60A5FA)
                    ),
                    onClick = onStartGame,
                    testTag = "start_new_game_button"
                )

                // Card 2: Field Playbook (Rules & Tactics)
                NeoActionCard(
                    title = "Rules & Field Tactics",
                    subtitle = "Bluffing strategies, citizen defense & round timing guide",
                    avatarText = "📖",
                    avatarColor = Color(0xFF8B5CF6),
                    tags = listOf(
                        "How to Play" to Color(0xFF8B5CF6),
                        "Tactics" to AccentGold
                    ),
                    onClick = onOpenRules,
                    testTag = "rules_button"
                )

                // Card 3: Game Stats & Roster
                NeoActionCard(
                    title = "Records & Saved Players",
                    subtitle = "Match performance, citizen win rates & saved roster",
                    avatarText = "🏆",
                    avatarColor = CitizenEmerald,
                    tags = listOf(
                        "Statistics" to CitizenEmerald,
                        "Saved Roster" to Color(0xFF38BDF8)
                    ),
                    onClick = onOpenProfile,
                    testTag = "profile_button"
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Bottom Primary Launch Button (Pill shaped with diagonal arrow)
                NeoButton(
                    text = "Launch New Game",
                    onClick = onStartGame,
                    backgroundColor = HeroOrange,
                    testTag = "bottom_launch_button"
                )

                Spacer(modifier = Modifier.height(16.dp))
            }
        }
    }
}
