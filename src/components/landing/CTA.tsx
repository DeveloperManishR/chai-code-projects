"use client";

import { motion } from "motion/react";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-muted/40" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_65%)] opacity-5" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-background via-background to-primary/[0.03] p-10 text-center shadow-sm sm:p-16"
        >
          <div className="absolute top-0 right-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-8 translate-y-8 rounded-full bg-primary/5 blur-3xl" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Zap className="h-7 w-7 text-primary" />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Transform Your Inbox?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-balance text-muted-foreground">
            Join thousands of professionals who&apos;ve reclaimed hours every week with
            AI-powered email. No credit card required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" className="gap-2 shadow-md">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#capabilities">
              <Button variant="outline" size="lg">
                View Capabilities
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
