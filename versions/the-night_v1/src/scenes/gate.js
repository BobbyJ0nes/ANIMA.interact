// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// fate-at-the-gate — the entrance. she announces the loop in her second line.

import * as THREE from 'three';
import { M, ground, box, cyl } from './lib.js';

const PASS = `<div class="pass">'1 visitors pass to Tomorrow'
'- No talking of Yesterday's promises
- No physical torches
- all bags must be stored under your eyes
- No small children
- All black cats must be registered with the Mage under the Willow'

' Follow the glowing mushrooms to the cloakroom where you can store your memories for the journey.

 A reminder that all dreams are FINAL and cannot be returned after issue.'<div class="take">( take the pass — any key )</div></div>`;

export const gate = {
  id: 'fate-at-the-gate',
  fog: 0x131923,
  density: 0.042,
  prose: `Fate greets me at the gate. It's been some time since we last met - she's growing old.<br>Her cold glare doesn't cut me anymore.`,
  interstitial: { html: PASS, holdForKey: true, minMs: 1200 },

  build(ctx) {
    const g = new THREE.Group();
    g.add(ground(0x0d1117));
    g.add(new THREE.HemisphereLight(0x3a4a63, 0x0a0c10, 0.42));
    const moon = new THREE.DirectionalLight(0x9fb4cc, 1.1);
    moon.position.set(-6, 10, -4);
    g.add(moon);
    const cold = new THREE.PointLight(0x9fb4cc, 18, 22, 1.7);
    cold.position.set(2.2, 2.6, -10.2);
    g.add(cold);

    // the gate
    const iron = M(0x171b22, { metalness: 0.25, roughness: 0.8 });
    for (const x of [-2.3, 2.3]) {
      const post = box(0.28, 4.2, 0.28, iron);
      post.position.set(x, 2.1, -10);
      g.add(post);
    }
    for (let i = 0; i < 8; i++) {
      const bar = cyl(0.035, 0.035, 3.2, iron, 8);
      bar.position.set(-1.9 + (i * 3.8) / 7, 1.7, -10);
      g.add(bar);
    }
    for (const y of [3.15, 0.35]) {
      const cross = box(4.3, 0.12, 0.12, iron);
      cross.position.set(0, y, -10);
      g.add(cross);
    }
    for (const x of [-5.4, 5.4]) {
      const wall = box(6, 1.1, 0.4, M(0x11141b));
      wall.position.set(x, 0.55, -10);
      g.add(wall);
    }

    // Fate — a tall form, barely moving. she's growing old.
    const fate = cyl(0.18, 0.62, 3.5, M(0x0d1120, { emissive: 0x121a30, emissiveIntensity: 0.55 }), 10);
    fate.position.set(3.6, 1.75, -11.8);
    g.add(fate);

    // the moss on the stones to my right — it whispers, faintly lit
    for (let i = 0; i < 5; i++) {
      const s = box(1.1 + Math.random() * 0.9, 0.5 + Math.random() * 0.4, 0.9 + Math.random() * 0.7,
        M(0x14231b, { emissive: 0x0a1f12, emissiveIntensity: 0.18 }));
      s.position.set(6.5 + i * 1.2, 0.25, -2.5 - i * 1.4);
      s.rotation.y = Math.random() * 0.6;
      g.add(s);
    }

    let spoke = false;
    return {
      group: g,
      spawn: { pos: new THREE.Vector3(0, 0, 7), yaw: 0 },
      update(t) {
        fate.rotation.z = Math.sin(t * 0.35) * 0.03;
        if (!spoke && t > 8) {
          spoke = true;
          ctx.ui.line(
            `"Why was I here again?"<br>"We're all here and gone and gone again.<br>What's the date my child? Matter of fact, have you got a pen?"`,
            10000
          );
        }
      },
      checkExit(p) { return p.z < -11.2; },
    };
  },
};
