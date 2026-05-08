import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-ring) disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.97] select-none",
  {
    variants: {
      variant: {
        default:
          'bg-(--color-primary) text-(--color-primary-foreground) shadow-[0_8px_24px_-8px_rgba(214,138,20,0.6)] hover:brightness-[1.05]',
        glass:
          'glass-pill text-(--color-foreground) hover:bg-white/55 dark:hover:bg-white/15',
        outline:
          'border border-(--color-border) bg-(--color-input) text-(--color-foreground) hover:bg-(--color-secondary)',
        ghost:
          'text-(--color-foreground) hover:bg-(--color-secondary)',
        destructive:
          'bg-(--color-destructive) text-(--color-destructive-foreground) hover:brightness-110',
        secondary:
          'bg-(--color-secondary) text-(--color-secondary-foreground) hover:brightness-105',
        link: 'text-(--color-primary) underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
        pill: 'h-9 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
