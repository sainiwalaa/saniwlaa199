package com.example.data.local

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.model.Product
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "cached_products")
data class ProductEntity(
    @PrimaryKey val id: String,
    val name: String,
    val link: String,
    val image: String,
    val market: String,
    val priceRaw: String,
    val mrpRaw: String,
    val discountRaw: String,
    val category: String,
    val ratingRaw: String,
    val badge: String,
    val keywords: String,
    val description: String,
    val top: String,
    val show: String,
    val row: Int,
    val isFavorite: Boolean = false,
    val cachedAt: Long = System.currentTimeMillis()
) {
    fun toProduct(): Product {
        return Product(
            name = name,
            link = link,
            image = image,
            market = market,
            priceRaw = priceRaw,
            mrpRaw = mrpRaw,
            discountRaw = discountRaw,
            category = category,
            ratingRaw = ratingRaw,
            badge = badge,
            keywords = keywords,
            description = description,
            top = top,
            show = show,
            row = row,
            isFavorite = isFavorite
        )
    }

    companion object {
        fun fromProduct(product: Product, isFav: Boolean = false): ProductEntity {
            return ProductEntity(
                id = product.stableId,
                name = product.name ?: "",
                link = product.link ?: "",
                image = product.image ?: "",
                market = product.market ?: "",
                priceRaw = product.priceRaw?.toString() ?: "",
                mrpRaw = product.mrpRaw?.toString() ?: "",
                discountRaw = product.discountRaw?.toString() ?: "",
                category = product.category ?: "",
                ratingRaw = product.ratingRaw?.toString() ?: "",
                badge = product.badge ?: "",
                keywords = product.keywords ?: "",
                description = product.description ?: "",
                top = product.top ?: "",
                show = product.show ?: "YES",
                row = product.row ?: 0,
                isFavorite = isFav
            )
        }
    }
}

@Entity(tableName = "app_cache_metadata")
data class CacheMetadataEntity(
    @PrimaryKey val key: String,
    val payloadJson: String,
    val timestamp: Long = System.currentTimeMillis()
)

@Dao
interface ProductDao {
    @Query("SELECT * FROM cached_products ORDER BY row ASC")
    fun getAllProductsFlow(): Flow<List<ProductEntity>>

    @Query("SELECT * FROM cached_products WHERE isFavorite = 1")
    fun getFavoriteProductsFlow(): Flow<List<ProductEntity>>

    @Query("SELECT id FROM cached_products WHERE isFavorite = 1")
    suspend fun getFavoriteIds(): List<String>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProducts(products: List<ProductEntity>)

    @Query("UPDATE cached_products SET isFavorite = :isFav WHERE id = :id")
    suspend fun updateFavorite(id: String, isFav: Boolean)

    @Query("DELETE FROM cached_products WHERE isFavorite = 0")
    suspend fun clearNonFavorites()

    @Query("SELECT * FROM app_cache_metadata WHERE key = :key LIMIT 1")
    suspend fun getMetadata(key: String): CacheMetadataEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMetadata(metadata: CacheMetadataEntity)
}

@Database(
    entities = [ProductEntity::class, CacheMetadataEntity::class],
    version = 1,
    exportSchema = false
)
abstract class DealsDatabase : RoomDatabase() {
    abstract fun productDao(): ProductDao

    companion object {
        @Volatile
        private var INSTANCE: DealsDatabase? = null

        fun getDatabase(context: Context): DealsDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    DealsDatabase::class.java,
                    "sainiwalaa_deals_db"
                ).fallbackToDestructiveMigration().build()
                INSTANCE = instance
                instance
            }
        }
    }
}
