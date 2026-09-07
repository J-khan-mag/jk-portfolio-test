import { useEffect, useRef } from 'react';
import { LEVELS, PROJECTS, type LevelKey } from '../data/projects';

type Props = {
  active: LevelKey;
  /** the project the reader is pointing at, so its window can light up */
  hot?: string | null;
  /** 0 → 1 through each group, used to light the windows */
  progress: Record<string, number>;
  onPick: (k: LevelKey) => void;
};

/**
 * The register drawn as a building, and the only navigation there is.
 * One storey per group, one window per project, a hatched ground line, and a
 * lift car on the left face that rides to whichever storey is being read.
 * Windows light one by one as you move through a floor.
 */
/** the storey code as it would be written on an elevation: B1, G, L1, L2 … */
function datum(key: string) {
  if (key === 'B1') return 'B1';
  if (key === 'G') return 'G';
  if (key === 'M') return 'M';
  return 'L' + key.replace('+', '');
}

export default function BuildingDiagram({ active, hot, progress, onPick }: Props) {
  const carRef = useRef<HTMLSpanElement>(null);
  const floorRefs = useRef(new Map<LevelKey, HTMLButtonElement>());

  useEffect(() => {
    const el = floorRefs.current.get(active);
    const car = carRef.current;
    if (!el || !car) return;
    car.style.transform = `translateY(${el.offsetTop}px)`;
    car.style.height = `${el.offsetHeight}px`;
  }, [active]);

  return (
    <div className="bld">
      <span className="bld-car" ref={carRef} aria-hidden />

      <div className="bld-stack">
        {LEVELS.map((lv) => {
          const items = PROJECTS.filter((p) => p.level === lv.key);
          const below = lv.key === 'B1';
          const on = active === lv.key;
          const lit = Math.round((progress[lv.key] ?? 0) * items.length);
          return (
            <button
              key={lv.key}
              className={`bld-floor${on ? ' on' : ''}${below ? ' below' : ''}`}
              ref={(el) => {
                if (el) floorRefs.current.set(lv.key, el);
                else floorRefs.current.delete(lv.key);
              }}
              onClick={() => onPick(lv.key)}
              aria-current={on ? 'true' : undefined}
            >
              {/* level datum marker, on the left face */}
              <span className="bld-datum" aria-hidden>
                <span className="bld-datum-tick" />
              </span>

              <span className="bld-head">
                <span className="bld-tag num">{datum(lv.key)}</span>
                <span className="bld-name">{lv.name}</span>
                <span className="bld-count num">
                  {items.length ? String(items.length).padStart(2, '0') : '—'}
                </span>
              </span>

              <span className="bld-sub">{lv.subtitle}</span>

              {/* narrow screens get a plain fill instead of a wall of windows */}
              <span className="bld-track" aria-hidden>
                <i style={{ transform: `scaleX(${progress[lv.key] ?? 0})` }} />
              </span>

              <span className="bld-bay">
                {lv.key === 'G' ? (
                  /* the ground floor holds one occupant */
                  <span className={`win${(progress[lv.key] ?? 0) > 0.05 ? ' lit' : ''}`} />
                ) : items.length === 0 ? (
                  <span className="bld-empty" />
                ) : (
                  items.map((p, i) => (
                    <span
                      key={p.id}
                      className={`win${i < lit ? ' lit' : ''}${hot === p.id ? ' hot' : ''}`}
                    />
                  ))
                )}
              </span>
            </button>
          );
        })}
      </div>

      <span className="bld-ground" aria-hidden />

      <div className="bld-title">
        <span className="bld-title-name">Elevation A&ndash;A</span>
        <span className="bld-title-rule" aria-hidden />
        <span className="bld-title-scale num">Scale 1:50</span>
      </div>
    </div>
  );
}
