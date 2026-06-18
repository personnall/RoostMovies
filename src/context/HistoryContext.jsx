import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useLocalStorage('roost_history', []);

  const addToHistory = (item) => {
    setHistory((prev) => {
      // Remove if already exists to move it to the top
      const filtered = prev.filter((i) => i.id !== item.id);
      const newItem = {
        ...item,
        timestamp: Date.now(),
      };
      return [newItem, ...filtered];
    });
  };

  const removeFromHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, removeFromHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
