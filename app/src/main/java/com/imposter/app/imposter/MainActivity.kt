package com.imposter.app.imposter

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.imposter.app.imposter.data.local.AppDatabase
import com.imposter.app.imposter.data.repository.UserPreferencesRepository
import com.imposter.app.imposter.data.repository.WordRepository
import com.imposter.app.imposter.theme.DarkBackground
import com.imposter.app.imposter.theme.ImposterTheme
import com.imposter.app.imposter.ui.navigation.NavRoutes
import com.imposter.app.imposter.ui.screens.DiscussionStarterScreen
import com.imposter.app.imposter.ui.screens.HomeScreen
import com.imposter.app.imposter.ui.screens.PlayerBoardScreen
import com.imposter.app.imposter.ui.screens.PrivateRevealScreen
import com.imposter.app.imposter.ui.screens.ProfileScreen
import com.imposter.app.imposter.ui.screens.ResultScreen
import com.imposter.app.imposter.ui.screens.SetupScreen
import com.imposter.app.imposter.ui.screens.SkillGuideScreen
import com.imposter.app.imposter.ui.viewmodel.GameViewModel
import com.imposter.app.imposter.ui.viewmodel.SetupViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val database = AppDatabase.getDatabase(applicationContext)
        val wordRepository = WordRepository(applicationContext)
        val preferencesRepository = UserPreferencesRepository(database)

        setContent {
            ImposterTheme {
                Surface(
                    modifier = Modifier
                        .fillMaxSize()
                        .safeDrawingPadding(),
                    color = DarkBackground
                ) {
                    val gameViewModel = remember {
                        GameViewModel(wordRepository, preferencesRepository)
                    }
                    val setupViewModel = remember {
                        SetupViewModel(wordRepository, preferencesRepository)
                    }

                    AppNavigation(
                        gameViewModel = gameViewModel,
                        setupViewModel = setupViewModel,
                        preferencesRepository = preferencesRepository
                    )
                }
            }
        }
    }
}

@Composable
fun AppNavigation(
    gameViewModel: GameViewModel,
    setupViewModel: SetupViewModel,
    preferencesRepository: UserPreferencesRepository
) {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = NavRoutes.HOME
    ) {
        composable(NavRoutes.HOME) {
            HomeScreen(
                onStartGame = { navController.navigate(NavRoutes.SETUP) },
                onOpenRules = { navController.navigate(NavRoutes.RULES) },
                onOpenProfile = { navController.navigate(NavRoutes.PROFILE) }
            )
        }

        composable(NavRoutes.SETUP) {
            SetupScreen(
                viewModel = setupViewModel,
                onBack = { navController.popBackStack() },
                onStartGame = { config ->
                    gameViewModel.startGame(config)
                    navController.navigate(NavRoutes.PRIVATE_REVEAL)
                }
            )
        }

        composable(NavRoutes.PRIVATE_REVEAL) {
            PrivateRevealScreen(
                viewModel = gameViewModel,
                onAllRevealed = {
                    navController.navigate(NavRoutes.DISCUSSION_STARTER) {
                        popUpTo(NavRoutes.PRIVATE_REVEAL) { inclusive = true }
                    }
                }
            )
        }

        composable(NavRoutes.DISCUSSION_STARTER) {
            DiscussionStarterScreen(
                viewModel = gameViewModel,
                onProceedToBoard = {
                    navController.navigate(NavRoutes.PLAYER_BOARD) {
                        popUpTo(NavRoutes.DISCUSSION_STARTER) { inclusive = true }
                    }
                }
            )
        }

        composable(NavRoutes.PLAYER_BOARD) {
            PlayerBoardScreen(
                viewModel = gameViewModel,
                onGameOver = {
                    navController.navigate(NavRoutes.RESULT) {
                        popUpTo(NavRoutes.PLAYER_BOARD) { inclusive = true }
                    }
                },
                onExitGame = {
                    navController.navigate(NavRoutes.HOME) {
                        popUpTo(NavRoutes.HOME) { inclusive = true }
                    }
                }
            )
        }

        composable(NavRoutes.RESULT) {
            ResultScreen(
                viewModel = gameViewModel,
                onPlayAgainSamePlayers = {
                    navController.navigate(NavRoutes.PRIVATE_REVEAL) {
                        popUpTo(NavRoutes.RESULT) { inclusive = true }
                    }
                },
                onNewGameSetup = {
                    navController.navigate(NavRoutes.SETUP) {
                        popUpTo(NavRoutes.RESULT) { inclusive = true }
                    }
                }
            )
        }

        composable(NavRoutes.RULES) {
            SkillGuideScreen(
                onBack = { navController.popBackStack() }
            )
        }

        composable(NavRoutes.PROFILE) {
            ProfileScreen(
                preferencesRepo = preferencesRepository,
                onBack = { navController.popBackStack() }
            )
        }
    }
}
