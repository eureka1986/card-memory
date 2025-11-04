import Dexie, { type Table } from 'dexie';
import type { Card, Category, Tag } from '../models/card';
import type { ReviewLog, ReviewSchedule } from '../models/review';
export declare class MemoryDeckDB extends Dexie {
    cards: Table<Card>;
    categories: Table<Category>;
    tags: Table<Tag>;
    reviewLogs: Table<ReviewLog>;
    reviewSchedules: Table<ReviewSchedule>;
    constructor();
}
export declare const db: MemoryDeckDB;
