import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const authToken = asyncHandler(async (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split("Bearer ")[1];

  if (!token) {
    res.status(401);
    throw new Error("Unauthorized! Cannot find the token.");
  }
  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken.userId).select("-password");

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Unauthorized! Failed to authenticate the token.");
  }
});

const authAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Unauthorized! Not the admin.");
  }
};

export { authToken, authAdmin };
