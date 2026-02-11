import { PropsWithChildren } from "react";
import { Pressable, Text, PressableProps } from "react-native";

type PixelButtonProps = PropsWithChildren<PressableProps> & {
  variant?: "primary" | "secondary";
};

export function PixelButton({
  children,
  variant = "primary",
  ...rest
}: PixelButtonProps) {
  const base =
    "px-4 py-3 items-center justify-center border-2 rounded-none active:translate-x-[2px] active:translate-y-[2px]" as const;
  const stylesByVariant: Record<typeof variant, string> = {
    primary:
      "bg-amber-300 border-amber-600 active:bg-amber-400 active:border-amber-700",
    secondary:
      "bg-sky-800 border-sky-400 active:bg-sky-700 active:border-sky-300",
  };

  return (
    <Pressable
      className={`${base} ${stylesByVariant[variant]} shadow-[4px_4px_0px_#000]`}
      {...rest}
    >
      <Text className="text-black font-bold uppercase tracking-[0.15em] text-xs">
        {children}
      </Text>
    </Pressable>
  );
}
