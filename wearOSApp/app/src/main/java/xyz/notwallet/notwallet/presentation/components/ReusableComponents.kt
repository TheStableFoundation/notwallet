/*
 * Copyright 2021 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package xyz.notwallet.notwallet.presentation.components

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.Message
import androidx.compose.material.icons.rounded.Euro
import androidx.compose.material.icons.rounded.Info
import androidx.compose.material.icons.rounded.SelfImprovement
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp
import androidx.wear.compose.foundation.lazy.TransformingLazyColumn
import androidx.wear.compose.foundation.lazy.rememberTransformingLazyColumnState
import androidx.wear.compose.material3.AppCard
import androidx.wear.compose.material3.AppScaffold
import androidx.wear.compose.material3.Button
import androidx.wear.compose.material3.FilledIconButton
import androidx.wear.compose.material3.Icon
import androidx.wear.compose.material3.ListHeader
import androidx.wear.compose.material3.MaterialTheme
import androidx.wear.compose.material3.ScreenScaffold
import androidx.wear.compose.material3.SurfaceTransformation
import androidx.wear.compose.material3.SwitchButton
import androidx.wear.compose.material3.Text
import androidx.wear.compose.material3.lazy.rememberTransformationSpec
import androidx.wear.compose.ui.tooling.preview.WearPreviewDevices
import com.google.android.horologist.compose.layout.ColumnItemType
import com.google.android.horologist.compose.layout.rememberResponsiveColumnPadding
import xyz.notwallet.notwallet.R
import xyz.notwallet.notwallet.presentation.theme.NotWalletTheme

@Composable
fun IconButton(
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
    imageVector: ImageVector,
    contentDescription: String = ""
) {
    FilledIconButton(
        onClick = onClick,
        modifier = modifier,
    ) {
        Icon(
            imageVector = imageVector,
            contentDescription = contentDescription,
        )
    }
}

@Composable
fun BaseText(
    text: String,
    modifier: Modifier = Modifier,
    fontSize: TextUnit = 12.sp,
    fontFamily: FontFamily = FontFamily.Monospace,
    color: Color = Color.Gray,
    textAlign: TextAlign = TextAlign.Center,
    fontWeight: FontWeight = FontWeight.SemiBold,
    maxLines: Int = 1,
    transformation: SurfaceTransformation
) {
    ListHeader(
        modifier = modifier,
        transformation = transformation,
    ) {
        Text(
            modifier = modifier,
            textAlign = TextAlign.Center,
            text = text,
            fontSize = fontSize
        )
    }
}

@Composable
fun TextRegular(text: String, modifier: Modifier = Modifier, transformation: SurfaceTransformation) {
    ListHeader(
        modifier = modifier,
        transformation = transformation,
    ) {
        Text(
            modifier = modifier,
            textAlign = TextAlign.Center,
            text = text,
        )
    }
}

@Composable
fun TextHeader(text: String, modifier: Modifier = Modifier, transformation: SurfaceTransformation) {
    ListHeader(
        modifier = modifier,
        transformation = transformation,
    ) {
        Text(
            modifier = modifier,
            textAlign = TextAlign.Center,
            text = text,
        )
    }
}

@Composable
fun Card(
    modifier: Modifier = Modifier,
    iconModifier: Modifier = Modifier,
    iconContentDescription: String = "",
    name: String = "",
    time: String = "",
    title: String = "",
    content: String = "",
    imageVector: ImageVector,
    onClick: () -> Unit,
    transformation: SurfaceTransformation,
) {
    AppCard(
        modifier = modifier,
        transformation = transformation,
        appImage = {
            Icon(
                imageVector = imageVector,
                contentDescription = iconContentDescription,
                modifier = iconModifier,
            )
        },
        appName = { Text(name) },
        time = { Text(time) },
        title = { Text(title) },
        onClick = onClick,
    ) {
        Text(content)
    }
}

@Composable
fun TokenInfoCard(
    modifier: Modifier = Modifier,
    iconModifier: Modifier = Modifier,
    title: String = "",
    content: String = "",
    onClick: () -> Unit,
    transformation: SurfaceTransformation,
) {
    AppCard(
        modifier = modifier,
        transformation = transformation,
        appImage = {
            Icon(
                imageVector = Icons.Rounded.Info,
                contentDescription = "Token information icon",
                modifier = iconModifier,
            )
        },
        appName = { Text(stringResource(R.string.token_info_card_information)) },
        title = { Text(title) },
        onClick = onClick,
    ) {
        Text(stringResource(R.string.token_info_card_total_supply))
        Text(content)
    }
}

@Composable
fun Chip(
    modifier: Modifier = Modifier,
    maxLines: Int = 1,
    overflow: TextOverflow = TextOverflow.Ellipsis,
    text: String,
    imageVector: ImageVector,
    iconContentDescription: String,
    onClick: () -> Unit,
    transformation: SurfaceTransformation,
) {
    Button(
        modifier = modifier,
        transformation = transformation,
        onClick = onClick,
        icon = {
            Icon(
                imageVector = imageVector,
                contentDescription = iconContentDescription,
            )
        },
    ) {
        Text(
            text = text,
            maxLines = maxLines,
            overflow = overflow,
        )
    }
}

@Composable
fun SwitchChip(modifier: Modifier = Modifier, transformation: SurfaceTransformation) {
    var checked by remember { mutableStateOf(true) }
    SwitchButton(
        modifier = modifier,
        transformation = transformation,
        label = {
            Text(
                "Sound",
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.semantics {
                    contentDescription = if (checked) "On" else "Off"
                },
            )
        },
        checked = checked,
        onCheckedChange = { checked = it },
        enabled = true,
    )
}

// Function only used as a demo for when you start the code lab (removed as step 1).
@Composable
fun StartOnlyTextComposables() {
    Text(
        modifier = Modifier.fillMaxSize(),
        textAlign = TextAlign.Center,
        color = MaterialTheme.colorScheme.primary,
        text = stringResource(R.string.hello_world),
    )
}

/* Previews of Composables. */

// Hello, world starter text preview
@WearPreviewDevices
@Composable
fun StartOnlyTextComposablesPreview() {
    NotWalletTheme {
        AppScaffold {
            val listState = rememberTransformingLazyColumnState()
            val contentPadding =
                rememberResponsiveColumnPadding(first = ColumnItemType.BodyText)
            ScreenScaffold(
                scrollState = listState,
                contentPadding = contentPadding,
            ) { contentPadding ->
                TransformingLazyColumn(state = listState, contentPadding = contentPadding) {
                    item {
                        StartOnlyTextComposables()
                    }
                }
            }
        }
    }
}

// Button Preview
@WearPreviewDevices
@Composable
fun ButtonPreview() {
    NotWalletTheme {
        //  val transformationSpec = rememberTransformationSpec()
        AppScaffold {
            val listState = rememberTransformingLazyColumnState()
            val contentPadding =
                rememberResponsiveColumnPadding(first = ColumnItemType.IconButton)
            ScreenScaffold(
                scrollState = listState,
                contentPadding = contentPadding,
            ) { contentPadding ->
                TransformingLazyColumn(state = listState, contentPadding = contentPadding) {
                    item {
                        IconButton(
                            onClick = {},
                            imageVector = Icons.Rounded.Euro
                        )
                    }
                }
            }
        }
    }
}

// Text Preview
@WearPreviewDevices
@Composable
fun BaseTextPreview() {
    NotWalletTheme {
        val transformationSpec = rememberTransformationSpec()
        AppScaffold {
            val listState = rememberTransformingLazyColumnState()
            val contentPadding =
                rememberResponsiveColumnPadding(first = ColumnItemType.BodyText)
            ScreenScaffold(
                scrollState = listState,
                contentPadding = contentPadding,
            ) { contentPadding ->
                TransformingLazyColumn(state = listState, contentPadding = contentPadding, modifier = Modifier.fillMaxWidth()) {
                    item {
                        BaseText(text = "Hello world!", transformation = SurfaceTransformation(transformationSpec))
                    }
                    item {
                        TextHeader(text = "This is Header", transformation = SurfaceTransformation(transformationSpec))
                    }
                    item {
                        TextRegular(text = "Regular text", transformation = SurfaceTransformation(transformationSpec))
                    }
                }
            }
        }
    }
}

// Card Preview
@WearPreviewDevices
@Composable
fun CardPreview() {
    NotWalletTheme {
        val transformationSpec = rememberTransformationSpec()
        AppScaffold {
            val listState = rememberTransformingLazyColumnState()
            val contentPadding =
                rememberResponsiveColumnPadding(first = ColumnItemType.Card)
            ScreenScaffold(
                scrollState = listState,
                contentPadding = contentPadding,
            ) { cp ->
                TransformingLazyColumn(state = listState, contentPadding = cp) {
                    item {
                        Card(
                            imageVector = Icons.AutoMirrored.Rounded.Message,
                            iconContentDescription = "Message icon",
                            name = "Message",
                            time = "12am",
                            title = "Kim Green",
                            content = "On my way!",
                            onClick = {},
                            transformation = SurfaceTransformation(transformationSpec)
                        )
                    }
                }
            }
        }
    }
}


// Token Card Preview
@WearPreviewDevices
@Composable
fun TokenCardPreview() {
    NotWalletTheme {
        val transformationSpec = rememberTransformationSpec()
        AppScaffold {
            val listState = rememberTransformingLazyColumnState()
            val contentPadding =
                rememberResponsiveColumnPadding(first = ColumnItemType.Card)
            ScreenScaffold(
                scrollState = listState,
                contentPadding = contentPadding,
            ) { cp ->
                TransformingLazyColumn(state = listState, contentPadding = cp) {
                    item {
                        TokenInfoCard(
                            title = "Kim Green",
                            content = "On my way!",
                            onClick = {},
                            transformation = SurfaceTransformation(transformationSpec)
                        )
                    }
                }
            }
        }
    }
}
// Chip Preview
@WearPreviewDevices
@Composable
fun ChipPreview() {
    NotWalletTheme {
        val transformationSpec = rememberTransformationSpec()
        AppScaffold {
            val listState = rememberTransformingLazyColumnState()
            val contentPadding =
                rememberResponsiveColumnPadding(first = ColumnItemType.Button)
            ScreenScaffold(
                scrollState = listState,
                contentPadding = contentPadding,
            ) { contentPadding ->
                TransformingLazyColumn(state = listState, contentPadding = contentPadding) {
                    item {
                        Chip(
                            text = "5 minute Meditation",
                            imageVector = Icons.Rounded.SelfImprovement,
                            iconContentDescription = "triggers meditation action",
                            onClick = {},
                            transformation = SurfaceTransformation(transformationSpec)
                        )
                    }
                }
            }
        }
    }
}

// Switch Chip Preview
@WearPreviewDevices
@Composable
fun SwitchChipPreview() {
    NotWalletTheme {
        val transformationSpec = rememberTransformationSpec()
        AppScaffold {
            val listState = rememberTransformingLazyColumnState()
            val contentPadding =
                rememberResponsiveColumnPadding(first = ColumnItemType.Button)
            ScreenScaffold(
                scrollState = listState,
                contentPadding = contentPadding,
            ) { contentPadding ->
                TransformingLazyColumn(state = listState, contentPadding = contentPadding) {
                    item {
                        SwitchChip(transformation = SurfaceTransformation(transformationSpec))
                    }
                }
            }
        }
    }
}
