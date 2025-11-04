import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { format } from 'date-fns';
import { Flame, History, Hourglass } from 'lucide-react';
import { useCardsStore, selectDueCards, selectUpcoming } from '../../store/useCardsStore';
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
    return (_jsxs("div", { className: "space-y-6 pb-16", children: [_jsxs("section", { className: "rounded-2xl bg-gradient-to-br from-accent via-indigo-600 to-purple-600 p-6 text-white shadow-card", children: [_jsx("p", { className: "text-sm text-white/80", children: "\u4ECA\u65E5\u5F85\u590D\u4E60" }), _jsx("p", { className: "mt-2 text-4xl font-semibold", children: stats.due.length }), _jsx("p", { className: "mt-4 text-sm text-white/70", children: stats.due.length > 0
                            ? '开启翻牌练习，让观点变成动作'
                            : '太棒了！今天的复习任务已经完成' })] }), _jsxs("section", { className: "grid gap-4 md:grid-cols-2", children: [_jsx(StatCard, { icon: Flame, label: "\u5DE9\u56FA\u4E2D", value: stats.learning.length, helper: "\u9700\u8981\u53CD\u590D\u7EC3\u4E60\u7684\u89C2\u70B9" }), _jsx(StatCard, { icon: Hourglass, label: "\u5373\u5C06\u590D\u4E60", value: stats.upcoming.length, helper: stats.upcoming[0]
                            ? `下一张：${format(new Date(stats.upcoming[0].nextReviewAt), 'MM月dd日')}`
                            : '暂无安排' }), _jsx(StatCard, { icon: History, label: "\u5DF2\u638C\u63E1", value: stats.mastered.length, helper: "\u4FDD\u6301\u590D\u76D8\uFF0C\u9632\u6B62\u9057\u5FD8" }), _jsx(StatCard, { icon: Flame, label: "\u603B\u5361\u7247", value: stats.total, helper: "\u6301\u7EED\u6DFB\u52A0\u65B0\u7684\u89C2\u70B9" })] }), _jsx(UpcomingDueList, { title: "\u4ECA\u65E5\u8BA1\u5212", cards: stats.due.slice(0, 4), empty: "\u4ECA\u5929\u6CA1\u6709\u5F85\u590D\u4E60\u7684\u5361\u7247" }), _jsx(UpcomingDueList, { title: "\u672A\u6765\u9884\u544A", cards: stats.upcoming.slice(0, 4), empty: "\u6682\u65E0\u5B89\u6392\uFF0C\u521B\u9020\u65B0\u76EE\u6807\u5427" })] }));
}
function StatCard({ icon: Icon, label, value, helper }) {
    return (_jsxs("div", { className: "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "rounded-full bg-accent-subtle p-2 text-accent", children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-500", children: label }), _jsx("p", { className: "text-2xl font-semibold text-slate-900", children: value })] })] }), _jsx("p", { className: "mt-3 text-xs text-slate-500", children: helper })] }));
}
function UpcomingDueList({ title, cards, empty }) {
    return (_jsxs("section", { className: "space-y-2", children: [_jsx("h3", { className: "text-sm font-semibold text-slate-600", children: title }), _jsxs("div", { className: "space-y-3", children: [cards.length === 0 && _jsx("p", { className: "text-xs text-slate-400", children: empty }), cards.map((card) => (_jsxs("article", { className: "rounded-xl border border-slate-100 bg-white p-4 shadow-sm", children: [_jsx("p", { className: "text-sm font-semibold text-slate-800", children: card.statement }), _jsxs("div", { className: "mt-2 flex items-center gap-2 text-xs text-slate-500", children: [_jsxs("span", { children: ["\u4E0B\u6B21\u590D\u4E60\uFF1A", format(new Date(card.nextReviewAt), 'MM月dd日')] }), _jsxs("span", { children: ["\u638C\u63E1\u5EA6\uFF1A", card.mastery] })] })] }, card.id)))] })] }));
}
