import { memo, useContext } from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { MessageAuthor } from '@/types';

export interface MessageAuthorBadgeProps {
  /**
   * Author to render.
   */
  author: MessageAuthor;

  /**
   * Class name to apply to the root element.
   */
  className?: string;
}

/**
 * Renders the avatar and display name of a message's author. Shown by
 * `SessionMessage` above the message body whenever `message.author` is
 * set, so multiple people or agents in one session can be told apart.
 */
export const MessageAuthorBadge = memo<MessageAuthorBadgeProps>(
  ({ author, className }) => {
    const { theme } = useContext(ChatContext);
    const authorTheme = theme.messages.message.author;

    return (
      <div className={cn(authorTheme.base, className)}>
        {author.avatar && (
          <span className={cn(authorTheme.avatar)} aria-hidden="true">
            {typeof author.avatar === 'string' ? (
              <img src={author.avatar} alt="" />
            ) : (
              author.avatar
            )}
          </span>
        )}
        <span className={cn(authorTheme.name)}>{author.name}</span>
      </div>
    );
  }
);

MessageAuthorBadge.displayName = 'MessageAuthorBadge';
