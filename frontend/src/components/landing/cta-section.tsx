import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { ArrowRight, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"

const stats = [
  { value: "10K+", label: "Polls Created" },
  { value: "500K+", label: "Votes Cast" },
  { value: "99.9%", label: "Uptime" },
  { value: "150+", label: "Countries" },
]

export function CtaSection() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  return (
    <section className="py-24 px-6 sm:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Stats row */}
        <motion.div
          className="mb-20 grid grid-cols-2 gap-6 rounded-3xl border border-border bg-card p-8 shadow-sm sm:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <span className="text-3xl font-extrabold text-foreground sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA card */}
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-primary px-8 py-20 text-center shadow-2xl shadow-primary/30"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          {/* decorative circles */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/5" />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-primary-foreground/5" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <BarChart3 className="h-8 w-8 text-primary-foreground" />
            </div>

            <h2 className="mb-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground sm:text-5xl">
              Ready to find out what people think?
            </h2>

            <p className="mb-10 max-w-2xl text-lg text-primary-foreground/75">
              Join thousands of creators, teams, and researchers who trust
              PollWave to surface real opinions and drive smarter decisions.
            </p>

            {isAuthenticated ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/home")}
                className="h-14 gap-2 px-10 text-base font-bold shadow-xl transition-all hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/signup")}
                  className="h-14 gap-2 px-10 text-base font-bold shadow-xl transition-all hover:scale-105"
                >
                  Create Your First Poll — Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="h-14 px-10 text-base font-bold border border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 transition-all"
                >
                  Sign In
                </Button>
              </div>
            )}

            <p className="mt-6 text-sm text-primary-foreground/60">
              No credit card required · Free forever for basic use
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
