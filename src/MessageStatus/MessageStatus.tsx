import { FC, PropsWithChildren, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, useComponentTheme } from 'reablocks';
import { Slot } from '@radix-ui/react-slot';
import SpinnerIcon from '@/assets/spinner.svg?react';
import CheckIcon from '@/assets/check.svg?react';
import ErrorIcon from '@/assets/error.svg?react';

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

export interface MessageStatusTheme {
  /**
   * Base container styles.
   */
  base: string;

  /**
   * Header row styles (icon + text).
   */
  header: string;

  /**
   * Icon container styles.
   */
  icon: {
    base: string;
    loading: string;
    complete: string;
    error: string;
  };

  /**
   * Text styles.
   */
  text: {
    base: string;
    loading: string;
    complete: string;
    error: string;
  };

  /**
   * Steps container styles.
   */
  steps: {
    base: string;
    step: {
      base: string;
      icon: string;
      text: string;
      loading: string;
      complete: string;
      error: string;
    };
  };
}

export const messageStatusTheme: MessageStatusTheme = {
  base: 'py-2',
  header: 'flex items-center gap-2',
  icon: {
    base: 'flex-shrink-0 w-4 h-4',
    loading: 'text-blue-500 dark:text-blue-400',
    complete: 'text-green-500 dark:text-green-400',
    error: 'text-red-500 dark:text-red-400'
  },
  text: {
    base: 'text-sm',
    loading: 'text-gray-600 dark:text-gray-400',
    complete: 'text-gray-600 dark:text-gray-400',
    error: 'text-red-600 dark:text-red-400'
  },
  steps: {
    base: 'mt-1 ml-6 space-y-0.5',
    step: {
      base: 'flex items-center gap-2',
      icon: 'flex-shrink-0 w-3.5 h-3.5',
      text: 'text-sm',
      loading: 'text-gray-500 dark:text-gray-500',
      complete: 'text-gray-500 dark:text-gray-500',
      error: 'text-red-500 dark:text-red-400'
    }
  }
};

/**
 * Renders a status icon based on the state.
 */
const StatusIcon: FC<{
  state: MessageStatusState;
  className?: string;
  colorClassName?: string;
}> = ({ state, className, colorClassName }) => {
  switch (state) {
    case 'loading':
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={cn(className, colorClassName)}
        >
          <SpinnerIcon className="w-full h-full" />
        </motion.div>
      );
    case 'complete':
      return (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className={cn(className, colorClassName)}
        >
          <CheckIcon className="w-full h-full" />
        </motion.div>
      );
    case 'error':
      return (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className={cn(className, colorClassName)}
        >
          <ErrorIcon className="w-full h-full" />
        </motion.div>
      );
  }
};

export interface MessageStatusItemProps {
  /**
   * The step data to display.
   */
  step: MessageStatusStep;

  /**
   * Theme for the step item.
   */
  theme?: MessageStatusTheme['steps']['step'];
}

/**
 * Individual step item within a MessageStatus.
 */
export const MessageStatusItem: FC<MessageStatusItemProps> = ({
  step,
  theme: stepTheme
}) => {
  const defaultStepTheme = messageStatusTheme.steps.step;
  const theme = stepTheme || defaultStepTheme;
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
   * Custom theme overrides.
   */
  theme?: MessageStatusTheme;

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
  theme: customTheme = messageStatusTheme,
  className,
  children
}) => {
  const theme = useComponentTheme<MessageStatusTheme>(
    'messageStatus',
    customTheme
  );

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
                    <MessageStatusItem
                      key={step.id}
                      step={step}
                      theme={theme.steps.step}
                    />
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
