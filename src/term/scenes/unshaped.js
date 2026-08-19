// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// unshaped — the unshaped ground. joined the circuit 19.08 by verdict
// (formerly x_latent). the same 74 minutes as `crossing`,
// with every name withheld: three UNNAMED latent axes (PCA over the env
// series — public/eeg/session01_latent.json) become land through a
// hash-fixed mixture that no one chose. no lanes, no labels, no landmarks,
// no cursor. the trajectory's SPEED stirs the ground locally — dynamics
// shown, content never claimed. veil register: no overview, no map —
// you can only be on it. fallback without the data: admitted noise.

import { h2i, vnoise } from '../engine.js';

const AMP = 7;
let LAT = null; // { n, a: [Float32Array x3], vel: Float32Array }
let L = 40;     // world length in units (10 seconds per unit)

function sample(arr, u) {
  const f = Math.max(0, Math.min(LAT.n - 1.001, u));
  const i = Math.floor(f);
  return arr[i] + (arr[i + 1] - arr[i]) * (f - i);
}

// z-mixture weights — fixed by hash, named by no one
function wk(k, z) {
  const v = vnoise(z * 0.045 + k * 137.3, k * 91.7 + 11.1);
  return 0.15 + v * v;
}

function heightRaw(x, z) {
  let h;
  if (!LAT) {
    h = 0.5 + vnoise(x * 0.05, z * 0.05) * 4 + vnoise(x * 0.13, z * 0.13) * 1.2; // admitted
  } else {
    const u = x * 10;
    let sw = 0, s = 0;
    for (let k = 0; k < 3; k++) {
      const w = wk(k, z);
      sw += w;
      s += w * sample(LAT.a[k], u);
    }
    h = 0.5 + (s / sw) * AMP + vnoise(x * 0.21, z * 0.21) * 0.5;
  }
  // the ground ends where the session ends — framing, not meaning
  let d = 0;
  if (x < 0) d = -x;
  else if (x > L) d = x - L;
  const dz = Math.abs(z) - 26;
  if (dz > 0) d = Math.max(d, dz);
  if (d > 0) {
    const m = Math.min(1, d / 24);
    h -= m * m * 14;
  }
  return h;
}

export default {
  id: 'unshaped',
  title: 'unshaped ground',
  register: 'veil',
  world: {
    far: 260,
    waterLevel: 0,
    islandR: null, // edges are hand-rolled above
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g, t) {
      if (!LAT) return;
      // the latent trajectory's speed decides how much the ground stirs
      // here — the subconscious as dynamics, never as imagery
      const v = sample(LAT.vel, wx * 10);
      g.lum += Math.sin(t * 1.3 + wz * 0.41 + wx * 0.23) * 0.11 * v;
    },
  },
  spawn: { x: -6, z: 0, yaw: Math.PI / 2 }, // facing along the session
  sky: { moon: { phase: 0.5, halo: true } }, // half-known, ringed in fog
  async init() {
    try {
      const r = await fetch('eeg/session01_latent.json');
      if (r.ok) {
        const d = await r.json();
        LAT = {
          n: d.n,
          a: d.axes.map((s) => Float32Array.from(s)),
          vel: Float32Array.from(d.vel),
        };
        L = d.n / 10;
      }
    } catch {}
  },
};
