import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface PollStatusBadgeProps {
  status: "ACTIVE" | "INACTIVE" | "COMPLETED"
  expiryTime: string
  className?: string
}

export function PollStatusBadge({
  status,
  expiryTime,
  className,
}: PollStatusBadgeProps) {
  const isExpired = new Date(expiryTime) < new Date()
  const effectiveStatus = status === "ACTIVE" && isExpired ? "EXPIRED" : status

  const config = {
    ACTIVE: {
      label: "Active",
      variant: "default" as const,
      className: "bg-chart-1/15 text-chart-3 border-chart-1/30",
    },
    COMPLETED: {
      label: "Completed",
      variant: "secondary" as const,
      className: "bg-muted text-muted-foreground",
    },
    INACTIVE: {
      label: "Inactive",
      variant: "secondary" as const,
      className: "bg-muted text-muted-foreground",
    },
    EXPIRED: {
      label: "Expired",
      variant: "destructive" as const,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
  }

  const { label, className: statusClass } = config[effectiveStatus]

  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium", statusClass, className)}
    >
      <span
        className={cn(
          "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
          effectiveStatus === "ACTIVE" && "bg-chart-3",
          effectiveStatus === "COMPLETED" && "bg-muted-foreground",
          effectiveStatus === "INACTIVE" && "bg-muted-foreground",
          effectiveStatus === "EXPIRED" && "bg-destructive",
        )}
      />
      {label}
    </Badge>
  )
}
