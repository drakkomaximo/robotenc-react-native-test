import { ActivityIndicator, FlatList, Text, View, Pressable, Image } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Title, Body } from "@/components/ui/Typography";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
import { FadeInView } from "@/components/ui/FadeInView";
import { NotificationOverlay, NotificationVariant } from "@/components/ui/NotificationOverlay";
import { type LeaderboardEntry } from "@/api/leaderboard";
import { formatTimestamp } from "@/utils/format";
import {
  LEADERBOARD_LOAD_ERROR_MESSAGE,
  LEADERBOARD_SUBTITLE_MESSAGE,
} from "@/config/messages";

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  onResetPress: () => void;
  onSubmitScorePress: () => void;
  onPressEntry: (userId: string) => void;
  onRefresh: () => void;
  notification?: {
    title: string;
    message: string;
    variant?: NotificationVariant;
    withConfetti?: boolean;
  } | null;
  onNotificationClose?: () => void;
  isResetting?: boolean;
}

export function LeaderboardView({
  entries,
  isLoading,
  isRefreshing,
  error,
  onResetPress,
  onSubmitScorePress,
  onPressEntry,
  onRefresh,
  notification,
  onNotificationClose,
  isResetting = false,
}: LeaderboardViewProps) {
  const hasEntries = entries.length > 0;

  const renderEntry = ({ item }: { item: LeaderboardEntry }) => {
    const isCurrentUser = item.user_id === "current_user";

    return (
      <FadeInView>
        <Pressable onPress={() => onPressEntry(item.user_id)}>
          <PixelCard
            className={`flex-row items-center justify-between mb-2 ${isCurrentUser ? "border-lime-300" : ""
              }`}
          >
            <Text className="w-8 font-bold text-amber-300">#{item.rank}</Text>
            {item.avatar_url ? (
              <Image
                source={{ uri: item.avatar_url }}
                className="w-8 h-8 mr-2 shadow-[3px_3px_0px_#000]"
              />
            ) : (
              <View className="w-8 h-8 mr-2 bg-amber-300 border-2 border-amber-500 shadow-[3px_3px_0px_#000] items-center justify-center">
                <Text className="text-xs font-extrabold text-black">
                  {item.username.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View className="flex-1 mx-1">
              <Text className="font-semibold text-slate-50" numberOfLines={1}>
                {item.username}
              </Text>
              <Text className="text-[10px] text-slate-400">
                {formatTimestamp(item.timestamp)}
              </Text>
            </View>
            <View className="items-end gap-1">
              <Text className="font-bold text-emerald-300">{item.score}</Text>
              {isCurrentUser && (
                <View className="px-2 py-1 bg-amber-300 shadow-[4px_4px_0px_#000]">
                  <Text className="text-[10px] font-bold text-black">YOU</Text>
                </View>
              )}
            </View>
          </PixelCard>
        </Pressable>
      </FadeInView>
    );
  };

  return (
    <Screen>
      <View className="flex-1 p-4 gap-4">
        <View className="gap-1 mb-2">
          <View className="flex-row items-center justify-between">
            <PixelButton variant="secondary" onPress={onResetPress}>
              {isResetting ? (
                <ActivityIndicator />
              ) : (
                "Reset"
              )}
            </PixelButton>
            <Title>Leaderboard</Title>
            <PixelButton onPress={onSubmitScorePress}>Score</PixelButton>
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

          {!error && isLoading && !hasEntries && (
            <View className="items-center justify-center flex-1 gap-3">
              <ActivityIndicator />
              <Text className="text-slate-100">Loading leaderboard...</Text>
            </View>
          )}

          {!error && !isLoading && !hasEntries && !isRefreshing && (
            <View className="items-center justify-center flex-1">
              <Text>No leaderboard entries.</Text>
            </View>
          )}

          {!error && hasEntries && (
            <FlatList
              data={entries}
              keyExtractor={(item) => item.user_id}
              contentContainerStyle={{ paddingBottom: 16 }}
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              renderItem={renderEntry}
            />
          )}

          <NotificationOverlay
            visible={!!notification}
            title={notification?.title ?? ""}
            message={notification?.message ?? ""}
            variant={notification?.variant}
            withConfetti={notification?.withConfetti}
            onAutoClose={onNotificationClose}
          />
        </View>
      </View>
    </Screen>
  );
}
