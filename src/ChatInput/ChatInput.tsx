import {
  useState,
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
import { RichTextEditor, RichTextEditorRef } from './RichTextEditor';
import {
  MentionPluginConfig,
  SlashCommandPluginConfig,
  InputTrigger,
  InputPluginItem,
  FormattingOptions
} from './types';

interface ChatInputProps {
  defaultValue?: string;
  allowedFiles?: string[];
  placeholder?: string;
  sendIcon?: ReactElement;
  stopIcon?: ReactElement;
  attachIcon?: ReactElement;
  mentions?: MentionPluginConfig;
  commands?: SlashCommandPluginConfig;
  triggers?: InputTrigger[];
  formatting?: FormattingOptions;
}

export interface ChatInputRef {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  insertText: (text: string) => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
  (
    {
      allowedFiles,
      placeholder,
      defaultValue = '',
      sendIcon = <SendIcon />,
      stopIcon = <StopIcon />,
      attachIcon,
      mentions,
      commands,
      triggers: triggersProp = [],
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
    const [message, setMessage] = useState<string>(defaultValue);
    const editorRef = useRef<RichTextEditorRef | null>(null);

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

    useEffect(() => {
      editorRef.current?.focus();
    }, [activeSessionId]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        editorRef.current?.focus();
      },
      getValue: () => message,
      setValue: (value: string) => {
        setMessage(value);
        editorRef.current?.setContent(value);
      },
      insertText: (text: string) => {
        editorRef.current?.insertText(text);
      }
    }));

    const handleSendMessage = useCallback(() => {
      if (message.trim()) {
        sendMessage?.(message);
        setMessage('');
        editorRef.current?.setContent('');
      }
    }, [message, sendMessage]);

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

    return (
      <div className={cn(theme.input.base)}>
        <div className={cn(theme.input.input, 'relative flex-1')}>
          <RichTextEditor
            ref={editorRef}
            value={message}
            placeholder={placeholder}
            disabled={isLoading || disabled}
            autoFocus
            triggers={allTriggers}
            formatting={formatting}
            onChange={handleChange}
            onSubmit={handleSendMessage}
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
      </div>
    );
  }
);
