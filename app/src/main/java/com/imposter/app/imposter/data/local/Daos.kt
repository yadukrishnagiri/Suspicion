package com.imposter.app.imposter.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface RecentPlayerDao {
    @Query("SELECT name FROM recent_players ORDER BY lastUsedTimestamp DESC LIMIT 20")
    fun getRecentPlayers(): Flow<List<String>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(player: RecentPlayerEntity)

    @Query("DELETE FROM recent_players WHERE name = :name")
    suspend fun deleteByName(name: String)
}

@Dao
interface GameStatDao {
    @Query("SELECT * FROM game_stats WHERE id = 1")
    fun getStats(): Flow<GameStatEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(stat: GameStatEntity)
}
