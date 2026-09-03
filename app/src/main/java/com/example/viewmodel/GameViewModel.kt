package com.example.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import com.example.data.EliminationOutcome
import com.example.data.GameCategory
import com.example.data.GameMode
import com.example.data.GamePreferences
import com.example.data.Player
import com.example.data.ScreenState
import com.example.data.WordDataset
import com.example.data.WordPair
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.UUID

data class GameUiState(
    val screenState: ScreenState = ScreenState.SETUP_PLAYERS,
    // Setup state
    val totalPlayerCount: Int = 4,
    val imposterCount: Int = 1,
    val participantNames: List<String> = listOf("Alex", "Jordan", "Taylor", "Morgan"),
    val selectedMode: GameMode = GameMode.EVERYONE_GETS_A_WORD,
    val selectedCategory: GameCategory = GameCategory.FOOD_DRINKS,

    // Active game state
    val currentWordPair: WordPair? = null,
    val players: List<Player> = emptyList(),
    val discussionStarterIndex: Int = 0,
    val currentRevealPlayerIndex: Int = 0,
    val isCardContentRevealed: Boolean = false,
    val hasCurrentPlayerViewed: Boolean = false,
    val discussionRound: Int = 1,

    // Elimination state
    val pendingEliminationPlayer: Player? = null,
    val latestEliminationOutcome: EliminationOutcome? = null,

    // Post-game secret reveal toggle
    val revealSecretsInGameOver: Boolean = false
) {
    val activeCitizensCount: Int
        get() = players.count { !it.isEliminated && !it.isImposter }

    val activeImpostersCount: Int
        get() = players.count { !it.isEliminated && it.isImposter }

    val maxImpostersAllowed: Int
        get() = ((totalPlayerCount - 1) / 2).coerceAtLeast(1)

    val currentStarterName: String
        get() = players.getOrNull(discussionStarterIndex)?.name ?: "Discussion Starter"
}

class GameViewModel(application: Application) : AndroidViewModel(application) {
    private val preferences = GamePreferences(application.applicationContext)

    private val _uiState = MutableStateFlow(GameUiState())
    val uiState: StateFlow<GameUiState> = _uiState.asStateFlow()

    init {
        loadPersistedSetup()
    }

    private fun loadPersistedSetup() {
        val savedNames = preferences.getSavedPlayers()
        val count = savedNames.size.coerceIn(3, 15)
        val mode = preferences.getSavedGameMode()
        val category = preferences.getSavedCategory()
        val maxAllowed = ((count - 1) / 2).coerceAtLeast(1)
        val imposters = preferences.getSavedImposterCount(count).coerceIn(1, maxAllowed)

        _uiState.value = _uiState.value.copy(
            totalPlayerCount = count,
            participantNames = savedNames.take(count),
            imposterCount = imposters,
            selectedMode = mode,
            selectedCategory = category
        )
    }

    // ==========================================
    // SETUP CONTROLS
    // ==========================================

    fun setPlayerCount(newCount: Int) {
        val clamped = newCount.coerceIn(3, 15)
        val currentNames = _uiState.value.participantNames.toMutableList()

        while (currentNames.size < clamped) {
            currentNames.add("Player ${currentNames.size + 1}")
        }
        val trimmedNames = currentNames.take(clamped)

        val maxAllowed = ((clamped - 1) / 2).coerceAtLeast(1)
        val clampedImposters = _uiState.value.imposterCount.coerceIn(1, maxAllowed)

        _uiState.value = _uiState.value.copy(
            totalPlayerCount = clamped,
            participantNames = trimmedNames,
            imposterCount = clampedImposters
        )
        preferences.savePlayers(trimmedNames)
        preferences.saveImposterCount(clampedImposters)
    }

    fun setImposterCount(count: Int) {
        val maxAllowed = _uiState.value.maxImpostersAllowed
        val safeCount = count.coerceIn(1, maxAllowed)
        _uiState.value = _uiState.value.copy(imposterCount = safeCount)
        preferences.saveImposterCount(safeCount)
    }

    fun updatePlayerName(index: Int, newName: String) {
        val currentNames = _uiState.value.participantNames.toMutableList()
        if (index in currentNames.indices) {
            currentNames[index] = newName.trim().ifBlank { "Player ${index + 1}" }
            _uiState.value = _uiState.value.copy(participantNames = currentNames)
            preferences.savePlayers(currentNames)
        }
    }

    fun addPlayer(name: String = "") {
        if (_uiState.value.totalPlayerCount >= 15) return
        val currentNames = _uiState.value.participantNames.toMutableList()
        val newName = name.trim().ifBlank { "Player ${currentNames.size + 1}" }
        currentNames.add(newName)
        val newCount = currentNames.size
        val maxAllowed = ((newCount - 1) / 2).coerceAtLeast(1)
        val safeImposters = _uiState.value.imposterCount.coerceIn(1, maxAllowed)

        _uiState.value = _uiState.value.copy(
            totalPlayerCount = newCount,
            participantNames = currentNames,
            imposterCount = safeImposters
        )
        preferences.savePlayers(currentNames)
    }

    fun removePlayer(index: Int) {
        if (_uiState.value.totalPlayerCount <= 3) return
        val currentNames = _uiState.value.participantNames.toMutableList()
        if (index in currentNames.indices) {
            currentNames.removeAt(index)
            val newCount = currentNames.size
            val maxAllowed = ((newCount - 1) / 2).coerceAtLeast(1)
            val safeImposters = _uiState.value.imposterCount.coerceIn(1, maxAllowed)

            _uiState.value = _uiState.value.copy(
                totalPlayerCount = newCount,
                participantNames = currentNames,
                imposterCount = safeImposters
            )
            preferences.savePlayers(currentNames)
        }
    }

    fun setGameMode(mode: GameMode) {
        _uiState.value = _uiState.value.copy(selectedMode = mode)
        preferences.saveGameMode(mode)
    }

    fun setCategory(category: GameCategory) {
        _uiState.value = _uiState.value.copy(selectedCategory = category)
        preferences.saveCategory(category)
    }

    // ==========================================
    // GAME LIFECYCLE
    // ==========================================

    fun startNewGame() {
        val state = _uiState.value
        // 1. Pick a random word pair for chosen category
        val categoryPairs = WordDataset.getPairsForCategory(state.selectedCategory)
        val chosenPair = categoryPairs.randomOrNull() ?: WordDataset.pairs.random()

        // 2. Select distinct imposter indices at random
        val totalPlayers = state.participantNames.size
        val imposterIndices = (0 until totalPlayers).shuffled().take(state.imposterCount).toSet()

        // 3. Build player list preserving entered order
        val playerList = state.participantNames.mapIndexed { index, name ->
            Player(
                id = UUID.randomUUID().toString(),
                name = name,
                isImposter = index in imposterIndices,
                isEliminated = false
            )
        }

        // 4. Randomly pick ONE discussion starter from all players
        val randomStarterIndex = (0 until totalPlayers).random()

        _uiState.value = state.copy(
            screenState = ScreenState.PRIVATE_REVEAL,
            currentWordPair = chosenPair,
            players = playerList,
            discussionStarterIndex = randomStarterIndex,
            currentRevealPlayerIndex = 0,
            isCardContentRevealed = false,
            hasCurrentPlayerViewed = false,
            discussionRound = 1,
            pendingEliminationPlayer = null,
            latestEliminationOutcome = null,
            revealSecretsInGameOver = false
        )
    }

    // ==========================================
    // PRIVATE REVEAL FLOW
    // ==========================================

    fun toggleCardReveal() {
        val isNowRevealed = !_uiState.value.isCardContentRevealed
        _uiState.value = _uiState.value.copy(
            isCardContentRevealed = isNowRevealed,
            hasCurrentPlayerViewed = _uiState.value.hasCurrentPlayerViewed || isNowRevealed
        )
    }

    fun hideCard() {
        _uiState.value = _uiState.value.copy(isCardContentRevealed = false)
    }

    fun proceedToNextReveal() {
        val state = _uiState.value
        val nextIndex = state.currentRevealPlayerIndex + 1
        if (nextIndex < state.players.size) {
            _uiState.value = state.copy(
                currentRevealPlayerIndex = nextIndex,
                isCardContentRevealed = false,
                hasCurrentPlayerViewed = false
            )
        } else {
            // All players have seen their information!
            _uiState.value = state.copy(
                screenState = ScreenState.DISCUSSION,
                isCardContentRevealed = false
            )
        }
    }

    // ==========================================
    // DISCUSSION & ELIMINATION FLOW
    // ==========================================

    fun advanceDiscussionRound() {
        // Increases round counter without changing players or starter
        _uiState.value = _uiState.value.copy(
            discussionRound = _uiState.value.discussionRound + 1
        )
    }

    fun selectPlayerForElimination(player: Player) {
        if (player.isEliminated) return
        _uiState.value = _uiState.value.copy(pendingEliminationPlayer = player)
    }

    fun cancelElimination() {
        _uiState.value = _uiState.value.copy(pendingEliminationPlayer = null)
    }

    fun confirmElimination(player: Player) {
        val currentPlayers = _uiState.value.players.map {
            if (it.id == player.id) it.copy(isEliminated = true) else it
        }

        val wasImposter = player.isImposter
        val activeCitizens = currentPlayers.count { !it.isEliminated && !it.isImposter }
        val activeImposters = currentPlayers.count { !it.isEliminated && it.isImposter }

        // Evaluation of Win conditions:
        // Players Win: all imposters eliminated
        // Imposters Win: active imposters >= active citizens
        val didPlayersWin = activeImposters == 0
        val didImpostersWin = !didPlayersWin && activeImposters >= activeCitizens
        val isGameOver = didPlayersWin || didImpostersWin

        val outcome = EliminationOutcome(
            player = player,
            wasImposter = wasImposter,
            citizensRemaining = activeCitizens,
            impostersRemaining = activeImposters,
            isGameOver = isGameOver,
            didPlayersWin = didPlayersWin
        )

        _uiState.value = _uiState.value.copy(
            players = currentPlayers,
            pendingEliminationPlayer = null,
            latestEliminationOutcome = outcome,
            screenState = ScreenState.ELIMINATION_ANIMATION
        )
    }

    fun dismissEliminationReveal() {
        val outcome = _uiState.value.latestEliminationOutcome
        if (outcome?.isGameOver == true) {
            _uiState.value = _uiState.value.copy(
                screenState = ScreenState.GAME_OVER
            )
        } else {
            _uiState.value = _uiState.value.copy(
                screenState = ScreenState.DISCUSSION
            )
        }
    }

    fun toggleGameOverSecretReveal() {
        _uiState.value = _uiState.value.copy(
            revealSecretsInGameOver = !_uiState.value.revealSecretsInGameOver
        )
    }

    fun goToGameOptions() {
        _uiState.value = _uiState.value.copy(screenState = ScreenState.SETUP_GAME_OPTIONS)
    }

    fun goToPlayerSetup() {
        _uiState.value = _uiState.value.copy(screenState = ScreenState.SETUP_PLAYERS)
    }

    fun returnToSetup() {
        _uiState.value = _uiState.value.copy(
            screenState = ScreenState.SETUP_PLAYERS,
            pendingEliminationPlayer = null,
            latestEliminationOutcome = null
        )
    }
}
