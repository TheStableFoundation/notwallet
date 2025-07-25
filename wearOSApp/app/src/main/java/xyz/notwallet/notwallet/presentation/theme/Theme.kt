package xyz.notwallet.notwallet.presentation.theme

import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.wear.compose.material.MaterialTheme

@Composable
fun NotWalletTheme(
    content: @Composable () -> Unit
) {
    /**
     * Custom theme for NotWallet app.
     */
    MaterialTheme(
        colors = androidx.wear.compose.material.MaterialTheme.colors.copy(
            primary = Color(0xFF9932CC),
            background = Color(0xFF4B0082),
            onBackground = Color.White,
            surface = Color(0xFF800080),
            onSurface = Color.White
        ),
        content = content
    )
}
