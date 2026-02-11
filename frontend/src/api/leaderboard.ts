import { httpClient } from "@/api/httpClient";

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  score: number;
  rank: number;
  timestamp: string;
  avatar_url: string;
}

export interface UserProfile {
  user_id: string;
  username: string;
  avatar_url: string;
  best_score: number;
  total_punches: number;
  member_since: string;
  score_history: Array<{
    score: number;
    timestamp: string;
  }>;
}

export interface SubmitScoreResponse {
  success: boolean;
  new_rank: number;
  timestamp: string;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return httpClient.get<LeaderboardEntry[]>("/leaderboard");
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile> {
  return httpClient.get<UserProfile>(`/users/${userId}`);
}

export async function submitScore(
  score: number
): Promise<SubmitScoreResponse> {
  return httpClient.post<SubmitScoreResponse>("/scores", { score });
}

export async function resetLeaderboard(): Promise<{ success: boolean }> {
  return httpClient.post<{ success: boolean }>("/reset");
}
