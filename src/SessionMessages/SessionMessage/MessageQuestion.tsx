import { memo, PropsWithChildren, useContext } from 'react';
import { ChatContext } from '@/ChatContext';
import { ConversationFile } from '@/types';
import { MessageContent } from './MessageContent';

export interface MessageQuestionProps extends PropsWithChildren {
  /**
   * Question to render.
   */
  question: string;

  /**
   * Array of files attached to the question.
   */
  files?: ConversationFile[];
}

/**
 * @deprecated Use `SessionMessage` with a `role: 'user'` message instead.
 */
export const MessageQuestion = memo<MessageQuestionProps>(
  ({ question, files, children }) => {
    const { theme } = useContext(ChatContext);

    return (
      <MessageContent
        content={question}
        className={theme.messages.message.user}
        files={files}
        expandable
      >
        {children}
      </MessageContent>
    );
  }
);

MessageQuestion.displayName = 'MessageQuestion';
