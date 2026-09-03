package com.example.ui.screens

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.ripple
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
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
 * Visual metadata for each category, directly referencing the user's reference design
 * with peeking stacked tabs, high-contrast palette, and attribute pills.
 */
data class CategoryDeckItem(
    val category: GameCategory,
    val headline: String,
    val topTag: String,
    val pill1Text: String,
    val pill1Color: Color,
    val pill2Text: String,
    val pill2Color: Color,
    val cardBg: Color,
    val textColor: Color,
    val subtitle: String,
    val iconEmoji: String,
    val chipLabel: String
)

private val categoryDecks = listOf(
    CategoryDeckItem(
        category = GameCategory.FOOD_DRINKS,
        headline = "SMALL EATERY",
        topTag = "LOCAL SPOT",
        pill1Text = "< 20 seats",
        pill1Color = AccentCoral,
        pill2Text = "< 5 workers",
        pill2Color = AccentPurple,
        cardBg = AccentAmber,
        textColor = TextDark,
        subtitle = "Comfort food, cozy diners, signature spices, and secret recipes.",
        iconEmoji = "🍜",
        chipLabel = "Eatery"
    ),
    CategoryDeckItem(
        category = GameCategory.CONCEPTS_WEATHER,
        headline = "HIGH-VOLUME",
        topTag = "ATMOSPHERIC",
        pill1Text = "Storm & Ice",
        pill1Color = AccentMint,
        pill2Text = "Raw Elements",
        pill2Color = AccentAmber,
        cardBg = AccentCoral,
        textColor = Color.White,
        subtitle = "Seasons, thunderstorms, blizzards, eclipse shadows, and ocean waves.",
        iconEmoji = "⚡",
        chipLabel = "Weather"
    ),
    CategoryDeckItem(
        category = GameCategory.ANIMALS_NATURE,
        headline = "WILD HABITATS",
        topTag = "ECOSYSTEM",
        pill1Text = "Fauna & Flora",
        pill1Color = AccentMint,
        pill2Text = "Survival",
        pill2Color = AccentCoral,
        cardBg = Color(0xFF23352A),
        textColor = Color.White,
        subtitle = "Rainforest canopies, deep reefs, apex hunters, and nocturnal beasts.",
        iconEmoji = "🦎",
        chipLabel = "Nature"
    ),
    CategoryDeckItem(
        category = GameCategory.POP_CULTURE_MEDIA,
        headline = "POP CULTURE",
        topTag = "ENTERTAINMENT",
        pill1Text = "Cinema & Shows",
        pill1Color = AccentPurple,
        pill2Text = "Global Fandoms",
        pill2Color = AccentAmber,
        cardBg = AccentPurple,
        textColor = Color.White,
        subtitle = "Premieres, iconic heroes, vinyl tracks, cult franchises, and streams.",
        iconEmoji = "🎬",
        chipLabel = "Cinema"
    ),
    CategoryDeckItem(
        category = GameCategory.OCCUPATIONS,
        headline = "PROFESSIONS",
        topTag = "SPECIALISTS",
        pill1Text = "Gear & Tools",
        pill1Color = AccentCoral,
        pill2Text = "On Shift",
        pill2Color = AccentMint,
        cardBg = Color(0xFF1E2129),
        textColor = Color.White,
        subtitle = "Detectives, trauma surgeons, pilots, forensic scientists, and chefs.",
        iconEmoji = "💼",
        chipLabel = "Careers"
    ),
    CategoryDeckItem(
        category = GameCategory.SPORTS_ACTIVITIES,
        headline = "ATHLETICS",
        topTag = "COMPETITION",
        pill1Text = "Match Day",
        pill1Color = AccentAmber,
        pill2Text = "Adrenaline",
        pill2Color = AccentCoral,
        cardBg = Color(0xFF1E2632),
        textColor = Color.White,
        subtitle = "Championships, tactical play, endurance trials, and buzzer beaters.",
        iconEmoji = "🏆",
        chipLabel = "Sports"
    ),
    CategoryDeckItem(
        category = GameCategory.PLACES_TRAVEL,
        headline = "CITIES & TRAVEL",
        topTag = "EXPEDITION",
        pill1Text = "Terminals",
        pill1Color = AccentMint,
        pill2Text = "Wanderlust",
        pill2Color = AccentPurple,
        cardBg = Color(0xFF272332),
        textColor = Color.White,
        subtitle = "Neon alleys, sleeper trains, alpine summits, and coastal ports.",
        iconEmoji = "✈️",
        chipLabel = "Travel"
    ),
    CategoryDeckItem(
        category = GameCategory.EVERYDAY_OBJECTS,
        headline = "DAILY GEAR",
        topTag = "TACTILE ITEMS",
        pill1Text = "Carry Essentials",
        pill1Color = AccentCoral,
        pill2Text = "Home Fixtures",
        pill2Color = AccentAmber,
        cardBg = Color(0xFF2A241E),
        textColor = Color.White,
        subtitle = "Mechanical watches, espresso makers, keys, lenses, and flashlights.",
        iconEmoji = "🔑",
        chipLabel = "Objects"
    )
)

/**
 * Step 2: Systematic Categories & Game Mode Screen
 * Recreates the exact focused card presentation from the user's reference:
 * - Circular back button + CATEGORIES title
 * - Compact top mode filter pills (like [this week ▾] in reference 2)
 * - Single focused stacked card showcase with peeking tabs (matching the Small Eatery reference)
 * - Horizontal quick-category selector bar below the card (no 8-card scrolling wall)
 * - Pinned bottom START GAME CTA
 */
@Composable
fun SetupGameOptionsScreen(
    state: GameUiState,
    onSelectMode: (GameMode) -> Unit,
    onSelectCategory: (GameCategory) -> Unit,
    onBackToPlayers: () -> Unit,
    onStartGame: () -> Unit,
    modifier: Modifier = Modifier
) {
    val activeIndex = categoryDecks.indexOfFirst { it.category == state.selectedCategory }
        .let { if (it >= 0) it else 0 }
    val currentDeck = categoryDecks[activeIndex]
    val prevDeck = categoryDecks[(activeIndex - 1 + categoryDecks.size) % categoryDecks.size]
    val nextDeck = categoryDecks[(activeIndex + 1) % categoryDecks.size]

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
            // TOP HEADER: ( ← ) + CATEGORIES Title + Pill
            // ==========================================
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 12.dp),
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
                            .background(Color.White)
                            .clickable(
                                interactionSource = remember { MutableInteractionSource() },
                                indication = ripple(color = Color.Black.copy(alpha = 0.2f)),
                                onClick = onBackToPlayers
                            )
                            .testTag("btn_back_to_players"),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back to players",
                            tint = TextDark,
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column {
                        Text(
                            text = "CATEGORIES",
                            style = MaterialTheme.typography.headlineMedium.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = (-0.5).sp
                            ),
                            color = TextWhite
                        )
                        Text(
                            text = "${state.totalPlayerCount} PLAYERS • ${state.imposterCount} IMPOSTER${if (state.imposterCount > 1) "S" else ""}",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 1.sp
                            ),
                            color = AccentMint
                        )
                    }
                }

                NeoPill(
                    text = "Step 2 of 2",
                    backgroundColor = SurfaceElevated,
                    textColor = AccentAmber,
                    dotColor = AccentAmber
                )
            }

            // ==========================================
            // FILTER PILLS: GAME MODE SWITCHER
            // Modeled after the [this week ▾] [USD, $ ▾] pills in reference 2
            // ==========================================
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 6.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                GameMode.values().forEach { mode ->
                    val isSelected = mode == state.selectedMode
                    val bg = if (isSelected) Color.White else SurfaceDark
                    val textColor = if (isSelected) TextDark else TextSubtle
                    val border = if (isSelected) Color.White else SurfaceBorder

                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(50))
                            .background(bg)
                            .border(1.dp, border, RoundedCornerShape(50))
                            .clickable { onSelectMode(mode) }
                            .padding(vertical = 8.dp)
                            .testTag("mode_${mode.name}"),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = when (mode) {
                                GameMode.EVERYONE_GETS_A_WORD -> "Word vs Word"
                                GameMode.IMPOSTER_GETS_A_CLUE -> "Clue Mode"
                                GameMode.BLIND_IMPOSTER -> "Blind Mode"
                            },
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
                            ),
                            color = textColor
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // ==========================================
            // STACKED CARD DECK (Matching Reference 1 exactly)
            // Shows 1 focused card with peeking tabs above/behind it
            // ==========================================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(horizontal = 20.dp)
            ) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.Center
                ) {
                    // Peek Tab 1 (Background card 1: prev deck)
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.90f)
                            .height(28.dp)
                            .align(Alignment.CenterHorizontally)
                            .clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                            .background(prevDeck.cardBg.copy(alpha = 0.6f))
                            .clickable { onSelectCategory(prevDeck.category) }
                            .padding(horizontal = 16.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = prevDeck.topTag.uppercase(),
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = 1.sp
                            ),
                            color = Color.White.copy(alpha = 0.7f),
                            modifier = Modifier.align(Alignment.CenterStart)
                        )
                    }

                    // Peek Tab 2 (Background card 2)
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.95f)
                            .height(30.dp)
                            .align(Alignment.CenterHorizontally)
                            .clip(RoundedCornerShape(topStart = 22.dp, topEnd = 22.dp))
                            .background(SurfaceElevated)
                            .border(1.dp, SurfaceBorder, RoundedCornerShape(topStart = 22.dp, topEnd = 22.dp))
                            .clickable { onSelectCategory(nextDeck.category) }
                            .padding(horizontal = 18.dp, vertical = 5.dp)
                    ) {
                        Text(
                            text = nextDeck.topTag.uppercase(),
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Black,
                                letterSpacing = 1.sp
                            ),
                            color = TextSubtle,
                            modifier = Modifier.align(Alignment.CenterStart)
                        )
                    }

                    // ACTIVE FOCUSED CARD (Exact replica of Reference 1 "SMALL EATERY" card)
                    AnimatedContent(
                        targetState = currentDeck,
                        transitionSpec = {
                            fadeIn(animationSpec = tween(220)) togetherWith
                                    fadeOut(animationSpec = tween(150))
                        },
                        label = "card_deck_transition"
                    ) { deck ->
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(26.dp))
                                .background(deck.cardBg)
                                .border(1.dp, Color.White.copy(alpha = 0.2f), RoundedCornerShape(26.dp))
                                .padding(22.dp)
                                .testTag("category_${deck.category.id}")
                        ) {
                            Column {
                                // Top Row: Tag + Action Circle ( ↗ )
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = deck.topTag.uppercase(),
                                        style = MaterialTheme.typography.labelMedium.copy(
                                            fontWeight = FontWeight.Black,
                                            letterSpacing = 1.2.sp
                                        ),
                                        color = deck.textColor.copy(alpha = 0.75f)
                                    )

                                    Box(
                                        modifier = Modifier
                                            .size(42.dp)
                                            .clip(CircleShape)
                                            .background(Color.Black)
                                            .clickable { onStartGame() }
                                            .testTag("btn_card_shortcut"),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            painter = painterResource(id = R.drawable.ic_north_east),
                                            contentDescription = "Start with this category",
                                            tint = Color.White,
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(10.dp))

                                // Big Bold Title
                                Text(
                                    text = deck.headline,
                                    style = MaterialTheme.typography.headlineMedium.copy(
                                        fontWeight = FontWeight.Black,
                                        letterSpacing = (-0.5).sp
                                    ),
                                    color = deck.textColor
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                // Attribute Pills with Colored Dots
                                Row(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    // Pill 1
                                    Row(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(50))
                                            .background(Color.Black.copy(alpha = 0.15f))
                                            .padding(horizontal = 10.dp, vertical = 5.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .clip(CircleShape)
                                                .background(deck.pill1Color)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = deck.pill1Text,
                                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                            color = deck.textColor
                                        )
                                    }

                                    // Pill 2
                                    Row(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(50))
                                            .background(Color.Black.copy(alpha = 0.15f))
                                            .padding(horizontal = 10.dp, vertical = 5.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .size(8.dp)
                                                .clip(CircleShape)
                                                .background(deck.pill2Color)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = deck.pill2Text,
                                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold),
                                            color = deck.textColor
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(20.dp))

                                // Visual Illustration Box (Centerpiece of the card)
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(140.dp)
                                        .clip(RoundedCornerShape(18.dp))
                                        .background(Color.Black.copy(alpha = 0.08f)),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text(
                                            text = deck.iconEmoji,
                                            fontSize = 52.sp
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(
                                            text = deck.category.title.uppercase(),
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontWeight = FontWeight.Black,
                                                letterSpacing = 1.sp
                                            ),
                                            color = deck.textColor.copy(alpha = 0.6f)
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(14.dp))

                                Text(
                                    text = deck.subtitle,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = deck.textColor.copy(alpha = 0.85f),
                                    textAlign = TextAlign.Start
                                )
                            }
                        }
                    }
                }
            }

            // ==========================================
            // COMPACT HORIZONTAL CATEGORY PILL STRIP
            // Allows 1-tap jumping to any category without any giant card clutter
            // ==========================================
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                categoryDecks.forEachIndexed { idx, deck ->
                    val isSelected = idx == activeIndex
                    val bg = if (isSelected) AccentAmber else SurfaceDark
                    val textCol = if (isSelected) TextDark else TextMuted
                    val border = if (isSelected) AccentAmber else SurfaceBorder

                    Row(
                        modifier = Modifier
                            .clip(RoundedCornerShape(50))
                            .background(bg)
                            .border(1.dp, border, RoundedCornerShape(50))
                            .clickable { onSelectCategory(deck.category) }
                            .padding(horizontal = 14.dp, vertical = 7.dp)
                            .testTag("quick_tab_${deck.category.id}"),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = deck.iconEmoji,
                            fontSize = 13.sp
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = deck.chipLabel,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold
                            ),
                            color = textCol
                        )
                    }
                }
            }

            // ==========================================
            // PINNED BOTTOM ACTION BAR
            // ==========================================
            Box(
                modifier = Modifier
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
                    .padding(bottom = 16.dp, top = 4.dp)
            ) {
                NeoButton(
                    text = "START NEW GAME",
                    onClick = onStartGame,
                    containerColor = AccentCoral,
                    contentColor = Color.White,
                    icon = Icons.Default.PlayArrow,
                    testTag = "btn_start_game"
                )
            }
        }
    }
}
