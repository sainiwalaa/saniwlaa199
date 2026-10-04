package com.example.model

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass
import java.util.Locale

@JsonClass(generateAdapter = false)
data class Product(
    @Json(name = "NAME") val name: String? = null,
    @Json(name = "LINK") val link: String? = null,
    @Json(name = "IMAGE") val image: String? = null,
    @Json(name = "MARKET") val market: String? = null,
    @Json(name = "PRICE") val priceRaw: Any? = null,
    @Json(name = "MRP") val mrpRaw: Any? = null,
    @Json(name = "DISCOUNT") val discountRaw: Any? = null,
    @Json(name = "CATEGORY") val category: String? = null,
    @Json(name = "RATING") val ratingRaw: Any? = null,
    @Json(name = "BADGE") val badge: String? = null,
    @Json(name = "KEYWORDS") val keywords: String? = null,
    @Json(name = "DESCRIPTION") val description: String? = null,
    @Json(name = "TOP") val top: String? = null,
    @Json(name = "SHOW") val show: String? = null,
    @Json(name = "_ROW") val row: Int? = null,
    val isFavorite: Boolean = false
) {
    val stableId: String
        get() = "${row ?: 0}_${(name ?: "").take(20).hashCode()}_${(link ?: "").take(20).hashCode()}"

    val isVisible: Boolean
        get() = !show.equals("NO", ignoreCase = true)

    val isTopPick: Boolean
        get() = top.equals("YES", ignoreCase = true)

    val parsedPrice: Double?
        get() = parseNumber(priceRaw)

    val parsedMrp: Double?
        get() = parseNumber(mrpRaw)

    val parsedRating: Float
        get() {
            val num = parseNumber(ratingRaw) ?: 4.2
            return num.toFloat().coerceIn(1.0f, 5.0f)
        }

    val discountPercentage: Int
        get() {
            val disc = parseNumber(discountRaw)
            if (disc != null) {
                return if (disc <= 1.0 && disc > 0.0) {
                    (disc * 100).toInt()
                } else {
                    disc.toInt()
                }
            }
            val p = parsedPrice
            val m = parsedMrp
            if (p != null && m != null && m > p && m > 0) {
                return (((m - p) / m) * 100).toInt()
            }
            return 0
        }

    val formattedPrice: String
        get() {
            val p = parsedPrice
            return if (p != null) {
                if (p % 1.0 == 0.0) "₹${p.toLong()}" else "₹${String.format(Locale.ENGLISH, "%.2f", p)}"
            } else {
                priceRaw?.toString()?.takeIf { it.isNotBlank() }?.let { if (it.startsWith("₹")) it else "₹$it" } ?: "Check Deal"
            }
        }

    val formattedMrp: String?
        get() {
            val m = parsedMrp
            return if (m != null && (parsedPrice == null || m > parsedPrice!!)) {
                if (m % 1.0 == 0.0) "₹${m.toLong()}" else "₹${String.format(Locale.ENGLISH, "%.2f", m)}"
            } else null
        }

    val categoriesList: List<String>
        get() {
            if (category.isNullOrBlank()) return emptyList()
            return category.split(Regex("[|,>/\\\\]"))
                .map { it.trim() }
                .filter { it.isNotBlank() }
        }

    private fun parseNumber(raw: Any?): Double? {
        if (raw == null) return null
        return when (raw) {
            is Number -> raw.toDouble()
            is String -> {
                val cleaned = raw.replace("₹", "").replace(",", "").replace("%", "").trim()
                cleaned.toDoubleOrNull()
            }
            else -> null
        }
    }
}

@JsonClass(generateAdapter = false)
data class HeroItem(
    @Json(name = "IMAGE") val image: String? = null,
    @Json(name = "COLOR CORD") val colorCode: String? = null,
    @Json(name = "TAXT") val text: String? = null,
    @Json(name = "LINK") val link: String? = null,
    @Json(name = "SHOW") val show: String? = null,
    @Json(name = "_ROW") val row: Int? = null
) {
    val isVisible: Boolean
        get() = !show.equals("NO", ignoreCase = true)
}

@JsonClass(generateAdapter = false)
data class HeaderCategory(
    @Json(name = "CATEGORY") val category: String? = null,
    @Json(name = "TEXTINFO") val textInfo: String? = null,
    @Json(name = "PAGELINK") val pageLink: String? = null,
    @Json(name = "ICON") val icon: String? = null,
    @Json(name = "SHOW") val show: String? = null,
    @Json(name = "_ROW") val row: Int? = null
) {
    val isVisible: Boolean
        get() = !show.equals("NO", ignoreCase = true)
}

@JsonClass(generateAdapter = false)
data class FooterItem(
    @Json(name = "PAGE NAME") val pageName: String? = null,
    @Json(name = "CONTENT") val content: String? = null,
    @Json(name = "SHOW") val show: String? = null,
    @Json(name = "_ROW") val row: Int? = null
) {
    val isVisible: Boolean
        get() = !show.equals("NO", ignoreCase = true)
}

data class DealsApiResponse(
    val success: Boolean = true,
    val products: List<Product> = emptyList(),
    val hero: List<HeroItem> = emptyList(),
    val header: List<HeaderCategory> = emptyList(),
    val footer: List<FooterItem> = emptyList()
)
