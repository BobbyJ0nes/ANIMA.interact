// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// the-cloakroom — store your memories for the journey. the mushrooms lead.

import * as THREE from 'three';
import { M, ground, box, cyl, glow } from './lib.js';

export const cloakroom = {
  id: 'the-cloakroom',
  fog: 0x0b0a10,
  density: 0.075,
  prose: `Follow the glowing mushrooms to the cloakroom where you can store your memories for the journey.`,
  interstitial: null,

  build() {
    const g = new THREE.Group();
    g.add(ground(0x0e0c12));
    g.add(new THREE.HemisphereLight(0x2a2118, 0x050408, 0.22));

    // a low corridor into a low room
    const wallMat = M(0x0d0b10);
    for (const x of [-3.2, 3.2]) {
      const wall = box(1, 3.6, 28, wallMat);
      wall.position.set(x, 1.8, -7);
      g.add(wall);
    }
    const ceiling = box(8.5, 0.3, 28, M(0x0a0910));
    ceiling.position.set(0, 3.6, -7);
    g.add(ceiling);
    const backWall = box(8.5, 3.6, 0.5, wallMat);
    backWall.position.set(0, 1.8, -21);
    g.add(backWall);

    // the glowing mushrooms — a gentle S through the dark
    const caps = [];
    for (let i = 0; i < 12; i++) {
      const z = 4.5 - i * 1.9;
      const x = Math.sin(i * 0.7) * 1.6;
      const warm = i % 2 === 0;
      const cap = glow(warm ? 0xffb066 : 0xa8e8c0, 0.16, 1.5);
      cap.scale.y = 0.55;
      cap.position.set(x, 0.28, z);
      g.add(cap);
      const stem = cyl(0.045, 0.06, 0.24, M(0x1a1712), 8);
      stem.position.set(x, 0.12, z);
      g.add(stem);
      caps.push(cap);
      if (i % 3 === 0) {
        const l = new THREE.PointLight(warm ? 0xffb066 : 0xa8e8c0, 3.5, 5.5, 1.8);
        l.position.set(x, 0.6, z);
        g.add(l);
      }
    }

    // pegs, and two memories already hanging
    for (let i = 0; i < 6; i++) {
      const peg = cyl(0.03, 0.03, 0.35, M(0x1a161c), 8);
      peg.rotation.z = Math.PI / 2;
      peg.position.set(-2.55, 2.1, -13 - i * 1.1);
      g.add(peg);
    }
    for (const z of [-14.1, -16.3]) {
      const coat = box(0.5, 0.95, 0.14, M(0x101018));
      coat.position.set(-2.45, 1.6, z);
      coat.rotation.x = 0.05;
      g.add(coat);
    }

    // the way out — a pale door of light in the back wall
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x1d2a3a, emissiveIntensity: 0.8 })
    );
    door.position.set(0.8, 1.4, -20.7);
    g.add(door);

    return {
      group: g,
      spawn: { pos: new THREE.Vector3(0, 0, 5), yaw: 0 },
      update(t) {
        caps.forEach((c, i) => (c.material.emissiveIntensity = 1.35 + Math.sin(t * 2 + i) * 0.3));
      },
      checkExit(p) { return p.z < -18.8; },
    };
  },
};
