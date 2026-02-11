import { useRouter } from "expo-router";
import { useUserProfileQuery } from "@/hooks/queries/useUserProfileQuery";
import { LoadingSplash } from "@/components/ui/LoadingSplash";
import {
  USER_PROFILE_SPLASH_TITLE,
  USER_PROFILE_LOADING_MESSAGE,
} from "@/config/messages";
import { UserProfileView } from "@/components/views/UserProfileView";

interface UserProfileScreenProps {
  userId: string;
}

export function UserProfileScreen({ userId }: UserProfileScreenProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useUserProfileQuery(userId);
  const hasData = !!data;

  function handleBackPress() {
    router.back();
  }

  if (isLoading && !hasData && !isError) {
    return (
      <LoadingSplash
        title={USER_PROFILE_SPLASH_TITLE}
        message={USER_PROFILE_LOADING_MESSAGE}
      />
    );
  }

  return (
    <UserProfileView
      profile={hasData ? data! : null}
      isError={isError}
      isLoading={isLoading}
      onBackPress={handleBackPress}
    />
  );
}
