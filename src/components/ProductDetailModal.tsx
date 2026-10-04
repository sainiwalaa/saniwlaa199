import React, { useEffect } from 'react';
import { Product } from '../types/deals';
import {
  formatMrp,
  formatPrice,
  getCategories,
  getDiscountPercentage,
  getParsedMrp,
  getParsedPrice,
  getParsedRating,
  isTopPick
} from '../utils/productUtils';
import { X, Star, Heart, Share2, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const market = product.MARKET || 'Online';
  const priceStr = formatPrice(product);
  const mrpStr = formatMrp(product);
  const discount = getDiscountPercentage(product);
  const rating = getParsedRating(product);
  const top = isTopPick(product);
  const cats = getCategories(product);

  const price = getParsedPrice(product);
  const mrp = getParsedMrp(product);
  const savings = price !== null && mrp !== null && mrp > price ? mrp - price : null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.NAME || 'Great Deal on SAINIWALAA Deals',
        text: `Check out this deal: ${product.NAME} at ${priceStr}!`,
        url: product.LINK || window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(product.LINK || window.location.href);
      alert('Deal link copied to clipboard!');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 17, 26, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
      >
        {/* Top Sticky Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          backgroundColor: '#ffffff',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              Verified Listing
            </span>
            {top && (
              <span style={{
                background: 'linear-gradient(90deg, #F59E0B, #E11D48)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Sparkles size={11} /> TOP PICK
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleShare}
              title="Share Deal"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569'
              }}
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={onToggleWishlist}
              title="Save to Wishlist"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isWishlisted ? '#E11D48' : '#475569'
              }}
            >
              <Heart size={16} fill={isWishlisted ? '#E11D48' : 'none'} />
            </button>
            <button
              onClick={onClose}
              title="Close"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px' }}>
          {/* Large Image Box */}
          <div style={{
            width: '100%',
            aspectRatio: '4 / 3',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            {product.IMAGE ? (
              <img
                src={product.IMAGE}
                alt={product.NAME || 'Product'}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '16px' }}
              />
            ) : (
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#cbd5e1' }}>DEAL</span>
            )}
          </div>

          {/* Marketplace & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#0F111A',
              color: '#ffffff',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              {market}
            </span>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#FEF3C7',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              <Star size={12} fill="#F59E0B" color="#F59E0B" />
              <span>{rating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '14px' }}>
            {product.NAME || 'Untitled Product'}
          </h2>

          {/* Pricing Row */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '10px',
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              {priceStr}
            </span>
            {mrpStr && (
              <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                {mrpStr}
              </span>
            )}
            {discount > 0 && (
              <span style={{
                backgroundColor: 'var(--color-discount-green-bg)',
                color: 'var(--color-discount-green)',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '4px 8px',
                borderRadius: '6px',
                marginLeft: 'auto'
              }}>
                {discount}% OFF
              </span>
            )}
          </div>

          {savings !== null && (
            <div style={{ color: 'var(--color-discount-green)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '16px' }}>
              🎉 You save ₹{savings.toLocaleString('en-IN')} on this deal!
            </div>
          )}

          {/* Category Tags */}
          {cats.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {cats.map((c, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '20px'
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {product.DESCRIPTION && product.DESCRIPTION !== '...' && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '6px' }}>About this item</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                {product.DESCRIPTION}
              </p>
            </div>
          )}

          {/* Safety & Store Link Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor: '#f8fafc',
            border: '1px solid var(--color-border)',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <ShieldCheck size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
              This link directs to the verified product page on {market}. Always check current prices, customer reviews, seller ratings, and delivery terms before final purchase.
            </div>
          </div>

          {/* Big Buy Now Button */}
          <a
            href={product.LINK || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              height: '48px',
              backgroundColor: 'var(--color-saffron)',
              color: '#ffffff',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
              textDecoration: 'none'
            }}
          >
            <span>Buy Now on {market}</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};
