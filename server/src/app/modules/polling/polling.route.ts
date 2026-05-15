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

router.get("/", controller.getAllPolls);
router.get("/:id", controller.getPollById);

router.post("/", authenticate, validate(createPollSchema), controller.createPoll);
router.delete("/:id", authenticate, controller.deletePoll);


// router.post("/:id/vote", controller.votePoll);


router.patch("/update/:id", authenticate ,controller.updatePoll)

router.get('/:id/analytics',controller.getPollAnalytics)

export default router;
