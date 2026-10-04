import React from 'react';
import { Product } from '../types/deals';
import { ProductCard } from './ProductCard';
import { getStableId } from '../utils/productUtils';
import { ArrowRight } from 'lucide-react';

interface DealSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  onProductClick: (p: Product) => void;
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
  onViewAllClick?: () => void;
}

export const DealSection: React.FC<DealSectionProps> = ({
  title,
  subtitle,
  products,
  onProductClick,
  wishlist,
  onToggleWishlist,
  onViewAllClick
}) => {
  if (products.length === 0) return null;

  return (
    <section style={{ maxWidth: '1280px', margin: '24px auto', padding: '0 16px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
            {title}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            {subtitle}
          </p>
        </div>

        {onViewAllClick && (
          <button
            onClick={onViewAllClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--color-saffron-dark)'
            }}
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Horizontal Scroll Shelf */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}
        className="no-scrollbar"
      >
        {products.map((product, idx) => {
          const id = getStableId(product, idx);
          return (
            <div key={id} style={{ minWidth: '180px', maxWidth: '200px', flexShrink: 0 }}>
              <ProductCard
                product={product}
                index={idx}
                onCardClick={() => onProductClick(product)}
                isWishlisted={wishlist.has(id)}
                onToggleWishlist={() => onToggleWishlist(id)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};
