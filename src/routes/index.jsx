import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';

const Home = lazy(() => import('../pages/Home'));
const Movies = lazy(() => import('../pages/Movies'));
const TVShows = lazy(() => import('../pages/TVShows'));
const Search = lazy(() => import('../pages/Search'));
const Favorites = lazy(() => import('../pages/Favorites'));
const Watchlist = lazy(() => import('../pages/Watchlist'));
const History = lazy(() => import('../pages/History'));
const MovieDetails = lazy(() => import('../pages/MovieDetails'));
const TVDetails = lazy(() => import('../pages/TVDetails'));
const PersonDetails = lazy(() => import('../pages/PersonDetails'));
const Player = lazy(() => import('../pages/Player'));
const NotFound = lazy(() => import('../pages/NotFound'));

import {
  Popular,
  TopRated,
  People
} from '../pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary><NotFound /></ErrorBoundary>,
    children: [
      { index: true, element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense> },
      { path: 'movies', element: <Suspense fallback={<div>Loading...</div>}><Movies /></Suspense> },
      { path: 'tv', element: <Suspense fallback={<div>Loading...</div>}><TVShows /></Suspense> },
      { path: 'popular', element: <Popular /> },
      { path: 'top-rated', element: <TopRated /> },
      { path: 'people', element: <People /> },
      { path: 'search', element: <Suspense fallback={<div>Loading...</div>}><Search /></Suspense> },
      { path: 'favorites', element: <Suspense fallback={<div>Loading...</div>}><Favorites /></Suspense> },
      { path: 'watchlist', element: <Suspense fallback={<div>Loading...</div>}><Watchlist /></Suspense> },
      { path: 'history', element: <Suspense fallback={<div>Loading...</div>}><History /></Suspense> },
      { path: 'movie/:id', element: <Suspense fallback={<div>Loading...</div>}><MovieDetails /></Suspense> },
      { path: 'tv/:id', element: <Suspense fallback={<div>Loading...</div>}><TVDetails /></Suspense> },
      { path: 'person/:id', element: <Suspense fallback={<div>Loading...</div>}><PersonDetails /></Suspense> },
      { path: 'player/movie/:id', element: <Suspense fallback={<div>Loading...</div>}><Player /></Suspense> },
      { path: 'player/tv/:id/:season/:episode', element: <Suspense fallback={<div>Loading...</div>}><Player /></Suspense> },
      { path: '*', element: <Suspense fallback={<div>Loading...</div>}><NotFound /></Suspense> },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
