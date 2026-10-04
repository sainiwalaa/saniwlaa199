import React, { useState, useEffect } from 'react';
import { HeroItem } from '../types/deals';
import { ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';

interface HeroSliderProps {
  heroItems: HeroItem[];
  onExploreClick: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ heroItems, onExploreClick }) => {
  const validItems = heroItems.filter(h => (h.IMAGE && h.IMAGE.trim()) || (h.TAXT && h.TAXT.trim()));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (validItems.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % validItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [validItems.length, isPaused]);

  if (validItems.length === 0) {
    // Royal Branded Fallback Hero
    return (
      <div style={{ maxWidth: '1280px', margin: '14px auto', padding: '0 16px' }}>
        <div style={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #0F111A 0%, #1E1B2E 50%, #2A1725 100%)',
          color: '#ffffff',
          padding: '28px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '180px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            right: '-40px',
            top: '-40px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              color: '#F59E0B',
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '10px'
            }}>
              <Sparkles size={12} /> OFFICIAL PARTNER DEALS
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px', lineHeight: 1.3 }}>
              हर दिन कुछ नया, हर खरीदारी में बचत!
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', maxWidth: '650px' }}>
              Amazon, Flipkart &amp; Meesho ke behtareen products aur trending offers ek hi jagah.
            </p>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <button
              onClick={onExploreClick}
              style={{
                backgroundColor: 'var(--color-saffron)',
                color: '#ffffff',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}
            >
              Explore Today's Deals
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = validItems[currentIndex];
  const headline = currentItem.TAXT?.split('\n')[0] || "SAINIWALAA DEALS — Best Deals, Smart Shopping";

  return (
    <div
      style={{ maxWidth: '1280px', margin: '14px auto', padding: '0 16px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        aspectRatio: '16 / 7',
        minHeight: '160px',
        backgroundColor: '#0F111A',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
      }}>
        {currentItem.LINK ? (
          <a
            href={currentItem.LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            {renderBannerContent(currentItem, headline)}
          </a>
        ) : (
          renderBannerContent(currentItem, headline)
        )}

        {/* Previous / Next Controls */}
        {validItems.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(prev => (prev - 1 + validItems.length) % validItems.length);
              }}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(15, 17, 26, 0.65)',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex(prev => (prev + 1) % validItems.length);
              }}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(15, 17, 26, 0.65)',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}
            >
              <ChevronRight size={18} />
            </button>

            {/* Dots */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '6px'
            }}>
              {validItems.map((_, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  style={{
                    width: idx === currentIndex ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: idx === currentIndex ? 'var(--color-saffron)' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function renderBannerContent(item: HeroItem, headline: string) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {item.IMAGE ? (
        <img
          src={item.IMAGE}
          alt={headline}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="eager"
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0F111A, #181B26, #E11D48)'
        }} />
      )}

      {/* Dark overlay for readable text */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(15, 17, 26, 0.85) 0%, rgba(15, 17, 26, 0.2) 60%, transparent 100%)'
      }} />

      {/* Text Info */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '20px',
        right: '20px',
        color: '#ffffff'
      }}>
        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: 800,
          marginBottom: '4px',
          textShadow: '0 2px 4px rgba(0,0,0,0.6)',
          lineHeight: 1.3
        }}>
          {headline}
        </h2>
        {item.LINK && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--color-saffron-gold)',
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            <span>Grab Deal</span>
            <ExternalLink size={12} />
          </div>
        )}
      </div>
    </div>
  );
}
