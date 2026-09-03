package com.imposter.app.imposter.domain.model

enum class GameMode(val displayName: String, val description: String) {
    WORD_VS_WORD("Word vs Word", "Citizens get the main word, Imposters get a closely related counterpart word."),
    WORD_VS_HINT("Word vs Hint", "Citizens get the main word, Imposters get a contextual hint about the word."),
    BLIND_IMPOSTER("Blind Imposter", "Citizens get the main word, Imposters receive no clues at all and must bluff purely on social cues.")
}

enum class GamePhase {
    SETUP,
    PRIVATE_REVEAL,
    DISCUSSION_STARTER,
    ACTIVE_BOARD,
    GAME_RESULT
}

enum class GameWinner {
    CITIZENS,
    IMPOSTERS
}

data class WordEntry(
    val id: Int,
    val category: String,
    val mainWord: String,
    val imposterWord: String,
    val imposterCategory: String = "",
    val relationshipType: String = "",
    val hint: String = "",
    val difficulty: String = "Medium",
    val pairGroup: String = "1",
    val patternRisk: String = "Medium"
)

data class Player(
    val id: String,
    val name: String,
    val isImposter: Boolean = false,
    val isEliminated: Boolean = false
)

data class GameConfig(
    val playerCount: Int = 4,
    val imposterCount: Int = 1,
    val playerNames: List<String> = listOf("Player 1", "Player 2", "Player 3", "Player 4"),
    val gameMode: GameMode = GameMode.WORD_VS_WORD,
    val category: String? = null // null means All Categories
) {
    fun isValid(): Boolean {
        if (playerCount !in 3..15) return false
        if (imposterCount !in 1..7) return false
        if (playerCount < (2 * imposterCount) + 1) return false
        if (playerNames.size != playerCount) return false
        if (playerNames.any { it.trim().isEmpty() }) return false
        return true
    }

    val maxImpostersAllowed: Int
        get() = ((playerCount - 1) / 2).coerceIn(1, 7)
}

data class GameState(
    val config: GameConfig = GameConfig(),
    val wordEntry: WordEntry? = null,
    val players: List<Player> = emptyList(),
    val currentRevealIndex: Int = 0,
    val isWordRevealed: Boolean = false,
    val discussionStarter: Player? = null,
    val recentlyEliminatedPlayer: Player? = null,
    val winner: GameWinner? = null,
    val phase: GamePhase = GamePhase.SETUP
) {
    val activeImpostersCount: Int
        get() = players.count { it.isImposter && !it.isEliminated }

    val activeCitizensCount: Int
        get() = players.count { !it.isImposter && !it.isEliminated }

    val currentPlayerForReveal: Player?
        get() = players.getOrNull(currentRevealIndex)
}

data class UserProfile(
    val displayName: String = "Guest Host",
    val gamesPlayed: Int = 0,
    val citizenWins: Int = 0,
    val imposterWins: Int = 0
)
