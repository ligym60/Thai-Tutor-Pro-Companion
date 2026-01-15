# Thai Boxer Companion App - Deployment Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Local Development](#local-development)
3. [Building the App](#building-the-app)
4. [Updating the VPS](#updating-the-vps)
5. [Submitting to App Stores](#submitting-to-app-stores)
6. [Updating the App After Changes](#updating-the-app-after-changes)

---

## Project Overview

- **Local Project Path:** `C:\Users\ligym\Downloads\Thai-Tutor-Pro-Server`
- **VPS Server:** `72.62.174.113`
- **VPS Project Path:** `/home/thai_boxer/thaiboxer-companion`
- **VPS User:** `thai_boxer`
- **Domain:** `https://thaiboxer-companion.cloud`
- **Expo Account:** `ligym60`

---

## Local Development

### Start the development server
```powershell
cd C:\Users\ligym\Downloads\Thai-Tutor-Pro-Server
npm run dev
```

### Run on Expo Go (for testing)
```powershell
npx expo start
```
Then scan the QR code with Expo Go app on your phone.

---

## Building the App

### Prerequisites
- EAS CLI installed: `npm install -g eas-cli`
- Logged in to Expo: `eas login`

### Build for Android (APK for testing)
```powershell
cd C:\Users\ligym\Downloads\Thai-Tutor-Pro-Server
eas build --platform android --profile preview
```
- Creates an APK you can install directly on Android devices
- Build takes ~10-15 minutes
- Download link provided when complete

### Build for iOS (for TestFlight)
```powershell
cd C:\Users\ligym\Downloads\Thai-Tutor-Pro-Server
eas build --platform ios --profile preview
```
- Requires Apple Developer account ($99/year)
- Build takes ~15-20 minutes

### Build Both Platforms
```powershell
eas build --platform all --profile preview
```

---

## Updating the VPS

### Option A: Using PSCP (Command Line)

Upload a single file:
```powershell
pscp C:\Users\ligym\Downloads\Thai-Tutor-Pro-Server\<filename> thai_boxer@72.62.174.113:/home/thai_boxer/thaiboxer-companion/
```

Upload entire folder (excluding node_modules):
```powershell
# First create a tarball locally
cd C:\Users\ligym\Downloads\Thai-Tutor-Pro-Server
tar -czf update.tar.gz --exclude='node_modules' --exclude='.git' --exclude='static-build' .

# Upload it
pscp update.tar.gz thai_boxer@72.62.174.113:/home/thai_boxer/

# Then on VPS (via PuTTY):
cd /home/thai_boxer/thaiboxer-companion
tar -xzf ~/update.tar.gz
npm install
pm2 restart thai-boxer-companion
```

### Option B: Using WinSCP (GUI - Easier)

1. Open WinSCP
2. Connect with:
   - **Host:** `72.62.174.113`
   - **User:** `thai_boxer`
   - **Password:** (your VPS password)
3. Navigate to `/home/thai_boxer/thaiboxer-companion/` on server side
4. Drag files from local folder to server
5. After uploading, connect via PuTTY and run:
   ```bash
   cd /home/thai_boxer/thaiboxer-companion
   npm install  # if package.json changed
   pm2 restart thai-boxer-companion
   ```

### After Updating VPS - Restart the Server
Connect via PuTTY and run:
```bash
cd /home/thai_boxer/thaiboxer-companion
pm2 restart thai-boxer-companion
pm2 logs thai-boxer-companion --lines 20
```

---

## Submitting to App Stores

### Submit to Google Play Store
```powershell
cd C:\Users\ligym\Downloads\Thai-Tutor-Pro-Server
eas submit --platform android
```
- Requires Google Play Developer account ($25 one-time)
- Follow prompts to connect your account

### Submit to Apple TestFlight
```powershell
cd C:\Users\ligym\Downloads\Thai-Tutor-Pro-Server
eas submit --platform ios
```
- Requires Apple Developer account ($99/year)
- Build will appear in App Store Connect > TestFlight
- Add testers in TestFlight section

### App Store Connect (iOS)
1. Go to https://appstoreconnect.apple.com
2. Select your app
3. Go to "TestFlight" tab
4. Build will appear after processing (~5-10 minutes)
5. Add internal testers (up to 100)
6. For external testers, submit for Beta App Review

---

## Updating the App After Changes

### Step 1: Make your code changes locally
Edit files in `C:\Users\ligym\Downloads\Thai-Tutor-Pro-Server`

### Step 2: Test locally (optional)
```powershell
npx expo start
```

### Step 3: Build new version
```powershell
# Update version in app.json first (increment version number)
eas build --platform all --profile preview
```

### Step 4: Submit to stores
```powershell
# For iOS TestFlight
eas submit --platform ios

# For Google Play
eas submit --platform android
```

### Step 5: Update VPS (if server code changed)
Use WinSCP or PSCP to upload changed files, then:
```bash
# On VPS via PuTTY
cd /home/thai_boxer/thaiboxer-companion
pm2 restart thai-boxer-companion
```

---

## Quick Reference Commands

| Task | Command |
|------|---------|
| Login to EAS | `eas login` |
| Build Android | `eas build --platform android --profile preview` |
| Build iOS | `eas build --platform ios --profile preview` |
| Build Both | `eas build --platform all --profile preview` |
| Submit iOS | `eas submit --platform ios` |
| Submit Android | `eas submit --platform android` |
| View build status | `eas build:list` |
| Check Expo account | `eas whoami` |

---

## VPS Quick Commands (via PuTTY)

| Task | Command |
|------|---------|
| Restart app | `pm2 restart thai-boxer-companion` |
| View logs | `pm2 logs thai-boxer-companion --lines 50` |
| Check status | `pm2 list` |
| Stop app | `pm2 stop thai-boxer-companion` |
| Start app | `pm2 start thai-boxer-companion` |

---

## Useful Links

- **Expo Dashboard:** https://expo.dev/accounts/ligym60
- **App Store Connect:** https://appstoreconnect.apple.com
- **Google Play Console:** https://play.google.com/console
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **EAS Submit Docs:** https://docs.expo.dev/submit/introduction/

---

## Troubleshooting

### Build fails with "Unable to resolve module App"
Make sure `App.js` exists in root folder:
```javascript
// App.js
export { default } from "./client/App";
```

### VPS shows 502 Bad Gateway
```bash
pm2 restart thai-boxer-companion
pm2 logs thai-boxer-companion --lines 50
```

### iOS build stuck in queue
Free tier has limited build capacity. Wait or upgrade to priority builds.

### TestFlight build not appearing
Builds take 5-10 minutes to process after upload. Check App Store Connect status.
