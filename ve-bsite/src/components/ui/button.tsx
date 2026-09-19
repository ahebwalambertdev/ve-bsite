import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-semibold select-none transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-olive focus-visible:ring-offset-2 focus-visible:ring-offset-snow disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary:
        'bg-carbon-black text-snow shadow-subtle hover:bg-neutral-800 active:bg-black',
      accent:
        'bg-dusty-olive text-snow shadow-subtle hover:bg-[#6e7d66] active:bg-[#62705b]',
      secondary:
        'bg-soft-linen text-carbon-black border border-soft-linen hover:bg-soft-linen/80 active:bg-soft-linen/60',
      outline:
        'border border-soft-linen bg-snow text-carbon-black hover:bg-soft-linen/40 active:bg-soft-linen/70',
      ghost:
        'bg-transparent text-carbon-black hover:bg-soft-linen/30 active:bg-soft-linen/60',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'h-9 px-4 text-xs sm:text-sm rounded-md gap-2',
      lg: 'h-11 sm:h-12 px-6 text-sm sm:text-base rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
