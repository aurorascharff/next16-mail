'use client';

import { catchError, type ErrorInfo } from 'next/error';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/ui/error-state';
import { Spinner } from '@/components/ui/spinner';

function ErrorFallback(props: { className?: string; title?: string }, { retry }: ErrorInfo) {
  const [isPending, startTransition] = useTransition();

  return (
    <ErrorState
      body="This section could not be loaded."
      className={props.className}
      title={props.title ?? 'Something went wrong'}
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

export default catchError(ErrorFallback);
