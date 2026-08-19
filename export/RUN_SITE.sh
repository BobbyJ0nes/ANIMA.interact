#!/bin/sh
# ANIMA.interact — serve the bundled site locally (browsers refuse to run
# module scripts straight from a file, so a tiny local server is needed).
# run with:  sh RUN_SITE.sh
cd "$(dirname "$0")/site" || exit 1
echo
echo "  ANIMA.interact — serving at http://localhost:8123"
echo "  keep this terminal open; Ctrl+C stops. if the browser opened"
echo "  before the server was ready, refresh the page once."
echo
( sleep 1; open "http://localhost:8123/" 2>/dev/null || xdg-open "http://localhost:8123/" 2>/dev/null ) &
python3 -m http.server 8123 2>/dev/null || python -m http.server 8123 2>/dev/null || npx --yes serve -l 8123 .
