import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { Layers, LayoutGrid, PlusCircle, RefreshCcw, ScrollText } from 'lucide-react';
import { useCardsStore } from '../store/useCardsStore';
import { cn } from '../lib/utils';
const tabs = [
    { to: '/', label: '概览', icon: LayoutGrid },
    { to: '/cards', label: '卡片', icon: ScrollText },
    { to: '/practice', label: '练习', icon: RefreshCcw },
    { to: '/cards/new', label: '新建', icon: PlusCircle }
];
export function AppLayout() {
    const initialize = useCardsStore((state) => state.initialize);
    const loading = useCardsStore((state) => state.loading);
    useEffect(() => {
        initialize();
    }, [initialize]);
    return (_jsxs("div", { className: "min-h-screen bg-surface", children: [_jsx("header", { className: "sticky top-0 z-20 border-b border-slate-100 bg-surface/90 backdrop-blur", children: _jsxs("div", { className: "mx-auto flex max-w-4xl items-center gap-2 px-4 py-3", children: [_jsx(Layers, { className: "h-6 w-6 text-accent" }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-semibold", children: "\u89C2\u70B9\u8BB0\u5FC6\u5361\u7247" }), _jsx("p", { className: "text-xs text-slate-500", children: "\u628A\u7075\u611F\u7EC3\u6210\u808C\u8089\u8BB0\u5FC6" })] })] }) }), _jsx("main", { className: "mx-auto max-w-4xl px-4 pb-24 pt-4", children: loading ? (_jsx("div", { className: "flex h-64 items-center justify-center text-sm text-slate-500", children: "\u6570\u636E\u52A0\u8F7D\u4E2D\u2026" })) : (_jsx(Outlet, {})) }), _jsx("nav", { className: "fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10", children: _jsx("div", { className: "mx-auto flex max-w-4xl items-center justify-around py-2", children: tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (_jsxs(NavLink, { to: tab.to, className: ({ isActive }) => cn('flex flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium', isActive
                                ? 'text-accent bg-accent-subtle/60'
                                : 'text-slate-500 hover:text-slate-700'), children: [_jsx(Icon, { className: "h-5 w-5" }), tab.label] }, tab.to));
                    }) }) })] }));
}
