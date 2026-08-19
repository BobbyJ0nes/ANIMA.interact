# ai-use: written by claude (fable 5) agent instances working with bilaal
# auleear, who directed, constrained, and verified it in-session.
# method + provenance: PROCESS.md
# fate (hooded, leaning, pen-hand extended) + the gate (posts, bars, arch)
# runs inside blender via the mcp socket; exports both as GLBs for the field
import bpy, math

col = bpy.context.collection

# ---------- FATE ----------
mb = bpy.data.metaballs.new("fate_mb")
mb.resolution = 0.07
mbo = bpy.data.objects.new("FATE_mb", mb)
col.objects.link(mbo)

def ball(x, y, z, r):
    e = mb.elements.new()
    e.co = (x, y, z)
    e.radius = r
    return e

# cloak — taller and thinner than the lady
for z, r in [(0.4, 0.5), (0.85, 0.44), (1.3, 0.38), (1.75, 0.33), (2.2, 0.29), (2.6, 0.26)]:
    ball(0, 0, z, r)
ball(0.22, 0, 2.75, 0.12); ball(-0.22, 0, 2.75, 0.12)   # narrow shoulders
ball(0, 0.06, 3.05, 0.17)                                # head, set deep
ball(0, -0.12, 3.12, 0.26)                               # the hood
ball(0.34, 0.18, 2.3, 0.09); ball(0.5, 0.3, 2.28, 0.07)  # the pen hand, extended
for i in range(6):
    a = i / 6 * 2 * math.pi
    ball(math.cos(a) * 0.28, math.sin(a) * 0.28, 0.2, 0.26)

bpy.context.view_layer.update()
dg = bpy.context.evaluated_depsgraph_get()
me = bpy.data.meshes.new_from_object(mbo.evaluated_get(dg))
fate = bpy.data.objects.new("FATE", me)
col.objects.link(fate)
bpy.data.objects.remove(mbo, do_unlink=True)
mod = fate.modifiers.new("dec", "DECIMATE"); mod.ratio = 0.4
bpy.context.view_layer.objects.active = fate
bpy.ops.object.modifier_apply(modifier="dec")
fate.rotation_euler = (0, math.radians(4), 0)   # she's growing old — the lean
fate.location = (3.2, 0, 0)

bpy.ops.object.select_all(action='DESELECT')
fate.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=r"C:\CCL_BBY\Cloud_city_VAULT\BASAIRA\01-Projects\ANIMA\ANIMA.interact\public\forms\fate_v1.glb",
    use_selection=True)

# ---------- THE GATE ----------
made = []

def cyl(r, depth, loc, rot=(0, 0, 0), verts=12):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.active_object
    made.append(o)
    return o

def box(sx, sy, sz, loc):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.scale = (sx, sy, sz)
    made.append(o)
    return o

def sph(r, loc, seg=12, rings=8):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=seg, ring_count=rings)
    o = bpy.context.active_object
    made.append(o)
    return o

cyl(0.14, 4.4, (-2.3, 0, 2.2))
cyl(0.14, 4.4, (2.3, 0, 2.2))
sph(0.2, (-2.3, 0, 4.5))
sph(0.2, (2.3, 0, 4.5))
for i in range(9):
    x = -1.84 + i * 0.46
    cyl(0.035, 3.4, (x, 0, 1.75), verts=8)
box(4.6, 0.09, 0.09, (0, 0, 3.35))
box(4.6, 0.09, 0.09, (0, 0, 0.35))
# the arch — beads along a semicircle between the finials
for i in range(15):
    t = math.pi * i / 14
    sph(0.09, (2.3 * math.cos(t), 0, 4.5 + 1.15 * math.sin(t)), seg=10, rings=6)

for o in made:
    o.select_set(True)
bpy.context.view_layer.objects.active = made[0]
bpy.ops.object.join()
gate = bpy.context.active_object
gate.name = "GATE"
mod = gate.modifiers.new("dec", "DECIMATE"); mod.ratio = 0.35
bpy.ops.object.modifier_apply(modifier="dec")
gate.location = (-4.5, 0, 0)

bpy.ops.object.select_all(action='DESELECT')
gate.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=r"C:\CCL_BBY\Cloud_city_VAULT\BASAIRA\01-Projects\ANIMA\ANIMA.interact\public\forms\gate_v1.glb",
    use_selection=True)

result = f"FORMS_OK fate_verts={len(fate.data.vertices)} gate_verts={len(gate.data.vertices)}"
print(result)
result
