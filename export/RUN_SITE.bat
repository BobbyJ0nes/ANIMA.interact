@echo off
rem ANIMA.interact — serve the bundled site locally (browsers refuse to run
rem module scripts straight from a file, so a tiny local server is needed).
cd /d "%~dp0site"
echo.
echo   ANIMA.interact — serving at http://localhost:8123
echo   keep this window open; close it to stop. if the browser opened
echo   before the server was ready, refresh the page once.
echo.
start "" "http://localhost:8123/"
python -m http.server 8123 2>nul || py -m http.server 8123 2>nul || npx --yes serve -l 8123 .
