import Dexie, { type Table } from 'dexie';

import type { Card, Category, Tag } from '../models/card';
import type { ReviewLog, ReviewSchedule } from '../models/review';

export class MemoryDeckDB extends Dexie {
  cards!: Table<Card>;
  categories!: Table<Category>;
  tags!: Table<Tag>;
  reviewLogs!: Table<ReviewLog>;
  reviewSchedules!: Table<ReviewSchedule>;

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
