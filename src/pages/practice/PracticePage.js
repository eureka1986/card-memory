import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useCardsStore, selectDueCards } from '../../store/useCardsStore';
const qualities = [
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
    const handleQuality = async (quality) => {
        if (!current)
            return;
        await logReview(current.id, quality, reflection.trim() ? reflection.trim() : undefined);
        setReflection('');
        setShowBack(false);
        setIndex((prev) => prev + 1);
    };
    return (_jsxs("div", { className: "pb-24", children: [_jsxs("header", { className: "mb-4 space-y-1", children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "\u4ECA\u65E5\u4EFB\u52A1" }), _jsxs("h1", { className: "text-xl font-semibold text-slate-900", children: ["\u7FFB\u724C\u7EC3\u4E60", _jsxs("span", { className: "ml-2 text-sm text-slate-500", children: [Math.min(index + (current ? 1 : 0), dueCards.length), "/", dueCards.length] })] })] }), current ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { rotateY: 90, opacity: 0 }, animate: { rotateY: 0, opacity: 1 }, exit: { rotateY: -90, opacity: 0 }, transition: { duration: 0.35, ease: 'easeInOut' }, className: "h-[340px] cursor-pointer rounded-3xl bg-white p-6 text-slate-900 shadow-card", onClick: handleFlip, children: !showBack ? (_jsx(FrontFace, { statement: current.statement, keywords: current.keywords })) : (_jsx(BackFace, { summary: current.summary, actions: current.actions, triggers: current.triggers })) }, showBack ? 'back' : 'front') }), _jsx("p", { className: "pointer-events-none absolute inset-x-0 -bottom-8 text-center text-xs text-slate-400", children: "\u70B9\u51FB\u5361\u7247\u7FFB\u9762 \u2022 \u4E0A\u6ED1\u8868\u793A\u638C\u63E1" })] }), showBack && (_jsx("div", { className: "space-y-3 rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-sm", children: _jsxs("label", { className: "space-y-2", children: [_jsx("span", { className: "text-xs font-medium text-slate-500", children: "\u590D\u76D8\u8BB0\u5F55" }), _jsx("textarea", { value: reflection, onChange: (event) => setReflection(event.target.value), rows: 3, placeholder: "\u7528\u81EA\u5DF1\u7684\u8BED\u8A00\u590D\u8FF0\u6216\u5199\u4E0B\u5E94\u7528\u8BA1\u5212", className: "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-accent focus:outline-none" })] }) })), _jsx("div", { className: "grid grid-cols-2 gap-3", children: qualities.map((quality) => (_jsx("button", { onClick: () => handleQuality(quality.value), className: `rounded-2xl px-3 py-3 text-sm font-semibold transition ${quality.tone}`, children: quality.label }, quality.value))) })] })) : (_jsx(EmptyState, {}))] }));
}
function FrontFace({ statement, keywords }) {
    return (_jsxs("div", { className: "flex h-full flex-col justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "\u89C2\u70B9" }), _jsx("p", { className: "mt-3 text-xl font-semibold leading-snug text-slate-900", children: statement })] }), _jsx("div", { className: "flex flex-wrap gap-2 text-xs text-slate-500", children: keywords.map((keyword) => (_jsxs("span", { className: "rounded-full bg-slate-100 px-2 py-1", children: ["#", keyword] }, keyword))) })] }));
}
function BackFace({ summary, actions, triggers }) {
    return (_jsxs("div", { className: "flex h-full flex-col gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "\u7406\u89E3" }), _jsx("p", { className: "text-sm leading-6 text-slate-600", children: summary })] }), actions.length > 0 && (_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "\u884C\u52A8" }), _jsx("ul", { className: "space-y-1 text-sm text-slate-600", children: actions.map((action) => (_jsx("li", { className: "rounded-xl bg-slate-100 px-3 py-2", children: action.prompt }, action.id))) })] })), triggers.length > 0 && (_jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs uppercase tracking-wide text-slate-400", children: "\u89E6\u53D1" }), _jsx("ul", { className: "space-y-1 text-sm text-slate-600", children: triggers.map((trigger) => (_jsx("li", { className: "rounded-xl bg-slate-100 px-3 py-2", children: trigger.description }, trigger.id))) })] }))] }));
}
function EmptyState() {
    return (_jsxs("div", { className: "rounded-3xl bg-white p-8 text-center shadow-card", children: [_jsx(Sparkles, { className: "mx-auto h-10 w-10 text-accent" }), _jsx("p", { className: "mt-3 text-lg font-semibold text-slate-900", children: "\u4ECA\u65E5\u590D\u4E60\u5DF2\u5B8C\u6210" }), _jsx("p", { className: "mt-1 text-sm text-slate-500", children: "\u53BB\u53D1\u73B0\u65B0\u7684\u89C2\u70B9\uFF0C\u6216\u56DE\u987E\u5DF2\u638C\u63E1\u7684\u5361\u7247\u5427\u3002" })] }));
}
