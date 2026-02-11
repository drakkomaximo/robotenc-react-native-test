import { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLeaderboardQuery } from "@/hooks/queries/useLeaderboardQuery";
import { useResetLeaderboardMutation } from "@/hooks/mutations/useResetLeaderboardMutation";
import { LoadingSplash } from "@/components/ui/LoadingSplash";
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
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    variant?: "success" | "error";
    withConfetti?: boolean;
  } | null>(null);
  const [handledScoreUpdate, setHandledScoreUpdate] = useState(false);

  const params = useLocalSearchParams<{
    scoreUpdated?: string;
    username?: string;
    prevRank?: string;
    newRank?: string;
  }>();

  const shouldShowSplash = !error && isLoading && !data;

  useEffect(() => {
    setHandledScoreUpdate(false);
  }, [params.scoreUpdated]);

  useEffect(() => {
    if (!params.scoreUpdated || handledScoreUpdate) return;

    if (isLoading || entries.length === 0) return;

    const prevRank = params.prevRank ? Number(params.prevRank) : null;
    const newRank = params.newRank ? Number(params.newRank) : null;
    const username = params.username;

    // Si no tenemos datos suficientes para calcular cambio de rango,
    // mostramos al menos una notificación genérica de éxito.
    if (prevRank == null || newRank == null || !username) {
      setNotification({
        title: "Score updated",
        message: "Your new score has been submitted!",
        variant: "success",
        withConfetti: false,
      });
      setHandledScoreUpdate(true);
      return;
    }

    const diff = prevRank - newRank;

    let message: string;
    if (diff > 0) {
      message = `${username}, you climbed ${diff} place${diff === 1 ? "" : "s"
        } on the leaderboard. Great job!`;
    } else if (diff < 0) {
      const down = Math.abs(diff);
      message = `${username}, you dropped ${down} place${down === 1 ? "" : "s"
        }. Keep pushing to get back up!`;
    } else {
      message = `${username}, your rank stays the same for now. Keep going!`;
    }

    setNotification({
      title: "Score updated",
      message,
      variant: diff < 0 ? "error" : "success",
      withConfetti: diff > 0,
    });
    setHandledScoreUpdate(true);
  }, [params, handledScoreUpdate, isLoading, entries.length]);

  useEffect(() => {
    if (!error || notification) return;
    if (isLoading && !data) return;

    setNotification({
      title: "Connection issue",
      message: "Could not load the leaderboard. Check your internet connection and try again.",
      variant: "error",
    });
  }, [error, notification, isLoading, data]);

  async function handleResetPress() {
    if (isLoading || resetMutation.isPending) return;

    try {
      await resetMutation.mutateAsync();
      setNotification({
        title: "Leaderboard reset",
        message: RESET_LEADERBOARD_SUCCESS_MESSAGE,
        variant: "success",
      });
    } catch (e) {
      setNotification({
        title: "Reset failed",
        message: "Could not reset the leaderboard. Please try again.",
        variant: "error",
      });
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
      notification={notification}
      onNotificationClose={() => setNotification(null)}
    />
  );
}
