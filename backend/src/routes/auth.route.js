import { Router } from "express";
import {
  refreshAccessTokenController,
  signinController,
  signupController,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.patch("/refresh-access-token", refreshAccessTokenController);

export default router;
