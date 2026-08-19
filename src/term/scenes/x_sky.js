// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// x_sky — the sky study. six skies along one promenade, west to east:
// the composed night · the letter veils · the rain of letters · moving out ·
// the false dawn · the talking lights. walk east (shift runs); '║' waymark
// pairs mark each border; the sky theatre hangs to the NORTH — turn to face
// it. the engine is untouched: clouds, rain, streaks and aurora are beings,
// and the moon + star-count are steered live through this scene's own sky
// object. notes + proposals: explorations/sky.md

import { h2i, vnoise } from '../engine.js';

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smooth = (u, a, b) => clamp01((u - a) / (b - a));
const band = (x, lo, hi, e = 16) => clamp01((x - lo) / e) * clamp01((hi - x) / e);
const qz = (v, s) => Math.floor(v / s) * s;
const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

function zones(x) {
  return {
    pen: band(x, -400, -66),
    veil: band(x, -74, -21),
    rain: band(x, -29, 24),
    out: band(x, 16, 69),
    dawn: band(x, 61, 114),
    lights: band(x, 106, 400),
  };
}

function heightRaw(x, z) {
  let h = vnoise(x * 0.02, z * 0.03) * 3.2 + vnoise(x * 0.07, z * 0.07) * 1.1 - 0.8;
  if (h < 0.35) h = 0.35 + (0.35 - h) * 0.2;
  // the promenade sinks into the text-sea at its long edges
  const ex = Math.max((Math.abs(z) - 38) / 26, (Math.abs(x - 15) - 130) / 26);
  if (ex > 0) { const m = Math.min(1, ex); h -= m * m * 12; }
  return h;
}

// ---------------------------------------------------- zone 1 · the pen
// fate's lost pen hangs in the west sky. stars condense into it, hold,
// and scatter — the field's own grammar, celestial. every third cycle
// they form a single lowercase letter instead: the sky remembering how
// to speak (english-rare argued in the notes; one letter, never a word).

const PEN = [[0, 0], [0.032, 0.026], [0.064, 0.052], [0.096, 0.078], [0.128, 0.104], [-0.03, -0.022], [-0.012, -0.034]];
const WFORM = [[-0.064, 0.05], [-0.032, -0.004], [0, 0.028], [0.032, -0.004], [0.064, 0.05], [0.1, 0.088], [-0.1, 0.088]];
const HOMES = PEN.map((_, i) => [(h2i(i, 201) - 0.5) * 0.3, (h2i(i, 202) - 0.5) * 0.22]);
const CONST_R = 130, CONST_AZ = -0.88, CONST_EL = 0.16;

// ---------------------------------------------------- zone 2 · letter veils
const CLOUDS = (() => {
  const cs = [];
  for (let i = 0; i < 3; i++) { // em-dash strata
    const cells = [];
    for (let k = 0; k < 12 + i * 2; k++) cells.push([k * 0.9, (h2i(i * 9 + k, 301) - 0.5) * 0.8]);
    cs.push({ cells, y: 9 + i * 1.7, z: -13 - i * 8, sp: 0.32 + i * 0.13, off: i * 21, ch: '—' });
  }
  for (let i = 0; i < 2; i++) { // comma cumulus
    const cells = [];
    for (let k = 0; k < 11; k++) cells.push([(h2i(i * 7 + k, 311) - 0.5) * 5, (h2i(i * 7 + k, 312) - 0.5) * 2]);
    cs.push({ cells, y: 8 + i * 2.2, z: -22 + i * 9, sp: 0.5 + i * 0.2, off: 40 + i * 17, ch: ',' });
  }
  return cs;
})();

// ---------------------------------------------------- zone 3 · letter rain
const RC = { x: -2, z: -16, y: 9.5 };
const lanes = Array.from({ length: 5 }, (_, i) => ({ P: 4.0 + i * 0.37, ph: i * 1.31, last: -1 }));
let landings = [];

// ---------------------------------------------------- waymarks
const MARKS = (() => {
  const pts = [];
  for (const bx of [-70, -25, 20, 65, 110])
    for (const side of [-7, 7])
      for (let y = 0; y <= 1.6; y += 0.4)
        pts.push({ x: bx, y: Math.max(heightRaw(bx, side), 0) + y, z: side, ch: '║', band: 8, lift: 0 });
  return pts;
})();

const SELF = {
  id: 'x_sky',
  title: 'the sky study',
  register: 'night',

  world: {
    far: 320,
    waterLevel: 0,
    islandR: null,
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g, t) {
      // the promenade path
      if (Math.abs(wz - Math.sin(wx * 0.05) * 2) < 1.3) { g.band = 5; g.lum *= 0.78; }
      // fallen rain-letters lie glowing where they landed, then fade
      if (landings.length && Math.abs(wx - RC.x) < 14 && Math.abs(wz - RC.z) < 14) {
        for (const L of landings) {
          const dx = wx - L.x, dz = wz - L.z;
          if (dx * dx + dz * dz < 1.7) {
            const a = 1 - (t - L.t0) / 2.4;
            if (a > 0) { g.lum += a * 0.35; g.letter = true; g.letterSeed = L.seed; }
          }
        }
      }
    },
  },

  spawn: { x: -96, z: 8, yaw: Math.PI / 2 },

  // steered live from beings(): stars deplete in "moving out", the moon
  // sinks and swells as they go, and during the false dawn she follows him.
  sky: { stars: 0.95, moon: { az: -0.55, el: 0.34, r: 3 } },

  beings(t, cam, env) {
    const pts = [...MARKS];
    const w = zones(cam.x);
    landings = landings.filter((L) => t - L.t0 < 2.4);

    // — the pen (and, every third cycle, one letter) —
    if (w.pen > 0.03) {
      const cyc = Math.floor(t / 40), u = (t % 40) / 40;
      const form = cyc % 3 === 2 ? WFORM : PEN;
      const mixAll = smooth(u, 0, 0.25) * (1 - smooth(u, 0.6, 0.85));
      for (let i = 0; i < PEN.length; i++) {
        const m = clamp01(mixAll * 1.35 - i * 0.05);
        const az = CONST_AZ + t * 0.004 + HOMES[i][0] + (form[i][0] - HOMES[i][0]) * m;
        const el = CONST_EL + HOMES[i][1] + (form[i][1] - HOMES[i][1]) * m;
        pts.push({
          x: Math.sin(az) * CONST_R, y: el * CONST_R, z: -Math.cos(az) * CONST_R,
          ch: m > 0.92 ? '+' : '·', band: m > 0.92 ? 4 : 9, lift: m > 0.92 ? 1 : 0,
        });
      }
    }

    // — the letter veils, cover breathing with depth —
    if (w.veil > 0.03) {
      const cover = 0.35 + env.ch.depth * 0.55;
      for (let ci = 0; ci < CLOUDS.length; ci++) {
        const c = CLOUDS[ci];
        const cx = -76 + ((c.off + qz(t * c.sp, 0.55)) % 58);
        for (let k = 0; k < c.cells.length; k++) {
          if (h2i(ci * 31 + k, 90 + Math.floor(t * 0.22)) > cover) continue;
          pts.push({ x: cx + c.cells[k][0], y: c.y + c.cells[k][1], z: c.z, ch: c.ch, band: 9, lift: k % 4 === 0 ? 0 : -1 });
        }
      }
    }

    // — the rain of letters: shed from the cloud, absorbed by the ground —
    if (w.rain > 0.04) {
      for (let k = 0; k < 9; k++) {
        pts.push({
          x: RC.x + (h2i(k, 61) - 0.5) * 6.5, y: RC.y + (h2i(k, 62) - 0.5) * 1.4,
          z: RC.z + (h2i(k, 63) - 0.5) * 4, ch: ',', band: 9, lift: 0,
        });
      }
      for (let i = 0; i < lanes.length; i++) {
        const ln = lanes[i];
        const tt = t + ln.ph;
        const cyc = Math.floor(tt / ln.P);
        const u = (tt % ln.P) / ln.P;
        const dx = RC.x + (h2i(cyc, 71 + i) - 0.5) * 7;
        const dz = RC.z + (h2i(cyc, 81 + i) - 0.5) * 5;
        const seed = Math.floor(h2i(cyc * 7, 91 + i) * 26);
        if (u < 0.6) {
          const gy = Math.max(heightRaw(dx, dz), 0) + 0.15;
          const k = Math.floor((u / 0.6) * 12);
          pts.push({ x: dx, y: RC.y - 1 - (k / 12) * (RC.y - 1 - gy), z: dz, ch: ALPHA[seed], band: 9, lift: k > 9 ? -1 : 0 });
        } else if (ln.last !== cyc) {
          ln.last = cyc;
          landings.push({ x: dx, z: dz, t0: t, seed });
          if (landings.length > 10) landings.shift();
        }
      }
    }

    // — moving out: shooting stars are departures —
    if (w.out > 0.03) {
      const cyc = Math.floor(t / 6), u = t % 6;
      if (h2i(cyc, 777) < 0.3 + env.ch.spark * 0.6 && u < 1.15) {
        const sx = 22 + h2i(cyc, 51) * 44, sy = 14 + h2i(cyc, 52) * 4;
        for (let k = 0; k < 7; k++) {
          const uu = u / 1.15 - k * 0.055;
          if (uu < 0) break;
          pts.push({
            x: qz(sx + uu * 24, 0.6), y: qz(sy - uu * 8, 0.5), z: -42 - uu * 10,
            ch: k === 0 ? '*' : k < 3 ? ':' : '·', band: k === 0 ? 4 : 9, lift: k === 0 ? 1 : -1,
          });
        }
      }
    }

    // — the false dawn: a warm breath at the horizon that always recedes —
    const u2 = (t % 30) / 30;
    const breath = smooth(u2, 0.12, 0.3) * (1 - smooth(u2, 0.5, 0.72));
    if (w.dawn > 0.03 && breath > 0.02) {
      const a = breath * w.dawn;
      for (let i = 0; i <= 40; i++) {
        const x = 60 + i * 1.35;
        const arch = (1.6 + 11 * Math.exp(-((i - 20) * (i - 20)) / 130)) * a;
        for (let yy = 0.4; yy < arch; yy += 0.7) {
          pts.push({
            x, y: yy, z: -96, ch: yy < 1.3 ? '+' : '·', band: 6,
            lift: yy < 1.3 && Math.abs(i - 20) < 6 ? 0 : -1,
          });
        }
      }
    }

    // — the talking lights: aurora as old star-speech, waving with spark —
    if (w.lights > 0.03) {
      const amp = 0.45 + env.ch.spark * 0.55;
      for (let k = 0; k < 12; k++) {
        const bx = 112 + k * 4.3;
        const len = (9 + 6 * Math.sin(t * 0.35 + k * 0.83)) * amp;
        const ox = Math.sin(t * 0.5 + k * 1.7) * 2.2;
        for (let m = 0; m * 0.9 < len; m++) {
          pts.push({
            x: bx + ox * (m / 14), y: 8 + m * 0.9, z: -96,
            ch: m % 3 === 0 ? '│' : '░', band: k % 2 ? 2 : 9, lift: m > 7 ? -1 : 0,
          });
        }
      }
    }

    // — steer the engine's own sky —
    const a = breath * w.dawn;
    SELF.sky.stars = 0.95 * (1 - 0.72 * w.out) * (1 - 0.5 * a);
    const m = SELF.sky.moon;
    m.az = -0.55 + 0.42 * a;              // she follows him toward the warmth
    m.el = 0.34 - 0.1 * w.out + 0.04 * a; // and sinks as the stars leave
    m.r = w.out > 0.5 ? 4 : 3;            // larger, lonelier

    return pts;
  },

  line: {
    text: "She can't even talk to the stars anymore, they've all moved out now.",
    x: 42, z: -6, y: 4.2, radius: 14,
  },
};

export default SELF;
