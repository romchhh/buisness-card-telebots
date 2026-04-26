'use client';

import { useEffect, useRef } from 'react';

const LINKS = [
  { label: 'telebots.site', sub: 'Website', href: 'https://telebots.site' },
  { label: '@telebotsnowayrm', sub: 'Telegram', href: 'https://t.me/telebotsnowayrm' },
  { label: 'TeleBotsNowayrmChannel', sub: 'Channel', href: 'https://t.me/TeleBotsNowayrmChannel' },
  { label: '@telebotsnowayrm', sub: 'Instagram', href: 'https://www.instagram.com/telebotsnowayrm/profilecard/?igsh=MTMwbTFjdG0wa2Nxcw==' },
];

export function Footer({ onScrollUp }: { onScrollUp: () => void }) {
  const footerRef = useRef<HTMLDivElement>(null);
  const touchY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => { touchY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current === null) return;
    const dy = touchY.current - e.changedTouches[0].clientY;
    if (dy < -50) onScrollUp();
    touchY.current = null;
  };

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY < -20 && el.scrollTop < 5) onScrollUp();
    };
    el.addEventListener('wheel', onWheel, { passive: true });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onScrollUp]);

  return (
    <div
      ref={footerRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        width: '100%',
        height: '100svh',
        overflow: 'hidden',
        background: '#0c0c0c',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
        position: 'relative',
      }}
    >
      {/* Scroll up indicator */}
      <div
        onClick={onScrollUp}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
          zIndex: 10,
          opacity: 0.28,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.65'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.28'; }}
      >
        <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
          <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 9, letterSpacing: '3px', fontWeight: 700 }}>SCROLL UP</span>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 clamp(24px, 6%, 80px)',
        gap: 'clamp(32px, 5vh, 56px)',
      }}>

        {/* Heading */}
        <div>
          <p style={{
            fontSize: 9,
            letterSpacing: '3px',
            color: 'rgba(255,255,255,0.25)',
            marginBottom: 12,
            fontWeight: 700,
          }}>
            FIND US
          </p>
          <h2 style={{
            fontSize: 'clamp(40px, 7.5vw, 86px)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-2.5px',
            textTransform: 'lowercase',
            color: '#fff',
            margin: 0,
          }}>
            telebots.
          </h2>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {LINKS.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'clamp(13px, 2vh, 20px) 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                textDecoration: 'none',
                color: '#fff',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.45'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span style={{
                  fontSize: 9,
                  letterSpacing: '2px',
                  color: 'rgba(255,255,255,0.22)',
                  fontWeight: 700,
                  width: 68,
                  flexShrink: 0,
                }}>
                  {link.sub.toUpperCase()}
                </span>
                <span style={{
                  fontSize: 'clamp(15px, 2.2vw, 22px)',
                  fontWeight: 900,
                  letterSpacing: '-0.3px',
                  textTransform: 'lowercase',
                }}>
                  {link.label}
                </span>
              </div>
              {/* Arrow icon */}
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.22, flexShrink: 0 }}>
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{
        padding: '0 clamp(24px, 6%, 80px) clamp(18px, 3vh, 28px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '1.5px', fontWeight: 700 }}>
          © {new Date().getFullYear()} TELEBOTS
        </span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '1.5px', fontWeight: 700 }}>
          BY NOWAYRM
        </span>
      </div>
    </div>
  );
}