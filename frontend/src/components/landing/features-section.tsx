import { motion } from "framer-motion"
import { Zap, Share2, PieChart, Lock, Users, MessageSquare } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description:
      "Create your first poll in under 60 seconds. No complex configurations, just type your question and add options.",
    accent: "group-hover:bg-chart-1",
  },
  {
    icon: Share2,
    title: "Share Anywhere",
    description:
      "Generate a unique URL and distribute it via Twitter, WhatsApp, Slack, or embed it directly on your website.",
    accent: "group-hover:bg-chart-2",
  },
  {
    icon: PieChart,
    title: "Live Analytics",
    description:
      "Watch votes roll in with real-time charts. Instantly understand your audience with beautiful visual breakdowns.",
    accent: "group-hover:bg-chart-3",
  },
  {
    icon: Lock,
    title: "Secure & Fair",
    description:
      "Advanced vote-manipulation protection ensures every respondent gets exactly one voice — no gaming the results.",
    accent: "group-hover:bg-chart-4",
  },
  {
    icon: Users,
    title: "Built for Communities",
    description:
      "Engage teams, audiences, and communities. Perfect for workplace decisions, product feedback, and fun debates.",
    accent: "group-hover:bg-chart-5",
  },
  {
    icon: MessageSquare,
    title: "Rich Discussions",
    description:
      "Let voters explain their choices. Collect qualitative feedback alongside quantitative vote counts.",
    accent: "group-hover:bg-chart-1",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
}

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-20 py-24 px-6 sm:px-12"
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
            Packed with power
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-lg text-muted-foreground">
            A complete toolkit for gathering opinions — wrapped in a design you'll love.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group flex flex-col rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-md"
            >
              {/* Icon */}
              <div
                className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-foreground transition-colors duration-300 ${feature.accent} group-hover:text-primary-foreground`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
