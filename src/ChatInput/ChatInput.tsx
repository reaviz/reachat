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
  ReactNode
} from 'react';
import { Button, Textarea, cn, ConnectedOverlay } from 'reablocks';
import { offset } from '@floating-ui/react';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';
import { FileInput } from './FileInput';
import {
  SlashCommand,
  SlashCommandMenu,
  SlashCommandMenuProps
} from './SlashCommand';
import {
  Mention,
  MentionsMenu,
  MentionsMenuProps,
  MentionTrigger
} from './Mentions';
import {
  RichTextPreview,
  RichTextFormatConfig,
  RichTextPreviewProps
} from './RichTextPreview';
import { useInputTrigger } from './hooks/useInputTrigger';

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

  // ===== Slash Commands =====

  /**
   * List of available slash commands.
   * When provided, enables the slash command feature.
   */
  slashCommands?: SlashCommand[];

  /**
   * Character that triggers the slash command menu.
   * @default '/'
   */
  slashTrigger?: string;

  /**
   * Whether slash commands only work at the start of the input.
   * @default true
   */
  slashOnlyAtStart?: boolean;

  /**
   * Callback when a slash command is selected.
   */
  onSlashCommand?: (command: SlashCommand) => void;

  /**
   * Custom props to pass to the SlashCommandMenu component.
   */
  slashCommandMenuProps?: Partial<SlashCommandMenuProps>;

  /**
   * Custom renderer for the slash command menu.
   */
  renderSlashCommandMenu?: (props: {
    commands: SlashCommand[];
    filter: string;
    activeIndex: number;
    onSelect: (command: SlashCommand) => void;
    onClose: () => void;
  }) => ReactNode;

  // ===== Mentions =====

  /**
   * Mention triggers configuration.
   * When provided, enables the mentions feature.
   */
  mentions?: Mention[] | MentionTrigger[];

  /**
   * Character that triggers the mentions menu.
   * @default '@'
   */
  mentionTrigger?: string;

  /**
   * Callback when a mention is selected.
   */
  onMention?: (mention: Mention) => void;

  /**
   * Custom props to pass to the MentionsMenu component.
   */
  mentionsMenuProps?: Partial<MentionsMenuProps>;

  /**
   * Custom renderer for the mentions menu.
   */
  renderMentionsMenu?: (props: {
    mentions: Mention[];
    filter: string;
    activeIndex: number;
    isLoading: boolean;
    onSelect: (mention: Mention) => void;
    onClose: () => void;
  }) => ReactNode;

  // ===== Rich Text Preview =====

  /**
   * Enable rich text preview/formatting.
   * @default false
   */
  enableRichTextPreview?: boolean;

  /**
   * Configuration for which rich text formats to enable.
   */
  richTextConfig?: RichTextFormatConfig;

  /**
   * Custom props to pass to the RichTextPreview component.
   */
  richTextPreviewProps?: Partial<RichTextPreviewProps>;

  /**
   * Whether to show the rich text preview above the input.
   * @default true
   */
  showPreviewAbove?: boolean;
}

export interface ChatInputRef {
  /**
   * Focus the input.
   */
  focus: () => void;

  /**
   * Get the current value.
   */
  getValue: () => string;

  /**
   * Set the value programmatically.
   */
  setValue: (value: string) => void;
}

/**
 * Filters slash commands based on the search text.
 */
const filterSlashCommands = (
  commands: SlashCommand[],
  filter: string
): SlashCommand[] => {
  if (!filter) return commands;
  const lowerFilter = filter.toLowerCase();
  return commands.filter(
    cmd =>
      cmd.command.toLowerCase().includes(lowerFilter) ||
      cmd.label.toLowerCase().includes(lowerFilter) ||
      cmd.description?.toLowerCase().includes(lowerFilter)
  );
};

/**
 * Filters mentions based on the search text.
 */
const filterMentions = (mentions: Mention[], filter: string): Mention[] => {
  if (!filter) return mentions;
  const lowerFilter = filter.toLowerCase();
  return mentions.filter(
    mention =>
      mention.name.toLowerCase().includes(lowerFilter) ||
      mention.description?.toLowerCase().includes(lowerFilter)
  );
};

/**
 * Normalizes mention configuration to an array of Mention objects.
 */
const normalizeMentions = (
  mentions: Mention[] | MentionTrigger[] | undefined
): Mention[] => {
  if (!mentions) return [];

  // Check if it's an array of MentionTrigger
  if (mentions.length > 0 && 'trigger' in mentions[0]) {
    // Extract data from first trigger for now
    const trigger = mentions[0] as MentionTrigger;
    if (Array.isArray(trigger.data)) {
      return trigger.data;
    }
    return [];
  }

  return mentions as Mention[];
};

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  (
    {
      allowedFiles,
      placeholder,
      defaultValue,
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon,
      // Slash commands
      slashCommands = [],
      slashTrigger = '/',
      slashOnlyAtStart = true,
      onSlashCommand,
      slashCommandMenuProps,
      renderSlashCommandMenu,
      // Mentions
      mentions: mentionsConfig,
      mentionTrigger = '@',
      onMention,
      mentionsMenuProps,
      renderMentionsMenu,
      // Rich text preview
      enableRichTextPreview = false,
      richTextConfig,
      richTextPreviewProps,
      showPreviewAbove = true
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
    const [mentionsLoading, setMentionsLoading] = useState(false);
    const [asyncMentions, setAsyncMentions] = useState<Mention[]>([]);

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Normalize mentions data
    const staticMentions = useMemo(
      () => normalizeMentions(mentionsConfig),
      [mentionsConfig]
    );

    // Get the actual mentions to display
    const mentionsData =
      asyncMentions.length > 0 ? asyncMentions : staticMentions;

    // Input trigger hook
    const {
      triggerState,
      isMenuOpen,
      handleTextChange,
      handleKeyDown,
      closeTrigger,
      getInsertText,
      setActiveIndex
    } = useInputTrigger({
      slashTrigger,
      mentionTrigger,
      enableSlashCommands: slashCommands.length > 0,
      enableMentions: mentionsData.length > 0 || !!mentionsConfig,
      slashOnlyAtStart,
      inputRef
    });

    // Compute filtered items
    const filteredCommands = useMemo(
      () =>
        triggerState?.type === 'slash'
          ? filterSlashCommands(slashCommands, triggerState.filter)
          : [],
      [slashCommands, triggerState]
    );

    const filteredMentions = useMemo(
      () =>
        triggerState?.type === 'mention'
          ? filterMentions(mentionsData, triggerState.filter)
          : [],
      [mentionsData, triggerState]
    );

    // Get current item count for keyboard navigation
    const currentItemCount = useMemo(() => {
      if (triggerState?.type === 'slash') {
        return filteredCommands.length;
      }
      if (triggerState?.type === 'mention') {
        return filteredMentions.length;
      }
      return 0;
    }, [triggerState?.type, filteredCommands.length, filteredMentions.length]);

    // Clamp active index when items change
    useEffect(() => {
      if (
        triggerState &&
        triggerState.activeIndex >= currentItemCount &&
        currentItemCount > 0
      ) {
        setActiveIndex(currentItemCount - 1);
      }
    }, [currentItemCount, triggerState, setActiveIndex]);

    // Handle async mentions
    useEffect(() => {
      if (
        triggerState?.type === 'mention' &&
        mentionsConfig &&
        Array.isArray(mentionsConfig) &&
        mentionsConfig.length > 0 &&
        'trigger' in mentionsConfig[0]
      ) {
        const trigger = mentionsConfig[0] as MentionTrigger;
        if (typeof trigger.data === 'function') {
          setMentionsLoading(true);
          trigger
            .data(triggerState.filter)
            .then(data => {
              setAsyncMentions(data);
              setMentionsLoading(false);
            })
            .catch(() => {
              setAsyncMentions([]);
              setMentionsLoading(false);
            });
        }
      }
    }, [triggerState?.filter, triggerState?.type, mentionsConfig]);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [activeSessionId]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current?.focus();
      },
      getValue: () => message,
      setValue: (value: string) => {
        setMessage(value);
        handleTextChange(value);
      }
    }));

    const handleSendMessage = useCallback(() => {
      if (message.trim()) {
        sendMessage?.(message);
        setMessage('');
        closeTrigger();
      }
    }, [message, sendMessage, closeTrigger]);

    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setMessage(value);
        handleTextChange(value);
      },
      [handleTextChange]
    );

    const handleSlashCommandSelect = useCallback(
      (command: SlashCommand) => {
        // If there's a callback, call it
        onSlashCommand?.(command);

        // Replace the trigger with the command (or clear if callback handles it)
        const { newText, cursorPosition } = getInsertText(
          slashTrigger + command.command
        );
        setMessage(newText);
        closeTrigger();

        // Focus and set cursor position
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          }
        }, 0);
      },
      [onSlashCommand, getInsertText, slashTrigger, closeTrigger]
    );

    const handleMentionSelect = useCallback(
      (mention: Mention) => {
        onMention?.(mention);

        const { newText, cursorPosition } = getInsertText(mention.name);
        setMessage(newText);
        closeTrigger();

        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          }
        }, 0);
      },
      [onMention, getInsertText, closeTrigger]
    );

    const handleKeyPress = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        // Check if trigger menu is handling the key
        if (isMenuOpen && handleKeyDown(e, currentItemCount)) {
          // Enter or Tab was pressed with menu open - handle selection
          if (e.key === 'Enter' || e.key === 'Tab') {
            if (triggerState?.type === 'slash' && filteredCommands.length > 0) {
              const selected = filteredCommands[triggerState.activeIndex];
              if (selected) {
                handleSlashCommandSelect(selected);
              }
            } else if (
              triggerState?.type === 'mention' &&
              filteredMentions.length > 0
            ) {
              const selected = filteredMentions[triggerState.activeIndex];
              if (selected) {
                handleMentionSelect(selected);
              }
            }
          }
          return;
        }

        // Normal Enter to send (if menu is not open)
        if (e.key === 'Enter' && !e.shiftKey && !isMenuOpen) {
          e.preventDefault();
          handleSendMessage();
        }
      },
      [
        isMenuOpen,
        handleKeyDown,
        currentItemCount,
        triggerState,
        filteredCommands,
        filteredMentions,
        handleSendMessage,
        handleSlashCommandSelect,
        handleMentionSelect
      ]
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

    // Determine if we should show preview
    const shouldShowPreview =
      enableRichTextPreview &&
      message.trim().length > 0 &&
      !isMenuOpen &&
      // Only show preview if there's actual formatting
      /[*_`~\[\]>\-]|^\d+\./.test(message);

    return (
      <div ref={containerRef} className={cn(theme.input.base, 'flex-col')}>
        {/* Rich text preview (above input) */}
        {shouldShowPreview && showPreviewAbove && (
          <div
            className={cn(
              'mb-2 p-3 rounded-lg border',
              'bg-gray-50 dark:bg-gray-900/50',
              'border-gray-200 dark:border-gray-700',
              theme?.input?.preview?.container
            )}
          >
            <div
              className={cn(
                'text-xs text-gray-500 dark:text-gray-400 mb-1',
                theme?.input?.preview?.label
              )}
            >
              Preview
            </div>
            <RichTextPreview
              text={message}
              formatConfig={richTextConfig}
              {...richTextPreviewProps}
            />
          </div>
        )}

        {/* Main input row */}
        <div className="flex relative w-full">
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
          />

          {/* Slash Command Menu */}
          {triggerState?.type === 'slash' &&
            slashCommands.length > 0 &&
            filteredCommands.length > 0 && (
              <ConnectedOverlay
                open={true}
                reference={inputRef.current}
                placement="top-start"
                modifiers={[offset({ mainAxis: 8 })]}
                content={() =>
                  renderSlashCommandMenu ? (
                    renderSlashCommandMenu({
                      commands: filteredCommands,
                      filter: triggerState.filter,
                      activeIndex: triggerState.activeIndex,
                      onSelect: handleSlashCommandSelect,
                      onClose: closeTrigger
                    })
                  ) : (
                    <SlashCommandMenu
                      commands={filteredCommands}
                      filter={triggerState.filter}
                      activeIndex={triggerState.activeIndex}
                      onSelect={handleSlashCommandSelect}
                      onClose={closeTrigger}
                      {...slashCommandMenuProps}
                    />
                  )
                }
              />
            )}

          {/* Mentions Menu */}
          {triggerState?.type === 'mention' &&
            (filteredMentions.length > 0 || mentionsLoading) && (
              <ConnectedOverlay
                open={true}
                reference={inputRef.current}
                placement="top-start"
                modifiers={[offset({ mainAxis: 8 })]}
                content={() =>
                  renderMentionsMenu ? (
                    renderMentionsMenu({
                      mentions: filteredMentions,
                      filter: triggerState.filter,
                      activeIndex: triggerState.activeIndex,
                      isLoading: mentionsLoading,
                      onSelect: handleMentionSelect,
                      onClose: closeTrigger
                    })
                  ) : (
                    <MentionsMenu
                      mentions={filteredMentions}
                      filter={triggerState.filter}
                      activeIndex={triggerState.activeIndex}
                      isLoading={mentionsLoading}
                      onSelect={handleMentionSelect}
                      onClose={closeTrigger}
                      {...mentionsMenuProps}
                    />
                  )
                }
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
