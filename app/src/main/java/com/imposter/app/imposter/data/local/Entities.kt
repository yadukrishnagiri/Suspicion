package com.imposter.app.imposter.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "recent_players")
data class RecentPlayerEntity(
    @PrimaryKey
    val name: String,
    val lastUsedTimestamp: Long = System.currentTimeMillis()
)

@Entity(tableName = "game_stats")
data class GameStatEntity(
    @PrimaryKey
    val id: Int = 1,
    val gamesPlayed: Int = 0,
    val citizenWins: Int = 0,
    val imposterWins: Int = 0
)
