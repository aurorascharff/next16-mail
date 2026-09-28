import { Skeleton } from '@/components/ui/skeleton';
import { isPrefetchEnabled, isSlowEnabled } from '../demo-queries';
import { DemoToolbarClient } from './demo-toolbar-client';

export async function DemoToolbar() {
  const [prefetchEnabled, slowEnabled] = await Promise.all([isPrefetchEnabled(), isSlowEnabled()]);
  return <DemoToolbarClient prefetchEnabled={prefetchEnabled} slowEnabled={slowEnabled} />;
}

export function DemoToolbarSkeleton() {
  return <Skeleton className="skeleton-subtle h-8 w-72 rounded-full" />;
}
