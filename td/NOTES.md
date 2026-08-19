# td/ — blender → touchdesigner tests · 18.08

two dream scenes, exported from the live blender session, ready to play.

## the scenes

- **scene_gate** (`.fbx` / `.glb`) — the gate at origin, fate beside it
  (pale, leaning), low walls, five moss stones, a 28m night-ground disc.
  materials carried: iron / pale_moon / moss / night_ground.
- **scene_streetlamp** (`.fbx` / `.glb`) — the lamp on its rig, 70
  strawberries scattered to r≈26m, 30m ground disc. the bulb material is
  **emissive amber** (principled emission, strength 4).
  **the tired cycle is keyframed on `LAMP_rig`**: 24fps, frames 1–624
  (26s) — steady → lean 0.07rad at 13–16s → hold → straighten 21–24s.
  fbx carries the animation; scrub it in blender's timeline too, both
  scenes are still live in the open session (lamp scene sits 80m +x).

## importing into touchdesigner

- drag the **.fbx** into the network → an FBX COMP appears; geometry,
  materials, and the LAMP_rig animation come with it (animation page on
  the COMP: play mode / sample rate).
- the **.glb** twins import via the glTF COMP if you prefer that path.

## the field aesthetic in td — recipe sketch

the browser field's grammar translates to td instancing almost 1:1:

1. from the imported COMP, take the SOP path of any mesh
2. **Point SOP / SOP scatter** over its surface → these are your
   condensation targets (what MeshSurfaceSampler does in the web build)
3. a **Geo COMP with instancing on**, instance positions from the
   scattered points (soptoCHOP → tx ty tz)
4. glyph atlas: a **Text TOP** rendering the character set in a grid;
   per-instance texture coords (instance w/ custom attributes) pick the
   glyph — cycle them with a Noise CHOP through a Lookup
5. colour per instance from the palette; additive blend on the
   material (Constant MAT, add) = the glow
6. lerp instance positions between a drift field (Noise TOP/CHOP) and
   the scattered targets = condensation, now with td's realtime hands
   on every parameter — and audio-reactive for free if you feed it a
   CHOP from an audio device

## agent hands inside td — wired, one step yours

`touchdesigner-mcp` is cloned at `System/touchdesigner-mcp/` and
registered user-scope with claude code (stdio → http :9980). to give
agents hands, either:

- open the prebuilt project:
  `System/touchdesigner-mcp/Touchdesigner/TouchdesignerClaudeMCP.toe`, or
- in any project: add a **Web Server DAT**, port **9980**, active ON,
  callbacks from `System/touchdesigner-mcp/td_webserver_callback.py`

check: http://localhost:9980 should answer `{"status": "connected"}`.
tools land in new claude sessions (td_create_operator, td_set_parameter,
td_connect, td_run_python) — and once the DAT is live, this session can
drive it over http directly, same trick as the blender socket.
