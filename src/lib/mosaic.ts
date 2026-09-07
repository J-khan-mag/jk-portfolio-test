/**
 * Mosaic reveal.
 *
 * A plate arrives from below the fold as a wall of fine boxes and forms from
 * the top down, the reveal front following the picture up the screen.
 *
 * Everything is expressed in plate pixels rather than fractions of anything,
 * so the behaviour is directly tunable:
 *
 *   front   how far down the plate the reveal has reached, in px
 *   SOFT    thickness of the ragged band at the front, in px
 *   sweep   = plate height + SOFT, i.e. the scroll distance to form a plate
 *
 * Scrolling leads the front, but the front also creeps on its own, so it
 * never freezes half-built when the reader stops — and it is eased, so it
 * settles rather than snapping.
 */

const CELL = 6; // css px — the size of one box
const SOFT = 520; // px — length of the ragged reveal front
const RAMP = 5; // how sharply a single box drops out within the band
const CREEP = 2.6; // seconds for a plate to finish on its own if scrolling stops
const EASE = 0.09; // how quickly the front settles towards its target

type Tone = 'dark' | 'light';

type Entry = {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  colour: string;
  cols: number;
  rows: number;
  height: number;
  /** uniform 0..1 per cell, so the front edge is granular, not a straight line */
  jitter: Float32Array;
  front: number; // eased, what is drawn
  target: number; // where scrolling says it should be
  creep: number; // the floor the front creeps up to on its own
  drawn: number;
  offset: number;
  entered: boolean;
  done: boolean;
};

const entries = new Set<Entry>();
let raf = 0;
let last = 0;

function hash(x: number, y: number) {
  let h = x * 374761393 + y * 668265263;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

/** how far the plate's top edge sits above the bottom of the window */
function rise(host: HTMLElement) {
  return (window.innerHeight || 0) - host.getBoundingClientRect().top;
}

function build(e: Entry) {
  const r = e.host.getBoundingClientRect();
  const w = Math.max(1, Math.round(r.width));
  const h = Math.max(1, Math.round(r.height));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  e.cols = Math.max(1, Math.ceil(w / CELL));
  e.rows = Math.max(1, Math.ceil(h / CELL));
  e.height = h;

  e.canvas.width = Math.round(w * dpr);
  e.canvas.height = Math.round(h * dpr);
  e.canvas.style.width = w + 'px';
  e.canvas.style.height = h + 'px';

  const ctx = e.canvas.getContext('2d');
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const j = new Float32Array(e.cols * e.rows);
  for (let y = 0; y < e.rows; y++) {
    for (let x = 0; x < e.cols; x++) j[y * e.cols + x] = hash(x, y);
  }
  e.jitter = j;
  e.drawn = -1;
}

/** the whole sweep: the plate's own height, plus the length of the front */
const needed = (e: Entry) => e.height + SOFT;

function paint(e: Entry) {
  const ctx = e.canvas.getContext('2d');
  if (!ctx) return;
  const w = e.cols * CELL;
  ctx.clearRect(0, 0, w, e.rows * CELL);
  ctx.fillStyle = e.colour;

  let alpha = -1;
  for (let y = 0; y < e.rows; y++) {
    const depth = y * CELL + CELL / 2;
    // 0 where the front is, 1 a full band's length behind it
    const f = (e.front - depth) / SOFT;
    if (f >= 1) continue; // this row has formed
    if (f <= 0) {
      // the front has not reached this row — one solid band
      if (alpha !== 1) {
        ctx.globalAlpha = 1;
        alpha = 1;
      }
      ctx.fillRect(0, y * CELL, w, CELL);
      continue;
    }
    const row = y * e.cols;
    for (let x = 0; x < e.cols; x++) {
      let a = (e.jitter[row + x] - f) * RAMP;
      if (a <= 0.02) continue;
      if (a > 1) a = 1;
      if (a !== alpha) {
        ctx.globalAlpha = a;
        alpha = a;
      }
      ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
    }
  }
  ctx.globalAlpha = 1;
}

function frame(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
  last = now;
  raf = 0;
  let live = false;

  entries.forEach((e) => {
    if (e.done) return;

    const scrolled = Math.max(0, rise(e.host) - e.offset);
    if (scrolled > e.target) e.target = scrolled; // never runs backwards
    if (!e.entered && rise(e.host) > 0) e.entered = true;

    // once a plate is on screen the front keeps creeping, so stopping the
    // scroll leaves nothing half-built
    if (e.entered) {
      e.creep = Math.min(needed(e), e.creep + (needed(e) / CREEP) * dt);
      if (e.creep > e.target) e.target = e.creep;
    }

    const delta = e.target - e.front;
    if (Math.abs(delta) > 0.4) {
      e.front += delta * EASE;
      live = true;
    } else {
      e.front = e.target;
    }

    if (Math.abs(e.front - e.drawn) > 0.6) {
      paint(e);
      e.drawn = e.front;
    }

    if (e.front >= needed(e)) {
      e.done = true;
      e.canvas.style.display = 'none';
    } else {
      live = true;
    }
  });

  if (live) raf = requestAnimationFrame(frame);
  else last = 0;
}

function kick() {
  if (!raf) {
    last = 0;
    raf = requestAnimationFrame(frame);
  }
}

let listening = false;
function listen() {
  if (listening) return;
  listening = true;
  // capture, so plates inside their own scrolling panel are driven too
  document.addEventListener('scroll', kick, { passive: true, capture: true });
  window.addEventListener('resize', kick, { passive: true });
}

export function registerMosaic(canvas: HTMLCanvasElement, host: HTMLElement, tone: Tone = 'dark') {
  const e: Entry = {
    canvas,
    host,
    colour: tone === 'light' ? '#eceae4' : '#0a0a0a',
    cols: 1,
    rows: 1,
    height: 1,
    jitter: new Float32Array(1),
    front: 0,
    target: 0,
    creep: 0,
    drawn: -1,
    // a plate already up the screen banks its head start, so it still begins
    // covered and forms from its own top
    offset: Math.max(0, rise(host)),
    entered: false,
    done: false,
  };

  build(e);
  paint(e);
  entries.add(e);
  listen();
  kick();

  const ro = new ResizeObserver(() => {
    if (e.done) return;
    build(e);
    paint(e);
    e.drawn = e.front;
  });
  ro.observe(host);

  return () => {
    ro.disconnect();
    entries.delete(e);
  };
}
