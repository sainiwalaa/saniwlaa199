import React, { useEffect } from 'react';
import { FooterItem } from '../types/deals';
import { X, Info } from 'lucide-react';

interface FooterModalProps {
  page: FooterItem | null;
  onClose: () => void;
}

export const FooterModal: React.FC<FooterModalProps> = ({ page, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (page) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [page, onClose]);

  if (!page) return null;

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
          maxWidth: '520px',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B45309'
            }}>
              <Info size={18} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{page['PAGE NAME']}</h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
          {page.CONTENT}
        </div>
      </div>
    </div>
  );
};
