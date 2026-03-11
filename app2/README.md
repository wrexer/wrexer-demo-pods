# App2: User Management Service

A Node.js application that integrates with PostgreSQL to manage user records.

## Features
- **Database Integration**: Connects to a PostgreSQL database.
- **Auto-Initialization**: Automatically creates the `users` table on startup.
- **API Driven**: Provides RESTful endpoints for user operations.

## API Endpoints
- `GET /api/users`: Retrieve all registered users.
- `POST /api/users`: Create a new user (requires `name` and `email`).
- `GET /api/health`: Check application and database connection status.

## Configuration
Requires a `DATABASE_URL` environment variable to connect to PostgreSQL.
