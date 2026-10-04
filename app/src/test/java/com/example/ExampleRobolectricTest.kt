package com.example

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.example.model.Product
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [36])
class ExampleRobolectricTest {

    @Test
    fun `read app name from context`() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        val appName = context.getString(R.string.app_name)
        assertEquals("SAINIWALAA Deals", appName)
    }

    @Test
    fun `product discount calculation with ratio`() {
        val product = Product(
            name = "Test Kurti",
            priceRaw = 499,
            mrpRaw = 999,
            discountRaw = 0.5,
            top = "YES"
        )
        assertEquals(50, product.discountPercentage)
        assertEquals("₹499", product.formattedPrice)
        assertEquals("₹999", product.formattedMrp)
        assertTrue(product.isTopPick)
    }

    @Test
    fun `product categories parsing with delimiters`() {
        val product = Product(
            name = "Test Saree",
            category = "Fashion | Women > Ethnic Wear, Sarees"
        )
        val cats = product.categoriesList
        assertTrue(cats.contains("Fashion"))
        assertTrue(cats.contains("Women"))
        assertTrue(cats.contains("Ethnic Wear"))
        assertTrue(cats.contains("Sarees"))
    }
}
