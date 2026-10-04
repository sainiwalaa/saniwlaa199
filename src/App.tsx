import React, { useState } from 'react';
import { useDeals } from './hooks/useDeals';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { HeroSlider } from './components/HeroSlider';
import { DealSection } from './components/DealSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FooterModal } from './components/FooterModal';
import { Footer } from './components/Footer';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { EmptyState } from './components/EmptyState';
import { SortOption } from './types/deals';
import { getStableId } from './utils/productUtils';
import { ArrowUpDown, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const {
    isLoading,
    isRefreshing,
    error,
    refresh,
    allProducts,
    filteredProducts,
    trendingDeals,
    topPicks,
    bestDiscounts,
    heroItems,
    footerPages,
    categories,
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
    wishlist,
    toggleWishlist,
    selectedProduct,
    setSelectedProduct,
    selectedFooterPage,
    setSelectedFooterPage
  } = useDeals();

  const isFiltering =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'All' ||
    selectedMarket !== 'All' ||
    onlyTopPicks ||
    onlyWishlist;

  const sortOptions: { id: SortOption; label: string }[] = [
    { id: 'smart', label: 'Featured / Smart' },
    { id: 'discount-high', label: 'Highest Discount' },
    { id: 'price-low', label: 'Price: Low to High' },
    { id: 'price-high', label: 'Price: High to Low' },
    { id: 'rating-high', label: 'Customer Rating' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedMarket={selectedMarket}
        onMarketChange={setSelectedMarket}
        wishlistCount={wishlist.size}
        onlyWishlist={onlyWishlist}
        onToggleWishlist={() => setOnlyWishlist(!onlyWishlist)}
        isRefreshing={isRefreshing}
        onRefresh={refresh}
      />

      {/* Category Navigation Pills */}
      <CategoryNav
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        onlyTopPicks={onlyTopPicks}
        onToggleTopPicks={() => setOnlyTopPicks(!onlyTopPicks)}
      />

      {/* Error or Offline Banner */}
      {error && (
        <div style={{
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          borderBottom: '1px solid #FDE68A'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
          <button
            onClick={refresh}
            style={{ fontWeight: 700, textDecoration: 'underline', color: '#B45309' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : isFiltering ? (
          /* Active Search / Filter Results View */
          <div style={{ maxWidth: '1280px', margin: '20px auto', padding: '0 16px' }}>
            {/* Filter Status Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--color-border)'
            }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {onlyWishlist
                    ? `Saved Deals (${filteredProducts.length})`
                    : `${filteredProducts.length} Deals Found`}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {searchQuery && `Showing results for "${searchQuery}"`}
                  {selectedMarket !== 'All' && ` in ${selectedMarket}`}
                  {selectedCategory !== 'All' && ` • ${selectedCategory}`}
                </p>
              </div>

              {/* Sort Dropdown & Reset */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                  <ArrowUpDown size={15} color="#64748b" />
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={resetFilters}
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--color-jaipur-rose)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--color-jaipur-rose-light)'
                  }}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Products Grid or Empty State */}
            {filteredProducts.length === 0 ? (
              <EmptyState searchQuery={searchQuery} onReset={resetFilters} />
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product, idx) => {
                  const id = getStableId(product, idx);
                  return (
                    <ProductCard
                      key={id}
                      product={product}
                      index={idx}
                      onCardClick={() => setSelectedProduct(product)}
                      isWishlisted={wishlist.has(id)}
                      onToggleWishlist={() => toggleWishlist(id)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Standard Curated Marketplace Flow */
          <>
            {/* 1. Hero Banner Slider */}
            <HeroSlider
              heroItems={heroItems}
              onExploreClick={() => {
                const el = document.getElementById('explore-deals');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2. Trending Deals Shelf */}
            {trendingDeals.length > 0 && (
              <DealSection
                title="⚡ Trending Deals"
                subtitle="Most popular offers on Amazon, Flipkart & Meesho right now"
                products={trendingDeals}
                onProductClick={setSelectedProduct}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
              />
            )}

            {/* 3. Top Picks Shelf */}
            {topPicks.length > 0 && (
              <DealSection
                title="👑 Top Picks For You"
                subtitle="Handpicked verified high-value deals"
                products={topPicks}
                onProductClick={setSelectedProduct}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
                onViewAllClick={() => setOnlyTopPicks(true)}
              />
            )}

            {/* 4. Best Discounts Shelf */}
            {bestDiscounts.length > 0 && (
              <DealSection
                title="🔥 Mega Discounts (40%+ Off)"
                subtitle="Unbeatable price drops verified across partners"
                products={bestDiscounts}
                onProductClick={setSelectedProduct}
                wishlist={wishlist}
                onToggleWishlist={toggleWishlist}
              />
            )}

            {/* 5. Main Product Discovery Grid */}
            <div id="explore-deals" style={{ maxWidth: '1280px', margin: '30px auto 20px', padding: '0 16px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    🛍️ Explore All Deals
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Ranked by smart algorithm, popularity &amp; discount
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowUpDown size={14} color="#64748b" />
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="products-grid">
                {filteredProducts.map((product, idx) => {
                  const id = getStableId(product, idx);
                  return (
                    <ProductCard
                      key={id}
                      product={product}
                      index={idx}
                      onCardClick={() => setSelectedProduct(product)}
                      isWishlisted={wishlist.has(id)}
                      onToggleWishlist={() => toggleWishlist(id)}
                    />
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlist.has(getStableId(selectedProduct, 0)) : false}
        onToggleWishlist={() => {
          if (selectedProduct) toggleWishlist(getStableId(selectedProduct, 0));
        }}
      />

      {/* Legal & About Footer Page Modal */}
      <FooterModal
        page={selectedFooterPage}
        onClose={() => setSelectedFooterPage(null)}
      />

      {/* Footer */}
      <Footer
        footerPages={footerPages}
        onSelectPage={setSelectedFooterPage}
      />
    </div>
  );
};
