import { useEffect, useRef, useState } from 'react';
import Figure from './Figure';
import Mosaic from './Mosaic';
import { TIMELINE, ASIDES, INTERESTS } from '../data/basement';
import { IMG } from '../data/images';

/**
 * B1. Below the ground line, and deliberately not on the way to anywhere —
 * you have to open it.
 *
 * Nothing architectural lives here. Schools, qualifications, software and
 * competitions all sit upstairs; this level is only the person.
 */
export default function Basement() {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = bodyRef.current;
    if (!el) return;
    const t = window.setTimeout(
      () => el.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      160
    );
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.b1 .rise:not(.in)'));
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [open]);

  return (
    <section className={`b1${open ? ' open' : ''}`} aria-label="B1 — basement">
      <div className="ground-line" aria-hidden>
        <span />
      </div>

      <button className="b1-hatch" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="b1-hatch-key num">B1</span>
        <span className="b1-hatch-mid">
          <span className="label">{open ? 'Close the basement' : 'There is a level below'}</span>
          <span className="b1-hatch-sub">
            {open ? '' : 'Where I am from, and what fills the rest of the hours'}
          </span>
        </span>
        <span className={`b1-hatch-mark${open ? ' up' : ''}`} aria-hidden>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="b1-body" ref={bodyRef}>
          <header className="b1-head rise">
            <div className="label">B1 · Off the record</div>
            <h2>
              A village in the north,
              <br />
              then a long way round.
            </h2>
          </header>

          {/* ---- the timeline ---- */}
          <div className="tl rise">
            <div className="tl-rail" aria-hidden />
            <ol className="tl-stops">
              {TIMELINE.map((s, i) => (
                <li key={s.place} style={{ transitionDelay: `${i * 70}ms` }}>
                  <span className="tl-node" aria-hidden />
                  <span className="tl-year num">{s.years}</span>
                  <span className="tl-place">{s.place}</span>
                  <span className="tl-region">{s.region}</span>
                  <span className="tl-note">{s.note}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* ---- the asides ---- */}
          <div className="b1-asides">
            {ASIDES.map((a) => (
              <article key={a.key} className="aside rise">
                {a.image && IMG[a.image] && (
                  <div className="aside-plate">
                    <Figure
                      img={IMG[a.image][0]}
                      alt={a.title}
                      sizes="(max-width: 900px) 92vw, 30vw"
                      className="fill"
                    />
                    <Mosaic />
                  </div>
                )}
                <div className="label aside-meta">{a.meta}</div>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
                {a.link && (
                  <a href={a.link.href} target="_blank" rel="noreferrer noopener">
                    {a.link.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M7 17L17 7M9 7h8v8" />
                    </svg>
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className="b1-tail rise">
            <div className="label" style={{ color: 'var(--on-room-3)' }}>The rest of the hours</div>
            <ul className="sheet-tags b1-tags">
              {INTERESTS.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
