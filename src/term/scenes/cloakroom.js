// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-cloakroom (/) — veil register, slash-voiced ground.
// "' Follow the glowing mushrooms to the cloakroom where you can store
//   your memories for the journey.'"
// coats = the stored memories. depth decides how many hang;
// the crossing sends one wind through all of them at once.

import { h2i, vnoise, dream, markDream } from '../engine.js';
import { makeNarrator } from './lib/narrator.js';

// the notice, laid along the aisle underfoot
const narrator = makeNarrator(
  'Follow the glowing mushrooms to the cloakroom where you can store your ' +
  'memories for the journey. A reminder that all dreams are FINAL and ' +
  'cannot be returned after issue.',
  [{ x: 0, z: 44 }, { x: 0, z: -38 }]
);

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// the mushroom trail, wandering in from the spawn
const MZ0 = 41, MSTEP = 5.4;
const MUSH = [];
for (let i = 0; i < 15; i++) {
  const z = MZ0 - i * MSTEP;
  MUSH.push({ x: Math.sin(z * 0.35) * 1.2, z });
}
function nearMush(wx, wz) {
  if (Math.abs(wx) > 3.6) return 0;
  const i = Math.round((MZ0 - wz) / MSTEP);
  if (i < 0 || i >= MUSH.length) return 0;
  const m = MUSH[i];
  const d = Math.hypot(wx - m.x, wz - m.z);
  return d < 1.1 ? (1.1 - d) / 1.1 : 0;
}

function zEnvelope(z) {
  return clamp01((30 - z) / 8) * clamp01((z + 48) / 8);
}

function heightRaw(x, z) {
  let h = 0.4 + vnoise(x * 0.05, z * 0.05) * 0.7;
  const e = zEnvelope(z);
  if (e > 0) {
    const dl = x - 5.5, dr = x + 5.5;
    h += e * 11 * (Math.exp(-(dl * dl) / 2.2) + Math.exp(-(dr * dr) / 2.2));
  }
  const dz = z + 47;
  h += 11 * Math.exp(-(dz * dz) / 6) * clamp01((8 - Math.abs(x)) / 3);
  return h;
}

// ---------------------------------------------------------------- the coats

let SLOTS = null, ORDER = null, FIXED = null, YOURS = null;

// the coat you left last time — warmer hook, a touch brighter than the rest
function yourCoat() {
  const px = -2.8, pz = 19.4;
  const pts = [{ x: px, y: 3.42, z: pz, ch: '·', band: 6, lift: 1 }];
  pts.push({ x: px - 0.14, y: 3.14, z: pz, ch: '(', band: 7, lift: 1 });
  pts.push({ x: px + 0.14, y: 3.14, z: pz, ch: ')', band: 7, lift: 1 });
  for (let y = 3.02, r = 0; y >= 1.7; y -= 0.11, r++) {
    const sp = 0.1 + Math.min(0.06, r * 0.008);
    pts.push({ x: px - sp, y, z: pz, ch: '/', band: 7, lift: 0 });
    pts.push({ x: px + sp, y, z: pz, ch: '\\', band: 7, lift: 0 });
  }
  return pts;
}

function build() {
  SLOTS = [];
  for (const side of [-1, 1]) {
    for (let z = 21; z >= -33; z -= 1.8) {
      const k = SLOTS.length;
      const px = side * 2.8 + (h2i(k, 11) - 0.5) * 0.3;
      const pz = z + (h2i(k, 12) - 0.5) * 0.6;
      const tone = h2i(k, 13);
      const band = tone > 0.93 ? 7 : tone > 0.72 ? 5 : 4;
      const lift = tone > 0.93 ? 1 : 0;
      const pts = [];
      pts.push({ x: px, y: 3.42, z: pz, ch: '·', band: 8, lift: 0, bx: px, hang: 0 });
      pts.push({ x: px - 0.14, y: 3.14, z: pz, ch: '(', band, lift, bx: px - 0.14, hang: 0.1 });
      pts.push({ x: px + 0.14, y: 3.14, z: pz, ch: ')', band, lift, bx: px + 0.14, hang: 0.1 });
      const hem = 3.3 - (1.45 + h2i(k, 14) * 0.5);
      let r = 0;
      for (let y = 3.02; y >= hem; y -= 0.11, r++) {
        const sp = 0.1 + Math.min(0.06, r * 0.008);
        const hang = 3.3 - y;
        pts.push({ x: px - sp, y, z: pz, ch: '/', band, lift, bx: px - sp, hang });
        pts.push({ x: px + sp, y, z: pz, ch: '\\', band, lift, bx: px + sp, hang });
        if (r % 3 === 1) pts.push({ x: px, y, z: pz, ch: '|', band, lift: lift - 1, bx: px, hang });
      }
      SLOTS.push({ pts, ph: h2i(k, 15) * 0.8 });
    }
  }
  ORDER = SLOTS.map((_, i) => i).sort((a, b) => h2i(a, 21) - h2i(b, 21));

  FIXED = [];
  // the rails the memories hang from
  for (const side of [-1, 1])
    for (let z = -34; z <= 21.6; z += 0.14)
      FIXED.push({ x: side * 2.8, y: 3.3, z, ch: '═', band: 8, lift: 0 });
  // the counter at the far end — no one behind it
  for (let x = -2; x <= 2.01; x += 0.13) {
    for (let y = 0.12; y <= 1.02; y += 0.13)
      FIXED.push({ x, y, z: -40, ch: '▓', band: 3, lift: 0 });
    FIXED.push({ x, y: 1.12, z: -40, ch: '═', band: 4, lift: 0 });
  }
  // the glowing mushrooms themselves
  for (const m of MUSH) {
    FIXED.push({ x: m.x, y: 0.52, z: m.z, ch: '·', band: 6, lift: 2 });
    FIXED.push({ x: m.x, y: 0.28, z: m.z, ch: ':', band: 6, lift: 0 });
  }
}

export default {
  id: 'cloakroom',
  title: 'the cloakroom (/)',
  register: 'veil',
  notation: {
    // the cloakroom is the slash — the ground itself speaks in it
    ramp: [' ', '.', '·', ':', '/', '(', ')', '|', '\\', '#', '@'],
    extra: ['(', ')', '/', '\\', '|', '·', ':', '═', '▓', 'N', 'L'],
  },
  world: {
    far: 240,
    waterLevel: 0,
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g) {
      const w = nearMush(wx, wz);
      if (w > 0) { g.band = 6; g.lum += w * 0.45; return; }
      narrator.apply(wx, wz, g);
    },
  },
  spawn: { x: 0, z: 44, yaw: 0 },
  sky: { stars: 0.5, moon: false },
  beings(t, cam, env) {
    if (!SLOTS) build();
    // stepping into the aisle stores the jacket — the journey's deposit
    if (dream.jacket === 'none' && cam.z < 24 && Math.abs(cam.x) < 5) markDream('jacket', 'stored');
    // memories accumulate as you go under
    const n = 8 + Math.floor(env.ch.depth * (SLOTS.length - 8));
    // the crossing sends one wind through the stored memories
    const sway = 0.025 + env.ch.crossing * 0.32;
    const out = [];
    for (let oi = 0; oi < n; oi++) {
      const s = SLOTS[ORDER[oi]];
      const off = Math.sin(t * 1.35 + s.ph) * sway;
      for (const p of s.pts) {
        p.x = p.bx + off * p.hang * 0.42;
        out.push(p);
      }
    }
    out.push(...FIXED);
    // on a return visit, the coat you stored hangs by the entrance
    if ((dream.visited.cloakroom || 0) > 1) {
      if (!YOURS) YOURS = yourCoat();
      out.push(...YOURS);
    }
    return out;
  },
  line: {
    text: 'all dreams are FINAL and cannot be returned after issue.',
    x: 0, z: -40, y: 2.7, radius: 13, // engine's legacy x-offset removed 19.08
  },
};
