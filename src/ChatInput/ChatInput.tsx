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
import { Button, Textarea, cn } from 'reablocks';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';
import { FileInput } from './FileInput';
import { TriggerPopup } from './TriggerPopup';
import {
  FormattingToolbar,
  applyFormatting,
  FormattingAction
} from './FormattingToolbar';
import { useTriggerManager } from './useTriggerManager';
import {
  MentionPluginConfig,
  SlashCommandPluginConfig,
  TagPluginConfig,
  FormattingOptions,
  InputTrigger,
  InputPluginItem
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
   * Configuration for slash commands (/command).
   * Provide items or an onSearch function to enable slash commands.
   */
  slashCommands?: SlashCommandPluginConfig;

  /**
   * Configuration for tags (#tag).
   * Provide items or an onSearch function to enable tags.
   */
  tags?: TagPluginConfig;

  /**
   * Custom trigger configurations for additional plugins.
   */
  customTriggers?: InputTrigger[];

  /**
   * Formatting options for text formatting toolbar.
   * Set to enable formatting features like bold, italic, lists, etc.
   */
  formatting?: FormattingOptions;
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
      slashCommands,
      tags,
      customTriggers = [],
      formatting
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
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Build triggers array from configuration
    const triggers = useMemo<InputTrigger<InputPluginItem>[]>(() => {
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

      if (slashCommands) {
        result.push({
          trigger: slashCommands.trigger || '/',
          items: slashCommands.items || [],
          onSearch: slashCommands.onSearch,
          onSelect: slashCommands.onSelect,
          minQueryLength: slashCommands.minQueryLength,
          maxResults: slashCommands.maxResults,
          renderItem: slashCommands.renderItem,
          renderHeader: slashCommands.renderHeader,
          renderEmpty: slashCommands.renderEmpty,
          allowFreeform: slashCommands.allowFreeform
        });
      }

      if (tags) {
        result.push({
          trigger: tags.trigger || '#',
          items: tags.items || [],
          onSearch: tags.onSearch,
          onSelect: tags.onSelect,
          minQueryLength: tags.minQueryLength,
          maxResults: tags.maxResults,
          renderItem: tags.renderItem,
          renderHeader: tags.renderHeader,
          renderEmpty: tags.renderEmpty,
          allowFreeform: tags.allowFreeform
        });
      }

      // Add custom triggers
      result.push(...customTriggers);

      return result;
    }, [mentions, slashCommands, tags, customTriggers]);

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
      triggers,
      value: message,
      cursorPosition,
      onChange: (newValue, newCursorPosition) => {
        setMessage(newValue);
        setCursorPosition(newCursorPosition);
        // Update cursor position in textarea
        if (inputRef.current) {
          requestAnimationFrame(() => {
            inputRef.current?.setSelectionRange(
              newCursorPosition,
              newCursorPosition
            );
            inputRef.current?.focus();
          });
        }
      },
      inputRef
    });

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [activeSessionId, inputRef]);

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
        const input = inputRef.current;
        if (input) {
          const start = input.selectionStart || 0;
          const end = input.selectionEnd || 0;
          const newValue =
            message.substring(0, start) + text + message.substring(end);
          setMessage(newValue);
          const newPosition = start + text.length;
          setCursorPosition(newPosition);
          requestAnimationFrame(() => {
            input.setSelectionRange(newPosition, newPosition);
            input.focus();
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

        // Handle formatting shortcuts
        if (formatting && (e.ctrlKey || e.metaKey)) {
          let action: FormattingAction | null = null;

          if (e.key === 'b' && formatting.bold) {
            action = 'bold';
          } else if (e.key === 'i' && formatting.italic) {
            action = 'italic';
          } else if (e.key === '`' && formatting.code) {
            action = 'code';
          }

          if (action) {
            e.preventDefault();
            handleFormat(action);
            return;
          }
        }

        // Handle send on Enter (without shift)
        if (e.key === 'Enter' && !e.shiftKey && !activeTrigger) {
          e.preventDefault();
          handleSendMessage();
        }
      },
      [activeTrigger, handleTriggerKeyDown, formatting, handleSendMessage]
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
      (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        setCursorPosition(target.selectionStart || 0);
      },
      []
    );

    const handleFormat = useCallback(
      (action: FormattingAction) => {
        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;

        const { newText, newSelectionStart, newSelectionEnd } = applyFormatting(
          message,
          start,
          end,
          action
        );

        setMessage(newText);
        setCursorPosition(newSelectionEnd);

        requestAnimationFrame(() => {
          input.setSelectionRange(newSelectionStart, newSelectionEnd);
          input.focus();
        });
      },
      [message]
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

    // Check if formatting toolbar should be shown
    const showToolbar =
      formatting?.showToolbar &&
      (formatting.bold ||
        formatting.italic ||
        formatting.strikethrough ||
        formatting.code ||
        formatting.bulletList ||
        formatting.numberedList ||
        formatting.blockquote ||
        formatting.codeBlock);

    // Determine toolbar position class
    const toolbarPositionClass = useMemo(() => {
      if (!showToolbar) return '';
      switch (formatting?.toolbarPosition) {
        case 'top':
          return 'flex-col';
        case 'bottom':
          return 'flex-col-reverse';
        default:
          return 'flex-col';
      }
    }, [showToolbar, formatting?.toolbarPosition]);

    return (
      <div
        ref={containerRef}
        className={cn(theme.input.base, toolbarPositionClass)}
      >
        {/* Formatting Toolbar */}
        {showToolbar && formatting?.toolbarPosition !== 'floating' && (
          <FormattingToolbar
            options={formatting}
            onFormat={handleFormat}
            disabled={isLoading || disabled}
          />
        )}

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
        {triggers.length > 0 && (
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
