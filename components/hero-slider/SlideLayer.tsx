'use client';

import { useEffect, useRef, useState } from 'react';

import type { MouseRef, SlideItem } from './types';
import { computeBlockFlyY, getScrollBlockHeightPx, getScrollFlyDistancePx } from './scrollBlockShift';
import { CtaBtn } from './ui';

export type CarPlanetHandoff = { forward: boolean; progress: number } | null;

export function SlideLayer({
  slide, translateY, bgTranslateY, blur, scale, opacity,
  zIndex, mouse, animateText, textVisible,
  transitionProgress, transitionDir, isExiting,
  carPlanetHandoff = null,
  scrollMode = false,
  scrollRootRef,
  blockIndex = 0,
}: {
  slide: SlideItem;
  translateY: number;
  bgTranslateY: number;
  blur: number;
  scale: number;
  opacity: number;
  zIndex: number;
  mouse: MouseRef;
  animateText: boolean;
  textVisible: boolean;
  transitionProgress: number;
  transitionDir: number;
  isExiting: boolean;
  carPlanetHandoff?: CarPlanetHandoff;
  scrollMode?: boolean;
  scrollRootRef?: React.RefObject<HTMLElement | null>;
  blockIndex?: number;
}) {
  const isUfoSlide = slide.id === 's4';
  const isRaisedMobileCopySlide = slide.id === 's1' || slide.id === 's2' || slide.id === 's3';
  const isLowContrastCopySlide = slide.id === 's2' || slide.id === 's3';
  const isLowerMobileHeadlineSlide = slide.id === 's2' || slide.id === 's3';

  const rootRef = useRef<HTMLDivElement | null>(null);
  const foregroundRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lerped = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  const transProgressRef = useRef(0);
  const transDirRef = useRef(1);
  const isExitingRef = useRef(false);
  const carPlanetHandoffRef = useRef<CarPlanetHandoff>(null);
  const scrollModeRef = useRef(false);
  const scrollRootRefInner = useRef<React.RefObject<HTMLElement | null> | undefined>(undefined);
  const blockIndexRef = useRef(0);

  const [scrollRevealed, setScrollRevealed] = useState(false);

  useEffect(() => {
    transProgressRef.current = transitionProgress;
    transDirRef.current = transitionDir;
    isExitingRef.current = isExiting;
    carPlanetHandoffRef.current = carPlanetHandoff;
    scrollModeRef.current = scrollMode;
    scrollRootRefInner.current = scrollRootRef;
    blockIndexRef.current = blockIndex;
  });

  useEffect(() => {
    if (!scrollMode) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.2) {
            setScrollRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: [0, 0.12, 0.2, 0.35], rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scrollMode, slide.id]);

  useEffect(() => {
    const loop = () => {
      lerped.current.x += (mouse.current.x - lerped.current.x) * 0.04;
      lerped.current.y += (mouse.current.y - lerped.current.y) * 0.04;

      const sm = scrollModeRef.current;
      const root = scrollRootRefInner.current?.current;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
      const mobileBoost =
        typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches ? 1.5 : 1;
      const handoffPx = vh * 0.24 * (mobileBoost > 1 ? 1.08 : 1);

      let handoff01 = 0;
      if (sm && root) {
        const h = getScrollBlockHeightPx(root);
        handoff01 = Math.min(1, Math.max(0, root.scrollTop / h));
      }

      if (sm && root) {
        const H = getScrollBlockHeightPx(root);
        const st = root.scrollTop;
        const k = blockIndexRef.current;
        const flyBase = getScrollFlyDistancePx(H, mobileBoost);
        const flyBg = computeBlockFlyY(st, H, k, flyBase * 0.11);
        if (foregroundRef.current) foregroundRef.current.style.transform = '';
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0, ${flyBg}px, 0) scale(1.02)`;
        }
        if (textBlockRef.current) {
          const flyText = computeBlockFlyY(st, H, k, flyBase * 1);
          textBlockRef.current.style.transform = `translate3d(0, ${flyText}px, 0)`;
        }
      } else {
        if (foregroundRef.current) foregroundRef.current.style.transform = '';
        if (textBlockRef.current) textBlockRef.current.style.transform = '';
      }

      const tp = transProgressRef.current;
      const td = transDirRef.current;
      const isEx = isExitingRef.current;
      const handoff = sm ? null : carPlanetHandoffRef.current;

      slide.layers.forEach((l, j) => {
        const el = layerRefs.current[j];
        if (!el) return;

        const mouseTx = lerped.current.x * (l.px || 10);
        const mouseTy = lerped.current.y * (l.py || 10);

        const isCar = l.src.includes('carcloud.png');
        const isPlanet = l.src.includes('planet.png');
        const isCarPlanetHero = isCar || isPlanet;

        const py = l.py || 10;
        let scrollY = 0;
        if (!sm) {
          const useGenericDepth = !(handoff && isCarPlanetHero);
          scrollY = useGenericDepth
            ? (isEx ? td * -tp * py * 3.2 : td * (1 - tp) * py * 3.2)
            : 0;
        }

        let handoffY = 0;
        let flyLayer = 0;
        if (sm && root) {
          const H = getScrollBlockHeightPx(root);
          const st = root.scrollTop;
          const k = blockIndexRef.current;
          const flyBase = getScrollFlyDistancePx(H, mobileBoost);
          const stagger = 1 + j * 0.14 + (isCarPlanetHero ? 0.08 : 0);
          flyLayer = computeBlockFlyY(st, H, k, flyBase * stagger);
        }
        if (sm && isCarPlanetHero) {
          if (slide.id === 's1' && isCar) handoffY = -handoff01 * handoffPx;
          if (slide.id === 's2' && isPlanet) handoffY = (1 - handoff01) * handoffPx;
        } else if (handoff && isCarPlanetHero) {
          const { forward, progress: hp } = handoff;
          if (isEx) {
            if (forward && isCar && slide.id === 's1') handoffY = -hp * handoffPx;
            if (!forward && isPlanet && slide.id === 's2') handoffY = hp * handoffPx;
          } else {
            if (forward && isPlanet && slide.id === 's2') handoffY = (1 - hp) * handoffPx;
            if (!forward && isCar && slide.id === 's1') handoffY = -(1 - hp) * handoffPx;
          }
        }

        const base = l.originTransform || '';
        const tyPx = mouseTy + scrollY + handoffY + flyLayer;
        el.style.transform = base
          ? `${base} translate3d(${mouseTx}px,${tyPx}px,0)`
          : `translate3d(${mouseTx}px,${tyPx}px,0)`;
      });

      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [slide.layers, mouse]);

  const effectiveAnimateText = scrollMode ? scrollRevealed : animateText;
  const effectiveTextVisible = scrollMode ? true : textVisible;

  const outerTransform = scrollMode ? undefined : `translateY(${translateY}%) scale(${scale})`;
  const outerFilter = scrollMode ? 'none' : (blur > 0.15 ? `blur(${blur}px)` : 'none');
  const outerOpacity = scrollMode ? 1 : opacity;

  const bgTransform = scrollMode ? undefined : `translateY(${bgTranslateY}%)`;

  const scrollHitNone = scrollMode ? 'none' : 'auto';

  return (
    <div
      ref={scrollMode ? rootRef : undefined}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex,
        transform: outerTransform ?? 'none',
        filter: outerFilter,
        opacity: outerOpacity,
        willChange: scrollMode ? 'opacity' : 'transform, filter, opacity',
        transformOrigin: 'center center',
        pointerEvents: scrollHitNone,
      }}
    >
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-5%',
          right: '-5%',
          bottom: '-20%',
          backgroundImage: `url('${slide.bg}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: bgTransform,
          willChange: 'transform',
          pointerEvents: scrollHitNone,
        }}
      />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.62) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to top, transparent 80%, rgba(0,0,0,0.28) 100%)' }} />

      <div
        ref={foregroundRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: scrollMode ? 'none' : 'auto',
        }}
      >
        {slide.layers.map((l, j) => (
          <div
            key={j}
            className={[
              'layer-item',
              j === 0 ? 'mobile-layer' : '',
              l.src.includes('planet.png') ? 'mobile-planet' : '',
              l.src.includes('astronaut11.png') ? 'mobile-astronaut' : '',
            ].filter(Boolean).join(' ')}
            style={{
              position: 'absolute',
              ...l.pos,
              ...l.size,
              zIndex: l.zIndex || 2,
              pointerEvents: scrollHitNone,
            }}
          >
            <div
              ref={el => { layerRefs.current[j] = el; }}
              style={{ width: '100%', height: '100%', willChange: 'transform' }}
            >
              <img
                src={l.src}
                alt={l.alt}
                draggable={false}
                style={{
                  width: '100%',
                  height: l.extraStyle?.height || 'auto',
                  objectFit: l.extraStyle?.objectFit || 'contain',
                  objectPosition: l.extraStyle?.objectPosition || 'center',
                  mixBlendMode: l.extraStyle?.mixBlendMode || 'normal',
                  opacity: l.extraStyle?.opacity ?? 1,
                  display: 'block',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>
        ))}

        <div
          ref={scrollMode ? textBlockRef : undefined}
          className={`sc${isUfoSlide ? ' sc-ufo' : ''}`}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            padding: '0 8%',
            gap: '4%',
            opacity: effectiveTextVisible ? 1 : 0,
            transition: 'opacity 0.32s ease',
            pointerEvents: scrollHitNone,
            willChange: scrollMode ? 'transform' : undefined,
          }}
        >
          <div style={isUfoSlide ? { width: '100%', textAlign: 'center' } : { flex: 1 }}>
            <h1
              className={`sh${isLowerMobileHeadlineSlide ? ' sh-mobile-lower' : ''}`}
              style={{ fontSize: slide.headlineSize, fontWeight: 900, color: slide.textColor, lineHeight: 0.93, textTransform: 'lowercase', letterSpacing: '-2px', fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif" }}
            >
              {slide.headline.map((line, k) => (
                <span
                  key={k}
                  style={{ display: 'block', animation: effectiveAnimateText ? `fadeUp 0.72s cubic-bezier(0.16,1,0.3,1) ${0.04 + k * 0.07}s both` : 'none' }}
                >
                  {line}
                </span>
              ))}
            </h1>
          </div>
          <div
            className={`sr${isRaisedMobileCopySlide ? ' sr-mobile-raise' : ''}${isLowContrastCopySlide ? ' sr-contrast-bg sr-mobile-raise-strong' : ''}`}
            style={{ width: 290, textAlign: 'center', marginTop: isUfoSlide ? 14 : 0, animation: effectiveAnimateText ? 'fadeUp 0.72s cubic-bezier(0.16,1,0.3,1) 0.28s both' : 'none' }}
          >
            <p style={{ color: slide.textColor === '#fff' ? 'rgba(255,255,255,0.82)' : 'rgba(0,0,0,0.68)', fontSize: 14.5, lineHeight: 1.74, fontFamily: 'Georgia, serif', marginBottom: slide.cta ? 24 : 0 }}>{slide.sub}</p>
            {slide.cta && (
              <span style={scrollMode ? { pointerEvents: 'auto' } : undefined}>
                <CtaBtn href={slide.ctaHref!} dark={slide.ctaDark}>{slide.cta}</CtaBtn>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
