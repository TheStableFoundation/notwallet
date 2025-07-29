package xyz.notwallet.notwallet.presentation.transactions

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
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
import xyz.notwallet.notwallet.presentation.theme.NotWalletTheme

data class TransactionDetail(val amount: String, val description: String, val date: String)

class TransactionDetailActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val transactionDetail =
                TransactionDetail(
                        amount = intent.getStringExtra("amount") ?: "N/A",
                        description = intent.getStringExtra("description") ?: "N/A",
                        date = intent.getStringExtra("date") ?: "N/A"
                )

        setContent { TransactionDetailView(transactionDetail) }
    }
}

@Composable
fun TransactionDetailView(transactionDetail: TransactionDetail) {
    NotWalletTheme {
        Box(modifier = Modifier.fillMaxSize().padding(16.dp), contentAlignment = Alignment.Center) {
            Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                        modifier =
                                Modifier.background(
                                                color =
                                                        if (transactionDetail.amount.startsWith("+")
                                                        )
                                                                Color.Green
                                                        else Color.Red,
                                                shape =
                                                        androidx.compose.foundation.shape
                                                                .RoundedCornerShape(50.dp)
                                        )
                                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                            text = transactionDetail.amount,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.White
                    )
                }
                Text(
                        text = transactionDetail.description,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Normal,
                        color = Color.White
                )
                Text(
                        text = transactionDetail.date,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Light,
                        color = Color.Gray
                )
            }
        }
    }
}

@Preview(device = WearDevices.SMALL_ROUND, showSystemUi = true)
@Composable
fun Preview() {
    TransactionDetailView(
            transactionDetail =
                    TransactionDetail(
                            amount = "10.624434723489 BACH",
                            description = "This is description",
                            date = "2023-07-13"
                    )
    )
}
