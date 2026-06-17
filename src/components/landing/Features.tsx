"use client";

import { motion } from "motion/react";
import {
  Wand2,
  Search,
  Calendar,
  BarChart3,
  Zap,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SectionHeading from "@/components/ui/SectionHeading";

const FEATURES = [
  {
    icon: Wand2,
    title: "Smart Compose",
    description:
      "AI drafts replies that match your tone and context. Just review and send — no more staring at a blank compose window.",
  },
  {
    icon: Search,
    title: "Intelligent Search",
    description:
      "Find any email with natural language queries. Ask \"the invoice from last March\" and get the exact message instantly.",
  },
  {
    icon: Calendar,
    title: "Calendar Sync",
    description:
      "Let AI schedule meetings, check availability, and send invites automatically based on your email conversations.",
  },
  {
    icon: BarChart3,
    title: "Email Analytics",
    description:
      "Understand your email patterns, track response times, and get insights to communicate more effectively.",
  },
  {
    icon: Zap,
    title: "Automated Workflows",
    description:
      "Create custom rules — auto-label, forward, archive, or reply based on content, sender, or sentiment.",
  },
  {
    icon: Tag,
    title: "Smart Categorization",
    description:
      "AI organizes your inbox into meaningful categories: urgent, newsletters, spam, and custom labels you define.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything AI Can Do for Your Inbox"
          subtitle="From drafting replies to organizing your inbox, SwiftMail handles the busywork so you can focus on what matters."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="mt-2 text-base">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
