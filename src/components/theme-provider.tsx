import * as React from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  setTheme: (t: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'hophub:theme';

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children, defaultTheme = 'system' }: { children: React.ReactNode; defaultTheme?: Theme }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? defaultTheme;
  });
  const [resolvedTheme, setResolvedTheme] = React.useState<'dark' | 'light'>(() =>
    theme === 'system' ? getSystemTheme() : theme
  );

  React.useEffect(() => {
    const root = document.documentElement;
    const next = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(next);
    root.classList.toggle('dark', next === 'dark');
  }, [theme]);

  React.useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const next = mq.matches ? 'dark' : 'light';
      setResolvedTheme(next);
      document.documentElement.classList.toggle('dark', next === 'dark');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = React.useCallback((t: Theme) => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  }, []);

  const value = React.useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
