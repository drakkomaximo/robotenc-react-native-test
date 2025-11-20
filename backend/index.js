const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4444;

const generateUsername = () =>
  [
    "Quick",
    "Iron",
    "Thunder",
    "Shadow",
    "Power",
    "Swift",
    "Heavy",
    "Sharp",
    "Blazing",
    "Mighty",
  ][Math.floor(Math.random() * 10)] +
  [
    "Fist",
    "Punch",
    "Strike",
    "Jab",
    "Hit",
    "Slam",
    "Blow",
    "Kick",
    "Chop",
    "Smash",
  ][Math.floor(Math.random() * 10)];

const generateLeaderboard = () => {
  const entries = [];
  for (let i = 0; i < 50; i++) {
    const isCurrentUser = i === 23;
    const username = isCurrentUser ? "You" : generateUsername();
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    entries.push({
      user_id: isCurrentUser ? "current_user" : `user_${i + 1}`,
      username,
      score: 990 - (i * 15) + Math.floor(Math.random() * 10),
      rank: i + 1,
      timestamp: date.toISOString(),
      avatar_url: `https://api.dicebear.com/7.x/avataaars/png?seed=${username}`,
    });
  }
  return entries;
};

let leaderboardData = generateLeaderboard();

const randomDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));
const shouldFail = () => Math.random() < 0.1;

app.get("/api/v1/leaderboard", async (req, res) => {
  await randomDelay();
  if (shouldFail())
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  res.json(leaderboardData);
});

app.get("/api/v1/users/:userId", async (req, res) => {
  await randomDelay();
  if (shouldFail())
    return res.status(500).json({ error: "Failed to fetch user profile" });

  const entry = leaderboardData.find((e) => e.user_id === req.params.userId);
  if (!entry) return res.status(404).json({ error: "User not found" });

  const scoreHistory = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (i * 3 + Math.floor(Math.random() * 3)));
    scoreHistory.push({
      score: entry.score - i * 20 + Math.floor(Math.random() * 30),
      timestamp: date.toISOString(),
    });
  }

  const memberDate = new Date();
  memberDate.setMonth(
    memberDate.getMonth() - Math.floor(Math.random() * 12) - 1
  );

  const scores = scoreHistory.map((s) => s.score);
  const bestScore = Math.max(...scores);

  res.json({
    user_id: entry.user_id,
    username: entry.username,
    avatar_url: entry.avatar_url,
    best_score: bestScore,
    total_punches: Math.floor(Math.random() * 500) + 50,
    member_since: memberDate.toISOString(),
    score_history: scoreHistory,
  });
});

app.post("/api/v1/scores", async (req, res) => {
  await randomDelay();
  if (shouldFail())
    return res.status(500).json({ error: "Failed to submit score" });

  const { score } = req.body;
  if (typeof score !== "number" || score < 0 || score > 999) {
    return res.status(400).json({ error: "Score must be between 0 and 999" });
  }

  const currentUser = leaderboardData.find((e) => e.user_id === "current_user");

  currentUser.score = score;
  currentUser.timestamp = new Date().toISOString();
  leaderboardData.sort((a, b) => b.score - a.score);
  leaderboardData.forEach((entry, index) => {
    entry.rank = index + 1;
  })

  res.json({
    success: true,
    new_rank:
      leaderboardData.findIndex((e) => e.user_id === "current_user") + 1,
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/v1/reset", (req, res) => {
  leaderboardData = generateLeaderboard();
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
