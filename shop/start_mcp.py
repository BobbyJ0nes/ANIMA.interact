# ai-use: written by claude (fable 5) agent instances working with bilaal
# auleear, who directed, constrained, and verified it in-session.
# method + provenance: PROCESS.md
import bpy

def _go():
    try:
        bpy.ops.blendermcp.start_server()
        print("BLENDERMCP_STARTED via operator")
    except Exception as e:
        print("operator start failed:", e)
        try:
            import blender_mcp_addon as A
            s = A.BlenderMCPServer()
            s.start()
            bpy.types.Scene._anima_mcp_server = s
            print("BLENDERMCP_STARTED direct")
        except Exception as e2:
            print("direct start failed:", e2)
    return None

bpy.app.timers.register(_go, first_interval=2.0)
