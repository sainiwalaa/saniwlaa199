import { Product, SortOption } from '../types/deals';
import {
  getCategories,
  getDiscountPercentage,
  getParsedPrice,
  getParsedRating,
  isTopPick,
  isVisible
} from '../utils/productUtils';

export function filterAndRankProducts(
  products: Product[],
  searchQuery: string,
  selectedCategory: string,
  selectedMarket: string,
  sortOption: SortOption,
  onlyTopPicks: boolean,
  wishlistIds?: Set<string>,
  onlyWishlist?: boolean
): Product[] {
  const normQuery = searchQuery.trim().toLowerCase();
  const queryTokens = normQuery.split(/\s+/).filter(Boolean);

  // 1. Initial Filtering
  const filtered = products.filter((product, idx) => {
    if (!isVisible(product)) return false;

    if (onlyWishlist && wishlistIds) {
      const stableId = `${product._ROW || idx}_${(product.NAME || '').slice(0, 15)}`;
      // Check if item is in wishlist
      let found = false;
      for (const id of wishlistIds) {
        if (id.includes(String(product._ROW || idx))) {
          found = true;
          break;
        }
      }
      if (!found) return false;
    }

    if (onlyTopPicks && !isTopPick(product)) return false;

    // Marketplace filter
    if (selectedMarket !== 'All') {
      const market = (product.MARKET || '').trim().toLowerCase();
      if (!market.includes(selectedMarket.toLowerCase())) return false;
    }

    // Category filter
    if (selectedCategory !== 'All') {
      const cats = getCategories(product).map(c => c.toLowerCase());
      const catField = (product.CATEGORY || '').toLowerCase();
      const target = selectedCategory.toLowerCase();
      const matched = cats.some(c => c.includes(target) || target.includes(c)) || catField.includes(target);
      if (!matched) return false;
    }

    // Search query matching
    if (queryTokens.length > 0) {
      const name = (product.NAME || '').toLowerCase();
      const keywords = (product.KEYWORDS || '').toLowerCase();
      const desc = (product.DESCRIPTION || '').toLowerCase();
      const cat = (product.CATEGORY || '').toLowerCase();
      const market = (product.MARKET || '').toLowerCase();
      const badge = (product.BADGE || '').toLowerCase();

      const matchesAllTokens = queryTokens.every(
        token =>
          name.includes(token) ||
          keywords.includes(token) ||
          desc.includes(token) ||
          cat.includes(token) ||
          market.includes(token) ||
          badge.includes(token)
      );

      if (!matchesAllTokens) return false;
    }

    return true;
  });

  // 2. Sorting / Ranking
  switch (sortOption) {
    case 'discount-high':
      return [...filtered].sort((a, b) => getDiscountPercentage(b) - getDiscountPercentage(a));

    case 'price-low':
      return [...filtered].sort((a, b) => {
        const pa = getParsedPrice(a) ?? Infinity;
        const pb = getParsedPrice(b) ?? Infinity;
        return pa - pb;
      });

    case 'price-high':
      return [...filtered].sort((a, b) => {
        const pa = getParsedPrice(a) ?? -Infinity;
        const pb = getParsedPrice(b) ?? -Infinity;
        return pb - pa;
      });

    case 'rating-high':
      return [...filtered].sort((a, b) => getParsedRating(b) - getParsedRating(a));

    case 'smart':
    default:
      return [...filtered].sort((a, b) => {
        const scoreB = computeSmartScore(b, normQuery, queryTokens);
        const scoreA = computeSmartScore(a, normQuery, queryTokens);
        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }
        return (a._ROW || 0) - (b._ROW || 0);
      });
  }
}

function computeSmartScore(product: Product, query: string, tokens: string[]): number {
  let score = 0;
  const name = (product.NAME || '').toLowerCase();
  const keywords = (product.KEYWORDS || '').toLowerCase();
  const desc = (product.DESCRIPTION || '').toLowerCase();
  const cat = (product.CATEGORY || '').toLowerCase();

  // Search relevance
  if (query.length > 0) {
    if (name === query) score += 1000;
    else if (name.startsWith(query)) score += 500;
    else if (name.includes(query)) score += 300;

    for (const token of tokens) {
      if (name.includes(token)) score += 150;
      if (keywords.includes(token)) score += 100;
      if (cat.includes(token)) score += 80;
      if (desc.includes(token)) score += 30;
    }
  }

  // TOP status boost
  if (isTopPick(product)) {
    score += 200;
  }

  // Discount boost
  const discount = getDiscountPercentage(product);
  score += discount * 1.5;

  // Rating boost
  const rating = getParsedRating(product);
  score += rating * 15;

  // Badge presence boost
  if (product.BADGE && product.BADGE.trim()) {
    score += 50;
  }

  // Completeness (image, description)
  if (product.IMAGE && product.IMAGE.trim()) {
    score += 20;
  }

  return score;
}
