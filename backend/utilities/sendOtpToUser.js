import OTP from "../models/otpModel.js";
import { generateOtp } from "./generateOtp.js";
import { sendOtpEmail } from "./sendOtpEmail.js";

export async function sendOtpToUser(email, subject, purpose) {
  try {
    if (!email) throw new Error("Email is required");
    if (!purpose) throw new Error("Purpose is required");

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

    await OTP.deleteMany({ email, purpose });
    await OTP.create({ email, otp, expiresAt, purpose });

    await sendOtpEmail(email, otp, subject, purpose);
    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw new Error("Could not send OTP. Please try again.");
  }
}
