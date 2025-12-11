import { FC, PropsWithChildren, ReactNode, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from 'reablocks';
import { Slot } from '@radix-ui/react-slot';
import { ChatContext } from '@/ChatContext';
import { StatusIcon } from './StatusIcon';
import { MessageStatusItem } from './MessageStatusItem';

export type MessageStatusState = 'loading' | 'complete' | 'error';

export interface MessageStatusStep {
  /**
   * Unique identifier for the step.
   */
  id: string;

  /**
   * Text to display for the step.
   */
  text: string;

  /**
   * Current state of the step.
   * @default 'loading'
   */
  status?: MessageStatusState;
}

export interface MessageStatusProps extends PropsWithChildren {
  /**
   * Current status state.
   * @default 'loading'
   */
  status?: MessageStatusState;

  /**
   * Main status text to display.
   */
  text: string;

  /**
   * Optional sub-steps to display.
   */
  steps?: MessageStatusStep[];

  /**
   * Custom icon to display. If not provided, uses default icons based on status.
   */
  icon?: ReactNode;

  /**
   * Additional CSS class name.
   */
  className?: string;
}

/**
 * Displays status information with optional sub-steps, similar to Claude's tool status UI.
 */
export const MessageStatus: FC<MessageStatusProps> = ({
  status = 'loading',
  text,
  steps,
  icon,
  className,
  children
}) => {
  const { theme: chatTheme } = useContext(ChatContext);
  const theme = chatTheme.status;
  const Comp = children ? Slot : 'div';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Comp className={cn(theme.base, className)}>
          {children || (
            <>
              <div className={theme.header}>
                {icon || (
                  <StatusIcon
                    state={status}
                    className={theme.icon.base}
                    colorClassName={theme.icon[status]}
                  />
                )}
                <span
                  className={cn(
                    theme.text.base,
                    status === 'loading' && theme.text.loading,
                    status === 'complete' && theme.text.complete,
                    status === 'error' && theme.text.error
                  )}
                >
                  {text}
                </span>
              </div>
              {steps && steps.length > 0 && (
                <div className={theme.steps.base}>
                  {steps.map(step => (
                    <MessageStatusItem key={step.id} step={step} />
                  ))}
                </div>
              )}
            </>
          )}
        </Comp>
      </motion.div>
    </AnimatePresence>
  );
};
