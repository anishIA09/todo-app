import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    billing: {
      type: String,
      enum: ["monthly", "quaterly", "yearly"],
      required: true,
    },
    locations: Number,
    features: [
      {
        type: String,
        enum: ["REVIEW", "CAMPAIGN", "POST", "REPORT", "AI"],
      },
    ],
    amount: Number,
    currency: String,
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paidAt: Date,
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
