import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Title, Body } from "@/components/ui/Typography";
import { PixelCard } from "@/components/ui/PixelCard";
import { PixelButton } from "@/components/ui/PixelButton";
import { getUserProfile, type UserProfile } from "@/api/leaderboard";
import { formatTimestamp } from "@/utils/format";
import { USER_PROFILE_LOAD_ERROR_MESSAGE } from "@/config/messages";

interface UserProfileScreenProps {
  userId: string;
}

export function UserProfileScreen({ userId }: UserProfileScreenProps) {
  const [data, setData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUserProfile(userId);
      setData(result);
    } catch (err) {
      setError(USER_PROFILE_LOAD_ERROR_MESSAGE);
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
        <View className="flex-row items-center justify-between mb-2">
          <PixelButton variant="secondary" onPress={() => router.back()}>
            Back
          </PixelButton>
          <Title>User</Title>
          <View className="w-20" />
        </View>

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
            <PixelCard className="flex-row items-center gap-3">
              {data.avatar_url ? (
                <Image
                  source={{ uri: data.avatar_url }}
                  className="w-14 h-14 shadow-[4px_4px_0px_#000]"
                />
              ) : (
                <View className="w-14 h-14 bg-amber-300 border-2 border-amber-500 shadow-[4px_4px_0px_#000] items-center justify-center">
                  <Text className="text-xl font-extrabold text-black">
                    {data.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1 gap-1">
                <Body className="font-semibold">{data.username}</Body>
                <Text className="text-xs text-slate-400">
                  Member since: {formatTimestamp(data.member_since)}
                </Text>
                <Text className="text-xs text-lime-300 font-semibold">
                  Best score: {data.best_score}
                </Text>
              </View>
            </PixelCard>

            <View className="flex-1 mt-4 gap-2">
              <Title>Scores</Title>
              {data.score_history.length === 0 ? (
                <Body>No score history.</Body>
              ) : (
                <FlatList
                  data={data.score_history}
                  keyExtractor={(_, index) => String(index)}
                  contentContainerStyle={{ paddingBottom: 16 }}
                  renderItem={({ item }) => (
                    <PixelCard className="flex-row justify-between mb-2">
                      <Text className="font-semibold text-emerald-300">
                        {item.score}
                      </Text>
                      <Text className="text-[10px] text-slate-400">
                        {formatTimestamp(item.timestamp)}
                      </Text>
                    </PixelCard>
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
