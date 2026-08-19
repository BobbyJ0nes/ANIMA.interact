// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// x_ground — a ground grammar study. six zones, each a voice of land.
// "The moss on the stones to my right whisper of the silent night."
// relief (flora that sways with the engine's own wind), memory (worn
// trails, capped), strata (the alphabet as sediment), and the whisper.

import { h2i, vnoise, dream } from '../engine.js';

const MY_WRITING =
  'abcdefghijklmnopqrstuvwxyz' + 'WGFTSAI' + '0682' + ".,:;·-—'\"()";
const LINE_TEXT = 'The moss on the stones to my right whisper of the silent night.';
// the murmur draws single letters from the sentence's own material
const LINE_SEEDS = [...new Set(LINE_TEXT.replace(/ /g, '').split(''))]
  .map((c) => MY_WRITING.indexOf(c))
  .filter((i) => i >= 0);

const MOSS = { x: 14, z: -6 };
const HILL = { x: -2, z: -44 };
const LAGOON = { x: 26, z: 26 };
const MEADOW = { x: -24, z: 2 };
const FLOWERS = { x: -8, z: 30 };

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// the stones the moss whispers from
const STONES = [];
for (let i = 0; i < 7; i++) {
  STONES.push({
    x: MOSS.x + (h2i(i, 901) - 0.5) * 14,
    z: MOSS.z + (h2i(i, 902) - 0.5) * 12,
    r: 1.5 + h2i(i, 903) * 2.2,
    h: 0.7 + h2i(i, 904) * 1.2,
  });
}

function hillVal(x, z) {
  const dx = x - HILL.x, dz = z - HILL.z;
  return 10 * Math.exp(-(dx * dx + dz * dz) / (26 * 26));
}

function heightRaw(x, z) {
  let h = vnoise(x * 0.022, z * 0.022) * 5 + vnoise(x * 0.06, z * 0.06) * 1.5 - 1.6;
  const hv = hillVal(x, z);
  h += hv < 1.15 ? hv : Math.floor(hv / 1.15) * 1.15; // terraces — strata in plan
  const dlx = x - LAGOON.x, dlz = z - LAGOON.z;
  h -= 5 * Math.exp(-(dlx * dlx + dlz * dlz) / (13 * 13)); // the lagoon
  for (const s of STONES) {
    const dx = x - s.x, dz = z - s.z;
    const d2 = dx * dx + dz * dz;
    if (d2 < s.r * s.r * 5) h += s.h * Math.exp(-d2 / (s.r * s.r));
  }
  if (h < 0.35 && (dlx * dlx + dlz * dlz) > 20 * 20) h = 0.35 + (0.35 - h) * 0.2;
  return h;
}

// the engine's own gust field — flora and light answer one formula
function gust(x, z, t) {
  return Math.sin(t * 0.8 + x * 0.13 + z * 0.09) *
         Math.sin(t * 0.33 + x * 0.045 - z * 0.065);
}

// ------------------------------------------------------- memory: worn trail

const TRAIL_MAX = 512;
const trail = new Set();
const ring = [];
let lastSX = 1e9, lastSZ = 1e9;
function tKey(x, z) {
  return (Math.round(x * 1.33) + 2048) * 8192 + (Math.round(z * 1.33) + 2048);
}
function stamp(x, z) {
  if (Math.hypot(x - lastSX, z - lastSZ) < 0.7) return;
  lastSX = x; lastSZ = z;
  const k = tKey(x, z);
  if (trail.has(k)) return;
  trail.add(k);
  ring.push(k);
  if (ring.length > TRAIL_MAX) trail.delete(ring.shift());
}

// the pre-worn path: spawn → moss → terraces, deepening per visit
const PATH = [[0, 14], [MOSS.x - 3, MOSS.z + 2], [HILL.x, HILL.z + 16]];
function distSeg(px, pz, ax, az, bx, bz) {
  const vx = bx - ax, vz = bz - az;
  const u = clamp01(((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz));
  return Math.hypot(px - (ax + vx * u), pz - (az + vz * u));
}
function pathDist(x, z) {
  return Math.min(
    distSeg(x, z, PATH[0][0], PATH[0][1], PATH[1][0], PATH[1][1]),
    distSeg(x, z, PATH[1][0], PATH[1][1], PATH[2][0], PATH[2][1])
  );
}

// ------------------------------------------------------------ relief: flora

let FLORA = null;
let camX = 0, camZ = 14;

function buildFlora() {
  const sway = []; // {p, bx, hf, tip}
  const groups = [];
  // tufts — the meadow
  for (let i = 0; i < 120; i++) {
    const x = MEADOW.x + (h2i(i, 911) - 0.5) * 34;
    const z = MEADOW.z + (h2i(i, 912) - 0.5) * 30;
    const y = heightRaw(x, z);
    if (y < 0.3) continue;
    const blades = 2 + Math.floor(h2i(i, 913) * 2);
    for (let b = 0; b < blades; b++) {
      const bx = x + (h2i(i * 7 + b, 914) - 0.5) * 0.34;
      const lo = { x: bx, y: y + 0.16, z, ch: ',', band: 1, lift: 0 };
      const hi = { x: bx, y: y + 0.42, z, ch: "'", band: 2, lift: 0 };
      sway.push({ p: lo, bx, hf: 0.4 }, { p: hi, bx, hf: 1, tip: i * 7 + b });
      groups.push(lo, hi);
    }
  }
  // flowers — bloom breathes with drift
  for (let i = 0; i < 70; i++) {
    const x = FLOWERS.x + (h2i(i, 921) - 0.5) * 26;
    const z = FLOWERS.z + (h2i(i, 922) - 0.5) * 22;
    const y = heightRaw(x, z);
    if (y < 0.3) continue;
    const stem = { x, y: y + 0.24, z, ch: '|', band: 1, lift: 0 };
    const head = { x, y: y + 0.5, z, ch: '*', band: 5, lift: 0, bloomI: i };
    sway.push({ p: stem, bx: x, hf: 0.5 }, { p: head, bx: x, hf: 1 });
    groups.push(stem, head);
  }
  // reeds — ringing the lagoon where the land meets the level
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    let placed = false;
    for (let r = 6; r < 16 && !placed; r += 0.8) {
      const x = LAGOON.x + Math.cos(a) * r;
      const z = LAGOON.z + Math.sin(a) * r;
      const y = heightRaw(x, z);
      if (y > 0.05 && y < 0.7) {
        for (let k = 0; k < 3; k++) {
          const p = { x, y: y + 0.2 + k * 0.28, z, ch: '|', band: 2, lift: 0 };
          sway.push({ p, bx: x, hf: 0.25 + k * 0.25 }); // stiffer than grass
          groups.push(p);
        }
        const head = { x, y: y + 1.06, z, ch: '·', band: 4, lift: 0 };
        sway.push({ p: head, bx: x, hf: 0.85 });
        groups.push(head);
        placed = true;
      }
    }
  }
  return { sway, groups };
}

// ------------------------------------------------------------------- scene

export default {
  id: 'x_ground',
  title: 'ground study — six voices of land',
  register: 'night',
  notation: { writing: MY_WRITING, extra: ['|'] },

  world: {
    waterLevel: 0,
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g, t, env) {
      // memory — session steps, and the named path deepening per visit
      if (trail.has(tKey(wx, wz))) g.lum *= 0.62;
      if (pathDist(wx, wz) < 1.3) {
        const wear = clamp01((dream.visited.x_ground || 1) * 0.3);
        g.lum *= 1 - 0.35 * wear;
        if (wear > 0.85) g.band = 5;
      }
      // the moss stones — pigment, and the whisper
      const dmx = wx - MOSS.x, dmz = wz - MOSS.z;
      if (dmx * dmx + dmz * dmz < 15 * 15) {
        for (const s of STONES) {
          const dx = wx - s.x, dz = wz - s.z;
          if (dx * dx + dz * dz < s.r * s.r * 2.6) {
            g.band = 1;
            g.lum = g.lum * 0.85 + 0.08;
            const nearCam = Math.hypot(camX - MOSS.x, camZ - MOSS.z) < 11;
            if (nearCam) {
              const qx = Math.floor(wx * 1.5), qz = Math.floor(wz * 1.5);
              if (h2i(qx + Math.floor(t / 1.6) * 7, qz) < 0.03) {
                g.letter = true;
                g.letterSeed = LINE_SEEDS[Math.floor(h2i(qx, qz * 7) * LINE_SEEDS.length)];
                g.lum += 0.1;
              }
            }
            break;
          }
        }
      }
      // the terraces — the alphabet as sediment, older letters lower
      const hv = hillVal(wx, wz);
      if (hv > 1.15) {
        const layer = Math.floor(hv / 1.15);
        g.band = layer % 2 ? 3 : 2;
        if (h2i(Math.floor(wx * 1.4) + layer * 13, Math.floor(wz * 1.4)) < 0.5) {
          g.letter = true;
          g.letterSeed = (layer * 5 + Math.floor(h2i(Math.floor(wx * 2), Math.floor(wz * 2)) * 5)) % 26;
        }
      }
      // the flower field's ground blush — bloom with drift
      const dfx = wx - FLOWERS.x, dfz = wz - FLOWERS.z;
      if (dfx * dfx + dfz * dfz < 15 * 15) {
        const fl = h2i(Math.floor(wx * 2.1) + 5, Math.floor(wz * 2.1) + 9);
        if (fl < 0.008 + env.ch.drift * 0.02) { g.band = 5; g.lum += 0.1 + env.ch.drift * 0.1; }
      }
    },
  },

  spawn: { x: 0, z: 14, yaw: 0 },
  sky: {},

  beings(t, cam, env) {
    if (!FLORA) FLORA = buildFlora();
    camX = cam.x; camZ = cam.z;
    stamp(cam.x, cam.z);
    const amp = 0.12 + env.ch.tension * 0.12;
    const dewy = env.ch.spark > 0.5;
    const slot = Math.floor(t * 2);
    for (const s of FLORA.sway) {
      s.p.x = s.bx + gust(s.bx, s.p.z, t) * amp * s.hf;
      if (s.tip !== undefined) s.p.lift = dewy && h2i(s.tip, slot) > 0.93 ? 2 : 0;
      else if (s.p.bloomI !== undefined) s.p.lift = env.ch.drift > 0.6 ? 1 : 0;
    }
    return FLORA.groups;
  },

  line: { text: LINE_TEXT, x: MOSS.x, z: MOSS.z, y: 2.6, radius: 8 },
};
