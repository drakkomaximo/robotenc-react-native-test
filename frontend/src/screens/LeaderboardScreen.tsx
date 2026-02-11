import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { LoadingSplash } from "@/components/ui/LoadingSplash";
import { useLeaderboardQuery } from "@/hooks/queries/useLeaderboardQuery";
import { useResetLeaderboardMutation } from "@/hooks/mutations/useResetLeaderboardMutation";
import {
  RESET_LEADERBOARD_SUCCESS_MESSAGE,
  LEADERBOARD_SPLASH_TITLE,
  LEADERBOARD_LOADING_MESSAGE,
} from "@/config/messages";
import { LeaderboardView } from "@/components/views/LeaderboardView";

export function LeaderboardScreen() {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch: refetchLeaderboard,
  } = useLeaderboardQuery();
  const entries = data ?? [];
  const isRefreshing = !isLoading && isFetching;
  const resetMutation = useResetLeaderboardMutation();
  const router = useRouter();

  const shouldShowSplash = !error && (isLoading || isFetching);

  async function handleResetPress() {
    if (isLoading || resetMutation.isPending) return;

    try {
      await resetMutation.mutateAsync();
      Alert.alert("Leaderboard reset", RESET_LEADERBOARD_SUCCESS_MESSAGE);
    } catch (e) {
      console.warn("Failed to reset leaderboard", e);
    }
  }

  function handleSubmitScorePress() {
    router.push("/submit-score");
  }

  function handlePressEntry(userId: string) {
    router.push({
      pathname: "/user/[userId]",
      params: { userId },
    });
  }

  if (shouldShowSplash) {
    return (
      <LoadingSplash
        title={LEADERBOARD_SPLASH_TITLE}
        message={LEADERBOARD_LOADING_MESSAGE}
      />
    );
  }

  return (
    <LeaderboardView
      entries={entries}
      isLoading={isLoading}
      isRefreshing={isRefreshing}
      error={error as Error | null}
      onResetPress={handleResetPress}
      onSubmitScorePress={handleSubmitScorePress}
      onPressEntry={handlePressEntry}
      onRefresh={refetchLeaderboard}
    />
  );
}
