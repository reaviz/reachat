import { FC, useContext } from 'react';
import { ConversationSource } from '@/types';
import { SessionsContext } from '@/SessionsContext';
import { Ellipsis, cn } from 'reablocks';

interface MessageSourceProps extends ConversationSource {
  limit?: number;
}

export const MessageSource: FC<MessageSourceProps> = ({ title, url, image, limit = 50 }) => {
  const { theme } = useContext(SessionsContext);

  return (
    <div
      className={cn(theme.messages.message.sources.source.base)}
      onClick={() => {
        window.open(url, '_blank');
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
    </div>
  );
};
