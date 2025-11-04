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
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'cards', element: <CardsPage /> },
      { path: 'cards/new', element: <NewCardPage /> },
      { path: 'cards/:cardId', element: <CardDetailPage /> },
      { path: 'practice', element: <PracticePage /> }
    ]
  }
]);
