import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import isSameDay from "../utilities/isSameDay.js";

export default async function authorize(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      req.user = user;

      const now = new Date();
      const lastActive = user.lastActiveAt ? new Date(user.lastActiveAt) : null;

      if (user.totalActiveDays === undefined || user.totalActiveDays === null) {
        user.totalActiveDays = 0;
      }

      if (!lastActive || !isSameDay(lastActive, now)) {
        user.totalActiveDays += 1;
      } else if (isSameDay(lastActive, now) && user.totalActiveDays === 0) {
        user.totalActiveDays += 1;
      }

      user.lastActiveAt = now;
      await user.save();

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
      token: req.headers.authorization,
    });
  }
}
