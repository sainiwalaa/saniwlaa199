import { useState, useEffect, useMemo, useCallback } from 'react';
import { ApiResponse, FooterItem, HeaderCategory, HeroItem, Product, SortOption } from '../types/deals';
import { fetchDealsApi } from '../services/apiService';
import {
  getCachedApiResponse,
  getWishlistIds,
  saveWishlistIds
} from '../services/cacheService';
import { filterAndRankProducts } from '../services/rankingService';
import { getCategories, getDiscountPercentage, isTopPick, isVisible } from '../utils/productUtils';

export function useDeals() {
  // Read cache immediately for instant first paint
  const initialCache = getCachedApiResponse();

  const [apiData, setApiData] = useState<ApiResponse | null>(initialCache);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCache);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMarket, setSelectedMarket] = useState('All');
  const [sortOption, setSortOption] = useState<SortOption>('smart');
  const [onlyTopPicks, setOnlyTopPicks] = useState(false);
  const [onlyWishlist, setOnlyWishlist] = useState(false);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFooterPage, setSelectedFooterPage] = useState<FooterItem | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<Set<string>>(() => getWishlistIds());

  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveWishlistIds(next);
      return next;
    });
  }, []);

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else if (!initialCache) setIsLoading(true);

    try {
      const data = await fetchDealsApi(2);
      setApiData(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load deals data:', err);
      setError(err?.message || 'Unable to connect to SAINIWALAA Deals server.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [initialCache]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Raw visible lists
  const allProducts = useMemo(() => {
    return (apiData?.products || []).filter(isVisible);
  }, [apiData]);

  const heroItems = useMemo(() => {
    return (apiData?.hero || []).filter(h => String(h.SHOW).toUpperCase() !== 'NO');
  }, [apiData]);

  const headerCategories = useMemo(() => {
    return (apiData?.header || []).filter(c => String(c.SHOW).toUpperCase() !== 'NO');
  }, [apiData]);

  const footerPages = useMemo(() => {
    return (apiData?.footer || []).filter(f => String(f.SHOW).toUpperCase() !== 'NO');
  }, [apiData]);

  // Dynamic unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    headerCategories.forEach(h => {
      if (h.CATEGORY?.trim()) set.add(h.CATEGORY.trim());
    });
    allProducts.forEach(p => {
      getCategories(p).forEach(c => set.add(c));
    });
    return ['All', ...Array.from(set).sort()];
  }, [headerCategories, allProducts]);

  // Filtered & Ranked Products
  const filteredProducts = useMemo(() => {
    return filterAndRankProducts(
      allProducts,
      searchQuery,
      selectedCategory,
      selectedMarket,
      sortOption,
      onlyTopPicks,
      wishlist,
      onlyWishlist
    );
  }, [
    allProducts,
    searchQuery,
    selectedCategory,
    selectedMarket,
    sortOption,
    onlyTopPicks,
    wishlist,
    onlyWishlist
  ]);

  // Curated Deal Sections
  const trendingDeals = useMemo(() => {
    return allProducts
      .filter(p => (p.BADGE && p.BADGE.trim()) || getDiscountPercentage(p) >= 30)
      .sort((a, b) => getDiscountPercentage(b) - getDiscountPercentage(a))
      .slice(0, 10);
  }, [allProducts]);

  const topPicks = useMemo(() => {
    return allProducts.filter(isTopPick).slice(0, 10);
  }, [allProducts]);

  const bestDiscounts = useMemo(() => {
    return allProducts
      .filter(p => getDiscountPercentage(p) >= 40)
      .sort((a, b) => getDiscountPercentage(b) - getDiscountPercentage(a))
      .slice(0, 10);
  }, [allProducts]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedMarket('All');
    setSortOption('smart');
    setOnlyTopPicks(false);
    setOnlyWishlist(false);
  }, []);

  return {
    isLoading,
    isRefreshing,
    error,
    refresh: () => loadData(true),
    allProducts,
    filteredProducts,
    trendingDeals,
    topPicks,
    bestDiscounts,
    heroItems,
    headerCategories,
    footerPages,
    categories,
    // Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedMarket,
    setSelectedMarket,
    sortOption,
    setSortOption,
    onlyTopPicks,
    setOnlyTopPicks,
    onlyWishlist,
    setOnlyWishlist,
    resetFilters,
    // Wishlist
    wishlist,
    toggleWishlist,
    // Modals
    selectedProduct,
    setSelectedProduct,
    selectedFooterPage,
    setSelectedFooterPage
  };
}
