import "./global.css";
import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex flex-1 bg-white">
        <Text className="text-center justify-center text-xl font-bold text-red-500">
          Welcome to Nativewind!
        </Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}