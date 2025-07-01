import express from "express";
import Question from "../models/questionModel.js";
import protect from "../middlewares/authorize.js";
import authorize from "../middlewares/authorize.js";
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
router.post("/add", authorize, async (req, res) => {
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
    return res.status(400).json({
      success: false,
      message: "Unable to add the question.Server Error!",
    });
  }
});

//fetch questions
router.get("/", authorize, async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user._id }).sort({
      lastRevisedAt: 1,
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

// PUT /api/questions/:id

// router.patch("/:id", authorize, async (req, res) => {
//   const id = req.params.id;
//   const newLastRevisedAt = req.body.lastRevisedAt;

//   try {
//     // First, find the question to check ownership
//     const question = await Question.findById(id);

//     if (!question) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     // Check if the question belongs to the logged-in user
//     if (question.user.toString() !== req.user._id.toString()) {
//       return res
//         .status(403)
//         .json({ message: "Unauthorized to update this question" });
//     }

//     // Proceed to update if authorized
//     question.lastRevisedAt = newLastRevisedAt;
//     const updatedQuestion = await question.save();

//     return res.status(200).json({
//       success: true,
//       lastRevisedAt: updatedQuestion.lastRevisedAt,
//     });
//   } catch (error) {
//     console.error("PATCH /:id error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// router.patch("/:id",authorize, async (req, res) => {
//   const id = req.params.id;
//   const newLastRevisedAt = req.body.lastRevisedAt;

//   try {
//     const updatedQuestion = await Question.findByIdAndUpdate(
//       id,
//       { lastRevisedAt: newLastRevisedAt },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       lastRevisedAt: updatedQuestion.lastRevisedAt,
//     });

//     if (!updatedQuestion) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     res.status(200).json(updatedQuestion);
//   } catch (error) {
//     console.error("PATCH /:id error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.patch("/:id", authorize, async (req, res) => {
  const id = req.params.id;

  try {
    // Find the question and check ownership
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this question" });
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

router.delete("/:id", authorize, async (req, res) => {
  console.log(req.params);
  const quesId = req.params.id;
  const userId = req.user._id;

  if (!userId) throw new Error("Unauthorized");
  try {
    const question = await Question.findOneAndDelete({
      _id: quesId,
      user: userId,
    });
    if (!question) throw new Error("no question with this question id!");

    res.status(200).json({
      success: true,
      message: "Question Deleted Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      quesId,
      userId,
      message: `DELETE ${quesId}` + error.message,
    });
  }
});

export default router;
