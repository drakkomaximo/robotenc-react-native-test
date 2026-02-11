/**
 * @swagger
 * components:
 *   schemas:
 *     LeaderboardEntry:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *         username:
 *           type: string
 *         score:
 *           type: integer
 *         rank:
 *           type: integer
 *         timestamp:
 *           type: string
 *           format: date-time
 *         avatar_url:
 *           type: string
 *     UserProfile:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *         username:
 *           type: string
 *         avatar_url:
 *           type: string
 *         best_score:
 *           type: integer
 *         total_punches:
 *           type: integer
 *         member_since:
 *           type: string
 *           format: date-time
 *         score_history:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               score:
 *                 type: integer
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *
 * /api/v1/leaderboard:
 *   get:
 *     summary: Get leaderboard entries
 *     tags:
 *       - Leaderboard
 *     responses:
 *       200:
 *         description: List of leaderboard entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LeaderboardEntry'
 *       500:
 *         description: Failed to fetch leaderboard
 *
 * /api/v1/users/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user profile
 *
 * /api/v1/scores:
 *   post:
 *     summary: Submit a new score for the current user
 *     tags:
 *       - Scores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 999
 *     responses:
 *       200:
 *         description: Score submitted successfully
 *       400:
 *         description: Invalid score
 *       500:
 *         description: Failed to submit score
 *
 * /api/v1/reset:
 *   post:
 *     summary: Reset leaderboard data
 *     tags:
 *       - Leaderboard
 *     responses:
 *       200:
 *         description: Leaderboard reset successfully
 */
