import { FC, useContext } from 'react';
import { motion } from 'motion/react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { StatusIcon } from './StatusIcon';
import { MessageStatusStep } from './MessageStatus';

export interface MessageStatusItemProps {
  step: MessageStatusStep;
}

export const MessageStatusItem: FC<MessageStatusItemProps> = ({ step }) => {
  const { theme: chatTheme } = useContext(ChatContext);
  const theme = chatTheme.status.steps.step;
  const stepStatus = step.status || 'loading';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className={theme.base}
    >
      <StatusIcon
        state={stepStatus}
        className={theme.icon}
        colorClassName={theme[stepStatus]}
      />
      <span
        className={cn(
          theme.text,
          stepStatus === 'loading' && theme.loading,
          stepStatus === 'complete' && theme.complete,
          stepStatus === 'error' && theme.error
        )}
      >
        {step.text}
      </span>
    </motion.div>
  );
};
