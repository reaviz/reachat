import { ReactElement, ReactNode } from 'react';

/**
 * Base interface for all suggestion items (mentions, commands, etc.)
 */
export interface SuggestionItem {
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
 * Configuration for a mention (@) item
 */
export interface MentionItem extends SuggestionItem {
  /**
   * The value to insert when mention is selected
   * Defaults to @{label} if not specified
   */
  value?: string;
}

/**
 * Configuration for a slash command (/) item
 */
export interface SlashCommandItem extends SuggestionItem {
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
 * Configuration for a suggestion trigger (mentions, commands, or custom)
 */
export interface SuggestionConfig<T extends SuggestionItem = SuggestionItem> {
  /**
   * The character that triggers this suggestion (e.g., '@', '/', '#')
   */
  trigger?: string;

  /**
   * Static list of available items for this trigger
   */
  items?: T[];

  /**
   * Async function to fetch items dynamically based on query
   */
  onSearch?: (query: string) => Promise<T[]> | T[];

  /**
   * Callback when an item is selected
   */
  onSelect?: (item: T, insertText: (text: string) => void) => void;

  /**
   * Maximum items to show in the popup (default: 10)
   */
  maxResults?: number;

  /**
   * Custom render function for items
   */
  renderItem?: (item: T, isHighlighted: boolean) => ReactNode;

  /**
   * Custom render function for empty state
   */
  renderEmpty?: (query: string) => ReactNode;
}

/**
 * Configuration for mentions
 * @deprecated Use SuggestionConfig directly with trigger: '@'
 */
export type MentionPluginConfig = SuggestionConfig<MentionItem>;

/**
 * Configuration for slash commands
 * @deprecated Use SuggestionConfig directly with trigger: '/'
 */
export type SlashCommandPluginConfig = SuggestionConfig<SlashCommandItem>;

/**
 * @deprecated Use SuggestionItem instead
 */
export type InputPluginItem = SuggestionItem;

/**
 * @deprecated Use SuggestionConfig instead
 */
export type InputTrigger<T extends SuggestionItem = SuggestionItem> =
  SuggestionConfig<T>;
