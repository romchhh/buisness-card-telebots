import type { CSSProperties, MutableRefObject } from 'react';

export type SlideLayerItem = {
  src: string;
  alt: string;
  pos: CSSProperties;
  size: CSSProperties;
  originTransform: string;
  zIndex: number;
  px: number;
  py: number;
  extraStyle?: {
    objectFit?: CSSProperties['objectFit'];
    height?: string;
    objectPosition?: string;
    mixBlendMode?: CSSProperties['mixBlendMode'];
    opacity?: number;
  };
};

export type SlideItem = {
  id: string;
  bg: string;
  textColor: string;
  headline: string[];
  headlineSize: string;
  sub: string;
  cta: string | null;
  ctaHref?: string;
  ctaDark?: boolean;
  layers: SlideLayerItem[];
};

export type FooterCol = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export type MouseRef = MutableRefObject<{ x: number; y: number }>;
