package com.imposter.app.imposter.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.imposter.app.imposter.data.repository.UserPreferencesRepository
import com.imposter.app.imposter.data.repository.WordRepository
import com.imposter.app.imposter.domain.model.GameConfig
import com.imposter.app.imposter.domain.model.GamePhase
import com.imposter.app.imposter.domain.model.GameState
import com.imposter.app.imposter.domain.model.GameWinner
import com.imposter.app.imposter.domain.model.Player
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlin.random.Random

class GameViewModel(
    private val wordRepo: WordRepository,
    private val preferencesRepo: UserPreferencesRepository
) : ViewModel() {

    private val _gameState = MutableStateFlow(GameState())
    val gameState: StateFlow<GameState> = _gameState.asStateFlow()

    fun startGame(config: GameConfig) {
        val word = wordRepo.getRandomWord(config.category)
        val total = config.playerNames.size

        // Pick random imposter indices
        val imposterIndices = mutableSetOf<Int>()
        while (imposterIndices.size < config.imposterCount) {
            imposterIndices.add(Random.nextInt(total))
        }

        val players = config.playerNames.mapIndexed { index, name ->
            Player(
                id = "player_$index",
                name = name.trim(),
                isImposter = imposterIndices.contains(index),
                isEliminated = false
            )
        }

        _gameState.value = GameState(
            config = config,
            wordEntry = word,
            players = players,
            currentRevealIndex = 0,
            isWordRevealed = false,
            phase = GamePhase.PRIVATE_REVEAL
        )

        // Persist player names to Room
        viewModelScope.launch {
            preferencesRepo.recordPlayerNames(config.playerNames)
        }
    }

    fun toggleReveal(revealed: Boolean) {
        _gameState.update { it.copy(isWordRevealed = revealed) }
    }

    fun passToNextPlayer() {
        val nextIdx = _gameState.value.currentRevealIndex + 1
        val total = _gameState.value.players.size

        if (nextIdx >= total) {
            // All players completed private reveal -> pick random discussion starter
            val starter = _gameState.value.players[Random.nextInt(total)]
            _gameState.update {
                it.copy(
                    currentRevealIndex = nextIdx,
                    isWordRevealed = false,
                    discussionStarter = starter,
                    phase = GamePhase.DISCUSSION_STARTER
                )
            }
        } else {
            _gameState.update {
                it.copy(
                    currentRevealIndex = nextIdx,
                    isWordRevealed = false
                )
            }
        }
    }

    fun proceedToActiveBoard() {
        _gameState.update { it.copy(phase = GamePhase.ACTIVE_BOARD) }
    }

    fun eliminatePlayer(player: Player) {
        if (player.isEliminated) return

        val updated = _gameState.value.players.map {
            if (it.id == player.id) it.copy(isEliminated = true) else it
        }

        val activeImposters = updated.count { it.isImposter && !it.isEliminated }
        val activeCitizens = updated.count { !it.isImposter && !it.isEliminated }

        var winner: GameWinner? = null
        var nextPhase = GamePhase.ACTIVE_BOARD

        if (activeImposters == 0) {
            winner = GameWinner.CITIZENS
            nextPhase = GamePhase.GAME_RESULT
        } else if (activeImposters >= activeCitizens) {
            winner = GameWinner.IMPOSTERS
            nextPhase = GamePhase.GAME_RESULT
        }

        _gameState.update {
            it.copy(
                players = updated,
                recentlyEliminatedPlayer = player.copy(isEliminated = true),
                winner = winner,
                phase = nextPhase
            )
        }

        if (winner != null) {
            viewModelScope.launch {
                preferencesRepo.recordGameResult(winner)
            }
        }
    }

    fun startNewGameSamePlayers() {
        val config = _gameState.value.config
        val word = wordRepo.getRandomWord(config.category)
        val total = _gameState.value.players.size

        val imposterIndices = mutableSetOf<Int>()
        while (imposterIndices.size < config.imposterCount) {
            imposterIndices.add(Random.nextInt(total))
        }

        val resetPlayers = _gameState.value.players.mapIndexed { index, player ->
            Player(
                id = "player_$index",
                name = player.name,
                isImposter = imposterIndices.contains(index),
                isEliminated = false
            )
        }

        _gameState.value = GameState(
            config = config,
            wordEntry = word,
            players = resetPlayers,
            currentRevealIndex = 0,
            isWordRevealed = false,
            phase = GamePhase.PRIVATE_REVEAL
        )
    }

    fun resetGame() {
        _gameState.value = GameState(
            config = _gameState.value.config,
            phase = GamePhase.SETUP
        )
    }
}
