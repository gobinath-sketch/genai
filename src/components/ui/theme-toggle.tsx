import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse" />;
  }

  const getIcon = () => {
    return theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />;
  };

  const getTooltip = () => {
    return theme === 'light' ? 'Light mode' : 'Dark mode';
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
      title={getTooltip()}
    >
      {getIcon()}
    </button>
  );
}; 