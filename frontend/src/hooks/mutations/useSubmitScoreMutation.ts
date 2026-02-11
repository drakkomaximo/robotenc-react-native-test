import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitScore, type LeaderboardEntry } from "@/api/leaderboard";
import { LEADERBOARD_QUERY_KEY } from "@/hooks/queries/useLeaderboardQuery";

export function useSubmitScoreMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitScore,
    async onMutate(score: number) {
      await queryClient.cancelQueries({ queryKey: LEADERBOARD_QUERY_KEY });

      const previousEntries =
        queryClient.getQueryData<LeaderboardEntry[]>(LEADERBOARD_QUERY_KEY) ?? [];

      const updated = [...previousEntries];
      const currentIndex = updated.findIndex(
        (e) => e.user_id === "current_user"
      );

      if (currentIndex !== -1) {
        const now = new Date().toISOString();
        updated[currentIndex] = {
          ...updated[currentIndex],
          score,
          timestamp: now,
        };

        updated.sort((a, b) => b.score - a.score);
        updated.forEach((entry, index) => {
          entry.rank = index + 1;
        });

        queryClient.setQueryData(LEADERBOARD_QUERY_KEY, updated);
      }

      return { previousEntries };
    },
    onError(_error, _variables, context) {
      if (context?.previousEntries) {
        queryClient.setQueryData(LEADERBOARD_QUERY_KEY, context.previousEntries);
      }
    },
    onSettled() {
      queryClient.removeQueries({ queryKey: LEADERBOARD_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: LEADERBOARD_QUERY_KEY });
    },
  });
}
