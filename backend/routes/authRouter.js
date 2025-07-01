import express from "express";
import User from "../models/userModel.js";
import generateToken from "../utilities/generateToken.js";
import jwt from "jsonwebtoken";
import authorize from "../middlewares/authorize.js";
import OTP from "../models/otpModel.js";
import { sendOtpToUser } from "../utilities/sendOtpToUser.js";

const router = express.Router();
//SIGNUP
// router.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password, confirmPassword } = req.body || {};
//     console.log(name, email, password, confirmPassword);
//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide all the fields.",
//       });
//     }

//     if (password !== confirmPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Password and Confirm Password need to be the same.",
//       });
//     }

//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists.",
//       });
//     }

//     user = await User.create({
//       name,
//       email,
//       password,
//     });

//     const token = generateToken(process.env.JWT_SECRET, user._id);

//     return res.status(201).json({
//       success: true,
//       user: {
//         name: user.name,
//         email: user.email,
//         id: user._id,
//       },
//       token,
//     });
//   } catch (error) {
//     console.log("Signup error: ", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// });

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body || {};

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the fields.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password must match.",
      });
    }

    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      isVerified: false,
      role: "user",
    });

    await sendOtpToUser(
      email,
      "Account Verification OTP",
      "accountVerification"
    );

    return res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email with OTP.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Server error. Try again.",
        errMsg: error.message,
      });
    }
  }
});

//Login
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the fields.",
        email: typeof email,
        password,
        body: typeof req.body,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist.",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Account not verified. Please verify your email first.",
      });
    }

    if (!(await user.verifyPassword(password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials.",
      });
    }

    const token = generateToken(process.env.JWT_SECRET, user._id);
    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        id: user._id,
      },
      token,
    });
  } catch (error) {
    console.log("Signin error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//GET USER
router.get("/me", authorize, async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized! Access Denied.",
    });
  }
});

// OTP VERIFICATION
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const generatedOtp = await OTP.findOne({
    email,
    purpose: "accountVerification",
  });

  if (!generatedOtp) {
    return res.status(400).json({ message: "OTP not found." });
  }

  if (generatedOtp.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "incorrect otp",
    });
  }

  if (generatedOtp.expiresAt < new Date()) {
    return res.status(400).json({
      success: false,
      message: "OTP has expired. Please request a new one.",
    });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found." });

  user.isVerified = true;
  await user.save();
  await OTP.deleteOne({ email, purpose: "accountVerification" });

  const token = generateToken(process.env.JWT_SECRET, user._id);

  return res.status(200).json({
    success: true,
    message: "Account verified successfully.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
});

// Request password reset
router.post("/request-password-reset", async (req, res) => {
  const { userEmail } = req.body;
  const user = await User.findOne({ email: userEmail });
  if (!user)
    return res
      .status(200)
      .json({ message: "If this email exists, an OTP has been sent." });
  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Unverified Account.",
    });
  }
  await sendOtpToUser(userEmail, "Password Reset OTP", "passwordReset");
  return res.status(200).json({ message: "sent to the mail" });
});

// Verify password reset OTP
router.post("/verify-password-reset-otp", async (req, res) => {
  const { userEmail, otp } = req.body;
  const record = await OTP.findOne({
    email: userEmail,
    otp,
    purpose: "passwordReset",
  });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }
  return res.status(200).json({ message: "OTP verified." });
});

// Set new password
router.post("/reset-password", async (req, res) => {
  const { userEmail, otp, newPassword } = req.body;
  const record = await OTP.findOne({
    email: userEmail,
    otp,
    purpose: "passwordReset",
  });
  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP." });
  }
  const user = await User.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ message: "User not found." });

  user.password = newPassword;
  await user.save();
  await OTP.deleteOne({ email: userEmail, purpose: "passwordReset" });

  return res.status(200).json({ message: "Password reset successful." });
});

router.post("/send-otp", async (req, res) => {
  const { email, type } = req.body;
  console.log(email, type);

  const subject =
    type === "accountVerification"
      ? "Account Verification OTP"
      : "Password Reset OTP";
  await sendOtpToUser(email, subject, type);
  res.json({ message: "OTP sent successfully." });
});

export default router;
