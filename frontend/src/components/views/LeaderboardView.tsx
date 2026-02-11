import { FlatList, Text, View, Pressable } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Title, Body } from "@/components/ui/Typography";
import { PixelButton } from "@/components/ui/PixelButton";
import { PixelCard } from "@/components/ui/PixelCard";
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
}: LeaderboardViewProps) {
  const hasEntries = entries.length > 0;

  const renderEntry = ({ item }: { item: LeaderboardEntry }) => {
    const isCurrentUser = item.user_id === "current_user";

    return (
      <Pressable onPress={() => onPressEntry(item.user_id)}>
        <PixelCard
          className={`flex-row items-center justify-between mb-2 ${
            isCurrentUser ? "border-lime-300" : ""
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
              <View className="px-2 py-1 bg-amber-300 shadow-[4px_4px_0px_#000]">
                <Text className="text-[10px] font-bold text-black">YOU</Text>
              </View>
            )}
          </View>
        </PixelCard>
      </Pressable>
    );
  };

  return (
    <Screen>
      <View className="flex-1 p-4 gap-4">
        <View className="gap-1 mb-2">
          <View className="flex-row items-center justify-between">
            <PixelButton variant="secondary" onPress={onResetPress}>
              Reset
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

          {!error && !hasEntries && !isLoading && !isRefreshing && (
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
        </View>
      </View>
    </Screen>
  );
}
