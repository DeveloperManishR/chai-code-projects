import type { Request, Response } from "express";
import Poll from "./polling.model.js";
import ApiResponse from "../../common/utils/api-response.js";
import ApiError from "../../common/utils/api-error.js";
import { asyncHandler } from "../../common/utils/helper.js";

// ─── Create Poll ────────────────────────────────────────────────────────────
const createPoll = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, questions, expiryTime ,needAuthentication} = req.body;
  const userId = req.user?._id;

  if (!userId) {
    throw ApiError.unauthorized("Authentication required");
  }

  const poll = await Poll.create({
    userId,
    title,
    description,
    questions,
    needAuthentication,
    expiryTime: new Date(expiryTime),
  });

  ApiResponse.created(res, "Poll created successfully", poll);
});

// ─── Get All Polls ──────────────────────────────────────────────────────────
const getAllPolls = asyncHandler(async (_req: Request, res: Response) => {
  const polls = await Poll.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  ApiResponse.ok(res, "Polls fetched successfully", polls);
});

// ─── Get Poll By ID ─────────────────────────────────────────────────────────
const getPollById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const poll = await Poll.findById(id).populate("userId", "name email");

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  ApiResponse.ok(res, "Poll fetched successfully", poll);
});

// ─── Vote on a Poll ─────────────────────────────────────────────────────────
const votePoll = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { questionIndex, optionIndex } = req.body;

  const poll = await Poll.findById(id);

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  // Enforce auth only when the poll creator requires it
  if (poll.needAuthentication && !req.user) {
    throw ApiError.unauthorized("You must be logged in to vote on this poll");
  }

  if (poll.status !== "ACTIVE") {
    throw ApiError.badRequest("This poll is no longer active");
  }

  if (new Date() > poll.expiryTime) {
    poll.status = "COMPLETED";
    await poll.save();
    throw ApiError.badRequest("This poll has expired");
  }

  const question = poll.questions[questionIndex];
  if (!question) {
    throw ApiError.badRequest("Invalid question index");
  }

  const option = question.options[optionIndex];
  if (!option) {
    throw ApiError.badRequest("Invalid option index");
  }

  option.votes += 1;
  await poll.save();

  ApiResponse.ok(res, "Vote recorded successfully", poll);
});

// ─── Delete Poll ────────────────────────────────────────────────────────────
const deletePoll = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  const poll = await Poll.findById(id);

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  if (poll.userId.toString() !== userId) {
    throw ApiError.forbidden("You can only delete your own polls");
  }

  await Poll.findByIdAndDelete(id);

  ApiResponse.ok(res, "Poll deleted successfully");
});

export { createPoll, getAllPolls, getPollById, votePoll, deletePoll };
