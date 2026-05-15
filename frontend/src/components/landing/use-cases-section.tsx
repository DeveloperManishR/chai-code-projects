import { motion } from "framer-motion"
import { Briefcase, GraduationCap, Heart, Globe2 } from "lucide-react"

const useCases = [
  {
    icon: Briefcase,
    label: "Business",
    title: "Align Your Team",
    description:
      "Run sprint retrospectives, make product roadmap decisions, or pick the next team lunch spot — all with instant consensus.",
    color: "bg-chart-1/15 text-chart-1",
  },
  {
    icon: GraduationCap,
    label: "Education",
    title: "Engage Classrooms",
    description:
      "Teachers use PollWave for live quizzes, comprehension checks, and student opinion polls that keep classes interactive.",
    color: "bg-chart-2/15 text-chart-2",
  },
  {
    icon: Heart,
    label: "Community",
    title: "Know Your Audience",
    description:
      "Content creators, community managers, and event organizers trust us to surface what their audiences actually want.",
    color: "bg-chart-3/15 text-chart-3",
  },
  {
    icon: Globe2,
    label: "Research",
    title: "Gather Real Opinions",
    description:
      "Researchers and journalists use PollWave to quickly sample public opinion with beautiful, shareable result pages.",
    color: "bg-chart-4/15 text-chart-4",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55 } },
}

export function UseCasesSection() {
  return (
    <section
      id="use-cases"
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
            For everyone
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Who Uses PollWave?
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-lg text-muted-foreground">
            From Fortune 500 teams to solo creators — decisions are better when
            they're data-driven.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {useCases.map((uc, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-md"
            >
              {/* Icon pill */}
              <div
                className={`mb-5 inline-flex w-fit items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold ${uc.color}`}
              >
                <uc.icon className="h-4 w-4" />
                {uc.label}
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground">
                {uc.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {uc.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
