import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  searchQuery: string;
  onReset: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery, onReset }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '48px 16px',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        color: '#94a3b8'
      }}>
        <SearchX size={32} />
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
        No deals found
      </h3>

      <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
        {searchQuery ? (
          <>No products matched "<strong>{searchQuery}</strong>". Try another keyword or reset filters.</>
        ) : (
          'No products currently match your selected filters.'
        )}
      </p>

      <button
        onClick={onReset}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--color-saffron)',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '10px',
          fontSize: '0.9rem',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
        }}
      >
        <RotateCcw size={16} />
        <span>Reset All Filters</span>
      </button>
    </div>
  );
};
