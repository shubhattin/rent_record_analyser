'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getPageTitle } from '@/state/page_titles';
import { Separator } from '@/components/ui/separator';

function buildBreadcrumbs(pathname: string): Array<{ href: string; label: string }> {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs: Array<{ href: string; label: string }> = [{ href: '/', label: 'Home' }];
  let acc = '';
  for (const segment of parts) {
    acc += '/' + segment;
    crumbs.push({ href: acc, label: segment.replace(/[-_]/g, ' ') });
  }
  return crumbs;
}

export default function PageHeader({
  className,
  actions
}: {
  className?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname() ?? '/';
  const [title, titleClass] = getPageTitle(pathname);
  const crumbs = buildBreadcrumbs(pathname);

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <div>
          {title && <h1 className={cn('text-2xl font-semibold', titleClass)}>{title}</h1>}
          <nav className="text-sm text-muted-foreground">
            {crumbs.map((c, i) => (
              <span key={c.href}>
                {i > 0 && <span className="mx-1">/</span>}
                <Link href={c.href} className="hover:underline">
                  {c.label}
                </Link>
              </span>
            ))}
          </nav>
        </div>
        {actions}
      </div>
      <Separator />
    </div>
  );
}
