import { lazy } from 'react';
import PageLayout from '@/components/Layout/PageLayout';
import { AppRoute } from '@/interfaces/routes';

const Home = lazy(() => import('@/pages/Home/Home'));
const Games = lazy(() => import('@/pages/Games/Games'));
const GamesList = lazy(() => import('@/pages/Games/GamesList/GamesList'));
const GameDetails = lazy(() => import('@/pages/Games/GameDetails/GameDetails'));
const Sales = lazy(() => import('@/pages/Games/Sales/Sales'));
const Popular = lazy(() => import('@/pages/Games/Popular/Popular'));
const Favourites = lazy(() => import('@/pages/Favourites/Favourites'));
const Basket = lazy(() => import('@/pages/Basket/Basket'));
const Profile = lazy(() => import('@/pages/Profile/Profile'));
const About = lazy(() => import('@/pages/About/About'));
const Terms = lazy(() => import('@/pages/Terms/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy/Privacy'));
const Support = lazy(() => import('@/pages/Support/Support'));
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'));

export const routes = [
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <Home />,
        title: 'Главная'
      },
      {
        path: 'games',
        element: <Games />,
        children: [
          {
            index: true,
            element: <GamesList />,
            title: 'Все игры'
          },
          {
            path: 'sales',
            element: <Sales />,
            title: 'Скидки'
          },
          {
            path: 'popular',
            element: <Popular />,
            title: 'Популярные'
          },
          {
            path: ':gameId',
            element: <GameDetails />,
            title: 'Детали игры'
          }
        ]
      },
      {
        path: 'user/favourites',
        element: <Favourites />,
        title: 'Избранное'
      },
      {
        path: 'user/basket',
        element: <Basket />,
        title: 'Корзина'
      },
      {
        path: 'user/profile',
        element: <Profile />,
        title: 'Профиль'
      },
      {
        path: 'info/about',
        element: <About />,
        title: 'О нас'
      },
      {
        path: 'info/terms',
        element: <Terms />,
        title: 'Условия использования'
      },
      {
        path: 'info/privacy',
        element: <Privacy />,
        title: 'Политика конфиденциальности'
      },
      {
        path: 'info/support',
        element: <Support />,
        title: 'Поддержка'
      },
      {
        path: '*',
        element: <NotFound />,
        title: 'Страница не найдена'
      }
    ]
  }
] as AppRoute[]; 