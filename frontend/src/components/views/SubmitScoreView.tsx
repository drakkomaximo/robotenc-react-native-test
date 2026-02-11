import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Title, Body } from "@/components/ui/Typography";
import { PixelButton } from "@/components/ui/PixelButton";

interface SubmitScoreViewProps {
  scoreInput: string;
  error: string | null;
  isSubmitting: boolean;
  onChangeScore: (value: string) => void;
  onBackPress: () => void;
  onSubmit: () => void;
}

export function SubmitScoreView({
  scoreInput,
  error,
  isSubmitting,
  onChangeScore,
  onBackPress,
  onSubmit,
}: SubmitScoreViewProps) {
  return (
    <Screen>
      <View className="flex-1 p-4 gap-4">
        <View className="flex-row items-center justify-between mb-2">
          <PixelButton variant="secondary" onPress={onBackPress}>
            Back
          </PixelButton>
          <Title>Submit</Title>
          <View className="w-20" />
        </View>
        <Body>Enter a score between 0 and 999 for the current user.</Body>

        <View className="gap-2 mt-4">
          <Body>Score</Body>
          <TextInput
            value={scoreInput}
            onChangeText={onChangeScore}
            keyboardType="number-pad"
            className="mt-1 px-3 py-2 bg-slate-900 border-2 border-slate-500 text-slate-50"
            placeholder="Enter your score"
            placeholderTextColor="#64748b"
            editable={!isSubmitting}
          />
        </View>

        {error && (
          <Text className="text-red-400 mt-2">{error}</Text>
        )}

        <View className="mt-4">
          {isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <PixelButton onPress={onSubmit}>Submit</PixelButton>
          )}
        </View>
      </View>
    </Screen>
  );
}
