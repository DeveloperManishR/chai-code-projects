"use client";

import { motion } from "motion/react";
import Link from "next/link";
import {
  Mail,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Sparkles,
  Loader2,
} from "lucide-react";
import { disconnectPlugin } from "./actions";

interface Props {
  userName: string;
  userEmail: string;
  userInitial: string;
  isGmailConnected: boolean;
  isCalendarConnected: boolean;
  dbError: boolean;
  oauthError?: string;
}

const STEPS = [
  { label: "Connect", done: false },
  { label: "Configure", done: false },
  { label: "Launch", done: false },
];

function ServiceCard({
  icon: Icon,
  name,
  description,
  connected,
  onConnect,
  onDisconnect,
  delay,
}: {
  icon: typeof Mail;
  name: string;
  description: string;
  connected: boolean;
  onConnect: string;
  onDisconnect: "gmail" | "googlecalendar";
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
        connected
          ? "border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] via-background to-background"
          : "bg-card hover:border-primary/20 hover:shadow-sm"
      }`}
    >
      <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-primary/[0.03] blur-2xl" />

      <div className="relative flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
            connected ? "bg-emerald-500/10" : "bg-primary/10"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              connected ? "text-emerald-500" : "text-primary"
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{name}</h3>
            {connected && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500"
              >
                Connected
              </motion.span>
            )}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>

          <div className="mt-4">
            {connected ? (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Authorized
                </span>
                <form action={disconnectPlugin.bind(null, onDisconnect)}>
                  <button
                    type="submit"
                    className="rounded-lg border border-destructive/20 px-2.5 py-1 text-[11px] font-medium text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  >
                    Disconnect
                  </button>
                </form>
              </div>
            ) : (
              <a
                href={`/api/auth/connect?plugin=${onConnect}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                <Loader2 className="h-3 w-3" />
                Connect
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function OnboardingClient({
  userName,
  userEmail,
  userInitial,
  isGmailConnected,
  isCalendarConnected,
  dbError,
  oauthError,
}: Props) {
  const allConnected = isGmailConnected && isCalendarConnected;

  return (
    <div className="relative flex min-h-screen flex-col bg-background antialiased">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] h-[600px] w-[600px] rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-5%] h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute top-[40%] left-[50%] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-primary/[0.02] blur-3xl" />
      </div>

      <header className="relative border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 shadow-xs">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight">SwiftMail</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">{userEmail}</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
              {userInitial}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 py-10 sm:py-16">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2 lg:pt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-5">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    SwiftMail
                  </span>
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Connect your accounts in seconds. Your AI assistant will handle
                  the rest — from drafting replies to scheduling meetings.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-8 space-y-3"
              >
                {[
                  { icon: Zap, text: "AI-powered email drafting" },
                  { icon: Shield, text: "Secure OAuth connections" },
                  { icon: Sparkles, text: "Smart inbox organization" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <item.icon className="h-3 w-3 text-primary" />
                    </div>
                    {item.text}
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-8"
              >
                <div className="flex items-center gap-3">
                  {["Connect", "Configure", "Launch"].map((label, i) => (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                          i === 0
                            ? "bg-primary text-primary-foreground"
                            : allConnected && i <= 1
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          i === 0
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </span>
                      {i < 2 && (
                        <div className="hidden h-px w-8 bg-border sm:block" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              {dbError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-center text-xs font-medium text-amber-600 dark:text-amber-400"
                >
                  Storage quota exceeded. Running in fallback mode. You can still continue.
                </motion.div>
              )}

              {oauthError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-center text-xs font-medium text-destructive"
                >
                  {oauthError}
                </motion.div>
              )}

              <div className="space-y-4">
                <ServiceCard
                  icon={Mail}
                  name="Gmail"
                  description="Read, draft, and organize your emails with AI assistance."
                  connected={isGmailConnected}
                  onConnect="gmail"
                  onDisconnect="gmail"
                  delay={0.2}
                />
                <ServiceCard
                  icon={Calendar}
                  name="Google Calendar"
                  description="Sync events, check availability, and schedule meetings automatically."
                  connected={isCalendarConnected}
                  onConnect="googlecalendar"
                  onDisconnect="googlecalendar"
                  delay={0.3}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="mt-8"
              >
                <div
                  className={`rounded-2xl border p-5 transition-all ${
                    allConnected
                      ? "border-primary/20 bg-gradient-to-br from-primary/[0.03] via-background to-background"
                      : "bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          allConnected ? "bg-emerald-500/10" : "bg-muted"
                        }`}
                      >
                        {allConnected ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {allConnected
                            ? "Ready to Launch"
                            : "Complete Setup"}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {allConnected
                            ? "All services connected — start using SwiftMail"
                            : "Connect Gmail and Calendar to continue"}
                        </p>
                      </div>
                    </div>
                    {allConnected ? (
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.97]"
                      >
                        Go to Dashboard
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <div className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border bg-muted/50 px-5 py-2.5 text-sm font-medium text-muted-foreground/60">
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
