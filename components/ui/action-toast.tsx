'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

type ActionResult = { ok: true } | { ok: false; error: string };
type Action = { label: string; run: () => Promise<ActionResult> };

export function actionToast(message: string, action: Action) {
  const id = toast.custom(toastId => <ActionToast action={action} id={toastId} message={message} />, {
    duration: 8000,
  });
  return id;
}

function ActionToast({ action, id, message }: { action: Action; id: string | number; message: string }) {
  const [isPending, startTransition] = useTransition();

  function run() {
    toast.custom(() => <ActionToast action={action} id={id} message={message} />, { duration: Infinity, id });
    startTransition(async () => {
      const result = await action.run();
      toast.dismiss(id);
      if (!result.ok) toast.error(result.error);
    });
  }

  return (
    <div className="border-divider dark:border-divider-dark pointer-events-auto flex w-[356px] items-center gap-4 rounded-lg border bg-white px-4 py-3 text-sm shadow-lg dark:bg-black">
      <p className="flex-1">{message}</p>
      <button
        aria-busy={isPending || undefined}
        className="text-accent hover:text-accent-hover inline-flex h-7 w-16 items-center justify-center rounded-full font-semibold transition-colors disabled:opacity-70"
        disabled={isPending}
        onClick={run}
        type="button"
      >
        {isPending ? <Spinner /> : action.label}
      </button>
    </div>
  );
}
