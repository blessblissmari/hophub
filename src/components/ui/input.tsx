import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full rounded-2xl border border-(--color-border) bg-(--color-input) px-4 py-2 text-sm transition-colors',
        'placeholder:text-(--color-muted-foreground) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring)',
        'backdrop-blur-md',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';
