import User from "../models/user.model.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

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
    sameSite: "none",
  };

  return res
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .status(201)
    .json(
      new ApiResponse(201, {
        message: "User created successfully.",
        data,
      }),
    );
});

const signinController = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError(`Username or password is required.`);
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new NotFoundError("Username is invalid.");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new BadRequestError("Password is incorrect.");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });

  const data = {
    _id: user._id,
    username: user.username,
    isEmailVerified: user.isEmailVerified,
  };

  if (user?.email) {
    data.email = user.email;
  }

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return res.status(200).json(
    new ApiResponse(200, {
      message: "User loggedin successfully.",
      data,
    }),
  );
});

const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new UnauthorizedError();
  }

  try {
    const decoedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decoedToken._id);

    if (!user) {
      throw new UnauthorizedError("Invalid refresh token.");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new UnauthorizedError("Refresh token is invalid or expired.");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    };

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .status(201)
      .json(
        new ApiResponse(200, {
          message: "Access token refresh.",
          data: {
            accessToken,
            refreshToken,
          },
        }),
      );
  } catch (error) {
    const isTokenExpired = error.name === "TokenExpiredError";

    if (isTokenExpired) {
      const decoedToken = jwt.decode(incomingRefreshToken);

      await User.findByIdAndUpdate(
        decoedToken._id,
        {
          $unset: {
            refreshToken: 1,
          },
        },
        { new: true },
      );

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
    }

    throw new UnauthorizedError(
      isTokenExpired ? error.message : "Invalid access token.",
    );
  }
});

const logoutController = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .status(200)
    .json(
      new ApiResponse(200, {
        message: "User logout successfully.",
      }),
    );
});

export {
  signupController,
  signinController,
  refreshAccessTokenController,
  logoutController,
};
