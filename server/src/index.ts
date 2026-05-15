import http from "node:http";
import { createServerApplication } from "./app/app.js";
import { env } from "./env.js";
import connectDB from "./db/index.js";
import { initSocket } from "./app/common/utils/socket.js";

async function main() {
  await connectDB();


  const server = http.createServer(createServerApplication());
  const PORT = Number(env.PORT) || 8000;
  initSocket(server)

  server.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT ${PORT}`);
  });


}

main().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});