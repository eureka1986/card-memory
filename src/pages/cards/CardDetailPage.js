import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
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
        return (_jsxs("div", { className: "space-y-3 text-sm text-slate-500", children: [_jsxs("button", { onClick: () => navigate(-1), className: "inline-flex items-center gap-2 text-accent", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " \u8FD4\u56DE"] }), _jsx("p", { children: "\u672A\u627E\u5230\u8BE5\u5361\u7247\u3002" })] }));
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!note.trim())
            return;
        await addReflection(card.id, note.trim());
        setNote('');
    };
    return (_jsxs("div", { className: "space-y-6 pb-24", children: [_jsxs("button", { onClick: () => navigate(-1), className: "inline-flex items-center gap-2 text-sm text-accent", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), " \u8FD4\u56DE"] }), _jsxs("section", { className: "space-y-3 rounded-3xl bg-white p-6 shadow-card", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500", children: category?.name ?? '未分类' }), _jsxs("span", { className: "text-xs text-slate-400", children: ["\u5F55\u5165\u65F6\u95F4\uFF1A", format(new Date(card.createdAt), 'yyyy-MM-dd')] })] }), _jsx("h1", { className: "text-xl font-semibold text-slate-900", children: card.statement }), _jsx("p", { className: "text-sm leading-6 text-slate-600", children: card.summary }), _jsxs("div", { className: "flex flex-wrap gap-2 pt-2 text-xs text-slate-500", children: [card.keywords.map((keyword) => (_jsxs("span", { className: "rounded-full bg-slate-100 px-2 py-1", children: ["#", keyword] }, keyword))), tagList.map((tag) => (_jsxs("span", { className: "rounded-full bg-accent-subtle px-2 py-1 text-accent", children: ["#", tag.name] }, tag.id)))] })] }), _jsxs("section", { className: "space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm", children: [_jsx(SectionTitle, { icon: Bookmark, title: "\u7406\u89E3\u6269\u5C55" }), card.source && _jsx(InfoItem, { label: "\u6765\u6E90", value: card.source }), card.examples.length > 0 && (_jsx(InfoList, { label: "\u6848\u4F8B", items: card.examples }))] }), _jsxs("section", { className: "space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm", children: [_jsx(SectionTitle, { icon: Zap, title: "\u884C\u52A8\u7EC3\u4E60" }), card.actions.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "\u6682\u672A\u8BBE\u7F6E\u884C\u52A8\u63D0\u793A\uFF0C\u8BB0\u5F97\u8865\u5145\u3002" })) : (_jsx("ol", { className: "list-decimal space-y-2 pl-5 text-sm text-slate-600", children: card.actions.map((action) => (_jsx("li", { children: action.prompt }, action.id))) })), card.triggers.length > 0 && _jsx(InfoList, { label: "\u89E6\u53D1\u573A\u666F", items: card.triggers.map((t) => t.description) })] }), _jsxs("section", { className: "space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm", children: [_jsx(SectionTitle, { icon: PenLine, title: "\u590D\u76D8\u7B14\u8BB0" }), card.reflections.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "\u8FD8\u6CA1\u6709\u590D\u76D8\u8BB0\u5F55\uFF0C\u7EC3\u4E60\u540E\u5199\u4E0B\u4E00\u70B9\u60F3\u6CD5\u3002" })) : (_jsx("div", { className: "space-y-3", children: card.reflections
                            .slice()
                            .reverse()
                            .map((item) => (_jsxs("div", { className: "rounded-xl bg-slate-50 p-3 text-sm text-slate-600", children: [_jsx("p", { className: "text-xs text-slate-400", children: format(new Date(item.createdAt), 'MM-dd HH:mm') }), _jsx("p", { className: "mt-1 leading-relaxed", children: item.content })] }, item.id))) })), _jsxs("form", { className: "space-y-2", onSubmit: handleSubmit, children: [_jsx("textarea", { value: note, onChange: (event) => setNote(event.target.value), rows: 3, placeholder: "\u5199\u4E0B\u8FD9\u6B21\u7EC3\u4E60\u7684\u4F53\u4F1A...", className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none" }), _jsx("button", { type: "submit", className: "w-full rounded-xl bg-accent py-2 text-sm font-semibold text-white", children: "\u4FDD\u5B58\u590D\u76D8" })] })] }), _jsxs("section", { className: "space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm", children: [_jsx(SectionTitle, { icon: Clock, title: "\u590D\u4E60\u65F6\u95F4\u7EBF" }), timeline.length === 0 ? (_jsx("p", { className: "text-sm text-slate-400", children: "\u5C1A\u672A\u5F00\u59CB\u590D\u4E60\uFF0C\u8FDB\u5165\u7EC3\u4E60\u6A21\u5F0F\u5F00\u542F\u7B2C\u4E00\u6B21\u7FFB\u724C\u3002" })) : (_jsx("ul", { className: "space-y-3 text-sm text-slate-600", children: timeline.map((log) => (_jsxs("li", { className: "rounded-xl bg-slate-50 p-3", children: [_jsx("p", { className: "text-xs text-slate-400", children: format(new Date(log.reviewedAt), 'yyyy-MM-dd HH:mm') }), _jsxs("p", { className: "mt-1", children: ["\u638C\u63E1\u8BC4\u5206\uFF1A", log.quality] }), log.reflection && _jsx("p", { className: "mt-1 text-slate-500", children: log.reflection })] }, log.id))) }))] })] }));
}
function SectionTitle({ icon: Icon, title }) {
    return (_jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-slate-700", children: [_jsx(Icon, { className: "h-4 w-4" }), title] }));
}
function InfoItem({ label, value }) {
    return (_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: label }), _jsx("p", { className: "mt-1 text-sm text-slate-600", children: value })] }));
}
function InfoList({ label, items }) {
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: label }), _jsx("ul", { className: "space-y-2 text-sm text-slate-600", children: items.map((item, index) => (_jsx("li", { className: "rounded-xl bg-slate-50 p-3", children: item }, index))) })] }));
}
