import express from "express";
import Question from "../models/questionModel.js";
import authorize from "../middlewares/authorize.js";
import updateStreak from "../middlewares/updateStreak.js";
import User from "../models/userModel.js";

// import {
//   getQuestions,
//   getQuestionById,
//   addQuestion,
//   updateQuestion,
//   deleteQuestion,
//   markQuestionRevised,
// } from "../controllers/questionController.js";

const router = express.Router();

// add
router.post("/add", authorize, updateStreak, async (req, res) => {
  try {
    const {
      title,
      difficulty,
      problemStatement,
      code,
      algorithm,
      notes,
      tags,
      link,
    } = req.body;

    const accountOwner = await User.findById(req.user._id);

    if (accountOwner) {
      accountOwner.totalQuestions = (accountOwner.totalQuestions || 0) + 1;
      await accountOwner.save();
    }

    const question = new Question({
      title,
      difficulty,
      link,
      problemStatement,
      code,
      algorithm,
      notes,
      tags,
      user: req.user._id,
    });

    await question.save();

    return res.status(201).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Error in /add:", error);
    return res.status(400).json({
      success: false,
      message: "Unable to add the question. Server Error!",
    });
  }
});

//fetch questions
router.get("/", authorize, async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user._id }).sort({
      nextReviewDate: 1,
    });
    return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return res.status(400).json({
      success: false,
      message: "Couldn't fetch questions",
    });
  }
});

// GET /api/questions/:id
router.get("/:id", authorize, async (req, res) => {
  if (!req.user._id) throw new Error("Unauthorized!");
  3;
  try {
    const id = req.params.id;
    const question = await Question.findOne({ _id: id, user: req.user._id });
    if (!question) throw new Error("No question found with this ID!");
    return res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.patch("/:id", authorize, updateStreak, async (req, res) => {
  const id = req.params.id;

  try {
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this question" });
    }

    if (req.body.sm2Result !== undefined) {
      const { interval, repetitions, easinessFactor, nextReviewDate } =
        req.body.sm2Result;

      question.interval = interval;
      question.repetitions = repetitions;
      question.easinessFactor = easinessFactor;
      question.nextReviewDate = nextReviewDate;
      question.revisedCount += 1;
    }

    if (req.body.lastRevisedAt !== undefined) {
      question.lastRevisedAt = req.body.lastRevisedAt;
    }
    if (req.body.title !== undefined) {
      question.title = req.body.title;
    }
    if (req.body.problemStatement !== undefined) {
      question.problemStatement = req.body.problemStatement;
    }
    if (req.body.link !== undefined) question.link = req.body.link;
    if (req.body.code !== undefined) {
      question.code = req.body.code;
    }
    if (req.body.algorithm !== undefined) {
      question.algorithm = req.body.algorithm;
    }
    if (req.body.notes !== undefined) {
      question.notes = req.body.notes;
    }
    if (req.body.difficulty !== undefined) {
      question.difficulty = req.body.difficulty;
    }
    if (req.body.tags !== undefined) {
      question.tags = req.body.tags;
    }

    const updatedQuestion = await question.save();

    return res.status(200).json({
      success: true,
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("PATCH /:id error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a question
router.delete("/:id", authorize, updateStreak, async (req, res) => {
  const quesId = req.params.id;
  const userId = req.user._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const question = await Question.findOneAndDelete({
      _id: quesId,
      user: userId,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "No question found with this ID for the user.",
      });
    }

    const accountOwner = await User.findById(userId);
    if (accountOwner) {
      accountOwner.totalQuestions = Math.max(
        0,
        (accountOwner.totalQuestions || 0) - 1
      );
      await accountOwner.save();
    }

    return res.status(200).json({
      success: true,
      message: "Question Deleted Successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      quesId,
      userId,
      message: `Failed to delete question: ${error.message}`,
    });
  }
});

export default router;
