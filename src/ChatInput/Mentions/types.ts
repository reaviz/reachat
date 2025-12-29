import { ReactElement, ReactNode } from 'react';

/**
 * Represents a mention option that can be selected from the menu.
 */
export interface Mention {
  /**
   * Unique identifier for the mention.
   */
  id: string;

  /**
   * Display name for the mention.
   */
  name: string;

  /**
   * Optional description or additional info.
   */
  description?: string;

  /**
   * Optional avatar or icon to display.
   */
  avatar?: ReactElement | string;

  /**
   * Optional category for grouping mentions.
   */
  category?: string;

  /**
   * Whether the mention is disabled.
   */
  disabled?: boolean;

  /**
   * Optional metadata associated with the mention.
   */
  metadata?: Record<string, unknown>;
}

/**
 * Configuration for a mention trigger.
 */
export interface MentionTrigger {
  /**
   * The character that triggers the mention menu.
   * @default '@'
   */
  trigger: string;

  /**
   * Data source for mentions - can be an array or an async function.
   */
  data: Mention[] | ((query: string) => Promise<Mention[]>);

  /**
   * Optional custom renderer for the final mention text.
   * @default (mention) => `${trigger}${mention.name}`
   */
  renderText?: (mention: Mention, trigger: string) => string;
}

/**
 * Props for the MentionsMenu component.
 */
export interface MentionsMenuProps {
  /**
   * List of available mentions.
   */
  mentions: Mention[];

  /**
   * Current filter text (text typed after the trigger).
   */
  filter?: string;

  /**
   * Index of the currently highlighted item.
   */
  activeIndex?: number;

  /**
   * Whether the menu is loading data.
   */
  isLoading?: boolean;

  /**
   * Callback when a mention is selected.
   */
  onSelect?: (mention: Mention) => void;

  /**
   * Callback when the menu is closed without selection.
   */
  onClose?: () => void;

  /**
   * Custom renderer for mention items.
   */
  renderMention?: (mention: Mention, isActive: boolean) => ReactNode;

  /**
   * Custom class name for the menu container.
   */
  className?: string;

  /**
   * Maximum height of the menu in pixels.
   * @default 300
   */
  maxHeight?: number;

  /**
   * Whether to group mentions by category.
   * @default false
   */
  groupByCategory?: boolean;

  /**
   * Custom empty state content when no mentions match.
   */
  emptyContent?: ReactNode;

  /**
   * Custom loading content.
   */
  loadingContent?: ReactNode;
}

/**
 * Theme configuration for mention components.
 */
export interface MentionTheme {
  /**
   * Container styles for the menu.
   */
  menu: string;

  /**
   * Styles for each mention item.
   */
  item: {
    /**
     * Base styles for mention items.
     */
    base: string;

    /**
     * Styles for the active/highlighted item.
     */
    active: string;

    /**
     * Styles for disabled items.
     */
    disabled: string;
  };

  /**
   * Styles for the mention avatar.
   */
  avatar: string;

  /**
   * Styles for the mention name.
   */
  name: string;

  /**
   * Styles for the mention description.
   */
  description: string;

  /**
   * Styles for category headers.
   */
  category: string;

  /**
   * Styles for the empty state.
   */
  empty: string;

  /**
   * Styles for the loading state.
   */
  loading: string;

  /**
   * Styles for inline mention tokens in the input.
   */
  token: string;
}
