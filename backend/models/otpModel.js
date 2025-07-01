import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    }, // 'accountVerification' or 'passwordReset'
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("OTP", otpSchema);
