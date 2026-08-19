// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-boat — the leap, and the small wooden boat on the manuscript sea.
// page register: the sea is standing text; distance is ink fading.
// "I reach the end and stare down to the water. / 23 meters and 19 feet"
// "I toss a rock below / There's never a splash / I take a leap of faith anyways"
// "I wake up in a small wooden boat with two ores"
// the stars have moved out; the moon is low, large, lonely.
// env: the sea's agitation is the 1/f slope; the crossing passes through
// the text as a faster, brighter current.

import { h2i, vnoise, dream, inDream, signal, narrate } from '../engine.js';

// the fold: stillness beside the boat is the drift-off
const CURTAINS = '** Curtains close **';
let stillT0 = 0, lastCX = 0, lastCZ = 0, foldingT = null, lastBT = -9;

const LEDGE_Z = -8; // the end of the walk — 23 meters and 19 feet
const CLIFF_H = 23;
const BOAT = { x: 4, z: -34 };
const LINE2 = "I know I'm safe and I drift off once again.";
const GLOVE = 'They fit like a glove';

// "dancing in the distance on a whiles back in the waves.
//  She glows white in the moonlight." — she keeps her distance, always.
let sheTh = 3.9, sheLast = 0;
function shePts(t, cam) {
  const dt = Math.min(0.1, Math.max(0, t - sheLast));
  sheLast = t;
  const R = 58;
  let sx = Math.cos(sheTh) * R, sz = Math.sin(sheTh) * R;
  if (Math.hypot(cam.x - sx, cam.z - sz) < 40) sheTh += 0.22 * dt; // she recedes
  sheTh += 0.006 * dt; // and she is always slowly dancing away
  sx = Math.cos(sheTh) * R; sz = Math.sin(sheTh) * R;
  const pts = [];
  for (let y = 0.35; y <= 3.0; y += 0.14) {
    const dance = Math.sin(t * 1.6 + y * 2.1) * 0.32 * (y / 3);
    pts.push({ x: sx + dance, y, z: sz, ch: '▒', band: 7, lift: h2i(Math.floor(t * 3), Math.floor(y * 10)) > 0.7 ? 1 : 0 });
  }
  for (let y = 0.2; y <= 1.0; y += 0.28) // her reflection, broken in the text
    pts.push({ x: sx + Math.sin(t * 1.1 + y * 5) * 0.4, y: -y, z: sz + 0.5, ch: '·', band: 7, lift: -1 });
  return pts;
}

function heightRaw(x, z) {
  // the sea — a standing sheet of text, just above the engine's water level
  let h = 0.05;
  // the spit: a narrow ridge rising north to the ledge, then a sheer face
  const w = Math.exp(-(x * x) / (3.2 * 3.2));
  const rise = Math.max(0, Math.min(1, (18 - z) / 26));
  const face = z > LEDGE_Z ? 1 : Math.max(0, 1 + (z - LEDGE_Z) / 1.2);
  const ridge = (2 + (CLIFF_H - 2) * rise * rise) * w * face;
  h += ridge;
  if (ridge > 0.5) h += vnoise(x * 0.3, z * 0.3) * 0.5 * w * face;
  return h;
}

// the boat's still geometry — transformed by bob and roll each frame
const boatBase = (() => {
  const p = [];
  for (let xi = -1.6; xi <= 1.61; xi += 0.05) {
    const sheer = 0.55 * Math.pow(Math.abs(xi) / 1.6, 2);
    p.push({ xi, y0: 0.5 + sheer, zo: -0.35, ch: '▓', band: 4 });
    p.push({ xi, y0: 0.5 + sheer, zo: 0.35, ch: '▓', band: 4 });
    if (Math.abs(xi) < 1.3) p.push({ xi, y0: 0.18, zo: 0, ch: '█', band: 4 });
  }
  for (let k = 0; k <= 16; k++) { // two ores, dipped
    const u = k / 16;
    p.push({ xi: -0.9 - u * 1.2, y0: 0.6 - u * 0.55, zo: -0.2, ch: '\\', band: 2 });
    p.push({ xi: 0.9 + u * 1.2, y0: 0.6 - u * 0.55, zo: -0.2, ch: '/', band: 2 });
  }
  for (let y = 0.6; y <= 2.8; y += 0.12) p.push({ xi: 0, y0: y, zo: 0.1, ch: '│', band: 3 });
  p.push({ xi: 0.12, y0: 2.85, zo: 0.1, ch: '·', band: 5, lift: 1 });
  return p;
})();

export default {
  id: 'boat',
  title: 'the boat — curtains close',
  register: 'page',

  notation: { extra: ['/', '\\', 'C', '*'] },

  world: {
    far: 300,
    waterLevel: 0,
    islandR: null, // the sea is endless; the manuscript has no far shore
    height(x, z) { return heightRaw(x, z); },
    ground(wx, wz, hS, g, t, env) {
      if (hS < 0.6) {
        // the sea of standing text — the scene owns its own water
        g.band = 0;
        const shim = 0.06 + 0.1 * (0.5 + 0.5 * env.ch.slope);
        g.lum = 0.34 + shim * Math.sin(t * 1.1 + wx * 0.31 + wz * 0.17) + env.ch.crossing * 0.12;
        const cur = 0.35 + env.ch.crossing * 2.2;
        g.letter = true;
        g.letterSeed = Math.floor(h2i(Math.floor(wx * 0.9 + t * cur), Math.floor(wz * 0.9)) * 997);
      } else if (hS > 18) {
        g.lum *= 0.82; // the ledge top — bare stone, quieter ink
      }
    },
    // the 23-meter face — strata of old writing, sediment lines of text;
    // each band of height keeps one letter, the way sediment keeps a year
    face(wx, wz, wy, g, t) {
      if (wz > LEDGE_Z - 1.5 && Math.abs(wx) < 4.5 && wy > 1 && wy < CLIFF_H - 0.5) {
        const stratum = Math.floor(wy * 0.8);
        if (h2i(Math.floor(wx * 2) + stratum, 403) < 0.75) {
          g.letter = true;
          g.letterSeed = Math.floor(h2i(stratum + Math.floor(wx * 0.3), 405) * 997);
        }
        g.lum *= 0.9 + h2i(stratum * 7 + 3, 401) * 0.25;
      }
    },
  },

  spawn: { x: 0, z: 14, yaw: 0 },

  // "they've all moved out now" — an emptied sky; the moon low, large,
  // half-lit and haloed: lonely
  sky: { stars: 0.08, moon: { az: -0.55, el: 0.22, r: 4, phase: 0.55, halo: true } },

  beings(t, cam, env) {
    const bx = BOAT.x + Math.sin(t * 0.021) * 2.5;
    const bz = BOAT.z + Math.cos(t * 0.017) * 1.5;
    const bob = Math.sin(t * 0.4) * 0.3;
    const roll = Math.sin(t * 0.31 + 0.7) * 0.05;
    const pts = [];
    for (const b of boatBase) {
      pts.push({ x: bx + b.xi, y: b.y0 + bob + b.xi * roll, z: bz + b.zo, ch: b.ch, band: b.band, lift: b.lift || 0 });
    }
    // the endless stairs, floating out past the ledge, going nowhere
    for (let k = 0; k < 18; k++) {
      const sy = CLIFF_H + 0.8 + k * 0.95 + Math.sin(t * 0.23 + k) * 0.18;
      const sz = LEDGE_Z - 1.5 - k * 2.4;
      for (let dx = -0.5; dx <= 0.51; dx += 0.16) {
        pts.push({ x: dx + Math.sin(k * 2.7) * 0.4, y: sy, z: sz, ch: '═', band: 4, lift: 0 });
      }
    }
    // she, far out on the sea — white in the moonlight, unreachable
    pts.push(...shePts(t, cam));
    // the goggles in the jacket pocket — only if the jacket made the journey
    if (dream.jacket === 'carried') {
      const gd = Math.hypot(cam.x, cam.z - (LEDGE_Z + 2));
      if (gd < 6 && cam.y > CLIFF_H - 4) {
        const n = Math.floor(Math.min(1, (6 - gd) / 2.5) * GLOVE.length);
        for (let i = 0; i < n; i++) {
          const ch = GLOVE[i];
          if (ch === ' ') continue;
          pts.push({
            x: (i - GLOVE.length / 2) * 0.12,
            y: CLIFF_H + 1.1 + (h2i(i * 7, 11) - 0.5) * 0.08,
            z: LEDGE_Z - 1.6, ch, band: 7, lift: 1,
          });
        }
      }
    }
    // re-entry (the fold brings you back): re-arm the stillness clock
    if (t - lastBT > 2.5) { stillT0 = t; lastCX = cam.x; lastCZ = cam.z; foldingT = null; }
    lastBT = t;
    // stillness beside the boat is the drift-off — the dream folds
    if (inDream() && !foldingT) {
      if (Math.hypot(cam.x - lastCX, cam.z - lastCZ) > 0.25) {
        stillT0 = t; lastCX = cam.x; lastCZ = cam.z;
      }
      const nearBoat = Math.hypot(cam.x - bx, cam.z - bz) < 7.5;
      if (nearBoat && t - stillT0 > 2.2) narrate("i know i'm safe and i drift off once again.");
      if (nearBoat && t - stillT0 > 6.5) foldingT = t;
    }
    if (foldingT && t - foldingT > 5.2) { signal('folded'); foldingT = null; stillT0 = t; }
    // the last line, revealed only beside the boat — you must walk the sea
    const d = Math.hypot(cam.x - bx, cam.z - bz);
    if (d < 14) {
      const reveal = Math.min(1, (14 - d) / 5.6);
      const n = Math.floor(reveal * LINE2.length);
      for (let i = 0; i < n; i++) {
        const ch = LINE2[i];
        if (ch === ' ') continue;
        pts.push({
          x: bx + (i - LINE2.length / 2) * 0.12,
          y: 4.1 + bob * 0.6 + (h2i(i * 7, 5) - 0.5) * 0.1,
          z: bz - 0.8,
          ch, band: 7, lift: 1,
        });
      }
    }
    return pts;
  },

  // the line hangs in the blank paper between the fading sea and the sky
  line: { text: "There's never a splash", x: 0, z: LEDGE_Z - 4, y: CLIFF_H + 2.2, radius: 13 },
  screen(t, put, dims) {
    if (!foldingT) return;
    const u = t - foldingT;
    if (u < 1.6) return;
    const n = Math.min(CURTAINS.length, Math.floor((u - 1.6) / 0.12));
    const c0 = Math.floor((dims.cols - CURTAINS.length) / 2);
    const r0 = Math.floor(dims.rows * 0.44);
    // the line gets its own silence — a cleared band in the sea of text
    for (let r = r0 - 1; r <= r0 + 1; r++)
      for (let c = c0 - 3; c < c0 + CURTAINS.length + 3; c++)
        put(c, r, ' ', 7, 5);
    for (let i = 0; i < n; i++) {
      if (CURTAINS[i] === ' ') continue;
      put(c0 + i, r0, CURTAINS[i], 7, 0);
    }
  },
};
