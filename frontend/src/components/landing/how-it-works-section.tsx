import { motion } from "framer-motion"

const steps = [
  {
    step: "01",
    title: "Create a Poll",
    description:
      "Write your question, add options, and configure settings in under 60 seconds — no learning curve required.",
    color: "bg-chart-1",
  },
  {
    step: "02",
    title: "Share the Link",
    description:
      "Get a unique link instantly. Share it on social media, Slack, WhatsApp, or embed it on your site.",
    color: "bg-chart-2",
  },
  {
    step: "03",
    title: "Watch Results Live",
    description:
      "See votes flow in with real-time updates. Beautiful charts make the data instantly clear.",
    color: "bg-chart-3",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-border bg-secondary/20 py-24 px-6 sm:px-12"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Simple by design
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-lg text-muted-foreground">
            Three steps is all it takes to go from idea to real-world insights.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group relative flex flex-col items-center rounded-3xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-2 hover:shadow-lg"
            >
              {/* Connector line (desktop) */}
              {idx < steps.length - 1 && (
                <div className="absolute -right-4 top-14 hidden h-0.5 w-8 bg-border md:block" />
              )}

              {/* Step bubble */}
              <div
                className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} text-xl font-black text-primary-foreground shadow-lg`}
              >
                {step.step}
              </div>

              <h3 className="mb-3 text-xl font-bold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
