import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Title, Body } from "@/components/ui/Typography";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { LoadingSplash } from "@/components/ui/LoadingSplash";
import { type LeaderboardEntry } from "@/api/leaderboard";
import { useLeaderboardQuery } from "@/hooks/queries/useLeaderboardQuery";
import { useResetLeaderboardMutation } from "@/hooks/mutations/useResetLeaderboardMutation";
import { formatTimestamp } from "@/utils/format";
import {
  LEADERBOARD_LOAD_ERROR_MESSAGE,
  RESET_LEADERBOARD_SUCCESS_MESSAGE,
  LEADERBOARD_SPLASH_TITLE,
  LEADERBOARD_LOADING_MESSAGE,
  LEADERBOARD_SUBTITLE_MESSAGE,
} from "@/config/messages";

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

  const renderEntry = ({ item }: { item: LeaderboardEntry }) => {
    const isCurrentUser = item.user_id === "current_user";

    return (
      <Pressable onPress={() => handlePressEntry(item.user_id)}>
        <PixelCard
          className={`flex-row items-center justify-between mb-2 ${isCurrentUser ? "border-lime-300" : ""
            }`}
        >
          <Text className="w-8 font-bold text-amber-300">#{item.rank}</Text>
          <View className="flex-1 mx-2">
            <Text className="font-semibold text-slate-50">
              {item.username}
            </Text>
            <Text className="text-[10px] text-slate-400">
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
          <View className="items-end gap-1">
            <Text className="font-bold text-emerald-300">{item.score}</Text>
            {isCurrentUser && (
              <View className="px-2 py-1 bg-amber-300 shadow-[2px_2px_0px_#000]">
                <Text className="text-[10px] font-bold text-black">YOU</Text>
              </View>
            )}
          </View>
        </PixelCard>
      </Pressable>
    );
  };

  return (
    shouldShowSplash ? (
      <LoadingSplash
        title={LEADERBOARD_SPLASH_TITLE}
        message={LEADERBOARD_LOADING_MESSAGE}
      />
    ) : (
      <Screen>
        <View className="flex-1 p-4 gap-4">
          <View className="gap-1 mb-2">
            <View className="flex-row items-center justify-between">
              <PixelButton
                variant="secondary"
                onPress={handleResetPress}
              >
                Reset
              </PixelButton>
              <Title>Leaderboard</Title>
              <PixelButton onPress={handleSubmitScorePress}>
                Score
              </PixelButton>
            </View>
            <Body className="text-[10px] text-slate-300 text-center">
              {LEADERBOARD_SUBTITLE_MESSAGE}
            </Body>
          </View>

          <View className="flex-1 relative">
            {error && (
              <View className="items-center justify-center flex-1">
                <Text className="text-red-400 font-bold text-center">
                  {LEADERBOARD_LOAD_ERROR_MESSAGE}
                </Text>
              </View>
            )}

            {!error && entries.length === 0 && !isLoading && !isRefreshing && (
              <View className="items-center justify-center flex-1">
                <Text>No leaderboard entries.</Text>
              </View>
            )}

            {!error && entries.length > 0 && (
              <FlatList
                data={entries}
                keyExtractor={(item) => item.user_id}
                contentContainerStyle={{ paddingBottom: 16 }}
                refreshing={isRefreshing}
                onRefresh={() => refetchLeaderboard()}
                renderItem={renderEntry}
              />
            )}
          </View>
        </View>
      </Screen>
    )
  );
}
