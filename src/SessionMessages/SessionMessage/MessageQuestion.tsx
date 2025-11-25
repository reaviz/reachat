import { ChatContext } from '@/ChatContext';
import { Slot } from '@radix-ui/react-slot';
import { Button, cn } from 'reablocks';
import { memo, PropsWithChildren, useContext, useState } from 'react';
import { Markdown } from '@/Markdown';
import { Plugin } from 'unified';
import { MessageFiles } from './MessageFiles';
import { ConversationFile } from '@/types';

export interface MessageQuestionProps extends PropsWithChildren {
  /**
   * Question to render.
   */
  question: string;

  /**
   * Array of sources referenced in the conversation
   */
  files?: ConversationFile[];
}

export const MessageQuestion = memo<MessageQuestionProps>(
  ({ children, ...props }) => {
    const { theme, remarkPlugins } = useContext(ChatContext);
    const { question, files } = props;
    const Comp = children ? Slot : 'div';
    const [expanded, setExpanded] = useState(false);
    const isLong = question.length > 500;

    return (
      <Comp
        className={cn(theme.messages.message.question, {
          [theme.messages.message.overlay]: isLong && !expanded
        })}
        {...props}
      >
        {children || (
          <>
            <MessageFiles files={files} />
            <Markdown remarkPlugins={remarkPlugins as Plugin[]} theme={theme}>
              {question}
            </Markdown>
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

MessageQuestion.displayName = 'MessageQuestion';
