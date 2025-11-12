import { Router } from "express";
import { userSelfDetailsController } from "../controllers/users.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/self", verifyJwt, userSelfDetailsController);

export default router;
