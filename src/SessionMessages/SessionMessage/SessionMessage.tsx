import { memo, PropsWithChildren, useContext, useMemo } from 'react';
import { ChatContext } from '@/ChatContext';
import { Card, cn } from 'reablocks';
import { Message } from '@/types';
import { motion } from 'motion/react';
import { MessageContent } from './MessageContent';
import { MessageSources } from './MessageSources';
import { MessageActions } from './MessageActions';
import { MessageAuthorBadge } from './MessageAuthorBadge';

const messageVariants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

interface SessionMessageProps extends PropsWithChildren {
  /**
   * Class name to apply to the root element.
   */
  className?: string;

  /**
   * Message to render.
   */
  message: Message;

  /**
   * Whether the message is the last one in the list.
   * This let's the chat know when to show the loading cursor.
   */
  isLast?: boolean;

  /**
   * Whether to render the author header when `message.author` is set.
   * @default true
   */
  showAuthor?: boolean;
}

export const SessionMessage = memo<SessionMessageProps>(
  ({ message, isLast, children, className, showAuthor = true }) => {
    const { theme, isLoading } = useContext(ChatContext);
    const { base, user, assistant, system, tool } = theme.messages.message;

    // Custom roles fall back to the assistant presentation.
    const roleClassName = useMemo(() => {
      const roles: Record<string, string> = { user, assistant, system, tool };
      return roles[message.role] ?? assistant;
    }, [message.role, user, assistant, system, tool]);

    const isUser = message.role === 'user';

    // Custom roles (eg. named agents) behave like the assistant: they get
    // the actions footer and the streaming cursor. system/tool do not.
    const isAssistantLike =
      message.role !== 'user' &&
      message.role !== 'system' &&
      message.role !== 'tool';

    return (
      <motion.div key={message.id} variants={messageVariants}>
        <Card className={cn(base, className)}>
          {children || (
            <>
              {showAuthor && message.author && (
                <MessageAuthorBadge author={message.author} />
              )}
              {isUser ? (
                <MessageContent
                  content={message.content}
                  className={roleClassName}
                  files={message.files}
                  expandable
                />
              ) : (
                <>
                  <MessageContent
                    content={message.content}
                    className={roleClassName}
                    isLoading={isAssistantLike && isLast && isLoading}
                  />
                  {isAssistantLike && (
                    <MessageSources sources={message.sources} />
                  )}
                  {isAssistantLike && <MessageActions message={message} />}
                </>
              )}
            </>
          )}
        </Card>
      </motion.div>
    );
  }
);

SessionMessage.displayName = 'SessionMessage';
