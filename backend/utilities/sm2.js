// SM-2 Spaced Repetition Algorithm Utility
// Usage: const { interval, repetitions, easinessFactor, nextReviewDate } = sm2({ interval, repetitions, easinessFactor }, quality);

export default function sm2(
  { interval = 1, repetitions = 0, easinessFactor = 2.5 },
  quality
) {
  if (quality < 0 || quality > 5) {
    throw new Error("Quality must be between 0 and 5");
  }
  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easinessFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }
  easinessFactor =
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easinessFactor < 1.3) easinessFactor = 1.3;
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);
  return { interval, repetitions, easinessFactor, nextReviewDate };
}
