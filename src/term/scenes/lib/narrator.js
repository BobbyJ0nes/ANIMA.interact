// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// lib/narrator.js — the path carries the writing. the current passage is
// laid along the walk, letter after letter, readable underfoot if you look
// down, texture if you don't. the narrator is the ground, not a caption.

const WA = "abcdefghijklmnopqrstuvwxyzWGFTSAI0682.,:;·-—'\"()";

export function makeNarrator(text, poly, spacing = 0.55, width = 1.35) {
  // lowercase the passage into the ambient alphabet; keep punctuation it has
  const chars = [...text.toLowerCase()];
  const seedOf = chars.map((c) => WA.indexOf(c)); // -1 renders nothing
  // arc-length parameterize the polyline
  const cum = [0];
  for (let i = 1; i < poly.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(poly[i].x - poly[i - 1].x, poly[i].z - poly[i - 1].z));
  }
  return {
    // call from ground(): writes the passage's letter into path cells
    apply(wx, wz, g) {
      let best = -1, bestD = width + 1;
      for (let i = 1; i < poly.length; i++) {
        const ax = poly[i - 1].x, az = poly[i - 1].z;
        const bx = poly[i].x, bz = poly[i].z;
        const vx = bx - ax, vz = bz - az;
        const L2 = vx * vx + vz * vz;
        if (L2 < 1e-6) continue;
        let u = ((wx - ax) * vx + (wz - az) * vz) / L2;
        u = Math.max(0, Math.min(1, u));
        const px = ax + vx * u, pz = az + vz * u;
        const d = Math.hypot(wx - px, wz - pz);
        if (d < bestD) { bestD = d; best = cum[i - 1] + Math.sqrt(L2) * u; }
      }
      if (best < 0 || bestD > width) return false;
      const li = Math.floor(best / spacing);
      if (li < 0 || li >= chars.length) return false;
      const s = seedOf[li];
      if (s < 0 || chars[li] === ' ') return false;
      g.letter = true;
      g.letterSeed = s;
      g.lum = Math.max(g.lum, 0.3 + 0.12 * (1 - bestD / width));
      return true;
    },
  };
}
