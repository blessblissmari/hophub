import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useTheme } from '@/components/theme-provider';

export function Toaster(props: ToasterProps) {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={resolvedTheme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast glass-strong group-[.toaster]:!text-(--color-foreground) !rounded-2xl !border-(--color-border)',
          description: 'group-[.toast]:text-(--color-muted-foreground)',
          actionButton:
            'group-[.toast]:!bg-(--color-primary) group-[.toast]:!text-(--color-primary-foreground)',
          cancelButton:
            'group-[.toast]:!bg-(--color-secondary) group-[.toast]:!text-(--color-secondary-foreground)',
        },
      }}
      {...props}
    />
  );
}
