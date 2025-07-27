import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastOtpSentAt: { type: Date },
    lastActiveAt: { type: Date, default: null },
    streak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    lastStreakUpdateAt: {
      type: Date,
      default: Date.now,
    },
    totalActiveDays: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashed = await bcrypt.hash(this.password, 10);
  this.password = hashed;
  next();
});
const userModel = mongoose.model("User", userSchema);
export default userModel;
