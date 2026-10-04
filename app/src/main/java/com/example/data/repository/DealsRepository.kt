package com.example.data.repository

import android.content.Context
import android.util.Log
import com.example.data.local.CacheMetadataEntity
import com.example.data.local.DealsDatabase
import com.example.data.local.ProductEntity
import com.example.data.remote.DealsApiService
import com.example.model.FooterItem
import com.example.model.HeaderCategory
import com.example.model.HeroItem
import com.example.model.Product
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

sealed class RepoState {
    object Idle : RepoState()
    object Loading : RepoState()
    data class Success(val isFromCache: Boolean) : RepoState()
    data class Error(val message: String, val hasCachedData: Boolean) : RepoState()
}

class DealsRepository(context: Context) {
    private val database = DealsDatabase.getDatabase(context)
    private val productDao = database.productDao()
    private val apiService = DealsApiService()

    private val _repoState = MutableStateFlow<RepoState>(RepoState.Idle)
    val repoState = _repoState.asStateFlow()

    private val _heroItems = MutableStateFlow<List<HeroItem>>(emptyList())
    val heroItems = _heroItems.asStateFlow()

    private val _headerCategories = MutableStateFlow<List<HeaderCategory>>(emptyList())
    val headerCategories = _headerCategories.asStateFlow()

    private val _footerPages = MutableStateFlow<List<FooterItem>>(emptyList())
    val footerPages = _footerPages.asStateFlow()

    val productsFlow: Flow<List<Product>> = productDao.getAllProductsFlow().map { entities ->
        entities.map { it.toProduct() }
    }

    val favoritesFlow: Flow<List<Product>> = productDao.getFavoriteProductsFlow().map { entities ->
        entities.map { it.toProduct() }
    }

    init {
        // Load metadata from database cache on launch
        CoroutineScope(Dispatchers.IO).launch {
            loadCachedMetadata()
        }
    }

    suspend fun refreshDeals(force: Boolean = false) {
        _repoState.value = RepoState.Loading
        try {
            val response = apiService.fetchDealsData()

            // Filter out SHOW == NO items
            val visibleProducts = response.products.filter { it.isVisible }
            val visibleHero = response.hero.filter { it.isVisible }
            val visibleHeader = response.header.filter { it.isVisible }
            val visibleFooter = response.footer.filter { it.isVisible }

            // Get current favorite IDs so they are preserved
            val favIds = productDao.getFavoriteIds().toSet()

            val entities = visibleProducts.map { product ->
                val isFav = favIds.contains(product.stableId)
                ProductEntity.fromProduct(product, isFav = isFav)
            }

            productDao.clearNonFavorites()
            productDao.insertProducts(entities)

            _heroItems.value = visibleHero
            _headerCategories.value = visibleHeader
            _footerPages.value = visibleFooter

            // Save metadata to Room cache
            saveMetadataToCache(visibleHero, visibleHeader, visibleFooter)

            _repoState.value = RepoState.Success(isFromCache = false)
        } catch (e: Exception) {
            Log.e("DealsRepository", "Error refreshing deals from API", e)
            val hasCached = productDao.getFavoriteIds().isNotEmpty() || _heroItems.value.isNotEmpty()
            _repoState.value = RepoState.Error(
                message = e.localizedMessage ?: "Unable to connect to SAINIWALAA Deals server.",
                hasCachedData = hasCached
            )
        }
    }

    suspend fun toggleFavorite(product: Product) {
        val newFav = !product.isFavorite
        productDao.updateFavorite(product.stableId, newFav)
    }

    private suspend fun saveMetadataToCache(
        hero: List<HeroItem>,
        header: List<HeaderCategory>,
        footer: List<FooterItem>
    ) {
        try {
            val metaJson = JSONObject().apply {
                val heroArr = JSONArray()
                hero.forEach { h ->
                    heroArr.put(JSONObject().apply {
                        put("IMAGE", h.image ?: "")
                        put("COLOR CORD", h.colorCode ?: "")
                        put("TAXT", h.text ?: "")
                        put("LINK", h.link ?: "")
                        put("SHOW", h.show ?: "YES")
                    })
                }
                put("hero", heroArr)

                val headerArr = JSONArray()
                header.forEach { c ->
                    headerArr.put(JSONObject().apply {
                        put("CATEGORY", c.category ?: "")
                        put("TEXTINFO", c.textInfo ?: "")
                        put("PAGELINK", c.pageLink ?: "")
                        put("ICON", c.icon ?: "")
                        put("SHOW", c.show ?: "YES")
                    })
                }
                put("header", headerArr)

                val footerArr = JSONArray()
                footer.forEach { f ->
                    footerArr.put(JSONObject().apply {
                        put("PAGE NAME", f.pageName ?: "")
                        put("CONTENT", f.content ?: "")
                        put("SHOW", f.show ?: "YES")
                    })
                }
                put("footer", footerArr)
            }

            productDao.insertMetadata(
                CacheMetadataEntity(
                    key = "site_meta",
                    payloadJson = metaJson.toString()
                )
            )
        } catch (e: Exception) {
            Log.w("DealsRepository", "Failed to cache metadata", e)
        }
    }

    private suspend fun loadCachedMetadata() {
        try {
            val cached = productDao.getMetadata("site_meta") ?: return
            val obj = JSONObject(cached.payloadJson)

            val heroList = mutableListOf<HeroItem>()
            val heroArr = obj.optJSONArray("hero") ?: JSONArray()
            for (i in 0 until heroArr.length()) {
                val h = heroArr.optJSONObject(i) ?: continue
                heroList.add(
                    HeroItem(
                        image = h.optString("IMAGE"),
                        colorCode = h.optString("COLOR CORD"),
                        text = h.optString("TAXT"),
                        link = h.optString("LINK"),
                        show = h.optString("SHOW")
                    )
                )
            }
            if (heroList.isNotEmpty() && _heroItems.value.isEmpty()) {
                _heroItems.value = heroList
            }

            val headerList = mutableListOf<HeaderCategory>()
            val headerArr = obj.optJSONArray("header") ?: JSONArray()
            for (i in 0 until headerArr.length()) {
                val c = headerArr.optJSONObject(i) ?: continue
                headerList.add(
                    HeaderCategory(
                        category = c.optString("CATEGORY"),
                        textInfo = c.optString("TEXTINFO"),
                        pageLink = c.optString("PAGELINK"),
                        icon = c.optString("ICON"),
                        show = c.optString("SHOW")
                    )
                )
            }
            if (headerList.isNotEmpty() && _headerCategories.value.isEmpty()) {
                _headerCategories.value = headerList
            }

            val footerList = mutableListOf<FooterItem>()
            val footerArr = obj.optJSONArray("footer") ?: JSONArray()
            for (i in 0 until footerArr.length()) {
                val f = footerArr.optJSONObject(i) ?: continue
                footerList.add(
                    FooterItem(
                        pageName = f.optString("PAGE NAME"),
                        content = f.optString("CONTENT"),
                        show = f.optString("SHOW")
                    )
                )
            }
            if (footerList.isNotEmpty() && _footerPages.value.isEmpty()) {
                _footerPages.value = footerList
            }
        } catch (e: Exception) {
            Log.w("DealsRepository", "Failed to parse cached metadata", e)
        }
    }
}
