import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-gradient-to-r from-white/10 via-white/30 to-white/10 dark:from-white/5 dark:via-white/15 dark:to-white/5',
        className
      )}
      {...props}
    />
  );
}
