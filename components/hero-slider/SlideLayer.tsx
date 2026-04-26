'use client';

import { useEffect, useRef } from 'react';

import type { MouseRef, SlideItem } from './types';
import { CtaBtn } from './ui';

export function SlideLayer({
  slide, translateY, bgTranslateY, blur, scale, opacity,
  zIndex, mouse, animateText, textVisible,
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
}) {
  const isUfoSlide = slide.id === 's4';
  const isRaisedMobileCopySlide = slide.id === 's1' || slide.id === 's2' || slide.id === 's3';
  const isLowContrastCopySlide = slide.id === 's2' || slide.id === 's3';
  const isLowerMobileHeadlineSlide = slide.id === 's2' || slide.id === 's3';
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lerped = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      lerped.current.x += (mouse.current.x - lerped.current.x) * 0.04;
      lerped.current.y += (mouse.current.y - lerped.current.y) * 0.04;

      slide.layers.forEach((l, j) => {
        const el = layerRefs.current[j];
        if (!el) return;
        const tx = lerped.current.x * (l.px || 10);
        const ty = lerped.current.y * (l.py || 10);
        const base = l.originTransform || '';
        el.style.transform = base ? `${base} translate(${tx}px,${ty}px)` : `translate(${tx}px,${ty}px)`;
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [slide.layers, mouse]);

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex, transform: `translateY(${translateY}%) scale(${scale})`, filter: blur > 0.2 ? `blur(${blur}px)` : 'none', opacity, willChange: 'transform, filter, opacity', transformOrigin: 'center center' }}>
      <div style={{ position: 'absolute', top: '-20%', left: '-5%', right: '-5%', bottom: '-20%', backgroundImage: `url('${slide.bg}')`, backgroundSize: 'cover', backgroundPosition: 'center', transform: `translateY(${bgTranslateY}%)`, willChange: 'transform' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to top, transparent 80%, rgba(0,0,0,0.25) 100%)' }} />

      {slide.layers.map((l, j) => (
        <div
          key={j}
          ref={el => { layerRefs.current[j] = el; }}
          className={[
            'layer-item',
            j === 0 ? 'mobile-layer' : '',
            l.src.includes('planet.png') ? 'mobile-planet' : '',
            l.src.includes('astronaut11.png') ? 'mobile-astronaut' : '',
          ].filter(Boolean).join(' ')}
          style={{ position: 'absolute', ...l.pos, ...l.size, zIndex: l.zIndex || 2, willChange: 'transform' }}
        >
          <img src={l.src} alt={l.alt} draggable={false} style={{ width: '100%', height: l.extraStyle?.height || 'auto', objectFit: l.extraStyle?.objectFit || 'contain', objectPosition: l.extraStyle?.objectPosition || 'center', mixBlendMode: l.extraStyle?.mixBlendMode || 'normal', opacity: l.extraStyle?.opacity ?? 1, display: 'block', userSelect: 'none', pointerEvents: 'none' }} />
        </div>
      ))}

      <div className={`sc${isUfoSlide ? ' sc-ufo' : ''}`} style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', padding: '0 8%', gap: '4%', opacity: textVisible ? 1 : 0, transition: 'opacity 0.35s ease' }}>
        <div style={isUfoSlide ? { width: '100%', textAlign: 'center' } : { flex: 1 }}>
          <h1 className={`sh${isLowerMobileHeadlineSlide ? ' sh-mobile-lower' : ''}`} style={{ fontSize: slide.headlineSize, fontWeight: 900, color: slide.textColor, lineHeight: 0.93, textTransform: 'lowercase', letterSpacing: '-2px', fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif" }}>
            {slide.headline.map((line, k) => (
              <span key={k} style={{ display: 'block', animation: animateText ? `fadeUp 0.75s cubic-bezier(0.16,1,0.3,1) ${0.04 + k * 0.07}s both` : 'none' }}>{line}</span>
            ))}
          </h1>
        </div>
        <div className={`sr${isRaisedMobileCopySlide ? ' sr-mobile-raise' : ''}${isLowContrastCopySlide ? ' sr-contrast-bg sr-mobile-raise-strong' : ''}`} style={{ width: 290, textAlign: 'center', marginTop: isUfoSlide ? 14 : 0, animation: animateText ? 'fadeUp 0.75s cubic-bezier(0.16,1,0.3,1) 0.28s both' : 'none' }}>
          <p style={{ color: slide.textColor === '#fff' ? 'rgba(255,255,255,0.82)' : 'rgba(0,0,0,0.68)', fontSize: 14.5, lineHeight: 1.74, fontFamily: 'Georgia, serif', marginBottom: slide.cta ? 24 : 0 }}>{slide.sub}</p>
          {slide.cta && <CtaBtn href={slide.ctaHref!} dark={slide.ctaDark}>{slide.cta}</CtaBtn>}
        </div>
      </div>
    </div>
  );
}
