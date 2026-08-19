// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-mage-under-the-willow — phosphor register. the willow as a cascade
// of code; the mage keeps his office beneath it.
// "- All black cats must be registered with the Mage under the Willow"

import { h2i, vnoise, dream, onWater, narrate } from '../engine.js';
import { makeWake } from './lib/wake.js';
import { makeNarrator } from './lib/narrator.js';

const wake = makeWake();
let midCued = false, lastBT = -9;

// the road passes the mage's office east-west; the mouse's paragraph
// walks it with you
const ROAD_Z = 8;
const narrator = makeNarrator(
  "A mouse scurries across the green grass. I heard it's soft footsteps " +
  'and short-breaths in the brush as I walked by. He has his midnight ' +
  'meeting on the 12th day of the cycle at the old Oak tree, so long my ' +
  'friend. He was wearing his finest little Tuxedo. The sleeves ran too ' +
  'long and the bow-tie was crooked. He was in a rush and his pocket-watch was late.',
  [{ x: 28, z: ROAD_Z }, { x: -28, z: ROAD_Z }]
);

const W = { x: 0, z: -6 };        // the willow's trunk
const M = { x: 1.8, z: -3.4 };    // the mage, at the canopy's edge
const CROWN_UP = 9.5;
const N_STRANDS = 26;

function heightRaw(x, z) {
  let h = vnoise(x * 0.025, z * 0.025) * 4.5 + vnoise(x * 0.06, z * 0.06) * 1.6 - 1.4;
  const dx = x - W.x, dz = z - W.z;
  h += 5.2 * Math.exp(-(dx * dx + dz * dz) / (15 * 15));
  if (h < 0.35) h = 0.35 + (0.35 - h) * 0.15; // the meadow stays above the sea
  return h;
}

// ---------------------------------------------------------------- the tree

let built = null;

function build() {
  const all = [];
  const baseY = heightRaw(W.x, W.z);
  const crownY = baseY + CROWN_UP;

  // trunk — dark, still
  for (let y = baseY - 0.3; y <= crownY - 0.6; y += 0.12)
    all.push({ x: W.x, y, z: W.z, ch: '▓', band: 8, lift: 0 });

  // crown cap — a modest head of leaves above the curtain
  for (let i = 0; i < 70; i++) {
    const a = h2i(i, 811) * Math.PI * 2;
    const r = Math.sqrt(h2i(i, 812)) * 4.4;
    all.push({
      x: W.x + Math.cos(a) * r,
      y: crownY - 0.4 + h2i(i, 813) * 1.7,
      z: W.z + Math.sin(a) * r,
      ch: h2i(i, 814) < 0.3 ? '@' : '░', band: 3, lift: h2i(i, 815) > 0.9 ? 1 : 0,
    });
  }

  // strands — hanging arcs, tips nearly touching the ground
  const strands = [];
  for (let k = 0; k < N_STRANDS; k++) {
    const th = (k / N_STRANDS) * Math.PI * 2 + h2i(k, 821) * 0.2;
    const rA = 2.2 + h2i(k, 822) * 2.0;
    const ax = W.x + Math.cos(th) * rA, az = W.z + Math.sin(th) * rA;
    const gy = heightRaw(ax + Math.cos(th) * 1.6, az + Math.sin(th) * 1.6);
    const endY = gy + 0.4 + h2i(k, 823) * 1.4;
    const drop = crownY - 0.8 - endY;
    const n = Math.max(6, Math.ceil(drop / 0.14));
    const east = Math.cos(th) >= 0;
    const pts = [];
    for (let j = 0; j <= n; j++) {
      const s = j / n;
      const r = rA + 1.6 * Math.pow(s, 0.7);
      const bx = W.x + Math.cos(th) * r;
      const bz = W.z + Math.sin(th) * r;
      const y = crownY - 0.8 - drop * s;
      const tip = s > 0.85;
      const ch = tip && h2i(k * 31 + j, 824) < 0.45 ? ',' : (h2i(k * 17 + j, 825) < 0.12 ? ',' : (east ? ')' : '('));
      const band = s < 0.3 ? 3 : tip ? 1 : 2;
      const p = { x: bx, y, z: bz, ch, band, lift: h2i(k * 7 + j, 826) > 0.97 ? 1 : 0 };
      all.push(p);
      pts.push({ p, bx, bz, sPow: Math.pow(s, 1.3) });
    }
    strands.push({
      pts, ax, az,
      gy: heightRaw(ax, az),
      swx: -Math.sin(th), swz: Math.cos(th),
      spd: 0.5 + h2i(k, 827) * 0.7,
      ph: h2i(k, 828) * 6.28,
    });
  }

  // the mage — a dark still column; presence, not likeness
  const mgy = heightRaw(M.x, M.z);
  for (let y = 0; y <= 2.4; y += 0.11)
    all.push({ x: M.x, y: mgy + y, z: M.z, ch: '▓', band: 8, lift: 0 });
  all.push({ x: M.x, y: mgy + 2.55, z: M.z, ch: '▓', band: 8, lift: 0 });
  const eye = { x: M.x, y: mgy + 2.1, z: M.z + 0.25, ch: ':', band: 7, lift: 1 };
  all.push(eye);
  const mageY = mgy;

  // two black cats + their glints — parked, repositioned by the clock
  const cats = [];
  for (let i = 0; i < 2; i++) {
    const body = [
      { x: 0, y: -100, z: 0, ch: '█', band: 8, lift: 0 },
      { x: 0, y: -100, z: 0, ch: '█', band: 8, lift: 0 },
      { x: 0, y: -100, z: 0, ch: '▓', band: 8, lift: 0 },
      { x: 0, y: -100, z: 0, ch: '·', band: 7, lift: 0 },
    ];
    body.forEach((p) => all.push(p));
    cats.push({ body, period: i ? 21 : 13, seed: 831 + i, ii: -1 });
  }

  // three falling leaf-letters — pooled, parked below the world when idle
  const leaves = [];
  for (let i = 0; i < 3; i++) {
    const p = { x: 0, y: -100, z: 0, ch: 'w', band: 4, lift: 0 };
    all.push(p);
    leaves.push(p);
  }

  return { all, strands, cats, leaves, crownY, eye, mageY };
}

function animate(t, env, cam) {
  const b = built;
  // sway — the tree breathes with drift (alpha)
  const amp = 0.22 + env.ch.drift * 0.85;
  for (const s of b.strands) {
    const sw = Math.sin(t * s.spd + s.ph) * amp;
    const ox = s.swx * sw, oz = s.swz * sw;
    for (const q of s.pts) {
      q.p.x = q.bx + ox * q.sPow;
      q.p.z = q.bz + oz * q.sPow;
    }
  }
  // his gaze — the glint tracks whoever stands in his office
  const gdx = cam.x - M.x, gdz = cam.z - M.z;
  const gd = Math.hypot(gdx, gdz) || 1;
  b.eye.x = M.x + (gdx / gd) * 0.24;
  b.eye.z = M.z + (gdz / gd) * 0.24;
  // cats — cell-quantized hops on their own clocks. a registered visitor
  // (holding the pass) draws one of them nearer.
  for (const c of b.cats) {
    const ii = Math.floor(t / c.period);
    if (ii !== c.ii) {
      c.ii = ii;
      let a = h2i(ii, c.seed) * Math.PI * 2;
      let r = 1.6 + h2i(ii, c.seed + 40) * 3.4;
      const camD = Math.hypot(cam.x - W.x, cam.z - W.z);
      if (dream.pass && c === b.cats[0] && camD < 14) {
        a = Math.atan2(cam.z - W.z, cam.x - W.x) + (h2i(ii, c.seed + 60) - 0.5) * 0.5;
        r = Math.max(2.2, camD * 0.55);
      }
      const cx = W.x + Math.cos(a) * r, cz = W.z + Math.sin(a) * r;
      const gy = heightRaw(cx, cz);
      c.body[0].x = cx; c.body[0].y = gy + 0.18; c.body[0].z = cz;
      c.body[1].x = cx + 0.13; c.body[1].y = gy + 0.18; c.body[1].z = cz;
      c.body[2].x = cx + 0.24; c.body[2].y = gy + 0.42; c.body[2].z = cz;
      c.body[3].x = cx + 0.26; c.body[3].y = gy + 0.44; c.body[3].z = cz + 0.2;
    }
  }
  // leaf-letters — rare detachments, falling cell by cell (spark opens the gate)
  for (let i = 0; i < b.leaves.length; i++) {
    const p = b.leaves[i];
    const P = 8 + i * 3.7;
    const u = (t + i * 5.1) / P;
    const ci = Math.floor(u);
    const frac = u - ci;
    const gate = h2i(ci * 7 + i, 701) < 0.12 + env.ch.spark * 0.55;
    if (frac < 0.42 && gate) {
      const s = b.strands[Math.floor(h2i(ci, 702 + i) * b.strands.length)];
      const steps = 14;
      const k = Math.floor((frac / 0.42) * steps);
      const y0 = b.crownY - 1.2;
      p.x = s.ax + (h2i(ci * 3 + k, 703) - 0.5) * 0.8;
      p.z = s.az + (h2i(ci * 5 + k, 705) - 0.5) * 0.5;
      p.y = y0 - (k * (y0 - s.gy)) / steps;
      p.ch = 'abcdefghijklmnopqrstuvwxyz'[Math.floor(h2i(ci, 704 + i) * 26)];
    } else {
      p.y = -100;
    }
  }
}

// ------------------------------------------------------------------- scene

export default {
  id: 'willow',
  title: 'the mage under the willow',
  register: 'phosphor',
  notation: {
    // a foliage-voiced depth ramp — parens live where the mid-tones are
    ramp: [' ', '.', ',', ':', ';', '(', ')', '*', '#', '@', '░', '▒', '█'],
    extra: ['M', '1'], // the line's capital; the 12th day's digit
  },
  world: {
    waterLevel: 0,
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g, t) {
      // the road, worn, carrying the mouse's paragraph
      if (Math.abs(wz - ROAD_Z) < 1.5) {
        g.band = 5; g.lum *= 0.78;
        narrator.apply(wx, wz, g);
        return;
      }
      const dx = wx - W.x, dz = wz - W.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < 42) {
        g.lum *= 0.8; // the canopy's shade
        const ch = h2i(Math.floor(wx * 1.7) + 31, Math.floor(wz * 1.7) + 13);
        if (d2 < 30 && ch < 0.2) { g.letter = true; g.letterSeed = Math.floor(ch * 5000); }
      }
    },
    water(wx, wz, w, t) { wake.apply(wx, wz, w, t); },
  },
  spawn: { x: 0, z: 24, yaw: 0 },
  sky: { moon: { phase: 0.85 } }, // office hours — a crisp working moon
  beings(t, cam, env) {
    if (!built) built = build();
    animate(t, env, cam);
    wake.note(cam, t, onWater());
    // halfway down the road, the mouse's errand
    if (!midCued && cam.x < 2) {
      midCued = true;
      narrate('he has his midnight meeting on the 12th day of the cycle at the old Oak tree, so long my friend.');
    }
    if (t - lastBT > 2.5) midCued = false;
    lastBT = t;
    return built.all;
  },
  line: {
    text: 'All black cats must be registered with the Mage under the Willow',
    x: 0, z: -1.6, y: 5.0, radius: 13,
  },
};
