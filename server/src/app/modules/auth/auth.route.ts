import { Router } from "express";
import * as controller from "./auth.controller.js";
import { validate } from "../../common/middleware/validate.middleware.js";
import { registerSchema } from "./dto/register.dto.js";
import { loginSchema } from "./dto/login.dto.js";

const router: Router = Router();

router.post("/register",validate(registerSchema), controller.register);
router.post("/login",validate(loginSchema), controller.login);
router.get("/verify-email/:token", controller.verifyEmail);


export default router;
