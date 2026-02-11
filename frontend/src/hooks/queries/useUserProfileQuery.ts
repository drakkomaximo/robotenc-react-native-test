import { useQuery } from "@tanstack/react-query";
import { getUserProfile, type UserProfile } from "@/api/leaderboard";
import { QUERY_STALE_TIMES } from "@/config/queryClient";

const USER_PROFILE_QUERY_KEY_PREFIX = "userProfile" as const;

export function useUserProfileQuery(userId: string) {
  return useQuery<UserProfile>({
    queryKey: [USER_PROFILE_QUERY_KEY_PREFIX, userId],
    queryFn: () => getUserProfile(userId),
    staleTime: QUERY_STALE_TIMES.userProfile,
  });
}
