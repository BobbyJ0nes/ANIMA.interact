# ai-use: written by claude (fable 5) agent instances working with bilaal
# auleear, who directed, constrained, and verified it in-session.
# method + provenance: PROCESS.md
"""Drive the blender-mcp addon socket directly — the same channel the MCP server uses."""
import json, socket, sys, time

HOST, PORT = "127.0.0.1", 9876

def send(cmd, timeout=90):
    s = socket.create_connection((HOST, PORT), timeout=timeout)
    s.sendall(json.dumps(cmd).encode("utf-8"))
    s.settimeout(timeout)
    chunks = []
    while True:
        try:
            data = s.recv(65536)
        except socket.timeout:
            break
        if not data:
            break
        chunks.append(data)
        try:
            resp = json.loads(b"".join(chunks).decode("utf-8"))
            s.close()
            return resp
        except json.JSONDecodeError:
            continue
    s.close()
    raise RuntimeError("no complete response")

if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "ping"
    if which == "ping":
        print(json.dumps(send({"type": "ping"})))
    elif which == "scene":
        print(json.dumps(send({"type": "get_scene_info"}))[:800])
    elif which == "code":
        code = open(sys.argv[2], encoding="utf-8").read()
        print(json.dumps(send({"type": "execute_code", "params": {"code": code}}, timeout=180))[:2000])
