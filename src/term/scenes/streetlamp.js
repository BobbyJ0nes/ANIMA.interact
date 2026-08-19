// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-streetlamp-in-the-strawberry-field — rose register.
// "I waited some time at the street-lamp in the strawberry field. The lamp
//  stood still for most of my wait. I could sense him getting tired when he
//  would start to blink slowly and lean to the side slightly."
// the waiting is the mechanic. stand still and watch him tire.

import { h2i, vnoise, onWater, inDream, signal, narrate } from '../engine.js';
import { makeWake } from './lib/wake.js';
import { makeNarrator } from './lib/narrator.js';

const LAMP = { x: 0, z: -8 };
const OAK = { x: -14, z: -10 };
const wake = makeWake();
const roadZ = (x) => -17 + Math.sin(x * 0.07) * 1.6;

// the wait, narrated underfoot along the road
const narrator = makeNarrator(
  'I waited some time at the street-lamp in the strawberry field. The lamp ' +
  'stood still for most of my wait. I could sense him getting tired when he ' +
  'would start to blink slowly and lean to the side slightly. His warm ' +
  'orange glow would fade to a softer hue before he stands up straight ' +
  'again. My ride arrives at 00:68. Only a couple minutes to late, I should get going.',
  (() => { const p = []; for (let x = 24; x >= -32; x -= 5) p.push({ x, z: roadZ(x) }); return p; })()
);

// the wait is the mechanic (restored from circuit v0): the ride comes only
// after you have kept him company through one full tired cycle — and this
// time it stops. miss it, and you wait with him again.
let sawSag = false, rideDue = false, ride = null, lastBT = -9;

function clamp01(v) { return Math.max(0, Math.min(1, v)); }

function heightRaw(x, z) {
  let h = vnoise(x * 0.025, z * 0.025) * 4.2 + vnoise(x * 0.06, z * 0.06) * 1.6 - 1.9;
  if (h < 0.35) h = 0.35 + (0.35 - h) * 0.25; // the meadow floor holds above the sea
  return h;
}

// his 26s tired cycle — the body's tension makes him tire sooner and deeper;
// when the crossing passes through, he stands up straight mid-sag.
let lampState = { lum: 1, lean: 0 };
function lampCycle(t, env) {
  const tension = env.ch.tension;
  const period = 26 - tension * 6;
  const u = (t % period) / period;
  const rise = clamp01((u - 0.52) / 0.07);
  const fall = clamp01((u - 0.72) / 0.08);
  let sag = rise * (1 - fall) * (0.55 + tension * 0.65);
  if (env.ch.crossing > 0.5) sag *= Math.max(0, 1 - (env.ch.crossing - 0.5) * 2.2);
  sag = Math.min(1, sag);
  const flick = sag > 0.1 ? (h2i(Math.floor(t * 13), 7) - 0.5) * (0.2 + 0.25 * tension) * sag : 0;
  return { lum: 1 - 0.7 * sag + flick, lean: sag };
}

let STATIC = null;
function oakPts() {
  const pts = [];
  const base = Math.max(heightRaw(OAK.x, OAK.z), 0);
  for (let y = 0; y <= 2.4; y += 0.13)
    pts.push({ x: OAK.x, y: base + y, z: OAK.z, ch: '║', band: 2, lift: 0 });
  for (let i = 0; i < 26; i++) {
    const a = h2i(i, 71) * Math.PI * 2, r = 0.6 + h2i(i, 72) * 2.3;
    pts.push({
      x: OAK.x + Math.cos(a) * r,
      y: base + 2.6 + h2i(i, 73) * 2.1 - r * 0.18,
      z: OAK.z + Math.sin(a) * r * 0.7,
      ch: '·', band: 2, lift: 0,
    });
  }
  return pts;
}

function lampPts() {
  const lc = lampState;
  const pts = [];
  const base = Math.max(heightRaw(LAMP.x, LAMP.z), 0);
  for (let y = 0; y <= 6.6; y += 0.13) {
    const lean = y > 4.4 ? lc.lean * ((y - 4.4) / 2.2) * 1.1 : 0;
    pts.push({ x: LAMP.x + lean, y: base + y, z: LAMP.z, ch: '│', band: 6, lift: 0 });
  }
  pts.push({ x: LAMP.x + lc.lean * 1.2, y: base + 7.0, z: LAMP.z, ch: '@', band: 6, lift: lc.lum > 0.5 ? 2 : 0 });
  for (let i = 0; i < 9; i++) { // his light, falling as characters
    if (lc.lum < 0.35) break;
    pts.push({
      x: LAMP.x + (h2i(i, 21) - 0.5) * 4.2,
      y: base + 0.6 + h2i(i, 31) * 5.4,
      z: LAMP.z + (h2i(i, 41) - 0.5) * 4.2,
      ch: ':', band: 6, lift: -1,
    });
  }
  return pts;
}

// fireflies — the night's drift decides how many are out, and how restless
function fireflies(t, env) {
  const n = 3 + Math.round(env.ch.drift * 6);
  const spMul = 0.5 + env.ch.drift * 0.9;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const sp = (0.13 + h2i(i, 601) * 0.1) * spMul;
    const cx = -16 + h2i(i, 602) * 32, cz = -16 + h2i(i, 603) * 28;
    const x = cx + Math.sin(t * sp + i * 2.1) * 6 + Math.sin(t * 0.37 + i) * 2;
    const z = cz + Math.cos(t * sp * 0.8 + i * 1.7) * 5;
    if (Math.sin(t * (1.1 + h2i(i, 604)) + i * 3.3) < -0.2) continue;
    const y = Math.max(heightRaw(x, z), 0) + 1.1 + Math.sin(t * 0.9 + i * 2.6) * 0.5;
    pts.push({ x, y, z, ch: '·', band: 6, lift: 1 });
  }
  return pts;
}

// the mouse in his finest little tuxedo, late for the midnight meeting —
// every ~47s he scurries; on the 12th day of the cycle he goes TO the old oak
function mousePts(t) {
  const mu = t % 47;
  if (mu > 7.5) return [];
  const cyc = Math.floor(t / 47);
  const toOak = cyc % 12 === 11; // the midnight meeting itself
  let p = mu / 7.5;
  if (toOak) p = 1 - p;
  const x = OAK.x + 0.5 + p * 21;
  const z = OAK.z + 1 + Math.sin(p * 9.5) * 1.8 + p * 4;
  const y = Math.max(heightRaw(x, z), 0) + 0.18;
  const dir = toOak ? -1 : 1;
  return [
    { x, y, z, ch: '·', band: 4, lift: -1 },
    { x: x - dir * 0.32, y, z: z - 0.1, ch: ',', band: 4, lift: -1 },
    // his pocket-watch, running late, catching the light
    { x: x + dir * 0.2, y: y + 0.12, z, ch: '·', band: 6, lift: 0 },
  ];
}

// the ride's carriage, drawn at head-position hx
function carriagePts(hx, doorOpen) {
  const pts = [];
  for (let i = 0; i < 9; i++) {
    const x = hx - i * 1.15;
    const z = roadZ(x);
    const y = Math.max(heightRaw(x, z), 0) + 0.55;
    const isDoor = doorOpen && i === 2;
    pts.push({
      x, y, z,
      ch: isDoor ? ':' : i === 0 ? '▓' : i < 3 ? '▒' : i < 6 ? '░' : ':',
      band: isDoor ? 6 : 4, lift: i === 0 ? 1 : isDoor ? 2 : i < 4 ? 0 : -1,
    });
    if (i === 1) pts.push({ x, y: y + 0.3, z, ch: '·', band: 6, lift: 1 }); // a lit window
  }
  return pts;
}

const ease = (u) => u * u * (3 - 2 * u);

// in the night: the ride comes when it is due, decelerates, stops, waits —
// board it or watch it leave. in the lab: the old pass-by, never stopping.
function ridePts(t, cam) {
  if (!inDream()) {
    const ru = t % 68;
    if (ru > 3.4) return [];
    return carriagePts(-44 + (ru / 3.4) * 88, false);
  }
  if (!ride) {
    if (rideDue) ride = { t0: t, phase: 'coming' };
    return [];
  }
  const st = t - ride.t0;
  const STOP_X = 4;
  if (ride.phase === 'coming') {
    narrate('my ride arrives at 00:68.');
    const u = Math.min(1, st / 5);
    const hx = 46 - (46 - STOP_X) * ease(u);
    if (u >= 1) { ride.phase = 'stopped'; ride.t0 = t; }
    return carriagePts(hx, false);
  }
  if (ride.phase === 'stopped') {
    narrate('only a couple minutes to late, i should get going.');
    // the one time it stops. nine seconds, door aglow.
    if (Math.hypot(cam.x - STOP_X, cam.z - roadZ(STOP_X)) < 2.8) {
      ride.phase = 'boarded';
      ride.t0 = t;
      return carriagePts(STOP_X, true);
    }
    if (st > 9) { ride.phase = 'leaving'; ride.t0 = t; rideDue = false; sawSag = false; }
    return carriagePts(STOP_X, true);
  }
  if (ride.phase === 'boarded') {
    // stepped in; the door holds its glow while the line lands
    if (t - ride.t0 > 4.5) signal('boarded');
    return carriagePts(STOP_X, true);
  }
  // leaving — a couple minutes too late after all
  const u = Math.min(1, (t - ride.t0) / 4);
  const hx = STOP_X - 50 * u * u;
  if (u >= 1) ride = null;
  return carriagePts(hx, false);
}

export default {
  id: 'streetlamp',
  title: 'the streetlamp in the strawberry field',
  register: 'rose',
  notation: { extra: ['M'] }, // the line's capital — not in the default writing
  world: {
    waterLevel: 0,
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g, t, env) {
      // strawberries — dense rose flecks in the low meadow
      const fl = h2i(Math.floor(wx * 2.2) + 7, Math.floor(wz * 2.2) + 3);
      if (g.band <= 2 && fl > 0.975) { g.band = 5; g.lum += 0.13; }
      // the road where the ride arrives, worn dark, narrated underfoot
      if (Math.abs(wz - roadZ(wx)) < 1.5) {
        g.lum *= 0.68;
        narrator.apply(wx, wz, g);
      }
      // his warm glow recolours the land's letters, fading as he tires
      const ld = Math.hypot(wx - LAMP.x, wz - LAMP.z);
      if (ld < 6) {
        const warm = (1 - ld / 6) * Math.max(0, lampState.lum);
        if (warm > 0.1) { g.band = 6; g.lum += warm * 0.3; }
      }
    },
    water(wx, wz, w, t) { wake.apply(wx, wz, w, t); },
  },
  spawn: { x: 0, z: 14, yaw: 0 },
  sky: { moon: { phase: 0.72, halo: true } }, // a waiting-hour moon
  envHook(env, t) { lampState = lampCycle(t, env); },
  beings(t, cam, env) {
    if (!STATIC) STATIC = oakPts();
    wake.note(cam, t, onWater());
    // re-entry (a later fold): the wait begins again
    if (t - lastBT > 2.5) { sawSag = false; rideDue = false; ride = null; }
    lastBT = t;
    // keeping him company: one full tired cycle, witnessed from his glow
    const near = Math.hypot(cam.x - LAMP.x, cam.z - LAMP.z) < 11;
    if (near && lampState.lean > 0.32 && !sawSag) {
      sawSag = true;
      narrate('i could sense him getting tired when he would start to blink slowly and lean to the side slightly.');
    }
    if (near && sawSag && lampState.lean < 0.05 && !rideDue && !ride) rideDue = true;
    return [...STATIC, ...lampPts(), ...fireflies(t, env), ...mousePts(t), ...ridePts(t, cam)];
  },
  line: { text: 'My ride arrives at 00:68.', x: 0, z: -17, y: 3.4, radius: 13 },
};
