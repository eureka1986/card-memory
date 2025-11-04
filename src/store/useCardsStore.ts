import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { addDays, startOfDay } from 'date-fns';

import type { ActionPrompt, Card, CardDraft, Category, ReflectionNote, Tag } from '../models/card';
import type { ReviewLog, ReviewQuality, ReviewSchedule } from '../models/review';
import { db } from '../storage/db';
import { evaluateMastery, nextSchedule } from '../lib/reviewScheduler';
import { safeId } from '../lib/utils';

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

export const useCardsStore = create<CardsState>()(
  devtools((set, get) => ({
    initialized: false,
    loading: false,
    cards: [],
    categories: [],
    tags: [],
    schedules: {},
    reviewLogs: {},

    initialize: async () => {
      const state = get();
      if (state.initialized || state.loading) return;

      set({ loading: true });

      const [cards, categories, tags, logs, schedules] = await Promise.all([
        db.cards.toArray(),
        db.categories.toArray(),
        db.tags.toArray(),
        db.reviewLogs.toArray(),
        db.reviewSchedules.toArray()
      ]);

      const logsByCard = logs.reduce<Record<string, ReviewLog[]>>((acc, log) => {
        if (!acc[log.cardId]) acc[log.cardId] = [];
        acc[log.cardId].push(log);
        return acc;
      }, {});

      Object.values(logsByCard).forEach((arr) => arr.sort((a, b) => (a.reviewedAt > b.reviewedAt ? 1 : -1)));

      const scheduleMap = schedules.reduce<Record<string, ReviewSchedule>>((acc, schedule) => {
        acc[schedule.cardId] = schedule;
        return acc;
      }, {});

      set({
        cards: cards.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
        categories,
        tags,
        reviewLogs: logsByCard,
        schedules: scheduleMap,
        initialized: true,
        loading: false
      });
    },

    createCard: async (draft) => {
      const id = safeId('card');
      const now = new Date().toISOString();

      const card: Card = {
        id,
        statement: draft.statement,
        keywords: draft.keywords,
        summary: draft.summary,
        source: draft.source,
        categoryId: draft.categoryId,
        tagIds: draft.tagIds,
        examples: draft.examples,
        actions: draft.actions,
        triggers: draft.triggers,
        reflections: [],
        priority: draft.priority,
        mastery: 'unseen',
        createdAt: now,
        nextReviewAt: now
      };

      const schedule: ReviewSchedule = {
        cardId: id,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReviewAt: now
      };

      await db.transaction('rw', db.cards, db.reviewSchedules, async () => {
        await db.cards.add(card);
        await db.reviewSchedules.put(schedule);
      });

      set((state) => ({
        cards: [card, ...state.cards],
        schedules: { ...state.schedules, [id]: schedule }
      }));

      return card;
    },

    createCategory: async (name) => {
      const category: Category = { id: safeId('cat'), name };
      await db.categories.put(category);
      set((state) => ({ categories: [...state.categories, category] }));
      return category;
    },

    createTag: async (name) => {
      const tag: Tag = { id: safeId('tag'), name };
      await db.tags.put(tag);
      set((state) => ({ tags: [...state.tags, tag] }));
      return tag;
    },

    logReview: async (cardId, quality, reflection) => {
      const state = get();
      const schedule = state.schedules[cardId];
      if (!schedule) return;

      const now = new Date().toISOString();
      const log: ReviewLog = {
        id: safeId('log'),
        cardId,
        reviewedAt: now,
        quality,
        reflection
      };

      const card = state.cards.find((item) => item.id === cardId);
      if (!card) return;

      const mastery = evaluateMastery(quality, card.mastery);
      const updatedSchedule = nextSchedule(quality, { lastLog: log, schedule });
      const newReflection: ReflectionNote | undefined = reflection
        ? { id: safeId('note'), createdAt: now, content: reflection }
        : undefined;

      await db.transaction('rw', db.cards, db.reviewLogs, db.reviewSchedules, async () => {
        await db.reviewLogs.add(log);
        await db.reviewSchedules.put({ ...updatedSchedule, cardId });
        await db.cards.update(cardId, {
          mastery,
          nextReviewAt: updatedSchedule.nextReviewAt,
          lastReviewedAt: log.reviewedAt,
          reflections: newReflection ? [...card.reflections, newReflection] : card.reflections
        });
      });

      set((current) => ({
        cards: current.cards.map((item) =>
          item.id === cardId
            ? {
                ...item,
                mastery,
                nextReviewAt: updatedSchedule.nextReviewAt,
                lastReviewedAt: log.reviewedAt,
                reflections: newReflection ? [...item.reflections, newReflection] : item.reflections
              }
            : item
        ),
        reviewLogs: {
          ...current.reviewLogs,
          [cardId]: [...(current.reviewLogs[cardId] ?? []), log]
        },
        schedules: {
          ...current.schedules,
          [cardId]: updatedSchedule
        }
      }));
    },

    addReflection: async (cardId, content) => {
      const card = get().cards.find((item) => item.id === cardId);
      if (!card) return;

      const note: ReflectionNote = {
        id: safeId('note'),
        createdAt: new Date().toISOString(),
        content
      };

      await db.cards.update(cardId, {
        reflections: [...card.reflections, note]
      });

      set((state) => ({
        cards: state.cards.map((item) =>
          cardId === item.id ? { ...item, reflections: [...item.reflections, note] } : item
        )
      }));
    },

    addActionPrompt: async (cardId, prompt) => {
      const action: ActionPrompt = { id: safeId('act'), prompt };
      const card = get().cards.find((item) => item.id === cardId);
      if (!card) return;

      await db.cards.update(cardId, {
        actions: [...card.actions, action]
      });

      set((state) => ({
        cards: state.cards.map((item) =>
          item.id === cardId ? { ...item, actions: [...item.actions, action] } : item
        )
      }));
    }
  }))
);

export function selectDueCards(cards: Card[], schedules: Record<string, ReviewSchedule>) {
  const today = startOfDay(new Date());
  return cards.filter((card) => {
    const schedule = schedules[card.id];
    if (!schedule) return false;
    const dueDate = startOfDay(new Date(schedule.nextReviewAt));
    return dueDate <= today;
  });
}

export function selectUpcoming(cards: Card[], schedules: Record<string, ReviewSchedule>) {
  const tomorrow = startOfDay(addDays(new Date(), 1));
  return cards.filter((card) => {
    const schedule = schedules[card.id];
    if (!schedule) return false;
    const dueDate = startOfDay(new Date(schedule.nextReviewAt));
    return dueDate > tomorrow;
  });
}
