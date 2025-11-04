import { addDays, differenceInCalendarDays, isBefore } from 'date-fns';

import type { MasteryLevel } from '../models/card';
import type { ReviewLog, ReviewQuality, ReviewSchedule } from '../models/review';

interface SchedulerContext {
  lastLog?: ReviewLog;
  schedule?: ReviewSchedule;
}

const EASE_MIN = 1.3;

export function evaluateMastery(quality: ReviewQuality, current: MasteryLevel): MasteryLevel {
  if (quality >= 4) {
    if (current === 'unseen') return 'learning';
    if (current === 'learning') return 'familiar';
    return 'mastered';
  }

  if (quality <= 2) {
    return current === 'mastered' ? 'familiar' : 'learning';
  }

  return current;
}

export function nextSchedule(quality: ReviewQuality, ctx: SchedulerContext): ReviewSchedule {
  const now = new Date();

  if (!ctx.schedule) {
    const firstInterval = quality < 3 ? 1 : 2;
    return {
      cardId: ctx.lastLog?.cardId ?? '',
      interval: firstInterval,
      repetitions: 1,
      easeFactor: 2.5,
      nextReviewAt: addDays(now, firstInterval).toISOString()
    };
  }

  const { schedule } = ctx;
  let ease = schedule.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  ease = Math.max(ease, EASE_MIN);

  let repetitions = schedule.repetitions;
  let interval = 1;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else if (repetitions === 0) {
    repetitions = 1;
    interval = 1;
  } else if (repetitions === 1) {
    repetitions = 2;
    interval = 6;
  } else {
    interval = Math.round(schedule.interval * ease);
    repetitions += 1;
  }

  const nextDate = addDays(now, interval);

  return {
    cardId: schedule.cardId,
    interval,
    repetitions,
    easeFactor: ease,
    nextReviewAt: nextDate.toISOString()
  };
}

export function needsReview(schedule: ReviewSchedule, date = new Date()) {
  return isBefore(new Date(schedule.nextReviewAt), addDays(date, 1));
}

export function overdueDays(schedule: ReviewSchedule, date = new Date()) {
  const diff = differenceInCalendarDays(date, new Date(schedule.nextReviewAt));
  return Math.max(0, diff);
}
