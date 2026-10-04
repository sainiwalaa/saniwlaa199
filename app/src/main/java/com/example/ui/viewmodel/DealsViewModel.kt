package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.repository.DealsRepository
import com.example.data.repository.RepoState
import com.example.model.FooterItem
import com.example.model.HeaderCategory
import com.example.model.HeroItem
import com.example.model.Product
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.Locale

enum class SortOption(val label: String) {
    SMART_RANKING("Featured / Smart"),
    DISCOUNT_HIGH("Highest Discount"),
    PRICE_LOW("Price: Low to High"),
    PRICE_HIGH("Price: High to Low"),
    RATING_HIGH("Customer Rating")
}

data class DealsUiState(
    val isLoading: Boolean = true,
    val isRefreshing: Boolean = false,
    val errorMessage: String? = null,
    val hasCachedData: Boolean = false,
    val allProducts: List<Product> = emptyList(),
    val filteredProducts: List<Product> = emptyList(),
    val topPicks: List<Product> = emptyList(),
    val trendingDeals: List<Product> = emptyList(),
    val bestDiscounts: List<Product> = emptyList(),
    val heroItems: List<HeroItem> = emptyList(),
    val categories: List<String> = emptyList(),
    val headerCategories: List<HeaderCategory> = emptyList(),
    val footerPages: List<FooterItem> = emptyList(),
    val favoriteCount: Int = 0
)

class DealsViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = DealsRepository(application)

    val repoState = repository.repoState
    val heroItems = repository.heroItems
    val headerCategories = repository.headerCategories
    val footerPages = repository.footerPages

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow("All")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _selectedMarket = MutableStateFlow("All")
    val selectedMarket: StateFlow<String> = _selectedMarket.asStateFlow()

    private val _selectedSort = MutableStateFlow(SortOption.SMART_RANKING)
    val selectedSort: StateFlow<SortOption> = _selectedSort.asStateFlow()

    private val _onlyTopPicks = MutableStateFlow(false)
    val onlyTopPicks: StateFlow<Boolean> = _onlyTopPicks.asStateFlow()

    private val _onlyFavorites = MutableStateFlow(false)
    val onlyFavorites: StateFlow<Boolean> = _onlyFavorites.asStateFlow()

    private val _selectedProduct = MutableStateFlow<Product?>(null)
    val selectedProduct: StateFlow<Product?> = _selectedProduct.asStateFlow()

    private val _selectedFooterPage = MutableStateFlow<FooterItem?>(null)
    val selectedFooterPage: StateFlow<FooterItem?> = _selectedFooterPage.asStateFlow()

    val uiState: StateFlow<DealsUiState> = combine(
        repository.productsFlow,
        repository.favoritesFlow,
        _searchQuery,
        _selectedCategory,
        _selectedMarket,
        _selectedSort,
        _onlyTopPicks,
        _onlyFavorites,
        repository.repoState,
        repository.heroItems,
        repository.headerCategories,
        repository.footerPages
    ) { args ->
        @Suppress("UNCHECKED_CAST")
        val rawProducts = args[0] as List<Product>
        @Suppress("UNCHECKED_CAST")
        val favorites = args[1] as List<Product>
        val query = args[2] as String
        val category = args[3] as String
        val market = args[4] as String
        val sort = args[5] as SortOption
        val topOnly = args[6] as Boolean
        val favOnly = args[7] as Boolean
        val state = args[8] as RepoState
        @Suppress("UNCHECKED_CAST")
        val hero = args[9] as List<HeroItem>
        @Suppress("UNCHECKED_CAST")
        val header = args[10] as List<HeaderCategory>
        @Suppress("UNCHECKED_CAST")
        val footer = args[11] as List<FooterItem>

        // Build unique categories list combining header and product categories
        val extractedCats = mutableSetOf<String>()
        header.forEach { if (!it.category.isNullOrBlank()) extractedCats.add(it.category.trim()) }
        rawProducts.forEach { p ->
            p.categoriesList.forEach { if (it.isNotBlank()) extractedCats.add(it) }
        }
        val sortedCategories = listOf("All") + extractedCats.sorted()

        // Filter and Rank
        val filtered = filterAndRankProducts(
            products = if (favOnly) favorites else rawProducts,
            query = query,
            category = category,
            market = market,
            sort = sort,
            onlyTop = topOnly
        )

        val topPicksList = rawProducts.filter { it.isTopPick }.take(10)
        val trendingList = rawProducts.filter {
            it.badge?.isNotBlank() == true || it.discountPercentage >= 30
        }.sortedByDescending { it.discountPercentage }.take(10)
        val bestDiscountsList = rawProducts.filter { it.discountPercentage >= 40 }
            .sortedByDescending { it.discountPercentage }.take(10)

        DealsUiState(
            isLoading = state is RepoState.Loading && rawProducts.isEmpty(),
            isRefreshing = state is RepoState.Loading && rawProducts.isNotEmpty(),
            errorMessage = if (state is RepoState.Error) state.message else null,
            hasCachedData = rawProducts.isNotEmpty(),
            allProducts = rawProducts,
            filteredProducts = filtered,
            topPicks = topPicksList,
            trendingDeals = trendingList,
            bestDiscounts = bestDiscountsList,
            heroItems = hero,
            categories = sortedCategories,
            headerCategories = header,
            footerPages = footer,
            favoriteCount = favorites.size
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = DealsUiState()
    )

    init {
        refresh(force = false)
    }

    fun refresh(force: Boolean = true) {
        viewModelScope.launch {
            repository.refreshDeals(force = force)
        }
    }

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }

    fun onCategorySelected(category: String) {
        _selectedCategory.value = category
    }

    fun onMarketSelected(market: String) {
        _selectedMarket.value = market
    }

    fun onSortSelected(sort: SortOption) {
        _selectedSort.value = sort
    }

    fun toggleTopPicksOnly() {
        _onlyTopPicks.value = !_onlyTopPicks.value
    }

    fun toggleFavoritesOnly() {
        _onlyFavorites.value = !_onlyFavorites.value
    }

    fun resetFilters() {
        _searchQuery.value = ""
        _selectedCategory.value = "All"
        _selectedMarket.value = "All"
        _selectedSort.value = SortOption.SMART_RANKING
        _onlyTopPicks.value = false
        _onlyFavorites.value = false
    }

    fun selectProduct(product: Product?) {
        _selectedProduct.value = product
    }

    fun selectFooterPage(page: FooterItem?) {
        _selectedFooterPage.value = page
    }

    fun toggleFavorite(product: Product) {
        viewModelScope.launch {
            repository.toggleFavorite(product)
        }
    }

    /**
     * Smart Product Ranking Algorithm:
     * 1. Exact search match
     * 2. NAME keyword match
     * 3. KEYWORDS match
     * 4. CATEGORY match
     * 5. TOP = YES
     * 6. higher discount
     * 7. rating
     * 8. product completeness
     * 9. marketplace
     * 10. stable fallback order
     */
    private fun filterAndRankProducts(
        products: List<Product>,
        query: String,
        category: String,
        market: String,
        sort: SortOption,
        onlyTop: Boolean
    ): List<Product> {
        val normalizedQuery = query.trim().lowercase(Locale.ROOT)
        val queryTokens = normalizedQuery.split(Regex("\\s+")).filter { it.isNotBlank() }

        // Category & Market Filtering
        val filtered = products.filter { product ->
            if (onlyTop && !product.isTopPick) return@filter false

            val matchesMarket = if (market == "All") true else {
                product.market?.equals(market, ignoreCase = true) == true
            }
            if (!matchesMarket) return@filter false

            val matchesCategory = if (category == "All") true else {
                product.categoriesList.any { it.equals(category, ignoreCase = true) } ||
                        product.category?.contains(category, ignoreCase = true) == true
            }
            if (!matchesCategory) return@filter false

            if (queryTokens.isEmpty()) return@filter true

            // Search filter
            val name = (product.name ?: "").lowercase(Locale.ROOT)
            val keywords = (product.keywords ?: "").lowercase(Locale.ROOT)
            val desc = (product.description ?: "").lowercase(Locale.ROOT)
            val cat = (product.category ?: "").lowercase(Locale.ROOT)
            val mkt = (product.market ?: "").lowercase(Locale.ROOT)
            val badge = (product.badge ?: "").lowercase(Locale.ROOT)

            // Matches if any token appears in name, keywords, cat, desc, market, badge
            queryTokens.all { token ->
                name.contains(token) || keywords.contains(token) || cat.contains(token) ||
                        desc.contains(token) || mkt.contains(token) || badge.contains(token)
            }
        }

        // Apply Sorting / Smart Ranking
        return when (sort) {
            SortOption.DISCOUNT_HIGH -> filtered.sortedByDescending { it.discountPercentage }
            SortOption.PRICE_LOW -> filtered.sortedWith(
                compareBy(nullsLast()) { it.parsedPrice }
            )
            SortOption.PRICE_HIGH -> filtered.sortedWith(
                compareByDescending(nullsLast()) { it.parsedPrice }
            )
            SortOption.RATING_HIGH -> filtered.sortedByDescending { it.parsedRating }
            SortOption.SMART_RANKING -> {
                filtered.map { product ->
                    val score = calculateSmartScore(product, normalizedQuery, queryTokens)
                    product to score
                }.sortedWith(
                    compareByDescending<Pair<Product, Double>> { it.second }
                        .thenBy { it.first.row ?: 0 }
                ).map { it.first }
            }
        }
    }

    private fun calculateSmartScore(
        product: Product,
        fullQuery: String,
        queryTokens: List<String>
    ): Double {
        var score = 0.0

        val name = (product.name ?: "").lowercase(Locale.ROOT)
        val keywords = (product.keywords ?: "").lowercase(Locale.ROOT)
        val cat = (product.category ?: "").lowercase(Locale.ROOT)
        val desc = (product.description ?: "").lowercase(Locale.ROOT)

        if (fullQuery.isNotBlank()) {
            if (name == fullQuery) score += 1000.0
            else if (name.startsWith(fullQuery)) score += 500.0
            else if (name.contains(fullQuery)) score += 300.0

            queryTokens.forEach { token ->
                if (name.contains(token)) score += 150.0
                if (keywords.contains(token)) score += 100.0
                if (cat.contains(token)) score += 80.0
                if (desc.contains(token)) score += 30.0
            }
        }

        // Top pick boost
        if (product.isTopPick) score += 200.0

        // Discount boost (higher discount => higher attractiveness)
        score += product.discountPercentage * 1.5

        // Rating boost
        score += product.parsedRating * 15.0

        // Badge boost (e.g. DEAL, BESTSELLER)
        if (!product.badge.isNullOrBlank()) score += 50.0

        // Image completeness
        if (!product.image.isNullOrBlank()) score += 20.0

        return score
    }
}
