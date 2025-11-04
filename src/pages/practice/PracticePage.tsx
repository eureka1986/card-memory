import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { useCardsStore, selectDueCards } from '../../store/useCardsStore';
import type { ReviewQuality } from '../../models/review';

const qualities: { value: ReviewQuality; label: string; tone: string }[] = [
  { value: 1, label: '模糊', tone: 'bg-slate-200 text-slate-600' },
  { value: 3, label: '回忆困难', tone: 'bg-amber-200 text-amber-700' },
  { value: 4, label: '基本掌握', tone: 'bg-emerald-200 text-emerald-700' },
  { value: 5, label: '非常熟练', tone: 'bg-teal-200 text-teal-700' }
];

export function PracticePage() {
  const cards = useCardsStore((state) => state.cards);
  const schedules = useCardsStore((state) => state.schedules);
  const logReview = useCardsStore((state) => state.logReview);

  const dueCards = useMemo(() => selectDueCards(cards, schedules), [cards, schedules]);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [reflection, setReflection] = useState('');

  const current = dueCards[index];

  useEffect(() => {
    if (index >= dueCards.length && dueCards.length > 0) {
      setIndex(0);
      setShowBack(false);
    }
    if (dueCards.length === 0) {
      setIndex(0);
      setShowBack(false);
    }
  }, [dueCards.length, index]);

  const handleFlip = () => {
    setShowBack((prev) => !prev);
  };

  const handleQuality = async (quality: ReviewQuality) => {
    if (!current) return;
    await logReview(current.id, quality, reflection.trim() ? reflection.trim() : undefined);
    setReflection('');
    setShowBack(false);
    setIndex((prev) => prev + 1);
  };

  return (
    <div className="pb-24">
      <header className="mb-4 space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-400">今日任务</p>
        <h1 className="text-xl font-semibold text-slate-900">
          翻牌练习
          <span className="ml-2 text-sm text-slate-500">
            {Math.min(index + (current ? 1 : 0), dueCards.length)}/{dueCards.length}
          </span>
        </h1>
      </header>

      {current ? (
        <div className="space-y-4">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={showBack ? 'back' : 'front'}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="h-[340px] cursor-pointer rounded-3xl bg-white p-6 text-slate-900 shadow-card"
                onClick={handleFlip}
              >
                {!showBack ? (
                  <FrontFace statement={current.statement} keywords={current.keywords} />
                ) : (
                  <BackFace summary={current.summary} actions={current.actions} triggers={current.triggers} />
                )}
              </motion.div>
            </AnimatePresence>
            <p className="pointer-events-none absolute inset-x-0 -bottom-8 text-center text-xs text-slate-400">
              点击卡片翻面 • 上滑表示掌握
            </p>
          </div>

          {showBack && (
            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-sm">
              <label className="space-y-2">
                <span className="text-xs font-medium text-slate-500">复盘记录</span>
                <textarea
                  value={reflection}
                  onChange={(event) => setReflection(event.target.value)}
                  rows={3}
                  placeholder="用自己的语言复述或写下应用计划"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
              </label>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {qualities.map((quality) => (
              <button
                key={quality.value}
                onClick={() => handleQuality(quality.value)}
                className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${quality.tone}`}
              >
                {quality.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

interface FrontFaceProps {
  statement: string;
  keywords: string[];
}

function FrontFace({ statement, keywords }: FrontFaceProps) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">观点</p>
        <p className="mt-3 text-xl font-semibold leading-snug text-slate-900">{statement}</p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
        {keywords.map((keyword) => (
          <span key={keyword} className="rounded-full bg-slate-100 px-2 py-1">
            #{keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

interface BackFaceProps {
  summary: string;
  actions: { id: string; prompt: string }[];
  triggers: { id: string; description: string }[];
}

function BackFace({ summary, actions, triggers }: BackFaceProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-400">理解</p>
        <p className="text-sm leading-6 text-slate-600">{summary}</p>
      </div>
      {actions.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-400">行动</p>
          <ul className="space-y-1 text-sm text-slate-600">
            {actions.map((action) => (
              <li key={action.id} className="rounded-xl bg-slate-100 px-3 py-2">
                {action.prompt}
              </li>
            ))}
          </ul>
        </div>
      )}
      {triggers.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-400">触发</p>
          <ul className="space-y-1 text-sm text-slate-600">
            {triggers.map((trigger) => (
              <li key={trigger.id} className="rounded-xl bg-slate-100 px-3 py-2">
                {trigger.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-card">
      <Sparkles className="mx-auto h-10 w-10 text-accent" />
      <p className="mt-3 text-lg font-semibold text-slate-900">今日复习已完成</p>
      <p className="mt-1 text-sm text-slate-500">去发现新的观点，或回顾已掌握的卡片吧。</p>
    </div>
  );
}
