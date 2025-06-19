import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState(() => {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return parsed.appearance?.theme || 'dark';
      }
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    
    // Update state
    setTheme(newTheme);
    
    // Update localStorage
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        parsed.appearance = { ...parsed.appearance, theme: newTheme };
        localStorage.setItem('userSettings', JSON.stringify(parsed));
      } else {
        localStorage.setItem('userSettings', JSON.stringify({
          appearance: { theme: newTheme }
        }));
      }
    } catch {
      localStorage.setItem('theme', newTheme);
    }
    
    // Apply theme immediately
    const root = document.documentElement;
    const body = document.body;
    
    root.classList.remove('light', 'dark');
    body.classList.remove('light', 'dark');
    
    if (newTheme === 'light') {
      root.classList.add('light');
      body.classList.add('light');
    } else {
      root.classList.add('dark');
      body.classList.add('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
