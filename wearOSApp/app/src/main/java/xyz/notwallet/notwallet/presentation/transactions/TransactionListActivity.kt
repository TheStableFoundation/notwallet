package xyz.notwallet.notwallet.presentation.transactions

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Euro
import androidx.compose.material.icons.rounded.Info
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.wear.compose.foundation.lazy.TransformingLazyColumn
import androidx.wear.compose.foundation.lazy.TransformingLazyColumnState
import androidx.wear.compose.foundation.lazy.items
import androidx.wear.compose.foundation.lazy.rememberTransformingLazyColumnState
import androidx.wear.compose.material3.AppScaffold
import androidx.wear.compose.material3.EdgeButton
import androidx.wear.compose.material3.EdgeButtonSize
import androidx.wear.compose.material3.ScreenScaffold
import androidx.wear.compose.material3.SurfaceTransformation
import androidx.wear.compose.material3.lazy.rememberTransformationSpec
import androidx.wear.tooling.preview.devices.WearDevices
import com.google.android.horologist.compose.layout.ColumnItemType
import com.google.android.horologist.compose.layout.rememberResponsiveColumnPadding
import xyz.notwallet.notwallet.R
import xyz.notwallet.notwallet.presentation.components.TransactionCard
import xyz.notwallet.notwallet.presentation.theme.NotWalletTheme

data class Transaction(val date: String, val amount: String, val description: String)

class TransactionListActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { TransactionListView() }
    }
}

@Composable
private fun TransactionListView() {
    val transactions =
            listOf(
                    Transaction("2025-07-13", "+2.000 BACH", "Salary"),
                    Transaction("2025-07-12", "-0.500 BACH", "Coffee Shop"),
                    Transaction("2025-07-11", "+1.200 BACH", "Gift"),
                    Transaction("2025-07-10", "-0.300 BACH", "Groceries"),
                    Transaction("2025-07-09", "+0.800 BACH", "Refund"),
                    Transaction("2025-07-13", "+2.000 BACH", "Salary"),
                    Transaction("2025-07-12", "-0.500 BACH", "Coffee Shop"),
                    Transaction("2025-07-11", "+1.200 BACH", "Gift"),
                    Transaction("2025-07-10", "-0.300 BACH", "Groceries"),
                    Transaction("2025-07-09", "+0.800 BACH", "Refund"),
                    Transaction("2025-07-13", "+2.000 BACH", "Salary"),
                    Transaction("2025-07-12", "-0.500 BACH", "Coffee Shop"),
                    Transaction("2025-07-11", "+1.200 BACH", "Gift"),
                    Transaction("2025-07-10", "-0.300 BACH", "Groceries"),
                    Transaction("2025-07-09", "+0.800 BACH", "Refund"),
                    Transaction("2025-07-13", "+2.000 BACH", "Salary"),
                    Transaction("2025-07-12", "-0.500 BACH", "Coffee Shop"),
                    Transaction("2025-07-11", "+1.200 BACH", "Gift"),
                    Transaction("2025-07-10", "-0.300 BACH", "Groceries"),
                    Transaction("2025-07-09", "+0.800 BACH", "Refund")
            )

    var visibleTransactions by remember { mutableStateOf(transactions.take(5)) } // Initially show 5
    var canLoadMore by remember { mutableStateOf(transactions.size > visibleTransactions.size) }

    NotWalletTheme {
        AppScaffold {
            val listState = rememberTransformingLazyColumnState()
            ScreenScaffold(
                    scrollState = listState,
                    contentPadding =
                            rememberResponsiveColumnPadding(
                                    first = ColumnItemType.IconButton,
                                    last = ColumnItemType.Button,
                            ),
                    edgeButton = {
                        if (canLoadMore) {
                            EdgeButton(
                                    onClick = {
                                        val currentCount = visibleTransactions.size
                                        val nextItemsCount =
                                                minOf(5, transactions.size - currentCount)
                                        if (nextItemsCount > 0) {
                                            visibleTransactions =
                                                    transactions.take(currentCount + nextItemsCount)
                                            canLoadMore =
                                                    transactions.size > visibleTransactions.size
                                        }
                                    },
                                    buttonSize = EdgeButtonSize.Medium,
                            ) { Text(stringResource(R.string.more)) }
                        }
                    },
            ) { contentPadding ->
                ScrollViewContent(listState, contentPadding, visibleTransactions)
            }
        }
    }
}

@Composable
private fun ScrollViewContent(
        listState: TransformingLazyColumnState,
        contentPadding: PaddingValues,
        transactions: List<Transaction>
) {
    var selectedTransaction by remember { mutableStateOf<Transaction?>(null) }
    val transformationSpec = rememberTransformationSpec()
    TransformingLazyColumn(
            modifier = Modifier.fillMaxSize().background(Color.Black, RoundedCornerShape(30)),
            state = listState,
            contentPadding = contentPadding,
    ) {
        items(transactions) { tx ->
            val isIncoming = tx.amount.startsWith("+")
            val icon = if (isIncoming) Icons.Rounded.Euro else Icons.Rounded.Info
            val iconDesc = if (isIncoming) "Incoming" else "Outgoing"
            TransactionCard(
                    imageVector = icon,
                    iconContentDescription = iconDesc,
                    name = tx.description,
                    time = tx.date,
                    title = tx.amount,
                    onClick = { selectedTransaction = tx },
                    transformation = SurfaceTransformation(transformationSpec)
            )
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

@Preview(device = WearDevices.SMALL_ROUND, showSystemUi = true)
@Composable
private fun DefaultPreview() {
    TransactionListView()
}
