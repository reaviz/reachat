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
import { BasicInput, BasicInputRef } from './BasicInput';
import { SuggestionConfig, MentionItem, SlashCommandItem } from './types';

export interface ChatInputProps {
  /**
   * Input type to use. 'rich' uses the Tiptap rich text editor with
   * mentions and slash commands. 'basic' uses a plain textarea powered
   * by the reablocks Textarea component. (default: 'rich')
   */
  inputType?: 'rich' | 'basic';

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
   * Only used when inputType is 'rich'.
   */
  mentions?: SuggestionConfig<MentionItem>;

  /**
   * Configuration for commands (/command).
   * Provide items or an onSearch function to enable commands.
   * Only used when inputType is 'rich'.
   */
  commands?: SuggestionConfig<SlashCommandItem>;

  /**
   * Minimum height for the input in pixels (default: 24).
   * Only used when inputType is 'rich'.
   */
  minHeight?: number;

  /**
   * Maximum height for the input in pixels (default: 200).
   * Only used when inputType is 'rich'.
   */
  maxHeight?: number;

  /**
   * Minimum number of rows (default: 1).
   * Only used when inputType is 'basic'.
   */
  minRows?: number;

  /**
   * Maximum number of rows before scrolling (default: 8).
   * Only used when inputType is 'basic'.
   */
  maxRows?: number;

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
      inputType = 'rich',
      allowedFiles,
      placeholder = 'Type a message...',
      defaultValue,
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon,
      mentions,
      commands,
      minHeight = 24,
      maxHeight = 200,
      minRows = 1,
      maxRows = 8,
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
    const inputRef = useRef<RichTextInputRef | BasicInputRef | null>(null);
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

    const handleFileUpload = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && fileUpload) {
          fileUpload(file);
        }
      },
      [fileUpload]
    );

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
          {inputType === 'basic' ? (
            <BasicInput
              ref={inputRef as React.Ref<BasicInputRef>}
              value={message}
              onChange={handleChange}
              onSubmit={handleSubmit}
              placeholder={placeholder}
              disabled={isLoading || disabled}
              autoFocus={autoFocus}
              minRows={minRows}
              maxRows={maxRows}
              className={theme.input.editor.container}
            />
          ) : (
            <RichTextInput
              ref={inputRef as React.Ref<RichTextInputRef>}
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
          )}

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
      </div>
    );
  }
);
