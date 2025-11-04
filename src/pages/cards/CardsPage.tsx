import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Filter, Layers, Tag } from 'lucide-react';

import { useCardsStore } from '../../store/useCardsStore';
import type { Card } from '../../models/card';
import { cn } from '../../lib/utils';

export function CardsPage() {
  const cards = useCardsStore((state) => state.cards);
  const categories = useCardsStore((state) => state.categories);
  const tags = useCardsStore((state) => state.tags);
  const [categoryId, setCategoryId] = useState<string>('all');
  const [tagId, setTagId] = useState<string>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return cards.filter((card) => {
      const matchesCategory = categoryId === 'all' || card.categoryId === categoryId;
      const matchesTag = tagId === 'all' || card.tagIds.includes(tagId);
      const matchesQuery =
        query.trim().length === 0 ||
        card.statement.includes(query) ||
        card.summary.includes(query) ||
        card.keywords.some((kw) => kw.includes(query));
      return matchesCategory && matchesTag && matchesQuery;
    });
  }, [cards, categoryId, tagId, query]);

  return (
    <div className="space-y-4 pb-16">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <Filter className="h-4 w-4" />筛选
        </div>
        <div className="grid gap-2 text-sm md:grid-cols-3">
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            <option value="all">全部分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={tagId}
            onChange={(event) => setTagId(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            <option value="all">全部标签</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            placeholder="搜索观点、关键词或来源"
          />
        </div>
      </div>

      <section className="space-y-3">
        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
            没有匹配的卡片，试试调整筛选条件。
          </p>
        )}

        {filtered.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </section>
    </div>
  );
}

interface CardItemProps {
  card: Card;
}

function CardItem({ card }: CardItemProps) {
  const categories = useCardsStore((state) => state.categories);
  const tags = useCardsStore((state) => state.tags);

  const category = categories.find((item) => item.id === card.categoryId);
  const tagList = tags.filter((tag) => card.tagIds.includes(tag.id));

  return (
    <Link
      to={`/cards/${card.id}`}
      className="block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{card.statement}</p>
          <p className="mt-2 text-xs text-slate-500">{card.summary}</p>
        </div>
        <span
          className={cn(
            'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
            badgeColor(card.mastery)
          )}
        >
          {masteryLabel(card.mastery)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {category && (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
            <Layers className="h-3 w-3" />
            {category.name}
          </span>
        )}
        {tagList.map((tag) => (
          <span key={tag.id} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
            <Tag className="h-3 w-3" />
            {tag.name}
          </span>
        ))}
        <span>下次复习：{format(new Date(card.nextReviewAt), 'MM月dd日')}</span>
      </div>
    </Link>
  );
}

function badgeColor(mastery: Card['mastery']) {
  switch (mastery) {
    case 'unseen':
      return 'bg-slate-100 text-slate-600';
    case 'learning':
      return 'bg-mastery-low/10 text-mastery-low';
    case 'familiar':
      return 'bg-mastery-mid/10 text-mastery-mid';
    case 'mastered':
      return 'bg-mastery-high/10 text-mastery-high';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function masteryLabel(mastery: Card['mastery']) {
  switch (mastery) {
    case 'unseen':
      return '未复习';
    case 'learning':
      return '巩固中';
    case 'familiar':
      return '熟悉';
    case 'mastered':
      return '已掌握';
    default:
      return mastery;
  }
}
