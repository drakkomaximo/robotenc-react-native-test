import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Title } from "@/components/ui/Typography";
import { getLeaderboard, type LeaderboardEntry } from "@/api/leaderboard";
import { useLeaderboard } from "@/state/LeaderboardContext";

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

  return (
    <Screen>
      <View className="flex-1 p-4 gap-4">
        <View className="flex-row items-center justify-between">
          <Title>Leaderboard</Title>
          <Pressable
            onPress={() => router.push("/submit-score")}
            className="bg-blue-600 px-3 py-2 rounded"
          >
            <Text className="text-white font-bold">Submit</Text>
          </Pressable>
        </View>

        {isLoading && (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator />
            <Text className="mt-2">Loading leaderboard...</Text>
          </View>
        )}

        {!isLoading && error && (
          <View className="items-center justify-center flex-1">
            <Text className="text-red-500 font-bold">Error:</Text>
            <Text className="mt-1 text-center">{error}</Text>
          </View>
        )}

        {!isLoading && !error && entries.length === 0 && (
          <View className="items-center justify-center flex-1">
            <Text>No leaderboard entries.</Text>
          </View>
        )}

        {!isLoading && !error && entries.length > 0 && (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.user_id}
            contentContainerStyle={{ paddingBottom: 16 }}
            refreshing={isRefreshing}
            onRefresh={() => loadLeaderboard({ isRefresh: true })}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/user/[userId]",
                    params: { userId: item.user_id },
                  })
                }
              >
                <View className="flex-row items-center justify-between py-2 border-b border-gray-200">
                  <Text className="w-8 font-bold">#{item.rank}</Text>
                  <View className="flex-1 mx-2">
                    <Text className="font-semibold">{item.username}</Text>
                    <Text className="text-xs text-gray-500">{item.timestamp}</Text>
                  </View>
                  <Text className="font-bold">{item.score}</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </Screen>
  );
}
