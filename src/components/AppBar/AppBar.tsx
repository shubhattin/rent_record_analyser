'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPageTitle } from '@/state/page_titles';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Menu, Plus, Pencil, ArrowLeft } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import ThemeToggle from '~/components/AppBar/ThemeToggle';
import { useContext } from 'react';
import { AppContext } from '@/state/AppDataContext';

export default function AppBar({
  start,
  headline,
  end
}: {
  start?: React.ReactNode;
  headline?: React.ReactNode;
  end?: React.ReactNode;
}) {
  const pathname = usePathname() ?? '/';
  const [title, titleClass] = getPageTitle(pathname);
  const { user_info } = useContext(AppContext);

  return (
    <div
      className={cn(
        'sticky top-0 z-40 w-full border-b backdrop-blur',
        'bg-slate-100 dark:bg-zinc-700/60'
      )}
    >
      <div className="flex h-12 items-center justify-between px-2 sm:px-3">
        <div className="flex items-center gap-2">
          {pathname !== '/' && (
            <Link href="/" aria-label="Home">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          {start}
          {headline ? headline : title ? <span className={cn(titleClass)}>{title}</span> : null}
        </div>
        <div className="flex items-center gap-1">
          {end ?? (
            <>
              {pathname !== '/add' && (
                <Link href="/add" aria-label="Add">
                  <Button variant="ghost" size="icon">
                    <Plus className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              {user_info && pathname !== '/list' && (
                <Link href="/list" aria-label="Edit">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-60 p-3 select-none">
              <Link
                href="https://github.com/shubhattin/rent_record_analyser"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-accent"
              >
                <FaGithub className="size-5" />
                <span>GitHub</span>
              </Link>
              <Separator className="my-1.5" />
              <div className="flex items-center gap-2 px-1.5">
                <span className="text-sm text-muted-foreground">Set Theme</span>
                <ThemeToggle />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
