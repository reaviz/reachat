import {
  useState,
  KeyboardEvent,
  ReactElement,
  useRef,
  ChangeEvent,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useMemo,
  useCallback,
  SyntheticEvent
} from 'react';
import { Button, Textarea, cn } from 'reablocks';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';
import { FileInput } from './FileInput';
import { TriggerPopup } from './TriggerPopup';
import { useTriggerManager } from './useTriggerManager';
import {
  MentionPluginConfig,
  SlashCommandPluginConfig,
  InputTrigger,
  InputPluginItem,
  TextareaImperativeHandle
} from './types';

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
   * Configuration for mentions (@user).
   * Provide items or an onSearch function to enable mentions.
   */
  mentions?: MentionPluginConfig;

  /**
   * Configuration for commands (/command).
   * Provide items or an onSearch function to enable commands.
   */
  commands?: SlashCommandPluginConfig;

  /**
   * Custom trigger configurations for additional plugins.
   */
  triggers?: InputTrigger[];
}

export interface ChatInputRef {
  /**
   * Focus the input.
   */
  focus: () => void;

  /**
   * Get the current input value.
   */
  getValue: () => string;

  /**
   * Set the input value.
   */
  setValue: (value: string) => void;

  /**
   * Insert text at the current cursor position.
   */
  insertText: (text: string) => void;
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
      mentions,
      commands,
      triggers: triggersProp = []
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
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const inputRef = useRef<TextareaImperativeHandle | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Build triggers array from configuration
    const allTriggers = useMemo<InputTrigger<InputPluginItem>[]>(() => {
      const result: InputTrigger<InputPluginItem>[] = [];

      if (mentions) {
        result.push({
          trigger: mentions.trigger || '@',
          items: mentions.items || [],
          onSearch: mentions.onSearch,
          onSelect: mentions.onSelect,
          minQueryLength: mentions.minQueryLength,
          maxResults: mentions.maxResults,
          renderItem: mentions.renderItem,
          renderHeader: mentions.renderHeader,
          renderEmpty: mentions.renderEmpty,
          allowFreeform: mentions.allowFreeform
        });
      }

      if (commands) {
        result.push({
          trigger: commands.trigger || '/',
          items: commands.items || [],
          onSearch: commands.onSearch,
          onSelect: commands.onSelect,
          minQueryLength: commands.minQueryLength,
          maxResults: commands.maxResults,
          renderItem: commands.renderItem,
          renderHeader: commands.renderHeader,
          renderEmpty: commands.renderEmpty,
          allowFreeform: commands.allowFreeform
        });
      }

      // Add custom triggers
      result.push(...triggersProp);

      return result;
    }, [mentions, commands, triggersProp]);

    // Use trigger manager hook
    const {
      activeTrigger,
      matchingItems,
      isLoading: isTriggerLoading,
      highlightedIndex,
      setHighlightedIndex,
      handleKeyDown: handleTriggerKeyDown,
      handleInputChange,
      selectItem,
      closePopup,
      currentTriggerConfig
    } = useTriggerManager({
      triggers: allTriggers,
      value: message,
      cursorPosition,
      onChange: (newValue, newCursorPosition) => {
        setMessage(newValue);
        setCursorPosition(newCursorPosition);
        // Update cursor position in textarea
        const textarea = inputRef.current?.textareaRef?.current;
        if (textarea) {
          requestAnimationFrame(() => {
            textarea?.setSelectionRange(newCursorPosition, newCursorPosition);
            textarea?.focus();
          });
        }
      },
      inputRef
    });

    useEffect(() => {
      inputRef.current?.focus();
    }, [activeSessionId]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      getValue: () => message,
      setValue: (value: string) => {
        setMessage(value);
        setCursorPosition(value.length);
      },
      insertText: (text: string) => {
        const textarea = inputRef.current?.textareaRef?.current;
        if (textarea) {
          const start = textarea.selectionStart || 0;
          const end = textarea.selectionEnd || 0;
          const newValue =
            message.substring(0, start) + text + message.substring(end);
          setMessage(newValue);
          const newPosition = start + text.length;
          setCursorPosition(newPosition);
          requestAnimationFrame(() => {
            textarea.setSelectionRange(newPosition, newPosition);
            textarea.focus();
          });
        }
      }
    }));

    const handleSendMessage = useCallback(() => {
      if (message.trim()) {
        sendMessage?.(message);
        setMessage('');
        setCursorPosition(0);
      }
    }, [message, sendMessage]);

    const handleKeyPress = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // First, let trigger manager handle navigation
        if (activeTrigger && handleTriggerKeyDown(e)) {
          return;
        }

        // Handle send on Enter (without shift)
        if (e.key === 'Enter' && !e.shiftKey && !activeTrigger) {
          e.preventDefault();
          handleSendMessage();
        }
      },
      [activeTrigger, handleTriggerKeyDown, handleSendMessage]
    );

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const newCursorPosition = e.target.selectionStart || 0;

        setMessage(newValue);
        setCursorPosition(newCursorPosition);

        // Notify trigger manager of change
        handleInputChange(newValue, newCursorPosition);
      },
      [handleInputChange]
    );

    const handleSelect = useCallback(
      (e: SyntheticEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        setCursorPosition(target.selectionStart || 0);
      },
      []
    );

    const handleFileUpload = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && fileUpload) {
          fileUpload(file);
        }
      },
      [fileUpload]
    );

    return (
      <div ref={containerRef} className={cn(theme.input.base)}>
        {/* Input Container */}
        <div className="relative flex-1">
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
            onChange={handleChange}
            onSelect={handleSelect}
            onClick={handleSelect}
          />

          {/* Action Buttons */}
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

        {/* Trigger Popup */}
        {allTriggers.length > 0 && (
          <TriggerPopup
            isOpen={!!activeTrigger}
            query={activeTrigger?.query || ''}
            items={matchingItems}
            highlightedIndex={highlightedIndex}
            position={activeTrigger?.cursorPosition || { top: 0, left: 0 }}
            onSelect={selectItem}
            onHighlightChange={setHighlightedIndex}
            onClose={closePopup}
            isLoading={isTriggerLoading}
            referenceRef={containerRef}
            renderItem={currentTriggerConfig?.renderItem}
            renderHeader={currentTriggerConfig?.renderHeader}
            renderEmpty={currentTriggerConfig?.renderEmpty}
          />
        )}
      </div>
    );
  }
);
