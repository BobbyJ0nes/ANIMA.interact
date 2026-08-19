// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-crossing — the writing session itself, walkable. RECORDED.
// the 06.06 session (muse athena s, 74.5 min) becomes the land: x is time
// (ten seconds to the pace), and five channel-series run as five long
// dunes — depth · drift · focus · tension · spark, slow to fast.
// TWO WITNESSES stand in the valley (verdict 19.08: show both):
// the pipeline's veil of light at ~min 52, read from the data, never
// hardcoded — and the biosignal poster's madder marks at ~min 28, which
// ARE hardcoded, because that is what a poster is: a recorded assertion.
// each wears its minute in small digits. the disagreement is the honesty.
// when the replay runs (env: recorded) a cursor walks the timeline.
// in fallback (no recording) the land is admitted noise: no veil, no
// cursor, no seams, no witnesses — absence is the honesty.

import { h2i, vnoise } from '../engine.js';

const LANE_Z = [-20, -10, 0, 10, 20]; // depth drift focus tension spark
const LANE_KEYS = ['depth', 'drift', 'focus', 'tension', 'spark'];
const LANE_R = 7;
const AMP = 7;
const LINE = 'I can feel myself drifting off now.';

let lanes = null; // five Float32Array, one value per 10 s of the session
let L = 435;      // valley length in world units
let crossX = -1;  // events[0] / 10, -1 = unknown
let recOk = false;
let gatePts = null;
let posterPts = null;

// the poster's witness: "the crossing" ~min 28 absolute; the timeline here
// is trimmed by 120 s, so absolute sec 1680 stands at x = 156
const POSTER_X = 156;

function digitsAt(pts, x, txt, band) {
  for (const zSide of [-23.5, 23.5]) {
    for (let i = 0; i < txt.length; i++) {
      pts.push({ x, y: 3.4, z: zSide + (i - (txt.length - 1) / 2) * 0.5, ch: txt[i], band, lift: 2 });
    }
  }
}

function buildPoster() {
  const pts = [];
  for (let z = -22; z <= 22.01; z += 1.5) {
    pts.push({ x: POSTER_X, y: 0.55, z, ch: '+', band: 5, lift: 1 });
    if (Math.round(z / 1.5) % 3 === 0)
      for (let y = 1.0; y <= 2.6; y += 0.45)
        pts.push({ x: POSTER_X, y, z, ch: '·', band: 5, lift: 0 });
  }
  digitsAt(pts, POSTER_X, '28', 5);
  return pts;
}

function laneVal(k, u) {
  const a = lanes[k];
  const i = Math.max(0, Math.min(L - 1, Math.floor(u)));
  const j = Math.min(L - 1, i + 1);
  const f = Math.max(0, u - i);
  const s = f * f * (3 - 2 * f);
  return a[i] + (a[j] - a[i]) * s;
}

function buildGate() {
  const pts = [];
  for (let z = -22; z <= 22.01; z += 1.5) {
    const hh = 3.4 + h2i(Math.round(z * 10), 77) * 3.2;
    for (let y = 0.4; y <= hh; y += 0.2) {
      const r = h2i(Math.round(z * 10), Math.round(y * 20));
      const ch = r > 0.85 ? '│' : r > 0.5 ? ':' : '·';
      pts.push({ x: crossX, y, z, ch, band: y < 1.2 ? 6 : 7, lift: y > 1 ? 2 : 1 });
    }
    pts.push({ x: crossX, y: hh + 0.3, z, ch: '+', band: 7, lift: 2 });
  }
  return pts;
}

export default {
  id: 'crossing',
  title: 'the crossing — the session as terrain',
  register: 'night',

  notation: {
    // the land speaks in data: digits mostly, band-letters rare
    writing: '0123456789012345678901234567890123456789' + 'dtabg',
    extra: [...new Set(('║+' + LINE.replace(/\s/g, '')).split(''))],
  },

  world: {
    far: 320,
    waterLevel: 0,
    islandR: null, // hand-rolled edges: the timeline is the island
    height(x, z) {
      let h = 0.45;
      if (lanes) {
        const u = Math.max(0, Math.min(L - 1, x));
        let v = 0;
        for (let k = 0; k < 5; k++) {
          const dz = Math.abs(z - LANE_Z[k]);
          if (dz >= LANE_R) continue;
          const q = 1 - (dz / LANE_R) * (dz / LANE_R);
          v += laneVal(k, u) * q * q;
        }
        h += v * AMP;
      } else {
        // fallback: admitted noise, five plausible dunes, no claims
        for (let k = 0; k < 5; k++) {
          const dz = Math.abs(z - LANE_Z[k]);
          if (dz >= LANE_R) continue;
          const q = 1 - (dz / LANE_R) * (dz / LANE_R);
          h += (0.25 + 0.45 * vnoise(x * 0.045 + k * 13.7, k * 5.1)) * q * q * AMP;
        }
      }
      h += 0.3 * vnoise(x * 0.4, z * 0.4);
      if (x < 3) { const e = (3 - x) / 7; h -= e * e * 9; }
      if (x > L - 3) { const e = (x - (L - 3)) / 7; h -= e * e * 9; }
      const az = Math.abs(z);
      if (az > 24) { const e = (az - 24) / 13; h -= e * e * 10; }
      return h;
    },
    ground(wx, wz, hS, g) {
      // a pale seam where the data says the signal turned
      if (recOk && Math.abs(wx - crossX) < 1.0) { g.band = 7; g.lum += 0.15; }
      // a madder seam where the poster says it did
      if (recOk && Math.abs(wx - POSTER_X) < 0.8) { g.band = 5; g.lum += 0.1; }
      // data-grain: rare digit cells surfacing in the ground
      const dg = h2i(Math.floor(wx * 1.5) + 3, Math.floor(wz * 1.5) + 9);
      if (dg < 0.05) { g.letter = true; g.letterSeed = Math.floor(dg * 4000); }
    },
  },

  spawn: { x: 4, z: 0, yaw: Math.PI / 2 }, // session start, facing down the timeline

  sky: { stars: 0.8, moon: { phase: 0.9 } }, // the night it was recorded under

  async init() {
    try {
      const r = await fetch('/eeg/session01.json');
      if (!r.ok) throw new Error('no recording');
      const d = await r.json();
      L = Math.max(60, Math.ceil(d.n / 10));
      lanes = LANE_KEYS.map((k) => {
        const src = d.series[k] || [];
        const a = new Float32Array(L);
        for (let i = 0; i < L; i++) {
          let s = 0, c = 0;
          for (let j = i * 10; j < Math.min(d.n, i * 10 + 10); j++) { s += src[j] || 0; c++; }
          a[i] = c ? s / c : 0;
        }
        return a;
      });
      const ev = d.events && d.events[0];
      crossX = ev ? ev / 10 : -1;
      recOk = true;
    } catch {
      lanes = null; crossX = -1; recOk = false;
    }
  },

  beings(t, cam, env) {
    const pts = [];
    if (recOk && crossX > 0) {
      if (!gatePts) {
        gatePts = buildGate();
        digitsAt(gatePts, crossX, String(Math.floor((crossX * 10 + 120) / 60)), 7);
      }
      pts.push(...gatePts);
      if (!posterPts) posterPts = buildPoster();
      pts.push(...posterPts);
      // small lights straying off the veil
      for (let i = 0; i < 10; i++) {
        const ph = h2i(i, Math.floor(t * 1.5));
        if (ph < 0.5) continue;
        pts.push({
          x: crossX + (h2i(i, 31) - 0.5) * 3,
          y: 1 + h2i(i, 41) * 5,
          z: -20 + h2i(i, Math.floor(t * 0.7)) * 40,
          ch: '·', band: 7, lift: 1,
        });
      }
      // the writing's own words, hung among the veil — typeset along z so
      // the walker meets them face-on coming up the valley
      const d = Math.hypot(cam.x - crossX, cam.z);
      if (d < 16) {
        const reveal = Math.min(1, (16 - d) / 6.4);
        const n = Math.floor(reveal * LINE.length);
        for (let i = 0; i < n; i++) {
          const ch = LINE[i];
          if (ch === ' ') continue;
          pts.push({
            x: crossX + 0.3,
            y: 8.3 + (h2i(i * 7, 3) - 0.5) * 0.12,
            z: (i - LINE.length / 2) * 0.22,
            ch, band: 7, lift: 1,
          });
        }
      }
    }
    // the cursor: where the replay is in the night, only when the night is real
    if (recOk && env.source === 'recorded' && env.sessionSec != null) {
      const cx = env.sessionSec / 10;
      for (let y = 0.3; y <= 6.5; y += 0.18) {
        pts.push({ x: cx, y, z: 0, ch: '║', band: 7, lift: 2 });
      }
      for (const dz of [-0.6, 0, 0.6]) {
        pts.push({ x: cx, y: 6.9, z: dz, ch: '+', band: 7, lift: 2 });
      }
    }
    return pts;
  },
};
