// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// engine.js — the typesetting renderer, scene-agnostic core.
// a scene gives it: a height function, beings, a line, a notation, a spawn.
// the engine typesets that world into a lattice of characters every frame,
// weathered by the env layer (model / recorded biosignals — see env.js).
// scene contract: src/term/scenes/CONTRACT.md · reference: scenes/gate.js

import { env, initEnv, updateEnv, toggleSource } from './env.js';

// ---------------------------------------------------------------- registers

const FOG_MIX = [0, 0.25, 0.45, 0.62, 0.76, 0.87];
const N_STEPS = FOG_MIX.length;

// `sky` = fraction of the star catalog this register shows
export const REGISTERS = {
  night: {
    bg: '#04060c',
    bands: ['#46589a', '#4f8a56', '#3f8a80', '#5a74b8', '#aab6d8', '#9a6070', '#b89040', '#dde6f8', '#2b355c', '#6a7ba8'],
    fogK: 0.0075, letterLand: 0, sky: 0.7, rampMax: 8,
    glow: false, scan: false, vig: true, horizon: '#141c33',
    cell: [8, 14], inverse: false,
  },
  folio: {
    bg: '#0a0806',
    bands: ['#3a5a9a', '#6a5426', '#8a6a30', '#b89040', '#e8d8a8', '#8a3a32', '#d8a848', '#f0e8d0', '#3a2c14', '#907438'],
    fogK: 0.008, letterLand: 0.45, sky: 0.55, rampMax: 9,
    glow: true, scan: false, vig: true, horizon: '#241505',
    cell: [9, 16], inverse: false,
  },
  phosphor: {
    bg: '#020604',
    bands: ['#2a8a4a', '#2f9a52', '#38b45f', '#45cc6e', '#7dffa8', '#35a858', '#9dffb8', '#c8ffd8', '#1d5c34', '#4ad478'],
    fogK: 0.009, letterLand: 0.8, sky: 1, rampMax: 10,
    glow: true, scan: true, vig: true, horizon: null,
    cell: [7, 12], inverse: false,
  },
  rose: {
    bg: '#030704',
    bands: ['#54748a', '#3f6a48', '#4a7a58', '#6a8a6a', '#c8d8c0', '#b86878', '#c89858', '#e8d8e0', '#22382a', '#7a9888'],
    fogK: 0.0075, letterLand: 0.2, sky: 0.6, rampMax: 8,
    glow: false, scan: false, vig: true, horizon: '#101a12',
    cell: [8, 14], inverse: false,
  },
  page: {
    bg: '#e6dfd0',
    bands: ['#26365c', '#4a4436', '#3a362c', '#2e2a22', '#181510', '#7a4032', '#8a6018', '#221c30', '#a89a80', '#8a8070'],
    fogK: 0.006, letterLand: 1, sky: 0.3, rampMax: 8,
    glow: false, scan: false, vig: true, horizon: null,
    cell: [7, 13], inverse: true,
  },
  veil: {
    bg: '#060a12',
    bands: ['#5a708a', '#4a5a72', '#54687e', '#5e7288', '#a8b8c8', '#6a6078', '#a89478', '#d8e0e8', '#38445c', '#7888a0'],
    fogK: 0.0115, letterLand: 0.15, sky: 0.8, rampMax: 7,
    glow: true, scan: false, vig: true, horizon: '#101825',
    cell: [10, 18], inverse: false,
  },
};
const REG_ORDER = ['night', 'folio', 'phosphor', 'rose', 'page', 'veil'];
const STORE_KEY = 'anima.term.style2';

let STYLE = null;
let gridScale = 1;
let store = { scene: null, gridScale: 1, perScene: {} };

// the dream remembers the walk — tiny cross-scene state, persisted.
// scenes read it to interweave the story (the pass, the jacket, revisits).
// v2: `chosen` records this night's conduct (never branches — who you were
// while the same thing happened); the fold swaps it into `echo`, so the
// second night greets your conduct while night one stays pure canon.
export const dream = { visited: {}, pass: false, jacket: 'none', chosen: {}, echo: {} };
const DREAM_KEY = 'anima.term.dream';
export function markDream(k, v) {
  dream[k] = v;
  try { localStorage.setItem(DREAM_KEY, JSON.stringify(dream)); } catch {}
}
export function choose(k, v) {
  dream.chosen[k] = v;
  markDream('chosen', dream.chosen);
}
function loadDream() {
  try { Object.assign(dream, JSON.parse(localStorage.getItem(DREAM_KEY) || '{}')); } catch {}
  if (!dream.visited) dream.visited = {};
  if (!dream.chosen) dream.chosen = {};
  if (!dream.echo) dream.echo = {};
}

function hex(c) {
  return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
}
function slotColor(band, step) {
  const b = hex(STYLE.bands[band]);
  const g = hex(STYLE.bg);
  const m = FOG_MIX[step];
  return `rgb(${Math.round(b[0] + (g[0] - b[0]) * m)},${Math.round(b[1] + (g[1] - b[1]) * m)},${Math.round(b[2] + (g[2] - b[2]) * m)})`;
}

// ------------------------------------------------------- notation (per scene)

const CORE_RAMP = [' ', '.', '·', ':', ';', '+', '*', '#', '@', '░', '▒', '▓', '█'];
const CORE_WRITING = ('abcdefghijklmnopqrstuvwxyz' + 'WGFTSAI' + '0682' + ".,:;·-—'\"()").split('');
const CORE_ALWAYS = [' ', '.', '·', ':', ';', '+', '*', '#', '@', '░', '▒', '▓', '█', '│', '║', '═', '▄', '…'];

let RAMP = CORE_RAMP, WRITING = CORE_WRITING;
let CHARS = [], CIDX = new Map(), rampIdx = [], writIdx = [];
// chars every notation must carry regardless of scene — the chapter pages
// render between places, in whatever notation is live (set at init from
// the director's page texts, verbatim capitals and curly quotes included)
let GLOBAL_EXTRA = [];

function buildNotation(scene) {
  const n = scene.notation || {};
  RAMP = n.ramp || CORE_RAMP;
  WRITING = (n.writing ? n.writing.split('') : CORE_WRITING);
  const extra = n.extra || [];
  CHARS = [...new Set([' ', ...CORE_ALWAYS, ...GLOBAL_EXTRA, ...RAMP, ...WRITING, ...extra])];
  CIDX = new Map(CHARS.map((ch, i) => [ch, i]));
  rampIdx = RAMP.map((ch) => CIDX.get(ch));
  writIdx = WRITING.map((ch) => CIDX.get(ch));
}

// ------------------------------------------------------------ grid + canvas

const canvas = document.createElement('canvas');
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');
const frame = document.createElement('canvas');
const fctx = frame.getContext('2d');
const bloomC = document.createElement('canvas');
const bctx = bloomC.getContext('2d');
let scanC = null, vigC = null;

let DPR = 1, CW = 8, CH = 14, COLS = 0, ROWS = 0, OX = 0, OY = 0;
let atlas = null;
let charBuf, slotBuf, depthBuf, skyline;

function buildAtlas() {
  atlas = document.createElement('canvas');
  atlas.width = CHARS.length * CW;
  atlas.height = STYLE.bands.length * N_STEPS * CH;
  const a = atlas.getContext('2d');
  a.textAlign = 'center';
  a.textBaseline = 'middle';
  a.font = `${Math.floor(CH * 0.84)}px Consolas, "Cascadia Mono", monospace`;
  for (let band = 0; band < STYLE.bands.length; band++) {
    for (let step = 0; step < N_STEPS; step++) {
      const slot = band * N_STEPS + step;
      a.fillStyle = slotColor(band, step);
      for (let k = 1; k < CHARS.length; k++) {
        a.fillText(CHARS[k], k * CW + CW / 2, slot * CH + CH * 0.54);
      }
    }
  }
}

function buildFx() {
  scanC = document.createElement('canvas');
  scanC.width = canvas.width; scanC.height = canvas.height;
  const s = scanC.getContext('2d');
  s.fillStyle = STYLE.inverse ? 'rgba(90,74,50,0.07)' : 'rgba(0,0,0,0.16)';
  const step = Math.max(2, Math.round(3 * DPR));
  for (let y = 0; y < canvas.height; y += step) s.fillRect(0, y, canvas.width, 1);
  vigC = document.createElement('canvas');
  vigC.width = canvas.width; vigC.height = canvas.height;
  const v = vigC.getContext('2d');
  const g = v.createRadialGradient(
    canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.42,
    canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.75
  );
  if (STYLE.inverse) { g.addColorStop(0, 'rgba(90,70,40,0)'); g.addColorStop(1, 'rgba(90,70,40,0.30)'); }
  else { g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)'); }
  v.fillStyle = g;
  v.fillRect(0, 0, canvas.width, canvas.height);
}

function resize() {
  if (!STYLE) return;
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * DPR);
  canvas.height = Math.floor(window.innerHeight * DPR);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  frame.width = canvas.width; frame.height = canvas.height;
  bloomC.width = Math.max(2, Math.floor(canvas.width / 4));
  bloomC.height = Math.max(2, Math.floor(canvas.height / 4));
  CW = Math.max(4, Math.round(STYLE.cell[0] * gridScale * DPR));
  CH = Math.max(7, Math.round(STYLE.cell[1] * gridScale * DPR));
  COLS = Math.floor(canvas.width / CW);
  ROWS = Math.floor(canvas.height / CH);
  OX = Math.floor((canvas.width - COLS * CW) / 2);
  OY = Math.floor((canvas.height - ROWS * CH) / 2);
  charBuf = new Int16Array(COLS * ROWS);
  slotBuf = new Uint8Array(COLS * ROWS);
  depthBuf = new Float32Array(COLS * ROWS);
  skyline = new Int16Array(COLS);
  buildAtlas();
  buildFx();
}
window.addEventListener('resize', resize);

// -------------------------------------------------------------- hash + noise

export function h2i(x, z) {
  let n = (x | 0) * 374761393 + (z | 0) * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  return (((n ^ (n >> 16)) >>> 0) % 100000) / 100000;
}
export function vnoise(x, z) {
  const xi = Math.floor(x), zi = Math.floor(z);
  const fx = x - xi, fz = z - zi;
  const ux = fx * fx * (3 - 2 * fx), uz = fz * fz * (3 - 2 * fz);
  const a = h2i(xi, zi), b = h2i(xi + 1, zi);
  const c = h2i(xi, zi + 1), d = h2i(xi + 1, zi + 1);
  return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
}

// ------------------------------------------------------- the night's wiring
// dream mode: the scenes play in the writing's order, joined by transitions
// in which the world dissolves into drifting letters and recondenses —
// everything is always the field, including between places. lab mode
// (?lab or ?scene=) keeps free roam + the scene picker for process work.

export const signals = {}; // transient per-scene events (cleared on scene change)
export function signal(k, v = true) { signals[k] = v; }

let director = null;
let labMode = false;
let trans = null;      // { phase: 'out'|'in', t0, next, spawn, dur, style }
let moveLock = null;   // 'seated' | null
let seatYaw = 0;
let nowT = 0;

export function inDream() { return !labMode; }
export function keyDown(code) { return keys.has(code); }
export function setMoveLock(m, opts = {}) {
  moveLock = m;
  if (m === 'seated') { seatYaw = opts.yaw ?? cam.yaw; cam.yaw = seatYaw; }
}
export function transition(nextId, spawn, opts = {}) {
  if (trans) return;
  trans = {
    phase: 'out', t0: nowT, next: nextId, spawn,
    dur: (opts.dur ?? 1.1) * (1 + 0.5 * liminal()), style: opts.style || 'veil',
    page: opts.page || null, // {name, text} — the chapter page at full veil
  };
}

// ------------------------------------------------------------ the liminal dial
// the night deepens as it goes — authored narrative time (MODEL), multiplied
// with the env's body time, never impersonating it. stage-indexed, fold-
// deepened, zero in lab. drives gains only: fog, letterland, star depletion,
// ramp solids withdrawing, the margin voice getting sleepy, longer dissolves.

let LIM = 0;
export function liminal() {
  if (labMode || !director) return 0;
  const stage = director.stageIdx ? director.stageIdx() : 0;
  return Math.min(1, (stage / 5) * 0.7 + 0.1 * Math.min(dream.folds || 0, 3));
}

// is the camera facing a world point, within a cone? choices in the night
// are read from conduct — position, facing, stillness, timing — never menus.
export function facing(x, z, cone = 0.35) {
  const a = Math.atan2(x - cam.x, -(z - cam.z));
  return Math.abs(wrapA(a - cam.yaw)) < cone;
}

// --------------------------------------------------- the chapter page (trans)
// at full veil the letter-storm settles into the destination's name, and the
// stage's verbatim paragraph typesets beneath. Space completes the typing;
// Space again turns the page. the writing is the transport between places.

let pageState = null; // { t0, name, text, done, doneAt, turn }
const PAGE_CPS = 34;
const PAGE_SAFETY = 28; // a walked-away night still advances, before doubt

function pageAdvance() {
  if (!pageState) return;
  if (!pageState.done) { pageState.done = true; pageState.doneAt = nowT; }
  // the two Space states are distinct acts — a beat must pass between them
  else if (nowT - (pageState.doneAt || 0) > 0.35) pageState.turn = true;
}

// ------------------------------------------------------------------- the card
// handed objects arrive whole — "voices type, objects appear". a card is an
// earned screen moment (the pass, the menu): bordered, instant, Space lowers
// it and signals the scene.

let card = null; // { lines, t0, key }
export function cardShow(lines, key = 'card') {
  if (!card) card = { lines, t0: nowT, key };
}
export function cardHide() { card = null; }
export function cardActive() { return !!card; }

// ------------------------------------------------------------------ the voice
// speak() — the reading band. bobby's quoted dialogue types into the margin's
// band, grown to up to five cleared rows; while a line types, the speaking
// being's condensation pulses (scenes read speakingAt() and boost their
// reveal) — you know the speaker by whose letters are in the air. one typed
// voice at a time: narrate() yields while speech holds the band.

let speakQ = [], speakCur = null;
const SPEAK_CPS = 30;

export function speak(lines) {
  const arr = Array.isArray(lines) ? lines : [lines];
  for (const l of arr) {
    const s = typeof l === 'string' ? { text: l } : l;
    if (speakCur?.text === s.text) continue;
    if (speakQ.some((q) => q.text === s.text)) continue;
    speakQ.push(s);
  }
}
export function speaking() { return !!speakCur; }
export function speakingAt() { return speakCur && !speakCur.fadeT ? speakCur.at || null : null; }

// any reading surface holding the visitor? (Space belongs to it; no hop)
function uiHolds() { return !!pageState || !!card || !!speakCur; }

// ---------------------------------------------------------- the margin voice
// the page has a margin, and the writing types itself into it — one line at
// a time, cued at the moment each sentence becomes true. the story is told
// as you live it, and its sentences are the night's only instructions.
// verbatim, lowercased into the ambient alphabet; queued, never overlapping.

let marginQ = [];
let marginCur = null;

export function narrate(text) {
  if (marginCur?.text === text) return;
  if (marginQ.some((q) => q.text === text)) return;
  marginQ.push({ text });
}

function renderMargin(t) {
  if (speakCur || pageState) return; // one typed voice at a time
  if (!marginCur && marginQ.length) { marginCur = marginQ.shift(); marginCur.t0 = t; }
  if (!marginCur) return;
  const m = marginCur;
  const cps = 26 - 6 * LIM; // deeper in, the voice gets sleepy
  let shown = Math.floor((t - m.t0) * cps);
  // settle-jitter: near the fold, letters hesitate before they land
  if (LIM > 0.3 && shown > 0 && shown < m.text.length &&
      h2i(Math.floor(t * 6), 37) < 0.12 * LIM) shown -= 1;
  const done = shown >= m.text.length;
  const hold = 1.7 + m.text.length * 0.02;
  const age = done ? t - m.t0 - m.text.length / cps : 0;
  if (done && age > hold + 0.9) { marginCur = null; return; }
  const fade = done && age > hold ? (age - hold) / 0.9 : 0;
  const w = COLS - 8;
  const lines = [];
  if (m.text.length <= w) lines.push(m.text);
  else {
    let cut = m.text.lastIndexOf(' ', w);
    if (cut < w * 0.5) cut = w;
    lines.push(m.text.slice(0, cut));
    lines.push(m.text.slice(cut + 1, cut + 1 + w));
  }
  // the margin is whitespace first — a quiet band the terrain yields to
  for (let li = 0; li < lines.length; li++) {
    const row = ROWS - 3 - (lines.length - 1) + li;
    if (row < 0) continue;
    for (let c = 0; c < COLS; c++) {
      const idx = row * COLS + c;
      charBuf[idx] = 0;
      depthBuf[idx] = 0.05;
    }
  }
  let count = 0;
  for (let li = 0; li < lines.length; li++) {
    const row = ROWS - 3 - (lines.length - 1) + li;
    if (row < 0) continue;
    const line = lines[li];
    for (let i = 0; i < line.length; i++) {
      if (count >= shown) return;
      count++;
      const ch = line[i];
      if (ch === ' ') continue;
      if (fade > 0 && h2i(i * 7 + li * 13, 271) < fade) continue;
      const k = CIDX.get(ch);
      if (k === undefined) continue;
      if (4 + i >= COLS) break;
      const idx = row * COLS + 4 + i;
      charBuf[idx] = k;
      slotBuf[idx] = 7 * N_STEPS + 1;
      depthBuf[idx] = 0.05;
    }
  }
}

// clear a full row into quiet whitespace the terrain yields to
function clearRow(row, depth = 0.05) {
  if (row < 0 || row >= ROWS) return;
  for (let c = 0; c < COLS; c++) {
    const idx = row * COLS + c;
    charBuf[idx] = 0;
    depthBuf[idx] = depth;
  }
}

function wrapText(text, w) {
  const out = [];
  for (const para of text.split('\n')) {
    if (!para.trim()) { out.push(''); continue; }
    let rest = para;
    while (rest.length > w) {
      let cut = rest.lastIndexOf(' ', w);
      if (cut < w * 0.4) cut = w;
      out.push(rest.slice(0, cut));
      rest = rest.slice(cut).replace(/^ /, '');
    }
    out.push(rest);
  }
  return out;
}

function renderSpeak(t) {
  if (pageState) return;
  if (!speakCur && speakQ.length) { speakCur = speakQ.shift(); speakCur.t0 = t; }
  if (!speakCur) return;
  const s = speakCur;
  // walking out on a voice scatters it early — but with grace: a step taken
  // to read or look is not a walk-out; only staying gone is
  if (s.at && !s.fadeT) {
    const d = Math.hypot(cam.x - s.at.x, cam.z - s.at.z);
    if (d > (s.at.radius ?? 14) * 1.2) {
      if (!s.outT) s.outT = t;
      else if (t - s.outT > 1.2) s.fadeT = t;
    } else s.outT = null;
  }
  const shown = s.skipT ? s.text.length : Math.floor((t - s.t0) * SPEAK_CPS);
  const done = shown >= s.text.length;
  const hold = s.hold ?? 2.2 + s.text.length * 0.025;
  const doneAt = s.skipT ?? s.t0 + s.text.length / SPEAK_CPS;
  let fade = 0;
  if (s.fadeT) fade = (t - s.fadeT) / 0.9;
  else if (done && t - doneAt > hold) fade = (t - doneAt - hold) / 0.9;
  if (fade >= 1) { speakCur = null; return; }
  const w = Math.min(COLS - 10, 76);
  const lines = wrapText(s.text, w).slice(0, 5);
  const rows = lines.length;
  for (let li = 0; li < rows; li++) clearRow(ROWS - 3 - (rows - 1) + li);
  let count = 0;
  for (let li = 0; li < rows; li++) {
    const row = ROWS - 3 - (rows - 1) + li;
    if (row < 0) continue;
    const line = lines[li];
    const c0 = 5;
    for (let i = 0; i < line.length; i++) {
      if (count >= shown) return;
      count++;
      const ch = line[i];
      if (ch === ' ') continue;
      if (fade > 0 && h2i(i * 7 + li * 13, 271) < fade) continue;
      const k = CIDX.get(ch);
      if (k === undefined) continue;
      if (c0 + i >= COLS) break;
      const idx = row * COLS + c0 + i;
      charBuf[idx] = k;
      slotBuf[idx] = 7 * N_STEPS + 0; // speech-white, nearest ink
      depthBuf[idx] = 0.05;
    }
  }
}

// the card — bordered, instant-on, Space lowers it. renders scene-space
// (under the veil); the closing signal carries the card's key.
function renderCard(t) {
  if (!card) return;
  const lines = card.lines;
  const w = Math.min(COLS - 8, Math.max(...lines.map((l) => l.length)) + 6);
  const h = lines.length + 4;
  const c0 = Math.floor((COLS - w) / 2);
  const r0 = Math.max(1, Math.floor((ROWS - h) * 0.42));
  const putC = (col, row, ch, band, step) => {
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
    const k = CIDX.get(ch);
    if (k === undefined) return;
    const idx = row * COLS + col;
    charBuf[idx] = k;
    slotBuf[idx] = band * N_STEPS + step;
    depthBuf[idx] = 0.1;
  };
  for (let r = r0; r < r0 + h; r++) {
    for (let c = c0; c < c0 + w; c++) {
      const idx = r * COLS + c;
      charBuf[idx] = 0; depthBuf[idx] = 0.1;
    }
  }
  for (let c = c0; c < c0 + w; c++) { putC(c, r0, '═', 6, 1); putC(c, r0 + h - 1, '═', 6, 1); }
  for (let r = r0; r < r0 + h; r++) { putC(c0, r, '║', 6, 1); putC(c0 + w - 1, r, '║', 6, 1); }
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    const lc = c0 + Math.floor((w - line.length) / 2);
    for (let i = 0; i < line.length; i++) {
      if (line[i] === ' ') continue;
      putC(lc + i, r0 + 2 + li, line[i], 7, 0);
    }
  }
}

// the chapter page — over the full veil, the destination's name settles as a
// heading and the stage's verbatim paragraph typesets beneath it.
function renderPage(t) {
  if (!pageState) return;
  const p = pageState;
  const u = t - p.t0;
  const measure = Math.min(54, COLS - 12);
  const body = wrapText(p.text, measure);
  const nameRow = Math.max(2, Math.floor(ROWS * 0.26));
  const bodyRow = nameRow + 3;
  // the name: the storm's letters agree — letterspaced, cleared band
  const nm = p.name;
  const span = nm.length * 3 - 2;
  const nc0 = Math.floor((COLS - span) / 2);
  clearRow(nameRow - 1, 0.05); clearRow(nameRow, 0.05); clearRow(nameRow + 1, 0.05);
  const nShown = Math.min(nm.length, Math.floor(u * 18));
  for (let i = 0; i < nShown; i++) {
    const ch = nm[i];
    if (ch === ' ') continue;
    const k = CIDX.get(ch);
    if (k === undefined) continue;
    const col = nc0 + i * 3;
    if (col < 0 || col >= COLS) continue;
    const idx = nameRow * COLS + col;
    charBuf[idx] = k;
    slotBuf[idx] = 7 * N_STEPS + 0;
    depthBuf[idx] = 0.05;
  }
  // the paragraph, typed — '▄' pen-cursor at the writing edge
  const total = body.reduce((a, l) => a + l.length, 0);
  const shown = p.done ? total : Math.max(0, Math.floor((u - 0.7) * PAGE_CPS));
  if (shown >= total && !p.done) { p.done = true; p.doneAt = t; }
  const c0 = Math.floor((COLS - measure) / 2);
  // finished: the pen rests past the last word, pulsing slow — the page
  // is done and waits to be turned (a different body than the typing edge)
  if (p.done) {
    const lastLi = body.length - 1;
    const row = bodyRow + lastLi * 2;
    const col = c0 + body[lastLi].length + 2;
    if (row < ROWS && col < COLS && Math.sin(t * 2.1) > -0.3) {
      const idx = row * COLS + col;
      charBuf[idx] = CIDX.get('▄') ?? 0;
      slotBuf[idx] = 7 * N_STEPS + 3;
      depthBuf[idx] = 0.05;
    }
  }
  let count = 0;
  for (let li = 0; li < body.length; li++) {
    const row = bodyRow + li * 2;
    if (row >= ROWS - 4) break;
    clearRow(row, 0.05);
    const line = body[li];
    for (let i = 0; i < line.length; i++) {
      if (count >= shown) {
        // the pen rests where the writing will continue
        if (!p.done && line[i - 1] !== undefined) {
          const idx = row * COLS + c0 + i;
          if (c0 + i < COLS && Math.sin(t * 6) > -0.2) {
            charBuf[idx] = CIDX.get('▄') ?? 0;
            slotBuf[idx] = 7 * N_STEPS + 2;
            depthBuf[idx] = 0.05;
          }
        }
        return;
      }
      count++;
      const ch = line[i];
      if (ch === ' ') continue;
      const k = CIDX.get(ch);
      if (k === undefined) continue;
      if (c0 + i >= COLS) break;
      const idx = row * COLS + c0 + i;
      charBuf[idx] = k;
      slotBuf[idx] = 7 * N_STEPS + 1;
      depthBuf[idx] = 0.05;
    }
  }
}

// -------------------------------------------------- speech condensation
// "signs type, beings condense" — doctrine 19.08. a being's line never
// fades in: its letters fly down from scattered homes in the night and
// settle; on silence they fly back. while letters are aloft the sky dims
// (the night lends its matter to the voice). scenes call this per frame
// from beings() with a 0..1 reveal they drive (usually by proximity).

let speechGlow = 0;

export function condense(text, ax, ay, az, reveal, t, seed = 7) {
  const pts = [];
  const n = text.length;
  let aloft = 0;
  for (let i = 0; i < n; i++) {
    const ch = text[i];
    if (ch === ' ') continue;
    const u = Math.max(0, Math.min(1, reveal * 1.4 - (i / n) * 0.4 - h2i(i * 13, seed) * 0.12));
    if (u <= 0) continue;
    const tx = ax + (i - n / 2) * 0.12;
    const ty = ay + (h2i(i * 7, seed + 1) - 0.5) * 0.1;
    if (u >= 1) { pts.push({ x: tx, y: ty, z: az, ch, band: 7, lift: 1 }); continue; }
    aloft++;
    const ox = ax + (h2i(i * 31, seed + 2) - 0.5) * 26;
    const oy = 9 + h2i(i * 17, seed + 3) * 8;
    const oz = az + (h2i(i * 23, seed + 4) - 0.5) * 26;
    const s = u * u * (3 - 2 * u);
    pts.push({
      x: ox + (tx - ox) * s,
      y: oy + (ty - oy) * s + Math.sin(s * Math.PI) * 1.6,
      z: oz + (az - oz) * s,
      ch, band: 9, lift: 0, // sky-dim in flight; speech-white on settle
    });
  }
  if (aloft > 0) speechGlow = Math.min(1, aloft / 6);
  return pts;
}

// -------------------------------------------------------------- scene state

let SCENES = [];
let scene = null;
let sceneReady = false;
let WL = 0, FAR = 300, ISLAND_R = null, ISLAND_CX = 0, ISLAND_CZ = 0;

function sceneHeight(x, z) {
  let h = scene.world.height(x, z, env);
  if (ISLAND_R != null) {
    const dx = x - ISLAND_CX, dz = z - ISLAND_CZ;
    const s = (Math.hypot(dx, dz) - ISLAND_R) / 34;
    if (s > 0) { const m = Math.min(1, s); h -= m * m * 14; }
  }
  return h;
}

async function setScene(id, keepCam = false, spawnOverride = null) {
  const next = SCENES.find((s) => s.id === id) || SCENES[0];
  if (!next) return;
  sceneReady = false;
  moveLock = null;
  for (const k of Object.keys(signals)) delete signals[k];
  marginQ = []; // a new place gets a fresh voice — stale lines don't follow
  speakQ = []; speakCur = null; card = null;
  scene = next;
  if (scene.init && !scene._inited) {
    try { await scene.init({ h2i, vnoise, env }); } catch (e) { console.error('scene init failed', e); }
    scene._inited = true;
  }
  WL = scene.world.waterLevel ?? 0;
  FAR = scene.world.far ?? 300;
  ISLAND_R = scene.world.islandR === undefined ? 95 : scene.world.islandR;
  ISLAND_CX = scene.world.center?.x ?? 0;
  ISLAND_CZ = scene.world.center?.z ?? 0;
  buildNotation(scene);
  const per = store.perScene[scene.id] || {};
  applyStyle(per.reg || scene.register || 'night', per.overrides || {});
  if (!keepCam) {
    const sp = spawnOverride || scene.spawn || { x: 0, z: 20, yaw: 0 };
    cam.x = sp.x; cam.z = sp.z; cam.yaw = sp.yaw || 0; cam.pitch = 0;
    cam.y = Math.max(sceneHeight(sp.x, sp.z), WL) + 2.3;
  }
  store.scene = scene.id;
  dream.visited[scene.id] = (dream.visited[scene.id] || 0) + 1;
  markDream('visited', dream.visited);
  saveStore();
  hud();
  sceneReady = true;
}

// --------------------------------------------------------------- style flow

const markerEl = document.getElementById('marker');
let overrides = {};

const hintEl = document.getElementById('hint');

function hud() {
  if (!markerEl || !STYLE || !scene) return;
  if (!labMode) {
    // in the dream the software voice thins: no scene id, no flags —
    // the world, not the corner, says where you are
    markerEl.textContent = `anima.interact · the night · env ${env.label.toLowerCase()}`;
    if (hintEl) hintEl.textContent = 'wasd walk · drag look · space';
    return;
  }
  const flags = [
    STYLE.glow ? 'glow' : null,
    STYLE.scan ? 'scan' : null,
    STYLE.letterLand >= 1 ? 'letters' : STYLE.letterLand > 0 ? `letters ${STYLE.letterLand}` : null,
    gridScale !== 1 ? `grid ×${gridScale.toFixed(2)}` : null,
  ].filter(Boolean).join(' · ');
  markerEl.textContent =
    `anima.interact · termfield_02 · ${scene.id} · ${STYLE.reg} · env ${env.label.toLowerCase()}` +
    (flags ? ` · ${flags}` : '');
}

function saveStore() {
  try {
    store.gridScale = gridScale;
    if (scene) store.perScene[scene.id] = { reg: STYLE?.reg, overrides };
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

function applyStyle(name, keepOverrides) {
  const r = REGISTERS[name] || REGISTERS.night;
  overrides = keepOverrides || {};
  STYLE = { ...r, reg: REGISTERS[name] ? name : 'night' };
  for (const k of Object.keys(overrides)) STYLE[k] = overrides[k];
  saveStore();
  resize();
  hud();
}

function toggleFlag(k) {
  overrides[k] = !STYLE[k];
  STYLE[k] = overrides[k];
  saveStore(); hud();
}

function cycleLetters() {
  const base = (REGISTERS[STYLE.reg] || REGISTERS.night).letterLand;
  const seq = [...new Set([base, 0, 0.5, 1])];
  const i = seq.findIndex((v) => Math.abs(v - STYLE.letterLand) < 0.01);
  const next = seq[(i + 1) % seq.length];
  overrides.letterLand = next;
  STYLE.letterLand = next;
  saveStore(); hud();
}

function setScale(s) {
  gridScale = Math.max(0.6, Math.min(1.9, s));
  saveStore(); resize(); hud();
}

// ------------------------------------------------------------------- camera

const cam = { x: 0, z: 26, y: 4, yaw: 0, pitch: 0, buoy: 0 };
const FOV = 1.35;
let PROJ = 0;

const keys = new Set();
window.addEventListener('keydown', (e) => {
  keys.add(e.code);
  // Space belongs to the reading surfaces first: page → card → voice → hop.
  // first press always completes the typing; the second acts.
  if (e.code === 'Space') {
    if (e.repeat) return; // a held Space is one press — never two acts
    if (pageState) { pageAdvance(); return; }
    if (card) { const k = card.key; cardHide(); signal(k + 'Closed'); return; }
    if (speakCur && !speakCur.skipT) {
      const need = speakCur.text.length / SPEAK_CPS;
      if (nowT - speakCur.t0 < need) { speakCur.skipT = nowT; return; }
    }
  }
  const n = { Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Digit5: 4, Digit6: 5 }[e.code];
  if (n !== undefined) applyStyle(REG_ORDER[n], {});
  else if (e.code === 'KeyG') toggleFlag('glow');
  else if (e.code === 'KeyL') toggleFlag('scan');
  else if (e.code === 'KeyV') toggleFlag('vig');
  else if (e.code === 'KeyK') cycleLetters();
  else if (e.code === 'KeyE') { toggleSource(); hud(); }
  else if (e.code === 'BracketLeft') setScale(gridScale / 1.12);
  else if (e.code === 'BracketRight') setScale(gridScale * 1.12);
  else if ((e.code === 'Comma' || e.code === 'Period') && labMode) {
    const i = SCENES.findIndex((s) => s.id === scene.id);
    const d = e.code === 'Period' ? 1 : -1;
    setScene(SCENES[(i + d + SCENES.length) % SCENES.length].id);
  }
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
let dragging = false, lastX = 0, lastY = 0;
canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
window.addEventListener('pointerup', () => { dragging = false; });
window.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  cam.yaw += (e.clientX - lastX) * 0.004;
  cam.pitch = Math.max(-0.55, Math.min(0.55, cam.pitch + (e.clientY - lastY) * 0.003));
  lastX = e.clientX; lastY = e.clientY;
});

function updateCam(dt) {
  if (trans && trans.phase === 'page') return; // held by the page
  const turn = 1.7 * dt;
  if (keys.has('ArrowLeft')) cam.yaw -= turn;
  if (keys.has('ArrowRight')) cam.yaw += turn;
  if (keys.has('ArrowUp')) cam.pitch = Math.max(-0.55, cam.pitch - turn * 0.5);
  if (keys.has('ArrowDown')) cam.pitch = Math.min(0.55, cam.pitch + turn * 0.5);
  if (moveLock === 'seated') {
    // in the seat: the head turns a little; the body stays
    cam.yaw = Math.max(seatYaw - 0.55, Math.min(seatYaw + 0.55, cam.yaw));
    cam.pitch = Math.max(-0.25, Math.min(0.25, cam.pitch));
    return;
  }
  const run = keys.has('ShiftLeft') || keys.has('ShiftRight') ? 2.2 : 1;
  const sp = 8 * run * dt;
  const fx = Math.sin(cam.yaw), fz = -Math.cos(cam.yaw);
  const rx = Math.cos(cam.yaw), rz = Math.sin(cam.yaw);
  if (keys.has('KeyW')) { cam.x += fx * sp; cam.z += fz * sp; }
  if (keys.has('KeyS')) { cam.x -= fx * sp; cam.z -= fz * sp; }
  if (keys.has('KeyA')) { cam.x -= rx * sp; cam.z -= rz * sp; }
  if (keys.has('KeyD')) { cam.x += rx * sp; cam.z += rz * sp; }
  if (keys.has('Space') && !uiHolds()) cam.buoy = 5;
  cam.buoy *= Math.exp(-dt * 1.2);
  const raw = sceneHeight(cam.x, cam.z);
  camWater = raw < WL;
  const ground = Math.max(raw, WL);
  const target = ground + 2.3 + cam.buoy;
  cam.y += (target - cam.y) * Math.min(1, dt * 5);
}

// is the walker over water right now (island sink included)?
let camWater = false;
export function onWater() { return camWater; }

// ---------------------------------------------------------------- the night

const STARS = (() => {
  const s = [];
  for (let i = 0; i < 220; i++) {
    const m = h2i(i, 503);
    s.push({
      az: h2i(i, 501) * Math.PI * 2,
      el: 0.06 + Math.pow(h2i(i, 502), 1.6) * 0.58,
      chK: m > 0.96 ? 'letter' : m > 0.82 ? '+' : m > 0.55 ? '·' : '.',
      li: Math.floor(h2i(i, 504) * 26),
      bright: m > 0.94 ? 1 : m > 0.78 ? 0.7 : 0.42,
      tw: 0.4 + h2i(i, 505) * 1.3,
      ph: h2i(i, 506) * 6.28,
    });
  }
  return s;
})();

function wrapA(a) {
  return ((a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
}

function renderSky(t) {
  const sk = scene.sky || {};
  if (sk.none) return;
  const horizon = ROWS * 0.42 + cam.pitch * ROWS * 0.9;
  const drift = t * 0.004;
  const twSpeed = 0.6 + env.ch.spark * 0.9;
  // the depletion arc — the deeper the night, the more stars have moved
  // out; the boat's emptied sky is where the arc was always going.
  // in lab (dial 0) the old visited-count arc keeps the process view honest.
  const visitedN = Object.keys(dream.visited || {}).length;
  const depl = LIM > 0
    ? Math.max(0.08, 1 - 1.31 * LIM)
    : Math.max(0.15, 1 - 0.09 * Math.max(0, visitedN - 1));
  // while speech is aloft, the night lends its matter — the sky dims
  const dimStep = speechGlow > 0.25 ? 1 : 0;
  const nStars = Math.max(4, Math.floor(STARS.length * STYLE.sky * (sk.stars ?? 1) * depl));
  for (let i = 0; i < nStars; i++) {
    const s = STARS[i];
    const a = wrapA(s.az + drift - cam.yaw);
    if (Math.abs(a) > FOV * 0.6) continue;
    const c = Math.round((a / FOV + 0.5) * (COLS - 1));
    if (c < 0 || c >= COLS) continue;
    const r = Math.round(horizon - s.el * PROJ);
    if (r < 0 || r >= skyline[c]) continue;
    const idx = r * COLS + c;
    if (charBuf[idx] !== 0) continue;
    const tw = 0.5 + 0.5 * Math.sin(t * s.tw * twSpeed + s.ph);
    const b = s.bright * (0.55 + 0.45 * tw);
    const ch = s.chK === 'letter' ? WRITING[s.li % WRITING.length] : s.chK;
    charBuf[idx] = CIDX.get(ch) ?? CIDX.get('·');
    slotBuf[idx] = 9 * N_STEPS +
      Math.min(N_STEPS - 1, (b > 0.8 ? 2 : b > 0.55 ? 3 : b > 0.35 ? 4 : 5) + dimStep);
  }
  // the moon — {az, el, r, phase 0..1, halo, waver} per scene
  const moon = sk.moon === false ? null :
    { az: -0.55, el: 0.34, r: 3, phase: 1, halo: false, waver: 0, ...(sk.moon || {}) };
  if (moon) {
    const wav = moon.waver ? Math.sin(t * 0.19) * moon.waver : 0;
    const ma = wrapA(moon.az + wav - cam.yaw);
    if (Math.abs(ma) < FOV * 0.75) {
      const mc = (ma / FOV + 0.5) * (COLS - 1);
      const mr = horizon - moon.el * PROJ;
      const R = moon.r;
      const R2 = Math.ceil(R * (CH / CW));
      const litEdge = 2 * (moon.phase ?? 1) - 1;
      for (let dr = -R; dr <= R; dr++) {
        for (let dc = -R2; dc <= R2; dc++) {
          const rr = Math.round(mr + dr), cc = Math.round(mc + dc);
          if (cc < 0 || cc >= COLS || rr < 0 || rr >= skyline[cc]) continue;
          const d = Math.hypot(dr, dc * (CW / CH));
          if (d > R) continue;
          const idx = rr * COLS + cc;
          if (charBuf[idx] !== 0) continue;
          let l = 1 - Math.pow(d / R, 1.7) * 0.72 - h2i(cc * 3, rr * 3) * 0.22;
          // the terminator — the unlit side falls to ember-dark
          const q = dc / (R2 || 1);
          l *= 0.18 + 0.82 * Math.max(0, Math.min(1, (litEdge - q) * 1.8 + 1));
          l = Math.max(0.1, Math.min(0.95, l));
          charBuf[idx] = rampIdx[Math.max(1, Math.min(rampIdx.length - 1, Math.min(9, Math.floor(l * RAMP.length))))];
          slotBuf[idx] = 4 * N_STEPS + (l > 0.62 ? 1 : l > 0.4 ? 2 : 3);
        }
      }
      if (moon.halo) {
        for (let a2 = 0; a2 < 6.28; a2 += 0.13) {
          if (h2i(Math.floor(a2 * 50), 909) > 0.55) continue;
          const rr = Math.round(mr + Math.sin(a2) * (R + 1.5));
          const cc = Math.round(mc + Math.cos(a2) * (R + 1.5) * (CH / CW));
          if (cc < 0 || cc >= COLS || rr < 0 || rr >= skyline[cc]) continue;
          const idx = rr * COLS + cc;
          if (charBuf[idx] !== 0) continue;
          charBuf[idx] = CIDX.get('·');
          slotBuf[idx] = 9 * N_STEPS + 4;
        }
      }
    }
  }
}

// ------------------------------------------------------------------- render

function fogStep(f, minStep = 0, maxStep = N_STEPS - 1) {
  const s = Math.floor((1 - f) * N_STEPS);
  return Math.max(minStep, Math.min(maxStep, s));
}

const gSample = { band: 1, lum: 0.5, letter: false, letterSeed: 0 };
const wS = { lum: 0.34, seed: 0, band: 0, blank: false };
const fS = { band: 1, lum: 0.5, letter: false, letterSeed: 0 };

function renderTerrain(t) {
  charBuf.fill(0);
  slotBuf.fill(0);
  depthBuf.fill(Infinity);
  const horizon = ROWS * 0.42 + cam.pitch * ROWS * 0.9;
  PROJ = ROWS * 1.05;
  // narrative depth × body weather — the liminal dial multiplies the env,
  // it never impersonates it. tempered 19.08 (sol consult): global gains
  // stay gentle so legibility is never the sacrifice; the felt escalation
  // belongs to each scene's own authored deepening.
  const FOG_K = STYLE.fogK * (0.85 + env.ch.depth * 0.35) * (1 + LIM * 0.18);
  const LL = Math.min(1, STYLE.letterLand + LIM * 0.12);
  const windAmp = 0.04 + env.ch.tension * 0.06;
  const streamV = 0.25 + env.ch.drift * 0.7;
  const groundFn = scene.world.ground;
  const waterFn = scene.world.water;
  const faceFn = scene.world.face;
  const rampLen = RAMP.length;
  // deep in the night the heaviest solids withdraw — the world thins
  const rampCeil = Math.min(STYLE.rampMax - (LIM > 0.75 ? 1 : 0), rampLen - 1);

  for (let c = 0; c < COLS; c++) {
    const a = (c / (COLS - 1) - 0.5) * FOV;
    const ang = cam.yaw + a;
    const rx = Math.sin(ang), rz = -Math.cos(ang);
    const ca = Math.cos(a);
    let yTop = ROWS;
    let dt = 0.55;
    for (let tt = 1.4; tt < FAR; tt += dt, dt *= 1.018) {
      const wx = cam.x + rx * tt, wz = cam.z + rz * tt;
      const hh = sceneHeight(wx, wz);
      const water = hh < WL;
      const hS = water ? WL : hh;
      const tc = tt * ca;
      const row = Math.floor(horizon + ((cam.y - hS) * PROJ) / tc);
      if (row >= yTop) continue;
      const f = Math.exp(-tc * FOG_K);
      if (f < 0.035) { yTop = Math.min(yTop, Math.max(row, 0)); if (yTop <= 0) break; continue; }

      let band, chIdx, lum;
      let letterCell = false, letterSeed = 0;
      if (water) {
        band = 0;
        lum = 0.34 + 0.12 * Math.sin(t * 1.1 + wx * 0.31 + wz * 0.17);
        let wi = Math.floor(h2i(Math.floor(wx * 0.9 + t * streamV), Math.floor(wz * 0.9)) * writIdx.length);
        // per-scene water voice — wakes, glades, currents, refusals
        if (waterFn) {
          wS.lum = lum; wS.seed = wi; wS.band = 0; wS.blank = false;
          waterFn(wx, wz, wS, t, env, cam);
          lum = wS.lum; band = wS.band;
          wi = ((wS.seed % writIdx.length) + writIdx.length) % writIdx.length;
        }
        chIdx = waterFn && wS.blank ? -1 : writIdx[wi];
      } else {
        lum = 0.26 + Math.min(1, Math.max(0, (hS + 3) / 26)) * 0.42;
        const west = sceneHeight(wx - 1.8, wz - 1.8);
        lum += Math.max(-0.12, Math.min(0.2, (hh - west) * 0.22));
        band = hS < 1.2 ? 1 : hS < 4 ? 2 : hS < 9 ? 3 : 4;
        if (tc > 130) band = 8;
        if (band <= 3 || band === 5) {
          const gust = Math.sin(t * 0.8 + wx * 0.13 + wz * 0.09) *
                       Math.sin(t * 0.33 + wx * 0.045 - wz * 0.065);
          lum += gust * windAmp;
        }
        if (groundFn) {
          gSample.band = band; gSample.lum = lum; gSample.letter = false; gSample.letterSeed = 0;
          groundFn(wx, wz, hS, gSample, t, env, cam);
          band = gSample.band; lum = gSample.lum;
          letterCell = gSample.letter; letterSeed = gSample.letterSeed;
        }
        // the shore condensation gradient — at the island's edge the land
        // dissolves into the text it came from (letters densify seaward)
        if (!letterCell && ISLAND_R != null && scene.world.shoreGrad !== false && hS < WL + 1.6) {
          const rr = Math.hypot(wx - ISLAND_CX, wz - ISLAND_CZ);
          if (rr > ISLAND_R - 9) {
            const gsh = Math.min(1, (WL + 1.6 - hS) / 1.6) * Math.min(1, (rr - (ISLAND_R - 9)) / 6);
            if (h2i(Math.floor(wx * 1.6) + 5, Math.floor(wz * 1.6) + 8) < gsh * 0.75) {
              letterCell = true;
              letterSeed = Math.floor(h2i(Math.floor(wx * 1.1) + Math.floor(t * 0.4), Math.floor(wz * 1.1)) * writIdx.length);
            }
          }
        }
        lum *= 0.35 + 0.65 * f;
        if (band === 8) lum = Math.max(lum, 0.3);
        chIdx = -1;
        if (!letterCell && LL > 0 && h2i(Math.floor(wx * 1.3) + 11, Math.floor(wz * 1.3) + 5) < LL) {
          letterCell = true;
          letterSeed = Math.floor(h2i(Math.floor(wx * 1.3) + Math.floor(t * 0.5), Math.floor(wz * 1.3)) * writIdx.length);
        }
      }
      const step = fogStep(f, 0, band === 8 ? 3 : N_STEPS - 1);
      const slot = band * N_STEPS + step;
      const rTo = Math.max(row, 0);
      for (let r = Math.min(yTop, ROWS) - 1; r >= rTo; r--) {
        const idx = r * COLS + c;
        let l = lum + (h2i(c * 3 + 1, r * 5 + 2) - 0.5) * 0.09;
        l = Math.max(0.02, Math.min(0.97, l));
        let rBand = band, rLetter = letterCell, rSeed = letterSeed, rSlot = slot;
        // per-row face hook — vertical faces (cliffs, walls) get their own
        // voice; the fill between surface hits is where strata live
        if (faceFn && !water) {
          const wy = cam.y - ((r + 0.5 - horizon) * tc) / PROJ;
          if (wy < hS - 0.4) {
            fS.band = band; fS.lum = l; fS.letter = rLetter; fS.letterSeed = rSeed;
            faceFn(wx, wz, wy, fS, t, env);
            rBand = fS.band; l = Math.max(0.02, Math.min(0.97, fS.lum));
            rLetter = fS.letter; rSeed = fS.letterSeed;
            if (rBand !== band) rSlot = rBand * N_STEPS + fogStep(f, 0, rBand === 8 ? 3 : N_STEPS - 1);
          }
        }
        if (chIdx >= 0) charBuf[idx] = chIdx;
        else if (rLetter && l > 0.18 && l < 0.8) charBuf[idx] = writIdx[rSeed % writIdx.length];
        else charBuf[idx] = rampIdx[Math.max(1, Math.min(rampCeil, Math.floor(l * rampLen)))];
        slotBuf[idx] = rSlot;
        depthBuf[idx] = tc;
      }
      yTop = rTo;
      if (yTop <= 0) break;
    }
    skyline[c] = yTop;
  }
}

function lineBeings() {
  const L = scene.line;
  if (!L) return [];
  const d = Math.hypot(cam.x - L.x, cam.z - L.z);
  const radius = L.radius ?? 15;
  if (d > radius) return [];
  const reveal = Math.min(1, (radius - d) / (radius * 0.4));
  const n = Math.floor(reveal * L.text.length);
  const axis = L.axis || 'x'; // letters spread along this world axis
  const pts = [];
  for (let i = 0; i < n; i++) {
    const ch = L.text[i];
    if (ch === ' ') continue;
    const off = (i - L.text.length / 2) * 0.12;
    pts.push({
      x: axis === 'x' ? L.x + off : L.x,
      y: (L.y ?? 3.9) + (h2i(i * 7, 3) - 0.5) * 0.1,
      z: axis === 'z' ? L.z + off : L.z,
      ch: CIDX.has(ch) ? ch : '·', band: 7, lift: 1,
    });
  }
  return pts;
}

function renderBeings(t) {
  const horizon = ROWS * 0.42 + cam.pitch * ROWS * 0.9;
  const sy = Math.sin(cam.yaw), cy = Math.cos(cam.yaw);
  const FOG_K = STYLE.fogK * (0.85 + env.ch.depth * 0.35) * (1 + LIM * 0.18);
  const all = [...(scene.beings ? scene.beings(t, cam, env) : []), ...lineBeings()];
  for (const p of all) {
    const dx = p.x - cam.x, dz = p.z - cam.z;
    const fwd = dx * sy - dz * cy;
    if (fwd < 0.8) continue;
    const side = dx * cy + dz * sy;
    const a = Math.atan2(side, fwd);
    if (Math.abs(a) > FOV * 0.6) continue;
    const c = Math.round((a / FOV + 0.5) * (COLS - 1));
    const r = Math.round(horizon + ((cam.y - p.y) * PROJ) / fwd);
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) continue;
    const idx = r * COLS + c;
    if (fwd >= depthBuf[idx]) continue;
    const f = Math.exp(-fwd * FOG_K);
    let step = fogStep(f) - (p.lift > 0 ? p.lift : 0);
    if (p.lift < 0) step += 1;
    step = Math.max(0, Math.min(N_STEPS - 1, step));
    charBuf[idx] = CIDX.get(p.ch) ?? CIDX.get('·');
    slotBuf[idx] = p.band * N_STEPS + step;
    depthBuf[idx] = fwd;
  }
}

// screen-space cells — menus, curtain calls: the few earned flat moments
function renderScreen(t) {
  if (!scene.screen) return;
  scene.screen(t, (col, row, ch, band, step = 0) => {
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
    const k = CIDX.get(ch);
    if (k === undefined) return;
    const idx = row * COLS + col;
    charBuf[idx] = k;
    slotBuf[idx] = band * N_STEPS + Math.max(0, Math.min(N_STEPS - 1, step));
    depthBuf[idx] = 0.1;
  }, { cols: COLS, rows: ROWS });
}

// the transition veil — the world dissolving into drifting letters and
// recondensing as the next place. styles: veil (dream-cut) · streak (the
// ride) · fall (the leap)
function veilOverlay(t) {
  if (!trans) return;
  const onPage = trans.phase === 'page' || trans.phase === 'switching';
  const tt = t - trans.t0;
  const f = onPage ? 1 :
    trans.phase === 'out' ? Math.min(1, tt / trans.dur) : 1 - Math.min(1, tt / trans.dur);
  if (f <= 0.01) return;
  const cover = Math.pow(f, 1.15);
  // while the page is open the storm slows and dims — paper behind the ink
  const vDrift = onPage ? t * 1.5 : t;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let hx, hz;
      if (trans.style === 'streak') { hx = c - Math.floor(vDrift * 60); hz = r; }
      else if (trans.style === 'fall') { hx = c; hz = r - Math.floor(vDrift * 45); }
      else { hx = c; hz = r + Math.floor(vDrift * 8); }
      if (h2i(hx * 3 + 1, hz * 7 + 2) > cover) continue;
      const idx = r * COLS + c;
      const li = Math.floor(h2i(hx, hz + 13) * writIdx.length);
      // condensing in after a page, most drifting letters are the page's own
      // — the place is legibly made of the words just read
      let k = writIdx[li];
      if (trans.phase === 'in' && trans.residue && h2i(hx + 9, hz + 4) < 0.65) {
        const rch = trans.residue[Math.floor(h2i(hx, hz + 13) * trans.residue.length)];
        const rk = CIDX.get(rch);
        if (rk !== undefined) k = rk;
      }
      charBuf[idx] = k;
      slotBuf[idx] = 9 * N_STEPS + (onPage ? 4 + Math.floor(h2i(hx + 5, hz) * 2) : 2 + Math.floor(h2i(hx + 5, hz) * 3));
    }
  }
}

function draw() {
  fctx.clearRect(0, 0, frame.width, frame.height);
  for (let r = 0; r < ROWS; r++) {
    const ro = r * COLS;
    const yy = OY + r * CH;
    for (let c = 0; c < COLS; c++) {
      const k = charBuf[ro + c];
      if (k === 0) continue;
      fctx.drawImage(atlas, k * CW, slotBuf[ro + c] * CH, CW, CH, OX + c * CW, yy, CW, CH);
    }
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.fillStyle = STYLE.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (STYLE.horizon) {
    const hy = OY + (ROWS * 0.42 + cam.pitch * ROWS * 0.9) * CH;
    const g = ctx.createLinearGradient(0, hy - canvas.height * 0.2, 0, hy + canvas.height * 0.12);
    const [hr, hg, hb] = hex(STYLE.horizon);
    g.addColorStop(0, `rgba(${hr},${hg},${hb},0)`);
    g.addColorStop(0.55, `rgba(${hr},${hg},${hb},0.6)`);
    g.addColorStop(1, `rgba(${hr},${hg},${hb},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, Math.max(0, hy - canvas.height * 0.2), canvas.width, canvas.height * 0.32);
  }
  ctx.drawImage(frame, 0, 0);
  if (STYLE.glow) {
    bctx.clearRect(0, 0, bloomC.width, bloomC.height);
    bctx.drawImage(frame, 0, 0, bloomC.width, bloomC.height);
    ctx.globalCompositeOperation = STYLE.inverse ? 'multiply' : 'lighter';
    ctx.globalAlpha = STYLE.reg === 'phosphor' ? 0.55 : 0.4;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(bloomC, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }
  if (STYLE.scan) ctx.drawImage(scanC, 0, 0);
  if (STYLE.vig) ctx.drawImage(vigC, 0, 0);
}

// --------------------------------------------------------------------- loop

let last = performance.now();
function frameLoop(now) {
  requestAnimationFrame(frameLoop);
  if (!sceneReady || !STYLE) return;
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  const t = now / 1000;
  nowT = t;
  LIM = liminal();
  speechGlow *= 0.9;
  updateEnv(t);
  // the transition state machine — out, (page), switch, in
  if (trans) {
    const tt = t - trans.t0;
    if (trans.phase === 'out' && tt >= trans.dur) {
      if (trans.page) {
        trans.phase = 'page';
        pageState = { t0: t, name: trans.page.name, text: trans.page.text, done: false, turn: false };
      } else {
        trans.phase = 'switching';
        setScene(trans.next, false, trans.spawn).then(() => {
          trans.phase = 'in'; trans.t0 = nowT;
        });
      }
    } else if (trans.phase === 'page') {
      // Space turns the page; a walked-away night still advances
      if (pageState && (pageState.turn || t - pageState.t0 > PAGE_SAFETY)) {
        // the read words are what the next place condenses out of
        trans.residue = (pageState.name + pageState.text).replace(/\s+/g, '');
        pageState = null;
        trans.phase = 'switching';
        setScene(trans.next, false, trans.spawn).then(() => {
          trans.phase = 'in'; trans.t0 = nowT;
        });
      }
    } else if (trans.phase === 'in' && tt >= trans.dur) {
      trans = null;
    }
    if (trans && trans.phase === 'switching') return;
  }
  if (!labMode && director && !trans) director.update(cam, t, env, directorApi);
  if (scene.envHook) scene.envHook(env, t);
  updateCam(dt);
  renderTerrain(t);
  renderSky(t);
  renderBeings(t);
  renderScreen(t);
  renderCard(t);
  renderSpeak(t);
  renderMargin(t);
  veilOverlay(t);
  renderPage(t);
  draw();
}

// --------------------------------------------------------------------- boot

const directorApi = {
  transition,
  setMoveLock,
  enterStage(sceneId, spawn) { setScene(sceneId, false, spawn); },
  sceneId() { return scene?.id; },
};

export function initEngine(scenes, nightDirector = null) {
  SCENES = scenes.filter((s) => s && s.id && s.world && typeof s.world.height === 'function');
  loadDream();
  try { store = JSON.parse(localStorage.getItem(STORE_KEY) || 'null') || store; } catch {}
  gridScale = store.gridScale || 1;
  const params = new URLSearchParams(location.search);
  if (params.has('fresh')) {
    // the virgin night — no pass, no folds, every star still home
    try { localStorage.clear(); } catch {}
    Object.assign(dream, { visited: {}, pass: false, jacket: 'none', folds: 0, stage: 0, chosen: {}, echo: {} });
    store = { scene: null, gridScale: 1, perScene: {} };
    try { history.replaceState(null, '', location.pathname); } catch {}
  }
  const q = params.get('scene');
  labMode = !!q || params.has('lab') || !nightDirector;
  director = nightDirector;
  GLOBAL_EXTRA = director?.pageChars ? director.pageChars() : [];
  initEnv().then(() => hud());
  if (labMode) {
    setScene(q || store.scene || (SCENES[0] && SCENES[0].id));
  } else {
    director.begin(directorApi);
  }
  requestAnimationFrame(frameLoop);

  window.term = {
    cam(x, z, yaw = 0, pitch = 0) {
      cam.x = x; cam.z = z; cam.yaw = yaw; cam.pitch = pitch;
      cam.y = Math.max(sceneHeight(x, z), WL) + 2.3;
    },
    scene(id) { return setScene(id); },
    scenes() { return SCENES.map((s) => s.id); },
    style(name) { applyStyle(name, {}); },
    toggle(k) { k === 'letters' ? cycleLetters() : toggleFlag(k); },
    scale(s) { setScale(s); },
    envSource(s) { s ? (setSourceSafe(s), hud()) : toggleSource(); hud(); return env.source; },
    env, // live handle
    dream, // the walk's memory
    signal, // inject a night event (verification)
    night() { return director ? { stage: director.stageIdx(), lab: labMode } : { lab: labMode }; },
    liminal, // the dial, live
    ui() { return { page: !!pageState, pageDone: !!pageState?.done, card: !!card, speak: !!speakCur }; },
    text() {
      const lines = [];
      for (let r = 0; r < ROWS; r++) {
        let s = '';
        for (let c = 0; c < COLS; c++) s += CHARS[charBuf[r * COLS + c]];
        lines.push(s.replace(/\s+$/, ''));
      }
      return lines.join('\n');
    },
    state() { return { ...cam, COLS, ROWS, scene: scene?.id, style: STYLE?.reg, env: env.source }; },
  };
}

import { setSource as setSourceSafe } from './env.js';
