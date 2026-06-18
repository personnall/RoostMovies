import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const ContinueWatchingContext = createContext();

export const ContinueWatchingProvider = ({ children }) => {
  const [continueWatching, setContinueWatching] = useLocalStorage('roost_continue_watching', []);

  const updateContinueWatching = (item) => {
    setContinueWatching((prev) => {
      const filtered = prev.filter((i) => i.id !== item.id);
      const newItem = {
        ...item,
        lastWatched: Date.now(),
      };
      // Keep only latest 50 entries
      const newList = [newItem, ...filtered].slice(0, 50);
      return newList;
    });
  };

  const removeFromContinueWatching = (id) => {
    setContinueWatching((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ContinueWatchingContext.Provider value={{ continueWatching, updateContinueWatching, removeFromContinueWatching }}>
      {children}
    </ContinueWatchingContext.Provider>
  );
};

export const useContinueWatching = () => {
  const context = useContext(ContinueWatchingContext);
  if (!context) {
    throw new Error('useContinueWatching must be used within a ContinueWatchingProvider');
  }
  return context;
};
