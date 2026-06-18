import React from 'react';
import AppRoutes from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { GenreProvider } from './context/GenreContext';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <GenreProvider>
        <FavoritesProvider>
          <WatchlistProvider>
            <AppRoutes />
          </WatchlistProvider>
        </FavoritesProvider>
      </GenreProvider>
    </ThemeProvider>
  );
}

export default App;
