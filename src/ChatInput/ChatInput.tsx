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
  useCallback
} from 'react';
import { Button, Textarea, cn } from 'reablocks';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import SendIcon from '@/assets/send.svg?react';
import StopIcon from '@/assets/stop.svg?react';
import { ChatContext } from '@/ChatContext';
import { TriggerConfig, TriggerOption, SelectedTrigger } from '@/types';
import { FileInput } from './FileInput';
import { TriggerMenu, TriggerMenuRef } from './TriggerMenu';

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
   * Array of trigger configurations for mentions/commands.
   * When provided, uses rich text editor with trigger support.
   */
  triggers?: TriggerConfig[];

  /**
   * Callback when a trigger option is selected.
   */
  onTriggerSelect?: (trigger: SelectedTrigger) => void;
}

export interface ChatInputRef {
  /**
   * Focus the input.
   */
  focus: () => void;
}

interface SuggestionState {
  isOpen: boolean;
  query: string;
  triggerConfig: TriggerConfig | null;
  options: TriggerOption[];
  isLoading: boolean;
  referenceElement: HTMLElement | null;
  onSelect: ((option: TriggerOption) => void) | null;
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
      triggers,
      onTriggerSelect
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
    const menuRef = useRef<TriggerMenuRef>(null);
    const [selectedTriggers, setSelectedTriggers] = useState<SelectedTrigger[]>(
      []
    );
    const [suggestionState, setSuggestionState] = useState<SuggestionState>({
      isOpen: false,
      query: '',
      triggerConfig: null,
      options: [],
      isLoading: false,
      referenceElement: null,
      onSelect: null
    });

    const useTriggers = triggers && triggers.length > 0;

    const createMentionExtensions = useCallback(() => {
      if (!triggers) return [];

      return triggers.map((triggerConfig, index) => {
        return Mention.configure({
          HTMLAttributes: {
            class: theme.input.mention.base,
            'data-trigger': triggerConfig.char
          },
          suggestion: {
            char: triggerConfig.char,
            allowSpaces: triggerConfig.allowSpaces ?? false,
            items: async ({ query }: { query: string }) => {
              if (triggerConfig.getOptions) {
                setSuggestionState(prev => ({
                  ...prev,
                  isLoading: true,
                  query
                }));
                const results = await triggerConfig.getOptions(query);
                setSuggestionState(prev => ({
                  ...prev,
                  isLoading: false,
                  options: results
                }));
                return results;
              }

              const options = triggerConfig.options || [];
              const filtered = query
                ? options.filter(
                    option =>
                      option.label
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      option.description
                        ?.toLowerCase()
                        .includes(query.toLowerCase())
                  )
                : options;

              setSuggestionState(prev => ({
                ...prev,
                options: filtered,
                query,
                isLoading: false
              }));
              return filtered;
            },
            render: () => {
              let onSelectHandler: ((option: TriggerOption) => void) | null =
                null;

              return {
                onStart: props => {
                  onSelectHandler = (option: TriggerOption) => {
                    props.command({
                      id: option.id,
                      label: option.label
                    });
                    setSelectedTriggers(prev => [
                      ...prev,
                      { trigger: triggerConfig.char, option }
                    ]);
                  };

                  setSuggestionState({
                    isOpen: true,
                    query: props.query,
                    triggerConfig,
                    options: [],
                    isLoading: Boolean(triggerConfig.getOptions),
                    referenceElement: props.decorationNode as HTMLElement,
                    onSelect: onSelectHandler
                  });
                },
                onUpdate: props => {
                  setSuggestionState(prev => ({
                    ...prev,
                    query: props.query,
                    referenceElement: props.decorationNode as HTMLElement
                  }));
                },
                onKeyDown: props => {
                  if (props.event.key === 'Escape') {
                    setSuggestionState(prev => ({
                      ...prev,
                      isOpen: false
                    }));
                    return true;
                  }
                  return menuRef.current?.onKeyDown(props.event) ?? false;
                },
                onExit: () => {
                  setSuggestionState(prev => ({
                    ...prev,
                    isOpen: false,
                    options: [],
                    query: ''
                  }));
                }
              };
            }
          }
        }).extend({
          name: `mention-${index}`
        });
      });
    }, [triggers, theme.input.mention.base]);

    const editor = useEditor(
      {
        extensions: [
          Document,
          Paragraph,
          Text,
          HardBreak,
          History,
          Placeholder.configure({
            placeholder,
            emptyEditorClass:
              'before:content-[attr(data-placeholder)] before:float-left before:text-gray-400 before:pointer-events-none before:h-0'
          }),
          ...createMentionExtensions()
        ],
        content: defaultValue || '',
        editable: !isLoading && !disabled,
        editorProps: {
          attributes: {
            'aria-label': placeholder,
            role: 'textbox',
            'aria-multiline': 'true'
          },
          handleKeyDown: (view, event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              if (suggestionState.isOpen) {
                return false;
              }
              event.preventDefault();
              handleSendMessage();
              return true;
            }
            return false;
          }
        },
        onUpdate: ({ editor: ed }) => {
          setMessage(ed.getText());
        }
      },
      [disabled, isLoading, createMentionExtensions]
    );

    useEffect(() => {
      if (useTriggers) {
        editor?.commands.focus();
      } else if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [activeSessionId, useTriggers, editor]);

    useEffect(() => {
      if (editor && (isLoading || disabled) !== !editor.isEditable) {
        editor.setEditable(!isLoading && !disabled);
      }
    }, [editor, isLoading, disabled]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (useTriggers) {
          editor?.commands.focus();
        } else {
          inputRef.current?.focus();
        }
      }
    }));

    const handleSendMessage = () => {
      if (useTriggers) {
        const text = editor?.getText() || '';
        if (text.trim()) {
          sendMessage?.(text);
          selectedTriggers.forEach(trigger => {
            onTriggerSelect?.(trigger);
          });
          editor?.commands.clearContent();
          setSelectedTriggers([]);
        }
      } else {
        if (message.trim()) {
          sendMessage?.(message);
          setMessage('');
        }
      }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && fileUpload) {
        fileUpload(file);
      }
    };

    const handleTriggerSelect = useCallback(
      (option: TriggerOption) => {
        suggestionState.onSelect?.(option);
      },
      [suggestionState]
    );

    const actionButtons = (
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
    );

    if (useTriggers) {
      return (
        <div className={cn(theme.input.base)}>
          <div className={cn(theme.input.editor)}>
            <EditorContent editor={editor} className="flex-1" />
            {suggestionState.isOpen && (
              <TriggerMenu
                ref={menuRef}
                options={suggestionState.options}
                isLoading={suggestionState.isLoading}
                loadingText={suggestionState.triggerConfig?.loadingText}
                noResultsText={suggestionState.triggerConfig?.noResultsText}
                onSelect={handleTriggerSelect}
                query={suggestionState.query}
                referenceElement={suggestionState.referenceElement}
              />
            )}
            {actionButtons}
          </div>
        </div>
      );
    }

    return (
      <div className={cn(theme.input.base)}>
        <Textarea
          ref={inputRef}
          containerClassName={cn(theme.input.input)}
          minRows={1}
          autoFocus
          value={message}
          defaultValue={defaultValue}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={isLoading || disabled}
          onChange={e => setMessage(e.target.value)}
        />
        {actionButtons}
      </div>
    );
  }
);
