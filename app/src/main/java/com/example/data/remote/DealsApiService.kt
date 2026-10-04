package com.example.data.remote

import android.util.Log
import com.example.model.DealsApiResponse
import com.example.model.FooterItem
import com.example.model.HeaderCategory
import com.example.model.HeroItem
import com.example.model.Product
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

class DealsApiService {
    private val client = OkHttpClient.Builder()
        .connectTimeout(20, TimeUnit.SECONDS)
        .readTimeout(25, TimeUnit.SECONDS)
        .followRedirects(true)
        .followSslRedirects(true)
        .build()

    private val apiEndpoint =
        "https://script.google.com/macros/s/AKfycbzA_hAO03gKPWIJ0UwhREB62hEbUusiyqZPO1_yrlmkGfOYsvnh46KZi3CC4rqANrzE/exec"

    suspend fun fetchDealsData(): DealsApiResponse = withContext(Dispatchers.IO) {
        val request = Request.Builder()
            .url(apiEndpoint)
            .header("User-Agent", "Mozilla/5.0 (Linux; Android) SAINIWALAA-Deals-App/1.0")
            .build()

        val response = client.newCall(request).execute()
        if (!response.isSuccessful) {
            throw Exception("API call failed with HTTP ${response.code}")
        }

        val bodyString = response.body?.string() ?: throw Exception("Empty response body from API")
        parseJsonResponse(bodyString)
    }

    fun parseJsonResponse(jsonString: String): DealsApiResponse {
        val root = JSONObject(jsonString)
        val success = root.optBoolean("success", true)

        // Parse Products
        val productsList = mutableListOf<Product>()
        val productsJson = root.optJSONArray("products") ?: JSONArray()
        for (i in 0 until productsJson.length()) {
            val pObj = productsJson.optJSONObject(i) ?: continue
            val product = Product(
                name = pObj.optString("NAME", "").trim().takeIf { it.isNotBlank() },
                link = pObj.optString("LINK", "").trim().takeIf { it.isNotBlank() },
                image = pObj.optString("IMAGE", "").trim().takeIf { it.isNotBlank() },
                market = pObj.optString("MARKET", "").trim().takeIf { it.isNotBlank() },
                priceRaw = if (pObj.has("PRICE")) pObj.get("PRICE") else null,
                mrpRaw = if (pObj.has("MRP")) pObj.get("MRP") else null,
                discountRaw = if (pObj.has("DISCOUNT")) pObj.get("DISCOUNT") else null,
                category = pObj.optString("CATEGORY", "").trim().takeIf { it.isNotBlank() },
                ratingRaw = if (pObj.has("RATING")) pObj.get("RATING") else null,
                badge = pObj.optString("BADGE", "").trim().takeIf { it.isNotBlank() },
                keywords = pObj.optString("KEYWORDS", "").trim().takeIf { it.isNotBlank() },
                description = pObj.optString("DESCRIPTION", "").trim().takeIf { it.isNotBlank() },
                top = pObj.optString("TOP", "").trim().takeIf { it.isNotBlank() },
                show = pObj.optString("SHOW", "").trim().takeIf { it.isNotBlank() },
                row = pObj.optInt("_ROW", i + 2)
            )
            productsList.add(product)
        }

        // Parse Hero
        val heroList = mutableListOf<HeroItem>()
        val heroJson = root.optJSONArray("hero") ?: JSONArray()
        for (i in 0 until heroJson.length()) {
            val hObj = heroJson.optJSONObject(i) ?: continue
            val item = HeroItem(
                image = hObj.optString("IMAGE", "").trim().takeIf { it.isNotBlank() },
                colorCode = hObj.optString("COLOR CORD", "").trim().takeIf { it.isNotBlank() },
                text = hObj.optString("TAXT", "").trim().takeIf { it.isNotBlank() },
                link = hObj.optString("LINK", "").trim().takeIf { it.isNotBlank() },
                show = hObj.optString("SHOW", "").trim().takeIf { it.isNotBlank() },
                row = hObj.optInt("_ROW", i + 2)
            )
            heroList.add(item)
        }

        // Parse Header
        val headerList = mutableListOf<HeaderCategory>()
        val headerJson = root.optJSONArray("header") ?: JSONArray()
        for (i in 0 until headerJson.length()) {
            val cObj = headerJson.optJSONObject(i) ?: continue
            val cat = HeaderCategory(
                category = cObj.optString("CATEGORY", "").trim().takeIf { it.isNotBlank() },
                textInfo = cObj.optString("TEXTINFO", "").trim().takeIf { it.isNotBlank() },
                pageLink = cObj.optString("PAGELINK", "").trim().takeIf { it.isNotBlank() },
                icon = cObj.optString("ICON", "").trim().takeIf { it.isNotBlank() },
                show = cObj.optString("SHOW", "").trim().takeIf { it.isNotBlank() },
                row = cObj.optInt("_ROW", i + 2)
            )
            headerList.add(cat)
        }

        // Parse Footer
        val footerList = mutableListOf<FooterItem>()
        val footerJson = root.optJSONArray("footer") ?: JSONArray()
        for (i in 0 until footerJson.length()) {
            val fObj = footerJson.optJSONObject(i) ?: continue
            val page = FooterItem(
                pageName = fObj.optString("PAGE NAME", "").trim().takeIf { it.isNotBlank() },
                content = fObj.optString("CONTENT", "").trim().takeIf { it.isNotBlank() },
                show = fObj.optString("SHOW", "").trim().takeIf { it.isNotBlank() },
                row = fObj.optInt("_ROW", i + 2)
            )
            footerList.add(page)
        }

        Log.d("DealsApiService", "Parsed ${productsList.size} products, ${heroList.size} hero items, ${headerList.size} categories")
        return DealsApiResponse(
            success = success,
            products = productsList,
            hero = heroList,
            header = headerList,
            footer = footerList
        )
    }
}
