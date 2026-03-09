'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 transition-all hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="transition-all" />
      ) : (
        <Moon size={18} className="transition-all" />
      )}
    </button>
  );
}
