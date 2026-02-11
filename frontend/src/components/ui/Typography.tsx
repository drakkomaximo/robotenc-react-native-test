import { PropsWithChildren } from "react";
import { Text, TextProps } from "react-native";

export function Title({ children, ...rest }: PropsWithChildren<TextProps>) {
  return (
    <Text
      className="text-xl font-extrabold text-amber-200 tracking-[0.2em] uppercase text-center"
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Body({ children, ...rest }: PropsWithChildren<TextProps>) {
  return (
    <Text className="text-sm text-slate-100" {...rest}>
      {children}
    </Text>
  );
}
