import { ReactNode } from 'react';
import { Editor } from '@tiptap/react';
import { SlashCommand } from '../SlashCommand';
import { Mention } from '../Mentions';

export interface RichTextInputProps {
  /**
   * Initial content for the editor.
   */
  defaultValue?: string;

  /**
   * Placeholder text.
   */
  placeholder?: string;

  /**
   * Whether the editor is disabled.
   */
  disabled?: boolean;

  /**
   * Callback when content changes.
   */
  onChange?: (content: string) => void;

  /**
   * Callback when Enter is pressed (without shift).
   */
  onSubmit?: (content: string) => void;

  /**
   * CSS class name for the editor container.
   */
  className?: string;

  // ===== Rich Text Configuration =====

  /**
   * Whether to enable bold formatting.
   * @default true
   */
  enableBold?: boolean;

  /**
   * Whether to enable italic formatting.
   * @default true
   */
  enableItalic?: boolean;

  /**
   * Whether to enable strikethrough formatting.
   * @default true
   */
  enableStrikethrough?: boolean;

  /**
   * Whether to enable code formatting.
   * @default true
   */
  enableCode?: boolean;

  /**
   * Whether to enable code blocks.
   * @default true
   */
  enableCodeBlock?: boolean;

  /**
   * Whether to enable bullet lists.
   * @default true
   */
  enableBulletList?: boolean;

  /**
   * Whether to enable ordered lists.
   * @default true
   */
  enableOrderedList?: boolean;

  /**
   * Whether to enable blockquotes.
   * @default true
   */
  enableBlockquote?: boolean;

  // ===== Slash Commands =====

  /**
   * Available slash commands.
   */
  slashCommands?: SlashCommand[];

  /**
   * Callback when a slash command is selected.
   */
  onSlashCommand?: (command: SlashCommand) => void;

  /**
   * Custom renderer for slash command suggestions.
   */
  renderSlashCommandItem?: (props: {
    command: SlashCommand;
    isSelected: boolean;
    onClick: () => void;
  }) => ReactNode;

  // ===== Mentions =====

  /**
   * Available mentions.
   */
  mentions?: Mention[];

  /**
   * Async function to fetch mentions.
   */
  fetchMentions?: (query: string) => Promise<Mention[]>;

  /**
   * Callback when a mention is selected.
   */
  onMention?: (mention: Mention) => void;

  /**
   * Custom renderer for mention suggestions.
   */
  renderMentionItem?: (props: {
    mention: Mention;
    isSelected: boolean;
    onClick: () => void;
  }) => ReactNode;
}

export interface RichTextInputRef {
  /**
   * Focus the editor.
   */
  focus: () => void;

  /**
   * Get the current plain text content.
   */
  getText: () => string;

  /**
   * Get the current HTML content.
   */
  getHTML: () => string;

  /**
   * Set the content.
   */
  setContent: (content: string) => void;

  /**
   * Clear the editor.
   */
  clear: () => void;

  /**
   * Get the Tiptap editor instance.
   */
  getEditor: () => Editor | null;
}
