# PollWave — Frontend

A modern, responsive polling application frontend built with **React 19**, **Vite**, **Tailwind CSS v4**, and **Shadcn UI**. Features a beautiful public landing page, protected dashboard, real-time voting, and poll analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 7 |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS v4 + Shadcn UI |
| Routing | React Router v7 |
| Server State | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion |
| Charts | Recharts |
| Real-time | Socket.IO Client |
| Fonts | Merriweather Variable |
| HTTP Client | Axios |
| Toasts | Sonner |

---

## Project Structure

```
frontend/
├── public/
└── src/
    ├── api/                    # Axios instances & API call functions
    ├── assets/                 # Static images/icons
    ├── components/
    │   ├── auth/               # AuthGuard (protected route wrapper)
    │   ├── landing/            # Landing page sections
    │   │   ├── hero-section.tsx
    │   │   ├── how-it-works-section.tsx
    │   │   ├── features-section.tsx
    │   │   ├── use-cases-section.tsx
    │   │   └── cta-section.tsx
    │   ├── layout/             # AppLayout, AuthLayout, Navbar
    │   ├── polls/              # PollCard, voting UI
    │   ├── shared/             # EmptyState, ErrorAlert, ThemeToggle
    │   └── ui/                 # Shadcn generated components
    ├── context/                # React context definitions
    ├── hooks/                  # Custom hooks (usePolls, etc.)
    ├── lib/                    # Utilities (cn, etc.)
    ├── pages/
    │   ├── landing.tsx         # Public index page (/)
    │   ├── home.tsx            # Auth-protected dashboard (/home)
    │   ├── login.tsx
    │   ├── signup.tsx
    │   ├── verify-email.tsx
    │   ├── poll-detail.tsx
    │   ├── create-poll.tsx
    │   └── not-found.tsx
    ├── providers/              # AuthProvider, QueryClientProvider
    ├── router.tsx              # Route definitions
    ├── types/                  # TypeScript types & interfaces
    ├── index.css               # Global styles + Tailwind theme tokens
    └── main.tsx                # App entry point
```

---

## Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page — marketing & hero |
| `/login` | Public | Login form |
| `/signup` | Public | Registration form |
| `/verify-email` | Public | Email verification |
| `/home` | 🔒 Auth Required | Poll dashboard (list + search) |
| `/polls/:id` | Public | Poll detail & voting |
| `/polls/create` | 🔒 Auth Required | Create a new poll |

> Unauthenticated users trying to access protected routes are redirected to `/login`.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 8

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd chai-code-projects/frontend

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Development

```bash
pnpm dev
```

Runs the app at `http://localhost:5173` with hot module replacement.

### Build

```bash
pnpm build
```

Output goes to `dist/`. TypeScript is compiled first, then Vite bundles the assets.

### Other Scripts

```bash
pnpm typecheck   # Type-check without emitting
pnpm lint        # ESLint
pnpm format      # Prettier
pnpm preview     # Preview the production build locally
```

---

## Key Features

- **Public Landing Page** — Hero, How It Works, Features, Use Cases, and CTA sections — all in separate components.
- **Auth Guard** — `AuthGuard` component wraps protected routes and redirects unauthenticated users.
- **Theme Support** — Light / Dark mode via `next-themes`, fully driven by CSS variables defined in `index.css`.
- **Real-time Voting** — Socket.IO client for live vote count updates.
- **Poll Analytics** — Recharts-powered bar charts for completed poll results.
- **Framer Motion** — Smooth entrance animations and micro-interactions throughout.
