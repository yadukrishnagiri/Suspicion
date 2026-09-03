package com.example.data

enum class GameMode(val title: String, val subtitle: String, val tag: String) {
    EVERYONE_GETS_A_WORD(
        title = "Everyone Gets a Word",
        subtitle = "Citizens get the Main Word. Imposters get a related, tricky word.",
        tag = "Word vs Word"
    ),
    IMPOSTER_GETS_A_CLUE(
        title = "Imposter Gets a Clue",
        subtitle = "Citizens get the Main Word. Imposters get an indirect situational hint.",
        tag = "Hint Only"
    ),
    BLIND_IMPOSTER(
        title = "Blind Imposter",
        subtitle = "Citizens get the Main Word. Imposters get absolutely nothing.",
        tag = "Zero Info"
    )
}

enum class GameCategory(val id: String, val title: String, val description: String) {
    CONCEPTS_WEATHER("concepts_weather", "Concepts & Weather", "Seasons, atmospheric moods, forces of nature, time"),
    POP_CULTURE_MEDIA("pop_culture_media", "Pop Culture & Media", "Cinema, festivals, music, streaming, gaming"),
    OCCUPATIONS("occupations", "Occupations", "Professions, working lives, uniforms, everyday roles"),
    SPORTS_ACTIVITIES("sports_activities", "Sports & Activities", "Competitions, recreation, fitness, pastimes"),
    PLACES_TRAVEL("places_travel", "Places & Travel", "Destinations, transit, lodgings, urban & wild locales"),
    EVERYDAY_OBJECTS("everyday_objects", "Everyday Objects", "Household items, daily gear, personal accessories"),
    ANIMALS_NATURE("animals_nature", "Animals & Nature", "Creatures, wild habitats, flora, natural phenomena"),
    FOOD_DRINKS("food_drinks", "Food & Drinks", "Comfort foods, dining occasions, sips, snacks, feasts")
}

enum class VocabularyLevel {
    COMMON,
    FAMILIAR,
    ADVANCED
}

data class WordPair(
    val mainWord: String,
    val imposterWord: String,
    val category: GameCategory,
    val relationshipType: String,
    val imposterHint: String,
    val difficulty: VocabularyLevel = VocabularyLevel.COMMON,
    val pairGroup: String = "v1",
    val patternRisk: String = "low"
)

data class Player(
    val id: String,
    val name: String,
    val isImposter: Boolean = false,
    val isEliminated: Boolean = false
)

enum class ScreenState {
    SETUP_PLAYERS,
    SETUP_GAME_OPTIONS,
    PRIVATE_REVEAL,
    DISCUSSION,
    ELIMINATION_ANIMATION,
    GAME_OVER;

    companion object {
        val SETUP = SETUP_PLAYERS
    }
}

data class EliminationOutcome(
    val player: Player,
    val wasImposter: Boolean,
    val citizensRemaining: Int,
    val impostersRemaining: Int,
    val isGameOver: Boolean,
    val didPlayersWin: Boolean
)
