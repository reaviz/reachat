import { forwardRef, useImperativeHandle, useEffect, useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from 'reablocks';
import { RichTextInputProps, RichTextInputRef } from './types';
import { createSlashCommandExtension } from './SlashCommandExtension';
import { createMentionExtension } from './MentionExtension';

import './styles.css';

export const RichTextInput = forwardRef<RichTextInputRef, RichTextInputProps>(
  (
    {
      defaultValue = '',
      placeholder = 'Type a message...',
      disabled = false,
      onChange,
      onSubmit,
      className,
      // Rich text config
      enableBold = true,
      enableItalic = true,
      enableStrikethrough = true,
      enableCode = true,
      enableCodeBlock = true,
      enableBulletList = true,
      enableOrderedList = true,
      enableBlockquote = true,
      // Slash commands
      slashCommands = [],
      onSlashCommand,
      // Mentions
      mentions = [],
      fetchMentions,
      onMention
    },
    ref
  ) => {
    // Build extensions array based on configuration
    const extensions = useMemo(() => {
      const exts: any[] = [
        StarterKit.configure({
          bold: enableBold ? {} : false,
          italic: enableItalic ? {} : false,
          strike: enableStrikethrough ? {} : false,
          code: enableCode ? {} : false,
          codeBlock: enableCodeBlock ? {} : false,
          bulletList: enableBulletList ? {} : false,
          orderedList: enableOrderedList ? {} : false,
          blockquote: enableBlockquote ? {} : false
        }),
        Placeholder.configure({
          placeholder,
          emptyEditorClass: 'is-editor-empty'
        })
      ];

      // Add slash command extension if commands are provided
      if (slashCommands.length > 0) {
        exts.push(
          createSlashCommandExtension({
            commands: slashCommands,
            onSelect: onSlashCommand
          })
        );
      }

      // Add mention extension if mentions are provided or fetch function exists
      if (mentions.length > 0 || fetchMentions) {
        exts.push(
          createMentionExtension({
            mentions,
            fetchMentions,
            onSelect: onMention
          })
        );
      }

      return exts;
    }, [
      enableBold,
      enableItalic,
      enableStrikethrough,
      enableCode,
      enableCodeBlock,
      enableBulletList,
      enableOrderedList,
      enableBlockquote,
      placeholder,
      slashCommands,
      onSlashCommand,
      mentions,
      fetchMentions,
      onMention
    ]);

    const editor = useEditor({
      extensions,
      content: defaultValue,
      editable: !disabled,
      editorProps: {
        attributes: {
          class: cn(
            'rich-text-input-editor',
            'outline-none min-h-[40px] max-h-[200px] overflow-y-auto',
            'prose prose-sm dark:prose-invert max-w-none',
            // Remove default prose margins
            '[&_p]:my-0 [&_ul]:my-1 [&_ol]:my-1 [&_blockquote]:my-1',
            '[&_pre]:my-1 [&_code]:bg-gray-100 [&_code]:dark:bg-gray-800',
            '[&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded',
            className
          )
        },
        handleKeyDown: (view, event) => {
          // Submit on Enter (without Shift)
          if (event.key === 'Enter' && !event.shiftKey) {
            // Check if we're in a code block or list
            const { state } = view;
            const { $from } = state.selection;
            const parent = $from.parent;

            // Allow Enter in code blocks and lists
            if (
              parent.type.name === 'codeBlock' ||
              parent.type.name === 'listItem'
            ) {
              return false;
            }

            // Submit the message
            event.preventDefault();
            const text = editor?.getText() ?? '';
            if (text.trim() && onSubmit) {
              onSubmit(text);
              editor?.commands.clearContent();
            }
            return true;
          }
          return false;
        }
      },
      onUpdate: ({ editor: ed }) => {
        const text = ed.getText();
        onChange?.(text);
      }
    });

    // Update editor disabled state
    useEffect(() => {
      editor?.setEditable(!disabled);
    }, [editor, disabled]);

    // Expose ref methods
    useImperativeHandle(ref, () => ({
      focus: () => {
        editor?.commands.focus();
      },
      getText: () => {
        return editor?.getText() ?? '';
      },
      getHTML: () => {
        return editor?.getHTML() ?? '';
      },
      setContent: (content: string) => {
        editor?.commands.setContent(content);
      },
      clear: () => {
        editor?.commands.clearContent();
      },
      getEditor: () => editor
    }));

    return (
      <div
        className={cn(
          'rich-text-input-container',
          'w-full',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <EditorContent editor={editor} />
      </div>
    );
  }
);

RichTextInput.displayName = 'RichTextInput';
