import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
      {/* Hero Banner Skeleton */}
      <div
        className="skeleton-shimmer"
        style={{
          width: '100%',
          aspectRatio: '16 / 7',
          borderRadius: '16px',
          marginBottom: '24px',
          minHeight: '180px'
        }}
      />

      {/* Category Pills Skeleton */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'hidden' }}>
        {[80, 110, 95, 120, 90].map((w, idx) => (
          <div
            key={idx}
            className="skeleton-shimmer"
            style={{
              width: `${w}px`,
              height: '34px',
              borderRadius: '20px',
              flexShrink: 0
            }}
          />
        ))}
      </div>

      {/* Grid of Product Skeletons */}
      <div className="products-grid">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              padding: '12px',
              border: '1px solid var(--color-border)'
            }}
          >
            <div
              className="skeleton-shimmer"
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                borderRadius: '10px',
                marginBottom: '12px'
              }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: '50%', height: '14px', borderRadius: '4px', marginBottom: '8px' }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: '90%', height: '16px', borderRadius: '4px', marginBottom: '12px' }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: '40%', height: '18px', borderRadius: '4px', marginBottom: '14px' }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: '100%', height: '34px', borderRadius: '8px' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
