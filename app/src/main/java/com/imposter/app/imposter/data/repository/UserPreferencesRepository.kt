package com.imposter.app.imposter.data.repository

import com.imposter.app.imposter.data.local.AppDatabase
import com.imposter.app.imposter.data.local.GameStatEntity
import com.imposter.app.imposter.data.local.RecentPlayerEntity
import com.imposter.app.imposter.domain.model.GameWinner
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull

class UserPreferencesRepository(private val database: AppDatabase) {
    val recentPlayers: Flow<List<String>> = database.recentPlayerDao().getRecentPlayers()
    val gameStats: Flow<GameStatEntity?> = database.gameStatDao().getStats()

    suspend fun recordPlayerNames(names: List<String>) {
        val dao = database.recentPlayerDao()
        val now = System.currentTimeMillis()
        names.forEach { name ->
            val clean = name.trim()
            if (clean.isNotEmpty() && !clean.startsWith("Player ")) {
                dao.insertOrUpdate(RecentPlayerEntity(clean, now))
            }
        }
    }

    suspend fun removeRecentPlayer(name: String) {
        database.recentPlayerDao().deleteByName(name)
    }

    suspend fun recordGameResult(winner: GameWinner) {
        val dao = database.gameStatDao()
        val current = dao.getStats().firstOrNull() ?: GameStatEntity()
        val updated = current.copy(
            gamesPlayed = current.gamesPlayed + 1,
            citizenWins = if (winner == GameWinner.CITIZENS) current.citizenWins + 1 else current.citizenWins,
            imposterWins = if (winner == GameWinner.IMPOSTERS) current.imposterWins + 1 else current.imposterWins
        )
        dao.insertOrUpdate(updated)
    }

    suspend fun resetStats() {
        database.gameStatDao().insertOrUpdate(GameStatEntity(id = 1, gamesPlayed = 0, citizenWins = 0, imposterWins = 0))
    }
}
