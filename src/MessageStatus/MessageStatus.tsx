import { FC, PropsWithChildren, ReactNode, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from 'reablocks';
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
  theme?: Partial<MessageStatusTheme>;

  /**
   * Additional CSS class name.
   */
  className?: string;
}

export const MessageStatus: FC<MessageStatusProps> = ({
  status = 'loading',
  text,
  steps,
  icon,
  theme: customTheme,
  className,
  children
}) => {
  const theme = useMemo(
    () => ({
      ...messageStatusTheme,
      ...customTheme,
      icon: { ...messageStatusTheme.icon, ...customTheme?.icon },
      text: { ...messageStatusTheme.text, ...customTheme?.text },
      steps: {
        ...messageStatusTheme.steps,
        ...customTheme?.steps,
        step: { ...messageStatusTheme.steps.step, ...customTheme?.steps?.step }
      }
    }),
    [customTheme]
  );

  const Comp = children ? Slot : 'div';

  const renderIcon = (
    state: MessageStatusState,
    size: 'normal' | 'small' = 'normal'
  ) => {
    const iconClass =
      size === 'small' ? theme.steps.step.icon : theme.icon.base;
    const stateClasses =
      size === 'small'
        ? {
            loading: theme.steps.step.loading,
            complete: theme.steps.step.complete,
            error: theme.steps.step.error
          }
        : {
            loading: theme.icon.loading,
            complete: theme.icon.complete,
            error: theme.icon.error
          };

    switch (state) {
      case 'loading':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={cn(iconClass, stateClasses.loading)}
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
            className={cn(iconClass, stateClasses.complete)}
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
            className={cn(iconClass, stateClasses.error)}
          >
            <ErrorIcon className="w-full h-full" />
          </motion.div>
        );
    }
  };

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
                {icon || renderIcon(status)}
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
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={theme.steps.step.base}
                    >
                      {renderIcon(step.status || 'loading', 'small')}
                      <span
                        className={cn(
                          theme.steps.step.text,
                          (step.status || 'loading') === 'loading' &&
                            theme.steps.step.loading,
                          step.status === 'complete' &&
                            theme.steps.step.complete,
                          step.status === 'error' && theme.steps.step.error
                        )}
                      >
                        {step.text}
                      </span>
                    </motion.div>
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
