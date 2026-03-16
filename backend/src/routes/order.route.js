import { Router } from "express";
import {
  createOrderController,
  verifyPayment,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/create-order", createOrderController);
router.post("/verify-payment", verifyPayment);

export default router;
