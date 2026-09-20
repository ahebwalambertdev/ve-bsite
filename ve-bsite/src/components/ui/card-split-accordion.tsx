'use client';

import React, { useState, type FC, type ReactNode } from 'react';
import { motion, MotionConfig, type Transition } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import useMeasure from 'react-use-measure';

export interface CardSplitAccordionItemData {
  id: number | string;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface AccordionItemProps {
  item: CardSplitAccordionItemData;
  setOpenId: (id: number | string | null) => void;
  index: number;
  total: number;
  openIndex: number;
}

interface CardSplitAccordionProps {
  items: CardSplitAccordionItemData[];
  defaultOpenId?: number | string | null;
  className?: string;
}

const springTransition: Transition = {
  type: 'spring',
  stiffness: 550,
  damping: 45,
  mass: 0.9,
};

const AccordionItem: FC<AccordionItemProps> = ({
  item,
  setOpenId,
  index,
  total,
  openIndex,
}) => {
  const [ref, bounds] = useMeasure();
  const isOpen = index === openIndex;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  const isBeforeOpen = index === openIndex - 1;
  const isAfterOpen = index === openIndex + 1;

  const isAlone = (isAfterOpen && isLast) || (isBeforeOpen && isFirst);

  const BORDER_WIDTH = '1px';
  const BORDER_STYLE = 'solid';
  const borderTopWidth =
    isFirst || isAfterOpen || isOpen ? BORDER_WIDTH : '0px';
  const borderBottomWidth =
    isLast || isBeforeOpen || isOpen ? BORDER_WIDTH : '0px';
  const borderLeftWidth = BORDER_WIDTH;
  const borderRightWidth = BORDER_WIDTH;

  let borderTopLeftRadius = 0;
  let borderTopRightRadius = 0;
  let borderBottomLeftRadius = 0;
  let borderBottomRightRadius = 0;

  const RADIUS = 16;

  if (isOpen || isAlone) {
    borderTopLeftRadius = RADIUS;
    borderTopRightRadius = RADIUS;
    borderBottomLeftRadius = RADIUS;
    borderBottomRightRadius = RADIUS;
  } else if (isBeforeOpen) {
    borderBottomLeftRadius = RADIUS;
    borderBottomRightRadius = RADIUS;
  } else if (isAfterOpen) {
    borderTopLeftRadius = RADIUS;
    borderTopRightRadius = RADIUS;
  } else if (isFirst) {
    borderTopLeftRadius = RADIUS;
    borderTopRightRadius = RADIUS;
  } else if (isLast) {
    borderBottomLeftRadius = RADIUS;
    borderBottomRightRadius = RADIUS;
  }

  return (
    <MotionConfig transition={springTransition}>
      <motion.li layout id={String(item.id)} className="list-none scroll-mt-28">
        <motion.div
          animate={{
            borderTopLeftRadius,
            borderTopRightRadius,
            borderBottomLeftRadius,
            borderBottomRightRadius,
            backgroundColor: isOpen ? '#FFFAF6' : '#FAF6F1',
            boxShadow: isOpen
              ? '0 4px 20px -2px rgba(26, 26, 26, 0.08)'
              : '0 0 0 0 rgba(0, 0, 0, 0)',
          }}
          className="overflow-hidden border-solid will-change-transform"
          style={{
            borderTopWidth,
            borderBottomWidth,
            borderLeftWidth,
            borderRightWidth,
            borderStyle: BORDER_STYLE,
            borderColor: isOpen ? 'rgba(124, 139, 116, 0.45)' : 'rgba(235, 226, 215, 0.9)',
            transition: 'border-color 0.3s ease',
            marginBlock: isOpen ? '12px' : '0px',
          }}
        >
          <button
            type="button"
            onClick={() => setOpenId(isOpen ? null : item.id)}
            className="flex w-full cursor-pointer items-center justify-between p-4 sm:p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dusty-olive/50 select-none"
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-3.5 pr-4">
              {item.icon ? (
                <div className="flex-shrink-0 text-dusty-olive">
                  {item.icon}
                </div>
              ) : (
                <div className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              )}

              <span className="font-serif text-base sm:text-lg font-medium text-carbon-black tracking-tight leading-snug">
                {item.title}
              </span>
            </div>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={springTransition}
              className="flex-shrink-0 text-neutral-400"
            >
              <ChevronDown className="w-5 h-5 text-dusty-olive" />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: isOpen ? bounds.height : 0,
              opacity: isOpen ? 1 : 0,
            }}
            transition={springTransition}
            className="overflow-hidden will-change-transform"
          >
            <div ref={ref}>
              <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-neutral-600 font-sans leading-relaxed border-t border-soft-linen/50 pt-3 mt-1">
                {item.content}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.li>
    </MotionConfig>
  );
};

export const CardSplitAccordion: FC<CardSplitAccordionProps> = ({
  items,
  defaultOpenId = null,
  className = '',
}) => {
  const [openId, setOpenId] = useState<number | string | null>(defaultOpenId);

  React.useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = window.location.hash.replace('#', '');
        const matched = items.find((item) => String(item.id) === hash);
        if (matched) {
          setOpenId(matched.id);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [items]);

  const openIndex = items.findIndex((item) => item.id === openId);

  return (
    <div className={`w-full ${className}`}>
      <ul className="w-full space-y-0 p-0 m-0">
        {items.map((item, index) => (
          <AccordionItem
            key={item.id}
            item={item}
            setOpenId={setOpenId}
            index={index}
            total={items.length}
            openIndex={openIndex}
          />
        ))}
      </ul>
    </div>
  );
};
