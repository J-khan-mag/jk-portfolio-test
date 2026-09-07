import { useEffect, useRef, useState } from 'react';
import { useModal } from '../lib/useModal';
import Figure from './Figure';
import Lightbox from './Lightbox';
import Mosaic from './Mosaic';
import VideoPlate from './Plate';
import { LEVELS, type Project } from '../data/projects';

export default function ProjectPanel({
  project,
  index,
  total,
  onPrev,
  onNext,
  onClose,
}: {
  project: Project;
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState<number | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  useModal(panelRef, zoom === null);
  const level = LEVELS.find((l) => l.key === project.level);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoom !== null) return;
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext, zoom]);

  // Moving to another project resets the reading position.
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [project.id]);

  return (
    <>
      <div className="panel-scrim" onClick={onClose} />
      <aside className="panel" role="dialog" aria-modal="true" aria-label={project.title} ref={panelRef} tabIndex={-1}>
        <header className="panel-head">
          <span className="label num">
            {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')} · {project.level}{' '}
            {level?.name}
          </span>
          <div className="panel-nav">
            <button onClick={onPrev} aria-label="Previous project">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button onClick={onNext} aria-label="Next project">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="tbtn label panel-close" onClick={onClose}>
              Close ✕
            </button>
          </div>
        </header>

        <div className="panel-body" ref={bodyRef}>
          {/* keyed so every field re-animates when you step to another project */}
          <div className="panel-intro" key={project.id}>
            {project.status && (
              <span className="label status-tag" style={{ marginBottom: '1.2em' }}>
                <span className="dot" />
                {project.status}
              </span>
            )}
            <h2 className="panel-title">{project.title}</h2>
            <div className="panel-loc">{project.location}</div>
            <p className="panel-text">{project.text}</p>

            <dl className="meta-grid" style={{ marginTop: '2.2em' }}>
              <dt>Typology</dt>
              <dd>{project.typology}</dd>
              <dt>Location</dt>
              <dd>{project.location}</dd>
              <dt>Group</dt>
              <dd>
                {project.level} · {level?.name}
              </dd>
              {project.status && (
                <>
                  <dt>Status</dt>
                  <dd>{project.status}</dd>
                </>
              )}
            </dl>

            <div style={{ marginTop: '2.2em' }}>
              <div className="label" style={{ color: 'var(--ink-3)', marginBottom: '0.9em' }}>Scope</div>
              <ul className="scope-list">
                {project.scope.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="panel-plates" key={`${project.id}-plates`}>
            {project.video && (
              <VideoPlate
                video={project.video}
                alt={`${project.title} — fly-over`}
                caption="Fly-over"
              />
            )}
            {project.images.map((im, i) => (
              <figure key={i} className="panel-plate" style={{ animationDelay: `${120 + i * 60}ms` }}>
                <button onClick={() => setZoom(i)} aria-label={`Enlarge plate ${i + 1}`}>
                  <Figure
                    img={im}
                    alt={`${project.title} — view ${i + 1}`}
                    sizes="(max-width: 900px) 92vw, 620px"
                    variant="contain"
                    className="panel-plate-img"
                  />
                  <Mosaic tone="light" />
                </button>
                <figcaption className="label num">Plate {String(i + 1).padStart(2, '0')}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </aside>

      {zoom !== null && (
        <Lightbox
          project={project}
          index={zoom}
          onIndex={(i) => setZoom(i)}
          onClose={() => setZoom(null)}
        />
      )}
    </>
  );
}
