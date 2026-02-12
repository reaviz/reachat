import { ChatContext } from '@/ChatContext';
import { ConversationSource } from '@/types';
import { cn } from 'reablocks';
import { memo, PropsWithChildren, useContext } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { MessageSource } from './MessageSource';

interface MessageSourcesProps extends PropsWithChildren {
  /**
   * Sources to render.
   */
  sources: ConversationSource[];
}

export const MessageSources = memo<MessageSourcesProps>(
  ({ sources, children }) => {
    const { theme } = useContext(ChatContext);
    const Comp = children ? Slot : MessageSource;

    if (!sources || sources.length === 0) {
      return null;
    }

    return (
      <div className={cn(theme.messages.message.sources.base)}>
        {sources.map((source, index) => (
          <Comp key={index} {...source}>
            {children}
          </Comp>
        ))}
      </div>
    );
  }
);

MessageSources.displayName = 'MessageSources';
