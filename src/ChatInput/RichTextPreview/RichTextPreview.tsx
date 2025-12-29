import { FC, useMemo, useContext, Fragment, ReactNode } from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { RichTextPreviewProps, RichTextFormatConfig } from './types';

const DEFAULT_CONFIG: RichTextFormatConfig = {
  bold: true,
  italic: true,
  inlineCode: true,
  codeBlock: true,
  unorderedList: true,
  orderedList: true,
  blockquote: true,
  strikethrough: true,
  links: true
};

interface ParsedToken {
  type:
    | 'text'
    | 'bold'
    | 'italic'
    | 'inlineCode'
    | 'codeBlock'
    | 'unorderedListItem'
    | 'orderedListItem'
    | 'blockquote'
    | 'strikethrough'
    | 'link';
  content: string;
  url?: string;
  language?: string;
  index?: number;
}

/**
 * Parses text and returns tokens for rendering.
 */
const parseText = (
  text: string,
  config: RichTextFormatConfig
): ParsedToken[] => {
  const tokens: ParsedToken[] = [];
  const lines = text.split('\n');

  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLanguage = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (config.codeBlock && line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLanguage = line.slice(3).trim();
        codeBlockContent = '';
      } else {
        tokens.push({
          type: 'codeBlock',
          content: codeBlockContent.trim(),
          language: codeBlockLanguage
        });
        inCodeBlock = false;
        codeBlockContent = '';
        codeBlockLanguage = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += (codeBlockContent ? '\n' : '') + line;
      continue;
    }

    // Handle blockquotes
    if (config.blockquote && line.startsWith('> ')) {
      tokens.push({
        type: 'blockquote',
        content: line.slice(2)
      });
      continue;
    }

    // Handle unordered lists
    if (config.unorderedList && /^[-*+]\s+/.test(line)) {
      tokens.push({
        type: 'unorderedListItem',
        content: line.replace(/^[-*+]\s+/, ''),
        index: i
      });
      continue;
    }

    // Handle ordered lists
    if (config.orderedList && /^\d+\.\s+/.test(line)) {
      const match = line.match(/^(\d+)\.\s+(.*)$/);
      if (match) {
        tokens.push({
          type: 'orderedListItem',
          content: match[2],
          index: parseInt(match[1], 10)
        });
        continue;
      }
    }

    // Parse inline formatting
    const inlineTokens = parseInlineFormatting(line, config);
    tokens.push(...inlineTokens);

    // Add newline token if not last line
    if (i < lines.length - 1) {
      tokens.push({ type: 'text', content: '\n' });
    }
  }

  return tokens;
};

/**
 * Parses inline formatting within a line.
 */
const parseInlineFormatting = (
  text: string,
  config: RichTextFormatConfig
): ParsedToken[] => {
  const tokens: ParsedToken[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    let matched = false;

    // Bold (**text** or __text__)
    if (config.bold) {
      const boldMatch = remaining.match(/^(\*\*|__)(.*?)\1/);
      if (boldMatch) {
        tokens.push({ type: 'bold', content: boldMatch[2] });
        remaining = remaining.slice(boldMatch[0].length);
        matched = true;
        continue;
      }
    }

    // Strikethrough (~~text~~)
    if (config.strikethrough) {
      const strikeMatch = remaining.match(/^~~(.*?)~~/);
      if (strikeMatch) {
        tokens.push({ type: 'strikethrough', content: strikeMatch[1] });
        remaining = remaining.slice(strikeMatch[0].length);
        matched = true;
        continue;
      }
    }

    // Italic (*text* or _text_) - single char, not double
    if (config.italic) {
      const italicMatch = remaining.match(/^(\*|_)(?!\1)(.*?)\1(?!\1)/);
      if (italicMatch) {
        tokens.push({ type: 'italic', content: italicMatch[2] });
        remaining = remaining.slice(italicMatch[0].length);
        matched = true;
        continue;
      }
    }

    // Inline code (`code`)
    if (config.inlineCode) {
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if (codeMatch) {
        tokens.push({ type: 'inlineCode', content: codeMatch[1] });
        remaining = remaining.slice(codeMatch[0].length);
        matched = true;
        continue;
      }
    }

    // Links ([text](url))
    if (config.links) {
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch) {
        tokens.push({
          type: 'link',
          content: linkMatch[1],
          url: linkMatch[2]
        });
        remaining = remaining.slice(linkMatch[0].length);
        matched = true;
        continue;
      }
    }

    // No match - consume one character as text
    if (!matched) {
      // Find next potential formatting start
      const nextSpecial = remaining
        .slice(1)
        .search(/[\*_`~\[]|^[-*+]\s|^\d+\./);
      if (nextSpecial === -1) {
        tokens.push({ type: 'text', content: remaining });
        remaining = '';
      } else {
        tokens.push({
          type: 'text',
          content: remaining.slice(0, nextSpecial + 1)
        });
        remaining = remaining.slice(nextSpecial + 1);
      }
    }
  }

  return tokens;
};

/**
 * RichTextPreview renders a preview of formatted text
 * as the user types in the input.
 */
export const RichTextPreview: FC<RichTextPreviewProps> = ({
  text,
  formatConfig,
  showPreview = true,
  className,
  customRenderers
}) => {
  const { theme } = useContext(ChatContext);
  const config = { ...DEFAULT_CONFIG, ...formatConfig };

  const tokens = useMemo(() => parseText(text, config), [text, config]);

  const previewTheme = theme?.input?.richTextPreview;

  if (!showPreview || !text) {
    return null;
  }

  const renderToken = (token: ParsedToken, index: number): ReactNode => {
    switch (token.type) {
      case 'bold':
        if (customRenderers?.bold) {
          return (
            <Fragment key={index}>
              {customRenderers.bold(token.content)}
            </Fragment>
          );
        }
        return (
          <strong key={index} className={cn('font-bold', previewTheme?.bold)}>
            {token.content}
          </strong>
        );

      case 'italic':
        if (customRenderers?.italic) {
          return (
            <Fragment key={index}>
              {customRenderers.italic(token.content)}
            </Fragment>
          );
        }
        return (
          <em key={index} className={cn('italic', previewTheme?.italic)}>
            {token.content}
          </em>
        );

      case 'strikethrough':
        if (customRenderers?.strikethrough) {
          return (
            <Fragment key={index}>
              {customRenderers.strikethrough(token.content)}
            </Fragment>
          );
        }
        return (
          <del
            key={index}
            className={cn('line-through', previewTheme?.strikethrough)}
          >
            {token.content}
          </del>
        );

      case 'inlineCode':
        if (customRenderers?.inlineCode) {
          return (
            <Fragment key={index}>
              {customRenderers.inlineCode(token.content)}
            </Fragment>
          );
        }
        return (
          <code
            key={index}
            className={cn(
              'px-1.5 py-0.5 rounded font-mono text-sm',
              'bg-gray-100 dark:bg-gray-800',
              'text-pink-500 dark:text-pink-400',
              previewTheme?.inlineCode
            )}
          >
            {token.content}
          </code>
        );

      case 'codeBlock':
        if (customRenderers?.codeBlock) {
          return (
            <Fragment key={index}>
              {customRenderers.codeBlock(token.content, token.language)}
            </Fragment>
          );
        }
        return (
          <pre
            key={index}
            className={cn(
              'p-3 rounded-lg font-mono text-sm overflow-x-auto my-2',
              'bg-gray-100 dark:bg-gray-800',
              previewTheme?.codeBlock
            )}
          >
            <code>{token.content}</code>
          </pre>
        );

      case 'unorderedListItem':
        if (customRenderers?.listItem) {
          return (
            <Fragment key={index}>
              {customRenderers.listItem(token.content, token.index || 0, false)}
            </Fragment>
          );
        }
        return (
          <div
            key={index}
            className={cn(
              'flex items-start gap-2 pl-2',
              previewTheme?.list?.item
            )}
          >
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span>{token.content}</span>
          </div>
        );

      case 'orderedListItem':
        if (customRenderers?.listItem) {
          return (
            <Fragment key={index}>
              {customRenderers.listItem(token.content, token.index || 0, true)}
            </Fragment>
          );
        }
        return (
          <div
            key={index}
            className={cn(
              'flex items-start gap-2 pl-2',
              previewTheme?.list?.item
            )}
          >
            <span className="text-gray-400 dark:text-gray-500 min-w-[1.5rem]">
              {token.index}.
            </span>
            <span>{token.content}</span>
          </div>
        );

      case 'blockquote':
        if (customRenderers?.blockquote) {
          return (
            <Fragment key={index}>
              {customRenderers.blockquote(token.content)}
            </Fragment>
          );
        }
        return (
          <blockquote
            key={index}
            className={cn(
              'border-l-4 pl-3 my-1',
              'border-gray-300 dark:border-gray-600',
              'text-gray-600 dark:text-gray-300 italic',
              previewTheme?.blockquote
            )}
          >
            {token.content}
          </blockquote>
        );

      case 'link':
        if (customRenderers?.link) {
          return (
            <Fragment key={index}>
              {customRenderers.link(token.content, token.url || '')}
            </Fragment>
          );
        }
        return (
          <span
            key={index}
            className={cn(
              'text-blue-500 dark:text-blue-400 underline cursor-pointer',
              previewTheme?.link
            )}
            title={token.url}
          >
            {token.content}
          </span>
        );

      case 'text':
      default:
        return <Fragment key={index}>{token.content}</Fragment>;
    }
  };

  return (
    <div
      className={cn(
        'whitespace-pre-wrap break-words',
        previewTheme?.container,
        className
      )}
    >
      {tokens.map((token, index) => renderToken(token, index))}
    </div>
  );
};
