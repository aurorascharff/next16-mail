import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { ComposeButton } from '@/features/thread/components/compose-button';
import { LabelThreadList, ThreadListSkeleton } from '@/features/thread/components/thread-list';
import { parsePage } from '@/features/thread/thread-mailboxes';

export default function LabelPage({ params, searchParams }: PageProps<'/label/[labelId]'>) {
  const query = Promise.all([params, searchParams]).then(([{ labelId }, values]) => ({
    labelId,
    page: parsePage(values.page),
  }));

  return (
    <>
      <div className="flex h-full flex-col" data-thread-list>
        <AnimatedSuspense fallback={<ThreadListSkeleton count={4} />}>
          {query.then(props => (
            <LabelThreadList {...props} />
          ))}
        </AnimatedSuspense>
      </div>
      <ComposeButton variant="fab" />
    </>
  );
}
