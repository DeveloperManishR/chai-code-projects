"use client";

import { motion } from "motion/react";
import { Bot, Inbox, Clock } from "lucide-react";

const STATS = [
  {
    icon: Bot,
    value: "10K+",
    label: "AI Operations Daily",
    desc: "Drafts composed, threads summarized, inboxes organized",
  },
  {
    icon: Inbox,
    value: "50K+",
    label: "Emails Processed",
    desc: "Smart-filtered, prioritized, and action-ready",
  },
  {
    icon: Clock,
    value: "12h",
    label: "Hours Saved Weekly",
    desc: "Per user, on average — time back to what matters",
  },
];

export default function Stats() {
  return (
    <section className="border-y bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center py-10 px-6 text-center"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 mb-4">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
              <span className="mt-1.5 text-sm font-medium">{stat.label}</span>
              <span className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-[220px]">
                {stat.desc}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
