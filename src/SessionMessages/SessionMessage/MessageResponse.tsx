import { memo, PropsWithChildren, useContext } from 'react';
import { ChatContext } from '@/ChatContext';
import { MessageContent } from './MessageContent';

export interface MessageResponseProps extends PropsWithChildren {
  /**
   * Response to render.
   */
  response: string;

  /**
   * Whether the response is loading.
   */
  isLoading?: boolean;
}

/**
 * @deprecated Use `SessionMessage` with a `role: 'assistant'` message instead.
 */
export const MessageResponse = memo<MessageResponseProps>(
  ({ response, isLoading, children }) => {
    const { theme } = useContext(ChatContext);

    return (
      <MessageContent
        content={response}
        className={theme.messages.message.assistant}
        isLoading={isLoading}
      >
        {children}
      </MessageContent>
    );
  }
);

MessageResponse.displayName = 'MessageResponse';
