import { PropsWithChildren } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Title } from "@/components/ui/Typography";

interface LoadingSplashProps extends PropsWithChildren {
  title: string;
  message: string;
}

export function LoadingSplash({ title, message }: LoadingSplashProps) {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center p-4 gap-4">
        <Title>{title}</Title>
        <ActivityIndicator />
        <Text className="text-slate-100 text-center">{message}</Text>
      </View>
    </Screen>
  );
}
