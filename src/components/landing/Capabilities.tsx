"use client";

import { motion } from "motion/react";
import {
  Wand2,
  Search,
  Calendar,
  Tag,
  Zap,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CAPABILITIES = [
  {
    icon: Wand2,
    title: "AI-Powered Drafting",
    description:
      "Describe the email you want to send in plain language. SwiftMail composes a polished draft that matches your tone — whether it's a quick reply, a detailed proposal, or a delicate message.",
    tag: "Compose",
  },
  {
    icon: Search,
    title: "Conversational Search",
    description:
      "Stop digging through folders. Ask for \"the invoice from March\" or \"that thread about the conference\" and SwiftMail finds the exact message instantly using semantic understanding.",
    tag: "Search",
  },
  {
    icon: Tag,
    title: "Smart Inbox Organization",
    description:
      "Your inbox sorts itself. Urgent client emails surface to the top, newsletters are grouped, and spam never reaches you — all without a single manual rule.",
    tag: "Organize",
  },
  {
    icon: Calendar,
    title: "Calendar Intelligence",
    description:
      "SwiftMail reads your availability, cross-references it with email conversations, and schedules meetings — sending invites and follow-ups without you lifting a finger.",
    tag: "Schedule",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description:
      "Create custom automations in natural language. \"When I get an invoice email, save the attachment and notify accounting\" — SwiftMail handles the rest.",
    tag: "Automate",
  },
  {
    icon: BarChart3,
    title: "Email Analytics",
    description:
      "Understand your communication patterns. Track response times, busiest hours, and email volume trends to optimize how you manage your inbox.",
    tag: "Analyze",
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs">
            Capabilities
          </Badge>
          <h2 className="max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Everything AI Can Do for Your Email
          </h2>
          <p className="mt-4 max-w-xl text-balance text-muted-foreground">
            From drafting to organizing to automating — SwiftMail transforms your
            Gmail experience with intelligence at every layer.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-md hover:border-primary/20"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <cap.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="text-base font-semibold">{cap.title}</h3>
                  <span className="rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {cap.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {cap.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
