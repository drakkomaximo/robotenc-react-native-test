import { useState } from "react";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { SUBMIT_SCORE_GENERIC_ERROR_MESSAGE } from "@/config/messages";
import { useSubmitScoreMutation } from "@/hooks/mutations/useSubmitScoreMutation";
import { SubmitScoreView } from "@/components/views/SubmitScoreView";
import { LEADERBOARD_QUERY_KEY } from "@/hooks/queries/useLeaderboardQuery";
import type { LeaderboardEntry } from "@/api/leaderboard";

export function SubmitScoreScreen() {
  const [scoreInput, setScoreInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMutation = useSubmitScoreMutation();
  const router = useRouter();
  const queryClient = useQueryClient();

  function parseScore(value: string): number | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed)) return null;
    const intVal = Math.floor(parsed);
    if (intVal < 0 || intVal > 999) return null;
    return intVal;
  }

  async function handleSubmit() {
    const score = parseScore(scoreInput);

    if (score === null) {
      setError("Score must be an integer between 0 and 999.");
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);

      const previousEntries =
        queryClient.getQueryData<LeaderboardEntry[]>(LEADERBOARD_QUERY_KEY) ?? [];
      const previousCurrentUser = previousEntries.find(
        (e) => e.user_id === "current_user"
      );

      const submitResult = await submitMutation.mutateAsync(score);

      let prevRankParam: number | null = null;
      let newRankParam: number | null = null;
      let usernameParam: string | null = null;

      if (previousCurrentUser) {
        prevRankParam = previousCurrentUser.rank;
        usernameParam = previousCurrentUser.username;
      }

      if (submitResult && submitResult.new_rank != null) {
        newRankParam = submitResult.new_rank;
      }

      if (prevRankParam != null && newRankParam != null && usernameParam) {
        router.replace({
          pathname: "/",
          params: {
            scoreUpdated: "1",
            username: usernameParam,
            prevRank: String(prevRankParam),
            newRank: String(newRankParam),
          },
        });
      } else {
        router.replace("/");
      }
    } catch (err) {
      setError(SUBMIT_SCORE_GENERIC_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBackPress() {
    router.back();
  }

  return (
    <SubmitScoreView
      scoreInput={scoreInput}
      error={error}
      isSubmitting={isSubmitting}
      onChangeScore={setScoreInput}
      onBackPress={handleBackPress}
      onSubmit={handleSubmit}
    />
  );
}
