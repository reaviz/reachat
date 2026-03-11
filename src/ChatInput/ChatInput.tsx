import {
  useState,
  ReactElement,
  ReactNode,
  useRef,
  useMemo,
  ChangeEvent,
  useContext,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
  FC
} from 'react';
import { Button, cn } from 'reablocks';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';
import { FileInput } from './FileInput';
import { RichTextInput, RichTextInputRef } from './RichTextInput';
import { SuggestionConfig, MentionItem, SlashCommandItem } from './types';

/**
 * Context provided to render props (actions, prepend, append)
 * for building custom input layouts.
 */
export interface ChatInputRenderContext {
  /**
   * Whether the chat is currently loading/streaming a response.
   */
  isLoading: boolean;

  /**
   * Whether the input is disabled.
   */
  disabled: boolean;

  /**
   * The current input message value.
   */
  message: string;

  /**
   * Send the current message.
   */
  sendMessage: () => void;

  /**
   * Stop the current response generation.
   */
  stopMessage: () => void;
}

export type ChatInputSlot =
  | ReactNode
  | ((context: ChatInputRenderContext) => ReactNode);

export interface SendButtonProps {
  /**
   * Custom icon for the send button.
   */
  icon?: ReactElement;

  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;

  /**
   * Click handler.
   */
  onClick?: () => void;

  /**
   * Additional CSS class names.
   */
  className?: string;
}

export const SendButton: FC<SendButtonProps> = ({
  icon = <SendIcon />,
  disabled,
  onClick,
  className
}) => {
  const { theme } = useContext(ChatContext);
  return (
    <Button
      title="Send"
      className={cn(theme.input.actions.send, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </Button>
  );
};

export interface StopButtonProps {
  /**
   * Custom icon for the stop button.
   */
  icon?: ReactElement;

  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;

  /**
   * Click handler.
   */
  onClick?: () => void;

  /**
   * Additional CSS class names.
   */
  className?: string;
}

export const StopButton: FC<StopButtonProps> = ({
  icon = <StopIcon />,
  disabled,
  onClick,
  className
}) => {
  const { theme } = useContext(ChatContext);
  return (
    <Button
      title="Stop"
      className={cn(theme.input.actions.stop, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
    </Button>
  );
};

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

  /**
   * Custom content rendered above the editor, inside the input container.
   * Accepts a ReactNode or a render function receiving ChatInputRenderContext.
   */
  prepend?: ChatInputSlot;

  /**
   * Custom content rendered below the editor, inside the input container.
   * Accepts a ReactNode or a render function receiving ChatInputRenderContext.
   */
  append?: ChatInputSlot;

  /**
   * Custom actions area replacing the default send/stop/file buttons.
   * Accepts a ReactNode or a render function receiving ChatInputRenderContext.
   * When provided, the default action buttons are not rendered.
   */
  actions?: ChatInputSlot;

  /**
   * Where to place the actions relative to the editor.
   * - 'inline': Absolutely positioned over the editor (default)
   * - 'top': Rendered as a block row above the editor
   * - 'bottom': Rendered as a block row below the editor
   * - 'before': Rendered to the left of the editor
   * - 'after': Rendered to the right of the editor
   */
  actionsPlacement?: 'inline' | 'top' | 'bottom' | 'before' | 'after';
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

function resolveSlot(
  slot: ChatInputSlot | undefined,
  context: ChatInputRenderContext
): ReactNode {
  if (slot === undefined || slot === null) {
    return null;
  }
  if (typeof slot === 'function') {
    return slot(context);
  }
  return slot;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
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
      minHeight = 24,
      maxHeight = 200,
      autoFocus = true,
      prepend,
      append,
      actions,
      actionsPlacement = 'inline'
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

    const renderContext: ChatInputRenderContext = useMemo(
      () => ({
        isLoading: isLoading ?? false,
        disabled: disabled ?? false,
        message,
        sendMessage: handleSendMessage,
        stopMessage: stopMessage ?? (() => {})
      }),
      [isLoading, disabled, message, handleSendMessage, stopMessage]
    );

    const defaultActions = (
      <>
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
          <StopButton
            icon={stopIcon}
            onClick={stopMessage}
            disabled={disabled}
          />
        )}
        <SendButton
          icon={sendIcon}
          onClick={handleSendMessage}
          disabled={isLoading || disabled}
        />
      </>
    );

    const resolvedPrepend = resolveSlot(prepend, renderContext);
    const resolvedAppend = resolveSlot(append, renderContext);
    const resolvedActions =
      actions !== undefined
        ? resolveSlot(actions, renderContext)
        : defaultActions;

    const actionsTheme =
      actionsPlacement === 'inline'
        ? theme.input.actions.base
        : theme.input.actions[actionsPlacement];

    const actionsBlock = (
      <div className={cn(actionsTheme)}>{resolvedActions}</div>
    );

    const isHorizontal =
      actionsPlacement === 'before' || actionsPlacement === 'after';

    const editorNode = (
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
    );

    return (
      <div ref={containerRef} className={cn(theme.input.base)}>
        <div className={cn('relative flex-1', theme.input.input)}>
          {resolvedPrepend && (
            <div className={cn(theme.input.prepend)}>{resolvedPrepend}</div>
          )}

          {actionsPlacement === 'top' && actionsBlock}

          {isHorizontal ? (
            <div className="flex items-center gap-2">
              {actionsPlacement === 'before' && actionsBlock}
              <div className="flex-1">{editorNode}</div>
              {actionsPlacement === 'after' && actionsBlock}
            </div>
          ) : (
            editorNode
          )}

          {actionsPlacement === 'bottom' && actionsBlock}

          {resolvedAppend && (
            <div className={cn(theme.input.append)}>{resolvedAppend}</div>
          )}

          {actionsPlacement === 'inline' && actionsBlock}
        </div>
      </div>
    );
  }
);
