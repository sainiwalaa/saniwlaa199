package com.example.ui.screens

import androidx.activity.compose.BackHandler
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.CloudOff
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.SearchOff
import androidx.compose.material.icons.filled.Sort
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.Product
import com.example.ui.components.CategoryFilterBar
import com.example.ui.components.FooterPageDetailModal
import com.example.ui.components.FooterSection
import com.example.ui.components.HeroBannerSlider
import com.example.ui.components.HomeScreenSkeleton
import com.example.ui.components.ProductCard
import com.example.ui.components.ProductDetailModal
import com.example.ui.components.SainiwalaaHeader
import com.example.ui.theme.BorderLight
import com.example.ui.theme.DiscountGreen
import com.example.ui.theme.JaipurRose
import com.example.ui.theme.SaffronGold
import com.example.ui.theme.SaffronPrimary
import com.example.ui.theme.SurfaceBackground
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary
import com.example.ui.theme.TextSecondary
import com.example.ui.viewmodel.DealsViewModel
import com.example.ui.viewmodel.SortOption

@Composable
fun HomeScreen(
    viewModel: DealsViewModel,
    modifier: Modifier = Modifier
) {
    val uiState by viewModel.uiState.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val selectedMarket by viewModel.selectedMarket.collectAsState()
    val selectedSort by viewModel.selectedSort.collectAsState()
    val onlyTopPicks by viewModel.onlyTopPicks.collectAsState()
    val onlyFavorites by viewModel.onlyFavorites.collectAsState()
    val selectedProduct by viewModel.selectedProduct.collectAsState()
    val selectedFooterPage by viewModel.selectedFooterPage.collectAsState()

    val snackbarHostState = remember { SnackbarHostState() }
    var showSortMenu by remember { mutableStateOf(false) }

    // Handle back button if filters are active
    val isFiltering = searchQuery.isNotBlank() || selectedCategory != "All" ||
            selectedMarket != "All" || onlyTopPicks || onlyFavorites
    BackHandler(enabled = isFiltering) {
        viewModel.resetFilters()
    }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            SainiwalaaHeader(
                searchQuery = searchQuery,
                onSearchQueryChanged = viewModel::onSearchQueryChanged,
                selectedMarket = selectedMarket,
                onMarketSelected = viewModel::onMarketSelected,
                favoriteCount = uiState.favoriteCount,
                isOnlyFavorites = onlyFavorites,
                onToggleFavorites = viewModel::toggleFavoritesOnly,
                isRefreshing = uiState.isRefreshing,
                onRefresh = { viewModel.refresh(force = true) }
            )
        },
        containerColor = SurfaceBackground
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when {
                uiState.isLoading -> {
                    HomeScreenSkeleton()
                }

                uiState.errorMessage != null && !uiState.hasCachedData -> {
                    // Fullscreen Error State when no cache exists
                    ErrorStateView(
                        message = uiState.errorMessage ?: "Failed to connect to deals server",
                        onRetry = { viewModel.refresh(force = true) }
                    )
                }

                else -> {
                    LazyColumn(
                        modifier = Modifier.fillMaxSize(),
                        contentPadding = PaddingValues(bottom = 24.dp)
                    ) {
                        // Offline notice if applicable
                        if (uiState.errorMessage != null && uiState.hasCachedData) {
                            item(key = "offline_banner") {
                                OfflineCacheNotice(
                                    onRefresh = { viewModel.refresh(force = true) }
                                )
                            }
                        }

                        // Categories Bar
                        item(key = "category_bar") {
                            CategoryFilterBar(
                                categories = uiState.categories,
                                selectedCategory = selectedCategory,
                                onCategorySelected = viewModel::onCategorySelected,
                                onlyTopPicks = onlyTopPicks,
                                onToggleTopPicks = viewModel::toggleTopPicksOnly
                            )
                        }

                        // If user is searching or filtering: Show Filter Header & Product Grid
                        if (isFiltering) {
                            item(key = "filter_header") {
                                ActiveFilterHeader(
                                    query = searchQuery,
                                    category = selectedCategory,
                                    market = selectedMarket,
                                    onlyTop = onlyTopPicks,
                                    onlyFav = onlyFavorites,
                                    resultCount = uiState.filteredProducts.size,
                                    currentSort = selectedSort,
                                    onSortClick = { showSortMenu = true },
                                    onClearFilters = viewModel::resetFilters
                                )

                                DropdownMenu(
                                    expanded = showSortMenu,
                                    onDismissRequest = { showSortMenu = false }
                                ) {
                                    SortOption.values().forEach { option ->
                                        DropdownMenuItem(
                                            text = {
                                                Text(
                                                    text = option.label,
                                                    fontWeight = if (option == selectedSort) FontWeight.Bold else FontWeight.Normal
                                                )
                                            },
                                            onClick = {
                                                viewModel.onSortSelected(option)
                                                showSortMenu = false
                                            }
                                        )
                                    }
                                }
                            }

                            if (uiState.filteredProducts.isEmpty()) {
                                item(key = "empty_state") {
                                    EmptySearchResultsView(
                                        query = searchQuery,
                                        onReset = viewModel::resetFilters
                                    )
                                }
                            } else {
                                // 2-column mobile responsive grid
                                items(
                                    items = uiState.filteredProducts.chunked(2),
                                    key = { row -> row.first().stableId }
                                ) { rowProducts ->
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(horizontal = 16.dp, vertical = 6.dp),
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                                    ) {
                                        rowProducts.forEach { product ->
                                            Box(modifier = Modifier.weight(1f)) {
                                                ProductCard(
                                                    product = product,
                                                    onCardClick = { viewModel.selectProduct(product) },
                                                    onToggleFavorite = { viewModel.toggleFavorite(product) }
                                                )
                                            }
                                        }
                                        if (rowProducts.size == 1) {
                                            Spacer(modifier = Modifier.weight(1f))
                                        }
                                    }
                                }
                            }
                        } else {
                            // Standard Curated Marketplace Home Flow

                            // 1. Hero Banner Slider
                            item(key = "hero_slider") {
                                HeroBannerSlider(
                                    heroItems = uiState.heroItems,
                                    onExploreClicked = { /* Already on explore */ }
                                )
                            }

                            // 2. Trending Deals Horizontal Section
                            if (uiState.trendingDeals.isNotEmpty()) {
                                item(key = "section_trending") {
                                    DealSectionHeader(
                                        title = "⚡ Trending Deals",
                                        subtitle = "Popular hot discounts across marketplaces",
                                        accentColor = JaipurRose
                                    )
                                    LazyRow(
                                        contentPadding = PaddingValues(horizontal = 16.dp),
                                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                                        modifier = Modifier.padding(bottom = 12.dp)
                                    ) {
                                        items(uiState.trendingDeals, key = { "trend_${it.stableId}" }) { item ->
                                            Box(modifier = Modifier.width(170.dp)) {
                                                ProductCard(
                                                    product = item,
                                                    onCardClick = { viewModel.selectProduct(item) },
                                                    onToggleFavorite = { viewModel.toggleFavorite(item) }
                                                )
                                            }
                                        }
                                    }
                                }
                            }

                            // 3. Top Picks Section
                            if (uiState.topPicks.isNotEmpty()) {
                                item(key = "section_top_picks") {
                                    DealSectionHeader(
                                        title = "👑 Top Picks For You",
                                        subtitle = "Handpicked verified best deals",
                                        accentColor = SaffronGold,
                                        onViewAllClick = { viewModel.toggleTopPicksOnly() }
                                    )
                                    LazyRow(
                                        contentPadding = PaddingValues(horizontal = 16.dp),
                                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                                        modifier = Modifier.padding(bottom = 12.dp)
                                    ) {
                                        items(uiState.topPicks, key = { "top_${it.stableId}" }) { item ->
                                            Box(modifier = Modifier.width(170.dp)) {
                                                ProductCard(
                                                    product = item,
                                                    onCardClick = { viewModel.selectProduct(item) },
                                                    onToggleFavorite = { viewModel.toggleFavorite(item) }
                                                )
                                            }
                                        }
                                    }
                                }
                            }

                            // 4. Best Discounts Section Header
                            if (uiState.bestDiscounts.isNotEmpty()) {
                                item(key = "section_best_discounts") {
                                    DealSectionHeader(
                                        title = "🔥 Mega Discounts (40%+ Off)",
                                        subtitle = "Biggest price drops on Amazon, Flipkart & Meesho",
                                        accentColor = SaffronPrimary
                                    )
                                }
                            }

                            // 5. Main Product Discovery (2-column grid of all ranked products)
                            item(key = "all_deals_header") {
                                DealSectionHeader(
                                    title = "🛍️ Explore All Deals",
                                    subtitle = "Sorted by smart relevance & discount",
                                    accentColor = TextPrimary
                                )
                            }

                            items(
                                items = uiState.filteredProducts.chunked(2),
                                key = { row -> "home_${row.first().stableId}" }
                            ) { rowProducts ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(horizontal = 16.dp, vertical = 6.dp),
                                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                                ) {
                                    rowProducts.forEach { product ->
                                        Box(modifier = Modifier.weight(1f)) {
                                            ProductCard(
                                                product = product,
                                                onCardClick = { viewModel.selectProduct(product) },
                                                onToggleFavorite = { viewModel.toggleFavorite(product) }
                                            )
                                        }
                                    }
                                    if (rowProducts.size == 1) {
                                        Spacer(modifier = Modifier.weight(1f))
                                    }
                                }
                            }
                        }

                        // Footer
                        item(key = "footer") {
                            Spacer(modifier = Modifier.height(20.dp))
                            FooterSection(
                                footerItems = uiState.footerPages,
                                onPageSelected = viewModel::selectFooterPage
                            )
                        }
                    }
                }
            }

            // Product Detail Modal
            ProductDetailModal(
                product = selectedProduct,
                onDismiss = { viewModel.selectProduct(null) },
                onToggleFavorite = viewModel::toggleFavorite
            )

            // Footer Information Page Modal
            FooterPageDetailModal(
                page = selectedFooterPage,
                onDismiss = { viewModel.selectFooterPage(null) }
            )
        }
    }
}

@Composable
fun DealSectionHeader(
    title: String,
    subtitle: String,
    accentColor: Color,
    onViewAllClick: (() -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 16.dp, end = 16.dp, top = 14.dp, bottom = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = subtitle,
                fontSize = 11.sp,
                color = TextMuted
            )
        }
        if (onViewAllClick != null) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .clickable(onClick = onViewAllClick)
                    .padding(4.dp)
            ) {
                Text(
                    text = "View All",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = accentColor
                )
                Icon(
                    imageVector = Icons.Default.ArrowForward,
                    contentDescription = null,
                    tint = accentColor,
                    modifier = Modifier.size(12.dp)
                )
            }
        }
    }
}

@Composable
fun ActiveFilterHeader(
    query: String,
    category: String,
    market: String,
    onlyTop: Boolean,
    onlyFav: Boolean,
    resultCount: Int,
    currentSort: SortOption,
    onSortClick: () -> Unit,
    onClearFilters: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = if (onlyFav) "$resultCount Saved Deals" else "$resultCount Deals Found",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )

            Row(verticalAlignment = Alignment.CenterVertically) {
                // Sort Button
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color.White)
                        .clickable(onClick = onSortClick)
                        .padding(horizontal = 10.dp, vertical = 6.dp)
                        .testTag("sort_button")
                ) {
                    Icon(
                        imageVector = Icons.Default.Sort,
                        contentDescription = "Sort",
                        tint = TextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = currentSort.label,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = TextSecondary
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                // Reset Filter Button
                Text(
                    text = "Reset",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = JaipurRose,
                    modifier = Modifier
                        .clickable(onClick = onClearFilters)
                        .padding(4.dp)
                        .testTag("reset_filters_button")
                )
            }
        }
    }
}

@Composable
fun EmptySearchResultsView(
    query: String,
    onReset: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.SearchOff,
            contentDescription = null,
            tint = TextMuted,
            modifier = Modifier.size(54.dp)
        )
        Spacer(modifier = Modifier.height(14.dp))
        Text(
            text = "No deals found",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = if (query.isNotBlank()) "No products matched '$query'. Try another keyword or reset filters." else "No products found for this filter.",
            fontSize = 13.sp,
            color = TextSecondary,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(18.dp))
        Button(
            onClick = onReset,
            colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
            shape = RoundedCornerShape(8.dp)
        ) {
            Text("Reset All Filters", color = Color.White, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun OfflineCacheNotice(onRefresh: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFFEF3C7))
            .padding(horizontal = 16.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = Icons.Default.CloudOff,
                contentDescription = null,
                tint = SaffronGold,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Showing offline saved deals",
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF78350F)
            )
        }
        Text(
            text = "Tap to Retry",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = SaffronPrimary,
            modifier = Modifier.clickable(onClick = onRefresh)
        )
    }
}

@Composable
fun ErrorStateView(
    message: String,
    onRetry: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Icon(
            imageVector = Icons.Default.CloudOff,
            contentDescription = null,
            tint = JaipurRose,
            modifier = Modifier.size(60.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Unable to load deals",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = TextPrimary
        )
        Spacer(modifier = Modifier.height(6.dp))
        Text(
            text = message,
            fontSize = 13.sp,
            color = TextSecondary,
            textAlign = TextAlign.Center
        )
        Spacer(modifier = Modifier.height(20.dp))
        Button(
            onClick = onRetry,
            colors = ButtonDefaults.buttonColors(containerColor = SaffronPrimary),
            shape = RoundedCornerShape(10.dp)
        ) {
            Text("Retry Connection", color = Color.White, fontWeight = FontWeight.Bold)
        }
    }
}
