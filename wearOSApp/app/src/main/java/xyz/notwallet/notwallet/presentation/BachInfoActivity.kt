package xyz.notwallet.notwallet.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.tooling.preview.devices.WearDevices
import xyz.notwallet.notwallet.presentation.components.PriceGraphView
import xyz.notwallet.notwallet.presentation.theme.NotWalletTheme

class BachInfoActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { BachInfoScreen() }
    }
}

@Composable
fun BachInfoScreen() {
    NotWalletTheme {
        Box(modifier = Modifier.fillMaxSize().background(Color.Black)) { ScrollViewContent() }
    }
}

@Composable
fun ScrollViewContent() {
    Column(
            modifier = Modifier.fillMaxSize().padding(16.dp).verticalScroll(rememberScrollState()).background(Color.Black, RoundedCornerShape(30)),
            horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(16.dp))
        Text(text = "€BACH", fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Color.White)
        Text(text = "Fixed supply: 12 million BACH", fontSize = 12.sp, color = Color.Gray)
        Spacer(modifier = Modifier.height(16.dp))
        Box(modifier = Modifier.fillMaxWidth().height(60.dp).background(Color.Black)) {
            PriceGraphView()
        }
        Spacer(modifier = Modifier.height(16.dp))
        HorizontalDivider()
        Text(
                text = "Token Information",
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.White
        )
        Spacer(modifier = Modifier.height(8.dp))
        Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(
                    text = "Symbol",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Normal,
                    color = Color.LightGray
            )
            Text(
                text = "BACH",
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.LightGray
            )
            Text(
                    text = "Network",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Normal,
                    color = Color.LightGray
            )
            Text(
                text = "Solana",
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.LightGray
            )
            Text(
                    text = "Decimals",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Normal,
                    color = Color.LightGray
            )
            Text(
                text = "12",
                fontSize = 16.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.LightGray
            )
        }
        Spacer(modifier = Modifier.height(16.dp))
        HorizontalDivider()
        Spacer(modifier = Modifier.height(16.dp))
    }
}

@Preview(device = WearDevices.SMALL_ROUND, showSystemUi = true)
@Composable
fun Preview() {
    BachInfoScreen()
}