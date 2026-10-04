import React, { useRef } from 'react';
import { Search, X, Heart, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedMarket: string;
  onMarketChange: (m: string) => void;
  wishlistCount: number;
  onlyWishlist: boolean;
  onToggleWishlist: () => void;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedMarket,
  onMarketChange,
  wishlistCount,
  onlyWishlist,
  onToggleWishlist,
  isRefreshing,
  onRefresh
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const markets = [
    { id: 'All', label: 'All Deals', color: '#F59E0B' },
    { id: 'Amazon', label: 'Amazon', color: '#FF9900' },
    { id: 'Flipkart', label: 'Flipkart', color: '#2874F0' },
    { id: 'Meesho', label: 'Meesho', color: '#8B2875' }
  ];

  return (
    <header style={{ backgroundColor: 'var(--color-navy-dark)', color: '#ffffff', position: 'sticky', top: 0, zIndex: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
      {/* Top Banner Accent */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #F59E0B, #E11D48, #F59E0B)' }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 16px 8px' }}>
        {/* Top Branding Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '10px' }}>
          {/* Logo & Taglines */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => onSearchChange('')}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #F59E0B, #E11D48)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
            }}>
              <ShoppingBag size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-saffron-gold)', letterSpacing: '0.5px' }}>
                  SAINIWALAA
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px' }}>
                  DEALS
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: '#E11D48',
                  color: '#ffffff',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  marginLeft: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  <Sparkles size={10} /> VERIFIED
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 500 }}>
                Best Deals, Smart Shopping
              </div>
            </div>
          </div>

          {/* Action Buttons: Wishlist & Refresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onToggleWishlist}
              title="Saved Wishlist"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: onlyWishlist ? '#E11D48' : 'var(--color-navy-surface)',
                color: '#ffffff',
                transition: 'all 0.2s ease'
              }}
            >
              <Heart size={18} fill={onlyWishlist ? '#ffffff' : 'none'} color={onlyWishlist ? '#ffffff' : '#f8fafc'} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#F59E0B',
                  color: '#0f111a',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Deals from Google Sheets"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-navy-surface)',
                color: '#ffffff',
                cursor: isRefreshing ? 'wait' : 'pointer'
              }}
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Real Marketplace Search Input */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <div style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={18} color="#F59E0B" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Kurti, Shoes, Mobiles, Amazon, Meesho, Cotton..."
            style={{
              width: '100%',
              height: '44px',
              padding: '0 40px 0 42px',
              borderRadius: '12px',
              border: '1px solid #334155',
              backgroundColor: 'var(--color-navy-surface)',
              color: '#ffffff',
              fontSize: '0.9rem',
              outline: 'none',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#F59E0B')}
            onBlur={(e) => (e.target.style.borderColor = '#334155')}
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                searchInputRef.current?.focus();
              }}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Marketplace Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }} className="no-scrollbar">
          {markets.map(m => {
            const isSelected = selectedMarket.toLowerCase() === m.id.toLowerCase();
            return (
              <button
                key={m.id}
                onClick={() => onMarketChange(m.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 700 : 500,
                  whiteSpace: 'nowrap',
                  backgroundColor: isSelected ? m.color : 'var(--color-navy-elevated)',
                  color: '#ffffff',
                  border: isSelected ? '1px solid rgba(255,255,255,0.4)' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
