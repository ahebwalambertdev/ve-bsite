'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface AccordionContextType {
  openItems: string[];
  toggleItem: (value: string) => void;
  isMulti?: boolean;
}

const AccordionContext = React.createContext<AccordionContextType | null>(null);

export function Accordion({
  children,
  className,
  isMulti = false,
  defaultValue = [],
}: {
  children: React.ReactNode;
  className?: string;
  isMulti?: boolean;
  defaultValue?: string[];
}) {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultValue);

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      }
      return isMulti ? [...prev, value] : [value];
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, isMulti }}>
      <div className={cn('divide-y divide-soft-linen border-y border-soft-linen', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('py-2', className)} data-value={value}>
      {children}
    </div>
  );
}

export function AccordionTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used inside Accordion');

  const isOpen = context.openItems.includes(value);

  return (
    <button
      type="button"
      onClick={() => context.toggleItem(value)}
      aria-expanded={isOpen}
      className={cn(
        'flex w-full items-center justify-between py-4 text-left font-sans font-semibold text-lg text-carbon-black transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-olive rounded-sm',
        className
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          'h-5 w-5 shrink-0 text-dusty-olive transition-transform duration-200 ease-out',
          isOpen && 'rotate-180'
        )}
        aria-hidden="true"
      />
    </button>
  );
}

export function AccordionContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used inside Accordion');

  const isOpen = context.openItems.includes(value);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'pb-4 pt-1 text-neutral-600 text-base leading-relaxed animate-in fade-in-0 duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}
