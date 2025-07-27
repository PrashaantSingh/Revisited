import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (!process.env.SMTP_MAIL || !process.env.SMTP_PASSWORD) {
  throw new Error("Missing SMTP credentials from environment");
}
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendOtpEmail(email, otp, subject, purpose) {
  const mailOptions = {
    from: `REVISITED <${process.env.SMTP_MAIL}>`,
    to: email,
    subject: subject,
    html: {
      accountVerification: `<p>Your REVISITED Account Verification OTP is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
      passwordReset: `Your OTP for resetting the password of your REVISITED account is <b>${otp}</b>`,
    }[purpose],
  };

  await transporter.sendMail(mailOptions);
}
