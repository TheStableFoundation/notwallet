package xyz.notwallet.notwallet.presentation.transactions

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.foundation.lazy.ScalingLazyColumn
import androidx.wear.compose.foundation.lazy.items
import androidx.wear.compose.foundation.lazy.rememberScalingLazyListState
import androidx.wear.compose.material.PositionIndicator
import androidx.wear.tooling.preview.devices.WearDevices
import xyz.notwallet.notwallet.presentation.theme.NotWalletTheme

data class Transaction(val date: String, val amount: String, val description: String)

@Composable
fun TransactionListView(transactions: List<Transaction>) {
    var selectedTransaction by remember { mutableStateOf<Transaction?>(null) }
    val listState = rememberScalingLazyListState() // State for ScalingLazyColumn

    NotWalletTheme {
        androidx.wear.compose.material.Scaffold(
            modifier = Modifier
                .background(Color.Black)
                .padding(vertical = 16.dp),
            positionIndicator = {
                // This is the scrollbar for ScalingLazyColumn
                PositionIndicator(scalingLazyListState = listState)
            },
        ) {
            ScalingLazyColumn(
                    modifier =
                            Modifier
                                .fillMaxSize()
                                .background(Color.Black, RoundedCornerShape(30)),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
            ) {
                items(transactions) { tx ->
                    Button(
                            onClick = { selectedTransaction = tx },
                            modifier = Modifier.background(Color.Black)
                    ) {
                        Column(
                                modifier = Modifier.padding(2.dp),
                                horizontalAlignment = Alignment.Start
                        ) {
                            Text(
                                    text = tx.amount,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color =
                                            if (tx.amount.startsWith("+")) Color.Green
                                            else Color.Red
                            )
                            Text(
                                    text = tx.description,
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Normal,
                                    color = MaterialTheme.colorScheme.onBackground
                            )
                            Text(
                                    text = tx.date,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Light,
                                    color = Color.Gray
                            )
                        }
                    }
                }
            }
            if (selectedTransaction != null) {
                val context = LocalContext.current
                LaunchedEffect(selectedTransaction) {
                    context.startActivity(
                            Intent(context, TransactionDetailActivity::class.java).apply {
                                putExtra("amount", selectedTransaction!!.amount)
                                putExtra("description", selectedTransaction!!.description)
                                putExtra("date", selectedTransaction!!.date)
                            }
                    )
                    selectedTransaction = null
                }
            }
        }
    }
}

class TransactionListActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val transactions =
                    listOf(
                            Transaction("2025-07-13", "+2.000 BACH", "Salary"),
                            Transaction("2025-07-12", "-0.500 BACH", "Coffee Shop"),
                            Transaction("2025-07-11", "+1.200 BACH", "Gift"),
                            Transaction("2025-07-10", "-0.300 BACH", "Groceries"),
                            Transaction("2025-07-09", "+0.800 BACH", "Refund")
                    )
            TransactionListView(transactions)
        }
    }
}

@Preview(device = WearDevices.SMALL_ROUND, showSystemUi = true)
@Composable
fun DefaultPreview() {
    TransactionListView(
            transactions =
                    listOf(
                            Transaction("2025-07-13", "+2.000 BACH", "Salary"),
                            Transaction("2025-07-12", "-0.500 BACH", "Coffee Shop"),
                            Transaction("2025-07-11", "+1.200 BACH", "Gift"),
                            Transaction("2025-07-10", "-0.300 BACH", "Groceries"),
                            Transaction("2025-07-09", "+0.800 BACH", "Refund")
                    )
    )
}
