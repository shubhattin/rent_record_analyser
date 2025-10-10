'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { setTheme } = useTheme();
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label="System theme"
        onClick={() => setTheme('system')}
      >
        <Monitor className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Light theme"
        onClick={() => setTheme('light')}
      >
        <Sun className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Dark theme" onClick={() => setTheme('dark')}>
        <Moon className="h-5 w-5" />
      </Button>
    </div>
  );
}

export default ThemeToggle;
