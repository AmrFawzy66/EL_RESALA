import React, { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'elresala.theme.v1';

export const THEMES = [
  { id: 'resala', name: 'أخضر الرسالة (افتراضي)', swatch: '#1f7d61' },
  { id: 'ocean', name: 'أزرق المحيط', swatch: '#1d6fa5' },
  { id: 'sunset', name: 'برتقالي الغروب', swatch: '#c2570b' },
  { id: 'violet', name: 'بنفسجي', swatch: '#6d3fb5' },
  { id: 'dark', name: 'داكن (ليلي)', swatch: '#111827' },
];

const ThemeContext = createContext(null);

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { theme: 'resala', eyeComfort: false, compact: false };
    return { theme: 'resala', eyeComfort: false, compact: false, ...JSON.parse(raw) };
  } catch {
    return { theme: 'resala', eyeComfort: false, compact: false };
  }
}

export function ThemeProvider({ children }) {
  const [state, setState] = useState(readStored);

  // Apply to <html>/<body> whenever it changes.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    root.classList.toggle('dark', state.theme === 'dark');
    document.body.classList.toggle('eye-comfort', Boolean(state.eyeComfort));
    document.body.classList.toggle('density-compact', Boolean(state.compact));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function setTheme(theme) {
    setState((prev) => ({ ...prev, theme }));
  }
  function toggleEyeComfort() {
    setState((prev) => ({ ...prev, eyeComfort: !prev.eyeComfort }));
  }
  function toggleCompact() {
    setState((prev) => ({ ...prev, compact: !prev.compact }));
  }

  return (
    <ThemeContext.Provider value={{ ...state, setTheme, toggleEyeComfort, toggleCompact, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
