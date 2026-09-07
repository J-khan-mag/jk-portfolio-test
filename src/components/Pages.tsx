import { createContext, useContext, memo } from 'react';
import Figure from './Figure';
import { LEVELS, PROJECTS, type Project } from '../data/projects';
import type { Img } from '../data/images';
import type { Page } from '../lib/pages';

export type BookCtxValue = {
  spreadOf: Record<string, number>;
  spreadOfLevel: Record<string, number>;
  goTo: (spread: number) => void;
  openLightbox: (project: Project, imageIndex: number) => void;
};

export const BookCtx = createContext<BookCtxValue>({
  spreadOf: {},
  spreadOfLevel: {},
  goTo: () => {},
  openLightbox: () => {},
});

const PAGE_SIZES = '(max-width: 900px) 100vw, 40vw';

/**
 * A plate. `frame` fixes the aspect of the opening so that two plates facing
 * each other across the gutter line up exactly; each image is then covered
 * into it, which costs a small even crop rather than an arbitrary one.
 */
function Plate({
  img,
  alt,
  caption,
  right,
  frame,
  centred,
  onClick,
}: {
  img: Img;
  alt: string;
  caption?: string;
  right?: string;
  frame?: number;
  centred?: boolean;
  onClick?: () => void;
}) {
  const natural = img.w / img.h;
  const ratio = frame ?? natural;
  // only crop when the difference is genuinely small; otherwise show it whole
  const cover = Math.abs(Math.log(ratio / natural)) < 0.22;
  return (
    <div className={`plate-page${centred ? ' centred' : ''}`}>
      <div
        className={`plate-frame${cover ? ' cropped' : ''}`}
        style={{ aspectRatio: `${ratio}` }}
      >
        <Figure img={img} alt={alt} sizes={PAGE_SIZES} variant={cover ? 'cover' : 'contain'} />
      </div>
      {onClick && (
        <button
          data-nodrag
          className="plate-hit"
          onClick={onClick}
          aria-label={`Enlarge ${alt}`}
        />
      )}
      {(caption || right) && (
        <div className="plate-cap">
          <span className="t">{caption}</span>
          {right && <span className="label">{right}</span>}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────── pages ────────────────────────────── */

function Cover() {
  return (
    <div className="cover">
      <div>
        <div className="label" style={{ color: 'var(--on-room-2)' }}>
          Architecture · Interiors · Delivery
        </div>
      </div>
      <div>
        <h1>
          Jahangir
          <br />
          Khan
        </h1>
        <div className="cover-rule" />
        <div className="sub">Selected Works — Volume I</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
        <div className="label" style={{ color: 'var(--on-room-3)' }}>
          Dubai · Lahore · Islamabad · Lisbon
        </div>
        <div className="label num" style={{ color: 'var(--on-room-3)' }}>
          {PROJECTS.length}
        </div>
      </div>
    </div>
  );
}

function Statement() {
  const built = PROJECTS.filter((p) => p.level === '+3').length;
  return (
    <div className="page dark">
      <div
        className="page-pad stagger"
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5em', justifyContent: 'center', height: '100%' }}
      >
        <div className="label" style={{ color: 'var(--on-room-3)' }}>On this practice</div>
        <p
          style={{
            fontSize: 'clamp(13px,1.35vw,25px)',
            fontWeight: 300,
            letterSpacing: '-0.03em',
            lineHeight: 1.28,
            margin: 0,
          }}
        >
          From the first line to the finished wall — the whole journey of a
          drawing, carried by one hand.
        </p>
        <p className="ptext" style={{ color: 'var(--on-room-2)' }}>
          This volume collects {PROJECTS.length} projects across the United Arab Emirates,
          Pakistan, Turkey, Portugal and the United States — {built} of them built and
          occupied, two on site today, and the rest carried to authority approval,
          tender, or kept deliberately as studies.
        </p>
        <p className="ptext" style={{ color: 'var(--on-room-2)' }}>
          They are ordered the way a building is, by level. Ground is where the studying
          happened; each floor above it is closer to something standing. Read it in
          either direction.
        </p>
      </div>
      <div className="folio">
        <span className="label">Jahangir Khan</span>
        <span className="label">Selected Works</span>
      </div>
    </div>
  );
}

function Contents() {
  const { spreadOfLevel, goTo } = useContext(BookCtx);

  return (
    <div className="page">
      <div
        className="page-pad stagger"
        style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2.2vh,26px)', height: '100%' }}
      >
        <div className="eyebrow">
          <span className="label">Contents</span>
          <span className="line" />
        </div>

        <p className="ptext" style={{ marginBottom: '0.4em' }}>
          {PROJECTS.length} projects, grouped as they were in the original register — by
          the stage each one reached, from work standing on site down to work that stayed
          on the drawing board.
        </p>

        <ul className="contents-list levels">
          {LEVELS.map((lv) => {
            const count = PROJECTS.filter((p) => p.level === lv.key).length;
            return (
              <li key={lv.key}>
                <button className="clink" onClick={() => goTo(spreadOfLevel[lv.key] ?? 0)}>
                  <span className="n">{lv.key}</span>
                  <span className="lv-body">
                    <span className="t">{lv.name}</span>
                    <span className="lv-sub">{lv.subtitle}</span>
                  </span>
                  <span className="sp" />
                  <span className="pg num">{count ? String(count).padStart(2, '0') : '—'}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div style={{ marginTop: 'auto' }}>
          <p className="credit" style={{ color: 'var(--ink-3)' }}>
            Press <strong>I</strong> for the index · <strong>←</strong> <strong>→</strong> to turn ·
            click any plate to enlarge
          </p>
        </div>
      </div>
      <div className="folio">
        <span className="label">Contents</span>
        <span className="label num">02</span>
      </div>
    </div>
  );
}

function DividerA({ level, count }: { level: (typeof LEVELS)[number]; count: number }) {
  return (
    <div className="plate-page chapter-plate">
      <div className="plate-frame cropped" style={{ aspectRatio: '1.5' }}>
        <Figure img={level.cover} alt={level.name} sizes={PAGE_SIZES} className="fill" />
      </div>
      {/* the facing page names the group — this side just carries the mark */}
      <div className="chapter-cap stagger">
        <div className="chapter-key">{level.key}</div>
      </div>
      <div className="folio">
        <span className="label">{level.subtitle}</span>
        <span className="label num">
          {count} {count === 1 ? 'project' : 'projects'}
        </span>
      </div>
    </div>
  );
}

function DividerB({ level, count }: { level: (typeof LEVELS)[number]; count: number }) {
  const { spreadOf, goTo } = useContext(BookCtx);
  const items = PROJECTS.filter((p) => p.level === level.key);

  return (
    <div className="divider">
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px,1.4vh,18px)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span
            style={{
              fontSize: 'clamp(28px,3.4vw,62px)',
              fontWeight: 200,
              letterSpacing: '-0.05em',
              lineHeight: 1,
            }}
          >
            {level.key}
          </span>
          <span className="label" style={{ color: 'var(--ink-3)' }}>Level</span>
        </div>
        <h2>{level.name}</h2>
        <div className="label" style={{ color: 'var(--ink-3)' }}>{level.subtitle}</div>
        <p style={{ marginTop: '0.4em' }}>{level.blurb}</p>

        {items.length > 0 ? (
          <ul className={`contents-list${items.length > 14 ? ' two-col' : ''}`} style={{ marginTop: '0.7em' }}>
            {items.map((p, i) => (
              <li key={p.id}>
                <button className="clink" onClick={() => goTo(spreadOf[p.id] ?? 0)}>
                  <span className="n num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="t">{p.title}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="label" style={{ color: 'var(--ink-3)', marginTop: '0.8em' }}>
            To be announced
          </div>
        )}
      </div>
      <div className="folio">
        <span className="label num">{level.key}</span>
        <span className="label">{level.name}</span>
      </div>
    </div>
  );
}

function ProjectA({ project, index, frame }: { project: Project; index: number; frame: number }) {
  const { openLightbox } = useContext(BookCtx);
  const img = project.images[0];
  if (!img) return <div className="page" />;
  return (
    <>
      <Plate
        img={img}
        alt={`${project.title}, ${project.location}`}
        caption={project.title}
        right={project.typology}
        frame={frame}
        onClick={() => openLightbox(project, 0)}
      />
      <div className="folio">
        <span className="label num">{String(index).padStart(2, '0')}</span>
        <span className="label num">{project.level}</span>
      </div>
    </>
  );
}

function ProjectB({ project, index }: { project: Project; index: number }) {
  const { openLightbox } = useContext(BookCtx);
  const thumbs = project.images.slice(1, 3);

  return (
    <div className="page">
      <div
        className="page-pad stagger"
        style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(9px,1.6vh,20px)', height: '100%' }}
      >
        <div className="eyebrow">
          <span className="label num">{String(index).padStart(2, '0')}</span>
          <span className="line" />
          {project.status ? (
            <span className="label status-tag">
              <span className="dot" />
              {project.status}
            </span>
          ) : (
            <span className="label num">{project.level}</span>
          )}
        </div>

        <div>
          <h2 className="ptitle">{project.title}</h2>
          <div className="ploc">{project.location}</div>
        </div>

        <p className="ptext">{project.text}</p>

        <dl className="meta-grid">
          <dt>Level</dt>
          <dd>
            {project.level} · {LEVELS.find((l) => l.key === project.level)?.name}
          </dd>
          <dt>Typology</dt>
          <dd>{project.typology}</dd>
          {project.status && (
            <>
              <dt>Status</dt>
              <dd>{project.status}</dd>
            </>
          )}
        </dl>

        <div>
          <div className="label" style={{ color: 'var(--ink-3)', marginBottom: '0.7em' }}>Scope</div>
          <ul className="scope-list">
            {project.scope.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        {thumbs.length > 0 && (
          <div className="thumbs" style={{ marginTop: 'auto' }} data-nodrag>
            {thumbs.map((im, i) => (
              <button
                className="thumb"
                key={i}
                onClick={() => openLightbox(project, i + 1)}
                aria-label={`Enlarge image ${i + 2} of ${project.title}`}
              >
                <Figure img={im} alt={`${project.title} — view ${i + 2}`} sizes="20vw" className="fill" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="folio">
        <span className="label">{project.title}</span>
        <span className="label num">
          {String(project.images.length).padStart(2, '0')} images
        </span>
      </div>
    </div>
  );
}

function PlatePage({
  project,
  image,
  imageIndex,
  frame,
}: {
  project: Project;
  image: Img;
  imageIndex: number;
  frame: number;
}) {
  const { openLightbox } = useContext(BookCtx);
  return (
    <Plate
      img={image}
      alt={`${project.title} — view ${imageIndex + 1}`}
      caption={project.title}
      right={`Plate ${String(imageIndex + 1).padStart(2, '0')}`}
      frame={frame}
      centred
      onClick={() => openLightbox(project, imageIndex)}
    />
  );
}

function ContactA() {
  const items = [
    ['Levels', '5'],
    ['Projects', String(PROJECTS.length)],
    ['Built', String(PROJECTS.filter((p) => p.level === '+3').length)],
    ['On site now', String(PROJECTS.filter((p) => p.level === '+4').length)],
    ['Countries', '4'],
    ['Plates', String(PROJECTS.reduce((n, p) => n + p.images.length, 0))],
  ];
  return (
    <div className="page">
      <div
        className="page-pad stagger"
        style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px,2vh,24px)', height: '100%', justifyContent: 'center' }}
      >
        <div className="eyebrow">
          <span className="label">The volume, counted</span>
          <span className="line" />
        </div>
        <dl className="tally">
          {items.map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd className="num">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="folio">
        <span className="label">Colophon</span>
        <span className="label">Vol. I</span>
      </div>
    </div>
  );
}

function ContactB() {
  return (
    <div className="endcard">
      <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(11px,1.9vh,24px)' }}>
        <div className="label" style={{ color: 'var(--on-room-3)' }}>Contact</div>
        <h2
          style={{
            fontSize: 'clamp(21px,2.5vw,46px)',
            fontWeight: 300,
            letterSpacing: '-0.032em',
            margin: 0,
            lineHeight: 1.02,
          }}
        >
          Jahangir Khan
        </h2>
        <div className="ploc" style={{ color: 'var(--on-room-2)' }}>
          Architect · Design &amp; Delivery Management · Dubai, UAE
        </div>
        <dl className="meta-grid dark">
          <dt>Email</dt>
          <dd>
            <a href="mailto:jehangirk94@gmail.com">jehangirk94@gmail.com</a>
          </dd>
          <dt>Based in</dt>
          <dd>Dubai, United Arab Emirates</dd>
          <dt>Working across</dt>
          <dd>UAE · Pakistan · Portugal · USA</dd>
        </dl>
        <p className="credit" style={{ marginTop: '0.7em' }}>
          Project imagery for Keturah Resort and Keturah Reserve is published developer
          material, reproduced here to illustrate scope of involvement. All other images
          are the author’s own work. Reproduction of any drawing or visualisation in this
          volume requires written permission.
        </p>
      </div>
      <div className="folio">
        <span className="label">Colophon</span>
        <span className="label">Vol. I</span>
      </div>
    </div>
  );
}

function BackCover() {
  return (
    <div className="cover" style={{ justifyContent: 'flex-end' }}>
      <div>
        <div className="cover-rule" style={{ margin: '0 0 1.3em' }} />
        <div className="label" style={{ color: 'var(--on-room-2)' }}>
          Selected Works — Volume I
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────── switch ────────────────────────────── */

function PageBodyInner({ page }: { page: Page }) {
  switch (page.kind) {
    case 'cover':
      return <Cover />;
    case 'statement':
      return <Statement />;
    case 'contents':
      return <Contents />;
    case 'divider-a':
      return <DividerA level={page.level} count={page.count} />;
    case 'divider-b':
      return <DividerB level={page.level} count={page.count} />;
    case 'project-a':
      return <ProjectA project={page.project} index={page.index} frame={page.frame} />;
    case 'project-b':
      return <ProjectB project={page.project} index={page.index} />;
    case 'plate':
      return (
        <PlatePage
          project={page.project}
          image={page.image}
          imageIndex={page.imageIndex}
          frame={page.frame}
        />
      );
    case 'contact-a':
      return <ContactA />;
    case 'contact-b':
      return <ContactB />;
    case 'backcover':
      return <BackCover />;
    default:
      return null;
  }
}

export const PageBody = memo(PageBodyInner);
