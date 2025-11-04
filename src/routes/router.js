import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { CardsPage } from '../pages/cards/CardsPage';
import { CardDetailPage } from '../pages/cards/CardDetailPage';
import { NewCardPage } from '../pages/cards/NewCardPage';
import { PracticePage } from '../pages/practice/PracticePage';
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(AppLayout, {}),
        children: [
            { index: true, element: _jsx(DashboardPage, {}) },
            { path: 'cards', element: _jsx(CardsPage, {}) },
            { path: 'cards/new', element: _jsx(NewCardPage, {}) },
            { path: 'cards/:cardId', element: _jsx(CardDetailPage, {}) },
            { path: 'practice', element: _jsx(PracticePage, {}) }
        ]
    }
]);
