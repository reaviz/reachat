import { useState, useCallback, useRef, RefObject } from 'react';

export type TriggerType = 'slash' | 'mention' | null;

export interface TriggerState {
  /**
   * The type of trigger that is active.
   */
  type: TriggerType;

  /**
   * The filter text after the trigger character.
   */
  filter: string;

  /**
   * The start position of the trigger in the text.
   */
  startPosition: number;

  /**
   * The currently active/highlighted index in the menu.
   */
  activeIndex: number;
}

export interface UseInputTriggerOptions {
  /**
   * Character that triggers slash commands.
   * @default '/'
   */
  slashTrigger?: string;

  /**
   * Character that triggers mentions.
   * @default '@'
   */
  mentionTrigger?: string;

  /**
   * Whether slash commands are enabled.
   * @default true
   */
  enableSlashCommands?: boolean;

  /**
   * Whether mentions are enabled.
   * @default true
   */
  enableMentions?: boolean;

  /**
   * Whether slash commands only trigger at the start of input.
   * @default true
   */
  slashOnlyAtStart?: boolean;

  /**
   * Reference to the textarea element.
   */
  inputRef: RefObject<HTMLTextAreaElement>;
}

export interface UseInputTriggerResult {
  /**
   * Current trigger state.
   */
  triggerState: TriggerState | null;

  /**
   * Whether any trigger menu is open.
   */
  isMenuOpen: boolean;

  /**
   * Handle text change to detect triggers.
   */
  handleTextChange: (text: string) => void;

  /**
   * Handle key down for navigation and selection.
   * Returns true if the key was handled.
   */
  handleKeyDown: (event: React.KeyboardEvent, itemCount: number) => boolean;

  /**
   * Close the trigger menu.
   */
  closeTrigger: () => void;

  /**
   * Get the text to insert when a selection is made.
   */
  getInsertText: (selectedText: string) => {
    newText: string;
    cursorPosition: number;
  };

  /**
   * Update the active index (used when item count changes).
   */
  setActiveIndex: (index: number) => void;
}

/**
 * Hook to handle trigger detection (/ and @) and keyboard navigation
 * for slash commands and mentions.
 */
export const useInputTrigger = ({
  slashTrigger = '/',
  mentionTrigger = '@',
  enableSlashCommands = true,
  enableMentions = true,
  slashOnlyAtStart = true,
  inputRef
}: UseInputTriggerOptions): UseInputTriggerResult => {
  const [triggerState, setTriggerState] = useState<TriggerState | null>(null);
  const currentTextRef = useRef<string>('');

  const isMenuOpen = triggerState !== null;

  const handleTextChange = useCallback(
    (text: string) => {
      currentTextRef.current = text;
      const cursorPosition = inputRef.current?.selectionStart ?? text.length;

      // Check for slash command trigger
      if (enableSlashCommands) {
        // For slash at start only
        if (slashOnlyAtStart) {
          if (text.startsWith(slashTrigger)) {
            const filter = text.slice(1).split(/\s/)[0] || '';
            // Only show menu if no space after the command
            if (!text.includes(' ') || cursorPosition <= text.indexOf(' ')) {
              setTriggerState(prev => ({
                type: 'slash',
                filter,
                startPosition: 0,
                activeIndex: prev?.type === 'slash' ? prev.activeIndex : 0
              }));
              return;
            }
          }
        } else {
          // Slash anywhere after space or at start
          const slashMatch = text
            .slice(0, cursorPosition)
            .match(new RegExp(`(?:^|\\s)\\${slashTrigger}([^\\s]*)$`));
          if (slashMatch) {
            const startPos = cursorPosition - slashMatch[1].length - 1;
            setTriggerState(prev => ({
              type: 'slash',
              filter: slashMatch[1],
              startPosition: startPos,
              activeIndex: prev?.type === 'slash' ? prev.activeIndex : 0
            }));
            return;
          }
        }
      }

      // Check for mention trigger
      if (enableMentions) {
        const textBeforeCursor = text.slice(0, cursorPosition);
        const mentionMatch = textBeforeCursor.match(
          new RegExp(`(?:^|\\s)\\${mentionTrigger}([^\\s${mentionTrigger}]*)$`)
        );
        if (mentionMatch) {
          const matchStart = textBeforeCursor.lastIndexOf(
            mentionTrigger + mentionMatch[1]
          );
          setTriggerState(prev => ({
            type: 'mention',
            filter: mentionMatch[1],
            startPosition: matchStart,
            activeIndex: prev?.type === 'mention' ? prev.activeIndex : 0
          }));
          return;
        }
      }

      // No trigger found, close menu
      setTriggerState(null);
    },
    [
      enableSlashCommands,
      enableMentions,
      slashTrigger,
      mentionTrigger,
      slashOnlyAtStart,
      inputRef
    ]
  );

  const closeTrigger = useCallback(() => {
    setTriggerState(null);
  }, []);

  const setActiveIndex = useCallback((index: number) => {
    setTriggerState(prev => (prev ? { ...prev, activeIndex: index } : null));
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, itemCount: number): boolean => {
      if (!triggerState || itemCount === 0) {
        return false;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setTriggerState(prev =>
            prev
              ? {
                  ...prev,
                  activeIndex: Math.min(prev.activeIndex + 1, itemCount - 1)
                }
              : null
          );
          return true;

        case 'ArrowUp':
          event.preventDefault();
          setTriggerState(prev =>
            prev
              ? {
                  ...prev,
                  activeIndex: Math.max(prev.activeIndex - 1, 0)
                }
              : null
          );
          return true;

        case 'Tab':
        case 'Enter':
          // These will be handled by the parent to trigger selection
          if (triggerState) {
            event.preventDefault();
            return true;
          }
          return false;

        case 'Escape':
          event.preventDefault();
          closeTrigger();
          return true;

        default:
          return false;
      }
    },
    [triggerState, closeTrigger]
  );

  const getInsertText = useCallback(
    (selectedText: string): { newText: string; cursorPosition: number } => {
      if (!triggerState) {
        return { newText: currentTextRef.current, cursorPosition: 0 };
      }

      const currentText = currentTextRef.current;
      const { startPosition, type, filter } = triggerState;

      // Calculate the end of the trigger + filter
      const triggerChar = type === 'slash' ? slashTrigger : mentionTrigger;
      const endPosition = startPosition + triggerChar.length + filter.length;

      // Build new text
      const beforeTrigger = currentText.slice(0, startPosition);
      const afterTrigger = currentText.slice(endPosition);

      let insertText: string;
      if (type === 'slash') {
        // For slash commands, replace the whole thing
        insertText = selectedText + ' ';
      } else {
        // For mentions, insert with the trigger character
        insertText = mentionTrigger + selectedText + ' ';
      }

      const newText = beforeTrigger + insertText + afterTrigger;
      const cursorPosition = beforeTrigger.length + insertText.length;

      return { newText, cursorPosition };
    },
    [triggerState, slashTrigger, mentionTrigger]
  );

  return {
    triggerState,
    isMenuOpen,
    handleTextChange,
    handleKeyDown,
    closeTrigger,
    getInsertText,
    setActiveIndex
  };
};
