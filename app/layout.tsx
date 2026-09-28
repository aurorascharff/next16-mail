import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Suspense } from 'react';
import { BoundaryProvider } from '@/components/internal/boundary';
import { OfflineIndicator } from '@/components/offline-indicator';
import { NavLinkScript } from '@/components/scripts/nav-link-script';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/toaster';
import { DemoToolbar } from '@/features/demo/components/demo-toolbar';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { color: '#ffffff', media: '(prefers-color-scheme: light)' },
    { color: '#0b0b0c', media: '(prefers-color-scheme: dark)' },
  ],
  viewportFit: 'cover',
};

const description =
  'A Next.js 16.4 mail client demonstrating Instant Navigations with Cache Components and Partial Prefetching.';

export const metadata: Metadata = {
  applicationName: 'Stamp',
  description,
  formatDetection: {
    address: false,
    date: false,
    email: false,
    telephone: false,
  },
  icons: { apple: '/logo.svg', icon: '/logo.svg' },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000'),
  ),
  openGraph: {
    description,
    siteName: 'Stamp',
    title: 'Stamp',
    type: 'website',
  },
  title: { default: 'Stamp', template: '%s · Stamp' },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <BoundaryProvider>
            {children}
            <div className="demo-toggles fixed right-4 bottom-4 z-50 hidden items-end md:flex">
              <Suspense>
                <DemoToolbar />
              </Suspense>
            </div>
            <Toaster />
            <OfflineIndicator />
            <NavLinkScript />
          </BoundaryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
