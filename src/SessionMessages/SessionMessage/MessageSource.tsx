import { FC, useContext } from 'react';
import { ConversationSource } from '@/types';
import { ChatContext } from '@/ChatContext';
import { Ellipsis, cn } from 'reablocks';

export interface MessageSourceProps extends ConversationSource {
  /**
   * Limit for the title.
   */
  limit?: number;
}

export const MessageSource: FC<MessageSourceProps> = ({ title, url, image, limit = 50 }) => {
  const { theme, isCompact } = useContext(ChatContext);

  return (
    <figure
      className={cn(theme.messages.message.sources.source.base, {
        [theme.messages.message.sources.source.companion]: isCompact
      })}
      onClick={() => {
        if (url) {
          window.open(url, '_blank');
        }
      }}
    >
      {image && <img src={image} alt={title} className={cn(theme.messages.message.sources.source.image)} />}
      {(title || url) && (
        <figcaption>
          {title && (
            <span className={cn(theme.messages.message.sources.source.title)}>
              <Ellipsis value={title} limit={limit} />
            </span>
          )}
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className={cn(theme.messages.message.sources.source.url)}>
              {url}
            </a>
          )}
        </figcaption>
      )}
    </figure>
  );
};
