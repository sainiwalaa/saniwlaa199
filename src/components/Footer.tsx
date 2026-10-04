import React from 'react';
import { FooterItem } from '../types/deals';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

interface FooterProps {
  footerPages: FooterItem[];
  onSelectPage: (p: FooterItem) => void;
}

export const Footer: React.FC<FooterProps> = ({ footerPages, onSelectPage }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-navy-dark)',
      color: '#ffffff',
      marginTop: '40px',
      padding: '40px 16px 28px',
      borderTop: '1px solid #1e293b'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
        {/* Brand Header */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #F59E0B, #E11D48)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShoppingBag size={18} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-saffron-gold)' }}>
            SAINIWALAA
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
            DEALS
          </span>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: '600px', margin: '0 auto 20px', lineHeight: 1.6 }}>
          Amazon, Flipkart &amp; Meesho ke behtareen products aur trending deals ek hi jagah. Shop smarter, save more every day.
        </p>

        {/* Footer Page Links */}
        {footerPages.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {footerPages.map((page, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPage(page)}
                style={{
                  color: '#cbd5e1',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'color 0.15s ease'
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#F59E0B')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#cbd5e1')}
              >
                {page['PAGE NAME']}
              </button>
            ))}
          </div>
        )}

        <div style={{ height: '1px', backgroundColor: '#1e293b', maxWidth: '400px', margin: '0 auto 20px' }} />

        {/* Affiliate Disclosure & Legal Notice */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#64748b', fontSize: '0.75rem', marginBottom: '8px' }}>
          <ShieldCheck size={14} />
          <span>Affiliate &amp; Price Disclaimer</span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.75rem', maxWidth: '700px', margin: '0 auto 16px', lineHeight: 1.5 }}>
          As an affiliate deal discovery portal, SAINIWALAA Deals may earn an affiliate commission on qualifying purchases made through our referral links. Product prices, coupons, and stock availability are subject to change by third-party stores.
        </p>

        <p style={{ color: '#475569', fontSize: '0.75rem' }}>
          &copy; {new Date().getFullYear()} SAINIWALAA Deals. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
