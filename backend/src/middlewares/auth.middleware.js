import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UnauthorizedError } from "../utils/ApiError.js";
import User from "../models/user.model.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.body?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new UnauthorizedError();
  }

  try {
    const decodedToken = jwt.verify(
      accessToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new UnauthorizedError("Access token is invalid or expired.");
    }

    req.user = user;
    next();
  } catch (error) {
    const isTokenExpired = error.name === "TokenExpiredError";

    throw new UnauthorizedError(
      isTokenExpired ? error.message : "Invalid access token."
    );
  }
});

export { verifyJwt };
