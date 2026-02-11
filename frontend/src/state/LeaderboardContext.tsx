import { createContext, useContext, useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  getLeaderboard,
  type LeaderboardEntry,
  type SubmitScoreResponse,
} from "@/api/leaderboard";
import { LEADERBOARD_LOAD_ERROR_MESSAGE } from "@/config/messages";
import { useLeaderboardQuery } from "@/hooks/queries/useLeaderboardQuery";


interface LeaderboardState {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  // TanStack Query–like derived fields (for future migration)
  data: LeaderboardEntry[];
  isFetching: boolean;
  isError: boolean;
}

interface LeaderboardContextValue extends LeaderboardState {
  loadLeaderboard: (options?: { isRefresh?: boolean }) => Promise<void>;
  applyOptimisticScore: (score: number) => LeaderboardEntry[];
  rollbackLeaderboard: (previous: LeaderboardEntry[]) => void;
}

const LeaderboardContext = createContext<LeaderboardContextValue | undefined>(
  undefined
);

export function LeaderboardProvider({ children }: PropsWithChildren) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Note: we don't rely directly on this query's state yet, but it shows
  // how the provider could delegate data fetching to TanStack Query.
  useLeaderboardQuery();

  async function loadLeaderboard(options?: { isRefresh?: boolean }) {
    const isRefresh = options?.isRefresh ?? false;

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const data = await getLeaderboard();
      setEntries(data);
    } catch (err) {
      setError(LEADERBOARD_LOAD_ERROR_MESSAGE);
    } finally {
      if (isRefresh) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }

  // Optimistic update helpers for Submit Score Screen.
  function applyOptimisticScore(score: number): LeaderboardEntry[] {
    // Save previous state to allow rollback.
    const previous = entries;

    const updated = [...entries];
    const currentIndex = updated.findIndex(
      (e) => e.user_id === "current_user"
    );

    if (currentIndex !== -1) {
      const now = new Date().toISOString();
      updated[currentIndex] = {
        ...updated[currentIndex],
        score,
        timestamp: now,
      };

      updated.sort((a, b) => b.score - a.score);
      updated.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      setEntries(updated);
    }

    return previous;
  }

  function rollbackLeaderboard(previous: LeaderboardEntry[]) {
    setEntries(previous);
  }

  useEffect(() => {
    // Initial load on provider mount.
    void loadLeaderboard();
  }, []);

  const value: LeaderboardContextValue = {
    entries,
    isLoading,
    isRefreshing,
    error,
    data: entries,
    isFetching: isLoading || isRefreshing,
    isError: error != null,
    loadLeaderboard,
    applyOptimisticScore,
    rollbackLeaderboard,
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
}

export function useLeaderboard() {
  const ctx = useContext(LeaderboardContext);
  if (!ctx) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return ctx;
}
