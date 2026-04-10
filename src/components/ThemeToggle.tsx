import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'default' | 'retro' | 'steampunk';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('default');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-retro', 'theme-steampunk', 'dark');
    
    if (theme !== 'default') {
      root.classList.add(`theme-${theme}`);
    }
    
    if (isDark) {
      root.classList.add('dark');
    }
  }, [theme, isDark]);

  return (
    <div className="flex items-center gap-4 bg-bg-surface p-2 rounded-full border border-border shadow-sm">
      <button 
        onClick={() => setIsDark(!isDark)}
        className="p-2 rounded-full hover:bg-bg-base text-text-muted hover:text-primary transition-colors"
        title="Toggle Dark Mode"
      >
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      
      <div className="w-px h-6 bg-border mx-1"></div>

      <div className="flex gap-2">
        {(['default', 'retro', 'steampunk'] as Theme[]).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-3 py-1 text-sm rounded-full transition-all capitalize ${
              theme === t 
                ? 'bg-primary text-white shadow-md font-medium' 
                : 'text-text-muted hover:bg-bg-base hover:text-text-main'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
