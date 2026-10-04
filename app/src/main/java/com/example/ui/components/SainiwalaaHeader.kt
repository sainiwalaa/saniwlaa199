package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.AmazonOrange
import com.example.ui.theme.FlipkartBlue
import com.example.ui.theme.JaipurRose
import com.example.ui.theme.MeeshoPlum
import com.example.ui.theme.RoyalNavyDark
import com.example.ui.theme.RoyalNavyElevated
import com.example.ui.theme.RoyalNavySurface
import com.example.ui.theme.SaffronGold
import com.example.ui.theme.SaffronPrimary

@Composable
fun SainiwalaaHeader(
    searchQuery: String,
    onSearchQueryChanged: (String) -> Unit,
    selectedMarket: String,
    onMarketSelected: (String) -> Unit,
    favoriteCount: Int,
    isOnlyFavorites: Boolean,
    onToggleFavorites: () -> Unit,
    isRefreshing: Boolean,
    onRefresh: () -> Unit,
    modifier: Modifier = Modifier
) {
    val focusManager = LocalFocusManager.current

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(RoyalNavyDark)
            .statusBarsPadding()
    ) {
        // Top Brand Row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Brand Logo & Taglines
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                // Crown / Shopping Icon Container
                Box(
                    modifier = Modifier
                        .size(40.dp)
                        .clip(RoundedCornerShape(10.dp))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(SaffronGold, JaipurRose)
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.ShoppingCart,
                        contentDescription = "SAINIWALAA Deals",
                        tint = Color.White,
                        modifier = Modifier.size(22.dp)
                    )
                }

                Spacer(modifier = Modifier.width(10.dp))

                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "SAINIWALAA",
                            color = SaffronGold,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 0.5.sp
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "DEALS",
                            color = Color.White,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 0.5.sp
                        )
                    }
                    Text(
                        text = "Best Deals, Smart Shopping",
                        color = Color(0xFFCBD5E1),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Medium,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            // Top Action Icons (Favorites + Refresh)
            Row(verticalAlignment = Alignment.CenterVertically) {
                // Favorites Icon
                IconButton(
                    onClick = onToggleFavorites,
                    modifier = Modifier
                        .size(40.dp)
                        .testTag("wishlist_button")
                ) {
                    BadgedBox(
                        badge = {
                            if (favoriteCount > 0) {
                                Badge(
                                    containerColor = JaipurRose,
                                    contentColor = Color.White
                                ) {
                                    Text(
                                        text = favoriteCount.toString(),
                                        fontSize = 10.sp
                                    )
                                }
                            }
                        }
                    ) {
                        Icon(
                            imageVector = if (isOnlyFavorites) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = "Wishlist",
                            tint = if (isOnlyFavorites) JaipurRose else Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }

                // Refresh Icon
                IconButton(
                    onClick = onRefresh,
                    enabled = !isRefreshing,
                    modifier = Modifier
                        .size(40.dp)
                        .testTag("refresh_button")
                ) {
                    if (isRefreshing) {
                        CircularProgressIndicator(
                            color = SaffronGold,
                            strokeWidth = 2.dp,
                            modifier = Modifier.size(20.dp)
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Refresh Deals",
                            tint = Color.White,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
            }
        }

        // Search Bar (Real Marketplace Style)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 4.dp)
        ) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = onSearchQueryChanged,
                placeholder = {
                    Text(
                        text = "Search Kurti, Shoes, Mobiles, Amazon, Meesho...",
                        color = Color(0xFF94A3B8),
                        fontSize = 13.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = SaffronGold,
                        modifier = Modifier.size(20.dp)
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotBlank()) {
                        IconButton(onClick = { onSearchQueryChanged("") }) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Clear search",
                                tint = Color(0xFFCBD5E1),
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }
                },
                singleLine = true,
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(onSearch = { focusManager.clearFocus() }),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = RoyalNavySurface,
                    unfocusedContainerColor = RoyalNavySurface,
                    focusedBorderColor = SaffronGold,
                    unfocusedBorderColor = RoyalNavyElevated,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White,
                    cursorColor = SaffronGold
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
                    .testTag("search_input")
            )
        }

        // Marketplace Quick Filter Pills (Amazon, Flipkart, Meesho, All)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            MarketBadgeChip(
                label = "All Deals",
                isSelected = selectedMarket == "All",
                activeColor = SaffronPrimary,
                onClick = { onMarketSelected("All") }
            )
            MarketBadgeChip(
                label = "Amazon",
                isSelected = selectedMarket.equals("Amazon", ignoreCase = true),
                activeColor = AmazonOrange,
                onClick = { onMarketSelected("Amazon") }
            )
            MarketBadgeChip(
                label = "Flipkart",
                isSelected = selectedMarket.equals("Flipkart", ignoreCase = true),
                activeColor = FlipkartBlue,
                onClick = { onMarketSelected("Flipkart") }
            )
            MarketBadgeChip(
                label = "Meesho",
                isSelected = selectedMarket.equals("Meesho", ignoreCase = true),
                activeColor = MeeshoPlum,
                onClick = { onMarketSelected("Meesho") }
            )
        }

        // Jaipur Gold Accent Bottom Border
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(2.dp)
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(
                            SaffronGold,
                            JaipurRose,
                            SaffronGold
                        )
                    )
                )
        )
    }
}

@Composable
private fun MarketBadgeChip(
    label: String,
    isSelected: Boolean,
    activeColor: Color,
    onClick: () -> Unit
) {
    val bg = if (isSelected) activeColor else RoyalNavyElevated
    val textColor = if (isSelected) Color.White else Color(0xFFE2E8F0)
    val borderModifier = if (isSelected) {
        Modifier.border(1.dp, Color.White.copy(alpha = 0.5f), RoundedCornerShape(16.dp))
    } else Modifier

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(16.dp))
            .background(bg)
            .then(borderModifier)
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 6.dp)
            .testTag("market_chip_${label.lowercase()}"),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            color = textColor,
            fontSize = 12.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
        )
    }
}
