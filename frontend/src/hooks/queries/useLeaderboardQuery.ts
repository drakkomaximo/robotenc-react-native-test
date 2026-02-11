import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLeaderboard, type LeaderboardEntry } from "@/api/leaderboard";
import { QUERY_STALE_TIMES } from "@/config/queryClient";

export const LEADERBOARD_QUERY_KEY = ["leaderboard"] as const;

export function useLeaderboardQuery() {
  const queryClient = useQueryClient();

  const query = useQuery<LeaderboardEntry[]>({
    queryKey: LEADERBOARD_QUERY_KEY,
    queryFn: () => getLeaderboard(),
    staleTime: QUERY_STALE_TIMES.leaderboard,
  });

  return {
    ...query,
    refetchLeaderboard: () =>
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY }),
  };
}
