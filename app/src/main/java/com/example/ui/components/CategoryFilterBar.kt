package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.theme.BorderLight
import com.example.ui.theme.JaipurRose
import com.example.ui.theme.SaffronGold
import com.example.ui.theme.SaffronPrimary
import com.example.ui.theme.TextMuted
import com.example.ui.theme.TextPrimary

@Composable
fun CategoryFilterBar(
    categories: List<String>,
    selectedCategory: String,
    onCategorySelected: (String) -> Unit,
    onlyTopPicks: Boolean,
    onToggleTopPicks: () -> Unit,
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    Row(
        modifier = modifier
            .fillMaxWidth()
            .horizontalScroll(scrollState)
            .padding(horizontal = 16.dp, vertical = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Special "Top Picks" chip
        val isTopSelected = onlyTopPicks
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(20.dp))
                .background(if (isTopSelected) JaipurRose else Color.White)
                .border(
                    width = 1.dp,
                    color = if (isTopSelected) JaipurRose else BorderLight,
                    shape = RoundedCornerShape(20.dp)
                )
                .clickable(onClick = onToggleTopPicks)
                .padding(horizontal = 14.dp, vertical = 7.dp)
                .testTag("filter_top_picks"),
            contentAlignment = Alignment.Center
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = "Top Picks",
                    tint = if (isTopSelected) Color.White else SaffronGold,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "Top Picks",
                    color = if (isTopSelected) Color.White else TextPrimary,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        // Dynamic categories from Google Sheets
        categories.forEach { category ->
            val isSelected = !onlyTopPicks && selectedCategory.equals(category, ignoreCase = true)
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(if (isSelected) SaffronPrimary else Color.White)
                    .border(
                        width = 1.dp,
                        color = if (isSelected) SaffronPrimary else BorderLight,
                        shape = RoundedCornerShape(20.dp)
                    )
                    .clickable {
                        if (onlyTopPicks) onToggleTopPicks()
                        onCategorySelected(category)
                    }
                    .padding(horizontal = 14.dp, vertical = 7.dp)
                    .testTag("category_chip_${category.lowercase().replace(" ", "_")}"),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = category,
                    color = if (isSelected) Color.White else TextPrimary,
                    fontSize = 12.sp,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                )
            }
        }
    }
}
