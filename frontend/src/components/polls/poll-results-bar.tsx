import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PollResultsBarProps {
  text: string
  votes: number
  totalVotes: number
  index: number
  isSelected?: boolean
}

const barColors = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
  "bg-chart-5",
]

export function PollResultsBar({
  text,
  votes,
  totalVotes,
  index,
  isSelected = false,
}: PollResultsBarProps) {
  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
  const color = barColors[index % barColors.length]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border px-4 py-3 transition-colors",
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-card",
      )}
    >
      {/* Animated fill bar */}
      <motion.div
        className={cn("absolute inset-y-0 left-0 opacity-15", color)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
      />

      {/* Content */}
      <div className="relative flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{text}</span>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-foreground">{percentage}%</span>
          <span className="text-xs text-muted-foreground">
            ({votes} {votes === 1 ? "vote" : "votes"})
          </span>
        </div>
      </div>
    </div>
  )
}
