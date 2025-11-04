import { FormEvent, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCardsStore } from '../../store/useCardsStore';
import { safeId } from '../../lib/utils';
import type { CardDraft } from '../../models/card';

export function NewCardPage() {
  const navigate = useNavigate();
  const categories = useCardsStore((state) => state.categories);
  const tags = useCardsStore((state) => state.tags);
  const createCard = useCardsStore((state) => state.createCard);
  const createCategory = useCardsStore((state) => state.createCategory);
  const createTag = useCardsStore((state) => state.createTag);

  const [statement, setStatement] = useState('');
  const [summary, setSummary] = useState('');
  const [keywords, setKeywords] = useState('');
  const [source, setSource] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [examples, setExamples] = useState('');
  const [actions, setActions] = useState('');
  const [triggers, setTriggers] = useState('');
  const [priority, setPriority] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!statement || !summary || !categoryName) return;
    setSubmitting(true);

    let categoryId = categories.find((item) => item.name === categoryName)?.id;
    if (!categoryId) {
      const category = await createCategory(categoryName);
      categoryId = category.id;
    }

    const tagNames = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const tagIds: string[] = [];

    for (const name of tagNames) {
      const existing = tags.find((tag) => tag.name === name);
      if (existing) {
        tagIds.push(existing.id);
      } else {
        const created = await createTag(name);
        tagIds.push(created.id);
      }
    }

    const draft: CardDraft = {
      statement,
      summary,
      keywords: keywords.split('、').map((kw) => kw.trim()).filter(Boolean),
      source,
      categoryId,
      tagIds,
      examples: examples
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      actions: actions
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((prompt) => ({ id: safeId('act'), prompt })),
      triggers: triggers
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((description) => ({ id: safeId('trigger'), description })),
      priority
    };

    const card = await createCard(draft);
    setSubmitting(false);
    navigate(`/cards/${card.id}`);
  };

  return (
    <form className="space-y-4 pb-24" onSubmit={handleSubmit}>
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <label className="text-sm font-semibold text-slate-700">一句话观点</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          rows={2}
          placeholder="用一句话概括核心观点"
          value={statement}
          onChange={(event) => setStatement(event.target.value)}
        />
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <label className="text-sm font-semibold text-slate-700">应用场景 / 详述</label>
        <textarea
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          rows={4}
          placeholder="解释为什么、如何使用、有哪些例子"
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="关键词（用顿号分隔）">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            placeholder="抽象思维、反向假设"
            value={keywords}
            onChange={(event) => setKeywords(event.target.value)}
          />
        </Field>
        <Field label="来源 / 书籍">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            placeholder="书名、章节或讲座"
            value={source}
            onChange={(event) => setSource(event.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="分类">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            placeholder="如：思维模型、创业洞察"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            list="category-options"
          />
          <datalist id="category-options">
            {categories.map((category) => (
              <option key={category.id} value={category.name} />
            ))}
          </datalist>
        </Field>
        <Field label="标签（逗号分隔）">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            placeholder="场景、触发条件"
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
          />
        </Field>
      </div>

      <Field label="案例 / 例子（每行一个）">
        <textarea
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          rows={3}
          placeholder="记录你遇到过的真实场景"
          value={examples}
          onChange={(event) => setExamples(event.target.value)}
        />
      </Field>

      <Field label="行动练习（每行一个）">
        <textarea
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          rows={3}
          placeholder="写下触发后要做的动作或要回答的问题"
          value={actions}
          onChange={(event) => setActions(event.target.value)}
        />
      </Field>

      <Field label="触发场景（每行一个）">
        <textarea
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          rows={3}
          placeholder="在哪些情境下提醒自己调用"
          value={triggers}
          onChange={(event) => setTriggers(event.target.value)}
        />
      </Field>

      <Field label={`优先级：${priority}`}>
        <input
          type="range"
          min={1}
          max={5}
          value={priority}
          onChange={(event) => setPriority(Number(event.target.value))}
          className="w-full"
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-2xl bg-accent py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {submitting ? '创建中…' : '生成卡片并进入详情'}
      </button>
    </form>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}
