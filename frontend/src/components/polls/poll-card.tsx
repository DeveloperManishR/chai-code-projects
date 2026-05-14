import { Link } from "react-router"
import { motion } from "framer-motion"
import { Clock, MessageSquare, User as UserIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PollStatusBadge } from "./poll-status-badge"
import type { Poll } from "@/types"

interface PollCardProps {
  poll: Poll
  index?: number
}

function getTimeRemaining(expiryTime: string): string {
  const diff = new Date(expiryTime).getTime() - Date.now()
  if (diff <= 0) return "Expired"
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ${hours % 24}h left`
  if (hours > 0) return `${hours}h left`
  const minutes = Math.floor(diff / (1000 * 60))
  return `${minutes}m left`
}

function getTotalVotes(poll: Poll): number {
  return poll.questions.reduce(
    (total, q) => total + q.options.reduce((sum, o) => sum + o.votes, 0),
    0,
  )
}

export function PollCard({ poll, index = 0 }: PollCardProps) {
  const totalVotes = getTotalVotes(poll)
  const authorName =
    typeof poll.userId === "object" ? poll.userId.name : "Unknown"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
    >
      <Link to={`/polls/${poll._id}`} className="group block">
        <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 gap-0 py-0">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                {poll.title}
              </h3>
              <PollStatusBadge
                status={poll.status}
                expiryTime={poll.expiryTime}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pb-5 px-5">
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {poll.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <UserIcon className="h-3.5 w-3.5" />
                {authorName}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {poll.questions.length}{" "}
                {poll.questions.length === 1 ? "question" : "questions"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {getTimeRemaining(poll.expiryTime)}
              </span>
              <span className="ml-auto font-medium text-foreground">
                {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
