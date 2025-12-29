import { FC, useContext, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, ConnectedOverlay, List, ListItem } from 'reablocks';
import { offset } from '@floating-ui/react';
import { ChatContext } from '@/ChatContext';
import { InputPluginItem, TriggerPopupProps } from './types';
import SpinnerIcon from '@/assets/spinner.svg?react';

/**
 * Default theme for the popup when not provided by context
 */
const defaultPopupTheme = {
  base: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden min-w-[200px] max-w-[300px]',
  header:
    'px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700',
  content: 'overflow-y-auto max-h-[250px]',
  item: 'flex items-center gap-2 cursor-pointer transition-colors',
  itemHighlighted: 'bg-gray-100 dark:bg-gray-800',
  itemIcon:
    'flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400 [&>svg]:w-full [&>svg]:h-full',
  itemContent: 'flex flex-col min-w-0 flex-1',
  itemLabel: 'text-sm font-medium text-gray-900 dark:text-gray-100 truncate',
  itemDescription: 'text-xs text-gray-500 dark:text-gray-400 truncate',
  itemShortcut: 'text-xs text-gray-400 dark:text-gray-500 ml-auto',
  empty: 'px-3 py-4 text-sm text-center text-gray-500 dark:text-gray-400',
  loading:
    'flex items-center justify-center gap-2 px-3 py-4 text-gray-500 dark:text-gray-400'
};

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
  popupTheme: typeof defaultPopupTheme;
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
  referenceRef: React.RefObject<HTMLElement | null>;
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
  const popupTheme = theme?.input?.popup || defaultPopupTheme;

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
