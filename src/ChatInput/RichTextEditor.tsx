import {
  useEffect,
  useContext,
  forwardRef,
  useImperativeHandle,
  useMemo
} from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Mention from '@tiptap/extension-mention';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { InputPluginItem, InputTrigger } from './types';
import { createSuggestion } from './SuggestionPlugin';

export interface RichTextEditorRef {
  focus: () => void;
  blur: () => void;
  getContent: () => string;
  setContent: (content: string) => void;
  insertText: (text: string) => void;
  getEditor: () => Editor | null;
}

export interface RichTextEditorProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  triggers?: InputTrigger<InputPluginItem>[];
  formatting?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
  };
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  className?: string;
}

export const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(
  (
    {
      value = '',
      placeholder,
      disabled,
      autoFocus,
      triggers = [],
      formatting,
      onChange,
      onSubmit,
      className
    },
    ref
  ) => {
    const { theme } = useContext(ChatContext);

    const mentionExtensions = useMemo(() => {
      return triggers.map((trigger, index) => {
        const nodeName = `mention-${trigger.trigger.charCodeAt(0)}-${index}`;
        const ExtendedMention = Mention.extend({
          name: nodeName
        });

        return ExtendedMention.configure({
          HTMLAttributes: {
            class: 'mention'
          },
          suggestion: createSuggestion({
            trigger,
            nodeName,
            theme,
            onSelect: (item, editorInstance) => {
              trigger.onSelect?.(item, text => {
                editorInstance.commands.insertContent(text);
              });
            }
          }),
          renderLabel({ node }) {
            const label = node.attrs.label || node.attrs.id;
            if (trigger.trigger === '@') {
              return `@${label}`;
            } else if (trigger.trigger === '/') {
              return '';
            }
            return label;
          }
        });
      });
    }, [triggers, theme]);

    const extensions = useMemo(() => {
      const exts = [
        StarterKit.configure({
          bold: formatting?.bold === false ? false : {},
          italic: formatting?.italic === false ? false : {},
          code: formatting?.code === false ? false : {},
          heading: false,
          blockquote: false,
          bulletList: {},
          orderedList: {},
          listItem: {},
          codeBlock: false,
          horizontalRule: false,
          hardBreak: {
            keepMarks: true
          }
        }),
        Placeholder.configure({
          placeholder,
          emptyEditorClass: 'is-editor-empty'
        }),
        ...mentionExtensions
      ];

      return exts;
    }, [formatting, placeholder, mentionExtensions]);

    const editor = useEditor({
      extensions,
      content: value,
      editable: !disabled,
      autofocus: autoFocus ? 'end' : false,
      editorProps: {
        attributes: {
          class: cn(
            'prose prose-sm max-w-none focus:outline-none min-h-[24px] w-full',
            '[&_.is-editor-empty]:before:content-[attr(data-placeholder)]',
            '[&_.is-editor-empty]:before:text-gray-400',
            '[&_.is-editor-empty]:before:float-left',
            '[&_.is-editor-empty]:before:h-0',
            '[&_.is-editor-empty]:before:pointer-events-none',
            'dark:[&_.is-editor-empty]:before:text-gray-500'
          )
        },
        handleKeyDown: (_view, event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            const hasSuggestionPopup = document.querySelector(
              '[data-suggestion-popup]'
            );
            if (hasSuggestionPopup) {
              return false;
            }

            event.preventDefault();
            onSubmit?.();
            return true;
          }
          return false;
        },
        handlePaste: (view, event) => {
          const text = event.clipboardData?.getData('text/plain');
          if (!text) return false;

          const lines = text.split('\n');
          const bulletPattern = /^[\s]*[-*•]\s+(.+)$/;
          const orderedPattern = /^[\s]*(\d+)[.)]\s+(.+)$/;

          const isBulletList = lines.every(
            line => line.trim() === '' || bulletPattern.test(line)
          );
          const isOrderedList = lines.every(
            line => line.trim() === '' || orderedPattern.test(line)
          );

          if (isBulletList || isOrderedList) {
            event.preventDefault();

            const listItems = lines
              .filter(line => line.trim() !== '')
              .map(line => {
                if (isBulletList) {
                  const match = line.match(bulletPattern);
                  return match ? match[1] : line;
                } else {
                  const match = line.match(orderedPattern);
                  return match ? match[2] : line;
                }
              });

            const listType = isBulletList ? 'bulletList' : 'orderedList';
            const content = {
              type: listType,
              content: listItems.map(item => ({
                type: 'listItem',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: item }]
                  }
                ]
              }))
            };

            view.dispatch(
              view.state.tr.replaceSelectionWith(
                view.state.schema.nodeFromJSON(content)
              )
            );

            return true;
          }

          return false;
        }
      },
      onUpdate: ({ editor }) => {
        const text = editor.getText();
        onChange?.(text);
      }
    });

    useEffect(() => {
      if (editor && value !== editor.getText()) {
        const isEmpty = value === '';
        if (isEmpty) {
          editor.commands.clearContent();
        }
      }
    }, [editor, value]);

    useEffect(() => {
      if (editor) {
        editor.setEditable(!disabled);
      }
    }, [editor, disabled]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        editor?.commands.focus('end');
      },
      blur: () => {
        editor?.commands.blur();
      },
      getContent: () => {
        return editor?.getText() || '';
      },
      setContent: (content: string) => {
        editor?.commands.setContent(content);
      },
      insertText: (text: string) => {
        editor?.commands.insertContent(text);
      },
      getEditor: () => editor
    }));

    return (
      <EditorContent
        editor={editor}
        className={cn('w-full [&>.tiptap]:px-3 [&>.tiptap]:py-2', className)}
      />
    );
  }
);
