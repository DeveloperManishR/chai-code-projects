import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { BarChart3, ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"

export function HeroSection() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const scrollToNext = () => {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 sm:px-12">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-chart-1/10 blur-3xl" />
        <div className="absolute left-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-chart-2/10 blur-3xl" />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-sm font-medium text-secondary-foreground backdrop-blur-sm"
      >
        <span className="h-2 w-2 rounded-full bg-chart-2 animate-pulse" />
        Real-time Voting Platform
      </motion.div>

      {/* Logo Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-primary shadow-2xl shadow-primary/30"
      >
        <BarChart3 className="h-12 w-12 text-primary-foreground" />
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="mb-6 max-w-4xl text-center text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        Make Decisions{" "}
        <span className="relative text-primary">
          Together.
          <motion.span
            className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-primary/40"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          />
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        className="mb-10 max-w-2xl text-center text-xl leading-relaxed text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        Create beautiful polls in seconds. Share them anywhere. Watch the results
        roll in live — from your team, community, or the whole world.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="flex flex-col items-center gap-4 sm:flex-row"
      >
        {isAuthenticated ? (
          <Button
            size="lg"
            onClick={() => navigate("/home")}
            className="h-14 gap-2 px-8 text-base font-semibold shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/35"
          >
            Go to Dashboard
            <ArrowRight className="h-5 w-5" />
          </Button>
        ) : (
          <>
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="h-14 gap-2 px-8 text-base font-semibold shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/35"
            >
              Start for Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="h-14 px-8 text-base font-semibold transition-all hover:scale-105"
            >
              Sign In
            </Button>
          </>
        )}
      </motion.div>

      {/* Scroll cue */}
      <motion.button
        onClick={scrollToNext}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 flex flex-col items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>Scroll to learn more</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </motion.button>
    </section>
  )
}
