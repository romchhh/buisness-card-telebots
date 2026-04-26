'use client';

import type { CSSProperties } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Footer } from './hero-slider/Footer';
import { SLIDES } from './hero-slider/data';
import { SlideLayer } from './hero-slider/SlideLayer';
import { computeBlockFlyY, getScrollBlockHeightPx, getScrollFlyDistancePx } from './hero-slider/scrollBlockShift';
import { NavBtn } from './hero-slider/ui';

function ScrollBlockNudge({
  scrollRef,
  blockIndex,
  children,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  blockIndex: number;
  children: React.ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = scrollRef.current;
    const el = wrapRef.current;
    if (!root || !el) return;
    let rafId = 0;
    const tick = () => {
      const H = getScrollBlockHeightPx(root);
      const st = root.scrollTop;
      const mobileBoost =
        typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches ? 1.5 : 1;
      const flyBase = getScrollFlyDistancePx(H, mobileBoost);
      const y = computeBlockFlyY(st, H, blockIndex, flyBase * 0.98);
      el.style.transform = `translate3d(0, ${y}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [scrollRef, blockIndex]);
  return (
    <div
      ref={wrapRef}
      style={{ minHeight: '100%', height: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
    >
      {children}
    </div>
  );
}

const TOTAL_BLOCKS = SLIDES.length + 1;

const headerBtnStyle: CSSProperties = {
  color: '#fff',
  fontSize: 18,
  fontWeight: 900,
  fontFamily: "'Arial Black', sans-serif",
  letterSpacing: '-0.5px',
  textShadow: '0 2px 16px rgba(0,0,0,0.8)',
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
};

const telegramBtnStyle: CSSProperties = {
  opacity: 0.9,
  lineHeight: 0,
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
};

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const footerSectionRef = useRef<HTMLElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const setSectionRef = (i: number) => (el: HTMLElement | null) => {
    sectionRefs.current[i] = el;
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const scrollToBlock = useCallback((idx: number) => {
    const root = scrollRef.current;
    if (!root) return;
    if (idx < 0) return;
    if (idx < SLIDES.length) {
      sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      footerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const scrollTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const onScroll = () => {
      const { scrollTop: st, clientHeight, scrollHeight } = root;
      if (clientHeight < 1) return;
      const nearBottom = st + clientHeight >= scrollHeight - 40;
      if (nearBottom) {
        setActiveIndex(SLIDES.length);
        return;
      }
      const pageH = getScrollBlockHeightPx(root);
      const idx = Math.round((st + pageH * 0.45) / pageH);
      setActiveIndex(Math.min(SLIDES.length - 1, Math.max(0, idx)));
    };
    onScroll();
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, []);

  const progressPct =
    activeIndex >= SLIDES.length
      ? 100
      : (activeIndex / (SLIDES.length - 1)) * 100;

  const navDown = () => scrollToBlock(Math.min(activeIndex + 1, SLIDES.length));
  const navUp = () => scrollToBlock(Math.max(activeIndex - 1, 0));

  const staticSlideProps = {
    translateY: 0,
    bgTranslateY: 0,
    blur: 0,
    scale: 1,
    opacity: 1,
    transitionProgress: 0,
    transitionDir: 1,
    isExiting: true,
    animateText: false,
    textVisible: true,
    carPlanetHandoff: null,
  };

  return (
    <>
      <div
        className="telebots-onepage"
        style={{ position: 'relative', width: '100%', height: '100svh', background: '#000', overflow: 'hidden' }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 300,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '26px 36px 0',
            pointerEvents: 'none',
          }}
        >
          <button type="button" onClick={scrollTop} aria-label="Back to top" style={{ pointerEvents: 'auto', ...headerBtnStyle }}>
            telebots.
          </button>
          <button type="button" onClick={() => scrollToBlock(SLIDES.length)} aria-label="Contacts" style={{ pointerEvents: 'auto', ...telegramBtnStyle }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          </button>
        </div>

        <div
          ref={scrollRef}
          className="telebots-page-scroll"
          style={{
            height: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
          }}
        >
          {SLIDES.map((slide, i) => (
            <section
              key={slide.id}
              ref={setSectionRef(i)}
              className="telebots-block"
              style={{
                position: 'relative',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
                background: '#000',
              }}
            >
              <SlideLayer
                slide={slide}
                zIndex={1}
                mouse={mouse}
                scrollMode
                scrollRootRef={scrollRef}
                blockIndex={i}
                {...staticSlideProps}
              />
            </section>
          ))}

          <section
            ref={footerSectionRef}
            className="telebots-block telebots-block-footer"
            style={{
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              background: '#0c0c0c',
            }}
          >
            <ScrollBlockNudge scrollRef={scrollRef} blockIndex={SLIDES.length}>
              <Footer variant="inline" onScrollUp={scrollTop} />
            </ScrollBlockNudge>
          </section>
        </div>

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 280, background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'rgba(255,255,255,0.35)', transition: 'width 0.45s cubic-bezier(0.22,1,0.36,1)' }} />
        </div>

        <div style={{ position: 'absolute', left: 36, bottom: 36, zIndex: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: TOTAL_BLOCKS }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToBlock(i)}
              aria-label={i < SLIDES.length ? `Block ${i + 1}` : 'Contacts'}
              style={{
                width: 6,
                height: i === activeIndex ? 20 : 6,
                borderRadius: 4,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: i === activeIndex ? '#fff' : 'rgba(255,255,255,0.32)',
                transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
                boxShadow: i === activeIndex ? '0 0 10px rgba(255,255,255,0.35)' : 'none',
              }}
            />
          ))}
        </div>

        <div className="slide-counter" style={{ position: 'absolute', bottom: 38, left: '50%', transform: 'translateX(-50%)', zIndex: 280, display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', fontFamily: "'Arial Black', sans-serif", opacity: 0.9 }}>
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.28)' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontFamily: "'Arial Black', sans-serif" }}>
            {String(TOTAL_BLOCKS).padStart(2, '0')}
          </span>
        </div>

        <div style={{ position: 'absolute', bottom: 28, right: 36, zIndex: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <NavBtn onClick={navUp} up />
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.2)' }} />
          <NavBtn onClick={navDown} />
        </div>
      </div>

      <style>{`
        .telebots-page-scroll {
          scroll-snap-type: y mandatory;
        }
        .telebots-block {
          height: 100svh;
          min-height: 100svh;
          max-height: 100svh;
          overflow: hidden;
          isolation: isolate;
        }
        .telebots-block::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 50;
          pointer-events: none;
          box-shadow:
            inset 0 64px 90px -36px rgba(0,0,0,0.42),
            inset 0 -64px 90px -36px rgba(0,0,0,0.42);
        }
        .telebots-block-footer {
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
        }
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .sc { flex-direction: column !important; justify-content: flex-end !important; padding: 92px 22px 42px !important; gap: 10px !important; align-items: center !important; text-align: center !important; }
          .sc-ufo { justify-content: flex-start !important; padding-top: 300px !important; }
          .sh { font-size: clamp(36px, 11.5vw, 56px) !important; letter-spacing: -1px !important; line-height: 0.9 !important; text-align: center !important; }
          .sh-mobile-lower { margin-top: 130px !important; }
          .sr { width: 100% !important; text-align: center !important; max-width: 340px !important; margin-top: 6px !important; }
          .sr-mobile-raise { margin-top: -32px !important; position: relative !important; top: -34px !important; }
          .sr-mobile-raise-strong { top: -56px !important; }
          .sr p { font-size: 13px !important; line-height: 1.62 !important; }
          .mobile-layer { left: 50% !important; top: 8% !important; right: auto !important; bottom: auto !important; width: 92vw !important; max-width: 420px !important; transform: translateX(-50%); }
          .mobile-planet { width: 76vw !important; max-width: 300px !important; top: 4% !important; }
          .mobile-astronaut { width: 58vw !important; max-width: 220px !important; top: 10% !important; }
          .slide-counter { bottom: 18px !important; }
          .telebots-onepage > div:first-of-type { padding: 22px 22px 0 !important; }
        }
        @media (max-width: 480px) {
          .sc { padding: 80px 18px 32px !important; }
          .sc-ufo { padding-top: 340px !important; }
          .sh { font-size: clamp(30px, 12.5vw, 48px) !important; }
          .sh-mobile-lower { margin-top: 155px !important; }
          .sr-mobile-raise { margin-top: -22px !important; position: relative !important; top: -26px !important; }
          .sr-mobile-raise-strong { top: -42px !important; }
          .mobile-layer { top: 6% !important; max-width: 360px !important; }
          .mobile-planet { width: 70vw !important; max-width: 250px !important; top: 8% !important; }
          .mobile-astronaut { width: 52vw !important; max-width: 180px !important; top: 14% !important; }
          .slide-counter { bottom: 12px !important; }
        }
        @media (min-width: 769px) {
          .sc-ufo {
            justify-content: flex-start !important;
            align-items: center !important;
            text-align: center !important;
            flex-direction: column !important;
            padding-top: 260px !important;
          }
          .sr-contrast-bg {
            background: radial-gradient(ellipse at center, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.08) 72%, rgba(0,0,0,0) 100%);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            padding: 18px 24px;
            border-radius: 999px;
            box-shadow: 0 0 48px 28px rgba(0,0,0,0.24), 0 0 96px 52px rgba(0,0,0,0.14);
          }
        }
      `}</style>
    </>
  );
}
