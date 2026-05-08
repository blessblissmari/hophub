import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: number;
  onChange?: (n: number) => void;
  size?: number;
  readOnly?: boolean;
  className?: string;
}

export function RatingStars({ value, onChange, size = 20, readOnly = false, className }: Props) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = value >= n - 0.25;
        return (
          <button
            type="button"
            key={n}
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(n === value ? 0 : n)}
            className={cn(
              'rounded-full p-0.5 transition-transform',
              !readOnly && 'hover:scale-110 active:scale-95'
            )}
            aria-label={`Оценка ${n}`}
          >
            <Star
              size={size}
              className={cn(
                'transition-colors',
                filled ? 'fill-amber-400 text-amber-400' : 'text-(--color-muted-foreground)/50'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
