import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "node:http";
import { env } from "../../../env.js";
import Poll from "../../modules/polling/polling.model.js";

// ─── Types ───────────────────────────────────────────────────────────────────

interface VotePayload {
  pollId: string;
  questionIndex: number;
  optionIndex: number;
}

export function initSocket(server: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // ── Join a poll room ────────────────────────────────────────────────────
    socket.on("poll:join", (pollId: string) => {
      socket.join(pollId);
      console.log(`[Socket] ${socket.id} joined room: ${pollId}`);
    });

    // ── Leave a poll room ───────────────────────────────────────────────────
    socket.on("poll:leave", (pollId: string) => {
      socket.leave(pollId);
      console.log(`[Socket] ${socket.id} left room: ${pollId}`);
    });

    // ── Cast a vote ─────────────────────────────────────────────────────────
    socket.on("poll:vote", async (payload: VotePayload) => {
      const { pollId, questionIndex, optionIndex } = payload;

      try {
        const poll = await Poll.findById(pollId);

        if (!poll) {
          socket.emit("poll:vote:ack", {
            success: false,
            message: "Poll not found",
          });
          return;
        }

        if (poll.status !== "ACTIVE") {
          socket.emit("poll:vote:ack", {
            success: false,
            message: "This poll is no longer active",
          });
          return;
        }

        if (new Date() > poll.expiryTime) {
          poll.status = "COMPLETED";
          await poll.save();
          socket.emit("poll:vote:ack", {
            success: false,
            message: "This poll has expired",
          });
          return;
        }

        const question = poll.questions[questionIndex];
        if (!question) {
          socket.emit("poll:vote:ack", {
            success: false,
            message: "Invalid question index",
          });
          return;
        }

        const option = question.options[optionIndex];
        if (!option) {
          socket.emit("poll:vote:ack", {
            success: false,
            message: "Invalid option index",
          });
          return;
        }

        option.votes += 1;
        await poll.save();

        // Acknowledge the voter
        socket.emit("poll:vote:ack", { success: true, message: "Vote recorded!" });

        // Broadcast the fresh poll state to everyone in the room (including voter)
        io.to(pollId).emit("poll:updated", poll.toObject());

        console.log(
          `[Socket] Vote recorded on poll ${pollId} — Q${questionIndex} O${optionIndex}`
        );
      } catch (err) {
        console.error("[Socket] poll:vote error:", err);
        socket.emit("poll:vote:ack", {
          success: false,
          message: "An error occurred while recording your vote",
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });

  return io;
}