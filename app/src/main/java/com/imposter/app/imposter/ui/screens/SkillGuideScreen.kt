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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
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
import com.imposter.app.imposter.ui.components.NeoTopBar

@Composable
fun SkillGuideScreen(onBack: () -> Unit) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf("Rules", "Citizen Tips", "Imposter Bluff")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(HeroOrange)
    ) {
        // Top Header
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
        ) {
            NeoTopBar(
                title = "Field Playbook",
                onBack = onBack,
                rightBadgeText = "Tactics",
                isDarkHeader = false
            )

            // Pill Tabs in Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                tabs.forEachIndexed { index, title ->
                    val isSelected = selectedTab == index
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) Color.White else Color.Black.copy(alpha = 0.18f))
                            .border(
                                1.dp,
                                if (isSelected) Color.White else Color.White.copy(alpha = 0.25f),
                                RoundedCornerShape(20.dp)
                            )
                            .clickable { selectedTab = index }
                            .padding(vertical = 9.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = title,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSelected) Color(0xFF141518) else Color.White
                        )
                    }
                }
            }
        }

        // Bottom Dark Sheet
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
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                when (selectedTab) {
                    0 -> GameRulesContent()
                    1 -> CitizenStrategyContent()
                    2 -> ImposterStrategyContent()
                }

                Spacer(modifier = Modifier.height(20.dp))
            }
        }
    }
}

@Composable
private fun GameRulesContent() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        GuideCard(
            step = "01",
            title = "Secret Word Assignment",
            body = "Pass the device around. Citizens receive the exact secret word. Imposters receive a related word, a broad clue, or no word at all depending on mode."
        )

        GuideCard(
            step = "02",
            title = "Clue Round",
            body = "A player starts by giving a subtle clue word or short phrase. Go clockwise until every player has contributed."
        )

        GuideCard(
            step = "03",
            title = "Discussion & Accusations",
            body = "Debate suspicious clues, hesitant pauses, or generic answers. Nominate suspects and eliminate by majority vote."
        )

        GuideCard(
            step = "04",
            title = "Winning Conditions",
            body = "Citizens win if all imposters are eliminated. Imposters win if they survive without being caught."
        )
    }
}

@Composable
private fun CitizenStrategyContent() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        GuideCard(
            step = "01",
            title = "Avoid Obvious Words",
            body = "Don't say the most direct association. Use subtle attributes, textures, or contextual hints genuine citizens will recognize."
        )

        GuideCard(
            step = "02",
            title = "Catch Parroting",
            body = "Imposters often mimic the clue given just before them. Watch for players who give vague rephrasings."
        )

        GuideCard(
            step = "03",
            title = "Protect the Word",
            body = "Giving an overly obvious clue hands the imposter instant camouflage."
        )
    }
}

@Composable
private fun ImposterStrategyContent() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        GuideCard(
            step = "01",
            title = "Broad Sensory Clues",
            body = "If you don't know the word, give broad descriptors like \"Common\", \"Outdoor\", \"Handheld\", or \"Everyday\"."
        )

        GuideCard(
            step = "02",
            title = "Confidence is Everything",
            body = "Hesitation is what gets imposters caught. Speak with calm, effortless assurance."
        )

        GuideCard(
            step = "03",
            title = "Actively Question Others",
            body = "Don't sit quietly in discussion. Ask questions about other players' strange clues to shift suspicion."
        )
    }
}

@Composable
private fun GuideCard(
    step: String,
    title: String,
    body: String
) {
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
                    text = title,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = step,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    color = HeroOrange
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = body,
                fontSize = 13.sp,
                color = TextSecondary,
                lineHeight = 18.sp
            )
        }
    }
}
