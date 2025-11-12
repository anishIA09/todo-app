import { Router } from "express";
import {
  logoutController,
  refreshAccessTokenController,
  signinController,
  signupController,
} from "../controllers/auth.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.patch("/refresh-access-token", refreshAccessTokenController);
router.post("/logout", verifyJwt, logoutController);

export default router;
