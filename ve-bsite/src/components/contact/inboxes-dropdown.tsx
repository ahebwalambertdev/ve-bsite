'use client';

import * as React from 'react';
import { Mail, ChevronDown, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CopyEmailButton } from '@/components/ui/copy-email-button';
import { ContactInboxItem } from '@/lib/cms/types';

interface InboxesDropdownProps {
  title?: string;
  inboxes: ContactInboxItem[];
}

export function InboxesDropdown({
  title = 'Official Email Inboxes',
  inboxes = [],
}: InboxesDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string>(
    inboxes[0]?.id || 'help'
  );
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedInbox =
    inboxes.find((item) => item.id === selectedId) || inboxes[0];

  // Close mobile dropdown on click outside or Escape
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!inboxes || inboxes.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* ============================================================
          1. DESKTOP VIEW (Visible md and up): Full Grid Directory
         ============================================================ */}
      <div className="hidden md:block space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-carbon-black">
          <div className="w-6 h-6 rounded-lg bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <span>{title}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-soft-linen/60 text-dusty-olive-dark font-medium">
            {inboxes.length} Departments
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
          {inboxes.map((inbox) => (
            <div
              key={inbox.id}
              className="p-3.5 bg-soft-linen/25 border border-soft-linen/50 rounded-xl space-y-1.5 hover:bg-soft-linen/35 transition-colors"
            >
              <div className="font-semibold text-carbon-black flex items-center justify-between">
                <span>{inbox.label}</span>
              </div>
              <CopyEmailButton
                email={inbox.email}
                showEmailText
                variant="pill"
                className="text-dusty-olive-dark text-xs"
              />
              {inbox.description && (
                <div className="text-[10px] text-neutral-500">
                  {inbox.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          2. MOBILE VIEW (Visible < md only): Interactive Dropdown
         ============================================================ */}
      <div className="block md:hidden space-y-3" ref={dropdownRef}>
        <div className="flex items-center gap-2 text-sm font-semibold text-carbon-black">
          <div className="w-6 h-6 rounded-lg bg-soft-linen/50 flex items-center justify-center text-dusty-olive">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <span>{title}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-soft-linen/60 text-dusty-olive-dark font-medium">
            {inboxes.length} Departments
          </span>
        </div>

        {/* Mobile Dropdown Selector Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className="w-full flex items-center justify-between p-3 bg-snow hover:bg-soft-linen/30 border border-soft-linen rounded-xl transition-all duration-180 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-dusty-olive shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-soft-linen/60 flex items-center justify-center text-dusty-olive shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-carbon-black truncate">
                  {selectedInbox.label}
                </div>
                <div className="text-[11px] font-mono text-dusty-olive-dark truncate">
                  {selectedInbox.email}
                </div>
              </div>
            </div>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.18 }}
              className="text-neutral-500 shrink-0 ml-2"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          {/* Mobile Dropdown Menu Popover */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{ backgroundColor: '#ffffff' }}
                role="listbox"
                className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white border border-[#E2DDD5] rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.16)] p-1.5 space-y-1 max-h-72 overflow-y-auto"
              >
                {inboxes.map((inbox) => {
                  const isSelected = inbox.id === selectedId;
                  return (
                    <button
                      key={inbox.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedId(inbox.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-start justify-between p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-soft-linen/60 font-semibold'
                          : 'hover:bg-soft-linen/30'
                      }`}
                    >
                      <div className="min-w-0 space-y-0.5">
                        <div className="text-xs font-medium text-carbon-black flex items-center gap-1.5">
                          <span className="truncate">{inbox.label}</span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-dusty-olive shrink-0 inline" />
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-neutral-500 truncate">
                          {inbox.email}
                        </div>
                        {inbox.description && (
                          <div className="text-[10px] text-neutral-400 line-clamp-1">
                            {inbox.description}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Active Inbox Details & Actions Card */}
        <div className="p-3.5 bg-soft-linen/25 border border-soft-linen/60 rounded-xl space-y-2.5">
          <div>
            <div className="text-xs font-semibold text-carbon-black">
              {selectedInbox.label}
            </div>
            {selectedInbox.description && (
              <div className="text-[11px] text-neutral-600 mt-0.5">
                {selectedInbox.description}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-soft-linen/60">
            <CopyEmailButton
              email={selectedInbox.email}
              showEmailText
              variant="pill"
              className="text-dusty-olive-dark text-xs"
            />
            <a
              href={`mailto:${selectedInbox.email}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-carbon-black text-snow hover:bg-neutral-800 transition-colors"
            >
              <span>Compose</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
