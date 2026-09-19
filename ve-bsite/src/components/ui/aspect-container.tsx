import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AspectContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: '4/5' | 'square' | 'video' | '3/4' | '16/9';
}

export function AspectContainer({
  className,
  ratio = '4/5',
  children,
  ...props
}: AspectContainerProps) {
  const ratios = {
    '4/5': 'aspect-[4/5]',
    square: 'aspect-square',
    video: 'aspect-video',
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-[16/9]',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-soft-linen/40 w-full',
        ratios[ratio],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
