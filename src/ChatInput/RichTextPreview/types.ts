import { ReactNode } from 'react';

/**
 * Configuration for rich text formatting.
 */
export interface RichTextFormatConfig {
  /**
   * Enable bold formatting (**text** or __text__).
   * @default true
   */
  bold?: boolean;

  /**
   * Enable italic formatting (*text* or _text_).
   * @default true
   */
  italic?: boolean;

  /**
   * Enable inline code formatting (`code`).
   * @default true
   */
  inlineCode?: boolean;

  /**
   * Enable code block formatting (```code```).
   * @default true
   */
  codeBlock?: boolean;

  /**
   * Enable unordered list formatting (- item or * item).
   * @default true
   */
  unorderedList?: boolean;

  /**
   * Enable ordered list formatting (1. item).
   * @default true
   */
  orderedList?: boolean;

  /**
   * Enable blockquote formatting (> quote).
   * @default true
   */
  blockquote?: boolean;

  /**
   * Enable strikethrough formatting (~~text~~).
   * @default true
   */
  strikethrough?: boolean;

  /**
   * Enable link formatting ([text](url)).
   * @default true
   */
  links?: boolean;
}

/**
 * Props for the RichTextPreview component.
 */
export interface RichTextPreviewProps {
  /**
   * The raw text to preview with formatting.
   */
  text: string;

  /**
   * Configuration for which formatting options to enable.
   */
  formatConfig?: RichTextFormatConfig;

  /**
   * Whether to show the preview.
   * @default true
   */
  showPreview?: boolean;

  /**
   * Custom class name for the preview container.
   */
  className?: string;

  /**
   * Custom renderer for specific format types.
   */
  customRenderers?: {
    bold?: (text: string) => ReactNode;
    italic?: (text: string) => ReactNode;
    inlineCode?: (text: string) => ReactNode;
    codeBlock?: (code: string, language?: string) => ReactNode;
    listItem?: (text: string, index: number, isOrdered: boolean) => ReactNode;
    blockquote?: (text: string) => ReactNode;
    strikethrough?: (text: string) => ReactNode;
    link?: (text: string, url: string) => ReactNode;
  };
}

/**
 * Theme configuration for rich text preview.
 */
export interface RichTextPreviewTheme {
  /**
   * Container styles.
   */
  container: string;

  /**
   * Bold text styles.
   */
  bold: string;

  /**
   * Italic text styles.
   */
  italic: string;

  /**
   * Inline code styles.
   */
  inlineCode: string;

  /**
   * Code block styles.
   */
  codeBlock: string;

  /**
   * List styles.
   */
  list: {
    container: string;
    item: string;
  };

  /**
   * Blockquote styles.
   */
  blockquote: string;

  /**
   * Strikethrough styles.
   */
  strikethrough: string;

  /**
   * Link styles.
   */
  link: string;
}
