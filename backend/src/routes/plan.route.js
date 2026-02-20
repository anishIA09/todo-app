import { Router } from "express";
import {
  createPlanController,
  getAllPlansController,
} from "../controllers/plan.controller.js";

const router = Router();

router.post("/", createPlanController);
router.get("/", getAllPlansController);

export default router;
