import express from "express";
import User from "../models/userModel.js";
import authorize from "../middlewares/authorize.js";
const router = express.Router();

router.get("/users", authorize, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access!",
      });
    }

    const allUsers = await User.find({ isVerified: true }).select("-password");

    return res.status(200).json({
      success: true,
      users: allUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
