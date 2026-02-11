import { PropsWithChildren } from "react";
import { Text, TextProps } from "react-native";

export function Title({ children, ...rest }: PropsWithChildren<TextProps>) {
  return (
    <Text
      className="text-xl font-bold text-red-500 text-center"
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Body({ children, ...rest }: PropsWithChildren<TextProps>) {
  return (
    <Text className="text-base text-black" {...rest}>
      {children}
    </Text>
  );
}
