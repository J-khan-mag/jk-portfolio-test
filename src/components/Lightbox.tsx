import { useCallback, useEffect, useRef } from 'react';
import { useModal } from '../lib/useModal';
import type { Project } from '../data/projects';

type Props = {
  project: Project;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
};

export default function Lightbox({ project, index, onIndex, onClose }: Props) {
  const total = project.images.length;
  const safe = Math.min(Math.max(index, 0), total - 1);
  const img = project.images[safe];
  const touchStart = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useModal(rootRef, true);

  const step = useCallback(
    (d: number) => onIndex((safe + d + total) % total),
    [safe, total, onIndex]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  // Preload the neighbours so stepping through feels instant.
  useEffect(() => {
    [safe + 1, safe - 1].forEach((i) => {
      const n = project.images[(i + total) % total];
      if (n) {
        const im = new Image();
        im.src = n.src;
      }
    });
  }, [safe, total, project]);

  if (!img) return null;

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — image viewer`}
      ref={rootRef}
      tabIndex={-1}
      onClick={onClose}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const s = touchStart.current;
        touchStart.current = null;
        if (s === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? s) - s;
        if (Math.abs(dx) > 46) step(dx < 0 ? 1 : -1);
      }}
    >
      <div className="lb-bar" onClick={(e) => e.stopPropagation()}>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(15px,1.4vw,25px)', color: '#f0ead9' }}>
            {project.title}
          </div>
          <div className="label" style={{ color: 'rgba(240,234,219,.45)', marginTop: 3 }}>
            {project.location}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span className="label" style={{ color: 'rgba(240,234,219,.45)' }}>
            {String(safe + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <button className="tbtn label" onClick={onClose} aria-label="Close viewer">
            Close ✕
          </button>
        </div>
      </div>

      <div className="lb-stage" onClick={onClose}>
        <img
          key={img.src}
          src={img.src}
          alt={`${project.title} — view ${safe + 1}`}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {total > 1 && (
        <>
          <button
            className="lb-nav p"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            className="lb-nav n"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next image"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="lb-foot" onClick={(e) => e.stopPropagation()}>
            {project.images.map((_, i) => (
              <button
                key={i}
                className={`lb-dot${i === safe ? ' on' : ''}`}
                onClick={() => onIndex(i)}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
