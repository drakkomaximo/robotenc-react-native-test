import { useState } from "react";
import { Alert, Text, TextInput, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { Title, Body } from "@/components/ui/Typography";
import { PixelButton } from "@/components/ui/PixelButton";
import { SUBMIT_SCORE_GENERIC_ERROR_MESSAGE } from "@/config/messages";
import { useSubmitScoreMutation } from "@/hooks/mutations/useSubmitScoreMutation";

export function SubmitScoreScreen() {
  const [scoreInput, setScoreInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMutation = useSubmitScoreMutation();
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

    try {
      setError(null);
      setIsSubmitting(true);

      await submitMutation.mutateAsync(score);

      Alert.alert("Score updated", "Your new score has been submitted!");

      // Navigate back to the leaderboard after success.
      router.replace("/");
    } catch (err) {
      setError(SUBMIT_SCORE_GENERIC_ERROR_MESSAGE);
      Alert.alert("Submit failed", SUBMIT_SCORE_GENERIC_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <View className="flex-1 p-4 gap-4">
        <View className="flex-row items-center justify-between mb-2">
          <PixelButton variant="secondary" onPress={() => router.back()}>
            Back
          </PixelButton>
          <Title>Submit</Title>
          <View className="w-20" />
        </View>
        <Body>Enter a score between 0 and 999 for the current user.</Body>

        <View className="gap-2 mt-4">
          <Text className="font-semibold">Score</Text>
          <TextInput
            className="border border-lime-500 bg-slate-950 text-lime-100 px-3 py-2 shadow-[4px_4px_0px_#000]"
            keyboardType="numeric"
            value={scoreInput}
            onChangeText={setScoreInput}
            maxLength={3}
          />
        </View>

        {error && (
          <Text className="text-red-400 mt-2">
            Your punch was not registered. Please check your score and try
            again.
          </Text>
        )}

        <View className="mt-4">
          {isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <PixelButton onPress={handleSubmit}>Submit</PixelButton>
          )}
        </View>
      </View>
    </Screen>
  );
}
