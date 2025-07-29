package xyz.notwallet.notwallet.presentation

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
import androidx.wear.compose.foundation.lazy.TransformingLazyColumn
import androidx.wear.compose.foundation.lazy.TransformingLazyColumnState
import androidx.wear.compose.foundation.lazy.rememberTransformingLazyColumnState
import androidx.wear.compose.material3.AppScaffold
import androidx.wear.compose.material3.ScreenScaffold
import androidx.wear.tooling.preview.devices.WearDevices
import com.google.android.horologist.compose.layout.ColumnItemType
import com.google.android.horologist.compose.layout.rememberResponsiveColumnPadding
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
        AppScaffold {
            val listState = rememberTransformingLazyColumnState()
            ScreenScaffold(
                scrollState = listState,
                contentPadding = rememberResponsiveColumnPadding(
                    first = ColumnItemType.IconButton,
                    last = ColumnItemType.Button,
                )
            ) { contentPadding ->
                ScrollViewContent(listState, contentPadding)
            }
        }
    }
}

@Composable
private fun ScrollViewContent(listState: TransformingLazyColumnState, contentPadding: PaddingValues) {
    TransformingLazyColumn(
        state = listState,
        contentPadding = contentPadding,
    ) {
        item {
            Text(
                text = "€BACH",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }
        item {
            Text(text = "Fixed supply: 10.89 million BACH", fontSize = 12.sp, color = Color.Gray)
        }
        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
        item {
            Box(modifier = Modifier.fillMaxWidth().height(60.dp).background(Color.Black)) {
                PriceGraphView()
            }
        }
        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
        item {
            HorizontalDivider()
        }
        item {
            Text(
                text = "Token Information",
                fontSize = 18.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.White
            )
        }
        item {
            Spacer(modifier = Modifier.height(8.dp))
        }
        item {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
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
        }
        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
        item {
            HorizontalDivider()
        }
        item {
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

@Preview(device = WearDevices.SMALL_ROUND, showSystemUi = true)
@Composable
fun Preview() {
    BachInfoScreen()
}