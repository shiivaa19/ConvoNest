import jwt from "jsonwebtoken";
import "dotenv/config";
import { findUserById } from "../models/userQueries.js";

//  middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await findUserById(decoded.userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
