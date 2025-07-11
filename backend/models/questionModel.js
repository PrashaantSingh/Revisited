import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    problemStatement: {
      type: String,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    algorithm: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    link: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastRevisedAt: {
      type: Date,
      default: Date.now,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interval: { type: Number, default: 2 },
    repetitions: { type: Number, default: 1 },
    easinessFactor: { type: Number, default: 2.5 },
    nextReviewDate: {
      type: Date,
      default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
    revisedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
