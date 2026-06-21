"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Capabilities from "@/components/landing/Capabilities";
import HowItWorks from "@/components/landing/HowItWorks" ;
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";

export default function Landing() {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Capabilities />
        <HowItWorks />
        <FAQ />
        <CTA />
      </main>
    </div>
  );
}
