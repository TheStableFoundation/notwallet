package xyz.notwallet.notwallet.presentation

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Euro
import androidx.compose.material.icons.rounded.FormatListNumbered
import androidx.compose.material3.HorizontalDivider
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.wear.compose.foundation.lazy.TransformingLazyColumn
import androidx.wear.compose.foundation.lazy.rememberTransformingLazyColumnState
import androidx.wear.compose.material.Button
import androidx.wear.compose.material3.AppScaffold
import androidx.wear.compose.material3.ScreenScaffold
import androidx.wear.compose.material3.SurfaceTransformation
import androidx.wear.compose.material3.lazy.rememberTransformationSpec
import androidx.wear.tooling.preview.devices.WearDevices
import com.google.android.horologist.compose.layout.ColumnItemType
import com.google.android.horologist.compose.layout.rememberResponsiveColumnPadding
import xyz.notwallet.notwallet.presentation.components.BaseText
import xyz.notwallet.notwallet.presentation.components.Chip
import xyz.notwallet.notwallet.presentation.components.PriceGraphView
import xyz.notwallet.notwallet.presentation.theme.NotWalletTheme
import xyz.notwallet.notwallet.presentation.transactions.TransactionListActivity

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        setTheme(android.R.style.Theme_DeviceDefault)
        setContent { WearApp() }
    }
}

@Composable
fun WearApp() {
    NotWalletTheme {
        AppScaffold {
            val context = LocalContext.current
            val listState = rememberTransformingLazyColumnState()
            val transformationSpec = rememberTransformationSpec()
            ScreenScaffold(
                scrollState = listState,
                contentPadding = rememberResponsiveColumnPadding(
                    first = ColumnItemType.IconButton,
                    last = ColumnItemType.Button,
                )
            ) { contentPadding ->
                TransformingLazyColumn(
                    state = listState,
                    contentPadding = contentPadding,
                ) {
                    item {
                        Chip(
                            text = "BACH Token",
                            imageVector = Icons.Rounded.Euro,
                            iconContentDescription = "BACH Token information",
                            onClick = {
                                context.startActivity(
                                    Intent(context, BachInfoActivity::class.java)
                                )
                            },
                            transformation = SurfaceTransformation(transformationSpec)
                        )
                    }
                    item {
                        Box(
                            modifier = Modifier.fillMaxWidth().height(60.dp).background(Color.Black)
                        ) {
                            PriceGraphView(modifier = Modifier.fillMaxSize())
                        }
                    }
                    item {
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                    item {
                        HorizontalDivider()
                    }
                    item {
                        BaseText(
                            text = "Total supply",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color.Gray,
                            transformation = SurfaceTransformation(transformationSpec)
                        )
                    }
                    item {
                        Button(
                            onClick = {},
                            modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
                        ) {
                            BaseText(
                                text = "10.89 mill",
                                fontSize = 20.sp,
                                fontFamily = FontFamily.Monospace,
                                modifier =
                                    Modifier.clip(RectangleShape),
                                maxLines = 1,
                                transformation = SurfaceTransformation(transformationSpec)
                            )
                        }
                    }
                    item {
                        Chip(
                            text = "Transactions",
                            imageVector = Icons.Rounded.FormatListNumbered,
                            iconContentDescription = "List of transactions",
                            onClick = {
                                context.startActivity(
                                    Intent(context, TransactionListActivity::class.java)
                                )
                            },
                            transformation = SurfaceTransformation(transformationSpec)
                        )
                    }
                }
            }
        }
    }
}

@Preview(device = WearDevices.SMALL_ROUND, showSystemUi = true)
@Composable
fun DefaultPreview() {
    WearApp()
}
