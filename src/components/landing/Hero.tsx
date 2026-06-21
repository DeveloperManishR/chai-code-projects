"use client";

import { motion } from "motion/react";
import { ArrowRight, Sparkles, Inbox, Bot, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";

const floatingCards = [
  {
    icon: Bot,
    label: "AI Draft Ready",
    desc: "Reply to Sarah about Q3 budgeting",
    time: "Just now",
    gradient: "from-blue-500/10 to-blue-600/5",
  },
  {
    icon: Inbox,
    label: "Inbox Prioritized",
    desc: "12 emails sorted by urgency",
    time: "2 min ago",
    gradient: "from-purple-500/10 to-purple-600/5",
  },
  {
    icon: Shield,
    label: "Summary Generated",
    desc: "Thread digest for project launch",
    time: "5 min ago",
    gradient: "from-primary/10 to-primary/5",
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--primary)_0%,_transparent_55%)] opacity-6 dark:opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--primary)/0.4)_0%,_transparent_50%)] opacity-5" />
        <div className="absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1 text-xs">
                <Sparkles className="h-3 w-3 text-primary" />
                AI-Native Email Experience
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Your Inbox,{" "}
              <span className="bg-gradient-to-r from-primary via-primary/70 to-primary/40 bg-clip-text text-transparent">
                Reimagined by AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-lg text-balance text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              SwiftMail brings intelligence directly into your Gmail workflow.
              Draft replies, summarize threads, and organize your inbox — all with
              natural language.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href="/signup">
                <Button size="lg" className="gap-2 shadow-md">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg">
                  See the Magic
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex items-center gap-4 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
                No credit card required
              </span>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <span className="hidden items-center gap-1.5 sm:flex">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary" />
                Works with any Gmail account
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-primary/10 to-transparent blur-2xl" />
              <div className="relative flex flex-col gap-4">
                <div className="rounded-2xl border bg-card/80 p-5 backdrop-blur-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI Assistant</p>
                      <p className="text-xs text-muted-foreground">
                        Ready to help — 12 unread threads
                      </p>
                    </div>
                    <span className="flex h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/50" />
                  </div>
                </div>

                {floatingCards.map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
                    className={`rounded-xl border bg-gradient-to-br ${card.gradient} bg-card/60 p-4 backdrop-blur-sm shadow-sm`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-background/50">
                        <card.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium truncate">{card.label}</p>
                          <span className="shrink-0 text-[11px] text-muted-foreground">{card.time}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">{card.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
