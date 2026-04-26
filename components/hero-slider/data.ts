import type { FooterCol, SlideItem } from './types';

export const SLIDES: SlideItem[] = [
  {
    id: 's1',
    bg: '/site-media/sld1-bg.jpeg',
    textColor: '#fff',
    headline: ['we build', 'bots &', 'websites'],
    headlineSize: 'clamp(52px, 7.5vw, 100px)',
    sub: 'Chatbots, web, parsers, design — from idea to launch. Full cycle: messengers, web, e-commerce, data & UI/UX.',
    cta: 'MORE',
    ctaHref: 'https://t.me/telebotsnowayrm',
    layers: [
      {
        src: '/site-media/carcloud.png',
        alt: 'car in pink smoke',
        pos: { left: '38%', top: '50%' },
        size: { width: '42vw', maxWidth: 620 },
        originTransform: 'translateY(-50%)',
        zIndex: 2, px: 18, py: 12,
      },
    ],
  },
  {
    id: 's2',
    bg: '/site-media/sld3-bg.jpeg',
    textColor: '#fff',
    headline: ['exceptional', 'by design'],
    headlineSize: 'clamp(48px, 6.5vw, 88px)',
    sub: 'We architect, build, and support after launch. CRM, payments, and analytics — wired to how you work.',
    cta: null,
    layers: [
      { src: '/site-media/planet.png', alt: 'planet', pos: { left: '50%', top: '-5%' }, size: { width: '52vw', maxWidth: 750 }, originTransform: 'translateX(-30%)', zIndex: 2, px: 25, py: 20 },
      { src: '/site-media/land.png', alt: 'mars surface', pos: { left: 0, bottom: 0 }, size: { width: '100%' }, originTransform: '', zIndex: 3, px: 3, py: 2, extraStyle: { objectFit: 'cover', height: '38%', objectPosition: 'center top' } },
      { src: '/site-media/people.png', alt: 'people', pos: { left: '48%', bottom: '6%' }, size: { width: '18vw', maxWidth: 260 }, originTransform: 'translateX(-50%)', zIndex: 4, px: 10, py: 8 },
    ],
  },
  {
    id: 's3',
    bg: '/site-media/sld2-bg.jpeg',
    textColor: '#fff',
    headline: ['from landing', 'to complex', 'web systems'],
    headlineSize: 'clamp(40px, 5.8vw, 78px)',
    sub: 'One team — no extra middlemen. We design impactful experiences for distinct brands.',
    cta: null,
    layers: [
      { src: '/site-media/astronaut11.png', alt: 'astronaut', pos: { left: '50%', top: '0%' }, size: { width: '18vw', maxWidth: 270 }, originTransform: 'translateX(-20%)', zIndex: 3, px: 22, py: 18 },
      { src: '/site-media/birds1.png', alt: 'birds', pos: { left: '0%', bottom: '8%' }, size: { width: '100%' }, originTransform: '', zIndex: 2, px: 4, py: 3, extraStyle: { objectFit: 'cover', height: '18%', objectPosition: 'center' } },
      { src: '/site-media/cloud11.png', alt: 'cloud left', pos: { left: '-6%', bottom: '0%' }, size: { width: '40vw', maxWidth: 560 }, originTransform: '', zIndex: 2, px: 8, py: 5, extraStyle: { mixBlendMode: 'screen', opacity: 0.9 } },
      { src: '/site-media/cloud11.png', alt: 'cloud right', pos: { right: '-6%', bottom: '0%' }, size: { width: '36vw', maxWidth: 480 }, originTransform: 'scaleX(-1)', zIndex: 2, px: -8, py: 5, extraStyle: { mixBlendMode: 'screen', opacity: 0.85 } },
    ],
  },
  {
    id: 's4',
    bg: '/site-media/sld4-bg.jpeg',
    textColor: '#fff',
    headline: ['automate', 'your', 'business'],
    headlineSize: 'clamp(44px, 6.5vw, 90px)',
    sub: '200+ completed projects. 4 years of optimization. Together with you from start to finish.',
    cta: 'MORE',
    ctaHref: 'https://t.me/telebotsnowayrm',
    ctaDark: false,
    layers: [
      { src: '/site-media/ufo.png', alt: 'ufo main', pos: { left: '50%', top: '2%' }, size: { width: '28vw', maxWidth: 420 }, originTransform: 'translateX(-50%)', zIndex: 3, px: 20, py: 16 },
      { src: '/site-media/ufo.png', alt: 'ufo left', pos: { left: '16%', top: '8%' }, size: { width: '14vw', maxWidth: 200 }, originTransform: '', zIndex: 2, px: 12, py: 10, extraStyle: { opacity: 0.9 } },
      { src: '/site-media/ufo.png', alt: 'ufo right', pos: { right: '8%', top: '4%' }, size: { width: '16vw', maxWidth: 220 }, originTransform: '', zIndex: 2, px: -14, py: 10, extraStyle: { opacity: 0.9 } },
      { src: '/site-media/cloud11.png', alt: 'cloud', pos: { left: '50%', top: '20%' }, size: { width: '38vw', maxWidth: 520 }, originTransform: 'translateX(-50%)', zIndex: 2, px: 10, py: 8, extraStyle: { opacity: 0.95 } },
      { src: '/site-media/man-field.png', alt: 'man in field', pos: { left: 0, bottom: 0 }, size: { width: '100%' }, originTransform: '', zIndex: 4, px: 4, py: 3, extraStyle: { objectFit: 'cover', height: '55%', objectPosition: 'center top' } },
    ],
  },
];

export const FOOTER_COLS: FooterCol[] = [
  {
    title: 'OUR SITE',
    links: [
      { label: 'telebots.site', href: 'https://telebots.site' },
    ],
  },
  {
    title: 'SOCIAL',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/telebotsnowayrm/profilecard/?igsh=MTMwbTFjdG0wa2Nxcw==' },
      { label: 'Telegram Channel', href: 'https://t.me/TeleBotsNowayrmChannel' },
    ],
  },
  {
    title: 'CONTACT',
    links: [
      { label: 'Звʼязок у Telegram', href: 'https://t.me/telebotsnowayrm' },
    ],
  },
];
