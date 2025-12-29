import { ReactElement, ReactNode } from 'react';

/**
 * Represents a slash command that can be executed from the chat input.
 */
export interface SlashCommand {
  /**
   * Unique identifier for the command.
   */
  id: string;

  /**
   * The command text (without the leading slash).
   * This is what users type to trigger the command.
   * @example 'help', 'clear', 'summarize'
   */
  command: string;

  /**
   * Display label for the command in the menu.
   */
  label: string;

  /**
   * Optional description shown in the menu.
   */
  description?: string;

  /**
   * Optional icon to display next to the command.
   */
  icon?: ReactElement;

  /**
   * Optional category for grouping commands.
   */
  category?: string;

  /**
   * Whether the command is disabled.
   */
  disabled?: boolean;

  /**
   * Optional keyboard shortcut hint to display.
   */
  shortcut?: string;
}

/**
 * Props for the SlashCommandMenu component.
 */
export interface SlashCommandMenuProps {
  /**
   * List of available slash commands.
   */
  commands: SlashCommand[];

  /**
   * Current filter text (text typed after the slash).
   */
  filter?: string;

  /**
   * Index of the currently highlighted item.
   */
  activeIndex?: number;

  /**
   * Callback when a command is selected.
   */
  onSelect?: (command: SlashCommand) => void;

  /**
   * Callback when the menu is closed without selection.
   */
  onClose?: () => void;

  /**
   * Custom renderer for command items.
   */
  renderCommand?: (command: SlashCommand, isActive: boolean) => ReactNode;

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
   * Whether to show command descriptions.
   * @default true
   */
  showDescriptions?: boolean;

  /**
   * Whether to group commands by category.
   * @default true
   */
  groupByCategory?: boolean;

  /**
   * Custom empty state content when no commands match.
   */
  emptyContent?: ReactNode;
}

/**
 * Theme configuration for slash command components.
 */
export interface SlashCommandTheme {
  /**
   * Container styles for the menu.
   */
  menu: string;

  /**
   * Styles for each command item.
   */
  item: {
    /**
     * Base styles for command items.
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
   * Styles for the command icon.
   */
  icon: string;

  /**
   * Styles for the command label.
   */
  label: string;

  /**
   * Styles for the command description.
   */
  description: string;

  /**
   * Styles for the keyboard shortcut hint.
   */
  shortcut: string;

  /**
   * Styles for category headers.
   */
  category: string;

  /**
   * Styles for the empty state.
   */
  empty: string;
}
