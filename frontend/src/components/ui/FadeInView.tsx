import { useEffect, useRef } from "react";
import { Animated, ViewProps } from "react-native";
import { PropsWithChildren } from "react";
import { ANIMATION_DURATIONS } from "@/config/animation";

interface FadeInViewProps extends PropsWithChildren<ViewProps> {
  durationMs?: number;
}

export function FadeInView({
  children,
  style,
  durationMs = ANIMATION_DURATIONS.fadeIn,
  ...rest
}: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: durationMs,
      useNativeDriver: true,
    }).start();
  }, [opacity, durationMs]);

  return (
    <Animated.View style={[style, { opacity }]} {...rest}>
      {children}
    </Animated.View>
  );
}
