import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { UseCasesSection } from "@/components/landing/use-cases-section"
import { CtaSection } from "@/components/landing/cta-section"

/**
 * Public landing page — visible at "/" for all visitors.
 * Sections are split into separate components for maintainability.
 */
export default function LandingPage() {
  return (
    <div className="flex flex-col bg-background">
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <CtaSection />
    </div>
  )
}
