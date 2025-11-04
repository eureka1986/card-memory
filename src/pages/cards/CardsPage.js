import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Filter, Layers, Tag } from 'lucide-react';
import { useCardsStore } from '../../store/useCardsStore';
import { cn } from '../../lib/utils';
export function CardsPage() {
    const cards = useCardsStore((state) => state.cards);
    const categories = useCardsStore((state) => state.categories);
    const tags = useCardsStore((state) => state.tags);
    const [categoryId, setCategoryId] = useState('all');
    const [tagId, setTagId] = useState('all');
    const [query, setQuery] = useState('');
    const filtered = useMemo(() => {
        return cards.filter((card) => {
            const matchesCategory = categoryId === 'all' || card.categoryId === categoryId;
            const matchesTag = tagId === 'all' || card.tagIds.includes(tagId);
            const matchesQuery = query.trim().length === 0 ||
                card.statement.includes(query) ||
                card.summary.includes(query) ||
                card.keywords.some((kw) => kw.includes(query));
            return matchesCategory && matchesTag && matchesQuery;
        });
    }, [cards, categoryId, tagId, query]);
    return (_jsxs("div", { className: "space-y-4 pb-16", children: [_jsxs("div", { className: "flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-slate-600", children: [_jsx(Filter, { className: "h-4 w-4" }), "\u7B5B\u9009"] }), _jsxs("div", { className: "grid gap-2 text-sm md:grid-cols-3", children: [_jsxs("select", { value: categoryId, onChange: (event) => setCategoryId(event.target.value), className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", children: [_jsx("option", { value: "all", children: "\u5168\u90E8\u5206\u7C7B" }), categories.map((category) => (_jsx("option", { value: category.id, children: category.name }, category.id)))] }), _jsxs("select", { value: tagId, onChange: (event) => setTagId(event.target.value), className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", children: [_jsx("option", { value: "all", children: "\u5168\u90E8\u6807\u7B7E" }), tags.map((tag) => (_jsx("option", { value: tag.id, children: tag.name }, tag.id)))] }), _jsx("input", { value: query, onChange: (event) => setQuery(event.target.value), className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none", placeholder: "\u641C\u7D22\u89C2\u70B9\u3001\u5173\u952E\u8BCD\u6216\u6765\u6E90" })] })] }), _jsxs("section", { className: "space-y-3", children: [filtered.length === 0 && (_jsx("p", { className: "rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400", children: "\u6CA1\u6709\u5339\u914D\u7684\u5361\u7247\uFF0C\u8BD5\u8BD5\u8C03\u6574\u7B5B\u9009\u6761\u4EF6\u3002" })), filtered.map((card) => (_jsx(CardItem, { card: card }, card.id)))] })] }));
}
function CardItem({ card }) {
    const categories = useCardsStore((state) => state.categories);
    const tags = useCardsStore((state) => state.tags);
    const category = categories.find((item) => item.id === card.categoryId);
    const tagList = tags.filter((tag) => card.tagIds.includes(tag.id));
    return (_jsxs(Link, { to: `/cards/${card.id}`, className: "block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-slate-900", children: card.statement }), _jsx("p", { className: "mt-2 text-xs text-slate-500", children: card.summary })] }), _jsx("span", { className: cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-medium', badgeColor(card.mastery)), children: masteryLabel(card.mastery) })] }), _jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500", children: [category && (_jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1", children: [_jsx(Layers, { className: "h-3 w-3" }), category.name] })), tagList.map((tag) => (_jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1", children: [_jsx(Tag, { className: "h-3 w-3" }), tag.name] }, tag.id))), _jsxs("span", { children: ["\u4E0B\u6B21\u590D\u4E60\uFF1A", format(new Date(card.nextReviewAt), 'MM月dd日')] })] })] }));
}
function badgeColor(mastery) {
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
function masteryLabel(mastery) {
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
