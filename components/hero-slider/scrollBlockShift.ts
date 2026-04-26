/**
 * Scroll-driven Y shift for full-viewport blocks:
 * - Scrolling down: current block content moves up (negative Y), next enters from below (positive → 0).
 * - Scrolling up: the inverse (symmetric in scroll position).
 */
export function computeScrollBlockShift(
  scrollTop: number,
  viewportH: number,
  blockIndex: number,
  shift: number,
): number {
  const H = viewportH < 1 ? 1 : viewportH;
  const k = blockIndex;
  const st = scrollTop;

  if (st >= (k + 1) * H) return -shift;
  if (st >= k * H && st < (k + 1) * H) {
    const p = (st - k * H) / H;
    return -p * shift;
  }
  if (st >= (k - 1) * H && st < k * H) {
    const p = (st - (k - 1) * H) / H;
    return (1 - p) * shift;
  }
  if (st < (k - 1) * H) return shift;
  return 0;
}

function smoothstep01(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/**
 * One snap "page" height in px. Prefer the first section's layout height — on mobile it often
 * differs from `scrollRoot.clientHeight` (100svh vs inner layout), which breaks fly math if
 * `clientHeight` is used as H.
 */
export function getScrollBlockHeightPx(scrollRoot: HTMLElement): number {
  const first = scrollRoot.firstElementChild as HTMLElement | null;
  if (first && first.offsetHeight > 1) return first.offsetHeight;
  return scrollRoot.clientHeight || 1;
}

/** Max fly distance (px) for one viewport — multiply per-layer for stagger. */
export function getScrollFlyDistancePx(viewportH: number, mobileBoost = 1): number {
  const H = viewportH < 1 ? 1 : viewportH;
  const b = Math.min(Math.max(mobileBoost, 1), 1.24);
  return H * 0.5 * b;
}

/**
 * Full fly-in / fly-out Y (px) for block k from scroll position alone (works up & down).
 * - Entering from below: +flyPx → 0. Exiting upward: 0 → -flyPx.
 */
export function computeBlockFlyY(
  scrollTop: number,
  viewportH: number,
  blockIndex: number,
  flyPx: number,
): number {
  const H = viewportH < 1 ? 1 : viewportH;
  const k = blockIndex;
  const st = scrollTop;
  const t0 = (k - 1) * H;
  const t1 = k * H;
  const t2 = (k + 1) * H;

  if (st <= t0) return flyPx;
  if (st >= t2) return -flyPx;
  if (st < t1) {
    const p = (st - t0) / H;
    return (1 - smoothstep01(p)) * flyPx;
  }
  const p = (st - t1) / H;
  return -smoothstep01(p) * flyPx;
}
