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

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3">
          <Layers className="h-6 w-6 text-accent" />
          <div>
            <p className="text-base font-semibold">观点记忆卡片</p>
            <p className="text-xs text-slate-500">把灵感练成肌肉记忆</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-4">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-sm text-slate-500">数据加载中…</div>
        ) : (
          <Outlet />
        )}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10">
        <div className="mx-auto flex max-w-4xl items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium',
                    isActive
                      ? 'text-accent bg-accent-subtle/60'
                      : 'text-slate-500 hover:text-slate-700'
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
