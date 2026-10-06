import { gsap, prefersReducedMotion, transitionState } from "@/lib/gsap";

/**
 * Every hairline on the site is a string. A fine pointer that crosses one slowly takes hold of it and
 * the string bends with the cursor until it slips off and rings; a quick crossing strums it, and lines
 * carried past a resting cursor by the scroll are strummed where they pass. On touch screens the finger
 * moves with the page, so the middle of the screen plays the part of a music box comb instead: every
 * line scrolled past it rings, harder for a faster flick, struck where the thumb last was.
 * Motion is modal (eight damped harmonics advanced exactly each frame), so it stays stable at any frame
 * rate. One ticker runs only while something can move; with reduced motion every line stays a still rule.
 */

const MODES = 8;
/** px/s: a fine pointer crossing slower than this takes hold of the string instead of strumming it. */
const HOLD_SPEED = 650;
/** px of swing per px/s of crossing speed. */
const STRUM_GAIN = 0.0075;
const STRUM_MIN = 1.6;
/** A held string slips off a cursor that has stopped moving for this long. */
const HOLD_IDLE = 900;
/** The ticker sleeps after this long without input or motion. */
const IDLE = 450;
/** Below this swing, in px, a string is still. */
const STILL = 0.035;
/** Touch screens: the comb sits a little below the middle of the screen. */
const COMB = 0.55;
/** px/s: slower passes over the comb (a reveal settling, a nudge) do not sound. */
const COMB_SPEED = 140;

export type StringHandle = {
  /** Strike the string at `at` (0..1 along it) with a swing of `amp` px. */
  pluck: (at: number, amp: number, dir?: 1 | -1) => void;
  /** Whether pointers and fingers can play it (the hero string only listens once it exists). */
  setInteractive: (on: boolean) => void;
  dispose: () => void;
};

type Parts = { host: HTMLElement; rest: HTMLElement; svg: SVGSVGElement; path: SVGPathElement };

type Str = Parts & {
  amp: number;
  pitch: number;
  sustain: number;
  restAlpha: number;
  peakAlpha: number;
  width: number;
  pts: number;
  xs: Float32Array;
  table: Float32Array;
  w: Float64Array;
  g: Float64Array;
  x: Float64Array;
  v: Float64Array;
  live: boolean;
  visible: boolean;
  interactive: boolean;
  grab: { at: number; d: number } | null;
  last: number | null;
};

const all = new Set<Str>();
const pointer = { x: -1, y: -1, on: false, fine: false };
let lastInput = 0;
let running = false;
let installed = false;
let io: IntersectionObserver | null = null;
let coarse: MediaQueryList | null = null;
let ro: ResizeObserver | null = null;
const byTarget = new Map<Element, Str>();
const scratch = new Float64Array(MODES);

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Fourier coefficients of a string pulled into a triangle of height `h` at `at`. */
const triangle = (at: number, h: number, out: Float64Array) => {
  const p = clamp(at, 0.04, 0.96);
  for (let n = 0; n < MODES; n++) {
    const k = n + 1;
    out[n] = (2 * h * Math.sin(k * Math.PI * p)) / (k * k * Math.PI * Math.PI * p * (1 - p));
  }
};

/** Sample table and harmonic frequencies for the string's current width. Longer strings ring lower. */
const layout = (s: Str) => {
  const width = s.host.getBoundingClientRect().width;
  if (!width || width === s.width) return;
  s.width = width;
  s.pts = clamp(Math.round(width / 10), 24, 140);
  s.xs = new Float32Array(s.pts);
  s.table = new Float32Array(s.pts * MODES);
  for (let i = 0; i < s.pts; i++) {
    const t = i / (s.pts - 1);
    s.xs[i] = t * width;
    for (let n = 0; n < MODES; n++) s.table[i * MODES + n] = Math.sin((n + 1) * Math.PI * t);
  }
  const f1 = clamp(3.4 * Math.sqrt(1200 / Math.max(width, 120)), 2.4, 7) * s.pitch;
  for (let n = 0; n < MODES; n++) {
    const k = n + 1;
    s.w[n] = 2 * Math.PI * f1 * k * Math.sqrt(1 + 0.0025 * k * k);
    s.g[n] = (2 * (1 + 0.32 * n * n)) / s.sustain;
  }
};

/** Advance every harmonic exactly by dt; returns the current swing in px. */
const step = (s: Str, dt: number) => {
  let energy = 0;
  for (let n = 0; n < MODES; n++) {
    const w = s.w[n];
    const g = s.g[n];
    const wd = Math.sqrt(Math.max(w * w - g * g, 1e-6));
    const x0 = s.x[n];
    const b = (s.v[n] + g * x0) / wd;
    const e = Math.exp(-g * dt);
    const c = Math.cos(wd * dt);
    const sn = Math.sin(wd * dt);
    const x = e * (x0 * c + b * sn);
    s.v[n] = e * (wd * (b * c - x0 * sn)) - g * x;
    s.x[n] = x;
    energy += x * x + (s.v[n] / w) * (s.v[n] / w);
  }
  return Math.sqrt(energy);
};

const draw = (s: Str, swing: number) => {
  const mid = s.amp + 0.5;
  const grab = s.grab;
  let d = "";
  for (let i = 0; i < s.pts; i++) {
    let y = 0;
    if (grab) {
      const t = i / (s.pts - 1);
      y = t <= grab.at ? grab.d * (t / grab.at) : grab.d * ((1 - t) / (1 - grab.at));
    } else {
      const o = i * MODES;
      for (let n = 0; n < MODES; n++) y += s.x[n] * s.table[o + n];
    }
    d += (i ? "L" : "M") + s.xs[i].toFixed(1) + " " + (mid + clamp(y, -s.amp, s.amp)).toFixed(2);
  }
  s.path.setAttribute("d", d);
  // A ringing string catches the light: brighter while it moves, back to a hairline as it settles.
  const k = clamp(swing / (s.amp * 0.45), 0, 1);
  s.path.style.strokeOpacity = String(s.restAlpha + (s.peakAlpha - s.restAlpha) * k);
};

const wake = (s: Str) => {
  if (s.live) return;
  s.live = true;
  s.svg.style.visibility = "visible";
  s.rest.style.opacity = "0";
};

const settle = (s: Str) => {
  s.live = false;
  s.grab = null;
  s.x.fill(0);
  s.v.fill(0);
  s.path.setAttribute("d", "");
  s.svg.style.visibility = "hidden";
  s.rest.style.opacity = "";
};

const strum = (s: Str, at: number, amp: number, dir: 1 | -1) => {
  triangle(at, amp, scratch);
  for (let n = 0; n < MODES; n++) s.v[n] += dir * s.w[n] * scratch[n];
  wake(s);
  start();
};

const release = (s: Str) => {
  const grab = s.grab;
  if (!grab) return;
  s.grab = null;
  triangle(grab.at, grab.d, s.x);
  s.v.fill(0);
  wake(s);
};

const interact = (s: Str, dt: number) => {
  const r = s.host.getBoundingClientRect();
  if (!pointer.on || pointer.x < r.left || pointer.x > r.right) {
    if (s.grab) release(s);
    s.last = null;
    return;
  }
  const rel = pointer.y - r.top;
  const last = s.last;
  s.last = rel;
  const at = clamp((pointer.x - r.left) / Math.max(r.width, 1), 0.04, 0.96);

  if (s.grab) {
    if (Math.abs(rel) > s.amp) release(s);
    else {
      s.grab.at = at;
      s.grab.d = rel;
    }
    return;
  }
  if (last === null || last < 0 === rel < 0) return;

  const speed = (rel - last) / dt;
  if (pointer.fine && Math.abs(speed) < HOLD_SPEED) {
    s.x.fill(0);
    s.v.fill(0);
    s.grab = { at, d: rel };
    wake(s);
  } else {
    strum(s, at, clamp(Math.abs(speed) * STRUM_GAIN, STRUM_MIN, s.amp * 0.7), speed < 0 ? -1 : 1);
  }
};

/** Touch screens: a line carried past the comb by the scroll rings where the thumb last was. */
const comb = (s: Str, dt: number) => {
  const r = s.host.getBoundingClientRect();
  const rel = window.innerHeight * COMB - r.top;
  const last = s.last;
  s.last = rel;
  if (last === null || last < 0 === rel < 0) return;
  const speed = (rel - last) / dt;
  if (Math.abs(speed) < COMB_SPEED) return;
  const at = pointer.x >= r.left && pointer.x <= r.right ? (pointer.x - r.left) / Math.max(r.width, 1) : 0.3;
  strum(s, clamp(at, 0.04, 0.96), clamp(Math.abs(speed) * STRUM_GAIN * 0.8, STRUM_MIN, s.amp * 0.7), speed < 0 ? -1 : 1);
};

const tick = (_time: number, deltaMs: number) => {
  const dt = clamp(deltaMs / 1000, 1 / 240, 1 / 30);
  const now = performance.now();
  let busy = now - lastInput < IDLE;
  const playable = !transitionState.active;
  const touch = coarse?.matches ?? false;

  for (const s of all) {
    if (!s.visible) {
      if (s.live) settle(s);
      continue;
    }
    if (s.interactive && playable) {
      if (touch) comb(s, dt);
      else interact(s, dt);
    }
    if (s.grab) {
      if (now - lastInput > HOLD_IDLE) release(s);
      else {
        draw(s, Math.abs(s.grab.d));
        busy = true;
        continue;
      }
    }
    if (s.live) {
      const swing = step(s, dt);
      if (swing < STILL) settle(s);
      else {
        draw(s, swing);
        busy = true;
      }
    }
  }
  if (!busy) stop();
};

function start() {
  if (running) return;
  running = true;
  gsap.ticker.add(tick);
}

function stop() {
  if (!running) return;
  running = false;
  gsap.ticker.remove(tick);
}

const input = () => {
  lastInput = performance.now();
  if (all.size) start();
};

const install = () => {
  if (installed) return;
  installed = true;

  coarse = window.matchMedia("(hover: none), (pointer: coarse)");

  window.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.on = true;
    pointer.fine = true;
    input();
  }, { passive: true });
  document.addEventListener("pointerout", (e) => {
    if (e.pointerType !== "touch" && !e.relatedTarget) pointer.on = false;
  });
  window.addEventListener("blur", () => (pointer.on = false));

  // Touch: remember where the thumb is, so the comb strikes each line under it.
  const touch = (e: TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    pointer.x = t.clientX;
    pointer.y = t.clientY;
    pointer.fine = false;
    input();
  };
  window.addEventListener("touchstart", touch, { passive: true });
  window.addEventListener("touchmove", touch, { passive: true });

  window.addEventListener("scroll", input, { passive: true });

  io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const s = byTarget.get(entry.target);
      if (!s) continue;
      s.visible = entry.isIntersecting;
      if (!s.visible) {
        s.last = null;
        if (s.live) settle(s);
      }
    }
  }, { rootMargin: "15% 0px 15% 0px" });
  ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const s = byTarget.get(entry.target);
      if (s) layout(s);
    }
  });
};

const inert: StringHandle = { pluck: () => undefined, setInteractive: () => undefined, dispose: () => undefined };

export const registerString = (
  parts: Parts,
  opts: { amp: number; restAlpha: number; peakAlpha: number; interactive?: boolean; pitch?: number; sustain?: number }
): StringHandle => {
  if (typeof window === "undefined" || prefersReducedMotion()) return inert;
  install();

  const s: Str = {
    ...parts,
    amp: opts.amp,
    pitch: opts.pitch ?? 1,
    sustain: opts.sustain ?? 1,
    restAlpha: opts.restAlpha,
    peakAlpha: opts.peakAlpha,
    width: 0,
    pts: 0,
    xs: new Float32Array(0),
    table: new Float32Array(0),
    w: new Float64Array(MODES),
    g: new Float64Array(MODES),
    x: new Float64Array(MODES),
    v: new Float64Array(MODES),
    live: false,
    visible: false,
    interactive: opts.interactive ?? true,
    grab: null,
    last: null,
  };
  layout(s);
  all.add(s);
  byTarget.set(s.svg, s);
  byTarget.set(s.host, s);
  io?.observe(s.svg);
  ro?.observe(s.host);

  return {
    pluck: (at, amp, dir = 1) => {
      if (!s.visible) return;
      if (!s.width) layout(s);
      strum(s, clamp(at, 0.04, 0.96), amp, dir);
    },
    setInteractive: (on) => {
      s.interactive = on;
      if (!on) {
        s.last = null;
        if (s.grab) release(s);
      }
    },
    dispose: () => {
      io?.unobserve(s.svg);
      ro?.unobserve(s.host);
      byTarget.delete(s.svg);
      byTarget.delete(s.host);
      all.delete(s);
    },
  };
};

/**
 * Strum every string inside `root` from top to bottom, like a chord: each a little later, a little
 * softer, and struck a little further along than the one above it.
 */
export const strumWithin = (root: Element, { stagger = 0.07, amp = 7, at = 0.22, spread = 0.06 } = {}) => {
  // Visibility is checked as each string is struck: the observer may not have caught up with a jump.
  const list = [...all]
    .filter((s) => root.contains(s.host))
    .sort((a, b) => a.host.getBoundingClientRect().top - b.host.getBoundingClientRect().top);
  list.forEach((s, i) => {
    gsap.delayedCall(0.05 + i * stagger, () => {
      if (!s.visible) return;
      if (!s.width) layout(s);
      strum(s, clamp(at + i * spread, 0.04, 0.96), amp * Math.pow(0.9, i), 1);
    });
  });
};
