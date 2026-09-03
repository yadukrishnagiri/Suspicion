package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.ScreenState
import com.example.ui.screens.DiscussionScreen
import com.example.ui.screens.EliminationRevealScreen
import com.example.ui.screens.GameOverScreen
import com.example.ui.screens.PrivateRevealScreen
import com.example.ui.screens.SetupGameOptionsScreen
import com.example.ui.screens.SetupPlayersScreen
import com.example.ui.theme.AccentCoral
import com.example.ui.theme.CanvasDark
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.SurfaceDark
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextWhite
import com.example.viewmodel.GameViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: GameViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    containerColor = CanvasDark
                ) { innerPadding ->
                    ImposterApp(
                        viewModel = viewModel,
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}

@Composable
fun ImposterApp(
    viewModel: GameViewModel,
    modifier: Modifier = Modifier
) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    var showQuitConfirmation by remember { mutableStateOf(false) }

    // Intercept back button during active game phases and setup step 2
    BackHandler(enabled = state.screenState != ScreenState.SETUP_PLAYERS) {
        when (state.screenState) {
            ScreenState.SETUP_GAME_OPTIONS -> viewModel.goToPlayerSetup()
            ScreenState.ELIMINATION_ANIMATION -> viewModel.dismissEliminationReveal()
            ScreenState.GAME_OVER -> viewModel.returnToSetup()
            else -> showQuitConfirmation = true
        }
    }

    AnimatedContent(
        targetState = state.screenState,
        transitionSpec = { fadeIn() togetherWith fadeOut() },
        label = "screen_transition",
        modifier = modifier.fillMaxSize()
    ) { currentScreen ->
        when (currentScreen) {
            ScreenState.SETUP_PLAYERS -> {
                SetupPlayersScreen(
                    state = state,
                    onPlayerCountChange = viewModel::setPlayerCount,
                    onImposterCountChange = viewModel::setImposterCount,
                    onPlayerNameChange = viewModel::updatePlayerName,
                    onAddPlayer = viewModel::addPlayer,
                    onRemovePlayer = viewModel::removePlayer,
                    onContinueToGameOptions = viewModel::goToGameOptions
                )
            }

            ScreenState.SETUP_GAME_OPTIONS -> {
                SetupGameOptionsScreen(
                    state = state,
                    onSelectMode = viewModel::setGameMode,
                    onSelectCategory = viewModel::setCategory,
                    onBackToPlayers = viewModel::goToPlayerSetup,
                    onStartGame = viewModel::startNewGame
                )
            }

            ScreenState.PRIVATE_REVEAL -> {
                PrivateRevealScreen(
                    state = state,
                    onToggleReveal = viewModel::toggleCardReveal,
                    onProceedNext = viewModel::proceedToNextReveal
                )
            }

            ScreenState.DISCUSSION -> {
                DiscussionScreen(
                    state = state,
                    onAdvanceRound = viewModel::advanceDiscussionRound,
                    onSelectPlayerForElimination = viewModel::selectPlayerForElimination,
                    onConfirmElimination = viewModel::confirmElimination,
                    onCancelElimination = viewModel::cancelElimination
                )
            }

            ScreenState.ELIMINATION_ANIMATION -> {
                state.latestEliminationOutcome?.let { outcome ->
                    EliminationRevealScreen(
                        outcome = outcome,
                        onContinue = viewModel::dismissEliminationReveal
                    )
                }
            }

            ScreenState.GAME_OVER -> {
                GameOverScreen(
                    state = state,
                    onPlayAgain = viewModel::startNewGame,
                    onChangeSetup = viewModel::returnToSetup,
                    onToggleRevealSecrets = viewModel::toggleGameOverSecretReveal
                )
            }
        }
    }

    // Quit game early dialog
    if (showQuitConfirmation) {
        AlertDialog(
            onDismissRequest = { showQuitConfirmation = false },
            containerColor = SurfaceDark,
            title = {
                Text(
                    text = "End Current Game?",
                    style = MaterialTheme.typography.titleLarge,
                    color = TextWhite
                )
            },
            text = {
                Text(
                    text = "Are you sure you want to abandon this game and return to setup? Participant names will be preserved.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = TextMuted
                )
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        showQuitConfirmation = false
                        viewModel.returnToSetup()
                    }
                ) {
                    Text("END GAME", color = AccentCoral)
                }
            },
            dismissButton = {
                TextButton(onClick = { showQuitConfirmation = false }) {
                    Text("CONTINUE PLAYING", color = TextWhite)
                }
            }
        )
    }
}
