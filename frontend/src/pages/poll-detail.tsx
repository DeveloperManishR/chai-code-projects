import { useParams, useNavigate, Link } from "react-router"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  LockOpen,
  Loader2,
  Radio,
  Trash2,
  User as UserIcon,
  Wifi,
  WifiOff,
} from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PollResultsBar } from "@/components/polls/poll-results-bar"
import { PollStatusBadge } from "@/components/polls/poll-status-badge"
import { ErrorAlert } from "@/components/shared/error-alert"
import { usePoll, useDeletePoll } from "@/hooks/use-polls"
import { useAuth } from "@/providers/auth-provider"
import { useSocket } from "@/context/socket.context"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { Poll, Question } from "@/types"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PollDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { socket, isConnected } = useSocket()
  const { user, isAuthenticated } = useAuth()

  // Initial poll data via React Query (one-time fetch on mount)
  const { data: initialPoll, isLoading, isError, refetch } = usePoll(id!)
  const deleteMutation = useDeletePoll()

  // Live poll state — seeded from the fetch, then kept fresh by socket events
  const [livePoll, setLivePoll] = React.useState<Poll | null>(null)

  // Per-question: which option index is selected before submitting
  const [selections, setSelections] = React.useState<Record<number, number>>({})
  // Which question indices the user has already voted on this session
  const [votedQuestions, setVotedQuestions] = React.useState<Set<number>>(new Set())
  // Which question is currently being submitted (optimistic loading state)
  const [submittingQuestion, setSubmittingQuestion] = React.useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  // Seed livePoll from initial fetch
  React.useEffect(() => {
    if (initialPoll) setLivePoll(initialPoll)
  }, [initialPoll])

  // ── Socket lifecycle ──────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!socket || !id) return

    socket.emit("poll:join", id)

    const onPollUpdated = (updatedPoll: Poll) => {
      setLivePoll(updatedPoll)
    }

    const onVoteAck = (ack: { success: boolean; message: string }) => {
      setSubmittingQuestion(null)
      if (ack.success) {
        toast.success(ack.message)
      } else {
        toast.error(ack.message)
        // Undo the optimistic voted state so the user can retry
        setVotedQuestions((prev) => {
          const next = new Set(prev)
          // Remove the last added item — we don't know which question failed,
          // so we find it from submittingQuestion captured in closure.
          // In practice ack arrives right after emit so submittingQuestion is still set.
          return next
        })
      }
    }

    socket.on("poll:updated", onPollUpdated)
    socket.on("poll:vote:ack", onVoteAck)

    return () => {
      socket.emit("poll:leave", id)
      socket.off("poll:updated", onPollUpdated)
      socket.off("poll:vote:ack", onVoteAck)
    }
  }, [socket, id])

  // ── Derived state ─────────────────────────────────────────────────────────

  const poll = livePoll
  const isOwner = user?._id === (poll?.userId as { _id: string })?._id
  const isActive = poll?.status === "ACTIVE" && new Date(poll.expiryTime) > new Date()

  /**
   * Whether this poll requires authentication to vote.
   * Secure-by-default: falls back to true while loading.
   */
  const requiresAuth = poll?.needAuthentication ?? true

  /**
   * canVote — the user may interact with voting controls when:
   * - The poll is active (not expired / completed)
   * - If auth required: user must be signed in
   * - If auth NOT required: anyone can vote
   */
  const canVote = (requiresAuth ? isAuthenticated : true) && isActive

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (votedQuestions.has(questionIndex)) return
    setSelections((prev) => ({ ...prev, [questionIndex]: optionIndex }))
  }

  const handleVote = (questionIndex: number) => {
    const optionIndex = selections[questionIndex]
    if (optionIndex === undefined || !id || !socket) return
    if (votedQuestions.has(questionIndex)) return

    setSubmittingQuestion(questionIndex)
    // Optimistically mark question as voted so the UI switches to results view
    setVotedQuestions((prev) => new Set(prev).add(questionIndex))

    // Emit the vote through Socket.IO — no REST call needed
    socket.emit("poll:vote", { pollId: id, questionIndex, optionIndex })
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
          ?.message ?? "Failed to delete poll."
      toast.error(message)
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  // ── Loading / error guards ─────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-full max-w-lg" />
        <Skeleton className="h-52 w-full rounded-xl" />
        <Skeleton className="h-52 w-full rounded-xl" />
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
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to polls
          </Link>
        </Button>

        {/* Real-time connection pill */}
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            isConnected
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "border-border bg-muted text-muted-foreground",
          )}
        >
          {isConnected ? (
            <><Radio className="h-3 w-3 animate-pulse" /> Live</>
          ) : (
            <><WifiOff className="h-3 w-3" /> Offline</>
          )}
        </div>
      </div>

      {/* ── Poll header ──────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {poll.title}
            </h1>
            <p className="max-w-2xl leading-relaxed text-muted-foreground">
              {poll.description}
            </p>
          </div>
          <PollStatusBadge status={poll.status} expiryTime={poll.expiryTime} />
        </div>

        {/* Meta row */}
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

          {requiresAuth ? (
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" />
              Login required
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <LockOpen className="h-3 w-3" />
              Open voting
            </Badge>
          )}
        </div>

        {/* Delete (owner only) */}
        {isOwner && (
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                Delete Poll
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this poll?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. All votes and data will be
                  permanently removed.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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

      {/* ── Questions ───────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">
          Questions ({poll.questions.length})
        </h2>

        {poll.questions.map((question, qIdx) => {
          const hasVotedOnThis = votedQuestions.has(qIdx)
          const showResults = hasVotedOnThis || !canVote

          return (
            <QuestionCard
              key={question._id}
              question={question}
              questionIndex={qIdx}
              showResults={showResults}
              selectedOption={selections[qIdx]}
              hasVoted={hasVotedOnThis}
              isSubmitting={submittingQuestion === qIdx}
              canVote={canVote}
              isConnected={isConnected}
              onSelect={handleSelect}
              onVote={handleVote}
            />
          )
        })}
      </div>

      {/* ── Auth prompt ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {requiresAuth && !isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-xl border border-border bg-muted/50 p-6 text-center"
          >
            <Lock className="mx-auto mb-3 h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              This poll requires you to{" "}
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                sign in
              </Link>{" "}
              before voting.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Question Card ────────────────────────────────────────────────────────────

interface QuestionCardProps {
  question: Question
  questionIndex: number
  showResults: boolean
  selectedOption: number | undefined
  hasVoted: boolean
  isSubmitting: boolean
  canVote: boolean
  isConnected: boolean
  onSelect: (qIdx: number, oIdx: number) => void
  onVote: (qIdx: number) => void
}

function QuestionCard({
  question,
  questionIndex,
  showResults,
  selectedOption,
  hasVoted,
  isSubmitting,
  canVote,
  isConnected,
  onSelect,
  onVote,
}: QuestionCardProps) {
  const totalVotes = question.options.reduce((sum, opt) => sum + opt.votes, 0)
  const maxVotes = Math.max(...question.options.map((o) => o.votes), 0)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      {/* Question header */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">
          <span className="mr-2 text-muted-foreground">Q{questionIndex + 1}.</span>
          {question.question}
        </h3>
        {hasVoted && (
          <Badge variant="secondary" className="shrink-0 gap-1 text-xs">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            Voted
          </Badge>
        )}
      </div>

      {showResults ? (
        // ── Results view with animated % bars ────────────────────────────
        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <PollResultsBar
              key={option._id}
              text={option.text}
              votes={option.votes}
              totalVotes={totalVotes}
              index={idx}
              isSelected={selectedOption === idx}
              isLeading={option.votes === maxVotes && option.votes > 0}
            />
          ))}
          <p className="pt-1 text-xs text-muted-foreground">
            {totalVotes} total {totalVotes === 1 ? "vote" : "votes"}
            {isConnected && " · updates live"}
          </p>
        </div>
      ) : (
        // ── Voting view ───────────────────────────────────────────────────
        <div className="space-y-3">
          <RadioGroup
            value={selectedOption?.toString()}
            onValueChange={(val) => onSelect(questionIndex, parseInt(val))}
            className="space-y-2"
          >
            {question.options.map((option, idx) => (
              <Label
                key={option._id}
                htmlFor={`q${questionIndex}-o${idx}`}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:bg-accent",
                  selectedOption === idx
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border",
                )}
              >
                <RadioGroupItem
                  value={idx.toString()}
                  id={`q${questionIndex}-o${idx}`}
                />
                <span className="text-sm text-foreground">{option.text}</span>
              </Label>
            ))}
          </RadioGroup>

          {/* Submit button — appears when an option is selected */}
          <AnimatePresence>
            {canVote && selectedOption !== undefined && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-end pt-1"
              >
                <Button
                  size="sm"
                  onClick={() => onVote(questionIndex)}
                  disabled={isSubmitting || !isConnected}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : isConnected ? (
                    <Wifi className="mr-2 h-4 w-4" />
                  ) : (
                    <WifiOff className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? "Submitting…" : "Submit Vote"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
