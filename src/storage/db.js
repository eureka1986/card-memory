import Dexie from 'dexie';
export class MemoryDeckDB extends Dexie {
    cards;
    categories;
    tags;
    reviewLogs;
    reviewSchedules;
    constructor() {
        super('memory-deck');
        this.version(1).stores({
            cards: 'id, categoryId, *tagIds, mastery, nextReviewAt',
            categories: 'id',
            tags: 'id',
            reviewLogs: 'id, cardId, reviewedAt',
            reviewSchedules: 'cardId'
        });
    }
}
export const db = new MemoryDeckDB();
