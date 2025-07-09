export default function sm2(
  { interval = 1, repetitions = 0, easinessFactor = 2.5 },
  quality
) {
  if (quality < 0 || quality > 5) {
    throw new Error("Quality must be between 0 and 5");
  }

  const minInterval = 2;
  const maxInterval = 70;

  if (quality >= 3) {
    repetitions += 1;

    if (repetitions === 1) {
      interval = minInterval; // 🔁 Enforce min interval here
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);

      if (quality === 3) {
        interval =
          interval > 15
            ? Math.round(interval * 0.8)
            : Math.max(minInterval, Math.round(interval));
      } else if (quality === 4) {
        interval = Math.max(minInterval, Math.round(interval * 0.9));
      }
    }

    if (interval > maxInterval) interval = maxInterval;
  } else {
    repetitions = 0;
    interval = minInterval;
  }

  easinessFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  if (easinessFactor < 1.3) easinessFactor = 1.3;

  const nextReviewDate = new Date();
  nextReviewDate.setHours(0, 0, 0, 0);
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    interval,
    repetitions,
    easinessFactor,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}
