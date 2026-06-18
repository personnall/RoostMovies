import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  Home,
  Movies,
  TVShows,
  Popular,
  TopRated,
  People,
  MovieDetails,
  TVDetails,
  PersonDetails,
  Search,
  Favorites,
  Watchlist,
  Player
} from '../pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'movies', element: <Movies /> },
      { path: 'tv', element: <TVShows /> },
      { path: 'popular', element: <Popular /> },
      { path: 'top-rated', element: <TopRated /> },
      { path: 'people', element: <People /> },
      { path: 'search', element: <Search /> },
      { path: 'favorites', element: <Favorites /> },
      { path: 'watchlist', element: <Watchlist /> },
      { path: 'movie/:id', element: <MovieDetails /> },
      { path: 'tv/:id', element: <TVDetails /> },
      { path: 'person/:id', element: <PersonDetails /> },
      { path: 'player/movie/:id', element: <Player /> },
      { path: 'player/tv/:id/:season/:episode', element: <Player /> },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
