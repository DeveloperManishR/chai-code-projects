"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionHeading from "@/components/ui/SectionHeading";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out AI-powered email.",
    features: [
      "10 AI operations per day",
      "Smart compose suggestions",
      "Basic email search",
      "Gmail & Calendar integration",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "₹599",
    period: "/month",
    description: "For professionals who live in their inbox.",
    features: [
      "30 AI operations per day",
      "Priority AI responses",
      "Advanced search & summaries",
      "Custom workflow automations",
      "Email analytics dashboard",
    ],
    cta: "Get Professional",
    highlighted: true,
  },
  {
    name: "Business",
    price: "₹999",
    period: "/month",
    description: "For teams that need enterprise-grade AI.",
    features: [
      "100 AI operations per day",
      "Dedicated support",
      "Team workspace & sharing",
      "Advanced automation chains",
      "Custom AI model tuning",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that fits your email volume. No hidden fees, no surprises."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex"
            >
              <Card
                className={`relative flex w-full flex-col ${
 plan.highlighted
 ? "border-primary shadow-lg ring-1 ring-primary/20"
 : ""
 }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="mt-2 text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/signup" className="w-full">
                    <Button
                      variant={plan.highlighted ? "default" : "outline"}
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
