import React, {
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
  useEffect,
  useMemo
} from 'react';
import {
  useEditor,
  EditorContent,
  ReactRenderer,
  posToDOMRect
} from '@tiptap/react';
import { computePosition, flip, shift } from '@floating-ui/dom';
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
  /**
   * Current value of the input
   * @default ''
   */
  value?: string;

  /**
   * Placeholder text when empty
   * @default 'Type a message...'
   */
  placeholder?: string;

  /**
   * Whether the input is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to auto-focus on mount.
   * @default true
   */
  autoFocus?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Minimum height in pixels.
   * @default 24
   */
  minHeight?: number;

  /**
   * Maximum height in pixels.
   * @default 200
   */
  maxHeight?: number;

  /**
   * Configuration for @ mentions
   */
  mentions?: SuggestionConfig;

  /**
   * Configuration for / slash commands
   */
  commands?: SuggestionConfig;

  /**
   * Callback when user submits (presses Enter)
   */
  onSubmit?: (value: string) => void;

  /**
   * Callback when input value changes
   */
  onChange?: (value: string) => void;
}

/**
 * Updates the position of the suggestion popup relative to the cursor.
 * Uses floating-ui to compute optimal placement with flip/shift middleware.
 */
function updatePopupPosition(editor: any, element: HTMLElement) {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(
        editor.view,
        editor.state.selection.from,
        editor.state.selection.to
      )
  };

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()]
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content';
    element.style.position = strategy;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
  });
}

/**
 * Creates a Tiptap suggestion configuration for mentions or slash commands.
 * Handles item filtering, popup rendering, positioning, and keyboard navigation.
 */
function createSuggestionConfig<T extends SuggestionItem>(
  config: SuggestionConfig<T>,
  triggerChar: string,
  suggestionActiveRef: React.RefObject<boolean>
) {
  return {
    char: triggerChar,
    allowSpaces: false,

    // Fetch and filter suggestion items based on query
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

    // Render callbacks for managing the popup lifecycle
    render: () => {
      let component: ReactRenderer<MentionListRef> | null = null;

      return {
        // Called when suggestion is triggered
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

          if (!props.clientRect) {
            return;
          }

          // Set position before appending to body (important for correct positioning)
          component.element.style.position = 'absolute';
          document.body.appendChild(component.element);
          updatePopupPosition(props.editor, component.element);
        },

        // Called when query or items change
        onUpdate: (props: any) => {
          component?.updateProps({
            ...props,
            triggerChar,
            config
          });

          if (!props.clientRect) {
            return;
          }

          if (component?.element) {
            updatePopupPosition(props.editor, component.element);
          }
        },

        // Handle keyboard navigation (Escape closes popup)
        onKeyDown: (props: any) => {
          if (props.event.key === 'Escape') {
            component?.destroy();
            return true;
          }
          return component?.ref?.onKeyDown(props) ?? false;
        },

        // Cleanup when suggestion is dismissed
        onExit: () => {
          suggestionActiveRef.current = false;
          component?.element?.remove();
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

    const extensions = useMemo(() => {
      const exts = [
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
        exts.push(
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
        exts.push(
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

      return exts;
    }, [placeholder, mentions, commands, theme]);

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

RichTextInput.displayName = 'RichTextInput';
