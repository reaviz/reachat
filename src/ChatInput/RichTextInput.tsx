import React, {
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
  useEffect
} from 'react';
import { useEditor, EditorContent, ReactRenderer } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import HardBreak from '@tiptap/extension-hard-break';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { MentionList, MentionListRef } from './MentionList';
import { SuggestionConfig, SuggestionItem } from './types';

export interface RichTextInputRef {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  insertText: (text: string) => void;
}

export interface RichTextInputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  mentions?: SuggestionConfig;
  commands?: SuggestionConfig;
  onSubmit?: (value: string) => void;
  onChange?: (value: string) => void;
}

function createSuggestionConfig<T extends SuggestionItem>(
  config: SuggestionConfig<T>,
  triggerChar: string,
  suggestionActiveRef: React.MutableRefObject<boolean>
) {
  return {
    char: triggerChar,
    allowSpaces: false,
    items: async ({ query }: { query: string }) => {
      if (config.onSearch) {
        return await config.onSearch(query);
      }
      if (!config.items) return [];
      if (!query) return config.items.slice(0, config.maxResults || 10);

      const lowerQuery = query.toLowerCase();
      return config.items
        .filter(
          item =>
            item.label.toLowerCase().includes(lowerQuery) ||
            item.description?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, config.maxResults || 10);
    },
    render: () => {
      let component: ReactRenderer<MentionListRef> | null = null;

      return {
        onStart: (props: any) => {
          suggestionActiveRef.current = true;
          component = new ReactRenderer(MentionList, {
            props: {
              ...props,
              triggerChar,
              config
            },
            editor: props.editor
          });
        },
        onUpdate: (props: any) => {
          component?.updateProps({
            ...props,
            triggerChar,
            config
          });
        },
        onKeyDown: (props: any) => {
          if (props.event.key === 'Escape') {
            component?.destroy();
            return true;
          }
          return component?.ref?.onKeyDown(props) ?? false;
        },
        onExit: () => {
          suggestionActiveRef.current = false;
          component?.destroy();
        }
      };
    }
  };
}

export const RichTextInput = forwardRef<RichTextInputRef, RichTextInputProps>(
  (
    {
      value = '',
      placeholder = 'Type a message...',
      disabled = false,
      autoFocus = true,
      className,
      minHeight = 24,
      maxHeight = 200,
      mentions,
      commands,
      onSubmit,
      onChange
    },
    ref
  ) => {
    const { theme } = useContext(ChatContext);
    const containerRef = useRef<HTMLDivElement>(null);
    const suggestionActiveRef = useRef(false);

    const extensions = [
      Document,
      Paragraph.configure({
        HTMLAttributes: {
          class: 'tiptap-paragraph'
        }
      }),
      Text,
      HardBreak,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty'
      })
    ];

    if (mentions) {
      extensions.push(
        Mention.configure({
          HTMLAttributes: {
            class: cn(theme?.input?.tag?.base, theme?.input?.tag?.mention)
          },
          suggestion: createSuggestionConfig(
            mentions,
            mentions.trigger || '@',
            suggestionActiveRef
          )
        }).extend({
          name: 'mention'
        })
      );
    }

    if (commands) {
      extensions.push(
        Mention.configure({
          HTMLAttributes: {
            class: cn(theme?.input?.tag?.base, theme?.input?.tag?.command)
          },
          suggestion: createSuggestionConfig(
            commands,
            commands.trigger || '/',
            suggestionActiveRef
          )
        }).extend({
          name: 'command'
        })
      );
    }

    const editor = useEditor({
      extensions,
      content: value ? `<p>${value}</p>` : '',
      editable: !disabled,
      immediatelyRender: false,
      onUpdate: ({ editor }) => {
        const text = editor.getText();
        onChange?.(text);
      },
      editorProps: {
        attributes: {
          class: cn(
            theme?.input?.editor?.base,
            theme?.input?.editor?.placeholder
          ),
          style: `min-height: ${minHeight}px; max-height: ${maxHeight}px;`,
          role: 'textbox',
          'aria-multiline': 'true',
          'aria-placeholder': placeholder,
          'aria-disabled': disabled ? 'true' : 'false',
          tabindex: disabled ? '-1' : '0'
        },
        handleKeyDown: (view, event) => {
          // Don't submit when suggestion popup is active
          if (suggestionActiveRef.current) {
            return false;
          }
          if (event.key === 'Enter' && !event.shiftKey) {
            const text = view.state.doc.textContent;
            if (text.trim() && onSubmit) {
              event.preventDefault();
              onSubmit(text);
              editor?.commands.clearContent();
              return true;
            }
          }
          return false;
        }
      }
    });

    useEffect(() => {
      if (autoFocus && editor) {
        setTimeout(() => {
          editor.commands.focus('end');
        }, 0);
      }
    }, [editor, autoFocus]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        editor?.commands.focus();
      },
      getValue: () => {
        return editor?.getText() || '';
      },
      setValue: (newValue: string) => {
        editor?.commands.setContent(newValue ? `<p>${newValue}</p>` : '');
      },
      insertText: (text: string) => {
        editor?.commands.insertContent(text);
      }
    }));

    return (
      <div ref={containerRef} className={cn('relative w-full', className)}>
        <EditorContent editor={editor} />
      </div>
    );
  }
);
