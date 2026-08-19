# ai-use: written by claude (fable 5) agent instances working with bilaal
# auleear, who directed, constrained, and verified it in-session.
# method + provenance: PROCESS.md
# clears the two scene collections (keeping the shop forms GATE/FATE),
# so build_scenes.py can dress them fresh — safe to run any time
import bpy

keep = {"GATE", "FATE"}
removed = 0
for cname in ("SCENE_gate", "SCENE_streetlamp"):
    c = bpy.data.collections.get(cname)
    if not c:
        continue
    for o in list(c.objects):
        if o.name in keep:
            c.objects.unlink(o)
            bpy.context.scene.collection.objects.link(o)
        else:
            bpy.data.objects.remove(o, do_unlink=True)
            removed += 1
result = f"CLEAN_OK removed={removed}"
print(result)
result
