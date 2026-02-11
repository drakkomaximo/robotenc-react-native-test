import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { SUBMIT_SCORE_GENERIC_ERROR_MESSAGE } from "@/config/messages";
import { useSubmitScoreMutation } from "@/hooks/mutations/useSubmitScoreMutation";
import { SubmitScoreView } from "@/components/views/SubmitScoreView";

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

  function handleBackPress() {
    router.back();
  }

  return (
    <SubmitScoreView
      scoreInput={scoreInput}
      error={error}
      isSubmitting={isSubmitting}
      onChangeScore={setScoreInput}
      onBackPress={handleBackPress}
      onSubmit={handleSubmit}
    />
  );
}
