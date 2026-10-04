import React from 'react';
import { Crown } from 'lucide-react';

interface CategoryNavProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onlyTopPicks: boolean;
  onToggleTopPicks: () => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onlyTopPicks,
  onToggleTopPicks
}) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--color-border)',
      padding: '8px 16px',
      position: 'sticky',
      top: '125px',
      zIndex: 30,
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto'
      }} className="no-scrollbar">
        {/* Top Picks Special Chip */}
        <button
          onClick={onToggleTopPicks}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            backgroundColor: onlyTopPicks ? 'var(--color-jaipur-rose)' : '#fff',
            color: onlyTopPicks ? '#fff' : 'var(--color-text-main)',
            border: `1px solid ${onlyTopPicks ? 'var(--color-jaipur-rose)' : 'var(--color-border)'}`,
            transition: 'all 0.15s ease'
          }}
        >
          <Crown size={14} color={onlyTopPicks ? '#fff' : 'var(--color-saffron)'} />
          <span>Top Picks</span>
        </button>

        {/* Dynamic Categories from Google Sheets */}
        {categories.map(category => {
          const isSelected = !onlyTopPicks && selectedCategory.toLowerCase() === category.toLowerCase();
          return (
            <button
              key={category}
              onClick={() => {
                if (onlyTopPicks) onToggleTopPicks();
                onSelectCategory(category);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 700 : 500,
                whiteSpace: 'nowrap',
                backgroundColor: isSelected ? 'var(--color-saffron)' : '#fff',
                color: isSelected ? '#fff' : 'var(--color-text-main)',
                border: `1px solid ${isSelected ? 'var(--color-saffron)' : 'var(--color-border)'}`,
                transition: 'all 0.15s ease'
              }}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};
