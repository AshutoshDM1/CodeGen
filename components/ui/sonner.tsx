'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="bottom-right"
      expand={true}
      richColors
      toastOptions={{
        classNames: {
          toast: `
            group toast group-[.toaster]:bg-background 
            group-[.toaster]:text-foreground 
            group-[.toaster]:border-border 
            group-[.toaster]:shadow-lg
            group-[.toaster]:rounded-lg
            group-[.toaster]:p-4
            group-[.toaster]:min-h-[60px]
            group-[.toaster]:flex
            group-[.toaster]:items-center
            group-[.toaster]:gap-2
            group-[.toaster]:transition-all
            group-[.toaster]:duration-300
            group-[.toaster]:ease-in-out
            group-[.toaster]:animate-in
            group-[.toaster]:fade-in
            group-[.toaster]:slide-in-from-top-4
            group-[.toaster]:data-[state=open]:animate-in
            group-[.toaster]:data-[state=closed]:animate-out
            group-[.toaster]:data-[state=closed]:fade-out
            group-[.toaster]:data-[state=closed]:slide-out-to-top-4
          `,
          title: `
            group-[.toast]:text-base
            group-[.toast]:font-semibold
            group-[.toast]:leading-none
            group-[.toast]:tracking-tight
          `,
          description: `
            group-[.toast]:text-sm
            group-[.toast]:text-muted-foreground
            group-[.toast]:leading-normal
            group-[.toast]:mt-1
          `,
          actionButton: `
            group-[.toast]:bg-primary
            group-[.toast]:text-primary-foreground
            group-[.toast]:hover:bg-primary/90
            group-[.toast]:px-3
            group-[.toast]:py-1
            group-[.toast]:rounded-md
            group-[.toast]:text-sm
            group-[.toast]:font-medium
            group-[.toast]:transition-colors
          `,
          cancelButton: `
            group-[.toast]:bg-muted
            group-[.toast]:text-muted-foreground
            group-[.toast]:hover:bg-muted/80
            group-[.toast]:px-3
            group-[.toast]:py-1
            group-[.toast]:rounded-md
            group-[.toast]:text-sm
            group-[.toast]:font-medium
            group-[.toast]:transition-colors
          `,
          success: `
            group-[.toaster]:bg-emerald-500/10
            group-[.toaster]:text-emerald-500
            group-[.toaster]:border-emerald-500/20
          `,
          error: `
            group-[.toaster]:bg-destructive/10
            group-[.toaster]:text-destructive
            group-[.toaster]:border-destructive/20
          `,
          warning: `
            group-[.toaster]:bg-yellow-500/10
            group-[.toaster]:text-yellow-500
            group-[.toaster]:border-yellow-500/20
          `,
          info: `
            group-[.toaster]:bg-blue-500/10
            group-[.toaster]:text-blue-500
            group-[.toaster]:border-blue-500/20
          `,
          loading: `
            group-[.toaster]:bg-muted/70
            group-[.toaster]:text-muted-foreground
            group-[.toaster]:border-muted/90
          `,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
