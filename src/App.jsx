import React from 'react';
import AppRoutes from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { WatchlistProvider } from './context/WatchlistContext';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <WatchlistProvider>
          <AppRoutes />
        </WatchlistProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
