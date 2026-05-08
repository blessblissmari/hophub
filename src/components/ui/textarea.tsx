import * as React from 'react';
import { cn } from '@/lib/utils';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-24 w-full rounded-2xl border border-(--color-border) bg-(--color-input) px-4 py-3 text-sm transition-colors',
        'placeholder:text-(--color-muted-foreground) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring)',
        'backdrop-blur-md resize-y',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';
