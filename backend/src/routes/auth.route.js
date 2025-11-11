import { Router } from "express";
import { signupController } from "../controllers/auth.controller.js";

const router = Router();

router.post("/signup", signupController);

export default router;
