import { FC } from 'react';
import { motion } from 'motion/react';
import { cn } from 'reablocks';
import SpinnerIcon from '@/assets/spinner.svg?react';
import CheckIcon from '@/assets/check.svg?react';
import ErrorIcon from '@/assets/error.svg?react';
import { MessageStatusState } from './MessageStatus';

export interface StatusIconProps {
  /**
   * Current state of the status icon.
   */
  state: MessageStatusState;

  /**
   * Additional CSS class name for the icon container.
   */
  className?: string;

  /**
   * CSS class name for the icon color based on state.
   */
  colorClassName?: string;
}

export const StatusIcon: FC<StatusIconProps> = ({
  state,
  className,
  colorClassName
}) => {
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
