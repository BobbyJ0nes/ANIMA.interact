// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-mage-under-the-willow — phosphor register. the willow as a cascade
// of code; the mage keeps his office beneath it.
// "- All black cats must be registered with the Mage under the Willow"
//                                          (98 - Journal/06.06.26.txt:31)
// the road carries the mouse's paragraph    (98 - Journal/06.06.26.txt:7)
//
// v2 — the registration made visible. a queue of black-cat forms waits at
// the office door on its own clock, watched or not; one at a time they go
// in and come out LETTERED, a faint letter drifting in the form: the name,
// now written. the Mage never appears — the rule (the scene's own typeset
// line) is all of him there is. ONE cat is refused and never joins; crouch-
// linger beside it and it registers YOU instead, a letter lifting out of
// its form to settle where you stand. the sign already speaks the rule, so
// the margin stays quiet here — one voice at a time, and this one is the
// world's. conduct is not intention (sol, 19.08): witnessed acts only; an
// unwatched queue records nothing.

import { h2i, vnoise, dream, onWater, narrate, choose, facing, liminal } from '../engine.js';
import { makeWake } from './lib/wake.js';
import { makeNarrator } from './lib/narrator.js';

const wake = makeWake();
let midCued = false, lastBT = -9;

// the road passes the mage's office east-west; the mouse's paragraph
// walks it with you
const ROAD_Z = 8, ROAD_X0 = 28;
const narrator = makeNarrator(
  "A mouse scurries across the green grass. I heard it's soft footsteps " +
  'and short-breaths in the brush as I walked by. He has his midnight ' +
  'meeting on the 12th day of the cycle at the old Oak tree, so long my ' +
  'friend. He was wearing his finest little Tuxedo. The sleeves ran too ' +
  'long and the bow-tie was crooked. He was in a rush and his pocket-watch was late.',
  [{ x: ROAD_X0, z: ROAD_Z }, { x: -ROAD_X0, z: ROAD_Z }]
);

const W = { x: 0, z: -6 };        // the willow's trunk
const M = { x: 1.8, z: -3.4 };    // the mage, at the canopy's edge
const CROWN_UP = 9.5;
const N_STRANDS = 26;
const ABC = 'abcdefghijklmnopqrstuvwxyz';
const lerp = (a, b, u) => a + (b - a) * u;

function heightRaw(x, z) {
  let h = vnoise(x * 0.025, z * 0.025) * 4.5 + vnoise(x * 0.06, z * 0.06) * 1.6 - 1.4;
  const dx = x - W.x, dz = z - W.z;
  h += 5.2 * Math.exp(-(dx * dx + dz * dz) / (15 * 15));
  if (h < 0.35) h = 0.35 + (0.35 - h) * 0.15; // the meadow stays above the sea
  return h;
}

// ------------------------------------------------------------ the queue
// the office door, the line that trails from it toward the road, and the
// two ends of the errand: they arrive from the east and leave west.

const DOOR = { x: M.x + 0.5, z: M.z + 1.15 };
const QD = { x: 0.3, z: 0.954 };
const QSLOT = [0, 1, 2, 3].map((j) => ({
  x: DOOR.x + QD.x * (1.8 + j * 1.3),
  z: DOOR.z + QD.z * (1.8 + j * 1.3),
}));
const EXIT = { x: -11.5, z: 3.4 };
const ENTRY = { x: 16, z: 7.2 };
const NQ = 5;          // four waiting, one at the door
const PERIOD = 23;     // one registered every ~23s, watched or not
const UN = { x: -5.6, z: 1.6 };   // the refused one, apart from the line

// ---------------------------------------------------------------- the tree

let built = null;

function makeCat(all, seed) {
  // haunch, back, head, glint, two ears, and the name it may leave with
  const cells = ['█', '█', '▓', '·', ',', ',', 'a'].map((ch, i) => {
    const p = { x: 0, y: -100, z: 0, ch, band: i === 3 ? 7 : i === 6 ? 4 : 8, lift: i > 5 ? 1 : 0 };
    all.push(p);
    return p;
  });
  return { seed, cells, name: cells[6] };
}

function hideCat(c) { for (const p of c.cells) p.y = -100; }

// condensed matter, likeness unresolved. the ears are the notice — they
// turn toward whoever passes, before anything else admits you.
function setCat(c, x, z, dx, dz, cam, lettered, t) {
  const gy = heightRaw(x, z), p = c.cells;
  const hx = x + dx * 0.24, hz = z + dz * 0.24;
  p[0].x = x; p[0].y = gy + 0.18; p[0].z = z;
  p[1].x = x + dx * 0.13; p[1].y = gy + 0.18; p[1].z = z + dz * 0.13;
  p[2].x = hx; p[2].y = gy + 0.42; p[2].z = hz;
  p[3].x = hx + dx * 0.04; p[3].y = gy + 0.44; p[3].z = hz + dz * 0.04 + 0.16;
  let ex = cam.x - hx, ez = cam.z - hz;
  const ed = Math.hypot(ex, ez) || 1;
  if (ed < 11) { ex /= ed; ez /= ed; } else { ex = dx; ez = dz; }
  p[4].x = hx + ex * 0.1 - ez * 0.09; p[4].z = hz + ez * 0.1 + ex * 0.09;
  p[5].x = hx + ex * 0.1 + ez * 0.09; p[5].z = hz + ez * 0.1 - ex * 0.09;
  p[4].y = gy + 0.56; p[5].y = gy + 0.56;
  // registered: its name drifts faintly in its form, now that it is written
  p[6].x = hx + Math.sin(t * 1.3 + c.seed) * 0.13;
  p[6].z = hz + Math.cos(t * 1.1 + c.seed) * 0.13;
  p[6].y = lettered ? gy + 0.63 + Math.sin(t * 0.9 + c.seed) * 0.06 : -100;
  return { hx, hz, hy: gy + 0.42 };
}

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
      pts.push({ p, bx, bz, by: y, sPow: Math.pow(s, 1.3) });
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

  // the queue, and the one that never joins it
  const cats = [];
  for (let i = 0; i < NQ; i++) cats.push(makeCat(all, 831 + i * 7));
  const unreg = makeCat(all, 887);
  // the letter that would be your name, and the little of it that trails
  const mark = [0, 1, 2, 3].map((i) => ({ x: 0, y: -100, z: 0, ch: i ? '·' : 'a', band: 7, lift: i ? 0 : 1 }));
  mark.forEach((p) => all.push(p));

  // three falling leaf-letters — pooled, parked below the world when idle
  const leaves = [0, 1, 2].map(() => ({ x: 0, y: -100, z: 0, ch: 'w', band: 4, lift: 0 }));
  leaves.forEach((p) => all.push(p));

  return { all, strands, cats, unreg, mark, leaves, crownY, eye };
}

// ------------------------------------------------------------- the clock

let lastT = 0, lastX = 1e9, lastZ = 1e9;
let lastCi = -1, watchT = 0, watchAfter = 0, eyeFlare = -9;
let unT = 0, regT = -9, regFrom = null, regTo = null;

// one scratch step of an errand: where a cat is, and which way it faces
const P = { x: 0, z: 0, dx: 0, dz: 0 };
function seg(A, B, a) {
  P.x = lerp(A.x, B.x, a); P.z = lerp(A.z, B.z, a);
  P.dx = B.x - A.x; P.dz = B.z - A.z;
}

function queue(t, dt, cam) {
  const b = built;
  const cyc = t / PERIOD;
  const ci = Math.floor(cyc), u = cyc - ci;
  if (ci !== lastCi) {
    lastCi = ci; watchT = 0; watchAfter = 0;
    // the one at the door this cycle leaves under a new letter
    b.cats[((ci % NQ) + NQ) % NQ].name.ch = ABC[Math.floor(h2i(ci, 901) * 26)];
  }
  for (let k = 0; k < NQ; k++) {
    const c = b.cats[k];
    const R = ((k - ci) % NQ + NQ) % NQ;   // 0 = at the door, NQ-1 = still coming
    let lettered = false;
    if (R === 0) {
      if (u < 0.18) seg(QSLOT[0], DOOR, u / 0.18);            // called in
      else if (u < 0.42) {                                    // inside, whatever he is
        P.x = DOOR.x; P.z = DOOR.z; P.dx = M.x - DOOR.x; P.dz = M.z - DOOR.z;
      } else if (u < 0.86) { seg(DOOR, EXIT, (u - 0.42) / 0.44); lettered = true; }
      else { hideCat(c); continue; }                          // away west, written
    } else if (R < NQ - 1) {                                  // waiting; the line steps up
      seg(QSLOT[R], QSLOT[R - 1], u < 0.42 ? 0 : Math.min(1, (u - 0.42) / 0.2));
    } else if (u < 0.55) { hideCat(c); continue; }             // not arrived yet
    else seg(ENTRY, QSLOT[NQ - 2], Math.min(1, (u - 0.55) / 0.4)); // in off the road
    const dd = Math.hypot(P.dx, P.dz) || 1;
    setCat(c, P.x, P.z, P.dx / dd, P.dz / dd, cam, lettered, t);
  }

  // witnessing the registration: near the office, facing it, across a whole
  // turn of the clock — and still there when the letter comes out.
  const dDoor = Math.hypot(cam.x - DOOR.x, cam.z - DOOR.z);
  if (dDoor < 13 && facing(DOOR.x, DOOR.z, 0.6)) {
    watchT += dt;
    if (u > 0.42) watchAfter += dt;
  }
  if (u > 0.6 && watchT > 2 && watchAfter > 0.6 && !dream.chosen.cats) {
    choose('cats', 'registered');
    eyeFlare = t;                    // the office notices you noticing
  }
  return u;
}

// the refused one: it keeps its distance, leans toward the line each time
// it moves, and settles back. it is never called in.
function refused(t, dt, u, cam) {
  const b = built;
  const hop = Math.floor(t / 9);
  const ux = UN.x + (h2i(hop, 941) - 0.5) * 1.1, uz = UN.z + (h2i(hop, 942) - 0.5) * 1.1;
  let tox = QSLOT[NQ - 2].x - ux, toz = QSLOT[NQ - 2].z - uz;
  const td = Math.hypot(tox, toz) || 1;
  tox /= td; toz /= td;
  const lean = u > 0.45 && u < 0.62 ? Math.sin(((u - 0.45) / 0.17) * Math.PI) * 0.55 : 0;
  const head = setCat(b.unreg, ux + tox * lean, uz + toz * lean, tox, toz, cam, false, t);

  // crouch-linger beside it — still, and close — and it registers you
  const moved = Math.hypot(cam.x - lastX, cam.z - lastZ);
  if (moved < 0.012 && Math.hypot(cam.x - ux, cam.z - uz) < 3.4) unT += dt; else unT = 0;
  if (unT > 2 && dream.chosen.cats !== 'unregistered') {
    choose('cats', 'unregistered');
    regT = t;
    b.mark[0].ch = ABC[Math.floor(h2i(Math.floor(t * 3), 951) * 26)];
    regFrom = { x: head.hx, y: head.hy, z: head.hz };
    regTo = { x: cam.x + Math.sin(cam.yaw) * 1.5, y: cam.y - 0.15, z: cam.z - Math.cos(cam.yaw) * 1.5 };
  }
  // the letter lifts out of its form and settles where you stand
  const a = t - regT;
  if (regFrom && a < 4.2) {
    for (let i = 0; i < b.mark.length; i++) {
      const p = b.mark[i], w = Math.min(1, Math.max(0, a / 1.1 - i * 0.11));
      const dr = w < 1 ? 0 : 0.045;              // settled, it keeps drifting
      p.x = lerp(regFrom.x, regTo.x, w) + Math.sin(t * 0.7) * dr;
      p.z = lerp(regFrom.z, regTo.z, w);
      p.y = lerp(regFrom.y, regTo.y, w) + Math.sin(w * Math.PI) * 0.45 + Math.sin(t * 1.1) * dr;
      p.lift = i ? 0 : a > 3.2 ? 0 : 1;
      if (i && (w <= 0 || a > 1.7)) p.y = -100;    // the trail thins first
    }
  } else for (const p of b.mark) p.y = -100;
}

function animate(t, dt, env, cam) {
  const b = built;
  // sway — the tree breathes with drift (alpha). deeper in the night the
  // strands hang lower: the one liminal coupling, gains only.
  const amp = 0.22 + env.ch.drift * 0.85;
  const droop = liminal() * 0.85;
  for (const s of b.strands) {
    const sw = Math.sin(t * s.spd + s.ph) * amp;
    const ox = s.swx * sw, oz = s.swz * sw;
    for (const q of s.pts) {
      q.p.x = q.bx + ox * q.sPow;
      q.p.z = q.bz + oz * q.sPow;
      q.p.y = q.by - droop * q.sPow;
    }
  }
  // his gaze — the glint tracks whoever stands in his office
  const gdx = cam.x - M.x, gdz = cam.z - M.z;
  const gd = Math.hypot(gdx, gdz) || 1;
  b.eye.x = M.x + (gdx / gd) * 0.24;
  b.eye.z = M.z + (gdz / gd) * 0.24;
  b.eye.lift = t - eyeFlare < 1.8 ? 2 : 1;
  // the office keeps its hours whether or not anyone is watching
  const u = queue(t, dt, cam);
  refused(t, dt, u, cam);

  // leaf-letters — rare detachments, falling cell by cell (spark opens the gate)
  for (let i = 0; i < b.leaves.length; i++) {
    const p = b.leaves[i];
    const uu = (t + i * 5.1) / (8 + i * 3.7);
    const ci = Math.floor(uu);
    const frac = uu - ci;
    const gate = h2i(ci * 7 + i, 701) < 0.12 + env.ch.spark * 0.55;
    if (frac < 0.42 && gate) {
      const s = b.strands[Math.floor(h2i(ci, 702 + i) * b.strands.length)];
      const steps = 14;
      const k = Math.floor((frac / 0.42) * steps);
      const y0 = b.crownY - 1.2;
      p.x = s.ax + (h2i(ci * 3 + k, 703) - 0.5) * 0.8;
      p.z = s.az + (h2i(ci * 5 + k, 705) - 0.5) * 0.5;
      p.y = y0 - (k * (y0 - s.gy)) / steps;
      p.ch = ABC[Math.floor(h2i(ci, 704 + i) * 26)];
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
      // the road, worn, carrying the mouse's paragraph. the pull: the unread
      // brightens — a crest travels the sentence westward at reading pace,
      // and walking it is reading it.
      if (Math.abs(wz - ROAD_Z) < 1.5) {
        g.band = 5; g.lum *= 0.78;
        // a crest of light travels the sentence westward at reading pace:
        // the unread brightens, and the pull is the next word
        if (narrator.apply(wx, wz, g) &&
            Math.sin(t * 1.95 - (ROAD_X0 - wx) * 0.45) > 0.55) g.band = 6;
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
    const dt = Math.min(0.1, Math.max(0, t - lastT));
    animate(t, dt, env, cam);
    lastT = t;
    lastX = cam.x; lastZ = cam.z;
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
