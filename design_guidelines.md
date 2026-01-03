# Thai Language Learning App - Design Guidelines

## Architecture Decisions

### Authentication
**No Backend Auth Required** - The app uses local storage for user progress.

**Profile/Settings Screen** includes:
- User-customizable avatar (3 Thai-themed presets: elephant, lotus flower, temple silhouette)
- Display name field
- App preferences: Daily goal (5/10/15/30 min), reminder notifications, theme (light/dark/auto)
- Progress stats: Total XP, current streak, lessons completed

### Navigation Structure
**Tab Navigation** (4 tabs + floating action button)

**Tabs:**
1. **Home** - Daily lessons, streak tracker, featured content
2. **Lessons** - Browse all lessons by category/difficulty
3. **Leaderboard** - Weekly/all-time local rankings (simulated)
4. **Profile** - User stats, settings, achievements

**Floating Action Button (FAB):** "Practice" - Quick access to daily challenge (positioned above tab bar, center-right)

## Screen Specifications

### 1. Home Screen
**Purpose:** Show daily progress, active streak, and recommended next lesson

**Layout:**
- Transparent header with "Hello, [Name]" greeting (left) and settings icon (right)
- Scrollable content with safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl
- Components:
  - Streak card: Fire icon, current streak number, "day streak" text
  - XP progress bar: Daily goal progress (animated fill)
  - "Today's Lesson" card: Lesson thumbnail, title, difficulty badge, "Continue" button
  - Quick stats grid: Total lessons, accuracy %, total XP

### 2. Lessons Screen
**Purpose:** Browse and select lessons organized by topic

**Layout:**
- Default navigation header with "Lessons" title and search icon (right)
- Scrollable list with safe area insets: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl
- Components:
  - Category chips (horizontal scroll): Basics, Greetings, Food, Travel, Numbers
  - Lesson cards in vertical list:
    - Left: Thai character icon
    - Center: Lesson title, difficulty (Beginner/Intermediate/Advanced), XP reward
    - Right: Lock icon (if not unlocked) or checkmark (if completed)
    - Progress indicator if partially complete

### 3. Lesson Detail Screen (Modal)
**Purpose:** Complete a lesson with interactive exercises

**Layout:**
- Custom header: Progress bar (questions completed), X close button (left), heart lives indicator (right)
- Non-scrollable content with safe area insets: top = headerHeight + Spacing.xl, bottom = insets.bottom + Spacing.xl
- Components:
  - Question prompt area: Thai text/audio playback button
  - Answer options: 2-4 large touchable cards with English translations
  - "Check" button (bottom, full width, disabled until answer selected)
  - Correct/incorrect feedback overlay (green/red with animation)

### 4. Leaderboard Screen
**Purpose:** Display competitive rankings (local simulated users)

**Layout:**
- Default navigation header with "Leaderboard" title
- Scrollable list with safe area insets: top = Spacing.xl, bottom = tabBarHeight + Spacing.xl
- Components:
  - Time filter chips: This Week, All Time
  - Podium display (top 3): Trophy icons, avatars, names, XP
  - Ranked list items: Rank number, avatar, name, XP, trend arrow
  - Current user card (highlighted, sticky at bottom)

### 5. Profile Screen
**Purpose:** View stats, customize profile, access settings

**Layout:**
- Transparent header with edit icon (right)
- Scrollable content with safe area insets: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl
- Components:
  - Avatar selector (tappable to change)
  - Display name
  - Stats cards: Streak, Total XP, Lessons completed, Accuracy
  - Achievements grid: Badge icons with unlock status
  - Settings button (navigates to settings screen)

### 6. Settings Screen (Stack)
**Purpose:** Configure app preferences

**Layout:**
- Default navigation header with "Settings" title and back button (left)
- Scrollable form with safe area insets: top = Spacing.xl, bottom = insets.bottom + Spacing.xl
- Components:
  - Daily goal slider (5-30 minutes)
  - Notification toggle + time picker
  - Theme selector: Light/Dark/Auto
  - Sound effects toggle
  - Data section: Reset progress (with confirmation alert)

### 7. Practice Screen (from FAB)
**Purpose:** Quick daily challenge

**Layout & Components:** Same as Lesson Detail Screen, but loads a random review question from completed lessons

## Design System

### Color Palette
**Primary:** `#8B4FD9` (Thai purple) - CTAs, active states  
**Secondary:** `#FF6B9D` (Vibrant pink) - Accents, achievements  
**Success:** `#4CAF50` (Green) - Correct answers, streaks  
**Error:** `#F44336` (Red) - Incorrect answers, lives lost  
**Background:** `#FFFFFF` (Light mode), `#1A1A1A` (Dark mode)  
**Surface:** `#F5F5F5` (Light mode), `#2A2A2A` (Dark mode)  
**Text Primary:** `#212121` (Light mode), `#FFFFFF` (Dark mode)  
**Text Secondary:** `#757575` (Light mode), `#B0B0B0` (Dark mode)

### Typography
**Headings:** SF Pro Display, Bold  
**Body:** SF Pro Text, Regular  
**Thai Text:** Sukhumvit Set (system Thai font), Medium

### Interactive Feedback
- All buttons: Scale down to 0.95 when pressed
- Answer cards: Border highlight (2px primary color) when selected
- FAB: Drop shadow (offset: 0,2 | opacity: 0.10 | radius: 2)
- Streak fire icon: Pulse animation on Home screen

### Critical Assets
1. **3 Avatar Presets:**
   - Thai elephant (geometric, minimal style)
   - Lotus flower (line art style)
   - Temple silhouette (simplified iconic)
   
2. **Achievement Badges (6 total):**
   - First Lesson (bronze star)
   - 7-Day Streak (fire badge)
   - 50 Lessons (gold star)
   - Perfect Score (diamond)
   - 30-Day Streak (crown)
   - Thai Master (trophy)

3. **Category Icons:** Feather icons from @expo/vector-icons for categories (home, message-circle, coffee, map, hash)

### Accessibility
- Minimum touch target: 44x44 points
- Audio playback for all Thai text (speaker icon)
- High contrast mode support
- VoiceOver labels on all interactive elements
- Dynamic type support for text scaling