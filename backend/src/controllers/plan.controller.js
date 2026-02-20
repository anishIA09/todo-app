import Plan from "../models/plan.model.js";
import { BadRequestError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlanController = asyncHandler(async (req, res) => {
  const body = req.body;

  const existingPlan = await Plan.findOne({ featureKey: body.featureKey });

  if (existingPlan) {
    throw new BadRequestError("This plan is already exist.");
  }

  const newPlan = await Plan.create(body);

  return res.status(201).json(
    new ApiResponse(200, {
      message: "Plan created successfully.",
      data: newPlan,
    }),
  );
});

const getAllPlansController = asyncHandler(async (req, res) => {
  const plans = await Plan.find({});

  return res.status(200).json(
    new ApiResponse(200, {
      message: "Plans fetched successfully.",
      data: plans,
    }),
  );
});

export { createPlanController, getAllPlansController };
