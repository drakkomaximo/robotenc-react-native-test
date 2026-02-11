import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Title, Body } from "@/components/ui/Typography";
import { getUserProfile, type UserProfile } from "@/api/leaderboard";

interface UserProfileScreenProps {
  userId: string;
}

export function UserProfileScreen({ userId }: UserProfileScreenProps) {
  const [data, setData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUserProfile(userId);
      setData(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [userId]);

  return (
    <Screen>
      <View className="flex-1 p-4 gap-4">
        <Title>User Profile</Title>
        <Body>User ID: {userId}</Body>

        {isLoading && (
          <View className="items-center justify-center flex-1">
            <ActivityIndicator />
            <Text className="mt-2">Loading user profile...</Text>
          </View>
        )}

        {!isLoading && error && (
          <View className="items-center justify-center flex-1">
            <Text className="text-red-500 font-bold">Error:</Text>
            <Text className="mt-1 text-center">{error}</Text>
          </View>
        )}

        {!isLoading && !error && data && (
          <View className="gap-4 flex-1">
            <View className="gap-1">
              <Body>Username: {data.username}</Body>
              <Body>Best score: {data.best_score}</Body>
              <Body>Total punches: {data.total_punches}</Body>
              <Body>Member since: {data.member_since}</Body>
            </View>

            <View className="flex-1 mt-4">
              <Title>Score History</Title>
              {data.score_history.length === 0 ? (
                <Body>No score history.</Body>
              ) : (
                <FlatList
                  data={data.score_history}
                  keyExtractor={(_, index) => String(index)}
                  contentContainerStyle={{ paddingBottom: 16 }}
                  renderItem={({ item }) => (
                    <View className="flex-row justify-between py-2 border-b border-gray-200">
                      <Text className="font-semibold">{item.score}</Text>
                      <Text className="text-xs text-gray-500">{item.timestamp}</Text>
                    </View>
                  )}
                />
              )}
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}
