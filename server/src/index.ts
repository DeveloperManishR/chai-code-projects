import http from "node:http";
import { createServerApplication } from "./app/app.js";
import { env } from "./env.js";
import connectDB from "./db/index.js";
import { initSocket } from "./app/common/utils/socket.js";

async function main() {
  await connectDB();

  const app = createServerApplication();
  const server = http.createServer(app);
  const PORT = Number(env.PORT) || 8000;
  initSocket(server)

  server.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT ${PORT}`);
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────────
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});