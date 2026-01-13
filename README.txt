Thai Tutor Pro Companion - Local Startup Guide

To start the app locally, follow these steps (assuming Node.js v20 is installed via nvm):

1. Switch to Node v20:
   nvm use 20

2. Start the backend server (in one terminal):
   cd C:\Users\ligym\OneDrive\Documents\GitHub\Thai-Tutor-Pro-Companion
   $env:NODE_ENV="development"
   $env:PORT="5000"
   npx tsx server/index.ts

3. Start Expo (in another terminal):
   cd C:\Users\ligym\OneDrive\Documents\GitHub\Thai-Tutor-Pro-Companion
   $env:EXPO_PUBLIC_DOMAIN="localhost:5000"
   npx expo start --web

4. Open the app:
   - Wait for "Web Bundled" in the Expo terminal.
   - Open http://localhost:8081 in your browser.

Notes:
- The code fixes (API URL to http, unescaped entities) are already applied.
- If ports are in use, kill Node processes: taskkill /IM node.exe /F
- Backend runs on http://localhost:5000, Expo on http://localhost:8081.