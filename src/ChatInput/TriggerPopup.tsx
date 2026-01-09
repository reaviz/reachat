import { ReactNode, RefObject, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, ConnectedOverlay, List, ListItem } from 'reablocks';
import { offset } from '@floating-ui/react';
import { ChatContext } from '@/ChatContext';
import { chatTheme, ChatTheme } from '@/theme';
import { InputPluginItem } from './types';
import SpinnerIcon from '@/assets/spinner.svg?react';

export interface TriggerPopupProps<
  T extends InputPluginItem = InputPluginItem
> {
  isOpen: boolean;
  query: string;
  items: T[];
  highlightedIndex: number;
  position: { top: number; left: number };
  onSelect: (item: T) => void;
  onHighlightChange: (index: number) => void;
  onClose: () => void;
  renderItem?: (item: T, isHighlighted: boolean) => ReactNode;
  renderHeader?: () => ReactNode;
  renderEmpty?: (query: string) => ReactNode;
  isLoading?: boolean;
}

/**
 * Default item renderer for trigger popup items
 */
function DefaultItemRenderer<T extends InputPluginItem>({
  item,
  isHighlighted,
  popupTheme
}: {
  item: T;
  isHighlighted: boolean;
  popupTheme: ChatTheme['input']['popup'];
}) {
  // Check if item has shortcut (for slash commands)
  const shortcut =
    'shortcut' in item ? (item as { shortcut?: string }).shortcut : undefined;

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

interface TriggerPopupInternalProps<
  T extends InputPluginItem
> extends TriggerPopupProps<T> {
  /**
   * Reference element for positioning the popup
   */
  referenceRef: RefObject<HTMLElement | null>;
}

/**
 * TriggerPopup component displays a popup menu for mentions, commands, etc.
 * Uses reablocks ConnectedOverlay for positioning.
 */
export function TriggerPopup<T extends InputPluginItem = InputPluginItem>({
  isOpen,
  query,
  items,
  highlightedIndex,
  position,
  onSelect,
  onHighlightChange,
  onClose,
  renderItem,
  renderHeader,
  renderEmpty,
  isLoading = false,
  referenceRef
}: TriggerPopupInternalProps<T>) {
  const { theme } = useContext(ChatContext);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Get popup theme from context or use defaults
  const popupTheme = theme?.input?.popup || chatTheme.input.popup;

  // Scroll highlighted item into view
  useEffect(() => {
    if (itemsRef.current[highlightedIndex]) {
      itemsRef.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [highlightedIndex]);

  const popupContent = (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className={cn(popupTheme.base)}
    >
      {/* Header */}
      {renderHeader && (
        <div className={cn(popupTheme.header)}>{renderHeader()}</div>
      )}

      {/* Content */}
      <div className={cn(popupTheme.content)}>
        {isLoading ? (
          <div className={cn(popupTheme.loading)}>
            <SpinnerIcon className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </div>
        ) : items.length === 0 ? (
          <div className={cn(popupTheme.empty)}>
            {renderEmpty
              ? renderEmpty(query)
              : query
                ? `No results for "${query}"`
                : 'No items available'}
          </div>
        ) : (
          <List>
            {items.map((item, index) => (
              <div
                key={item.id}
                ref={el => {
                  itemsRef.current[index] = el;
                }}
                onClick={() => onSelect(item)}
                onMouseEnter={() => onHighlightChange(index)}
              >
                {renderItem ? (
                  renderItem(item, index === highlightedIndex)
                ) : (
                  <DefaultItemRenderer
                    item={item}
                    isHighlighted={index === highlightedIndex}
                    popupTheme={popupTheme}
                  />
                )}
              </div>
            ))}
          </List>
        )}
      </div>
    </motion.div>
  );

  return (
    <ConnectedOverlay
      open={isOpen}
      reference={referenceRef.current}
      placement="top-start"
      modifiers={[offset({ mainAxis: 8, crossAxis: position.left })]}
      onClose={onClose}
      content={() => (
        <AnimatePresence>{isOpen && popupContent}</AnimatePresence>
      )}
    />
  );
}

export default TriggerPopup;
