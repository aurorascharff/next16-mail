'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <ErrorState
      body="This page could not be loaded. It is safe to try again."
      className="min-h-dvh"
      title="Something went wrong."
      variant="page"
    >
      <Button
        onClick={() => startTransition(() => retry())}
        disabled={isPending}
        aria-busy={isPending}
        size="sm"
        variant="secondary"
      >
        {isPending && <Spinner />}
        {isPending ? 'Retrying…' : 'Try again'}
      </Button>
    </ErrorState>
  );
}
