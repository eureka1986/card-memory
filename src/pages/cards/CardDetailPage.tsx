import { FormEvent, useMemo, useState, type ComponentType } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Bookmark, Clock, PenLine, Zap } from 'lucide-react';

import { useCardsStore } from '../../store/useCardsStore';

export function CardDetailPage() {
  const { cardId } = useParams();
  const navigate = useNavigate();
  const card = useCardsStore((state) => state.cards.find((item) => item.id === cardId));
  const categories = useCardsStore((state) => state.categories);
  const tags = useCardsStore((state) => state.tags);
  const reviewLogs = useCardsStore((state) => state.reviewLogs[cardId ?? ''] ?? []);
  const addReflection = useCardsStore((state) => state.addReflection);

  const [note, setNote] = useState('');

  const category = categories.find((item) => item.id === card?.categoryId);
  const tagList = tags.filter((tag) => (card?.tagIds ?? []).includes(tag.id));

  const timeline = useMemo(() => {
    return [...reviewLogs].sort((a, b) => (a.reviewedAt > b.reviewedAt ? -1 : 1));
  }, [reviewLogs]);

  if (!card) {
    return (
      <div className="space-y-3 text-sm text-slate-500">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-accent">
          <ArrowLeft className="h-4 w-4" /> 返回
        </button>
        <p>未找到该卡片。</p>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!note.trim()) return;
    await addReflection(card.id, note.trim());
    setNote('');
  };

  return (
    <div className="space-y-6 pb-24">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-accent">
        <ArrowLeft className="h-4 w-4" /> 返回
      </button>

      <section className="space-y-3 rounded-3xl bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            {category?.name ?? '未分类'}
          </span>
          <span className="text-xs text-slate-400">
            录入时间：{format(new Date(card.createdAt), 'yyyy-MM-dd')}
          </span>
        </div>
        <h1 className="text-xl font-semibold text-slate-900">{card.statement}</h1>
        <p className="text-sm leading-6 text-slate-600">{card.summary}</p>

        <div className="flex flex-wrap gap-2 pt-2 text-xs text-slate-500">
          {card.keywords.map((keyword) => (
            <span key={keyword} className="rounded-full bg-slate-100 px-2 py-1">
              #{keyword}
            </span>
          ))}
          {tagList.map((tag) => (
            <span key={tag.id} className="rounded-full bg-accent-subtle px-2 py-1 text-accent">
              #{tag.name}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SectionTitle icon={Bookmark} title="理解扩展" />
        {card.source && <InfoItem label="来源" value={card.source} />}
        {card.examples.length > 0 && (
          <InfoList label="案例" items={card.examples} />
        )}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SectionTitle icon={Zap} title="行动练习" />
        {card.actions.length === 0 ? (
          <p className="text-sm text-slate-400">暂未设置行动提示，记得补充。</p>
        ) : (
          <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
            {card.actions.map((action) => (
              <li key={action.id}>{action.prompt}</li>
            ))}
          </ol>
        )}
        {card.triggers.length > 0 && <InfoList label="触发场景" items={card.triggers.map((t) => t.description)} />}
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SectionTitle icon={PenLine} title="复盘笔记" />
        {card.reflections.length === 0 ? (
          <p className="text-sm text-slate-400">还没有复盘记录，练习后写下一点想法。</p>
        ) : (
          <div className="space-y-3">
            {card.reflections
              .slice()
              .reverse()
              .map((item) => (
                <div key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                  <p className="text-xs text-slate-400">{format(new Date(item.createdAt), 'MM-dd HH:mm')}</p>
                  <p className="mt-1 leading-relaxed">{item.content}</p>
                </div>
              ))}
          </div>
        )}

        <form className="space-y-2" onSubmit={handleSubmit}>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="写下这次练习的体会..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-2 text-sm font-semibold text-white"
          >
            保存复盘
          </button>
        </form>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <SectionTitle icon={Clock} title="复习时间线" />
        {timeline.length === 0 ? (
          <p className="text-sm text-slate-400">尚未开始复习，进入练习模式开启第一次翻牌。</p>
        ) : (
          <ul className="space-y-3 text-sm text-slate-600">
            {timeline.map((log) => (
              <li key={log.id} className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">
                  {format(new Date(log.reviewedAt), 'yyyy-MM-dd HH:mm')}
                </p>
                <p className="mt-1">掌握评分：{log.quality}</p>
                {log.reflection && <p className="mt-1 text-slate-500">{log.reflection}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

interface SectionTitleProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
}

function SectionTitle({ icon: Icon, title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
      <Icon className="h-4 w-4" />
      {title}
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-600">{value}</p>
    </div>
  );
}

interface InfoListProps {
  label: string;
  items: string[];
}

function InfoList({ label, items }: InfoListProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <ul className="space-y-2 text-sm text-slate-600">
        {items.map((item, index) => (
          <li key={index} className="rounded-xl bg-slate-50 p-3">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
