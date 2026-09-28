'use client';

import * as Ariakit from '@ariakit/react';
import { CircleHelp, Eye, EyeOff, Timer, TimerOff, Wifi, WifiOff, Zap, ZapOff } from 'lucide-react';
import { useOffline } from 'next/offline';
import { type ButtonHTMLAttributes, type ReactNode, useOptimistic } from 'react';
import { Boundary, useBoundaryMode } from '@/components/internal/boundary';
import { cn } from '@/lib/utils';
import { setPrefetch, setSlow } from '../demo-actions';
import { setSimulatedOffline } from '../demo-offline';

function Divider() {
  return <div className="bg-divider dark:bg-divider-dark h-5 w-px" />;
}

type ToggleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active: boolean;
  icon: ReactNode;
  label: string;
};

function ToggleButton({ active, className, icon, label, ...props }: ToggleButtonProps) {
  return (
    <button
      {...props}
      type={props.type ?? 'button'}
      title={label}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors',
        'focus-visible:bg-accent/10 dark:focus-visible:bg-accent/20 focus-visible:outline-none',
        active ? 'text-accent' : 'text-gray',
        props.disabled && 'cursor-default',
        className,
      )}
    >
      {icon}
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
}

function CookieToggle({
  enabled,
  iconOff,
  iconOn,
  label,
  onToggle,
}: {
  enabled: boolean;
  iconOff: ReactNode;
  iconOn: ReactNode;
  label: string;
  onToggle: (enabled: boolean) => Promise<void>;
}) {
  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(enabled);
  const pending = optimisticEnabled !== enabled;

  return (
    <form
      action={async () => {
        const next = !optimisticEnabled;
        setOptimisticEnabled(next);
        await onToggle(next);
        window.location.reload();
      }}
    >
      <ToggleButton
        active={optimisticEnabled}
        aria-label={`${label} ${optimisticEnabled ? 'on' : 'off'}`}
        aria-pressed={optimisticEnabled}
        disabled={pending}
        icon={optimisticEnabled ? iconOn : iconOff}
        label={label}
        type="submit"
      />
    </form>
  );
}

export function DemoToolbarClient({
  prefetchEnabled,
  slowEnabled,
}: {
  prefetchEnabled: boolean;
  slowEnabled: boolean;
}) {
  const { mode, toggleMode } = useBoundaryMode();
  const offline = useOffline();
  const guide = Ariakit.useDialogStore();

  return (
    <div
      style={{ viewTransitionName: 'demo-toolbar' }}
      className="border-divider dark:border-divider-dark bg-elevated/80 dark:bg-elevated-dark/80 flex items-center overflow-hidden rounded-full border text-xs shadow-sm backdrop-blur-md"
    >
      <ToggleButton
        active={mode === 'on'}
        aria-label={mode === 'on' ? 'Client outlines on' : 'Client outlines off'}
        aria-pressed={mode === 'on'}
        icon={mode === 'on' ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        label="Client"
        onClick={toggleMode}
      />
      <Divider />
      <CookieToggle
        enabled={prefetchEnabled}
        iconOff={<ZapOff className="size-3.5" />}
        iconOn={<Zap className="size-3.5" />}
        label="Prefetch"
        onToggle={setPrefetch}
      />
      <Divider />
      <CookieToggle
        enabled={slowEnabled}
        iconOff={<TimerOff className="size-3.5" />}
        iconOn={<Timer className="size-3.5" />}
        label="Delays"
        onToggle={setSlow}
      />
      <Divider />
      <ToggleButton
        active={!offline}
        aria-label={offline ? 'Simulating offline' : 'Online'}
        aria-pressed={offline}
        icon={offline ? <WifiOff className="size-3.5" /> : <Wifi className="size-3.5" />}
        label={offline ? 'Offline' : 'Online'}
        onClick={() => setSimulatedOffline(!offline)}
      />
      <Divider />
      <Ariakit.DialogDisclosure
        store={guide}
        aria-label="How this demo works"
        title="How this demo works"
        className="text-muted focus-visible:bg-accent/10 dark:focus-visible:bg-accent/20 flex h-8 items-center px-2.5 transition-colors hover:text-black focus-visible:outline-none dark:hover:text-white"
      >
        <CircleHelp className="size-3.5" />
      </Ariakit.DialogDisclosure>
      <DemoGuideDialog
        boundaries={mode === 'on'}
        guide={guide}
        offline={offline}
        prefetch={prefetchEnabled}
        slow={slowEnabled}
      />
    </div>
  );
}

function DemoGuideDialog({
  boundaries,
  guide,
  offline,
  prefetch,
  slow,
}: {
  boundaries: boolean;
  guide: Ariakit.DialogStore;
  offline: boolean;
  prefetch: boolean;
  slow: boolean;
}) {
  const rows = [
    {
      Icon: boundaries ? Eye : EyeOff,
      name: 'Client',
      on: boundaries,
      text: 'Outlines the Client Components. Everything else is server-rendered and ships no JS.',
    },
    {
      Icon: prefetch ? Zap : ZapOff,
      name: 'Prefetch',
      on: prefetch,
      text: 'Hovering a row prefetches everything about that thread except the message content. Off, only the shared App Shell is prefetched and the whole thread streams in after the click.',
    },
    {
      Icon: slow ? Timer : TimerOff,
      name: 'Delays',
      on: slow,
      text: 'Adds artificial latency to the thread queries, so you can watch the header arrive from the prefetch and the messages arrive on the navigation.',
    },
    {
      Icon: offline ? WifiOff : Wifi,
      name: offline ? 'Offline' : 'Online',
      on: !offline,
      text: 'Go offline and mailboxes still open to their App Shell, with prefetched headers ready. Recovers when you reconnect.',
    },
  ];

  return (
    <Boundary label="DemoGuide" asChild>
      <Ariakit.Dialog
        store={guide}
        backdrop={
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" style={{ viewTransitionName: 'none' }} />
        }
        className="border-divider dark:border-divider-dark bg-elevated dark:bg-elevated-dark fixed top-1/2 left-1/2 z-50 max-h-[85vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-lg border p-6 shadow-2xl outline-none"
        style={{ viewTransitionName: 'none' }}
        unmountOnHide
      >
        <Ariakit.DialogHeading className="text-xl font-bold">How this demo works</Ariakit.DialogHeading>
        <Ariakit.DialogDescription className="text-muted mt-2 text-sm leading-relaxed">
          Stamp renders a thread in three stages. The mailbox chrome ships in the App Shell, a thread’s header resolves
          in a per-link prefetch, and <code className="font-mono text-xs">await navigation()</code> holds the message
          content back until you actually open it.
        </Ariakit.DialogDescription>
        <div className="mt-6 flex flex-col gap-4">
          {rows.map(({ Icon, name, on, text }) => (
            <div key={name} className="flex gap-3">
              <Icon className={cn('mt-0.5 size-4.5 shrink-0', on ? 'text-accent' : 'text-muted')} />
              <div>
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-muted mt-1 text-sm leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-divider dark:border-divider-dark mt-6 flex items-center justify-between border-t pt-4">
          <a
            className="text-accent text-sm font-medium hover:underline"
            href="https://nextjs.org/docs/app/guides/optimizing-prefetching"
            rel="noreferrer"
            target="_blank"
          >
            Read the guide
          </a>
          <Ariakit.DialogDismiss className="border-divider hover:bg-card dark:border-divider-dark dark:hover:bg-card-dark rounded-full border px-5 py-2 text-sm font-semibold transition-colors">
            Close
          </Ariakit.DialogDismiss>
        </div>
      </Ariakit.Dialog>
    </Boundary>
  );
}
