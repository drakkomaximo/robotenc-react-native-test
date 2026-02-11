import { useState } from "react";
import { Alert, Text, TextInput, View, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Title, Body } from "@/components/ui/Typography";
import { submitScore } from "@/api/leaderboard";
import { useLeaderboard } from "@/state/LeaderboardContext";

export function SubmitScoreScreen() {
  const [scoreInput, setScoreInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { applyOptimisticScore, rollbackLeaderboard, applyServerScoreUpdate } =
    useLeaderboard();
  const router = useRouter();

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

    setError(null);
    setIsSubmitting(true);

    // Optimistic update: apply locally before calling API.
    const previousEntries = applyOptimisticScore(score);

    try {
      const response = await submitScore(score);
      applyServerScoreUpdate(response);

      // Navigate back to the leaderboard after success.
      router.replace("/");
    } catch (err) {
      // Rollback optimistic update if API fails.
      rollbackLeaderboard(previousEntries);
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      Alert.alert("Submit failed", message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <View className="flex-1 p-4 gap-4">
        <Title>Submit Score</Title>
        <Body>Enter a score between 0 and 999 for the current user.</Body>

        <View className="gap-2 mt-4">
          <Text className="font-semibold">Score</Text>
          <TextInput
            className="border border-gray-300 rounded px-3 py-2"
            keyboardType="numeric"
            value={scoreInput}
            onChangeText={setScoreInput}
            maxLength={3}
          />
        </View>

        {error && (
          <Text className="text-red-500 mt-2">{error}</Text>
        )}

        <View className="mt-4">
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 rounded px-4 py-3 items-center justify-center"
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold">Submit</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
