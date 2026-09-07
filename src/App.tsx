import { useCallback, useEffect, useState } from 'react';
import Elevation from './components/Elevation';
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

export default function App() {
  // returning visitors in the same session skip the curtain; sound stays off
  // until they ask, because autoplay needs a gesture anyway
  const [entered, setEntered] = useState(wasEntered);
  const [showIntro, setShowIntro] = useState(() => !wasEntered());
  const [muted, setMuted] = useState(true);

  const onEnter = useCallback(() => {
    setEntered(true);
    try {
      sessionStorage.setItem(ENTERED_KEY, '1');
    } catch {
      /* private mode */
    }
    // stay mounted long enough for the curtain to finish lifting
    window.setTimeout(() => setShowIntro(false), 1300);
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
    return () => ambient.dispose();
  }, []);

  /* the brand takes you back to the landing */
  const goHome = useCallback(() => {
    window.scrollTo(0, 0);
    setEntered(false);
    setShowIntro(true);
    try {
      sessionStorage.removeItem(ENTERED_KEY);
    } catch {
      /* private mode */
    }
  }, []);

  // the curtain holds the page still through the same counter the dialogs use,
  // so an open panel is never accidentally released
  useEffect(() => {
    if (entered) return;
    lockScroll();
    return unlockScroll;
  }, [entered]);

  return (
    <>
      <Elevation muted={muted} onToggleSound={toggleSound} entered={entered} onHome={goHome} />
      {showIntro && <Intro onEnter={onEnter} />}
      {/* the blended grain only mounts once the curtain is gone — blending over
          an animating full-screen layer is what made the landing stutter */}
      {entered && !showIntro && <div className="grain-overlay" aria-hidden />}
    </>
  );
}
