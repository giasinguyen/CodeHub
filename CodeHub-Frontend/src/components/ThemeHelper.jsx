import React, { useEffect } from 'react';

const ThemeHelper = () => {
  useEffect(() => {
    // Add theme classes to html element
    const applyTheme = () => {
      try {
        // Try to get theme from userSettings first
        const savedSettings = localStorage.getItem('userSettings');
        let theme = 'dark'; // default
        
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          theme = parsed.appearance?.theme || 'dark';
        } else {
          // Fallback to old theme storage
          theme = localStorage.getItem('theme') || 'dark';
        }
        
        const root = document.documentElement;
        const body = document.body;
        
        // Remove all theme classes first
        root.classList.remove('light', 'dark');
        body.classList.remove('light', 'dark');
        
        if (theme === 'light') {
          root.classList.add('light');
          body.classList.add('light');
          console.log('Applied light theme');
        } else if (theme === 'dark') {
          root.classList.add('dark');
          body.classList.add('dark');
          console.log('Applied dark theme');
        } else { // auto
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const themeToApply = prefersDark ? 'dark' : 'light';
          root.classList.add(themeToApply);
          body.classList.add(themeToApply);
          console.log(`Applied auto theme: ${themeToApply}`);
        }

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          const isDark = root.classList.contains('dark');
          metaThemeColor.setAttribute('content', isDark ? '#0f172a' : '#ffffff');
        }

        // Force a style recalculation
        setTimeout(() => {
          document.body.style.display = 'none';
          document.body.offsetHeight; // trigger reflow
          document.body.style.display = '';
        }, 50);

      } catch (error) {
        console.error('Error applying theme:', error);
        // Fallback to dark theme
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      }
    };

    // Apply theme immediately
    applyTheme();

    // Listen for storage changes
    window.addEventListener('storage', applyTheme);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyTheme);
    
    return () => {
      window.removeEventListener('storage', applyTheme);
      mediaQuery.removeEventListener('change', applyTheme);
    };
  }, []);

  return null;
};

export default ThemeHelper;
