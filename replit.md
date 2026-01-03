# SawasdeeLearn

## Overview

SawasdeeLearn is a Thai language learning mobile application built with React Native and Expo. The app features a gamified learning experience with lessons, practice sessions, XP rewards, streaks, and achievements. It supports iOS, Android, and web platforms through Expo's cross-platform capabilities.

The app uses local storage for user progress (no backend authentication required) and includes a simulated leaderboard system. The backend server is set up with Express but currently serves primarily as a static file server and API proxy for the Expo development workflow.

## Content Overview

### Expert Mode - Stories
The app features an **Expert Mode** with **8 Thai stories** across all difficulty levels:
- **Beginner**: "The Friendly Cat", "A Day at the Market"
- **Elementary**: "Bangkok by Night", "The Lost Wallet"
- **Intermediate**: "The Rice Farmer's Wisdom", "A Thai Wedding"
- **Advanced**: "The Spirit of the River"
- **Expert**: "The Legend of Nang Phom Hom"

Each story includes:
- Word-by-word audio playback with synchronized highlighting
- Interactive translation popups (Thai, romanization, English) on word tap
- Auto-scrolling to keep current word visible
- Adjustable playback speed (0.5x, 0.8x, 1.0x)
- Full story translation toggle

### Lessons
The app includes **26 lessons** across **7 categories**:
- **Basics** (5 lessons): Hello/Goodbye, Yes/No, Common Questions, Pronouns, This/That
- **Greetings** (3 lessons): Polite Expressions, Meeting People
- **Numbers** (3 lessons): Numbers 1-5, 6-10, Bigger Numbers (100s, 1000s, millions)
- **Food** (4 lessons): Basic Food Words, Restaurant Phrases, Thai Dishes, Ordering Food
- **Travel** (4 lessons): Getting Around, Transportation, At the Hotel, Asking Directions
- **Sentences** (6 lessons): Simple Sentences, Daily Activities, Expressing Feelings, Making Plans, Time Expressions, Comparisons
- **Conversations** (4 lessons): At a Restaurant, Shopping, Making Small Talk, Emergency Phrases

Each question includes:
- Thai text with audio pronunciation (expo-speech)
- Romanization (pronunciation guide)
- English translation
- Multiple choice answers
- Detailed explanation of usage, grammar, and cultural context

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (React Native + Expo)

**Framework**: Expo SDK 54 with React Native 0.81, using the new architecture
- Entry point: `client/index.js` → `client/App.tsx`
- Path aliases: `@/` maps to `./client/`, `@shared/` maps to `./shared/`

**Navigation**: React Navigation with a hybrid structure
- Root: Native Stack Navigator (`RootStackNavigator.tsx`)
- Main: Bottom Tab Navigator with 5 tabs (Home, Lessons, Stories, Leaderboard, Profile)
- Each tab has its own Stack Navigator for internal navigation
- Modal screens: LessonDetail, Practice, StoryReader (fullscreen modals)

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