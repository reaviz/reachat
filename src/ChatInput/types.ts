import { ReactElement, ReactNode } from 'react';

/**
 * Base interface for all input plugin items (mentions, commands, etc.)
 */
export interface InputPluginItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Display name/label for the item
   */
  label: string;

  /**
   * Optional description for additional context
   */
  description?: string;

  /**
   * Optional icon to display next to the item
   */
  icon?: ReactElement;

  /**
   * Optional metadata for custom use cases
   */
  metadata?: Record<string, unknown>;
}

/**
 * Configuration for a mention (@) trigger
 */
export interface MentionItem extends InputPluginItem {
  /**
   * The value to insert when mention is selected
   * Defaults to @{label} if not specified
   */
  value?: string;
}

/**
 * Configuration for a slash command (/) trigger
 */
export interface SlashCommandItem extends InputPluginItem {
  /**
   * The action to perform when command is selected
   */
  onSelect?: (item: SlashCommandItem) => void;

  /**
   * Optional shortcut hint to display
   */
  shortcut?: string;

  /**
   * Whether this command inserts text or triggers an action
   */
  type?: 'insert' | 'action';

  /**
   * The value to insert when command is selected (for 'insert' type)
   */
  value?: string;
}

/**
 * Generic trigger configuration for custom plugins
 */
export interface InputTrigger<T extends InputPluginItem = InputPluginItem> {
  /**
   * The character that triggers this plugin (e.g., '@', '/', '#')
   */
  trigger: string;

  /**
   * List of available items for this trigger
   */
  items: T[];

  /**
   * Optional async function to fetch items dynamically
   */
  onSearch?: (query: string) => Promise<T[]> | T[];

  /**
   * Callback when an item is selected
   */
  onSelect?: (item: T, insertText: (text: string) => void) => void;

  /**
   * Whether to allow free-form text that doesn't match any item
   */
  allowFreeform?: boolean;

  /**
   * Minimum characters before showing suggestions (default: 0)
   */
  minQueryLength?: number;

  /**
   * Maximum items to show in the popup (default: 10)
   */
  maxResults?: number;

  /**
   * Custom render function for items
   */
  renderItem?: (item: T, isHighlighted: boolean) => ReactNode;

  /**
   * Custom render function for the popup header
   */
  renderHeader?: () => ReactNode;

  /**
   * Custom render function for empty state
   */
  renderEmpty?: (query: string) => ReactNode;
}

/**
 * Configuration for mentions
 */
export interface MentionPluginConfig extends Omit<
  InputTrigger<MentionItem>,
  'trigger'
> {
  /**
   * Custom trigger character (default: '@')
   */
  trigger?: string;
}

/**
 * Configuration for slash commands
 */
export interface SlashCommandPluginConfig extends Omit<
  InputTrigger<SlashCommandItem>,
  'trigger'
> {
  /**
   * Custom trigger character (default: '/')
   */
  trigger?: string;
}

/**
 * Text formatting options for keyboard shortcuts
 */
export interface FormattingOptions {
  /**
   * Enable bold formatting (Ctrl/Cmd + B)
   */
  bold?: boolean;

  /**
   * Enable italic formatting (Ctrl/Cmd + I)
   */
  italic?: boolean;

  /**
   * Enable strikethrough formatting
   */
  strikethrough?: boolean;

  /**
   * Enable inline code formatting (Ctrl/Cmd + `)
   */
  code?: boolean;
}
