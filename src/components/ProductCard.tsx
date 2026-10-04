import React from 'react';
import { Product } from '../types/deals';
import {
  formatMrp,
  formatPrice,
  getDiscountPercentage,
  getParsedRating,
  getStableId,
  isTopPick
} from '../utils/productUtils';
import { Star, Heart, ExternalLink, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  index: number;
  onCardClick: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onCardClick,
  isWishlisted,
  onToggleWishlist
}) => {
  const market = product.MARKET || 'Online';
  const priceStr = formatPrice(product);
  const mrpStr = formatMrp(product);
  const discount = getDiscountPercentage(product);
  const rating = getParsedRating(product);
  const top = isTopPick(product);

  const getMarketColor = (m: string) => {
    const lower = m.toLowerCase();
    if (lower.includes('amazon')) return '#FF9900';
    if (lower.includes('flipkart')) return '#2874F0';
    if (lower.includes('meesho')) return '#8B2875';
    return '#F59E0B';
  };

  return (
    <div
      className="product-card-hover"
      onClick={onCardClick}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      {/* Image Container with Badges */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1 / 1',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {product.IMAGE ? (
          <img
            src={product.IMAGE}
            alt={product.NAME || 'Product'}
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }}
            loading="lazy"
            onError={(e) => {
              // Hide broken image and fallback to placeholder
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div style={{ color: '#cbd5e1', fontWeight: 800, fontSize: '1.5rem' }}>
            DEAL
          </div>
        )}

        {/* Marketplace Tag (Top Left) */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: getMarketColor(market),
          color: '#ffffff',
          fontSize: '0.65rem',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {market}
        </div>

        {/* TOP PICK Badge (Bottom Left) */}
        {top && (
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            background: 'linear-gradient(90deg, #F59E0B, #E11D48)',
            color: '#ffffff',
            fontSize: '0.65rem',
            fontWeight: 800,
            padding: '2px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
          }}>
            <Sparkles size={10} /> TOP PICK
          </div>
        )}

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist();
          }}
          title="Save to Wishlist"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <Heart
            size={16}
            fill={isWishlisted ? '#E11D48' : 'none'}
            color={isWishlisted ? '#E11D48' : '#64748b'}
          />
        </button>
      </div>

      {/* Card Content */}
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Rating and Custom Sheet Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: '#FEF3C7',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--color-text-main)'
          }}>
            <Star size={11} fill="#F59E0B" color="#F59E0B" />
            <span>{rating.toFixed(1)}</span>
          </div>

          {product.BADGE && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--color-jaipur-rose)',
              backgroundColor: 'var(--color-jaipur-rose-light)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {product.BADGE.toUpperCase()}
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--color-text-main)',
          lineHeight: '1.3',
          height: '2.6em',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          marginBottom: '8px'
        }}>
          {product.NAME || 'Untitled Product'}
        </h3>

        {/* Price and MRP Row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: 'auto', marginBottom: '4px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
            {priceStr}
          </span>
          {mrpStr && (
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-light)',
              textDecoration: 'line-through'
            }}>
              {mrpStr}
            </span>
          )}
        </div>

        {/* Discount Pill */}
        {discount > 0 && (
          <div style={{ marginBottom: '10px' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              backgroundColor: 'var(--color-discount-green-bg)',
              color: 'var(--color-discount-green)',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Buy Now Button - Direct External Link */}
        <a
          href={product.LINK || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            height: '34px',
            backgroundColor: 'var(--color-saffron)',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            transition: 'background-color 0.15s ease',
            textDecoration: 'none'
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.backgroundColor = 'var(--color-saffron-dark)')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.backgroundColor = 'var(--color-saffron)')}
        >
          <span>Buy Now</span>
          <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
};
