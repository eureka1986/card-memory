import type { Card, CardDraft, Category, Tag } from '../models/card';
import type { ReviewLog, ReviewQuality, ReviewSchedule } from '../models/review';
interface CardsState {
    initialized: boolean;
    loading: boolean;
    cards: Card[];
    categories: Category[];
    tags: Tag[];
    schedules: Record<string, ReviewSchedule>;
    reviewLogs: Record<string, ReviewLog[]>;
    initialize: () => Promise<void>;
    createCard: (draft: CardDraft) => Promise<Card>;
    createCategory: (name: string) => Promise<Category>;
    createTag: (name: string) => Promise<Tag>;
    logReview: (cardId: string, quality: ReviewQuality, reflection?: string) => Promise<void>;
    addReflection: (cardId: string, note: string) => Promise<void>;
    addActionPrompt: (cardId: string, prompt: string) => Promise<void>;
}
export declare const useCardsStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<CardsState>, "setState"> & {
    setState<A extends string | {
        type: string;
    }>(partial: CardsState | Partial<CardsState> | ((state: CardsState) => CardsState | Partial<CardsState>), replace?: boolean, action?: A): void;
}>;
export declare function selectDueCards(cards: Card[], schedules: Record<string, ReviewSchedule>): Card[];
export declare function selectUpcoming(cards: Card[], schedules: Record<string, ReviewSchedule>): Card[];
export {};
