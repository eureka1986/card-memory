import type { MasteryLevel } from '../models/card';
import type { ReviewLog, ReviewQuality, ReviewSchedule } from '../models/review';
interface SchedulerContext {
    lastLog?: ReviewLog;
    schedule?: ReviewSchedule;
}
export declare function evaluateMastery(quality: ReviewQuality, current: MasteryLevel): MasteryLevel;
export declare function nextSchedule(quality: ReviewQuality, ctx: SchedulerContext): ReviewSchedule;
export declare function needsReview(schedule: ReviewSchedule, date?: Date): boolean;
export declare function overdueDays(schedule: ReviewSchedule, date?: Date): number;
export {};
