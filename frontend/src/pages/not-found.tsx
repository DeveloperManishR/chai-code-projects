import { Link } from "react-router"
import { motion } from "framer-motion"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="space-y-2">
          <h1 className="text-7xl font-bold tracking-tighter text-foreground">
            404
          </h1>
          <div className="mx-auto h-1 w-12 rounded-full bg-primary" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Page not found
          </h2>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>
        </div>

        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}
