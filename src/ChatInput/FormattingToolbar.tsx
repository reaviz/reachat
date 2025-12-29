import { FC, useContext, useMemo, useCallback, ReactElement } from 'react';
import { cn, IconButton, Tooltip } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { FormattingOptions } from './types';

// Import icons
import BoldIcon from '@/assets/bold.svg?react';
import ItalicIcon from '@/assets/italic.svg?react';
import StrikethroughIcon from '@/assets/strikethrough.svg?react';
import CodeIcon from '@/assets/code.svg?react';
import ListBulletIcon from '@/assets/list-bullet.svg?react';
import ListNumberedIcon from '@/assets/list-numbered.svg?react';
import QuoteIcon from '@/assets/quote.svg?react';
import CodeBlockIcon from '@/assets/code-block.svg?react';

/**
 * Formatting action types
 */
export type FormattingAction =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'code'
  | 'bulletList'
  | 'numberedList'
  | 'blockquote'
  | 'codeBlock';

/**
 * Default theme for the formatting toolbar
 */
const defaultToolbarTheme = {
  base: 'flex items-center gap-1 p-1 border-b border-gray-200 dark:border-gray-700',
  button:
    'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 [&>svg]:w-4 [&>svg]:h-4',
  buttonActive: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white',
  divider: 'w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1'
};

interface FormattingButton {
  action: FormattingAction;
  icon: ReactElement;
  label: string;
  shortcut?: string;
  enabled?: boolean;
}

interface FormattingToolbarProps {
  /**
   * Formatting options configuration
   */
  options: FormattingOptions;

  /**
   * Callback when a formatting action is triggered
   */
  onFormat: (action: FormattingAction) => void;

  /**
   * Currently active formats (for toggle state)
   */
  activeFormats?: FormattingAction[];

  /**
   * Whether the toolbar is disabled
   */
  disabled?: boolean;

  /**
   * Custom icons for formatting buttons
   */
  icons?: Partial<Record<FormattingAction, ReactElement>>;
}

/**
 * Get the markdown wrapper for a formatting action
 */
export function getMarkdownWrapper(action: FormattingAction): {
  prefix: string;
  suffix: string;
  blockLevel: boolean;
} {
  switch (action) {
    case 'bold':
      return { prefix: '**', suffix: '**', blockLevel: false };
    case 'italic':
      return { prefix: '_', suffix: '_', blockLevel: false };
    case 'strikethrough':
      return { prefix: '~~', suffix: '~~', blockLevel: false };
    case 'code':
      return { prefix: '`', suffix: '`', blockLevel: false };
    case 'bulletList':
      return { prefix: '- ', suffix: '', blockLevel: true };
    case 'numberedList':
      return { prefix: '1. ', suffix: '', blockLevel: true };
    case 'blockquote':
      return { prefix: '> ', suffix: '', blockLevel: true };
    case 'codeBlock':
      return { prefix: '```\n', suffix: '\n```', blockLevel: true };
    default:
      return { prefix: '', suffix: '', blockLevel: false };
  }
}

/**
 * Apply formatting to text
 */
export function applyFormatting(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  action: FormattingAction
): { newText: string; newSelectionStart: number; newSelectionEnd: number } {
  const { prefix, suffix, blockLevel } = getMarkdownWrapper(action);
  const beforeSelection = text.substring(0, selectionStart);
  const selectedText = text.substring(selectionStart, selectionEnd);
  const afterSelection = text.substring(selectionEnd);

  let newText: string;
  let newSelectionStart: number;
  let newSelectionEnd: number;

  if (blockLevel) {
    // For block-level formatting, handle line by line
    if (selectedText) {
      const lines = selectedText.split('\n');
      const formattedLines = lines.map(line => prefix + line);
      const formattedText = formattedLines.join('\n');
      newText = beforeSelection + formattedText + suffix + afterSelection;
      newSelectionStart = selectionStart;
      newSelectionEnd = selectionStart + formattedText.length + suffix.length;
    } else {
      // No selection, add on new line if needed
      const needsNewline =
        beforeSelection.length > 0 && !beforeSelection.endsWith('\n');
      const insertText = (needsNewline ? '\n' : '') + prefix;
      newText = beforeSelection + insertText + suffix + afterSelection;
      newSelectionStart = selectionStart + insertText.length;
      newSelectionEnd = newSelectionStart;
    }
  } else {
    // Inline formatting
    if (selectedText) {
      // Check if already formatted
      const alreadyFormatted =
        beforeSelection.endsWith(prefix) && afterSelection.startsWith(suffix);

      if (alreadyFormatted) {
        // Remove formatting
        newText =
          beforeSelection.substring(0, beforeSelection.length - prefix.length) +
          selectedText +
          afterSelection.substring(suffix.length);
        newSelectionStart = selectionStart - prefix.length;
        newSelectionEnd = newSelectionStart + selectedText.length;
      } else {
        // Add formatting
        newText =
          beforeSelection + prefix + selectedText + suffix + afterSelection;
        newSelectionStart = selectionStart + prefix.length;
        newSelectionEnd = newSelectionStart + selectedText.length;
      }
    } else {
      // No selection, insert formatting markers and place cursor between
      newText = beforeSelection + prefix + suffix + afterSelection;
      newSelectionStart = selectionStart + prefix.length;
      newSelectionEnd = newSelectionStart;
    }
  }

  return { newText, newSelectionStart, newSelectionEnd };
}

/**
 * FormattingToolbar component provides buttons for text formatting
 */
export const FormattingToolbar: FC<FormattingToolbarProps> = ({
  options,
  onFormat,
  activeFormats = [],
  disabled = false,
  icons = {}
}) => {
  const { theme } = useContext(ChatContext);

  // Get toolbar theme from context or use defaults
  const toolbarTheme = theme?.input?.toolbar || defaultToolbarTheme;

  // Build button configurations based on options
  const buttons = useMemo<FormattingButton[]>(() => {
    const result: FormattingButton[] = [];

    // Inline formatting group
    if (options.bold) {
      result.push({
        action: 'bold',
        icon: icons.bold || <BoldIcon />,
        label: 'Bold',
        shortcut: 'Ctrl+B',
        enabled: true
      });
    }
    if (options.italic) {
      result.push({
        action: 'italic',
        icon: icons.italic || <ItalicIcon />,
        label: 'Italic',
        shortcut: 'Ctrl+I',
        enabled: true
      });
    }
    if (options.strikethrough) {
      result.push({
        action: 'strikethrough',
        icon: icons.strikethrough || <StrikethroughIcon />,
        label: 'Strikethrough',
        enabled: true
      });
    }
    if (options.code) {
      result.push({
        action: 'code',
        icon: icons.code || <CodeIcon />,
        label: 'Inline Code',
        shortcut: 'Ctrl+`',
        enabled: true
      });
    }

    // Block formatting group
    if (options.bulletList) {
      result.push({
        action: 'bulletList',
        icon: icons.bulletList || <ListBulletIcon />,
        label: 'Bullet List',
        enabled: true
      });
    }
    if (options.numberedList) {
      result.push({
        action: 'numberedList',
        icon: icons.numberedList || <ListNumberedIcon />,
        label: 'Numbered List',
        enabled: true
      });
    }
    if (options.blockquote) {
      result.push({
        action: 'blockquote',
        icon: icons.blockquote || <QuoteIcon />,
        label: 'Quote',
        enabled: true
      });
    }
    if (options.codeBlock) {
      result.push({
        action: 'codeBlock',
        icon: icons.codeBlock || <CodeBlockIcon />,
        label: 'Code Block',
        enabled: true
      });
    }

    return result;
  }, [options, icons]);

  // Group buttons for visual separation
  const inlineButtons = buttons.filter(b =>
    ['bold', 'italic', 'strikethrough', 'code'].includes(b.action)
  );
  const blockButtons = buttons.filter(b =>
    ['bulletList', 'numberedList', 'blockquote', 'codeBlock'].includes(b.action)
  );

  const handleClick = useCallback(
    (action: FormattingAction) => {
      if (!disabled) {
        onFormat(action);
      }
    },
    [disabled, onFormat]
  );

  if (buttons.length === 0) {
    return null;
  }

  return (
    <div className={cn(toolbarTheme.base)}>
      {/* Inline formatting buttons */}
      {inlineButtons.map(button => (
        <Tooltip
          key={button.action}
          content={`${button.label}${button.shortcut ? ` (${button.shortcut})` : ''}`}
        >
          <IconButton
            className={cn(
              toolbarTheme.button,
              activeFormats.includes(button.action) && toolbarTheme.buttonActive
            )}
            onClick={() => handleClick(button.action)}
            disabled={disabled}
            variant="text"
            size="small"
          >
            {button.icon}
          </IconButton>
        </Tooltip>
      ))}

      {/* Divider between inline and block */}
      {inlineButtons.length > 0 && blockButtons.length > 0 && (
        <div className={cn(toolbarTheme.divider)} />
      )}

      {/* Block formatting buttons */}
      {blockButtons.map(button => (
        <Tooltip key={button.action} content={button.label}>
          <IconButton
            className={cn(
              toolbarTheme.button,
              activeFormats.includes(button.action) && toolbarTheme.buttonActive
            )}
            onClick={() => handleClick(button.action)}
            disabled={disabled}
            variant="text"
            size="small"
          >
            {button.icon}
          </IconButton>
        </Tooltip>
      ))}
    </div>
  );
};

export default FormattingToolbar;
