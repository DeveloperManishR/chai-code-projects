import { Router } from "express";
import type { Router as RouterType } from "express";
import * as controller from "./polling.controller.js";
import {
  authenticate,
//  optionalAuthenticate,
} from "../../common/middleware/auth.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { createPollSchema } from "./dto/polling.dto.js";

const router: RouterType = Router();

// Public routes
router.get("/", controller.getAllPolls);
router.get("/:id", controller.getPollById);

// Authenticated routes
router.post("/", authenticate, validate(createPollSchema), controller.createPoll);
router.delete("/:id", authenticate, controller.deletePoll);

// Vote route: optionalAuthenticate so needAuthentication=false polls work without a token
// Note: voting is now handled primarily via Socket.IO (poll:vote event).
// This REST endpoint is kept as a fallback.
router.post("/:id/vote", controller.votePoll);


router.patch("/update/:id", authenticate ,controller.updatePoll)

router.get('/:id/analytics',controller.getPollAnalytics)

export default router;
