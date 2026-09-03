package com.imposter.app.imposter.data.repository

import android.content.Context
import com.imposter.app.imposter.domain.model.WordEntry
import org.json.JSONArray
import java.io.BufferedReader
import java.io.InputStreamReader
import kotlin.random.Random

class WordRepository(private val context: Context) {
    private val allWords = mutableListOf<WordEntry>()
    private val recentWordIds = mutableListOf<Int>()
    private val maxRecentBuffer = 30
    private var isLoaded = false

    init {
        loadWords()
    }

    private fun loadWords() {
        if (isLoaded) return
        try {
            val inputStream = context.assets.open("imposter_dataset.json")
            val reader = BufferedReader(InputStreamReader(inputStream))
            val jsonString = reader.use { it.readText() }
            val jsonArray = JSONArray(jsonString)

            for (i in 0 until jsonArray.length()) {
                val obj = jsonArray.getJSONObject(i)
                allWords.add(
                    WordEntry(
                        id = obj.optInt("id", i + 1),
                        category = obj.optString("category", "General"),
                        mainWord = obj.optString("mainWord", ""),
                        imposterWord = obj.optString("imposterWord", ""),
                        imposterCategory = obj.optString("imposterCategory", ""),
                        relationshipType = obj.optString("relationshipType", ""),
                        hint = obj.optString("hint", ""),
                        difficulty = obj.optString("difficulty", "Medium"),
                        pairGroup = obj.optString("pairGroup", "1"),
                        patternRisk = obj.optString("patternRisk", "Medium")
                    )
                )
            }
            isLoaded = true
        } catch (e: Exception) {
            e.printStackTrace()
            // Fallback emergency seed words if asset load fails
            allWords.addAll(getFallbackWords())
            isLoaded = true
        }
    }

    fun getCategories(): List<String> {
        val unique = allWords.map { it.category }.distinct().sorted()
        return listOf("All Categories") + unique
    }

    fun getRandomWord(category: String?): WordEntry {
        loadWords()
        val candidatePool = if (category.isNullOrBlank() || category == "All Categories") {
            allWords
        } else {
            allWords.filter { it.category.equals(category, ignoreCase = true) }
        }.ifEmpty { allWords }

        // Filter out recently used words if possible
        val available = candidatePool.filterNot { recentWordIds.contains(it.id) }
        val finalPool = if (available.isNotEmpty()) available else candidatePool

        val chosen = finalPool[Random.nextInt(finalPool.size)]
        recentWordIds.add(chosen.id)
        if (recentWordIds.size > maxRecentBuffer) {
            recentWordIds.removeAt(0)
        }
        return chosen
    }

    private fun getFallbackWords(): List<WordEntry> {
        return listOf(
            WordEntry(1, "Food & Drinks", "Coffee", "Tea", hint = "Morning hot beverage"),
            WordEntry(2, "Everyday Objects", "Pen", "Pencil", hint = "Handwriting instrument"),
            WordEntry(3, "Animals & Nature", "Lion", "Tiger", hint = "Apex predator big cat"),
            WordEntry(4, "Places & Travel", "Airport", "Train Station", hint = "Public transit hub"),
            WordEntry(5, "Concepts & Weather", "Rain", "Snow", hint = "Precipitation from clouds")
        )
    }
}
