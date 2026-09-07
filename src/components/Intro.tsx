import { useEffect, useRef, useState } from 'react';
import { PROJECTS } from '../data/projects';
import { IMG } from '../data/images';
import '../intro.css';

const PRELOAD = [
  PROJECTS[0].images[0],
  PROJECTS[1].images[0],
  PROJECTS[2].images[0],
  PROJECTS[3].images[0],
].filter(Boolean);

const HALL = IMG['medieval-hall'][0];

/** phones and reduced-motion get the still; everyone else gets the loop */
const wantsVideo = () =>
  typeof window !== 'undefined' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  window.matchMedia('(min-width: 700px)').matches &&
  !(navigator as any).connection?.saveData;

export default function Intro({ onEnter }: { onEnter: () => void }) {
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  /* preload the first plates, and never hold the reader up for longer than a moment */
  useEffect(() => {
    let loaded = 0;
    let raf = 0;
    let shown = 0;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setPct(100);
      window.setTimeout(() => setReady(true), 420);
    };

    PRELOAD.forEach((im) => {
      const img = new Image();
      const tick = () => {
        loaded += 1;
        if (loaded >= PRELOAD.length) finish();
      };
      img.onload = tick;
      img.onerror = tick;
      img.src = im.sm;
    });

    const bail = window.setTimeout(finish, 4200);

    // the counter eases towards whatever has actually arrived, then stops —
    // without the early return a queued frame would overwrite the final 100
    const run = () => {
      if (doneRef.current) {
        setPct(100);
        return;
      }
      const target = (loaded / Math.max(PRELOAD.length, 1)) * 94;
      shown += (target - shown) * 0.14;
      setPct(Math.round(shown));
      raf = requestAnimationFrame(run);
    };
    raf = requestAnimationFrame(run);

    return () => {
      clearTimeout(bail);
      cancelAnimationFrame(raf);
    };
  }, []);

  const enter = () => {
    if (leaving) return;
    setLeaving(true);
    onEnter();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (ready && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, leaving]);

  return (
    <div className={`intro${ready ? ' ready' : ''}${leaving ? ' leaving' : ''}`}>
      {/* the hall, held far back: graded, vignetted, and behind everything */}
      <div className="intro-scene" aria-hidden>
        {wantsVideo() ? (
          <video
            className="intro-scene-media"
            src="/media/hall-loop.mp4"
            poster={HALL.sm}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <img
            className="intro-scene-media"
            src={HALL.sm}
            alt=""
            width={HALL.w}
            height={HALL.h}
            decoding="async"
          />
        )}
        <span className="intro-vignette" />
      </div>

      <div className="intro-rule intro-rule-t" />
      <div className="intro-rule intro-rule-b" />

      <div className="intro-inner">
        <div className="intro-eyebrow">
          <span className="line" />
          <span className="label">Selected Works · Volume I</span>
        </div>

        <h1 className="intro-name">
          <span>
            <i>Jahangir</i>
          </span>
          <span>
            <i>Khan</i>
          </span>
        </h1>

        <div className="intro-role">
          <span className="label">Senior Architect</span>
          <span className="dot" />
          <span className="label">Design &amp; Delivery Management</span>
          <span className="dot" />
          <span className="label">Dubai</span>
        </div>

        <p className="intro-note">
          {PROJECTS.length} projects across the United Arab Emirates, Pakistan, Turkey,
          Portugal and the United States — from live construction on Dubai Creek back to
          the studio work it grew out of.
        </p>
      </div>

      <div className="intro-foot">
        <div className="intro-count num">
          <span>{String(pct).padStart(3, '0')}</span>
          <span className="intro-bar">
            <i style={{ transform: `scaleX(${pct / 100})` }} />
          </span>
        </div>

        <div className="intro-actions">
          <button className="intro-enter" onClick={enter} disabled={!ready}>
            <span className="label">Enter</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
