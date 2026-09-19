'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-carbon-black/60 backdrop-blur-sm transition-opacity duration-200 animate-in fade-in"
      />

      {/* Modal Container: Starts from scale(0.95) with opacity:0 per Emil Kowalski rules */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg rounded-xl bg-snow p-6 shadow-elevated border border-soft-linen transform transition-all duration-200 animate-in fade-in-0 zoom-in-95',
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-soft-linen">
          {title && <h3 className="font-sans font-bold text-lg text-carbon-black">{title}</h3>}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-sm p-1.5 text-neutral-500 hover:text-carbon-black hover:bg-soft-linen/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dusty-olive"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
