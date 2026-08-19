// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-mage-under-the-willow — a footnote from the pass, promoted to a place.
// the mage stays unseen: a lantern behind the strands. the unseen stays unseen.

import * as THREE from 'three';
import { M, ground, box, cyl, glow } from './lib.js';

export const willow = {
  id: 'the-mage-under-the-willow',
  fog: 0x0c130e,
  density: 0.05,
  prose: `All black cats must be registered with the Mage under the Willow`,
  interstitial: null,

  build() {
    const g = new THREE.Group();
    g.add(ground(0x0c120d));
    g.add(new THREE.HemisphereLight(0x24322a, 0x070a08, 0.42));
    const dir = new THREE.DirectionalLight(0x8fa8b8, 0.45);
    dir.position.set(5, 9, 3);
    g.add(dir);

    // the willow
    const tree = new THREE.Group();
    const trunk = cyl(0.42, 0.62, 5, M(0x18130e), 10);
    trunk.position.y = 2.5;
    trunk.rotation.z = 0.12;
    tree.add(trunk);
    const strands = [];
    for (let i = 0; i < 46; i++) {
      const a = (i / 46) * Math.PI * 2;
      const r = 2.6 + Math.random() * 0.9;
      const len = 3 + Math.random() * 1.6;
      const s = cyl(0.018, 0.018, len, M(0x1c2a1c), 6);
      s.position.set(Math.cos(a) * r, 5 - len / 2, Math.sin(a) * r);
      s.userData.phase = Math.random() * Math.PI * 2;
      tree.add(s);
      strands.push(s);
    }
    tree.position.set(0, 0, -12);
    g.add(tree);

    // the lantern of the unseen mage, beyond the curtain of strands
    const lantern = glow(0xd8c07a, 0.12, 2.6);
    lantern.position.set(0, 1.15, -15.5);
    g.add(lantern);
    const ll = new THREE.PointLight(0xd8c07a, 20, 14, 1.7);
    ll.position.copy(lantern.position);
    g.add(ll);

    // one black cat, near the trunk, not yet registered
    const cat = new THREE.Group();
    const body = box(0.5, 0.3, 0.24, M(0x060608));
    body.position.y = 0.2;
    cat.add(body);
    const head = box(0.2, 0.18, 0.2, M(0x060608));
    head.position.set(0.3, 0.42, 0);
    cat.add(head);
    for (const z of [-0.06, 0.06]) {
      const ear = cyl(0.001, 0.05, 0.12, M(0x060608), 6);
      ear.position.set(0.3, 0.56, z);
      cat.add(ear);
    }
    const eyes = [];
    for (const z of [-0.055, 0.055]) {
      const eye = glow(0xd8ffa0, 0.03, 3);
      eye.position.set(0.41, 0.44, z);
      cat.add(eye);
      eyes.push(eye);
    }
    cat.position.set(1.5, 0, -10.4);
    cat.rotation.y = -0.5;
    g.add(cat);

    return {
      group: g,
      spawn: { pos: new THREE.Vector3(0, 0, 4), yaw: 0 },
      update(t) {
        for (const s of strands) s.rotation.x = Math.sin(t * 0.8 + s.userData.phase) * 0.05;
        // the cat blinks, every little while
        const blink = (t % 6.4) > 6.15;
        for (const e of eyes) e.scale.y = blink ? 0.08 : 1;
      },
      checkExit(p) { return p.z < -16.5; },
    };
  },
};
