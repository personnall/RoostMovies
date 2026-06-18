import React from 'react';
import AppRoutes from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { GenreProvider } from './context/GenreContext';
import { ToastProvider } from './context/ToastContext';
import { HistoryProvider } from './context/HistoryContext';
import { ContinueWatchingProvider } from './context/ContinueWatchingContext';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <GenreProvider>
        <ToastProvider>
          <FavoritesProvider>
            <WatchlistProvider>
              <HistoryProvider>
                <ContinueWatchingProvider>
                  <AppRoutes />
                </ContinueWatchingProvider>
              </HistoryProvider>
            </WatchlistProvider>
          </FavoritesProvider>
        </ToastProvider>
      </GenreProvider>
    </ThemeProvider>
  );
}

export default App;
