# Robotenc Leaderboard Frontend

React Native / Expo frontend for the Robotenc leaderboard exercise. This app shows a pixel-art style leaderboard, user profiles, and a score submission flow, with smooth UX and robust error handling.

## Tech stack

- React Native (Expo)
- TypeScript
- expo-router
- TanStack Query (@tanstack/react-query)
- NativeWind (Tailwind for React Native)
- react-native-safe-area-context
- react-native-confetti-cannon

## Project structure (frontend)

- `app/`
  - Expo Router routes (home leaderboard, submit score, user profile).
- `src/api/`
  - HTTP client and typed API functions (`leaderboard.ts`).
- `src/components/ui/`
  - Reusable UI primitives: `Screen`, `PixelButton`, `PixelCard`, typography, `LoadingSplash`, `FadeInView`, `NotificationOverlay`.
- `src/components/views/`
  - Pure presentational views (`LeaderboardView`, `UserProfileView`, `SubmitScoreView`).
- `src/screens/`
  - Container components with navigation, hooks and handlers (`LeaderboardScreen`, `UserProfileScreen`, `SubmitScoreScreen`).
- `src/hooks/`
  - `queries/`: data fetching hooks (`useLeaderboardQuery`, `useUserProfileQuery`).
  - `mutations/`: mutations (`useSubmitScoreMutation`, `useResetLeaderboardMutation`).
- `src/config/`
  - Query client setup, messages, animation constants.

## Key UX behaviors

- **Splash screen**
  - Full-screen pixel-art splash (`LoadingSplash`) only on true first-load when no cached data is available.
  - Subsequent loads use inline loaders inside each screen to avoid layout jumps.

- **Safe area & layout stability**
  - `Screen` uses `useSafeAreaInsets` and manual padding instead of `SafeAreaView` to prevent layout shifts.

- **Leaderboard**
  - Fades each row in using `FadeInView`.
  - Pull-to-refresh support.
  - Error and empty states with clear messaging.

- **User profile**
  - Fades in profile header and score history.
  - Inline loading and error states.

- **Submit score flow**
  - Validates that the score is an integer from 0 to 999.
  - Disables the input and shows a loader while submitting.
  - On success, navigates back to the leaderboard and shows a contextual notification:
    - If the user climbs in rank: green message + confetti.
    - If the user drops: red message encouraging improvement.
    - If rank stays the same: neutral message.

- **Notifications**
  - `NotificationOverlay` shows transient, animated messages with fade-in/fade-out and optional confetti.
  - Used for:
    - Score updates.
    - Leaderboard resets.
    - Reset failures.
    - Connection issues when loading the leaderboard.

- **Network & errors**
  - TanStack Query caching with sensible `staleTime` to avoid excessive refetching.
  - Clear error states when the API is unreachable, plus a dedicated connection-issue notification on leaderboard load failure.

## State management & architecture

- **Shared state with TanStack Query**
  - Leaderboard and user profile data are shared across screens via TanStack Query (`useLeaderboardQuery`, `useUserProfileQuery`).
  - Mutations (`useSubmitScoreMutation`, `useResetLeaderboardMutation`) update and invalidate the same cache, keeping all screens in sync.

- **Optimistic updates for scores**
  - `useSubmitScoreMutation` performs an optimistic update of the leaderboard:
    - On submit, it updates the `current_user` entry in the cached leaderboard, adjusts the score and timestamp, re-sorts the list, and recalculates ranks before the server responds.
    - If the API call fails, the previous leaderboard snapshot is restored (rollback).
    - Once the request settles, the leaderboard query is invalidated and refetched to ensure the UI matches the backend.

- **Separation of concerns**
  - Hooks: all data-fetching and mutations live under `src/hooks/queries` and `src/hooks/mutations`.
  - Screens: container components under `src/screens` handle navigation, call hooks, and prepare props.
  - Views: presentational components under `src/components/views` render UI only and receive all data/handlers via props.

## Running the frontend

1. Install dependencies (from `frontend/`):

   ```bash
   pnpm install
   ```

2. Configure environment variables:

   - Copy `.env.template` to `.env`.
   - Set `EXPO_PUBLIC_API_BASE_URL` to your backend URL (e.g. `http://localhost:4444/api/v1`).

3. Start the Expo app (from `frontend/`):

   ```bash
   pnpm expo start
   ```

4. Run the backend (from the `backend/` folder, see its README) so the leaderboard and score endpoints are available.

## Scripts

Common `package.json` scripts (run from `frontend/`):

- `pnpm expo start` – start the Expo dev server.
- `pnpm lint` – run ESLint.
- `pnpm test` – run tests (if configured).

## Notes

- Sensitive configuration like API base URLs must be provided via environment variables (never hard-coded).
- Avoid magic values in the codebase; use config/constants under `src/config/` instead.

## Example
https://github.com/user-attachments/assets/86de1541-caac-413d-9253-c6db994a2a9a

https://github.com/user-attachments/assets/24729743-65b4-4156-8651-9d6b666fc9c8






