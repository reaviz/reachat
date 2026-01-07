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
  useCallback
} from 'react';
import { Button, cn } from 'reablocks';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';
import { FileInput } from './FileInput';
import { TriggerPopup } from './TriggerPopup';
import { useTriggerManagerContentEditable } from './useTriggerManagerContentEditable';
import {
  ContentEditableInput,
  ContentEditableInputRef
} from './ContentEditableInput';
import {
  MentionPluginConfig,
  SlashCommandPluginConfig,
  InputTrigger,
  InputPluginItem
} from './types';

interface ChatInputContentEditableProps {
  defaultValue?: string;
  allowedFiles?: string[];
  placeholder?: string;
  sendIcon?: ReactElement;
  stopIcon?: ReactElement;
  attachIcon?: ReactElement;
  mentions?: MentionPluginConfig;
  commands?: SlashCommandPluginConfig;
  triggers?: InputTrigger[];
  minHeight?: number;
  maxHeight?: number;
}

export interface ChatInputContentEditableRef {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  insertText: (text: string) => void;
}

export const ChatInputContentEditable = forwardRef<
  ChatInputContentEditableRef,
  ChatInputContentEditableProps
>(
  (
    {
      allowedFiles,
      placeholder = 'Type a message...',
      defaultValue,
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon,
      mentions,
      commands,
      triggers: triggersProp = [],
      minHeight = 24,
      maxHeight = 200
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

    const [message, setMessage] = useState<string>(defaultValue || '');
    const [cursorPosition, setCursorPosition] = useState<number>(0);
    const inputRef = useRef<ContentEditableInputRef | null>(null);
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

      result.push(...triggersProp);

      return result;
    }, [mentions, commands, triggersProp]);

    // Extract trigger characters for highlighting
    const triggerChars = useMemo(() => {
      return allTriggers.map(t => t.trigger);
    }, [allTriggers]);

    // Use contenteditable-based trigger manager
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
    } = useTriggerManagerContentEditable({
      triggers: allTriggers,
      value: message,
      cursorPosition,
      onChange: (newValue, newCursorPosition) => {
        setMessage(newValue);
        setCursorPosition(newCursorPosition);
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
        inputRef.current?.setValue(value);
        setCursorPosition(value.length);
      },
      insertText: (text: string) => {
        inputRef.current?.insertTextAtCursor(text);
      }
    }));

    const handleSendMessage = useCallback(() => {
      if (message.trim()) {
        sendMessage?.(message);
        setMessage('');
        setCursorPosition(0);
        // Clear the contenteditable
        inputRef.current?.setValue('');
      }
    }, [message, sendMessage]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
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
      (newValue: string) => {
        setMessage(newValue);
        // Get actual cursor position from the input element
        const actualCursorPosition =
          inputRef.current?.getCursorPosition() ?? newValue.length;
        // Notify trigger manager of change with current cursor
        handleInputChange(newValue, actualCursorPosition);
      },
      [handleInputChange]
    );

    const handleCursorChange = useCallback(
      (newPosition: number) => {
        setCursorPosition(newPosition);
        // Get actual text content from input to avoid stale closure
        const actualValue = inputRef.current?.getValue() ?? '';
        // Re-check for triggers when cursor moves
        handleInputChange(actualValue, newPosition);
      },
      [handleInputChange]
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
        <div className={cn('relative flex-1', theme.input.input)}>
          <ContentEditableInput
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onCursorChange={handleCursorChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            autoFocus
            minHeight={minHeight}
            maxHeight={maxHeight}
            className="px-3 py-2 pr-16"
            triggers={triggerChars}
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
