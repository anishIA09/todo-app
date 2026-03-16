import { asyncHandler } from "../utils/asyncHandler.js";
import Plan from "../models/plan.model.js";
import { BadRequestError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Order from "../models/order.model.js";
import crypto from "crypto";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrderController = asyncHandler(async (req, res) => {
  const { billing, locations, features } = req.body;

  const plans = await Plan.find();

  let totalAmount = 0;

  features.forEach((feature) => {
    const plan = plans.find((plan) => plan.featureKey === feature);

    if (!plan) {
      throw new BadRequestError("Invalid plan.");
    }

    const pricePerLocation = plan.pricing[billing];

    totalAmount += pricePerLocation * locations;
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: totalAmount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    notes: {
      billing,
      locations,
      features,
    },
  });

  await Order.create({
    billing,
    locations,
    features,
    amount: totalAmount,
    currency: "INR",
    status: "pending",
    razorpayOrderId: razorpayOrder.id,
  });

  return res.status(200).json(
    new ApiResponse(200, {
      messsage: "",
      data: razorpayOrder,
    }),
  );
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: "paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      },
    );

    return res.json({ success: true });
  } else {
    return res.status(400).json({ success: false });
  }
});

export { createOrderController, verifyPayment };
