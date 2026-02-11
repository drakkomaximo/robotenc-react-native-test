import { useLocalSearchParams } from "expo-router";
import { UserProfileScreen } from "@/screens/UserProfileScreen";

export default function UserProfileRoute() {
  const params = useLocalSearchParams<{ userId?: string }>();
  const userId = params.userId ?? "";

  return <UserProfileScreen userId={userId} />;
}
