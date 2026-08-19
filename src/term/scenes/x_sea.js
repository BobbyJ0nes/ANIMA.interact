// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// x_sea — water study (divergence fork, 19.08). five bays, one deep.
// the sea is the text before it condenses; every shore is the
// condensation gradient; depth is dissolution. companion doc:
// explorations/water.md
// "The ripples on the water shines, and the light dances on the top."

import { h2i, vnoise } from '../engine.js';

const RIDGES = [-60, -30, 14, 48];
const ISLETS = [[-84, 6], [-43, -14], [0, 16], [33, -12], [68, 8]];
const STREAMS = [-12, 4]; // two streams, flowing along z
const BRIDGE = { x0: -17, x1: 9, z: -2, y: 1.35 };
const MOON_AZ = -0.55;

function heightRaw(x, z, env) {
  let h = -0.7 + vnoise(x * 0.04, z * 0.04) * 0.25; // the sea floor
  for (const bx of RIDGES) {
    const d = x - bx;
    let r = 1.9 * Math.exp(-(d * d) / (3.2 * 3.2));
    r *= 0.35 + 0.65 * Math.min(1, Math.abs(z + 4) / 9); // the ford notch
    h += r;
  }
  for (const c of ISLETS) {
    const dx = x - c[0], dz = z - c[1];
    h += 1.7 * Math.exp(-(dx * dx + dz * dz) / (4.5 * 4.5));
  }
  // the deep — south basin and outer ring; walkable descent
  const s = Math.max((z - 30) / 22, (Math.abs(x) - 100) / 25, (-z - 42) / 22);
  if (s > 0) { const m = Math.min(1, s); h -= m * m * 5; }
  // the tide — the body's depth moves the waterline
  h -= (env ? env.ch.depth : 0.5) * 0.5;
  return h;
}

const seedAt = (a, b, tt) =>
  Math.floor(h2i(Math.floor(a * 0.9 + tt), Math.floor(b * 0.9)) * 997);
const wrapA = (a) => ((a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;

// the walker's wake — beings() records the trail, ground() churns near it
const camRef = { x: 0, z: 0 };
let trail = [], lastPush = -9;

function ground(wx, wz, hS, g, t, env) {
  if (hS >= 0) {
    // shore grammar — letters becoming ramp as the land rises
    if (hS < 0.35) {
      const p = 1 - hS / 0.35;
      if (h2i(Math.floor(wx * 2.1) + 5, Math.floor(wz * 2.1) + 9) < p * 0.8) {
        g.letter = true;
        g.letterSeed = seedAt(wx, wz, t * 0.3);
      }
      g.band = 2;
      g.lum = Math.min(g.lum, 0.42);
    }
    return;
  }
  const depth = -hS;
  g.letter = true;

  if (wx < -60) {
    // whisper bay — the dream hasn't committed
    g.band = 0;
    g.lum = 0.22 + 0.05 * Math.sin(t * 0.4 + wx * 0.2);
    g.letterSeed = seedAt(wx, wz, t * 0.12);
    if (h2i(Math.floor(wx * 1.4) + 3, Math.floor(wz * 1.4) + 8) > 0.5) {
      g.letter = false;
      g.lum *= 0.55;
    }
  } else if (wx < -30) {
    // mirror bay — frozen letters, and the moonglade dancing on them
    g.band = 0;
    const sp = h2i(Math.floor(wx * 1.8), Math.floor(wz * 1.8));
    g.lum = 0.3 + (sp > 0.85 ? 0.06 * Math.sin(t * 3 + sp * 40) : 0);
    g.letterSeed = seedAt(wx, wz, 0); // no time term. still water.
    const dx = wx - camRef.x, dz = wz - camRef.z;
    const d = Math.hypot(dx, dz);
    if (d > 3) {
      const da = wrapA(Math.atan2(dx, -dz) - MOON_AZ);
      if (Math.abs(da) < 0.07) {
        const k = 1 - Math.abs(da) / 0.07;
        g.lum += 0.28 * k * (0.55 + 0.45 * Math.sin(t * 2.1 + d * 0.6)) * (0.8 + 0.4 * env.ch.spark);
        if (k > 0.5) g.band = 4;
      }
    }
  } else if (wx < 14) {
    // the two streams — fast current flowing along z, legible
    let inStream = false;
    for (const sx of STREAMS) {
      if (Math.abs(wx - sx) < 1.6) { inStream = true; break; }
    }
    if (inStream) {
      const cur = 1.8 + env.ch.drift * 1.5;
      g.band = 2;
      g.lum = 0.44 + 0.06 * Math.sin(t * 2 + wz * 0.7);
      g.letterSeed = Math.floor(h2i(Math.floor(wx * 0.9), Math.floor(wz * 0.9 - t * cur)) * 997);
    } else {
      g.band = 0;
      g.lum = 0.3;
      g.letterSeed = seedAt(wx, wz, t * 0.5);
    }
  } else if (wx < 48) {
    // wake shallows — calm until walked; the sea acknowledges the dreamer
    g.band = 0;
    g.lum = 0.3;
    g.letterSeed = seedAt(wx, wz, t * 0.4);
    if (Math.abs(wx - camRef.x) < 16 && Math.abs(wz - camRef.z) < 16) {
      for (const tp of trail) {
        const d = Math.hypot(wx - tp.x, wz - tp.z);
        if (d < 2.6) {
          const k = (1 - (t - tp.t) / 3) * (1 - d / 2.6);
          if (k > 0.03) {
            g.letterSeed = Math.floor(h2i(Math.floor(wx * 2 + t * 7), Math.floor(wz * 2)) * 997);
            g.lum += 0.45 * k;
          }
        }
      }
    }
  } else {
    // rain reach — open night sea, receiving
    g.band = 0;
    g.lum = 0.34 + 0.12 * Math.sin(t * 1.1 + wx * 0.31 + wz * 0.17);
    g.letterSeed = seedAt(wx, wz, t * 0.6);
  }

  // the deep — dissolution. letters decay to · to dark as the floor falls
  if (depth > 1.2) {
    const p = Math.min(1, (depth - 1.2) / 3);
    if (h2i(Math.floor(wx * 1.6) + 17, Math.floor(wz * 1.6) + 23) < p) g.letter = false;
    g.lum *= 1 - 0.72 * p;
    if (p > 0.55) g.band = 8;
  }
}

// ------------------------------------------------------------------ beings

let FIXED = null;

function buildFixed() {
  const pts = [];
  // the bridge over both streams
  for (let x = BRIDGE.x0; x <= BRIDGE.x1; x += 0.27)
    pts.push({ x, y: BRIDGE.y, z: BRIDGE.z, ch: '═', band: 4, lift: 0 });
  for (const px of [BRIDGE.x0, BRIDGE.x1])
    for (let y = -0.5; y < BRIDGE.y; y += 0.24)
      pts.push({ x: px, y, z: BRIDGE.z, ch: '║', band: 4, lift: 0 });
  return pts;
}

// cairns marking each islet — recomputed so they ride the tide
function cairnPts(env) {
  const pts = [];
  for (const c of ISLETS) {
    const gy = heightRaw(c[0], c[1], env);
    pts.push({ x: c[0], y: gy + 0.15, z: c[1], ch: '▓', band: 4, lift: 0 });
    pts.push({ x: c[0], y: gy + 0.4, z: c[1], ch: '▒', band: 4, lift: 0 });
    pts.push({ x: c[0], y: gy + 0.62, z: c[1], ch: '░', band: 4, lift: 0 });
  }
  return pts;
}

// "I say hi to the ghosts as they cross the bridge.
//  Some friendly spirits and some grumpy ones."
function ghostPts(t) {
  const pts = [];
  const span = BRIDGE.x1 - BRIDGE.x0;
  for (let i = 0; i < 3; i++) {
    const speed = [0.8, 1.15, 0.55][i];
    const gx = BRIDGE.x0 + ((t * speed + i * 9.1) % span);
    const q = Math.floor(gx * 2) / 2; // cell-quantized crossing
    for (let y = BRIDGE.y + 0.15; y <= BRIDGE.y + 1.5; y += 0.2)
      pts.push({ x: q, y, z: BRIDGE.z, ch: '▒', band: 7, lift: -1 });
    pts.push({ x: q, y: BRIDGE.y + 1.66, z: BRIDGE.z, ch: '░', band: 7, lift: 0 });
  }
  return pts;
}

// rain of characters, joining the sea — rate follows tension
const WRIT = 'abcdefghijklmnopqrstuvwxyz';
function rainPts(t, env) {
  const pts = [];
  const n = 4 + Math.floor(env.ch.tension * 10);
  for (let i = 0; i < n; i++) {
    const P = 2.2 + h2i(i, 911) * 1.6;
    const u = (t + h2i(i, 912) * 9) / P;
    const ci = Math.floor(u);
    const frac = u - ci;
    const rx = 54 + h2i(ci * 3 + i, 913) * 44;
    const rz = -20 + h2i(ci * 5 + i, 914) * 44;
    if (frac < 0.7) {
      pts.push({
        x: rx, y: 8.5 * (1 - frac / 0.7) + 0.2, z: rz,
        ch: WRIT[Math.floor(h2i(ci, 915 + i) * 26)], band: 9, lift: -1,
      });
    } else if (frac < 0.8) {
      pts.push({ x: rx, y: 0.15, z: rz, ch: '+', band: 4, lift: 1 }); // received
    }
  }
  return pts;
}

export default {
  id: 'x_sea',
  title: 'water study — five bays and the deep',
  register: 'night',
  world: {
    far: 240,
    waterLevel: -9, // never engine-water: the whole sea is scene-voiced shelf
    islandR: null,
    height(x, z, env) { return heightRaw(x, z, env); },
    ground,
  },
  spawn: { x: -84, z: 14, yaw: 0.9 },
  sky: {}, // the moon at az -0.55 — the glade depends on her
  beings(t, cam, env) {
    camRef.x = cam.x; camRef.z = cam.z;
    if (t - lastPush > 0.35) {
      const last = trail[trail.length - 1];
      if (!last || Math.hypot(cam.x - last.x, cam.z - last.z) > 0.5) {
        trail.push({ x: cam.x, z: cam.z, t });
        lastPush = t;
      }
    }
    trail = trail.filter((p) => t - p.t < 3.2);
    if (!FIXED) FIXED = buildFixed();
    return [...FIXED, ...cairnPts(env), ...ghostPts(t), ...rainPts(t, env)];
  },
  line: {
    // anchored at the mirror-bay cairn (engine's legacy offset removed 19.08)
    text: 'The ripples on the water shines, and the light dances on the top.',
    x: -43, z: -14, y: 3.4, radius: 15,
  },
};
