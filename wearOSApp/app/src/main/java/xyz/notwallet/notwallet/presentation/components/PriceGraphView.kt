package xyz.notwallet.notwallet.presentation.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.wear.tooling.preview.devices.WearDevices
import kotlin.random.Random
import kotlinx.coroutines.delay

@Composable
fun PriceGraphView(modifier: Modifier = Modifier) {

     fun generateInitialPrices(): List<Float> {
        val initialPrice = Random.nextFloat() * 100
        return List(10) { initialPrice + Random.nextFloat() * 5 - 2.5f }
    }

    var prices by remember { mutableStateOf(generateInitialPrices()) }

    LaunchedEffect(Unit) {
        while (true) {
            delay(2000)
            prices = prices.drop(1) + (prices.last() + Random.nextFloat() * 5 - 2.5f)
        }
    }
    Canvas(modifier = modifier.fillMaxSize()) {
        if (prices.isEmpty()) return@Canvas

        val path = Path()
        val graphWidth = size.width
        val graphHeight = size.height
        val stepX = graphWidth / (prices.size - 1)
        val maxPrice = prices.maxOrNull() ?: 1f
        val minPrice = prices.minOrNull() ?: 0f
        val priceRange = maxPrice - minPrice + 1f

        prices.forEachIndexed { index, price ->
            val x = index * stepX
            val y = graphHeight - ((price - minPrice) / priceRange * graphHeight)
            if (index == 0) {
                path.moveTo(x, y)
            } else {
                path.lineTo(x, y)
            }
        }

        drawPath(path = path, color = Color(0xFF9932CC), style = Stroke(width = 2.dp.toPx()))
    }
}

@Preview(device = WearDevices.SMALL_ROUND, showSystemUi = true)
@Composable
fun DefaultPreview() {
    PriceGraphView()
}
