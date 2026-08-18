import { ChatContext } from '@/ChatContext';
import { Slot } from '@radix-ui/react-slot';
import { motion } from 'motion/react';
import { Button, cn } from 'reablocks';
import { memo, PropsWithChildren, useContext, useState } from 'react';
import { Markdown } from '@/Markdown';
import { Plugin } from 'unified';
import { ConversationFile } from '@/types';
import { MessageFiles } from './MessageFiles';

/**
 * Length after which the content is collapsed behind a "Show more" overlay.
 */
const LONG_CONTENT_LENGTH = 500;

export interface MessageContentProps extends PropsWithChildren {
  /**
   * Markdown content to render.
   */
  content: string;

  /**
   * Class name to apply to the root element, typically the role theme.
   */
  className?: string;

  /**
   * Files to render above the content.
   */
  files?: ConversationFile[];

  /**
   * Whether to render the blinking loading cursor after the content.
   */
  isLoading?: boolean;

  /**
   * Whether long content collapses behind a "Show more" overlay.
   */
  expandable?: boolean;
}

/**
 * Internal building block that renders the markdown body of a message
 * along with the optional files, loading cursor and expand overlay.
 */
export const MessageContent = memo<MessageContentProps>(
  ({ content, className, files, isLoading, expandable, children }) => {
    const { theme, isCompact, remarkPlugins, markdownComponents } =
      useContext(ChatContext);
    const [expanded, setExpanded] = useState<boolean>(false);
    const Comp = children ? Slot : 'div';
    const isLong = expandable && content?.length > LONG_CONTENT_LENGTH;

    return (
      <Comp
        data-compact={isCompact}
        className={cn(className, {
          [theme.messages.message.overlay]: isLong && !expanded
        })}
      >
        {children || (
          <>
            {files?.length > 0 && <MessageFiles files={files} />}
            <Markdown
              remarkPlugins={remarkPlugins as Plugin[]}
              theme={theme.messages.message.markdown}
              customComponents={markdownComponents}
            >
              {content}
            </Markdown>
            {isLoading && <MessageCursor />}
            {isLong && !expanded && (
              <Button
                variant="link"
                size="small"
                className={theme.messages.message.expand}
                onClick={() => setExpanded(true)}
              >
                Show more
              </Button>
            )}
          </>
        )}
      </Comp>
    );
  }
);

MessageContent.displayName = 'MessageContent';

/**
 * Internal blinking cursor shown while a message is streaming.
 */
export const MessageCursor = memo(() => {
  const { theme } = useContext(ChatContext);

  return (
    <motion.div
      className={cn(theme.messages.message.cursor)}
      animate={{ opacity: [1, 0] }}
      transition={{
        duration: 0.7,
        repeat: Infinity,
        repeatType: 'reverse'
      }}
    />
  );
});

MessageCursor.displayName = 'MessageCursor';
