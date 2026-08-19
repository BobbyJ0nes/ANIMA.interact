# ai-use: written by claude (fable 5) agent instances working with bilaal
# auleear, who directed, constrained, and verified it in-session.
# method + provenance: PROCESS.md
# two dream scenes for touchdesigner: fate-at-the-gate (assembled from the shop forms)
# and the streetlamp in the strawberry field (with the tired-cycle lean keyframed).
# exports fbx (baked anim) + glb per scene into ANIMA.interact/td/
import bpy, math, random

random.seed(6626)
TD = r"C:\CCL_BBY\Cloud_city_VAULT\BASAIRA\01-Projects\ANIMA\ANIMA.interact\td"

def coll(name):
    c = bpy.data.collections.get(name)
    if not c:
        c = bpy.data.collections.new(name)
        bpy.context.scene.collection.children.link(c)
    return c

def mat(name, color, emit=None, strength=0.0):
    m = bpy.data.materials.get(name)
    if not m:
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        bsdf = m.node_tree.nodes.get("Principled BSDF")
        bsdf.inputs["Base Color"].default_value = (*color, 1)
        if emit:
            bsdf.inputs["Emission Color"].default_value = (*emit, 1)
            bsdf.inputs["Emission Strength"].default_value = strength
    return m

def assign(o, m):
    if o.data and hasattr(o.data, "materials"):
        o.data.materials.clear()
        o.data.materials.append(m)

def move_to(o, c):
    for uc in list(o.users_collection):
        uc.objects.unlink(o)
    c.objects.link(o)

# ---------- SCENE_gate ----------
cg = coll("SCENE_gate")
iron = mat("iron", (0.09, 0.11, 0.16))
pale = mat("pale_moon", (0.66, 0.72, 0.87))
ground_m = mat("night_ground", (0.05, 0.065, 0.09))
moss_m = mat("moss", (0.08, 0.14, 0.10))

gate = bpy.data.objects.get("GATE")
fate = bpy.data.objects.get("FATE")
lady = bpy.data.objects.get("ANIMA_lady")
if gate:
    gate.location = (0, 0, 0); assign(gate, iron); move_to(gate, cg)
if fate:
    fate.location = (3.6, 1.2, 0); assign(fate, pale); move_to(fate, cg)
if lady:
    lady.location = (14, 10, 0)   # she sits this scene out

bpy.ops.mesh.primitive_cylinder_add(radius=28, depth=0.06, location=(0, 0, -0.03), vertices=48)
g = bpy.context.active_object; g.name = "gate_ground"; assign(g, ground_m); move_to(g, cg)

for x in (-5.4, 5.4):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0, 0.55))
    w = bpy.context.active_object
    w.scale = (6, 0.4, 1.1); w.name = f"wall_{int(x)}"
    assign(w, iron); move_to(w, cg)

for i in range(5):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(6.5 + i * 1.2, 2.5 + i * 1.4, 0.25))
    s = bpy.context.active_object
    s.scale = (1.1 + random.random() * 0.9, 0.9 + random.random() * 0.7, 0.5 + random.random() * 0.4)
    s.rotation_euler = (0, 0, random.random() * 0.6)
    s.name = f"moss_{i}"; assign(s, moss_m); move_to(s, cg)

# ---------- SCENE_streetlamp ----------
cl = coll("SCENE_streetlamp")
lamp_iron = mat("lamp_iron", (0.07, 0.08, 0.11))
amber = mat("amber_glow", (0.85, 0.58, 0.30), emit=(1.0, 0.63, 0.30), strength=4.0)
berry_m = mat("berry", (0.34, 0.09, 0.13))
field_m = mat("field_ground", (0.045, 0.06, 0.045))

OFF = 80.0  # scene lives beside the gate scene in world space

bpy.ops.mesh.primitive_cylinder_add(radius=30, depth=0.06, location=(OFF, 0, -0.03), vertices=48)
fg = bpy.context.active_object; fg.name = "lamp_ground"; assign(fg, field_m); move_to(fg, cl)

rig = bpy.data.objects.new("LAMP_rig", None)
rig.location = (OFF, 0, 0)
cl.objects.link(rig)

bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=4.2, location=(0, 0, 2.1), vertices=12)
post = bpy.context.active_object; post.name = "lamp_post"; assign(post, lamp_iron); move_to(post, cl)
post.parent = rig
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 4.35))
head = bpy.context.active_object; head.scale = (0.5, 0.5, 0.3); head.name = "lamp_head"
assign(head, lamp_iron); move_to(head, cl); head.parent = rig
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, location=(0, 0, 4.05), segments=16, ring_count=10)
bulb = bpy.context.active_object; bulb.name = "lamp_bulb"; assign(bulb, amber); move_to(bulb, cl)
bulb.parent = rig

for i in range(70):
    a = random.random() * math.pi * 2
    r = 2 + random.random() * 24
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.05 + random.random() * 0.045,
        location=(OFF + math.cos(a) * r, math.sin(a) * r, 0.07),
        segments=10, ring_count=6)
    b = bpy.context.active_object; b.name = f"berry_{i}"; assign(b, berry_m); move_to(b, cl)

# the tired cycle, keyframed: steady -> lean 13-16s -> hold -> straighten 21-24s (24fps)
scn = bpy.context.scene
scn.render.fps = 24
scn.frame_start = 1
scn.frame_end = 624
for frame, lean in [(1, 0.0), (312, 0.0), (384, 0.07), (504, 0.07), (576, 0.0), (624, 0.0)]:
    rig.rotation_euler = (0, lean, 0)
    rig.keyframe_insert(data_path="rotation_euler", frame=frame)

# ---------- exports ----------
def export_coll(cname, base):
    bpy.ops.object.select_all(action='DESELECT')
    for o in bpy.data.collections[cname].objects:
        o.select_set(True)
    bpy.ops.export_scene.fbx(filepath=base + ".fbx", use_selection=True,
                             bake_anim=True, add_leaf_bones=False)
    bpy.ops.export_scene.gltf(filepath=base + ".glb", use_selection=True)

export_coll("SCENE_gate", TD + r"\scene_gate")
export_coll("SCENE_streetlamp", TD + r"\scene_streetlamp")

result = f"SCENES_OK gate_objs={len(bpy.data.collections['SCENE_gate'].objects)} lamp_objs={len(bpy.data.collections['SCENE_streetlamp'].objects)}"
print(result)
result
