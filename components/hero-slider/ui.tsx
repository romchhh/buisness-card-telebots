'use client';

import { useState } from 'react';

export function CtaBtn({
  href, dark, children,
}: {
  href: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-block',
        padding: '12px 32px',
        fontSize: 11,
        letterSpacing: '2.5px',
        fontWeight: 700,
        fontFamily: "'Arial Black', sans-serif",
        borderRadius: 30,
        textDecoration: 'none',
        transition: 'all 0.25s cubic-bezier(0.22,1,0.36,1)',
        background: h ? (dark ? '#111' : '#fff') : 'transparent',
        color: h ? (dark ? '#fff' : '#000') : (dark ? '#111' : '#fff'),
        border: dark
          ? '1.5px solid rgba(0,0,0,0.45)'
          : '1.5px solid rgba(255,255,255,0.65)',
        transform: h ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {children}
    </a>
  );
}

export function NavBtn({ onClick, up = false }: { onClick: () => void; up?: boolean }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      aria-label={up ? 'Previous' : 'Next'}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 26, height: 26, padding: 0,
        border: 'none',
        background: 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.2s',
        transform: h ? 'scale(1.16)' : 'scale(1)',
      }}
    >
      <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
        {up
          ? <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M5 2V8M5 8L8 5M5 8L2 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        }
      </svg>
    </button>
  );
}
