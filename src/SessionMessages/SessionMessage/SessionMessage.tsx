import { FC, PropsWithChildren, useContext } from 'react';
import { ChatContext } from '@/ChatContext';
import { Card, cn, Divider } from 'reablocks';
import { Conversation } from '@/types';
import { motion } from 'framer-motion';
import { MessageQuestion } from './MessageQuestion';
import { MessageResponse } from './MessageResponse';
import { MessageSources } from './MessageSources';
import { MessageActions } from './MessageActions';
import { MessageResponseRecommended } from './MessageResponseRecommended';

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
   * Conversation to render.
   */
  conversation: Conversation;

  /**
   * Whether the message is the last one in the list.
   * This let's the chat know when to show the loading cursor.
   */
  isLast?: boolean;
}

export const SessionMessage: FC<SessionMessageProps> = ({
  conversation,
  isLast,
  children
}) => {
  const { theme, isLoading } = useContext(ChatContext);
  const hasFollowUpResponse = !!conversation.followUpResponse;

  return (
    <motion.div key={conversation.id} variants={messageVariants}>
      <Card className={cn(theme.messages.message.base)}>
        {children || (
          <>
            <MessageQuestion
              question={conversation.question}
              files={conversation.files}
            />

            {hasFollowUpResponse ? (
              <MessageResponseRecommended
                response={conversation.response}
                followUpResponse={conversation.followUpResponse}
                isLoading={isLast && isLoading}
              />
            ) : (
              <MessageResponse
                response={conversation.response}
                isLoading={isLast && isLoading}
              />
            )}

            <MessageSources sources={conversation.sources} />
            <MessageActions
              question={conversation.question}
              response={conversation.response}
            />
          </>
        )}
      </Card>
      {!isLast && <Divider />}
    </motion.div>
  );
};
