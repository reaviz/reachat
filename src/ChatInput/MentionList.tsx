import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  useContext,
  useRef
} from 'react';
import { cn, List, ListItem } from 'reablocks';
import { motion } from 'motion/react';
import { ChatContext } from '@/ChatContext';
import { chatTheme } from '@/theme';
import { SuggestionConfig, SuggestionItem } from './types';

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export interface MentionListProps {
  /**
   * List of suggestion items to display
   */
  items: SuggestionItem[];

  /**
   * Callback to execute the selected suggestion command
   */
  command: (item: { id: string; label: string }) => void;

  /**
   * The trigger character (e.g., '@' or '/')
   */
  triggerChar: string;

  /**
   * Configuration for the suggestion popup
   */
  config: SuggestionConfig;

  /**
   * Current search query text
   */
  query?: string;
}

export const MentionList = forwardRef<MentionListRef, MentionListProps>(
  ({ items, command, triggerChar, config, query }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { theme } = useContext(ChatContext);
    const popupTheme = theme?.input?.popup || chatTheme.input.popup;

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

    return (
      <List
        className={cn(popupTheme.base, popupTheme.content)}
        style={{ zIndex: 9999 }}
        role="listbox"
        id={popupId}
        aria-label={`${triggerChar === '@' ? 'Mentions' : 'Commands'} suggestions`}
      >
        {items.length === 0 ? (
          <ListItem className={cn(popupTheme.empty)} disabled dense>
            {config.renderEmpty
              ? config.renderEmpty(query || '')
              : query
                ? `No results for "${query}"`
                : 'No items available'}
          </ListItem>
        ) : (
          items.map((item, index) => (
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
          ))
        )}
      </List>
    );
  }
);

interface DefaultItemRendererProps {
  /**
   * The suggestion item to render
   */
  item: SuggestionItem;

  /**
   * Whether this item is currently highlighted/selected
   */
  isHighlighted: boolean;

  /**
   * Theme styles for the popup
   */
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
