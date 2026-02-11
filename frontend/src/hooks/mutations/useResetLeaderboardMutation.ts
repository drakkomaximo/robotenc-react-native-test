import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetLeaderboard } from "@/api/leaderboard";
import { LEADERBOARD_QUERY_KEY } from "@/hooks/queries/useLeaderboardQuery";

export function useResetLeaderboardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetLeaderboard,
    onSuccess() {
      queryClient.removeQueries({ queryKey: LEADERBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY });
    },
  });
}
