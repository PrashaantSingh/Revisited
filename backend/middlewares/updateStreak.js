import User from "../models/userModel.js";

export default async function updateStreak(req, res, next) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const msPerDay = 1000 * 60 * 60 * 24;

    const last = user.lastStreakUpdateAt
      ? new Date(user.lastStreakUpdateAt)
      : new Date(user.createdAt);
    const lastDate = new Date(
      last.getFullYear(),
      last.getMonth(),
      last.getDate()
    );
    const diffInDays = Math.floor((todayDate - lastDate) / msPerDay);

    let shouldSave = false;

    if (user.streak === undefined || user.lastStreakUpdateAt === undefined) {
      user.streak = 1;
      user.maxStreak = 1;
      shouldSave = true;
    } else if (diffInDays === 1) {
      user.streak = (user.streak || 0) + 1;
      shouldSave = true;
    } else if (diffInDays > 1) {
      user.streak = 1;
      shouldSave = true;
    }

    if (user.maxStreak === undefined || user.streak > user.maxStreak) {
      user.maxStreak = user.streak;
      shouldSave = true;
    }

    if (user.streak && user.maxStreak && user.streak > user.maxStreak) {
      user.maxStreak = user.streak;
      shouldSave = true;
    }
    if (shouldSave) {
      user.lastStreakUpdateAt = today;
      await user.save();
    }

    next();
  } catch (error) {
    console.error("Error in updateStreak middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
