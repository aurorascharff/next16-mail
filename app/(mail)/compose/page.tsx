import { Suspense } from 'react';
import ErrorBoundary from '@/components/ui/error-boundary';
import { Compose, ComposeSkeleton } from '@/features/thread/components/compose';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New message' };

export default function ComposePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:px-8 sm:py-10">
      <h1>New message</h1>
      <div className="mt-6">
        <ErrorBoundary title="Compose unavailable">
          <Suspense fallback={<ComposeSkeleton />}>
            <Compose />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}
