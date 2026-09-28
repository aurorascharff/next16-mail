import { Suspense } from 'react';
import { Compose, ComposeSkeleton } from '@/features/thread/components/compose';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New message' };

export default function ComposePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-6 pb-24 sm:px-8 sm:pt-10">
      <h1>New message</h1>
      <div className="mt-6">
        <Suspense fallback={<ComposeSkeleton />}>
          <Compose />
        </Suspense>
      </div>
    </div>
  );
}
