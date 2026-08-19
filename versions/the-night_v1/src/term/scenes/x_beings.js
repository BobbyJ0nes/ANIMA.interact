// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// x_beings — choreography study. how creatures made of type move and speak.
// one figure carries the three core behaviors: breath (idle), scurry (gait),
// and speech as CONDENSATION — the field_01 move rebuilt in the terminal:
// the line's letters fly in from the night's matter, settle, and scatter
// back on silence. nothing appears from nowhere.
// a prowling cat and a letter-flock hold the contrast cases.
// the line: "so long my friend" — the mouse's own farewell, verbatim.

import { h2i, vnoise } from '../engine.js';

const LINE = 'so long my friend';
const A = { x: -11, z: -4 }, B = { x: 11, z: -4 }; // the mouse's route
const SPEAK_R = 7.5;

function heightRaw(x, z) {
  let h = vnoise(x * 0.03, z * 0.03) * 3.2 + vnoise(x * 0.08, z * 0.08) * 1.1 - 1.2;
  if (h < 0.35) h = 0.35 + (0.35 - h) * 0.2;
  return h;
}
function routeZ(x) { return -4 + Math.sin(((x + 11) / 22) * 7.3) * 0.9; }

// ------------------------------------------------------- the mouse (scurry)
// gait = burst-of-three hops, then rest. the tail latches one hop late.

const HOP = { cycle: 0.94, times: [0, 0.18, 0.36], dur: 0.13, vel: 0.045 / 0.13 };
const mouse = { u: 0.25, dir: 1, tailU: 0.22, wasHop: false, last: -1 };

function mouseUpdate(t, speaking) {
  const dt = mouse.last < 0 ? 0.016 : Math.min(0.1, t - mouse.last);
  mouse.last = t;
  const c = t % HOP.cycle;
  let inHop = false, hf = 0;
  for (const h0 of HOP.times)
    if (c >= h0 && c < h0 + HOP.dur) { inHop = true; hf = (c - h0) / HOP.dur; }
  if (!speaking && inHop) mouse.u += mouse.dir * HOP.vel * dt;
  if (mouse.wasHop && !inHop) mouse.tailU = mouse.u - mouse.dir * 0.014; // follow-through
  mouse.wasHop = inHop;
  if (mouse.u > 1) { mouse.u = 1; mouse.dir = -1; }
  if (mouse.u < 0) { mouse.u = 0; mouse.dir = 1; }
  return { inHop: !speaking && inHop, hf };
}
function routePos(u) {
  const x = A.x + (B.x - A.x) * u;
  return { x, z: routeZ(x) };
}
function mousePts(t, speaking, gait) {
  const p = routePos(mouse.u);
  const tl = routePos(mouse.tailU);
  const y = heightRaw(p.x, p.z) + 0.18 + (gait.inHop ? 0.24 * Math.sin(Math.PI * gait.hf) : 0);
  // breath-swap: the chest cell swells · -> : while he pauses
  const chest = speaking && (0.5 + 0.5 * Math.sin(t * 1.4)) > 0.62 ? ':' : '·';
  // whisker twitch, rare, only at rest
  const tw = speaking && h2i(Math.floor(t * 2), 5) > 0.86 ? 0.1 : 0;
  return [
    { x: p.x, y, z: p.z, ch: chest, band: 4, lift: 0 },
    { x: p.x + mouse.dir * (0.22 + tw), y: y + 0.02, z: p.z, ch: '·', band: 4, lift: -1 },
    { x: tl.x - mouse.dir * 0.1, y: heightRaw(tl.x, tl.z) + 0.16, z: tl.z, ch: ',', band: 4, lift: -1 },
    { x: p.x - mouse.dir * 0.16, y: y + 0.12, z: p.z, ch: '·', band: 6, lift: 0 }, // the late watch
  ];
}

// ------------------------------------------------------- the cat (prowl)
// gait = slow continuous glide with freezes. while frozen, only the eye lives.

const cat = { u: 0.4, dir: 1, last: -1 };
function catPts(t) {
  const dt = cat.last < 0 ? 0.016 : Math.min(0.1, t - cat.last);
  cat.last = t;
  const seg = Math.floor(t / 9);
  const frozen = h2i(seg, 77) < 0.45 && (t % 9) > 4.2 && (t % 9) < 6.9;
  if (!frozen) cat.u += cat.dir * 0.022 * dt; // a prowl crosses the stage in ~45s
  if (cat.u > 1) { cat.u = 1; cat.dir = -1; }
  if (cat.u < 0) { cat.u = 0; cat.dir = 1; }
  const x = -9 + 18 * cat.u, z = -13 + Math.sin(cat.u * 5.1) * 0.7;
  const y = heightRaw(x, z);
  return [
    { x, y: y + 0.14, z, ch: '█', band: 8, lift: frozen ? -1 : 0 },
    { x: x + cat.dir * 0.14, y: y + 0.14, z, ch: '█', band: 8, lift: frozen ? -1 : 0 },
    { x: x + cat.dir * 0.27, y: y + 0.36, z, ch: '▓', band: 8, lift: frozen ? -1 : 0 },
    { x: x + cat.dir * 0.3, y: y + 0.38, z: z + 0.18, ch: '·', band: 7, lift: 1 }, // the live point
  ];
}

// ---------------------------------------------- the flock (murmuration)
// letters wheeling as one body. the word "gone" rides inside it always —
// only formation ever reveals it, briefly, at distance. doubt is the read.

const BIRDS = [];
for (let i = 0; i < 24; i++) {
  BIRDS.push({
    ph: h2i(i, 301) * 6.28,
    r: 2 + h2i(i, 302) * 3.5,
    vph: h2i(i, 303) * 6.28,
    ch: i < 4 ? 'gone'[i] : 'abcdefghijklmnopqrstuvwxyz'[Math.floor(h2i(i, 304) * 26)],
    slot: i < 4 ? i : -1,
  });
}
function flockPts(t) {
  const ax = Math.sin(t * 0.11) * 14;
  const az = -24 + Math.cos(t * 0.07) * 6;
  const ay = 7.5 + Math.sin(t * 0.19) * 1.5;
  const wp = t % 43;
  const pass = h2i(Math.floor(t / 43), 305) < 0.75;
  const e = pass ? Math.max(0, Math.min(1, Math.min(wp - 20, 21.4 - wp) / 0.35)) : 0;
  const pts = [];
  for (const b of BIRDS) {
    const wob = 1 + 0.3 * Math.sin(t * 0.23 + b.vph);
    let x = ax + Math.cos(t * 0.5 + b.ph) * b.r * wob;
    let y = ay + Math.sin(t * 0.4 + b.vph) * 1.4;
    let z = az + Math.sin(t * 0.5 + b.ph) * b.r * 0.6;
    if (e > 0) {
      if (b.slot >= 0) { // the four carriers glide through their word
        x = x + (ax + (b.slot - 1.5) * 0.55 - x) * e;
        y = y + (ay - y) * e;
        z = z + (az - z) * e;
      } else { // the rest thin outward
        x += (x - ax) * 0.5 * e; z += (z - az) * 0.5 * e;
      }
    }
    pts.push({ x, y, z, ch: b.ch, band: 9, lift: -1 });
  }
  return pts;
}

// ------------------------------------- speech as condensation (the move)
// each letter has a home in the night above the meadow. speaking draws it
// along an arc into its slot; silence releases it back the same way.

const SP = [];
{
  let k = 0;
  for (let i = 0; i < LINE.length; i++) {
    const ch = LINE[i];
    if (ch === ' ') continue;
    const ang = h2i(k, 403) * 6.28;
    const rad = 3.5 + h2i(k, 404) * 4;
    SP.push({
      ch, i, r: 0,
      delay: h2i(k * 7, 401) * 0.8,
      rate: 0.7 + h2i(k, 402) * 0.4,
      hx: Math.cos(ang) * rad,
      hy: 2.2 + h2i(k, 405) * 4,
      hz: Math.sin(ang) * rad * 0.6 - 1,
      jy: (h2i(k, 406) - 0.5) * 0.06,
    });
    k++;
  }
}
let speakT = -1, spLast = -1, lastSpeaking = false;

function speechPts(t, mx, my, mz) {
  const dt = spLast < 0 ? 0.016 : Math.min(0.1, t - spLast);
  spLast = t;
  const pts = [];
  for (const l of SP) {
    const engaged = lastSpeaking && speakT >= 0 && t - speakT > l.delay;
    l.r = Math.max(0, Math.min(1, l.r + (engaged ? dt / 1.25 : -dt / 0.8) * l.rate));
    if (l.r < 0.02) continue;
    const e = l.r * l.r * (3 - 2 * l.r);
    const sx = mx + (l.i - LINE.length / 2) * 0.14;
    const sy = my + 1.55 + l.jy;
    const sz = mz - 0.3;
    pts.push({
      x: mx + l.hx + (sx - mx - l.hx) * e,
      y: my + l.hy + (sy - my - l.hy) * e + 0.9 * Math.sin(Math.PI * e) * (1 - e * 0.4),
      z: mz + l.hz + (sz - mz - l.hz) * e,
      ch: l.ch,
      band: e > 0.72 ? 7 : 9,
      lift: e > 0.72 ? 1 : -1,
    });
  }
  return pts;
}

// ------------------------------------------------------------------- scene

export default {
  id: 'x_beings',
  title: 'choreography study',
  register: 'night',
  notation: { extra: ['·', ',', ':', '█', '▓'] },
  world: {
    far: 260,
    waterLevel: 0,
    islandR: 60,
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g) {
      // his worn trail along the route
      if (Math.abs(wz - routeZ(wx)) < 0.45 && Math.abs(wx) < 11.5) g.lum *= 0.8;
    },
  },
  spawn: { x: 0, z: 8, yaw: 0 },
  sky: {},
  beings(t, cam) {
    const p = routePos(mouse.u);
    const d = Math.hypot(cam.x - p.x, cam.z - p.z);
    const speaking = d < SPEAK_R;
    if (speaking && !lastSpeaking) speakT = t;
    if (!speaking) speakT = -1;
    lastSpeaking = speaking;
    const gait = mouseUpdate(t, speaking);
    const mp = routePos(mouse.u);
    const my = heightRaw(mp.x, mp.z) + 0.2;
    return [
      ...mousePts(t, speaking, gait),
      ...catPts(t),
      ...flockPts(t),
      ...speechPts(t, mp.x, my, mp.z),
    ];
  },
};

if (typeof window !== 'undefined') {
  window.xbeings = {
    state: () => ({ u: mouse.u, speaking: lastSpeaking, r: SP.map((l) => +l.r.toFixed(2)) }),
  };
}
