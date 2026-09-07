import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Figure from './Figure';
import ProjectPanel from './ProjectPanel';
import BuildingDiagram from './BuildingDiagram';
import Basement from './Basement';
import Practice from './Practice';
import { AWARDS } from '../data/profile';
import Mosaic from './Mosaic';
import { LEVELS, PROJECTS, type LevelKey, type Project } from '../data/projects';
import '../elevation.css';
import '../basement.css';

type Entry = { p: Project; n: number };

const HERO = PROJECTS[0].images[0];

/** A figure that counts up once, the first time it is seen. */
function Tally({ to }: { to: number }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let start = 0;
    const run = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 900, 1);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(run);
    };
    if (!('IntersectionObserver' in window)) {
      setV(to);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          raf = requestAnimationFrame(run);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span className="num" ref={ref}>
      {v}
    </span>
  );
}

/**
 * The floors and their cards. Memoised: pointer and scroll state live in the
 * parent and change constantly, and none of it affects this subtree.
 */
const FloorGrid = memo(function FloorGrid({
  byLevel,
  openAt,
  onCardEnter,
  onCardLeave,
  registerGroup,
}: {
  byLevel: Map<LevelKey, Entry[]>;
  openAt: (n: number) => void;
  onCardEnter: (id: string) => void;
  onCardLeave: (id: string) => void;
  registerGroup: (key: LevelKey, el: HTMLElement | null) => void;
}) {
  return (
    <>
        {LEVELS.filter((lv) => lv.key !== 'B1' && lv.key !== 'G').map((lv) => {
          const items = byLevel.get(lv.key) ?? [];
          return (
            <section
              key={lv.key}
              className="floor"
              ref={(el) => {
                if (el) registerGroup(lv.key, el);
                else registerGroup(lv.key, null);
              }}
            >
              <div className="floor-head">
                <div className="floor-key">{lv.key}</div>
                <div className="floor-meta">
                  <h2>{lv.name}</h2>
                  <div className="label" style={{ color: 'var(--on-room-3)' }}>{lv.subtitle}</div>
                  <p>{lv.blurb}</p>
                </div>
              </div>

              {items.length > 0 ? (
                <div className="grid">
                  {items.map(({ p, n }, i) => (
                    <button
                      className="card2 rise"
                      key={p.id}
                      style={{ transitionDelay: `${(i % 3) * 70}ms` }}
                      onClick={() => openAt(n)}
                      onMouseEnter={() => onCardEnter(p.id)}
                      onMouseLeave={() => onCardLeave(p.id)}
                    >
                      <div className="card2-img">
                        {p.images[0] && (
                          <Figure
                            img={p.images[0]}
                            alt={p.title}
                            sizes="(max-width: 700px) 92vw, (max-width: 1200px) 44vw, 30vw"
                            className="fill"
                          />
                        )}
                        <Mosaic />
                        {p.video && (
                          <span className="card2-moving label" aria-label="Includes a fly-over">
                            <span className="card2-moving-dot" />
                            Film
                          </span>
                        )}
                        {p.status && (
                          <span className="label status-tag card-live">
                            <span className="dot" />
                            {p.status}
                          </span>
                        )}
                        <span className="card2-wipe" />
                      </div>
                      <div className="card2-meta">
                        <span className="label num">{String(n).padStart(2, '0')}</span>
                        <span className="label">{p.typology}</span>
                      </div>
                      <h3>{p.title}</h3>
                      <div className="loc">{p.location}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="floor-empty label rise">This level is still being written.</div>
              )}

              {lv.key === 'M' && (
                <div className="awards rise">
                  <div className="label" style={{ color: 'var(--on-room-3)' }}>
                    Entries &amp; awards
                  </div>
                  <ul className="sheet-list">
                    {AWARDS.map((a) => (
                      <li key={a.primary}>
                        <span className="sp-1">{a.primary}</span>
                        <span className="sp-3">{a.secondary}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
    </>
  );
});

export default function Elevation({
  muted,
  onToggleSound,
  entered,
  onHome,
}: {
  muted: boolean;
  onToggleSound: () => void;
  entered: boolean;
  onHome: () => void;
}) {
  const [active, setActive] = useState<LevelKey>(LEVELS[0].key);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const [hot, setHot] = useState<string | null>(null);
  const [through, setThrough] = useState<Record<string, number>>({});

  const groupRefs = useRef(new Map<LevelKey, HTMLElement>());
  const progressRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  const heroPlateRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const seenRef = useRef(false);

  const entries: Entry[] = useMemo(() => PROJECTS.map((p, i) => ({ p, n: i + 1 })), []);
  const byLevel = useMemo(() => {
    const m = new Map<LevelKey, Entry[]>();
    LEVELS.forEach((l) => m.set(l.key, entries.filter((e) => e.p.level === l.key)));
    return m;
  }, [entries]);

  /* ── scroll-driven: page progress, per-floor fill, active floor ── */
  useEffect(() => {
    const read = () => {
      rafRef.current = 0;
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(window.scrollY / max, 0), 1);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;

      if (heroPlateRef.current) {
        heroPlateRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.07}px, 0)`;
      }

      const mid = window.innerHeight * 0.42;
      let current: LevelKey | null = null;
      let aboveAll = true;
      let belowAll = true;
      const next: Record<string, number> = {};
      groupRefs.current.forEach((el, key) => {
        const r = el.getBoundingClientRect();
        const t = Math.min(Math.max((mid - r.top) / Math.max(r.height, 1), 0), 1);
        next[key] = t;
        if (r.top <= mid) aboveAll = false;
        if (r.bottom > mid) belowAll = false;
        if (r.top <= mid && r.bottom > mid) current = key;
      });
      // never hold a stale floor: above everything is the top level, below
      // everything is the basement
      if (!current) {
        if (aboveAll) current = LEVELS[0].key;
        else if (belowAll) current = 'B1';
      }
      if (current) setActive(current);
      setThrough((prev) => {
        // only re-render when a window would actually change state
        for (const k of Object.keys(next)) {
          if (Math.abs((prev[k] ?? -1) - next[k]) > 0.02) return next;
        }
        return prev;
      });
    };

    const onScroll = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── reveal cards as they arrive ── */
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.rise:not(.in)'));
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  /* ── the tag that rides with the pointer over a plate ──
     Position is written straight to the node on its own frame loop and eased
     towards the pointer, so entering a new card never makes it jump across
     the screen from wherever it was left. */
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
      if (!seenRef.current) {
        seenRef.current = true;
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
      }
    };
    const loop = () => {
      const p = posRef.current;
      const t = targetRef.current;
      p.x += (t.x - p.x) * 0.2;
      p.y += (t.y - p.y) * 0.2;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goToLevel = useCallback((k: LevelKey) => {
    const el = groupRefs.current.get(k);
    if (el) window.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
  }, []);

  const openAt = useCallback((n: number) => setOpenIdx(n), []);
  const onCardEnter = useCallback((id: string) => {
    setHovering(true);
    setHot(id);
  }, []);
  const onCardLeave = useCallback((id: string) => {
    setHovering(false);
    setHot((h) => (h === id ? null : h));
  }, []);
  const registerGroup = useCallback((key: LevelKey, el: HTMLElement | null) => {
    if (el) groupRefs.current.set(key, el);
    else groupRefs.current.delete(key);
  }, []);

  /* ── deep links: #p-<id> opens that project directly ── */
  useEffect(() => {
    const m = window.location.hash.match(/^#p-(.+)$/);
    if (!m) return;
    const i = PROJECTS.findIndex((p) => p.id === decodeURIComponent(m[1]));
    if (i >= 0) setOpenIdx(i + 1);
  }, []);

  useEffect(() => {
    const id = openIdx === null ? null : PROJECTS[openIdx - 1]?.id;
    const clean = window.location.pathname + window.location.search;
    window.history.replaceState(null, '', id ? `#p-${id}` : clean);
  }, [openIdx]);
  const step = useCallback(
    (d: number) => setOpenIdx((i) => (i === null ? i : ((i - 1 + d + entries.length) % entries.length) + 1)),
    [entries.length]
  );

  const openEntry = openIdx === null ? null : entries[openIdx - 1];

  return (
    <div className={`elev${entered ? " live" : ""}`}>
      <div className="elev-progress" aria-hidden>
        <span ref={progressRef} />
      </div>

      <div ref={cursorRef} className="cursor-tag" aria-hidden>
        <span className={`cursor-tag-in${hovering ? ' on' : ''}`}>
          <span className="label">Open</span>
        </span>
      </div>

      <div className="elev-topbar">
        <div className="brand">
          <button className="nm" onClick={onHome} title="Back to the landing">
            Jahangir Khan
          </button>
          <span className="label" style={{ color: 'var(--on-room-3)' }}>Selected Works</span>
        </div>
        <nav className="topnav">
          <button
            className={`sound-btn${muted ? '' : ' on'}`}
            onClick={onToggleSound}
            aria-pressed={!muted}
            title={muted ? 'Play ambience' : 'Mute ambience'}
          >
            <span className="eq" aria-hidden>
              <i />
              <i />
              <i />
              <i />
            </span>
            <span className="label">{muted ? 'Sound off' : 'Sound on'}</span>
          </button>
        </nav>
      </div>

      {/* ── navigator ── */}
      <aside className="elev-nav">
        <div className="elev-nav-inner">
          <div className="sr">Building elevation showing the group you are reading</div>

          <BuildingDiagram active={active} hot={hot} progress={through} onPick={goToLevel} />

          <a className="nav-contact label" href="mailto:jehangirk94@gmail.com">
            jehangirk94@gmail.com
          </a>
        </div>
      </aside>

      {/* ── content ── */}
      <main className="elev-main">
        <header className="elev-hero">
          <div className="elev-hero-in">
            <h1 className="lines">
              <span><i>From the first</i></span>
              <span><i>line to the</i></span>
              <span><i>finished wall.</i></span>
            </h1>
            <p className="rise">
              Jahangir Khan is a senior architect working between design and delivery —
              leading schemes from first sketch through authority approval, tender and
              construction, and managing the consultants, procurement and site
              coordination that decide whether a drawing survives the journey.
            </p>
            <div className="elev-hero-meta rise">
              {[
                ['Projects', PROJECTS.length],
                ['Built', PROJECTS.filter((p) => p.level === '+3').length],
                ['On site now', PROJECTS.filter((p) => p.level === '+4').length],
                ['Countries', 5],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <span className="label">{k}</span>
                  <Tally to={v as number} />
                </div>
              ))}
            </div>
          </div>
          <div className="hero-plate-wrap">
            <div className="hero-plate" ref={heroPlateRef}>
              <Figure
                img={HERO}
                alt="Keturah Resort, Dubai Creek"
                sizes="(max-width: 900px) 100vw, 40vw"
                className="fill"
                priority
              />
            </div>
            <div className="hero-plate-cap label">Keturah Resort · Dubai Creek · On site</div>
          </div>
          <div className="elev-scrollcue label">Scroll</div>
        </header>

        <FloorGrid
          byLevel={byLevel}
          openAt={openAt}
          onCardEnter={onCardEnter}
          onCardLeave={onCardLeave}
          registerGroup={registerGroup}
        />

        <div ref={(el) => registerGroup('G', el)}>
          <Practice />
        </div>

        <div
          ref={(el) => registerGroup('B1', el)}
        >
          <Basement />
        </div>

        <footer className="elev-foot">
          <div className="label rise" style={{ color: 'var(--on-room-3)' }}>Contact</div>
          <h2 className="rise">Jahangir Khan</h2>
          <p className="rise">Senior Architect · Design &amp; Delivery Management · Dubai, UAE</p>
          <div className="rise foot-links">
            <a href="mailto:jehangirk94@gmail.com">jehangirk94@gmail.com</a>
            <a
              href="https://www.linkedin.com/in/jahangir-khan-97429b82/"
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          </div>
          <p className="credit rise" style={{ marginTop: '2.6em' }}>
            Project imagery for Keturah Resort and Keturah Reserve is published developer
            material, reproduced here to illustrate scope of involvement. All other images
            are the author’s own work.
          </p>
        </footer>
      </main>

      {openEntry && (
        <ProjectPanel
          project={openEntry.p}
          index={openEntry.n}
          total={entries.length}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onClose={() => setOpenIdx(null)}
        />
      )}
    </div>
  );
}
