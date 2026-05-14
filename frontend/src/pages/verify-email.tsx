import { Link, useNavigate, useSearchParams } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod/v4"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Clock, Loader2, MailCheck, Send } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { verifyEmail, resendVerificationEmail } from "@/api/auth.api"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────

type VerificationStatus = "loading" | "success" | "expired" | "invalid"

const resendSchema = z.object({
  email: z.email("Please enter a valid email"),
})
type ResendForm = z.infer<typeof resendSchema>

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getHttpStatus(err: unknown): number | null {
  return (err as { response?: { status?: number } })?.response?.status ?? null
}

function getErrorMessage(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  )
}

// ─── Sub-views ────────────────────────────────────────────────────────────────

function VerifyingView() {
  return (
    <CardContent className="flex flex-col items-center gap-4 py-8">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Verifying your email…</p>
    </CardContent>
  )
}

function SuccessView() {
  return (
    <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
      <CheckCircle2 className="h-12 w-12 text-green-500" />
      <div className="space-y-1">
        <p className="font-medium">Your email has been verified!</p>
        <p className="text-sm text-muted-foreground">Redirecting you to login…</p>
      </div>
      <Button asChild variant="outline" size="sm" className="mt-2">
        <Link to="/login">Go to login</Link>
      </Button>
    </CardContent>
  )
}

function InvalidView() {
  return (
    <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
      <XCircle className="h-12 w-12 text-destructive" />
      <div className="space-y-1">
        <p className="font-medium">Invalid verification link</p>
        <p className="text-sm text-muted-foreground">
          This link is invalid or has already been used.
        </p>
      </div>
      <Button asChild variant="outline" size="sm" className="mt-2">
        <Link to="/login">Back to login</Link>
      </Button>
    </CardContent>
  )
}

function ExpiredView({ onResent }: { onResent: () => void }) {
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendForm>({ resolver: zodResolver(resendSchema) })

  const onSubmit = async ({ email }: ResendForm) => {
    setIsLoading(true)
    try {
      await resendVerificationEmail(email)
      toast.success("Verification email sent! Please check your inbox.")
      onResent()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to resend. Please try again."))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CardContent className="space-y-5">
      <div className="flex flex-col items-center gap-3 text-center">
        <Clock className="h-12 w-12 text-amber-500" />
        <div className="space-y-1">
          <p className="font-medium">Verification link expired</p>
          <p className="text-sm text-muted-foreground">
            Enter your email and we'll send you a new link.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Resend verification email
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Back to login
        </Link>
      </p>
    </CardContent>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TITLE: Record<VerificationStatus, string> = {
  loading: "Verifying your email",
  success:  "Email verified",
  expired:  "Link expired",
  invalid:  "Invalid link",
}

const DESCRIPTION: Record<VerificationStatus, string> = {
  loading: "Please wait while we confirm your email address.",
  success: "You're all set!",
  expired: "Your verification link has expired.",
  invalid: "We couldn't process this verification link.",
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = React.useState<VerificationStatus>("loading")

  // useRef guard prevents double-invocation in React StrictMode (dev only),
  // which mounts → unmounts → remounts every component to surface side-effect bugs.
  const didRun = React.useRef(false)

  React.useEffect(() => {
    if (didRun.current) return
    didRun.current = true

    const token = searchParams.get("token")

    if (!token) {
      setStatus("invalid")
      return
    }

    verifyEmail(token)
      .then(() => {
        setStatus("success")
        // Give the user a moment to read the success message, then redirect.
        const timer = setTimeout(() => navigate("/login", { replace: true }), 2500)
        return () => clearTimeout(timer)
      })
      .catch((err: unknown) => {
        setStatus(getHttpStatus(err) === 410 ? "expired" : "invalid")
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps — intentionally runs once

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <MailCheck className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{TITLE[status]}</CardTitle>
          <CardDescription>{DESCRIPTION[status]}</CardDescription>
        </CardHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {status === "loading" && <VerifyingView />}
            {status === "success" && <SuccessView />}
            {status === "expired" && <ExpiredView onResent={() => setStatus("invalid")} />}
            {status === "invalid" && <InvalidView />}
          </motion.div>
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}