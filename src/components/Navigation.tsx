import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Home, Gamepad2, Map, Presentation, Music } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/arcade', label: 'Arcade', icon: Gamepad2 },
    { path: '/map', label: 'Atlas', icon: Map },
    { path: '/media', label: 'Radio', icon: Music },
    { path: '/tests', label: 'Tests', icon: Presentation },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-bg-surface/80 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex gap-8 items-center h-full">
          <Link to="/" className="text-xl font-bold text-primary tracking-tight">
            jc.labs
          </Link>
          <div className="hidden md:flex gap-1 h-full items-center">
            {links.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-text-muted hover:text-text-main hover:bg-bg-base'
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}
