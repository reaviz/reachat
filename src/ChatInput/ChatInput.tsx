import {
  useState,
  KeyboardEvent,
  ReactElement,
  useRef,
  ChangeEvent,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect
} from 'react';
import { Button, Textarea, cn } from 'reablocks';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';
import { FileInput } from './FileInput';
import { SlashCommand } from './types';
import { useSlashCommands } from './hooks/useSlashCommands';
import { CommandDropdown } from './CommandDropdown';
import { CommandIndicator } from './CommandIndicator';

interface ChatInputProps {
  /**
   * Default value for the input field.
   */
  defaultValue?: string;

  /**
   * Allowed file types for upload.
   */
  allowedFiles?: string[];

  /**
   * Placeholder text for the input field.
   */
  placeholder?: string;

  /**
   * Icon to show for send.
   */
  sendIcon?: ReactElement;

  /**
   * Icon to show for stop.
   */
  stopIcon?: ReactElement;

  /**
   * Icon to show for attach.
   */
  attachIcon?: ReactElement;

  /**
   * Slash commands available in the input.
   */
  commands?: SlashCommand[];

  /**
   * Message to show when no commands are found.
   */
  noCommandsMessage?: string;

  /**
   * Callback when a command is selected.
   */
  onCommandSelect?: (command: SlashCommand) => void;

  /**
   * Custom filter function for commands.
   */
  commandFilter?: (command: SlashCommand, query: string) => boolean;
}

export interface ChatInputRef {
  /**
   * Focus the input.
   */
  focus: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  (
    {
      allowedFiles,
      placeholder,
      defaultValue,
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon,
      commands = [],
      noCommandsMessage,
      onCommandSelect,
      commandFilter
    },
    ref
  ) => {
    const {
      theme,
      isLoading,
      disabled,
      sendMessage,
      stopMessage,
      fileUpload,
      activeSessionId
    } = useContext(ChatContext);
    const [message, setMessage] = useState<string>('');
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    const {
      showDropdown,
      filteredCommands,
      selectedIndex,
      handleKeyDown: handleSlashKeyDown,
      handleInputChange: handleSlashInputChange,
      selectCommand,
      handleBlur,
      lastSelectedCommand,
      clearLastCommand
    } = useSlashCommands({
      commands,
      onCommandSelect,
      commandFilter,
      inputRef,
      setMessage,
      message
    });

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [activeSessionId, inputRef]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      }
    }));

    const handleSendMessage = () => {
      if (message.trim()) {
        sendMessage?.(message);
        setMessage('');
      }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (showDropdown) {
        if (
          e.key === 'Enter' ||
          e.key === 'Tab' ||
          e.key === 'Escape' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown'
        ) {
          handleSlashKeyDown(e);
          // Don't process further if it's a slash command key
          if (e.defaultPrevented) {
            return;
          }
        }
      }

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
      if (commands.length > 0) {
        handleSlashInputChange(e);
      }
      // Clear command indicator when user types after command selection
      if (lastSelectedCommand) {
        clearLastCommand();
      }
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && fileUpload) {
        fileUpload(file);
      }
    };

    return (
      <div className={cn(theme.input.base, 'relative overflow-visible')}>
        <CommandIndicator
          command={lastSelectedCommand}
          onDismiss={clearLastCommand}
        />
        {showDropdown && (
          <CommandDropdown
            commands={filteredCommands}
            selectedIndex={selectedIndex}
            noCommandsMessage={noCommandsMessage}
            onSelect={selectCommand}
          />
        )}
        <Textarea
          ref={inputRef}
          containerClassName={cn(theme.input.input)}
          minRows={1}
          autoFocus
          value={message}
          defaultValue={defaultValue}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading || disabled}
          onChange={handleInputChange}
          onBlur={handleBlur}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls={showDropdown ? 'command-listbox' : undefined}
          aria-activedescendant={
            showDropdown && selectedIndex >= 0
              ? `command-${selectedIndex}`
              : undefined
          }
        />
        <div className={cn(theme.input.actions.base)}>
          {allowedFiles?.length > 0 && (
            <FileInput
              allowedFiles={allowedFiles}
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
              disabled={disabled}
              attachIcon={attachIcon}
            />
          )}
          {isLoading && (
            <Button
              title="Stop"
              className={cn(theme.input.actions.stop)}
              onClick={stopMessage}
              disabled={disabled}
            >
              {stopIcon}
            </Button>
          )}
          <Button
            title="Send"
            className={cn(theme.input.actions.send)}
            onClick={handleSendMessage}
            disabled={isLoading || disabled}
          >
            {sendIcon}
          </Button>
        </div>
      </div>
    );
  }
);
