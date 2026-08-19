// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// fate-at-the-gate — the reference scene. night register, default notation.
// "Fate greets me at the gate. It's been some time since we last met -
//  she's growing old. Her cold glare doesn't cut me anymore."

import { h2i, vnoise, dream, markDream, condense, onWater, signal, narrate } from '../engine.js';
import { makeWake } from './lib/wake.js';
import { makeNarrator } from './lib/narrator.js';

const HILL = { x: 0, z: -220, amp: 26, r: 70 };
const GATE = { x: 0, z: -10 };
const FATE = { x: 2.6, z: -9.2 };
const LINE1 = "we're all here and gone and gone again.";
const LINE2 = "What's the date my child? Matter of fact, have you got a pen?";
const PASS_TEXT = '1 visitors pass to Tomorrow';

// "The moss on the stones to my right whisper of the silent night."
// stones on the path's right hand as you walk to the gate; the moss
// murmurs single letters of its own line — words never assemble.
// leaning close is the only way anything resolves (rule made mechanical).
const MOSS_LINE = 'The moss on the stones to my right whisper of the silent night.';
const WA = "abcdefghijklmnopqrstuvwxyzWGFTSAI0682.,:;·-—'\"()";
const MOSS_SEEDS = [...MOSS_LINE].filter((c) => c !== ' ' && WA.indexOf(c) >= 0)
  .map((c) => WA.indexOf(c));
const STONES = [
  { x: 4.6, z: 7.2 }, { x: 6.3, z: 3.1 }, { x: 5.2, z: -0.8 },
  { x: 7.4, z: -4.6 }, { x: 4.9, z: -7.9 },
];

const wake = makeWake();

// the approach carries the writing's opening — the narrator is the path
const OPENING =
  "A wise man once told me to never look Eagle's in the eye. Fly high over " +
  'the mountain tops amongst the clouds. Soft silk in the cottage on the ' +
  'river ferry. The ripples on the water shines, and the light dances on ' +
  'the top. Crops, trimmed and ready. Diamond tipped pencil on some lined paper.';
const PATH_POLY = [];
for (let z = 20; z >= -9; z -= 3.5) PATH_POLY.push({ x: pathOffset(z), z });
const narrator = makeNarrator(OPENING, PATH_POLY);

// the glowing mushrooms — the pass's own instruction, leading west out of
// the meadow toward the cloakroom
const MUSH_G = [];
for (let i = 0; i < 10; i++) {
  MUSH_G.push({ x: -3.5 - i * 3.1, z: -10 + Math.sin(i * 0.9) * 2.6 + i * 0.3 });
}
const TRAIL_END = MUSH_G[MUSH_G.length - 1];

function typeset(text, x, y, z, reveal) {
  const pts = [];
  const n = Math.floor(Math.max(0, Math.min(1, reveal)) * text.length);
  for (let i = 0; i < n; i++) {
    const ch = text[i];
    if (ch === ' ') continue;
    pts.push({
      x: x + (i - text.length / 2) * 0.12,
      y: y + (h2i(i * 7, 3) - 0.5) * 0.1,
      z, ch, band: 7, lift: 1,
    });
  }
  return pts;
}

function pathOffset(z) { return Math.sin(z * 0.13) * 1.7; }

function staticPts() {
  const pts = [];
  for (const px of [-1.6, 1.6])
    for (let y = 0; y <= 3.0; y += 0.11)
      pts.push({ x: GATE.x + px, y, z: GATE.z, ch: '║', band: 4, lift: 0 });
  for (const y of [1.2, 2.0])
    for (let x = -1.35; x <= 1.36; x += 0.1)
      pts.push({ x: GATE.x + x, y, z: GATE.z, ch: '═', band: 4, lift: 0 });
  for (let a = 0.06; a < Math.PI; a += 0.07)
    pts.push({ x: GATE.x + 1.6 * Math.cos(a), y: 3.1 + 0.9 * Math.sin(a), z: GATE.z, ch: '·', band: 4, lift: 0 });
  // fate — a pale column, likeness unresolved on purpose
  for (let y = 0; y <= 2.8; y += 0.11)
    pts.push({ x: FATE.x, y, z: FATE.z, ch: '▒', band: 7, lift: 0 });
  pts.push({ x: FATE.x, y: 3.05, z: FATE.z, ch: '▓', band: 7, lift: 1 });
  // her pen-hand, extended — she never got her pen back
  for (let i = 0; i < 7; i++)
    pts.push({ x: FATE.x + 0.18 + i * 0.12, y: 2.02 - i * 0.05, z: FATE.z - 0.06, ch: '▒', band: 7, lift: 0 });
  // the moss stones — low domes of dream-matter on the right of the path
  for (const s of STONES) {
    const base = heightRaw(s.x, s.z);
    for (let i = 0; i < 10; i++) {
      const a = h2i(i, 71) * Math.PI * 2;
      const r = Math.sqrt(h2i(i, 72)) * 0.9;
      pts.push({
        x: s.x + Math.cos(a) * r,
        y: base + 0.12 + (1 - r) * 0.42 * h2i(i, 73),
        z: s.z + Math.sin(a) * r * 0.8,
        ch: h2i(i, 74) > 0.6 ? '▓' : '░', band: 2, lift: 0,
      });
    }
  }
  // the castle on the hill, silhouette — where he met her
  const hy = heightRaw(HILL.x, HILL.z);
  for (let i = 0; i < 14; i++) {
    pts.push({
      x: HILL.x + (h2i(i, 9) - 0.5) * 16,
      y: hy + 1 + h2i(i, 6) * 7,
      z: HILL.z + (h2i(i, 4) - 0.5) * 9,
      ch: '▓█░'[i % 3], band: 8, lift: 2,
    });
  }
  return pts;
}

function heightRaw(x, z) {
  let h = vnoise(x * 0.02, z * 0.02) * 7 + vnoise(x * 0.055, z * 0.055) * 2.4 - 2.2;
  const dx = x - HILL.x, dz = z - HILL.z;
  h += HILL.amp * Math.exp(-(dx * dx + dz * dz) / (HILL.r * HILL.r));
  const s = (z - 55) / 26;
  if (s > 0) h -= Math.min(1, s) * Math.min(1, s) * 9;
  if (z < 48 && z > -60 && h < 0.4) h = 0.4 + (0.4 - h) * 0.2;
  return h;
}

let STATIC = null;
let passT = -1;
let tongueFrom = null;
let fateCued = false, passCued = false, lastBT = -9;
const GRIP = { x: FATE.x + 1.02, y: 1.68, z: FATE.z - 0.06 };

export default {
  id: 'gate',
  title: 'fate at the gate',
  register: 'night',
  notation: { extra: ['M', '?', '1'] },
  world: {
    far: 300,
    waterLevel: 0,
    islandR: null, // carries its own water at the south edge
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g, t) {
      if (wz > -8.5 && wz < 27 && Math.abs(wx - pathOffset(wz)) < 1.4) { g.band = 5; g.lum *= 0.72; }
      const fl = h2i(Math.floor(wx * 2) + 7, Math.floor(wz * 2) + 3);
      if (fl > 0.9988) { g.band = 6; g.lum += 0.12; }
      // the narrator underfoot — the opening paragraph laid along the path
      if (wz > -9.5 && wz < 21 && narrator.apply(wx, wz, g)) { g.band = 5; return; }
      // the mushroom trail's warm ground
      for (const m of MUSH_G) {
        const md = Math.hypot(wx - m.x, wz - m.z);
        if (md < 1.1) { g.band = 6; g.lum += (1.1 - md) * 0.4; break; }
      }
      // the whispering moss — near the stones, ~3% of cells surface a
      // letter of the moss's line for a breath; murmur, never caption
      for (const s of STONES) {
        const d = Math.hypot(wx - s.x, wz - s.z);
        if (d < 2.4) {
          g.band = 2;
          g.lum *= 0.86;
          const cellA = Math.floor(wx * 2.2) + 13, cellB = Math.floor(wz * 2.2) + Math.floor(t / 1.6);
          if (h2i(cellA, cellB) < 0.03) {
            g.letter = true;
            g.letterSeed = MOSS_SEEDS[Math.floor(h2i(cellB, cellA) * MOSS_SEEDS.length)];
          }
          break;
        }
      }
      // the south shore — the land dissolves into the text as it sinks
      if (wz > 42 && hS < 1.6) {
        const p = Math.min(1, (1.6 - hS) / 1.6) * Math.min(1, (wz - 42) / 8);
        if (h2i(Math.floor(wx * 1.6) + 5, Math.floor(wz * 1.6) + 8) < p * 0.75) {
          g.letter = true;
          g.letterSeed = Math.floor(h2i(Math.floor(wx * 1.1) + Math.floor(t * 0.4), Math.floor(wz * 1.1)) * 46);
        }
      }
    },
    water(wx, wz, w, t) { wake.apply(wx, wz, w, t); },
  },
  spawn: { x: 0, z: 26, yaw: 0 },
  sky: { moon: { phase: 0.94 } }, // near full — the night of the writing
  beings(t, cam) {
    if (!STATIC) STATIC = staticPts();
    const pts = [...STATIC];
    wake.note(cam, t, onWater());
    // re-entry (the fold): the exchange happens again
    if (t - lastBT > 2.5) { fateCued = false; passCued = false; }
    lastBT = t;
    // the margin voice, cued at the moments of the exchange
    const fd = Math.hypot(cam.x - FATE.x, cam.z - FATE.z);
    if (!fateCued && fd < 12) {
      fateCued = true;
      narrate("fate greets me at the gate. it's been some time since we last met - she's growing old.");
      narrate("her cold glare doesn't cut me anymore.");
    }
    if (!passCued && dream.pass) {
      passCued = true;
      narrate('i pass her the tip of my tongue to write my cards');
      narrate("'1 visitors pass to tomorrow'");
      narrate('follow the glowing mushrooms to the cloakroom where you can store your memories for the journey.');
    }
    // the glowing mushrooms — the pulse travels outward: this way
    for (let i = 0; i < MUSH_G.length; i++) {
      const m = MUSH_G[i];
      const gy = heightRaw(m.x, m.z);
      const lit = Math.sin(t * 2.2 - i * 0.85) > 0.55;
      pts.push({ x: m.x, y: gy + 0.5, z: m.z, ch: '·', band: 6, lift: lit ? 2 : 1 });
      pts.push({ x: m.x, y: gy + 0.26, z: m.z, ch: ':', band: 6, lift: lit ? 1 : 0 });
    }
    if (dream.pass && Math.hypot(cam.x - TRAIL_END.x, cam.z - TRAIL_END.z) < 3.5) signal('trailEnd');
    // the fold's margin note — gone and gone again
    if (dream.folds > 0) {
      const mark = `gone and gone again · ${dream.folds + 1}`;
      for (let i = 0; i < mark.length; i++) {
        const ch = mark[i];
        if (ch === ' ') continue;
        pts.push({
          x: GATE.x + (i - mark.length / 2) * 0.12,
          y: 4.55, z: GATE.z - 0.9, ch, band: 9, lift: 0,
        });
      }
    }
    // fate speaks by condensation — signs type, beings condense (19.08)
    const d = Math.hypot(cam.x - FATE.x, cam.z - FATE.z);
    pts.push(...condense(LINE1, FATE.x - 0.6, 3.9, FATE.z - 0.5,
      Math.max(0, Math.min(1, (15 - d) / 6)), t, 7));
    pts.push(...condense(LINE2, FATE.x - 0.6, 5.1, FATE.z - 0.5,
      Math.max(0, Math.min(1, (9 - d) / 3.5)), t, 47));
    // crossing the gate issues the pass — once, kept for the whole walk.
    // "I pass her the tip of my tongue to write my cards" — the payment
    // is the voice: the visitor is mute everywhere after this (locked 19.08)
    if (!dream.pass && cam.z < GATE.z - 0.4 && Math.abs(cam.x) < 4.5) {
      markDream('pass', true);
      passT = t;
      tongueFrom = {
        x: cam.x + Math.sin(cam.yaw) * 1.4,
        y: cam.y - 0.4,
        z: cam.z - Math.cos(cam.yaw) * 1.4,
      };
    }
    if (passT > 0 && t - passT < 8) {
      pts.push(...typeset(PASS_TEXT, GATE.x, 5.4, GATE.z - 1.2, (t - passT) / 1.6));
    }
    // her grip: empty before the payment; the tongue-tip arcs to her hand
    // at the crossing; held pale ever after (survives reloads via dream)
    if (!dream.pass) {
      pts.push({ ...GRIP, ch: '·', band: 9, lift: 0 });
    } else if (passT > 0 && t - passT < 1.6 && tongueFrom) {
      for (let i = 0; i < 5; i++) {
        const u = Math.max(0, Math.min(1, (t - passT) / 1.1 - i * 0.09));
        if (u <= 0 || u >= 1) continue;
        pts.push({
          x: tongueFrom.x + (GRIP.x - tongueFrom.x) * u,
          y: tongueFrom.y + (GRIP.y - tongueFrom.y) * u + Math.sin(u * Math.PI) * 1.1,
          z: tongueFrom.z + (GRIP.z - tongueFrom.z) * u,
          ch: '·', band: 7, lift: 1,
        });
      }
      pts.push({ ...GRIP, ch: '·', band: 9, lift: 0 });
    } else {
      pts.push({ ...GRIP, ch: '▒', band: 7, lift: 1 });
    }
    return pts;
  },
};
