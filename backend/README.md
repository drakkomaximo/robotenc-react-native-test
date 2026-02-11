# Leaderboard API (Backend)

Mock API for the React Native take-home exercise. This service exposes leaderboard and user score endpoints, and includes interactive API documentation with Swagger UI.

The backend intentionally simulates **network delay** and **random failures (~10%)** so the mobile app can demonstrate proper loading, error, and retry behavior. All score submissions are for a single logical user whose ID is `"current_user"`.

## Prerequisites

- Node.js (version 14+ recommended)
- npm (Node Package Manager)

## Installation

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Running the server

Start the API server with:

```bash
npm start
```

By default the server runs on:

- `http://localhost:4444`

> Note: The port can be changed by setting the `PORT` environment variable in the future, but the current implementation is fixed to `4444`.

## Available endpoints

Base path: `http://localhost:4444/api/v1`

- `GET /api/v1/leaderboard`
  - Returns a list of leaderboard entries.

- `GET /api/v1/users/:userId`
  - Returns a mock profile for the specified user ID.

- `POST /api/v1/scores`
  - Submits a new score for the current user.

- `POST /api/v1/reset`
  - Resets the leaderboard data to a new randomized state.

These endpoints are consumed by the Expo frontend in the `/frontend` directory. Make sure the server is running before starting the mobile app.

## Swagger API Documentation

This backend includes interactive API documentation generated with `swagger-jsdoc` and served via `swagger-ui-express`.

### Accessing Swagger UI

Once the server is running, open the following URL in your browser:

- `http://localhost:4444/api-docs`

There you can:

- Browse all available endpoints.
- Inspect request/response schemas.
- Execute requests directly from the browser against the running API.

### Swagger configuration

Swagger is configured under `backend/swagger`:

- `swagger.config.js`
  - Defines the OpenAPI version, API metadata (title, description, version), server URL, and the location of the documentation source file.

- `swagger.docs.js`
  - Contains the JSDoc-style annotations used by `swagger-jsdoc` to generate the OpenAPI specification.
  - Documents schemas such as `LeaderboardEntry` and `UserProfile`.
  - Documents the main endpoints:
    - `GET /api/v1/leaderboard`
    - `GET /api/v1/users/{userId}`
    - `POST /api/v1/scores`
    - `POST /api/v1/reset`

With the server running and the above files in place, Swagger UI will always reflect the documented endpoints defined in `swagger.docs.js`.
