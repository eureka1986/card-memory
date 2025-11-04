import type { MasteryLevel } from './card';
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
export interface ReviewLog {
    id: string;
    cardId: string;
    reviewedAt: string;
    quality: ReviewQuality;
    reflection?: string;
}
export interface ReviewSchedule {
    cardId: string;
    interval: number;
    repetitions: number;
    easeFactor: number;
    nextReviewAt: string;
}
export interface ReviewState {
    mastery: MasteryLevel;
    schedule: ReviewSchedule;
}
