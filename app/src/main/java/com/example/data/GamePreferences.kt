package com.example.data

import android.content.Context
import android.content.SharedPreferences

class GamePreferences(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("imposter_game_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_PLAYERS = "saved_players"
        private const val KEY_MODE = "saved_mode"
        private const val KEY_CATEGORY = "saved_category"
        private const val KEY_IMPOSTERS = "saved_imposters"
        private const val DELIMITER = "###IMPOSTER_SEP###"
    }

    fun savePlayers(names: List<String>) {
        prefs.edit().putString(KEY_PLAYERS, names.joinToString(DELIMITER)).apply()
    }

    fun getSavedPlayers(): List<String> {
        val raw = prefs.getString(KEY_PLAYERS, null) ?: return listOf(
            "Alex", "Jordan", "Taylor", "Morgan"
        )
        val list = raw.split(DELIMITER).filter { it.isNotBlank() }
        return if (list.size >= 3) list else listOf("Alex", "Jordan", "Taylor", "Morgan")
    }

    fun saveGameMode(mode: GameMode) {
        prefs.edit().putString(KEY_MODE, mode.name).apply()
    }

    fun getSavedGameMode(): GameMode {
        val name = prefs.getString(KEY_MODE, GameMode.EVERYONE_GETS_A_WORD.name)
        return try {
            GameMode.valueOf(name ?: GameMode.EVERYONE_GETS_A_WORD.name)
        } catch (_: Exception) {
            GameMode.EVERYONE_GETS_A_WORD
        }
    }

    fun saveCategory(category: GameCategory) {
        prefs.edit().putString(KEY_CATEGORY, category.name).apply()
    }

    fun getSavedCategory(): GameCategory {
        val name = prefs.getString(KEY_CATEGORY, GameCategory.FOOD_DRINKS.name)
        return try {
            GameCategory.valueOf(name ?: GameCategory.FOOD_DRINKS.name)
        } catch (_: Exception) {
            GameCategory.FOOD_DRINKS
        }
    }

    fun saveImposterCount(count: Int) {
        prefs.edit().putInt(KEY_IMPOSTERS, count).apply()
    }

    fun getSavedImposterCount(playerCount: Int): Int {
        val maxAllowed = (playerCount - 1) / 2
        val saved = prefs.getInt(KEY_IMPOSTERS, 1)
        return saved.coerceIn(1, maxAllowed.coerceAtLeast(1))
    }
}
