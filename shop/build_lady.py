# ai-use: written by claude (fable 5) agent instances working with bilaal
# auleear, who directed, constrained, and verified it in-session.
# method + provenance: PROCESS.md
# note: absolute paths below are machine-local process artifacts (this
# script drove a local blender session; kept as record, not for reuse).
# builds the ANIMA lady as metaballs -> mesh -> decimate -> GLB export
# runs inside blender via the mcp addon's execute_code channel
import bpy, math

# clear the default furniture, keep lights/camera for his viewport
for name in ("Cube",):
    o = bpy.data.objects.get(name)
    if o:
        bpy.data.objects.remove(o, do_unlink=True)

mb = bpy.data.metaballs.new("anima_lady_mb")
mb.resolution = 0.07

obj = bpy.data.objects.new("ANIMA_lady_mb", mb)
bpy.context.collection.objects.link(obj)

def ball(x, y, z, r):
    e = mb.elements.new()
    e.co = (x, y, z)
    e.radius = r
    return e

# figure, z-up: skirt rising into torso, head, shoulder hints, a flare at the hem
ball(0, 0, 0.45, 0.55)
ball(0, 0, 0.8, 0.48)
ball(0, 0, 1.15, 0.4)
ball(0, 0, 1.5, 0.33)
ball(0, 0, 1.85, 0.3)
e = mb.elements.new(); e.type = 'ELLIPSOID'; e.co = (0, 0, 2.35); e.radius = 0.32
e.size_x = 0.5; e.size_y = 0.38; e.size_z = 0.75
ball(0, 0, 3.08, 0.24)
ball(0.3, 0, 2.62, 0.13); ball(-0.3, 0, 2.62, 0.13)
ball(0.42, 0.05, 2.25, 0.1); ball(-0.42, -0.05, 2.25, 0.1)
for i in range(8):
    a = i / 8 * 2 * math.pi
    ball(math.cos(a) * 0.35, math.sin(a) * 0.35, 0.22, 0.28)

bpy.context.view_layer.update()

dg = bpy.context.evaluated_depsgraph_get()
me = bpy.data.meshes.new_from_object(obj.evaluated_get(dg))
lady = bpy.data.objects.new("ANIMA_lady", me)
bpy.context.collection.objects.link(lady)
bpy.data.objects.remove(obj, do_unlink=True)

mod = lady.modifiers.new("dec", "DECIMATE")
mod.ratio = 0.4
bpy.context.view_layer.objects.active = lady
bpy.ops.object.modifier_apply(modifier="dec")

bpy.ops.object.select_all(action='DESELECT')
lady.select_set(True)
out = r"C:\CCL_BBY\Cloud_city_VAULT\BASAIRA\01-Projects\ANIMA\ANIMA.interact\public\forms\lady_v1.glb"
bpy.ops.export_scene.gltf(filepath=out, use_selection=True)

result = f"LADY_OK verts={len(lady.data.vertices)} tris~{len(lady.data.polygons)}"
print(result)
result
