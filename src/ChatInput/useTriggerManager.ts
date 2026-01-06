import {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
  RefObject
} from 'react';
import {
  InputPluginItem,
  InputTrigger,
  ActiveTriggerState,
  TriggerInsertResult,
  TextareaImperativeHandle
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
   * Reference to the reablocks Textarea component (imperative handle)
   */
  inputRef: RefObject<TextareaImperativeHandle | null>;
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
 * Calculate the pixel position of the cursor in a textarea (relative to the element)
 * Returns coordinates relative to the input element, not absolute screen position
 */
function getCursorPixelPosition(
  element: HTMLTextAreaElement | HTMLInputElement,
  position: number
): { top: number; left: number } {
  const computed = window.getComputedStyle(element);
  const text = element.value.substring(0, position);

  // Create a mirror div to calculate the exact text width
  const mirror = document.createElement('div');
  mirror.style.cssText = `
    position: absolute;
    visibility: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    width: ${computed.width};
    font-family: ${computed.fontFamily};
    font-size: ${computed.fontSize};
    font-weight: ${computed.fontWeight};
    font-style: ${computed.fontStyle};
    letter-spacing: ${computed.letterSpacing};
    text-transform: ${computed.textTransform};
    line-height: ${computed.lineHeight};
    padding: ${computed.padding};
    border: ${computed.border};
    box-sizing: ${computed.boxSizing};
  `;

  document.body.appendChild(mirror);

  // Get the text on the current line (for multi-line support)
  const lines = text.split('\n');
  const lastLine = lines[lines.length - 1];

  // Create a span to measure the width of text before the cursor
  const textSpan = document.createElement('span');
  textSpan.style.cssText = `
    font-family: ${computed.fontFamily};
    font-size: ${computed.fontSize};
    font-weight: ${computed.fontWeight};
    font-style: ${computed.fontStyle};
    letter-spacing: ${computed.letterSpacing};
    text-transform: ${computed.textTransform};
    white-space: pre;
  `;
  textSpan.textContent = lastLine;
  mirror.appendChild(textSpan);

  // Measure the actual rendered width
  const textWidth = textSpan.offsetWidth;

  document.body.removeChild(mirror);

  // Get line height for top calculation
  const lineHeight =
    parseInt(computed.lineHeight) || parseInt(computed.fontSize) * 1.2;
  const currentLine = lines.length - 1;
  const paddingLeft = parseInt(computed.paddingLeft) || 0;

  // Return RELATIVE position within the input element
  // left is used as crossAxis offset in floating-ui
  return {
    top: currentLine * lineHeight,
    left: paddingLeft + textWidth
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

      // Get the actual textarea element from the imperative handle
      const textareaElement = inputRef.current?.textareaRef?.current;

      if (trigger && textareaElement) {
        const position = getCursorPixelPosition(
          textareaElement,
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
