import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  InputPluginItem,
  InputTrigger,
  ActiveTriggerState,
  TriggerInsertResult
} from './types';

interface UseTriggerManagerProps<T extends InputPluginItem = InputPluginItem> {
  /**
   * Array of trigger configurations
   */
  triggers: InputTrigger<T>[];

  /**
   * Current input value
   */
  value: string;

  /**
   * Current cursor/selection position
   */
  cursorPosition: number;

  /**
   * Callback to update the input value
   */
  onChange: (value: string, cursorPosition: number) => void;

  /**
   * Reference to the input element for positioning
   */
  inputRef: React.RefObject<HTMLTextAreaElement | HTMLInputElement | null>;
}

interface UseTriggerManagerResult<T extends InputPluginItem = InputPluginItem> {
  /**
   * Current active trigger state (null if no popup is active)
   */
  activeTrigger: ActiveTriggerState | null;

  /**
   * Items matching the current query
   */
  matchingItems: T[];

  /**
   * Whether items are being loaded
   */
  isLoading: boolean;

  /**
   * Currently highlighted item index
   */
  highlightedIndex: number;

  /**
   * Set the highlighted index
   */
  setHighlightedIndex: (index: number) => void;

  /**
   * Handle keyboard events for navigation
   */
  handleKeyDown: (e: React.KeyboardEvent) => boolean;

  /**
   * Handle input changes to detect triggers
   */
  handleInputChange: (newValue: string, newCursorPosition: number) => void;

  /**
   * Select an item from the popup
   */
  selectItem: (item: T) => void;

  /**
   * Close the popup without selecting
   */
  closePopup: () => void;

  /**
   * Get the current trigger configuration
   */
  currentTriggerConfig: InputTrigger<T> | null;
}

/**
 * Calculate the pixel position of the cursor in a textarea
 */
function getCursorPixelPosition(
  element: HTMLTextAreaElement | HTMLInputElement,
  position: number
): { top: number; left: number } {
  // Create a mirror div to calculate position
  const mirror = document.createElement('div');
  const computed = window.getComputedStyle(element);

  // Copy styles
  mirror.style.cssText = `
    position: absolute;
    visibility: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow: hidden;
    width: ${computed.width};
    font-family: ${computed.fontFamily};
    font-size: ${computed.fontSize};
    font-weight: ${computed.fontWeight};
    line-height: ${computed.lineHeight};
    padding: ${computed.padding};
    border: ${computed.border};
    box-sizing: ${computed.boxSizing};
  `;

  document.body.appendChild(mirror);

  const text = element.value.substring(0, position);
  mirror.textContent = text;

  // Add a span at the cursor position
  const span = document.createElement('span');
  span.textContent = element.value.substring(position) || '.';
  mirror.appendChild(span);

  const rect = element.getBoundingClientRect();
  const mirrorRect = mirror.getBoundingClientRect();

  // Get line height
  const lineHeight =
    parseInt(computed.lineHeight) || parseInt(computed.fontSize) * 1.2;

  // Calculate position based on text content
  const lines = text.split('\n');
  const currentLine = lines.length - 1;
  const top = rect.top + (currentLine + 1) * lineHeight + element.scrollTop;

  // Approximate left position
  const lastLine = lines[lines.length - 1];
  const charWidth = parseInt(computed.fontSize) * 0.6; // Approximate character width
  const left =
    rect.left + parseInt(computed.paddingLeft) + lastLine.length * charWidth;

  document.body.removeChild(mirror);

  return {
    top: Math.min(top, rect.bottom),
    left: Math.min(left, rect.right - 200)
  };
}

/**
 * Find if there's an active trigger at the current cursor position
 */
function findActiveTrigger(
  value: string,
  cursorPosition: number,
  triggers: InputTrigger[]
): { trigger: string; query: string; startPosition: number } | null {
  // Look backwards from cursor to find a trigger
  const textBeforeCursor = value.substring(0, cursorPosition);

  for (const triggerConfig of triggers) {
    const triggerChar = triggerConfig.trigger;

    // Find the last occurrence of this trigger before cursor
    let lastTriggerPos = -1;
    for (let i = textBeforeCursor.length - 1; i >= 0; i--) {
      if (textBeforeCursor[i] === triggerChar) {
        // Check if this is a valid trigger position (start of input or preceded by whitespace)
        if (i === 0 || /\s/.test(textBeforeCursor[i - 1])) {
          lastTriggerPos = i;
          break;
        }
      }
      // Stop if we hit whitespace (trigger must be contiguous)
      if (/\s/.test(textBeforeCursor[i])) {
        break;
      }
    }

    if (lastTriggerPos !== -1) {
      const query = textBeforeCursor.substring(lastTriggerPos + 1);
      // Make sure query doesn't contain whitespace (that would end the trigger)
      if (!/\s/.test(query)) {
        return {
          trigger: triggerChar,
          query,
          startPosition: lastTriggerPos
        };
      }
    }
  }

  return null;
}

/**
 * Filter items based on query
 */
function filterItems<T extends InputPluginItem>(
  items: T[],
  query: string,
  maxResults: number = 10
): T[] {
  if (!query) {
    return items.slice(0, maxResults);
  }

  const lowerQuery = query.toLowerCase();
  return items
    .filter(
      item =>
        item.label.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    )
    .slice(0, maxResults);
}

export function useTriggerManager<T extends InputPluginItem = InputPluginItem>({
  triggers,
  value,
  cursorPosition,
  onChange,
  inputRef
}: UseTriggerManagerProps<T>): UseTriggerManagerResult<T> {
  const [activeTrigger, setActiveTrigger] = useState<ActiveTriggerState | null>(
    null
  );
  const [matchingItems, setMatchingItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get the current trigger configuration
  const currentTriggerConfig = useMemo(() => {
    if (!activeTrigger) return null;
    return (
      (triggers.find(
        t => t.trigger === activeTrigger.trigger
      ) as InputTrigger<T>) || null
    );
  }, [activeTrigger, triggers]);

  // Update matching items when trigger or query changes
  useEffect(() => {
    if (!activeTrigger || !currentTriggerConfig) {
      setMatchingItems([]);
      return;
    }

    const { query } = activeTrigger;
    const {
      items,
      onSearch,
      minQueryLength = 0,
      maxResults = 10
    } = currentTriggerConfig;

    // Check minimum query length
    if (query.length < minQueryLength) {
      setMatchingItems((items?.slice(0, maxResults) as T[]) || []);
      return;
    }

    // If there's a search function, use it
    if (onSearch) {
      setIsLoading(true);

      // Debounce the search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await onSearch(query);
          setMatchingItems(results.slice(0, maxResults) as T[]);
        } catch (error) {
          console.error('Error searching trigger items:', error);
          setMatchingItems([]);
        } finally {
          setIsLoading(false);
        }
      }, 150);
    } else {
      // Filter locally
      setMatchingItems(filterItems((items as T[]) || [], query, maxResults));
    }

    // Reset highlighted index when items change
    setHighlightedIndex(0);
  }, [activeTrigger, currentTriggerConfig]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback(
    (newValue: string, newCursorPosition: number) => {
      // Check for active trigger
      const trigger = findActiveTrigger(newValue, newCursorPosition, triggers);

      if (trigger && inputRef.current) {
        const position = getCursorPixelPosition(
          inputRef.current,
          trigger.startPosition
        );
        setActiveTrigger({
          trigger: trigger.trigger,
          query: trigger.query,
          startPosition: trigger.startPosition,
          cursorPosition: position
        });
      } else {
        setActiveTrigger(null);
      }
    },
    [triggers, inputRef]
  );

  const closePopup = useCallback(() => {
    setActiveTrigger(null);
    setMatchingItems([]);
    setHighlightedIndex(0);
  }, []);

  const selectItem = useCallback(
    (item: T) => {
      if (!activeTrigger || !currentTriggerConfig) return;

      const { startPosition } = activeTrigger;

      // Determine what text to insert
      let insertText = '';

      // Call the onSelect callback if provided
      if (currentTriggerConfig.onSelect) {
        currentTriggerConfig.onSelect(item, (text: string) => {
          insertText = text;
        });
      }

      // If no custom insert text, use default formatting
      if (!insertText) {
        if ('value' in item && item.value) {
          insertText = item.value as string;
        } else {
          insertText = `${activeTrigger.trigger}${item.label}`;
        }
      }

      // Calculate new value
      const beforeTrigger = value.substring(0, startPosition);
      const afterCursor = value.substring(cursorPosition);
      const newValue = beforeTrigger + insertText + ' ' + afterCursor;
      const newCursorPosition = startPosition + insertText.length + 1;

      onChange(newValue, newCursorPosition);
      closePopup();
    },
    [
      activeTrigger,
      currentTriggerConfig,
      value,
      cursorPosition,
      onChange,
      closePopup
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): boolean => {
      if (!activeTrigger || matchingItems.length === 0) {
        return false;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => (prev + 1) % matchingItems.length);
          return true;

        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(
            prev => (prev - 1 + matchingItems.length) % matchingItems.length
          );
          return true;

        case 'Enter':
        case 'Tab':
          e.preventDefault();
          if (matchingItems[highlightedIndex]) {
            selectItem(matchingItems[highlightedIndex]);
          }
          return true;

        case 'Escape':
          e.preventDefault();
          closePopup();
          return true;

        default:
          return false;
      }
    },
    [activeTrigger, matchingItems, highlightedIndex, selectItem, closePopup]
  );

  return {
    activeTrigger,
    matchingItems,
    isLoading,
    highlightedIndex,
    setHighlightedIndex,
    handleKeyDown,
    handleInputChange,
    selectItem,
    closePopup,
    currentTriggerConfig
  };
}
