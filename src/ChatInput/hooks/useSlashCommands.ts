import {
  useState,
  useCallback,
  KeyboardEvent,
  ChangeEvent,
  useEffect
} from 'react';
import { useFuzzy } from '@reaviz/react-use-fuzzy';
import { SlashCommand, UseSlashCommandsOptions } from '@/ChatInput/types';

export function useSlashCommands({
  commands,
  onCommandSelect,
  commandFilter,
  inputRef,
  setMessage,
  message
}: UseSlashCommandsOptions) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [slashPosition, setSlashPosition] = useState(-1);
  const [lastSelectedCommand, setLastSelectedCommand] =
    useState<SlashCommand | null>(null);

  const visibleCommands = commands.filter(cmd => {
    const richCmd = cmd as any;
    if (richCmd.visible === undefined) {
      return true;
    }
    if (typeof richCmd.visible === 'boolean') {
      return richCmd.visible;
    }
    if (typeof richCmd.visible === 'function') {
      return richCmd.visible({});
    }

    return true;
  });

  const { result: fuzzyResults, search } = useFuzzy(visibleCommands, {
    keys: ['label', 'description']
  });

  const filteredCommands = fuzzyResults
    .filter(result => {
      if (commandFilter) {
        return commandFilter(result, commandQuery);
      }
      return true;
    })
    .map(result => result);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursorPos = e.target.selectionStart || 0;

      const textBeforeCursor = value.slice(0, cursorPos);
      const slashMatch = textBeforeCursor.match(/(?:^|\s)\/(\S*)$/);

      if (slashMatch) {
        const position =
          slashMatch.index! + (slashMatch[0].startsWith(' ') ? 1 : 0);
        setSlashPosition(position);
        setCommandQuery(slashMatch[1]);
        search(slashMatch[1]);
        setShowDropdown(true);
        setSelectedIndex(0); // Auto-select first item
      } else {
        setShowDropdown(false);
        setCommandQuery('');
        search('');
        setSelectedIndex(-1);
      }
    },
    [search]
  );

  const selectCommand = useCallback(
    (command: SlashCommand) => {
      // Use the message state instead of relying on the ref
      const value = message;

      const beforeSlash = value.substring(0, slashPosition);
      const afterCommand = value.substring(
        slashPosition + commandQuery.length + 1
      );

      const newValue = beforeSlash + command.value + afterCommand;

      // Always update the message state (doesn't require ref)
      setMessage(newValue);

      // Set cursor position only if ref is available (progressive enhancement)
      if (inputRef.current) {
        // Timeout is required to ensure the cursor position is set after the message is updated
        setTimeout(() => {
          if (inputRef.current) {
            const newCursorPos = slashPosition + command.value.length;
            inputRef.current.textareaRef?.current?.setSelectionRange(
              newCursorPos,
              newCursorPos
            );
            inputRef.current.focus();
          }
        }, 0);
      }

      if ('action' in command && command.action) {
        command.action();
      }

      onCommandSelect?.(command);

      // Set the last selected command for indicator
      setLastSelectedCommand(command);

      setShowDropdown(false);
      setCommandQuery('');
      setSelectedIndex(-1);
      setSlashPosition(-1);
    },
    [
      slashPosition,
      commandQuery,
      inputRef,
      onCommandSelect,
      setMessage,
      message
    ]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!showDropdown || filteredCommands.length === 0) return;

      const indexToSelect = selectedIndex >= 0 ? selectedIndex : 0;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => {
            const next = prev + 1;
            return next >= filteredCommands.length ? 0 : next;
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => {
            const next = prev - 1;
            return next < 0 ? filteredCommands.length - 1 : next;
          });
          break;

        case 'Enter':
        case 'Tab':
          e.preventDefault();
          e.stopPropagation();
          // Use selected index if available, otherwise select first item
          if (indexToSelect < filteredCommands.length) {
            selectCommand(filteredCommands[indexToSelect]);
          }
          break;

        case 'Escape':
          e.preventDefault();
          setShowDropdown(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [showDropdown, filteredCommands, selectedIndex, selectCommand]
  );

  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(Math.max(0, filteredCommands.length - 1));
    }
  }, [filteredCommands.length, selectedIndex]);

  const handleBlur = useCallback(() => {
    setShowDropdown(false);
    setSelectedIndex(-1);
  }, []);

  const clearLastCommand = useCallback(() => {
    setLastSelectedCommand(null);
  }, []);

  return {
    showDropdown,
    filteredCommands,
    selectedIndex,
    handleKeyDown,
    handleInputChange,
    selectCommand,
    handleBlur,
    lastSelectedCommand,
    clearLastCommand
  };
}
