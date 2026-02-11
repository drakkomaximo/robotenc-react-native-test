import { PropsWithChildren, useEffect, useRef } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export type NotificationVariant = "success" | "error";

export interface NotificationOverlayProps extends PropsWithChildren {
  visible: boolean;
  title: string;
  message: string;
  variant?: NotificationVariant;
  withConfetti?: boolean;
  onAutoClose?: () => void;
  autoCloseMs?: number;
}

export function NotificationOverlay({
  visible,
  title,
  message,
  variant = "success",
  withConfetti = false,
  onAutoClose,
  autoCloseMs = 2000,
}: NotificationOverlayProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (!onAutoClose) return;

    const id = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        onAutoClose();
      });
    }, autoCloseMs);

    return () => {
      clearTimeout(id);
    };
  }, [visible, onAutoClose, autoCloseMs, opacity]);

  if (!visible) return null;

  const borderColor = variant === "success" ? "border-lime-300" : "border-red-400";
  const titleColor = variant === "success" ? "text-lime-200" : "text-red-200";
  const { width } = Dimensions.get("window");

  return (
    <View className="absolute inset-0 items-center justify-center pointer-events-none">
      {withConfetti && (
        <ConfettiCannon
          count={80}
          origin={{ x: width / 2, y: 0 }}
          fadeOut
          autoStart
        />
      )}
      <Animated.View
        style={{ opacity }}
        className={`px-6 py-4 bg-sky-900/95 ${borderColor} border-2 shadow-[6px_6px_0px_#000] max-w-xs w-[80%] items-center gap-2`}
      >
        <Text className={`font-extrabold text-sm ${titleColor}`}>{title}</Text>
        <Text className="text-xs text-slate-100 text-center">{message}</Text>
      </Animated.View>
    </View>
  );
}
