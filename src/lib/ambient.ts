/**
 * Ambience: a low piano, played sparsely into a large stone room.
 *
 * Each note is synthesised rather than sampled — a stack of sine partials
 * stretched by the usual piano inharmonicity law, fn = f1·n·√(1 + B·n²), with
 * the upper partials decaying faster than the lower ones, plus a short
 * filtered hammer noise. Notes are struck every few seconds from a slow modal
 * cycle and left to ring, so they overlap rather than form chords.
 *
 * Nothing is loaded from the network and nothing is licensed.
 */

type Chord = { name: string; notes: number[]; sub: number };

// low, modal, deliberately unresolved
const CYCLE: Chord[] = [
  { name: 'Dm9', notes: [73.42, 110.0, 130.81, 164.81, 220.0], sub: 36.71 },
  { name: 'Bbmaj7', notes: [58.27, 87.31, 146.83, 174.61, 220.0], sub: 29.14 },
  { name: 'Gm11', notes: [49.0, 73.42, 116.54, 130.81, 196.0], sub: 24.5 },
  { name: 'Am(add9)', notes: [55.0, 82.41, 123.47, 164.81, 246.94], sub: 27.5 },
];

const CHORD_SECONDS = 34;
const GAP_MIN = 3.6;
const GAP_MAX = 8.4;

export class Ambient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private voiceBus: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private sub: { osc: OscillatorNode; gain: GainNode } | null = null;
  private noise: AudioBuffer | null = null;

  private chordTimer = 0;
  private noteTimer = 0;
  private chord = 0;
  private lastIndex = -1;
  private started = false;
  private targetGain = 0.34;

  get isRunning() {
    return this.started;
  }

  /**
   * Build the whole graph ahead of the gesture. The convolver's impulse
   * preparation is the expensive part — done here, during the intro's idle
   * time, so the Enter click only has to resume the context.
   */
  prepare() {
    if (this.ctx) return;
    const Ctor: typeof AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;
    this.buildGraph(ctx);
  }

  async start() {
    if (this.started) return;
    this.prepare();
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        /* the toggle lets the reader try again */
      }
    }

    this.begin(ctx);
  }

  private buildGraph(ctx: AudioContext) {
    const master = ctx.createGain();
    master.gain.value = 0;
    this.master = master;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    this.analyser = analyser;

    // overlapping tails can stack up; a gentle ceiling keeps them polite
    const ceiling = ctx.createDynamicsCompressor();
    ceiling.threshold.value = -14;
    ceiling.knee.value = 12;
    ceiling.ratio.value = 4;
    ceiling.attack.value = 0.02;
    ceiling.release.value = 0.5;

    master.connect(analyser);
    analyser.connect(ceiling);
    ceiling.connect(ctx.destination);

    // a long, dark room — the reverb is most of the character
    const room = ctx.createConvolver();
    room.buffer = this.impulse(ctx, 6.5, 2.9);

    const wet = ctx.createGain();
    wet.gain.value = 0.62;
    const dry = ctx.createGain();
    dry.gain.value = 0.5;

    // keep the top end soft so the piano reads as distant rather than bright
    const shade = ctx.createBiquadFilter();
    shade.type = 'lowpass';
    shade.frequency.value = 2100;
    shade.Q.value = 0.4;

    const bus = ctx.createGain();
    bus.gain.value = 1;
    this.voiceBus = bus;

    bus.connect(shade);
    shade.connect(dry).connect(master);
    shade.connect(room).connect(wet).connect(master);

    this.noise = this.hammerNoise(ctx);

    // a barely-there sub, so the low end has floor rather than notes
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    const subGain = ctx.createGain();
    subGain.gain.value = 0.0001;
    subOsc.connect(subGain).connect(master);
    subOsc.start();
    this.sub = { osc: subOsc, gain: subGain };
  }

  private begin(ctx: AudioContext) {
    const master = this.master;
    if (!master) return;
    this.started = true;
    this.setChord(0);
    this.chordTimer = window.setInterval(() => {
      this.chord = (this.chord + 1) % CYCLE.length;
      this.setChord(this.chord);
    }, CHORD_SECONDS * 1000);

    this.scheduleNote(1.2);

    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.linearRampToValueAtTime(this.targetGain, ctx.currentTime + 5);
  }

  private setChord(i: number) {
    const ctx = this.ctx;
    if (!ctx || !this.sub) return;
    const now = ctx.currentTime;
    const g = this.sub.gain.gain;
    const f = this.sub.osc.frequency;
    f.cancelScheduledValues(now);
    f.setValueAtTime(f.value || CYCLE[i].sub, now);
    f.linearRampToValueAtTime(CYCLE[i].sub, now + 6);
    g.cancelScheduledValues(now);
    g.setValueAtTime(Math.max(g.value, 0.0001), now);
    g.linearRampToValueAtTime(0.05, now + 8);
    g.linearRampToValueAtTime(0.028, now + CHORD_SECONDS);
  }

  /** one struck note, left to ring */
  private strike(freq: number, at: number, velocity: number) {
    const ctx = this.ctx;
    const bus = this.voiceBus;
    if (!ctx || !bus) return;

    // low notes ring longer, as they do on a real instrument
    const decay = Math.min(22, 26 - Math.log2(freq / 30) * 3.4);
    const B = 0.00045; // inharmonicity
    const partials = 7;

    const voice = ctx.createGain();
    voice.gain.value = 1;
    voice.connect(bus);

    for (let n = 1; n <= partials; n++) {
      const f = freq * n * Math.sqrt(1 + B * n * n);
      if (f > 6000) break;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;

      const g = ctx.createGain();
      const amp = (velocity * 0.5) / Math.pow(n, 1.45);
      const dec = decay / (1 + 0.42 * (n - 1));

      g.gain.setValueAtTime(0.0001, at);
      g.gain.linearRampToValueAtTime(amp, at + 0.006);
      g.gain.exponentialRampToValueAtTime(0.00008, at + dec);

      osc.connect(g).connect(voice);
      osc.start(at);
      osc.stop(at + dec + 0.15);
      if (n === 1) {
        osc.onended = () => {
          voice.disconnect();
        };
      }
    }

    // felt hammer
    if (this.noise) {
      const src = ctx.createBufferSource();
      src.buffer = this.noise;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = Math.min(freq * 5, 2400);
      bp.Q.value = 0.9;
      const hg = ctx.createGain();
      hg.gain.setValueAtTime(velocity * 0.05, at);
      hg.gain.exponentialRampToValueAtTime(0.0001, at + 0.14);
      src.connect(bp).connect(hg).connect(voice);
      src.start(at);
      src.stop(at + 0.2);
    }
  }

  private scheduleNote(inSeconds: number) {
    this.noteTimer = window.setTimeout(() => {
      const ctx = this.ctx;
      if (!ctx || !this.started) return;
      const chord = CYCLE[this.chord];

      // weighted low: the bottom of the voicing is chosen far more often
      let i = Math.floor(Math.pow(Math.random(), 1.9) * chord.notes.length);
      if (i === this.lastIndex) i = (i + 1) % chord.notes.length;
      this.lastIndex = i;

      const at = ctx.currentTime + 0.06;
      const velocity = 0.55 + Math.random() * 0.4;
      this.strike(chord.notes[i], at, velocity);

      // now and then an open fifth or octave underneath, never a full chord
      if (Math.random() < 0.32) {
        const partner = Math.random() < 0.5 ? chord.notes[i] / 2 : chord.sub * 2;
        if (partner > 22) this.strike(partner, at + 0.02 + Math.random() * 0.06, velocity * 0.55);
      }

      const gap = GAP_MIN + Math.random() * (GAP_MAX - GAP_MIN) + (Math.random() < 0.16 ? 5 : 0);
      this.scheduleNote(gap);
    }, inSeconds * 1000);
  }

  private hammerNoise(ctx: AudioContext) {
    const len = Math.floor(ctx.sampleRate * 0.2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    return buf;
  }

  private impulse(ctx: AudioContext, seconds: number, decay: number) {
    const rate = ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        // a short pre-delay reads as a big room rather than a small plate
        const t = i / len;
        const early = i < rate * 0.02 ? 0.15 : 1;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) * early;
      }
    }
    return buf;
  }

  /** 0 → 1, for anything that wants to move with the music */
  level() {
    const a = this.analyser;
    if (!a) return 0;
    const buf = new Uint8Array(a.frequencyBinCount);
    a.getByteFrequencyData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i];
    return Math.min(1, sum / buf.length / 70);
  }

  setMuted(muted: boolean) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.linearRampToValueAtTime(muted ? 0.0001 : this.targetGain, now + (muted ? 1.4 : 3));
  }

  dispose() {
    clearInterval(this.chordTimer);
    clearTimeout(this.noteTimer);
    this.started = false;
    try {
      this.sub?.osc.stop();
    } catch {
      /* already stopped */
    }
    this.ctx?.close().catch(() => {});
    this.ctx = null;
  }
}

export const ambient = new Ambient();

// a handle for checking the graph is actually producing sound
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  (window as any).__ambient = ambient;
}
