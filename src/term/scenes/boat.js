// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-boat — the leap, and the small wooden boat on the manuscript sea.
// page register: the sea is standing text; distance is ink fading.
//
// sourced lines — 98 - Journal/ (file:line), verbatim incl. typos:
//   06.06.26.txt:135-136  "I reach the end and stare down to the water. /
//                          23 meters and 19 feet"
//   06.06.26.txt:140      "They fit like a glove"
//   06.06.26.txt:144      "There's never a splash"  — the sea's refusal
//   06.06.26.txt:150      "I wake up in a small wooden boat with two ores"
//   06.06.26.txt:156      "I know I'm safe and I drift off once again."
//   06.06.26.txt:159      "** Curtains close **"
//   06.06.26.txt:5        "dancing in the distance on a whiles back in the
//                          waves. She glows white in the moonlight." and the
//                          entry's deepest question, cued by facing her.
//   20.07.26.txt:18       "Let it be what it always was."  — CROSS-ENTRY.
//                          the echo a rowed night earns at the fold. flagged
//                          for bobby's veto: set ECHO_ROWED = null and the
//                          moment runs silent, mechanics unchanged.
//
// v2: the question (facing her >4s) · rowing refused and witnessed
// (choose 'sea') · the rowed night's echo · the RECORDED swell + its label.
// env: the sea's agitation is the 1/f slope; the crossing passes through the
// text as a faster, brighter current; under RECORDED the whole frame breathes
// on the recorded session's own depth. the stars have moved out; the moon is
// low, large, lonely.

import { h2i, vnoise, dream, inDream, signal, narrate, facing, choose, liminal } from '../engine.js';

// the fold: stillness beside the boat is the drift-off
const CURTAINS = '** Curtains close **';
let stillT0 = 0, lastCX = 0, lastCZ = 0, foldingT = null, lastBT = -9;

const LEDGE_Z = -8; // the end of the walk — 23 meters and 19 feet
const CLIFF_H = 23;
const BOAT = { x: 4, z: -34 };
const LINE2 = "I know I'm safe and I drift off once again.";
const GLOVE = 'They fit like a glove';
const SPLASH = "There's never a splash";

// the entry's deepest question, unused until now (06.06.26.txt:5), lowercased
// into the margin and split at its own full stop — the second sentence is the
// night's hinge and gets its own beat.
const Q_A = "i wander who sent you to find me and what i'm supposed to see.";
const Q_B = 'am i supposed to see?';
// cross-entry, awaiting bobby's word — null ships the fold silent
const ECHO_ROWED = 'let it be what it always was.';
// honesty label — not display prose; the taxonomy speaking as itself.
// "74 minutes" is the session as the project records it (env.js, PROCESS.md);
// the preprocessed series in /eeg/session01.json runs 4347s ≈ 72.5 min — if
// bobby wants the label to match the file exactly, this is the one string.
// exact honesty: the session ran 74 min; the replay file trims
// strap-settling to 72.5 — the label names both
const REC_LABEL = 'recorded · 06.06.26 · 74 min session · 72.5 replayed';

// row all you want; this sea writes no wakes; only stillness folds.
// conduct is not intention: only plain, witnessed wandering is recorded.
const ROW_FAR = 40, ROW_NONE = 8;
let rowDist = 0, rowPX = 0, rowPZ = 0, rowT = 0, seaSaid = false;

// "dancing in the distance on a whiles back in the waves.
//  She glows white in the moonlight." — she keeps her distance, always.
let sheTh = 3.9, sheLast = 0, sheX = 0, sheZ = 0;
let lookT0 = 0, lookLast = -9, asked = false;
function shePts(t, cam) {
  const dt = Math.min(0.1, Math.max(0, t - sheLast));
  sheLast = t;
  const R = 58;
  let sx = Math.cos(sheTh) * R, sz = Math.sin(sheTh) * R;
  if (Math.hypot(cam.x - sx, cam.z - sz) < 40) sheTh += 0.22 * dt; // she recedes
  sheTh += 0.006 * dt; // and she is always slowly dancing away
  sx = Math.cos(sheTh) * R; sz = Math.sin(sheTh) * R;
  sheX = sx; sheZ = sz;
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

// a short line typed into the paper over the water where you are standing —
// the honesty label, and the sea's refusal when it is earned. laid across your
// own gaze so it reads left to right, held just clear of the sea's own letters
// the way every typeset line here floats, and scattered when its time is up.
function stamp(text, cam, t, o) {
  return {
    text, t0: t, life: o.life, cps: o.cps, sp: o.sp, y: o.y, band: o.band, lift: o.lift,
    x: cam.x + Math.sin(cam.yaw) * o.d, z: cam.z - Math.cos(cam.yaw) * o.d,
    rx: Math.cos(cam.yaw), rz: Math.sin(cam.yaw),
  };
}
function stampPts(s, t, out) {
  const u = t - s.t0;
  if (u > s.life) return false;
  const n = Math.min(s.text.length, Math.floor(u * s.cps));
  const fade = u > s.life - 1.3 ? (u - (s.life - 1.3)) / 1.3 : 0;
  for (let i = 0; i < n; i++) {
    const ch = s.text[i];
    if (ch === ' ') continue;
    if (fade > 0 && h2i(i * 7 + 3, 913) < fade) continue;
    const o = (i - (s.text.length - 1) / 2) * s.sp;
    const x = s.x + s.rx * o, z = s.z + s.rz * o;
    out.push({ x, y: Math.max(heightRaw(x, z), 0.05) + s.y, z, ch, band: s.band, lift: s.lift });
  }
  return true;
}
let labelArm = 0, labelDone = false, stampL = null, stampS = null;

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

// the second dreamer breathes (wildcards #4). under RECORDED the frame's ink
// gains a slow swell — the recorded night's own depth channel measured against
// its own running mean, so the light rises as that night went under and falls
// as it came up. MODEL makes no such claim and gets none of it.
let swell = 0, dFast = 0.5, dSlow = 0.5, envLast = 0;

export default {
  id: 'boat',
  title: 'the boat — curtains close',
  register: 'page',

  notation: { extra: ['/', '\\', 'C', '*', '?', '7', '4', '5'] },

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
      // the breath under everything: the horizon of legible writing swells in
      // and out with it — how far the sea can still be read, breathing.
      if (swell) g.lum *= 1 + swell;
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

  envHook(env, t) {
    const dt = Math.min(0.2, Math.max(0, t - envLast));
    envLast = t;
    dFast += (env.ch.depth - dFast) * (1 - Math.exp(-dt / 2.5));
    dSlow += (env.ch.depth - dSlow) * (1 - Math.exp(-dt / 45));
    // the one liminal coupling: narrative depth deepens the breath it never
    // drives — the arc multiplies the body's weather, never impersonates it
    const amp = 0.13 * (1 + 0.45 * liminal());
    swell = env.source === 'recorded'
      ? Math.max(-1, Math.min(1, (dFast - dSlow) * 3.2)) * amp
      : 0;
  },

  beings(t, cam, env) {
    // re-entry (the fold brings you back): re-arm every clock this visit keeps
    if (t - lastBT > 2.5) {
      stillT0 = t; lastCX = cam.x; lastCZ = cam.z; foldingT = null;
      rowDist = 0; rowPX = cam.x; rowPZ = cam.z; rowT = t; seaSaid = false;
      asked = false; lookT0 = 0; lookLast = -9;
      labelArm = 0; labelDone = false; stampL = null; stampS = null;
    }
    lastBT = t;

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

    // hold your face toward her and the night's own question surfaces. she
    // is the being kept out of reach; the asking is the only reaching.
    const look = facing(sheX, sheZ, 0.32);
    if (look) {
      if (t - lookLast > 0.5) lookT0 = t;
      lookLast = t;
      if (!asked && t - lookT0 > 4) { asked = true; narrate(Q_A); narrate(Q_B); }
    }

    // rowing: witnessed only. cumulative wandering over the sea, with a
    // frame-rate-honest step cap so a teleported camera never fabricates it.
    const stepMax = 8 * 2.2 * Math.min(0.5, Math.max(0, t - rowT)) * 1.3 + 0.05;
    const step = Math.hypot(cam.x - rowPX, cam.z - rowPZ);
    if (step <= stepMax && heightRaw(cam.x, cam.z) < 0.6) rowDist += step;
    rowPX = cam.x; rowPZ = cam.z; rowT = t;
    if (!seaSaid && rowDist > ROW_FAR) {
      seaSaid = true;
      if (inDream()) choose('sea', 'rowed');
      // the verdict is met in the sea itself — no wake, and the line that
      // says so surfaces where the rowing was done
      stampS = stamp(SPLASH, cam, t, { d: 6.5, sp: 0.15, y: 2.6, band: 7, lift: 1, cps: 26, life: 6.5 });
    }

    // the honesty label, once, a beat after you wake — RECORDED only
    if (!labelDone) {
      if (env.source === 'recorded') {
        if (!labelArm) labelArm = t + 2.2;
        else if (t >= labelArm) { labelDone = true; stampL = stamp(REC_LABEL, cam, t, { d: 7.5, sp: 0.13, y: 3.05, band: 4, lift: -1, cps: 24, life: 7.4 }); }
      } else labelArm = 0;
    }
    if (stampL && !stampPts(stampL, t, pts)) stampL = null;
    if (stampS && !stampPts(stampS, t, pts)) stampS = null;

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
    // stillness beside the boat is the drift-off — the dream folds
    if (inDream() && !foldingT) {
      if (Math.hypot(cam.x - lastCX, cam.z - lastCZ) > 0.25) {
        stillT0 = t; lastCX = cam.x; lastCZ = cam.z;
      }
      const nearBoat = Math.hypot(cam.x - bx, cam.z - bz) < 7.5;
      if (nearBoat && t - stillT0 > 2.2) narrate("i know i'm safe and i drift off once again.");
      if (nearBoat && t - stillT0 > 6.5) {
        foldingT = t;
        // the fold reads the night's conduct: a sea walked barely at all is
        // stillness; anything between is left unread, and keeps no verdict.
        if (inDream() && !seaSaid && rowDist < ROW_NONE) { seaSaid = true; choose('sea', 'still'); }
        // and it greets last night's — the sea that was rowed gets its line
        if (ECHO_ROWED && dream.echo && dream.echo.sea === 'rowed') narrate(ECHO_ROWED);
      }
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
  line: { text: SPLASH, x: 0, z: LEDGE_Z - 4, y: CLIFF_H + 2.2, radius: 13 },
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
