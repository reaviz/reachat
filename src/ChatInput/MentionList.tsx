import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  useContext,
  useRef,
  useLayoutEffect,
  useMemo
} from 'react';
import { createPortal } from 'react-dom';
import { cn, List, ListItem } from 'reablocks';
import { motion, AnimatePresence } from 'motion/react';
import { ChatContext } from '@/ChatContext';
import { chatTheme } from '@/theme';
import { SuggestionConfig, SuggestionItem } from './types';

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export interface MentionListProps {
  items: SuggestionItem[];
  command: (item: { id: string; label: string }) => void;
  clientRect: (() => DOMRect | null) | null;
  triggerChar: string;
  config: SuggestionConfig;
  query?: string;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command, clientRect, triggerChar, config, query }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [position, setPosition] = useState<{
      top: number;
      left: number;
    } | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const floatingRef = useRef<HTMLDivElement>(null);
    const { theme } = useContext(ChatContext);
    const popupTheme = theme?.input?.popup || chatTheme.input.popup;

    // Calculate position from clientRect
    const updatePosition = useCallback(() => {
      if (!clientRect) return;
      const rect = clientRect();
      if (!rect) return;

      const floatingEl = floatingRef.current;
      const floatingHeight = floatingEl?.offsetHeight || 200;

      // Position above the cursor
      let top = rect.top - floatingHeight - 8;
      let left = rect.left;

      // If would go off top of screen, position below
      if (top < 8) {
        top = rect.bottom + 8;
      }

      // Keep within viewport horizontally
      if (floatingEl) {
        const floatingWidth = floatingEl.offsetWidth;
        if (left + floatingWidth > window.innerWidth - 8) {
          left = window.innerWidth - floatingWidth - 8;
        }
      }

      setPosition({ top, left: Math.max(8, left) });
    }, [clientRect]);

    // Update position on mount and when clientRect changes
    useLayoutEffect(() => {
      // Small delay to ensure the floating element is rendered
      const timeoutId = setTimeout(() => {
        updatePosition();
      }, 0);
      return () => clearTimeout(timeoutId);
    }, [clientRect, items.length]);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useEffect(() => {
      if (itemRefs.current[selectedIndex]) {
        itemRefs.current[selectedIndex]?.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }, [selectedIndex]);

    const selectItem = useCallback(
      (index: number) => {
        const item = items[index];
        if (!item) return;

        if (config.onSelect) {
          config.onSelect(item, (text: string) => {
            command({ id: item.id, label: text || item.label });
          });
        } else {
          command({ id: item.id, label: item.label });
        }
      },
      [items, command, config]
    );

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setSelectedIndex(prev => (prev <= 0 ? items.length - 1 : prev - 1));
          return true;
        }

        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSelectedIndex(prev => (prev >= items.length - 1 ? 0 : prev + 1));
          return true;
        }

        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault();
          selectItem(selectedIndex);
          return true;
        }

        return false;
      }
    }));

    const popupId = `mention-list-${triggerChar}`;

    const floatingStyles = position
      ? {
          position: 'fixed' as const,
          top: position.top,
          left: position.left,
          zIndex: 9999
        }
      : {
          position: 'fixed' as const,
          top: 0,
          left: 0,
          visibility: 'hidden' as const,
          zIndex: 9999
        };

    const content = (
      <AnimatePresence>
        <motion.div
          ref={floatingRef}
          style={floatingStyles}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className={cn(popupTheme.base, 'z-50')}
          role="listbox"
          id={popupId}
          aria-label={`${triggerChar === '@' ? 'Mentions' : 'Commands'} suggestions`}
        >
          {config.renderHeader && (
            <div className={cn(popupTheme.header)}>{config.renderHeader()}</div>
          )}

          <div className={cn(popupTheme.content)}>
            {items.length === 0 ? (
              <div className={cn(popupTheme.empty)}>
                {config.renderEmpty
                  ? config.renderEmpty(query || '')
                  : query
                    ? `No results for "${query}"`
                    : 'No items available'}
              </div>
            ) : (
              <List>
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    id={`${popupId}-option-${item.id}`}
                    role="option"
                    aria-selected={index === selectedIndex}
                    ref={el => {
                      itemRefs.current[index] = el;
                    }}
                    onClick={() => selectItem(index)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className="cursor-pointer"
                  >
                    {config.renderItem ? (
                      config.renderItem(item, index === selectedIndex)
                    ) : (
                      <DefaultItemRenderer
                        item={item}
                        isHighlighted={index === selectedIndex}
                        popupTheme={popupTheme}
                      />
                    )}
                  </div>
                ))}
              </List>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );

    return createPortal(content, document.body);
  }
);

interface DefaultItemRendererProps {
  item: SuggestionItem;
  isHighlighted: boolean;
  popupTheme: typeof chatTheme.input.popup;
}

function DefaultItemRenderer({
  item,
  isHighlighted,
  popupTheme
}: DefaultItemRendererProps) {
  const shortcut = 'shortcut' in item ? (item as any).shortcut : undefined;

  return (
    <ListItem
      className={cn(
        popupTheme.item,
        isHighlighted && popupTheme.itemHighlighted
      )}
      dense
      start={
        item.icon ? (
          <span className={cn(popupTheme.itemIcon)}>{item.icon}</span>
        ) : undefined
      }
      end={
        shortcut ? (
          <span className={cn(popupTheme.itemShortcut)}>{shortcut}</span>
        ) : undefined
      }
    >
      <div className={cn(popupTheme.itemContent)}>
        <span className={cn(popupTheme.itemLabel)}>{item.label}</span>
        {item.description && (
          <span className={cn(popupTheme.itemDescription)}>
            {item.description}
          </span>
        )}
      </div>
    </ListItem>
  );
}
