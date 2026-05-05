import {
  useState,
  ReactElement,
  useRef,
  useMemo,
  ChangeEvent,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback
} from 'react';
import { Button, cn } from 'reablocks';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';
import { FileInput } from './FileInput';
import { RichTextInput, RichTextInputRef } from './RichTextInput';
import { SuggestionConfig, MentionItem, SlashCommandItem } from './types';

export interface ChatInputProps {
  /**
   * Default value for the input field.
   */
  defaultValue?: string;

  /**
   * Allowed file types for upload.
   */
  allowedFiles?: string[];

  /**
   * Allow multiple file uploads.
   */
  allowMultipleFiles?: boolean;

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
  mentions?: SuggestionConfig<MentionItem>;

  /**
   * Configuration for commands (/command).
   * Provide items or an onSearch function to enable commands.
   */
  commands?: SuggestionConfig<SlashCommandItem>;

  /**
   * Minimum height for the input (default: 24px)
   */
  minHeight?: number;

  /**
   * Maximum height for the input (default: 200px)
   */
  maxHeight?: number;

  /**
   * Whether to auto-focus the input on mount (default: true)
   */
  autoFocus?: boolean;
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
      placeholder = 'Type a message...',
      allowMultipleFiles = false,
      defaultValue,
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon,
      mentions,
      commands,
      minHeight = 24,
      maxHeight = 200,
      autoFocus = true
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
    const inputRef = useRef<RichTextInputRef | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (autoFocus) {
        inputRef.current?.focus();
      }
    }, [activeSessionId, autoFocus]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      getValue: () => {
        return inputRef.current?.getValue() || '';
      },
      setValue: (value: string) => {
        setMessage(value);
        inputRef.current?.setValue(value);
      },
      insertText: (text: string) => {
        inputRef.current?.insertText(text);
      }
    }));

    const handleSendMessage = useCallback(() => {
      const currentMessage = inputRef.current?.getValue();
      if (currentMessage.trim()) {
        sendMessage?.(currentMessage);
        setMessage('');
        inputRef.current?.setValue('');
      }
    }, [sendMessage]);

    const handleSubmit = useCallback(
      (value: string) => {
        if (value.trim()) {
          sendMessage?.(value);
          setMessage('');
        }
      },
      [sendMessage]
    );

    const handleChange = useCallback((value: string) => {
      setMessage(value);
    }, []);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files?.length && fileUpload) {
        fileUpload(allowMultipleFiles ? Array.from(files) : files[0]);
      }
    };

    const mentionsConfig = useMemo(
      () =>
        mentions
          ? { ...mentions, trigger: mentions.trigger || '@' }
          : undefined,
      [mentions]
    );

    const commandsConfig = useMemo(
      () =>
        commands
          ? { ...commands, trigger: commands.trigger || '/' }
          : undefined,
      [commands]
    );

    return (
      <div ref={containerRef} className={cn(theme.input.base)}>
        <div className={cn('relative flex-1', theme.input.input)}>
          <RichTextInput
            ref={inputRef}
            value={message}
            onChange={handleChange}
            onSubmit={handleSubmit}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            autoFocus={autoFocus}
            minHeight={minHeight}
            maxHeight={maxHeight}
            className={theme.input.editor.container}
            mentions={mentionsConfig}
            commands={commandsConfig}
          />

          <div className={cn(theme.input.actions.base)}>
            {allowedFiles?.length > 0 && (
              <FileInput
                allowedFiles={allowedFiles}
                multiple={allowMultipleFiles}
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
      </div>
    );
  }
);
