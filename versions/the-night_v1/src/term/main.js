// ai-use: written by claude (fable 5) agent instances working with bilaal
// auleear, who directed, constrained, and verified it in-session. all display
// prose is his writing, verbatim. method + provenance: PROCESS.md
// termfield_02 — boot. scenes are discovered; by default the night plays
// in the writing's order (the ride, not the museum). ?lab or ?scene= for
// free roam and the studies.
import { initEngine } from './engine.js';
import { nightDirector } from './night.js';

const mods = import.meta.glob('./scenes/*.js', { eager: true });
const scenes = Object.values(mods).map((m) => m.default).filter(Boolean);
initEngine(scenes, nightDirector);
