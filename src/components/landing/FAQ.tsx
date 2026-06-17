"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "How does SwiftMail connect to my Gmail?",
    a: "SwiftMail uses Google's secure OAuth 2.0 authentication. We request read and send access to your Gmail account, plus calendar read access. You can revoke access at any time from your Google Account settings.",
  },
  {
    q: "Is my email data private and secure?",
    a: "Absolutely. Your data is encrypted in transit and at rest. We never store your email content for training purposes, and you can delete all your data from our servers at any time. We are fully GDPR and CCPA compliant.",
  },
  {
    q: "Which Google services are supported?",
    a: "Currently we support Gmail and Google Calendar. Google Drive integration is in development and will be available soon.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no long-term contracts. You can cancel your subscription at any time, and your paid features will remain active until the end of your billing period.",
  },
  {
    q: "What does an AI operation count as?",
    a: "Each AI operation counts as one action: composing a reply, summarizing an email, performing a search, or running an automation rule. Most daily tasks use 1–2 operations.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <Badge variant="outline" className="mb-4 px-3 py-1 text-xs">
            FAQ
          </Badge>
          <h2 className="max-w-xl text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Questions? We&apos;ve Got Answers
          </h2>
          <p className="mt-4 max-w-lg text-balance text-muted-foreground">
            Everything you need to know about SwiftMail before getting started.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.1 }}
          className="mt-10"
        >
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
