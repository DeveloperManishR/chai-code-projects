import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// ─── Types ───────────────────────────────────────────────────────────────────

interface PollResultsBarProps {
  text: string
  votes: number
  totalVotes: number
  index: number
  /** Highlight this bar as the user's own selection. */
  isSelected?: boolean
  /** Whether this option is leading the poll. */
  isLeading?: boolean
}

// ─── Color palette ────────────────────────────────────────────────────────────
// Each color has a fill class and a text-on-fill class for contrast.

const BAR_COLORS = [
  { fill: "bg-blue-500",   light: "bg-blue-500/20",   text: "text-blue-600 dark:text-blue-400"   },
  { fill: "bg-violet-500", light: "bg-violet-500/20", text: "text-violet-600 dark:text-violet-400" },
  { fill: "bg-emerald-500",light: "bg-emerald-500/20",text: "text-emerald-600 dark:text-emerald-400"},
  { fill: "bg-amber-500",  light: "bg-amber-500/20",  text: "text-amber-600 dark:text-amber-400"  },
  { fill: "bg-rose-500",   light: "bg-rose-500/20",   text: "text-rose-600 dark:text-rose-400"    },
  { fill: "bg-cyan-500",   light: "bg-cyan-500/20",   text: "text-cyan-600 dark:text-cyan-400"    },
]

// ─── Component ───────────────────────────────────────────────────────────────

export function PollResultsBar({
  text,
  votes,
  totalVotes,
  index,
  isSelected = false,
  isLeading = false,
}: PollResultsBarProps) {
  const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0
  const color = BAR_COLORS[index % BAR_COLORS.length]

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all duration-300",
        isSelected
          ? "border-primary ring-1 ring-primary/40"
          : "border-border",
        isLeading && "shadow-sm",
      )}
    >
      {/* ── Animated fill track ─────────────────────────────────────────── */}
      <motion.div
        className={cn("absolute inset-y-0 left-0", color.light)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.06 }}
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative flex items-center justify-between gap-3 px-4 py-3">
        {/* Option label */}
        <div className="flex items-center gap-2 min-w-0">
          {isSelected && (
            <span className="flex h-2 w-2 shrink-0 rounded-full bg-primary" />
          )}
          <span
            className={cn(
              "truncate text-sm font-medium",
              isSelected ? "text-foreground" : "text-foreground/80",
            )}
          >
            {text}
          </span>
          {isLeading && totalVotes > 0 && (
            <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              Leading
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex shrink-0 items-baseline gap-1.5">
          <motion.span
            key={percentage}
            className={cn("text-sm font-bold tabular-nums", color.text)}
            initial={{ opacity: 0.6, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {percentage}%
          </motion.span>
          <span className="text-xs text-muted-foreground tabular-nums">
            ({votes} {votes === 1 ? "vote" : "votes"})
          </span>
        </div>
      </div>

      {/* ── Percentage label inside fill (visible when fill is wide enough) */}
      {percentage >= 20 && (
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }} // kept hidden — text overlay in content row is enough
        />
      )}
    </div>
  )
}
