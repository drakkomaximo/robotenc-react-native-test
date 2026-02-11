import { PropsWithChildren } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { Title, Body } from "@/components/ui/Typography";

interface LoadingSplashProps extends PropsWithChildren {
  title: string;
  message: string;
}

export function LoadingSplash({ title, message }: LoadingSplashProps) {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full max-w-sm items-center gap-4 bg-sky-800/90 border-2 border-amber-300 px-6 py-8 shadow-[6px_6px_0px_#000]">
          <Title>{title}</Title>
          <ActivityIndicator size="large" />
          <Body className="text-center text-slate-100 text-xs">{message}</Body>
        </View>
      </View>
    </Screen>
  );
}
