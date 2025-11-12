import User from "../models/user.model.js";
import { NotFoundError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userSelfDetailsController = asyncHandler(async (req, res) => {
  const authenticatedUser = req.user;

  const user = await User.findById(authenticatedUser._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  const data = {
    _id: user._id,
    username: user.username,
    isEmailVerified: user.isEmailVerified,
  };

  if (user?.email) {
    data.email = user.email;
  }

  return res.status(200).json(
    new ApiResponse(200, {
      message: "User details fetched successfully.",
      data,
    })
  );
});

export { userSelfDetailsController };
