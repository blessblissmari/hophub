import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-(--color-primary)/15 text-(--color-primary) border border-(--color-primary)/30',
        secondary: 'bg-(--color-secondary) text-(--color-secondary-foreground) border border-(--color-border)',
        outline: 'border border-(--color-border) text-(--color-foreground)',
        glass: 'glass-pill px-3 text-(--color-foreground)',
        amber: 'bg-amber-300/30 text-amber-700 border border-amber-300/60 dark:text-amber-300',
        destructive: 'bg-red-500/15 text-red-600 border border-red-500/30 dark:text-red-300',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
