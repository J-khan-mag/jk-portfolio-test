import { useEffect, useRef } from 'react';
import { registerMosaic } from '../lib/mosaic';

/**
 * The wall of boxes that a plate assembles out of. Sits over its parent, which
 * must be positioned.
 */
export default function Mosaic({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      canvas.style.display = 'none';
      return;
    }
    return registerMosaic(canvas, host, tone);
  }, [tone]);

  return <canvas ref={ref} className="mosaic" aria-hidden />;
}
