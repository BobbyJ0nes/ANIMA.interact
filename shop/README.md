# shop/ — the form-shop, as scripts

the blender scenes are regenerable from source. nothing here is precious;
everything here is reproducible — the scripts are the scene.

## to raise the shop

1. launch blender 5.2 headed with the mcp server live:
   `& "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" --python shop/start_mcp.py`
2. (the addon is already installed + enabled in blender's prefs;
   `blender_mcp_addon.py` is the copy if it ever needs reinstalling)
3. drive it over the socket:
   `python shop/mcp_drive.py ping` · `scene` · `code <file.py>`

## the builds (run in order, or pick)

- `build_lady.py` — the lady: metaballs → mesh → decimate →
  `public/forms/lady_v1.glb`
- `build_forms2.py` — fate (hooded, leaning, pen-hand) + the gate →
  `public/forms/fate_v1.glb`, `gate_v1.glb`
- `build_scenes.py` — SCENE_gate + SCENE_streetlamp (tired-cycle
  keyframed on LAMP_rig) → `td/scene_*.{fbx,glb}`

new sessions get native blender-mcp tools (registered user-scope);
this socket driver is the fallback that works from anywhere.

> _rule of the shop:_ tweak the scripts, not just the scene — whatever
> only exists in an unsaved .blend dies with the window. if a session's
> scene matters, save a .blend beside the exports.
