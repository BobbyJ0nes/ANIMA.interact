// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-boat — behind the first blue panel on stage. the emergency pack holds a rod.
// no walking here. you were always going to be caught.

import * as THREE from 'three';
import { M, ground, box, cyl } from './lib.js';

export const boat = {
  id: 'the-boat',
  fog: 0x04070c,
  density: 0.06,
  walk: false,
  eye: 0.95,
  prose: `I wake up in a small wooden boat with two ores behind the first blue panel on stage.<br>I peer at the audience through the cut-out and catch a glance on the rod from the emergency pack.`,
  interstitial: { html: `** Curtains close **`, minMs: 3400 },

  build(ctx) {
    const g = new THREE.Group();

    // still water — the surface that never confirmed receipt
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(160, 48),
      new THREE.MeshStandardMaterial({ color: 0x050a12, roughness: 0.35, metalness: 0.6 })
    );
    water.rotation.x = -Math.PI / 2;
    g.add(water);
    g.add(new THREE.HemisphereLight(0x0e1a28, 0x020305, 0.34));
    const moonlight = new THREE.DirectionalLight(0x6a89a8, 0.5);
    moonlight.position.set(3, 8, 6);
    g.add(moonlight);

    // the boat, under you
    const wood = M(0x241a10);
    const hull = box(1.1, 0.35, 2.6, wood);
    hull.position.set(0, 0.18, 0);
    g.add(hull);
    for (const z of [-0.55, 0.55]) {
      const oar = cyl(0.03, 0.03, 1.9, M(0x2a1f14), 8);
      oar.rotation.z = Math.PI / 2 - 0.15;
      oar.position.set(0, 0.42, z);
      g.add(oar);
    }
    const rod = cyl(0.016, 0.02, 2.2, M(0x2e2115), 8);
    rod.position.set(0.3, 0.6, -0.7);
    rod.rotation.x = -1.25;
    rod.rotation.z = 0.12;
    g.add(rod);

    // the first blue panel, with its cut-out at eye height
    const blue = M(0x16304a, { emissive: 0x102640, emissiveIntensity: 0.32 });
    const bottom = box(4.6, 0.85, 0.12, blue); bottom.position.set(0, 0.42, -3.2); g.add(bottom);
    const top = box(4.6, 1.6, 0.12, blue); top.position.set(0, 2.45, -3.2); g.add(top);
    const leftP = box(1.7, 0.8, 0.12, blue); leftP.position.set(-1.45, 1.25, -3.2); g.add(leftP);
    const rightP = box(1.7, 0.8, 0.12, blue); rightP.position.set(1.45, 1.25, -3.2); g.add(rightP);

    // the audience side, warm, beyond the cut-out
    const house = new THREE.PointLight(0xffb066, 16, 14, 1.7);
    house.position.set(0, 1.5, -6.5);
    g.add(house);
    for (let i = 0; i < 5; i++) {
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), M(0x060505));
      head.position.set(-1.6 + i * 0.8, 1.0, -7.2 - (i % 2) * 0.7);
      g.add(head);
    }

    let drifted = false;
    return {
      group: g,
      spawn: { pos: new THREE.Vector3(0, 0, 0), yaw: 0 },
      update(t) {
        ctx.camera.position.y = 0.95 + Math.sin(t * 0.65) * 0.05;
        if (!drifted && t > 14) {
          drifted = true;
          ctx.ui.line(`I know I'm safe and I drift off once again.`, 8000);
        }
      },
      checkExit(_p, t) { return t > 21; },
    };
  },
};
