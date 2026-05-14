import { createBrowserRouter } from "react-router"

import { AppLayout } from "@/components/layout/app-layout"
import { AuthLayout } from "@/components/layout/auth-layout"
import { AuthGuard } from "@/components/auth/auth-guard"

import HomePage from "@/pages/home"
import LoginPage from "@/pages/login"
import SignupPage from "@/pages/signup"
import PollDetailPage from "@/pages/poll-detail"
import CreatePollPage from "@/pages/create-poll"
import NotFoundPage from "@/pages/not-found"

export const router = createBrowserRouter([
  // ─── Auth Pages ──────────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },

  // ─── App Pages ───────────────────────────────────────────────────────────
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/polls/:id", element: <PollDetailPage /> },
      {
        path: "/polls/create",
        element: (
          <AuthGuard>
            <CreatePollPage />
          </AuthGuard>
        ),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
