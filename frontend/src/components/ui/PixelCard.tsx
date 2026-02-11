import { PropsWithChildren } from "react";
import { View, ViewProps } from "react-native";

type PixelCardProps = PropsWithChildren<ViewProps>;

export function PixelCard({ children, className, ...rest }: PixelCardProps) {
  return (
    <View
      className={`bg-sky-800 border-2 border-amber-300 shadow-[4px_4px_0px_#000] px-3 py-2 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </View>
  );
}
