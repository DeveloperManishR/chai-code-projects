import { useNavigate } from "react-router"
import { motion } from "framer-motion"
import { BarChart3, PlusCircle, Search, TrendingUp } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { PollCard } from "@/components/polls/poll-card"
import { EmptyState } from "@/components/shared/empty-state"
import { ErrorAlert } from "@/components/shared/error-alert"
import { usePolls } from "@/hooks/use-polls"
import { useAuth } from "@/providers/auth-provider"

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const { data: polls, isLoading, isError, refetch } = usePolls()
  const navigate = useNavigate()
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    if (!polls) return []
    if (!search.trim()) return polls
    const q = search.toLowerCase()
    return polls.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }, [polls, search])

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.section
        className="space-y-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <BarChart3 className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Create & Vote on Polls
        </h1>
        <p className="mx-auto max-w-lg text-muted-foreground">
          Share your questions with the world, gather opinions, and see
          real-time results. Democracy, one vote at a time.
        </p>

        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/polls/create")}
              className="mt-2"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create a Poll
            </Button>
          </motion.div>
        )}
      </motion.section>

      {/* Search & Stats Bar */}
      <motion.div
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search polls…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {polls && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>
              {polls.length} {polls.length === 1 ? "poll" : "polls"} available
            </span>
          </div>
        )}
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-border p-5">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorAlert
          message="Failed to load polls. Please check your connection and try again."
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        search.trim() ? (
          <EmptyState
            icon={Search}
            title="No polls found"
            description={`No polls match "${search}". Try a different search term.`}
          />
        ) : (
          <EmptyState
            title="No polls yet"
            description="Be the first to create a poll and start gathering opinions!"
            actionLabel={isAuthenticated ? "Create Poll" : undefined}
            onAction={
              isAuthenticated ? () => navigate("/polls/create") : undefined
            }
          />
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((poll, index) => (
            <PollCard key={poll._id} poll={poll} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
