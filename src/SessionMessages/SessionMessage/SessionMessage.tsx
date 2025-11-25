import { memo, PropsWithChildren, useContext } from 'react';
import { ChatContext } from '@/ChatContext';
import { Card, cn } from 'reablocks';
import { Conversation } from '@/types';
import { motion } from 'motion/react';
import { MessageQuestion } from './MessageQuestion';
import { MessageResponse } from './MessageResponse';
import { MessageSources } from './MessageSources';
import { MessageActions } from './MessageActions';

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
   * Conversation to render.
   */
  conversation: Conversation;

  /**
   * Whether the message is the last one in the list.
   * This let's the chat know when to show the loading cursor.
   */
  isLast?: boolean;
}

export const SessionMessage = memo<SessionMessageProps>(
  ({ conversation, isLast, children, className }) => {
    const { theme, isLoading } = useContext(ChatContext);

    return (
      <motion.div key={conversation.id} variants={messageVariants}>
        <Card className={cn(theme.messages.message.base, className)}>
          {children || (
            <>
              <MessageQuestion
                question={conversation.question}
                files={conversation.files}
              />
              <MessageResponse
                response={conversation.response}
                isLoading={isLast && isLoading}
              />
              <MessageSources sources={conversation.sources} />
              <MessageActions
                question={conversation.question}
                response={conversation.response}
              />
            </>
          )}
        </Card>
      </motion.div>
    );
  }
);

SessionMessage.displayName = 'SessionMessage';
