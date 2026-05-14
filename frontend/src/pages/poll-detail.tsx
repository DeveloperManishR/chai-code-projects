import { useParams, useNavigate, Link } from "react-router"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  Trash2,
  User as UserIcon,
} from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PollQuestion } from "@/components/polls/poll-question"
import { PollStatusBadge } from "@/components/polls/poll-status-badge"
import { ErrorAlert } from "@/components/shared/error-alert"
import { usePoll, useVotePoll, useDeletePoll } from "@/hooks/use-polls"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function PollDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { data: poll, isLoading, isError, refetch } = usePoll(id!)
  const voteMutation = useVotePoll()
  const deleteMutation = useDeletePoll()

  // Track which option is selected per question
  const [selections, setSelections] = React.useState<Record<number, number>>({})
  const [hasVoted, setHasVoted] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  const isOwner = user?._id === (poll?.userId as { _id: string })?._id
  const isActive =
    poll?.status === "ACTIVE" && new Date(poll.expiryTime) > new Date()
  const canVote = isAuthenticated && isActive && !hasVoted

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setSelections((prev) => ({ ...prev, [questionIndex]: optionIndex }))
  }

  const handleVote = async (questionIndex: number) => {
    const optionIndex = selections[questionIndex]
    if (optionIndex === undefined || !id) return

    try {
      await voteMutation.mutateAsync({
        id,
        data: { questionIndex, optionIndex },
      })
      setHasVoted(true)
      toast.success("Vote recorded!")
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to vote. Please try again."
      toast.error(message)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteMutation.mutateAsync(id)
      toast.success("Poll deleted")
      navigate("/", { replace: true })
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete poll."
      toast.error(message)
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-full max-w-lg" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !poll) {
    return (
      <ErrorAlert
        message="Could not load this poll. It may have been deleted or doesn't exist."
        onRetry={() => refetch()}
      />
    )
  }

  const authorName =
    typeof poll.userId === "object" ? poll.userId.name : "Unknown"

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back link */}
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to polls
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {poll.title}
            </h1>
            <p className="max-w-2xl text-muted-foreground leading-relaxed">
              {poll.description}
            </p>
          </div>

          <PollStatusBadge
            status={poll.status}
            expiryTime={poll.expiryTime}
          />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UserIcon className="h-4 w-4" />
            {authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Created {formatDate(poll.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            Expires {formatDate(poll.expiryTime)}
          </span>
        </div>

        {isOwner && (
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete Poll
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this poll?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All votes and data for this poll
                  will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Separator />

      {/* Questions */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">
          Questions ({poll.questions.length})
        </h2>

        {poll.questions.map((question, qIdx) => (
          <div key={question._id} className="space-y-3">
            <PollQuestion
              question={question}
              questionIndex={qIdx}
              showResults={!canVote || hasVoted}
              selectedOption={selections[qIdx]}
              onSelect={handleSelect}
              disabled={!canVote}
            />

            {canVote && selections[qIdx] !== undefined && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex justify-end"
              >
                <Button
                  size="sm"
                  onClick={() => handleVote(qIdx)}
                  disabled={voteMutation.isPending}
                >
                  {voteMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Vote
                </Button>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {!isAuthenticated && (
        <div className="rounded-xl border border-border bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>{" "}
            to vote on this poll.
          </p>
        </div>
      )}
    </motion.div>
  )
}
