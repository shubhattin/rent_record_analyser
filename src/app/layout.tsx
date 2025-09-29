import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { Metadata, Viewport } from 'next';
import { AppContextProvider } from '~/components/AppDataContext';
import { ConvexClientProvider } from './ConvexClientProvider';
import { fetchQuery } from 'convex/nextjs';
import { api } from '$convex/_generated/api';
import { getToken } from '~/lib/auth-server';

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();
  const user = await fetchQuery(api.auth.getCurrentUser, {}, { token });

  return (
    <html lang="en" suppressHydrationWarning className="dark" style={{ colorScheme: 'dark' }}>
      <body className={cn('antialiased', 'overflow-y-scroll sm:px-2 lg:px-3 xl:px-4 2xl:px-4')}>
        <ThemeProvider
          attribute={['class']}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppContextProvider initialSession={user}>
            <ConvexClientProvider>
              <div className="container mx-auto mb-1">
                <Toaster richColors={true} />
                {children}
              </div>
            </ConvexClientProvider>
          </AppContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// export const runtime = 'edge';

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover'
};

export const dynamic = 'force-dynamic';
