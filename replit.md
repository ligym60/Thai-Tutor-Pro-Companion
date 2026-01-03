# SawasdeeLearn

## Overview

SawasdeeLearn is a Thai language learning mobile application built with React Native and Expo. The app features a gamified learning experience with lessons, practice sessions, XP rewards, streaks, and achievements. It supports iOS, Android, and web platforms through Expo's cross-platform capabilities.

The app uses local storage for user progress (no backend authentication required) and includes a simulated leaderboard system. The backend server is set up with Express but currently serves primarily as a static file server and API proxy for the Expo development workflow.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React Native + Expo)

**Framework**: Expo SDK 54 with React Native 0.81, using the new architecture
- Entry point: `client/index.js` → `client/App.tsx`
- Path aliases: `@/` maps to `./client/`, `@shared/` maps to `./shared/`

**Navigation**: React Navigation with a hybrid structure
- Root: Native Stack Navigator (`RootStackNavigator.tsx`)
- Main: Bottom Tab Navigator with 4 tabs (Home, Lessons, Leaderboard, Profile)
- Each tab has its own Stack Navigator for internal navigation
- Modal screens: LessonDetail and Practice (fullscreen modals)

**State Management**:
- Local game state via `useGameState` hook backed by AsyncStorage
- React Query for server state (configured but minimally used currently)
- No global state management library - relies on React hooks and prop drilling

**UI Components**:
- Custom themed components (`ThemedText`, `ThemedView`, `Card`, `Button`)
- Reanimated for animations with spring configurations
- Expo Blur for tab bar transparency on iOS
- Consistent design tokens in `constants/theme.ts`

**Data Storage**:
- AsyncStorage for all user data (profile, progress, achievements)
- No cloud sync - all data is local to the device
- Storage keys prefixed with `@sawasdee_`

### Backend (Express + Node.js)

**Server**: Express running on port 5000
- Minimal API surface - primarily serves static files in production
- CORS configured for Replit development/deployment domains
- Routes defined in `server/routes.ts` (currently empty - add `/api` prefixed routes here)

**Database**: PostgreSQL with Drizzle ORM
- Schema defined in `shared/schema.ts`
- Currently only has a `users` table (not actively used)
- Drizzle Kit for migrations (`npm run db:push`)
- In-memory storage implementation available in `server/storage.ts`

### Build & Development

**Development**:
- `npm run expo:dev` - Starts Expo with Replit proxy configuration
- `npm run server:dev` - Starts Express server with tsx

**Production**:
- `npm run expo:static:build` - Builds static web bundle
- `npm run server:build` - Bundles server with esbuild
- `npm run server:prod` - Runs production server

## External Dependencies

**Core Platform**:
- Expo SDK 54 with managed workflow
- React Native 0.81 with new architecture enabled
- React 19.1

**Navigation & UI**:
- React Navigation (native-stack, bottom-tabs)
- React Native Reanimated for animations
- React Native Gesture Handler for touch handling
- Expo Blur, Expo Haptics, Expo Image

**Data & Storage**:
- AsyncStorage for local persistence
- Drizzle ORM with PostgreSQL driver (pg)
- TanStack React Query for server state

**Server**:
- Express 4.x
- http-proxy-middleware for development proxying

**Development Tools**:
- TypeScript with strict mode
- ESLint with Expo config + Prettier
- tsx for running TypeScript server code
- esbuild for production server bundling