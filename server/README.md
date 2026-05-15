# PollWave — Backend API

A production-ready REST API for the PollWave polling application. Built with **Express 5**, **TypeScript**, **MongoDB/Mongoose**, **JWT authentication**, and **Socket.IO** for real-time vote streaming.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 5 |
| Language | TypeScript 6 |
| Database | MongoDB + Mongoose 9 |
| Auth | JWT (Access + Refresh tokens) |
| Validation | Zod |
| Email | Nodemailer + Resend |
| Real-time | Socket.IO |
| Logging | Winston |
| Security | bcryptjs, cookie-parser, CORS |
| Config | dotenv + Zod schema |

---

## Project Structure

```
server/
├── dist/                      # Compiled JavaScript output
└── src/
    ├── app/
    │   ├── common/
    │   │   └── middleware/
    │   │       ├── auth.middleware.ts      # JWT authenticate / optionalAuthenticate
    │   │       ├── error.middleware.ts     # Global error handler
    │   │       ├── http.logger.middleware.ts
    │   │       └── validate.middleware.ts  # Zod request validation
    │   └── modules/
    │       ├── auth/
    │       │   ├── dto/                   # register.dto.ts, login.dto.ts
    │       │   ├── auth.controller.ts
    │       │   ├── auth.service.ts
    │       │   └── auth.route.ts
    │       └── polling/
    │           ├── dto/                   # polling.dto.ts
    │           ├── polling.controller.ts
    │           ├── polling.service.ts
    │           └── polling.route.ts
    │   └── app.ts                         # Express app factory
    ├── db/                                # Mongoose connection
    ├── types/                             # express.d.ts (req.user augmentation)
    ├── env.ts                             # Zod-validated environment config
    └── index.ts                           # Server entry point (HTTP + Socket.IO)
```

---

## API Reference

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | — | Server health check |

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | — | Register a new user (sends verification email) |
| `POST` | `/api/auth/login` | — | Login and receive JWT tokens |
| `GET` | `/api/auth/verify-email/:token` | — | Verify email address |

**Register body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string (min 8 chars)"
}
```

**Login body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Login response:**
```json
{
  "accessToken": "...",
  "user": { "id": "...", "name": "...", "email": "..." }
}
```
> The refresh token is set as an `httpOnly` cookie.

---

### Polls — `/api/polls`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/polls` | — | Get all polls |
| `GET` | `/api/polls/:id` | — | Get a single poll by ID |
| `POST` | `/api/polls` | 🔒 Required | Create a new poll |
| `DELETE` | `/api/polls/:id` | 🔒 Required | Delete a poll (owner only) |
| `PATCH` | `/api/polls/update/:id` | 🔒 Required | Update poll status (e.g. COMPLETED) |
| `GET` | `/api/polls/:id/analytics` | — | Get vote analytics for a poll |

**Create Poll body:**
```json
{
  "title": "string",
  "description": "string",
  "questions": [
    {
      "text": "string",
      "options": ["Option A", "Option B"]
    }
  ],
  "expiresAt": "ISO date string (optional)"
}
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8
- MongoDB instance (local or Atlas)

### Installation

```bash
cd chai-code-projects/server
pnpm install
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pollwave

# JWT
JWT_ACCESS_SECRET=your_super_secret_access_key_min_10_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_10_chars
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# SMTP (Email)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASSWORD=your_smtp_password
SMTP_FROM_EMAIL=noreply@pollwave.com
```

> All variables are validated at startup using Zod. The server will **refuse to start** if any required variable is missing or malformed.

### Development

```bash
pnpm dev
```

Uses `tsc-watch` — recompiles TypeScript on every save and restarts the Node server automatically.

### Build & Production

```bash
# Compile TypeScript
pnpm build

# Start the compiled server
pnpm start
```

---

## Architecture Notes

### Authentication Flow
1. User registers → verification email sent via Nodemailer/Resend.
2. User clicks the email link → `GET /api/auth/verify-email/:token` → account activated.
3. User logs in → **access token** returned in JSON body, **refresh token** set as `httpOnly` cookie.
4. Protected routes use the `authenticate` middleware to verify the access token from the `Authorization: Bearer <token>` header.

### Error Handling
All errors propagate through the global `errorHandler` middleware (`app/common/middleware/error.middleware.ts`). Operational errors return structured JSON responses with appropriate HTTP status codes.

### Validation
Every mutating endpoint uses the `validate(schema)` middleware with a Zod schema. Invalid request bodies return a `400` with field-level error details.

### Real-time
Socket.IO is attached to the same HTTP server as Express. Clients subscribe to poll rooms and receive live vote events without polling the REST API.
