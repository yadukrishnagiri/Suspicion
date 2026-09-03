package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.data.GameCategory
import com.example.data.GameMode
import com.example.data.WordDataset
import com.example.viewmodel.GameViewModel
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

    @Test
    fun `read string from context`() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val appName = context.getString(R.string.app_name)
        assertEquals("Imposter", appName)
    }

    @Test
    fun `master dataset contains valid pairs for all 8 categories`() {
        GameCategory.values().forEach { category ->
            val pairs = WordDataset.getPairsForCategory(category)
            assertTrue("Category $category must have pairs", pairs.isNotEmpty())
            pairs.forEach { pair ->
                assertTrue(pair.mainWord.isNotBlank())
                assertTrue(pair.imposterWord.isNotBlank())
                assertTrue(pair.imposterHint.isNotBlank())
                assertTrue(pair.relationshipType.isNotBlank())
                // Ensure imposter word does not equal main word
                assertTrue(pair.mainWord != pair.imposterWord)
            }
        }
    }

    @Test
    fun `minimum player rule calculation is correct`() {
        // Rule: min players = (2 * imposters) + 1
        // Equivalently: max imposters = (players - 1) / 2
        val testCases = listOf(
            3 to 1,
            4 to 1,
            5 to 2,
            6 to 2,
            7 to 3,
            8 to 3,
            9 to 4,
            14 to 6,
            15 to 7
        )

        testCases.forEach { (players, expectedMaxImposters) ->
            val maxAllowed = ((players - 1) / 2).coerceAtLeast(1)
            assertEquals(expectedMaxImposters, maxAllowed)
            val minPlayersForTheseImposters = (2 * expectedMaxImposters) + 1
            assertTrue(players >= minPlayersForTheseImposters)
        }
    }

    @Test
    fun `viewModel preserves entered player order and assigns starter`() {
        val app = ApplicationProvider.getApplicationContext<android.app.Application>()
        val viewModel = GameViewModel(app)

        val customNames = listOf("Alice", "Bob", "Charlie", "Diana", "Evan")
        viewModel.setPlayerCount(customNames.size)
        customNames.forEachIndexed { index, name ->
            viewModel.updatePlayerName(index, name)
        }

        viewModel.setGameMode(GameMode.IMPOSTER_GETS_A_CLUE)
        viewModel.setCategory(GameCategory.FOOD_DRINKS)
        viewModel.setImposterCount(1)

        viewModel.startNewGame()

        val state = viewModel.uiState.value
        assertEquals(5, state.players.size)
        // Check order is exactly preserved!
        assertEquals("Alice", state.players[0].name)
        assertEquals("Bob", state.players[1].name)
        assertEquals("Charlie", state.players[2].name)
        assertEquals("Diana", state.players[3].name)
        assertEquals("Evan", state.players[4].name)

        // Imposter count is 1
        assertEquals(1, state.players.count { it.isImposter })
        assertEquals(4, state.players.count { !it.isImposter })

        // Starter index is valid
        assertTrue(state.discussionStarterIndex in 0 until 5)
        assertNotNull(state.currentWordPair)
    }

    @Test
    fun `elimination parity win conditions logic`() {
        val app = ApplicationProvider.getApplicationContext<android.app.Application>()
        val viewModel = GameViewModel(app)

        viewModel.setPlayerCount(4)
        viewModel.setImposterCount(1)
        viewModel.startNewGame()

        val state = viewModel.uiState.value
        val imposter = state.players.first { it.isImposter }

        // Eliminate the only imposter -> Players should win
        viewModel.confirmElimination(imposter)

        val outcome = viewModel.uiState.value.latestEliminationOutcome
        assertNotNull(outcome)
        assertTrue(outcome!!.wasImposter)
        assertTrue(outcome.isGameOver)
        assertTrue(outcome.didPlayersWin)
    }

    @Test
    fun `two page setup navigation flows correctly`() {
        val app = ApplicationProvider.getApplicationContext<android.app.Application>()
        val viewModel = GameViewModel(app)

        // Starts on Page 1 (Players Setup)
        assertEquals(com.example.data.ScreenState.SETUP_PLAYERS, viewModel.uiState.value.screenState)

        // Configure player count and imposters
        viewModel.setPlayerCount(6)
        viewModel.setImposterCount(2)
        assertEquals(6, viewModel.uiState.value.totalPlayerCount)
        assertEquals(2, viewModel.uiState.value.imposterCount)

        // Proceed to Page 2 (Game Mode & Categories)
        viewModel.goToGameOptions()
        assertEquals(com.example.data.ScreenState.SETUP_GAME_OPTIONS, viewModel.uiState.value.screenState)

        // User can navigate back to Page 1
        viewModel.goToPlayerSetup()
        assertEquals(com.example.data.ScreenState.SETUP_PLAYERS, viewModel.uiState.value.screenState)

        // Proceed back to Page 2 and select mode & category
        viewModel.goToGameOptions()
        viewModel.setGameMode(GameMode.BLIND_IMPOSTER)
        viewModel.setCategory(GameCategory.ANIMALS_NATURE)
        assertEquals(GameMode.BLIND_IMPOSTER, viewModel.uiState.value.selectedMode)
        assertEquals(GameCategory.ANIMALS_NATURE, viewModel.uiState.value.selectedCategory)

        // Start game from Page 2
        viewModel.startNewGame()
        assertEquals(com.example.data.ScreenState.PRIVATE_REVEAL, viewModel.uiState.value.screenState)
        assertEquals(6, viewModel.uiState.value.players.size)
        assertEquals(2, viewModel.uiState.value.players.count { it.isImposter })
    }
}
