// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// lib/wake.js — the walker's wake: expanding rings of disturbed letters
// behind anyone crossing water. adopted from the x_sea study (19.08).
// never used in the boat scene — that sea refuses ("There's never a splash").

export function makeWake(cap = 24) {
  const trail = [];
  return {
    // call each frame from envHook/beings with the camera and whether the
    // walker currently stands on water
    note(cam, t, onWater) {
      if (!onWater) return;
      const last = trail[trail.length - 1];
      if (!last || t - last.t > 0.18) {
        trail.push({ x: cam.x, z: cam.z, t });
        if (trail.length > cap) trail.shift();
      }
    },
    // call from world.water(); brightens rings around recent steps
    apply(wx, wz, w, t) {
      const last = trail[trail.length - 1];
      if (!last || Math.abs(wx - last.x) > 14 || Math.abs(wz - last.z) > 14) {
        if (!last) return;
      }
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        const age = t - p.t;
        if (age > 3) break;
        const d = Math.hypot(wx - p.x, wz - p.z);
        const rad = 0.5 + age * 0.8;
        const ring = Math.abs(d - rad);
        if (ring < 0.5) w.lum += (1 - age / 3) * (1 - ring / 0.5) * 0.28;
      }
    },
  };
}
