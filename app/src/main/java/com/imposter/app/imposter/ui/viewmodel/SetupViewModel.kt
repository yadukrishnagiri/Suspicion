package com.imposter.app.imposter.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.imposter.app.imposter.data.repository.UserPreferencesRepository
import com.imposter.app.imposter.data.repository.WordRepository
import com.imposter.app.imposter.domain.model.GameConfig
import com.imposter.app.imposter.domain.model.GameMode
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class SetupViewModel(
    private val wordRepo: WordRepository,
    private val preferencesRepo: UserPreferencesRepository
) : ViewModel() {

    private val _config = MutableStateFlow(GameConfig())
    val config: StateFlow<GameConfig> = _config.asStateFlow()

    private val _validationError = MutableStateFlow<String?>(null)
    val validationError: StateFlow<String?> = _validationError.asStateFlow()

    val availableCategories: List<String> = wordRepo.getCategories()

    val recentPlayers: StateFlow<List<String>> = preferencesRepo.recentPlayers
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun setPlayerCount(count: Int) {
        val safeCount = count.coerceIn(3, 15)
        _config.update { current ->
            val newNames = current.playerNames.toMutableList()
            if (newNames.size < safeCount) {
                for (i in (newNames.size + 1)..safeCount) {
                    newNames.add("Player $i")
                }
            } else if (newNames.size > safeCount) {
                while (newNames.size > safeCount) {
                    newNames.removeAt(newNames.lastIndex)
                }
            }
            val maxImposters = ((safeCount - 1) / 2).coerceIn(1, 7)
            val safeImposters = current.imposterCount.coerceAtMost(maxImposters)
            current.copy(
                playerCount = safeCount,
                imposterCount = safeImposters,
                playerNames = newNames
            )
        }
        validate()
    }

    fun setImposterCount(count: Int) {
        val currentMax = _config.value.maxImpostersAllowed
        val safeCount = count.coerceIn(1, currentMax)
        _config.update { it.copy(imposterCount = safeCount) }
        validate()
    }

    fun updatePlayerName(index: Int, name: String) {
        _config.update { current ->
            val updated = current.playerNames.toMutableList()
            if (index in updated.indices) {
                updated[index] = name
            }
            current.copy(playerNames = updated)
        }
        validate()
    }

    fun setGameMode(mode: GameMode) {
        _config.update { it.copy(gameMode = mode) }
    }

    fun setCategory(category: String) {
        val finalCat = if (category == "All Categories") null else category
        _config.update { it.copy(category = finalCat) }
    }

    fun applyRecentPlayerName(name: String) {
        _config.update { current ->
            val list = current.playerNames.toMutableList()
            // Find first default or empty name to replace
            val targetIdx = list.indexOfFirst { it.startsWith("Player ") || it.isBlank() }
            if (targetIdx != -1) {
                list[targetIdx] = name
            }
            current.copy(playerNames = list)
        }
        validate()
    }

    fun validate(): Boolean {
        val current = _config.value
        return when {
            current.playerCount < 3 -> {
                _validationError.value = "Minimum 3 players required"
                false
            }
            current.playerCount < (2 * current.imposterCount) + 1 -> {
                _validationError.value = "Too many imposters for ${current.playerCount} players. Max allowed: ${current.maxImpostersAllowed}"
                false
            }
            current.playerNames.any { it.trim().isEmpty() } -> {
                _validationError.value = "Please enter all player names"
                false
            }
            else -> {
                _validationError.value = null
                true
            }
        }
    }
}
