import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { QueryProvider } from "@/providers/query-provider.tsx"
import { AuthProvider } from "@/providers/auth-provider.tsx"
import { TooltipProvider } from "@/components/ui/tooltip.tsx"
import { Toaster } from "@/components/ui/sonner.tsx"
import { SocketProvider } from "./context/socket.context"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <SocketProvider>
            <TooltipProvider>
              <App />
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </SocketProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
)
