import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Title } from "@/components/ui/Typography";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import {
  getLeaderboard,
  resetLeaderboard,
  type LeaderboardEntry,
} from "@/api/leaderboard";
import { useLeaderboard } from "@/state/LeaderboardContext";
import { formatTimestamp } from "@/utils/format";
import {
  LEADERBOARD_LOAD_ERROR_MESSAGE,
  RESET_LEADERBOARD_SUCCESS_MESSAGE,
} from "@/config/messages";

export function LeaderboardScreen() {
  const {
    entries,
    isLoading,
    isRefreshing,
    error,
    loadLeaderboard,
  } = useLeaderboard();
  const router = useRouter();

  console.log("[LeaderboardScreen] entries length", entries.length);

  const isFirstLoad = entries.length === 0 && isLoading && !error;

  if (isFirstLoad) {
    // Splash-like screen for the initial leaderboard load.
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-4 gap-4">
          <Title>Punch Leaderboard</Title>
          <ActivityIndicator />
          <Text className="text-slate-100 text-center">
            Warming up the punching bag...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View className="flex-1 p-4 gap-4">
        <View className="flex-row items-center justify-between mb-2">
          <PixelButton
            variant="secondary"
            onPress={async () => {
              if (isLoading) return;
              try {
                await resetLeaderboard();
                loadLeaderboard({ isRefresh: true });
                Alert.alert(
                  "Leaderboard reset",
                  RESET_LEADERBOARD_SUCCESS_MESSAGE
                );
              } catch (e) {
                console.warn("Failed to reset leaderboard", e);
              }
            }}
          >
            Reset
          </PixelButton>
          <Title>Leaderboard</Title>
          <PixelButton onPress={() => router.push("/submit-score")}>
            Submit
          </PixelButton>
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
              onRefresh={() => loadLeaderboard({ isRefresh: true })}
              renderItem={({ item }) => {
                const isCurrentUser = item.user_id === "current_user";
                return (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: "/user/[userId]",
                        params: { userId: item.user_id },
                      })
                    }
                  >
                    <PixelCard
                      className={`flex-row items-center justify-between mb-2 ${isCurrentUser ? "border-lime-300" : ""
                        }`}
                    >
                      <Text className="w-8 font-bold text-amber-300">
                        #{item.rank}
                      </Text>
                      <View className="flex-1 mx-2">
                        <Text className="font-semibold text-slate-50">
                          {item.username}
                        </Text>
                        <Text className="text-[10px] text-slate-400">
                          {formatTimestamp(item.timestamp)}
                        </Text>
                      </View>
                      <View className="items-end gap-1">
                        <Text className="font-bold text-emerald-300">
                          {item.score}
                        </Text>
                        {isCurrentUser && (
                          <View className="px-2 py-1 bg-amber-300 shadow-[2px_2px_0px_#000]">
                            <Text className="text-[10px] font-bold text-black">
                              YOU
                            </Text>
                          </View>
                        )}
                      </View>
                    </PixelCard>
                  </Pressable>
                );
              }}
            />
          )}

          {(isLoading || isRefreshing) && (
            <View className="absolute inset-0 items-center justify-center bg-sky-900/60">
              <ActivityIndicator />
              <Text className="mt-2">Loading leaderboard...</Text>
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}
