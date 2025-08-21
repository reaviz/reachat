import { FC, useContext, useEffect, useState } from 'react';
import { cn } from 'reablocks';
import { motion, AnimatePresence } from 'motion/react';
import { SlashCommand } from './types';
import { ChatContext } from '@/ChatContext';

export interface CommandIndicatorProps {
  command: SlashCommand | null;
  onDismiss: () => void;
  autoHideDelay?: number;
}

export const CommandIndicator: FC<CommandIndicatorProps> = ({
  command,
  onDismiss,
  autoHideDelay = 3000
}) => {
  const { theme } = useContext(ChatContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (command) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 200); // Wait for animation to complete
      }, autoHideDelay);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [command, autoHideDelay, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && command && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(theme.input.commands?.indicator)}
        >
          <div className="flex items-center gap-2">
            {'icon' in command && command.icon && (
              <span className={cn(theme.input.commands?.indicatorIcon)}>
                {command.icon}
              </span>
            )}
            <span className={cn(theme.input.commands?.indicatorLabel)}>
              Command: /{command.label}
            </span>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onDismiss, 200);
              }}
              className={cn(theme.input.commands?.indicatorClose)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
