import User from "../models/user.model.js";
import { BadRequestError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signupController = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError(`Username or password is required.`);
  }

  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  });

  if (user) {
    throw new BadRequestError("This username or email is already taken.");
  }

  const newUser = await User.create({
    username,
    password,
  });

  const accessToken = newUser.generateAccessToken();
  const refreshToken = newUser.generateRefreshToken();

  newUser.refreshToken = refreshToken;

  await newUser.save();

  const data = {
    _id: newUser._id,
    username: newUser.username,
    isEmailVerified: newUser.isEmailVerified,
    refreshToken,
    accessToken,
  };

  if (newUser?.email) {
    data.email = newUser.email;
  }

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(201).json(
    new ApiResponse(201, {
      message: "User created successfully.",
      data,
    })
  );
});

export { signupController };
