import { QueryClient } from "@tanstack/react-query";

export const QUERY_STALE_TIMES = {
  leaderboard: 60_000,
  userProfile: 60_000,
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIMES.leaderboard,
      refetchOnWindowFocus: true,
    },
  },
});
