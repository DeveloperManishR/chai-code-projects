"use client";

import { motion } from "motion/react";
import { Plug, Cpu, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    icon: Plug,
    title: "Connect in One Click",
    description:
      "Authorize your Google account through secure OAuth. SwiftMail requests access to your Gmail and Calendar — nothing more, nothing less.",
  },
  {
    icon: Cpu,
    title: "AI Learns Your Workflow",
    description:
      "Our models analyze your communication patterns, writing style, and priorities. The more you use SwiftMail, the smarter it gets.",
  },
  {
    icon: Sparkles,
    title: "Experience the Intelligence",
    description:
      "Start receiving smart drafts, instant summaries, and an inbox that organizes itself — all inside your familiar Gmail interface.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-muted/30" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs">
            How It Works
          </Badge>
          <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            From Setup to Superpower in Minutes
          </h2>
          <p className="mt-4 max-w-lg text-balance text-muted-foreground">
            No training required. No complex configuration. SwiftMail starts
            delivering value the moment you connect your account.
          </p>
        </motion.div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div className="absolute top-12 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border bg-background shadow-sm">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-semibold">{step.title}</h3>
              <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
