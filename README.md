# React Native Leaderboard App - Take-Home Exercise

**Time limit: 2-3 hours max**

## The Challenge

Build a polished leaderboard app with user profiles and score submission.

## Requirements

**Tech Stack:** Expo + TypeScript

**Screens:**

1. **Leaderboard Screen**

   - Display top 50 scores (rank, avatar placeholder, username, score, timestamp)
   - Tap any user → navigate to their profile
   - Pull to refresh
   - Loading, empty, and error states

2. **User Profile Screen**

   - Receives `user_id` from navigation
   - Shows user stats: best score, total punches, member since
   - Shows their score history (last 10 scores)
   - Loading and error states

3. **Submit Score Screen**
   - Numeric input (0-999) with validation
   - Submit button with loading state
   - **Optimistic update**: On submit, immediately update leaderboard and navigate to it
   - Show error toast/message if API fails
   - On success, highlight user's new position
   - _Bonus_: Revert leaderboard to previous state on failure

**Technical Requirements:**

- **Shared State**: Leaderboard data must be shared between screens (your choice: Context, Zustand, Redux, etc.)
- **Clean Architecture**: Separation of concerns—hooks, components, screens
- **Polished UI**: This is user-facing. We expect attention to spacing, typography, and visual feedback.
- **README** with setup instructions and architectural decisions

## API Endpoints

A backend server is provided in the `/backend` directory. It has built-in network delays and will randomly fail ~10% of the time. Your job is to handle all states correctly.

**Base URL:** `http://localhost:4444`

| Method | Endpoint                | Description                                                |
| ------ | ----------------------- | ---------------------------------------------------------- |
| GET    | `/api/v1/leaderboard`   | Returns array of 50 leaderboard entries                    |
| GET    | `/api/v1/users/:userId` | Returns user profile with score history                    |
| POST   | `/api/v1/scores`        | Submit score `{ score: number }` (always for current user) |
| POST   | `/api/v1/reset`         | Reset leaderboard to initial state                         |

**Response Types:**

```typescript
interface LeaderboardEntry {
  user_id: string;
  username: string;
  score: number;
  rank: number;
  timestamp: string;
  avatar_url: string;
}

interface UserProfile {
  user_id: string;
  username: string;
  avatar_url: string;
  best_score: number;
  total_punches: number;
  member_since: string;
  score_history: { score: number; timestamp: string }[];
}

interface SubmitScoreResponse {
  success: boolean;
  new_rank: number;
  timestamp: string;
}
```

The current user's ID is `"current_user"`.

## What We're Looking For

- **UI/UX Quality**: Polished interface with proper visual feedback and attention to detail
- **Architecture**: Clean separation—state management, hooks, components, screens
- **State Management**: Shared state between screens, optimistic updates
- **All States Handled**: Loading, error, empty states on every screen
- **TypeScript**: Proper typing throughout
- **Navigation**: Correct param passing, navigation on actions
- **Code Quality**: Readable, maintainable, production-ready

## Submission Instructions

1. Clone this repository (do NOT fork)
2. Create a private repository on your GitHub account
3. Push your solution there
4. Add **@admin-robotenc** as a collaborator
5. Email the repo link to **careers@robotenc.com**

We will test by running:

```bash
# Terminal 1 - Start backend
cd backend
npm install
npm start

# Terminal 2 - Start app
npm install
npx expo start
```

**Deadline:** 6 days from receipt

**Questions?** Email careers@robotenc.com - we're happy to clarify requirements.
