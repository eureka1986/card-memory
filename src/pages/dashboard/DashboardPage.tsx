import { useMemo, type ComponentType } from 'react';
import { format } from 'date-fns';
import { Flame, History, Hourglass } from 'lucide-react';

import { useCardsStore, selectDueCards, selectUpcoming } from '../../store/useCardsStore';
import type { Card } from '../../models/card';

export function DashboardPage() {
  const cards = useCardsStore((state) => state.cards);
  const schedules = useCardsStore((state) => state.schedules);

  const stats = useMemo(() => {
    const due = selectDueCards(cards, schedules);
    const upcoming = selectUpcoming(cards, schedules);
    const mastered = cards.filter((card) => card.mastery === 'mastered');
    const learning = cards.filter((card) => card.mastery === 'learning');

    return {
      total: cards.length,
      due,
      upcoming,
      mastered,
      learning
    };
  }, [cards, schedules]);

  return (
    <div className="space-y-6 pb-16">
      <section className="rounded-2xl bg-gradient-to-br from-accent via-indigo-600 to-purple-600 p-6 text-white shadow-card">
        <p className="text-sm text-white/80">今日待复习</p>
        <p className="mt-2 text-4xl font-semibold">{stats.due.length}</p>
        <p className="mt-4 text-sm text-white/70">
          {stats.due.length > 0
            ? '开启翻牌练习，让观点变成动作'
            : '太棒了！今天的复习任务已经完成'}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <StatCard
          icon={Flame}
          label="巩固中"
          value={stats.learning.length}
          helper="需要反复练习的观点"
        />
        <StatCard
          icon={Hourglass}
          label="即将复习"
          value={stats.upcoming.length}
          helper={stats.upcoming[0]
            ? `下一张：${format(new Date(stats.upcoming[0].nextReviewAt), 'MM月dd日')}`
            : '暂无安排'}
        />
        <StatCard
          icon={History}
          label="已掌握"
          value={stats.mastered.length}
          helper="保持复盘，防止遗忘"
        />
        <StatCard
          icon={Flame}
          label="总卡片"
          value={stats.total}
          helper="持续添加新的观点"
        />
      </section>

      <UpcomingDueList title="今日计划" cards={stats.due.slice(0, 4)} empty="今天没有待复习的卡片" />
      <UpcomingDueList title="未来预告" cards={stats.upcoming.slice(0, 4)} empty="暂无安排，创造新目标吧" />
    </div>
  );
}

interface StatCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  helper: string;
}

function StatCard({ icon: Icon, label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-accent-subtle p-2 text-accent">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-semibold text-slate-900">{value}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

interface UpcomingDueListProps {
  title: string;
  cards: Card[];
  empty: string;
}

function UpcomingDueList({ title, cards, empty }: UpcomingDueListProps) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-600">{title}</h3>
      <div className="space-y-3">
        {cards.length === 0 && <p className="text-xs text-slate-400">{empty}</p>}
        {cards.map((card) => (
          <article
            key={card.id}
            className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-800">{card.statement}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <span>下次复习：{format(new Date(card.nextReviewAt), 'MM月dd日')}</span>
              <span>掌握度：{card.mastery}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
