import React, { createContext, useContext, useState, useEffect } from 'react';
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

extend([mixPlugin]);

const DynamicThemeContext = createContext();

export const DynamicThemeProvider = ({ children }) => {
  const [dominantColor, setDominantColor] = useState('#00F0FF'); // Default Cyberpunk Cyan
  const [themeColors, setThemeColors] = useState({
    primary: '#00F0FF',
    primaryGlow: 'rgba(0, 240, 255, 0.5)',
    secondary: '#FF003C',
    accent: '#7000FF',
  });

  const updateThemeColor = (color) => {
    if (!color) return;

    const c = colord(color);
    const primary = c.toHex();
    const primaryGlow = c.alpha(0.5).toRgbString();

    // Generate a complementary or harmonious accent
    const secondary = c.hue(c.hue() + 180).toHex();
    const accent = c.hue(c.hue() + 90).toHex();

    setDominantColor(primary);
    setThemeColors({
      primary,
      primaryGlow,
      secondary,
      accent,
    });

    // Update CSS variables
    document.documentElement.style.setProperty('--color-primary', primary);
    document.documentElement.style.setProperty('--color-primary-glow', primaryGlow);
    document.documentElement.style.setProperty('--color-secondary', secondary);
    document.documentElement.style.setProperty('--color-accent', accent);
  };

  return (
    <DynamicThemeContext.Provider value={{ themeColors, dominantColor, updateThemeColor }}>
      {children}
    </DynamicThemeContext.Provider>
  );
};

export const useDynamicTheme = () => useContext(DynamicThemeContext);
