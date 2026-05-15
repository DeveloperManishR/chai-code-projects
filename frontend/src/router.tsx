import { createBrowserRouter } from "react-router"

import { AppLayout } from "@/components/layout/app-layout"
import { AuthLayout } from "@/components/layout/auth-layout"
import { AuthGuard } from "@/components/auth/auth-guard"

import LandingPage from "@/pages/landing"
import HomePage from "@/pages/home"
import LoginPage from "@/pages/login"
import SignupPage from "@/pages/signup"
import VerifyEmailPage from "@/pages/verify-email"
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
      { path: "/verify-email", element: <VerifyEmailPage /> },
    ],
  },

  // ─── App Pages ───────────────────────────────────────────────────────────
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        path: "/home",
        element: (
          <AuthGuard>
            <HomePage />
          </AuthGuard>
        ),
      },
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
