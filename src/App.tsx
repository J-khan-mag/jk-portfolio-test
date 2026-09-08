import { useCallback, useEffect, useRef, useState } from 'react';
import Elevation, { type Stage } from './components/Elevation';
import Intro from './components/Intro';
import { ambient } from './lib/ambient';
import { lockScroll, unlockScroll } from './lib/useModal';

const ENTERED_KEY = 'jk-entered';

const wasEntered = () => {
  try {
    return sessionStorage.getItem(ENTERED_KEY) === '1';
  } catch {
    return false;
  }
};

/* The isometric entrance is a wide-frame shot. Phones get the flat page, as
   does anyone who asked for reduced motion, and any browser that cannot
   register a CSS property — the collapse is driven by one, and without it
   the layers would snap rather than fall. */
const wantsAssemble = () =>
  typeof window !== 'undefined' &&
  typeof CSS !== 'undefined' &&
  'registerProperty' in CSS &&
  window.matchMedia('(min-width: 901px)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* The entrance timeline, t = 0 at the Enter click:
     0.00  curtain starts lifting; the page is seen exploded, camera drifting
           (rotateZ −34° → −26°, scale 0.58 → 0.61)
     1.40  collapse begins — every layer falls onto one plane (2400ms, --ease)
     3.80  flat. The hero animations fire here instead of on Enter. */
const DRIFT_MS = 1400;
const COLLAPSE_MS = 2400;

export default function App() {
  // returning visitors in the same session skip the curtain; sound stays off
  // until they ask, because autoplay needs a gesture anyway
  const [entered, setEntered] = useState(wasEntered);
  const [showIntro, setShowIntro] = useState(() => !wasEntered());
  const [muted, setMuted] = useState(true);
  const [stage, setStage] = useState<Stage>(() =>
    wasEntered() || !wantsAssemble() ? 'flat' : 'exploded'
  );
  // true only when the flat page was reached through the entrance
  const [assembled, setAssembled] = useState(false);
  // for a moment after landing, both grains are up and crossfading
  const [grainSwap, setGrainSwap] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  /* the collapse has finished: the page is flat, the hero may speak, and the
     grain hands over from the plain wash to the blended one */
  const land = useCallback(() => {
    setStage((s) => {
      if (s !== 'collapsing') return s;
      setAssembled(true);
      setGrainSwap(true);
      timers.current.push(window.setTimeout(() => setGrainSwap(false), 850));
      return 'flat';
    });
  }, []);

  const onEnter = useCallback(() => {
    setEntered(true);
    try {
      sessionStorage.setItem(ENTERED_KEY, '1');
    } catch {
      /* private mode */
    }
    // stay mounted long enough for the curtain to finish lifting
    window.setTimeout(() => setShowIntro(false), 1300);
    if (wantsAssemble()) {
      setStage('drifting');
      timers.current.push(
        window.setTimeout(() => setStage('collapsing'), DRIFT_MS),
        // the transition's own end event lands the page; this only catches a
        // browser that never fires it
        window.setTimeout(land, DRIFT_MS + COLLAPSE_MS + 500)
      );
    } else {
      setStage('flat');
    }
    // this call is inside the click handler, which is what unlocks audio
    ambient.start().then(() => setMuted(false));
  }, []);

  const toggleSound = useCallback(() => {
    if (!ambient.isRunning) {
      ambient.start().then(() => setMuted(false));
      return;
    }
    setMuted((m) => {
      ambient.setMuted(!m);
      return !m;
    });
  }, []);

  /* a fresh entry always starts at the top — the browser otherwise restores
     the previous session's scroll position behind the curtain, and the
     elevation reads G or B1 before anything has been seen */
  useEffect(() => {
    if (!showIntro) return;
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // build the audio graph while the intro plays, off the interaction path
    const idle = (window as any).requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 400));
    idle(() => ambient.prepare());
    return () => {
      clearTimers();
      ambient.dispose();
    };
  }, []);

  /* the brand takes you back to the landing — and the page goes back to its
     exploded state behind the curtain, so entering replays the assembly */
  const goHome = useCallback(() => {
    clearTimers();
    window.scrollTo(0, 0);
    setEntered(false);
    setShowIntro(true);
    setAssembled(false);
    setGrainSwap(false);
    setStage(wantsAssemble() ? 'exploded' : 'flat');
    try {
      sessionStorage.removeItem(ENTERED_KEY);
    } catch {
      /* private mode */
    }
  }, []);

  // the page is held still through the curtain and the collapse, using the
  // same counter the dialogs use, so an open panel is never accidentally released
  useEffect(() => {
    if (entered && stage === 'flat') return;
    lockScroll();
    return unlockScroll;
  }, [entered, stage]);

  return (
    <>
      <Elevation
        muted={muted}
        onToggleSound={toggleSound}
        entered={entered}
        stage={stage}
        assembled={assembled}
        onHome={goHome}
        onSettled={land}
      />
      {showIntro && <Intro onEnter={onEnter} />}
      {/* A plain wash of grain sits under the curtain from the first frame, so
          the scene is never seen without it; the blended grain only mounts once
          the page has landed flat, because blending over a full-screen layer in
          motion is what made the landing stutter. */}
      {entered && (stage !== 'flat' || grainSwap) && (
        <div className={`grain-overlay plain${grainSwap ? ' leave' : ''}`} aria-hidden />
      )}
      {entered && !showIntro && stage === 'flat' && (
        <div className={`grain-overlay${grainSwap ? ' arrive' : ''}`} aria-hidden />
      )}
    </>
  );
}
