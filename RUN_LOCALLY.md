# Running SawasdeeLearn Locally

This guide explains how to run the SawasdeeLearn Thai language learning app on your local computer.

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x or higher | JavaScript runtime |
| npm | 9.x or higher | Package manager (comes with Node.js) |
| PostgreSQL | 14.x or higher | Database (optional for basic usage) |

### Optional (for mobile testing)

- **Expo Go app** - Install on your iOS or Android device from the App Store / Google Play
- **iOS Simulator** - Requires macOS with Xcode installed
- **Android Emulator** - Requires Android Studio

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sawasdee-learn
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup (Optional)

If you want to use database features:

```bash
# Set your PostgreSQL connection string
export DATABASE_URL="postgresql://username:password@localhost:5432/sawasdeelearn"

# Push the database schema
npm run db:push
```

## Running the App

### Development Mode

You'll need to run two processes in separate terminal windows:

**Terminal 1 - Backend Server:**
```bash
npm run server:dev
```
This starts the Express server on port 5000.

**Terminal 2 - Expo Development Server:**
```bash
npx expo start
```
This starts the Metro bundler on port 8081.

### Quick Start (Web Only)

For web-only testing without the backend:
```bash
npx expo start --web
```

## Accessing the App

### Web Browser
Open http://localhost:8081 in your browser.

### iOS Device (via Expo Go)
1. Open the Camera app on your iPhone
2. Scan the QR code displayed in the terminal
3. The app will open in Expo Go

### Android Device (via Expo Go)
1. Open the Expo Go app
2. Scan the QR code displayed in the terminal

### iOS Simulator (macOS only)
Press `i` in the terminal after running `npx expo start`

### Android Emulator
Press `a` in the terminal after running `npx expo start`

## Environment Variables

Create a `.env` file in the project root if needed:

```env
# Database connection (optional)
DATABASE_URL=postgresql://username:password@localhost:5432/sawasdeelearn

# Session secret for authentication
SESSION_SECRET=your-secret-key-here
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run server:dev` | Start backend server in development mode |
| `npx expo start` | Start Expo development server |
| `npm run db:push` | Push database schema changes |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run check:types` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |

## Production Build

### Build Static Web Bundle
```bash
npm run expo:static:build
```

### Build and Run Production Server
```bash
npm run server:build
npm run server:prod
```

## Project Structure

```
sawasdee-learn/
├── client/           # React Native/Expo frontend
│   ├── components/   # Reusable UI components
│   ├── screens/      # App screens
│   ├── navigation/   # Navigation configuration
│   ├── hooks/        # Custom React hooks
│   ├── constants/    # Theme, colors, spacing
│   └── lib/          # Utilities and helpers
├── server/           # Express.js backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API routes
│   └── storage.ts    # Data storage logic
├── shared/           # Shared code between client/server
│   └── schema.ts     # Database schema (Drizzle ORM)
├── assets/           # Images, fonts, icons
└── scripts/          # Build scripts
```

## Troubleshooting

### Port Already in Use
If port 5000 or 8081 is already in use:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

### Metro Bundler Cache Issues
Clear the Metro cache:
```bash
npx expo start --clear
```

### Node Modules Issues
Delete and reinstall:
```bash
rm -rf node_modules
npm install
```

### Database Connection Errors
1. Ensure PostgreSQL is running
2. Verify your DATABASE_URL is correct
3. Check that the database exists

## Features

- Thai language lessons with audio pronunciation
- Muay Thai workout routines with voice guidance
- Spaced repetition vocabulary review
- Story reading with word-by-word translation
- Writing practice for Thai characters
- XP rewards, streaks, and achievements
- Simulated leaderboard

## Tech Stack

- **Frontend**: React Native + Expo SDK 54
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **State**: React Query + AsyncStorage
- **Navigation**: React Navigation 7
- **Animations**: React Native Reanimated
