import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    feature: String,
    pricing: {
      monthly: Number,
      quaterly: Number,
      yearly: Number,
    },
    description: String,
    featureKey: String,
  },
  {
    timestamps: true,
  },
);

const Plan = mongoose.model("Plan", PlanSchema);

export default Plan;
