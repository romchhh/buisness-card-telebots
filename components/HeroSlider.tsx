'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Footer } from './hero-slider/Footer';
import { SLIDES } from './hero-slider/data';
import { SlideLayer } from './hero-slider/SlideLayer';
import { NavBtn } from './hero-slider/ui';

const DUR = 1400;

function easeInOutQuart(t: number) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [dir, setDir] = useState(1);
  const [showFooter, setShowFooter] = useState(false);

  const lock = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchY = useRef<number | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const animRaf = useRef<number | null>(null);
  const animStart = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const goTo = useCallback((rawIdx: number, rawDir?: number) => {
    if (lock.current) return;
    if (rawDir === 1 && rawIdx >= SLIDES.length) return setShowFooter(true);
    if (rawDir === -1 && showFooter) return setShowFooter(false);
    if (rawIdx < 0 || rawIdx >= SLIDES.length) return;
    if (rawIdx === current && !showFooter) return;

    const d = rawDir !== undefined ? rawDir : (rawIdx > current ? 1 : -1);
    lock.current = true;
    setDir(d);
    setNext(rawIdx);
    setProgress(0);
    animStart.current = null;

    const tick = (ts: number) => {
      if (!animStart.current) animStart.current = ts;
      const raw = Math.min((ts - animStart.current) / DUR, 1);
      setProgress(easeInOutQuart(raw));
      if (raw < 1) {
        animRaf.current = requestAnimationFrame(tick);
      } else {
        setCurrent(rawIdx);
        setNext(null);
        setProgress(0);
        lock.current = false;
      }
    };
    animRaf.current = requestAnimationFrame(tick);
  }, [current, showFooter]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastTime = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastTime < DUR + 100) return;
      lastTime = now;
      const d = e.deltaY > 0 ? 1 : -1;
      goTo(current + d, d);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [current, goTo]);

  const onTouchStart = (e: React.TouchEvent) => { touchY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current === null) return;
    const dy = touchY.current - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 40) goTo(current + (dy > 0 ? 1 : -1), dy > 0 ? 1 : -1);
    touchY.current = null;
  };

  const isTransitioning = next !== null;
  const currentExitY = dir === 1 ? -(progress * 38) : (progress * 38);
  const nextEnterY = dir === 1 ? (1 - progress) * 38 : -(1 - progress) * 38;
  const currentBgY = dir === 1 ? -(progress * 12) : (progress * 12);
  const nextBgY = dir === 1 ? (1 - progress) * 12 : -(1 - progress) * 12;
  const currentOpacity = isTransitioning ? 1 - easeInOutQuart(progress) : 1;
  const nextOpacity = isTransitioning ? easeInOutQuart(progress) : 1;
  const midBlur = Math.sin(progress * Math.PI);
  const currentBlur = isTransitioning ? midBlur * 2.5 : 0;
  const nextBlur = isTransitioning ? (1 - progress) * 2 : 0;
  const currentScale = isTransitioning ? 1 - progress * 0.01 : 1;
  const nextScale = isTransitioning ? 0.99 + progress * 0.01 : 1;

  return (
    <>
      <div ref={containerRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ position: 'relative', width: '100%', height: '100svh', overflow: 'hidden', background: '#000' }}>
        <button type="button" onClick={() => { goTo(0, -1); setShowFooter(false); }} aria-label="Back to top" style={{ position: 'absolute', top: 28, left: 36, zIndex: 200, color: '#fff', fontSize: 18, fontWeight: 900, fontFamily: "'Arial Black', sans-serif", letterSpacing: '-0.5px', textShadow: '0 2px 16px rgba(0,0,0,0.8)', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', mixBlendMode: 'normal' }}>telebots.</button>
        <button
          type="button"
          onClick={() => setShowFooter(true)}
          aria-label="Open contacts"
          style={{
            position: 'absolute',
            top: 26,
            right: 36,
            zIndex: 200,
            opacity: 0.9,
            lineHeight: 0,
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        </button>

        {/* 
          FIX: текст ревілиться двічі бо `textVisible` на поточному слайді
          переключався з true→false→true під час transition через `!isTransitioning`.
          
          Рішення: поточний слайд ЗАВЖДИ показує текст (textVisible=true завжди),
          але НІКОЛИ не анімує його (animateText=false завжди).
          Тільки наступний слайд анімує появу тексту після 62% прогресу.
        */}
        <SlideLayer
          slide={SLIDES[current]}
          translateY={currentExitY}
          bgTranslateY={currentBgY}
          blur={currentBlur}
          scale={currentScale}
          opacity={currentOpacity}
          zIndex={10}
          mouse={mouse}
          animateText={false}
          textVisible={true}
        />
        {isTransitioning && next !== null && (
          <SlideLayer
            slide={SLIDES[next]}
            translateY={nextEnterY}
            bgTranslateY={nextBgY}
            blur={nextBlur}
            scale={nextScale}
            opacity={nextOpacity}
            zIndex={20}
            mouse={mouse}
            animateText={progress > 0.62}
            textVisible={progress > 0.62}
          />
        )}
        {isTransitioning && <div style={{ position: 'absolute', inset: 0, zIndex: 15, pointerEvents: 'none', background: `linear-gradient(to ${dir === 1 ? 'bottom' : 'top'}, rgba(0,0,0,0) 0%, rgba(0,0,0,${midBlur * 0.55}) 50%, rgba(0,0,0,0) 100%)` }} />}

        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 300, background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ height: '100%', width: `${(current / (SLIDES.length - 1)) * 100}%`, background: 'rgba(255,255,255,0.35)', transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1)' }} />
        </div>

        <div style={{ position: 'absolute', left: 36, bottom: 36, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} style={{ width: 6, height: i === current ? 20 : 6, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer', background: i === current ? '#fff' : 'rgba(255,255,255,0.32)', transition: 'all 0.4s cubic-bezier(0.22,1,0.36,1)', boxShadow: i === current ? '0 0 10px rgba(255,255,255,0.4)' : 'none' }} />
          ))}
        </div>

        <div className="slide-counter" style={{ position: 'absolute', bottom: 38, left: '50%', transform: 'translateX(-50%)', zIndex: 200, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', fontFamily: "'Arial Black', sans-serif", opacity: 0.9 }}>{String(current + 1).padStart(2, '0')}</span>
          <span style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.28)' }} />
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontFamily: "'Arial Black', sans-serif" }}>{String(SLIDES.length).padStart(2, '0')}</span>
        </div>

        <div style={{ position: 'absolute', bottom: 28, right: 36, zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <NavBtn onClick={() => goTo(current - 1, -1)} up />
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.2)' }} />
          <NavBtn onClick={() => goTo(current + 1, 1)} />
        </div>
      </div>

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100svh', zIndex: showFooter ? 500 : -1, transform: showFooter ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 1.1s cubic-bezier(0.22,1,0.36,1)', background: '#111', overflow: 'hidden' }}>
        <Footer onScrollUp={() => setShowFooter(false)} />
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .sc { flex-direction: column !important; justify-content: flex-end !important; padding: 92px 22px 42px !important; gap: 10px !important; align-items: center !important; text-align: center !important; }
          .sc-ufo { justify-content: flex-start !important; padding-top: 300px !important; }
          .sh { font-size: clamp(36px, 11.5vw, 56px) !important; letter-spacing: -1px !important; line-height: 0.9 !important; text-align: center !important; }
          .sh-mobile-lower { margin-top: 130px !important; }
          .sr { width: 100% !important; text-align: center !important; max-width: 340px !important; margin-top: 6px !important; }
          .sr-mobile-raise {
            margin-top: -32px !important;
            position: relative !important;
            top: -34px !important;
          }
          .sr-mobile-raise-strong {
            top: -56px !important;
          }
          .sr p { font-size: 13px !important; line-height: 1.62 !important; }
          .mobile-layer { left: 50% !important; top: 8% !important; right: auto !important; bottom: auto !important; width: 92vw !important; max-width: 420px !important; transform: translateX(-50%) !important; }
          .mobile-planet { width: 76vw !important; max-width: 300px !important; top: 4% !important; }
          .mobile-astronaut { width: 58vw !important; max-width: 220px !important; top: 10% !important; }
          .fwrap { grid-template-columns: 1fr !important; gap: 12px !important; overflow-y: auto !important; padding-right: 2px !important; }
          .slide-counter { bottom: 18px !important; }
        }
        @media (max-width: 480px) {
          .sc { padding: 80px 18px 32px !important; }
          .sc-ufo { padding-top: 340px !important; }
          .sh { font-size: clamp(30px, 12.5vw, 48px) !important; }
          .sh-mobile-lower { margin-top: 155px !important; }
          .sr-mobile-raise {
            margin-top: -22px !important;
            position: relative !important;
            top: -26px !important;
          }
          .sr-mobile-raise-strong {
            top: -42px !important;
          }
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
            background: radial-gradient(
              ellipse at center,
              rgba(0,0,0,0.32) 0%,
              rgba(0,0,0,0.2) 45%,
              rgba(0,0,0,0.08) 72%,
              rgba(0,0,0,0) 100%
            );
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            padding: 18px 24px;
            border-radius: 999px;
            box-shadow:
              0 0 48px 28px rgba(0,0,0,0.24),
              0 0 96px 52px rgba(0,0,0,0.14);
          }
        }
      `}</style>
    </>
  );
}