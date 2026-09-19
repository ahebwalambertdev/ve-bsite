import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'olive' | 'neutral' | 'dark' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-sans font-semibold tracking-wide uppercase rounded-full select-none';

  const variants = {
    default: 'bg-soft-linen text-carbon-black border border-soft-linen',
    neutral: 'bg-soft-linen text-carbon-black border border-soft-linen',
    accent: 'bg-dusty-olive/15 text-dusty-olive-dark border border-dusty-olive/30',
    olive: 'bg-dusty-olive/15 text-dusty-olive-dark border border-dusty-olive/30',
    dark: 'bg-carbon-black text-snow',
    outline: 'bg-transparent text-carbon-black border border-soft-linen',
  };

  const sizes = {
    sm: 'text-[10px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
