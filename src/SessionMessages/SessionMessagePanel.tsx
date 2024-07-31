import { FC, PropsWithChildren, useContext } from 'react';
import { Button, cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { motion } from 'framer-motion';

export const SessionMessagePanel: FC<PropsWithChildren> = ({ children }) => {
  const { activeSessionId, theme, isCompact, selectSession } =
    useContext(ChatContext);
  const isVisible = isCompact && activeSessionId;

  return (
    (!isCompact || isVisible) && (
      <motion.div
        initial={{ translateX: '200%' }}
        animate={{ translateX: '0%' }}
        exit={{ translateX: '200%' }}
        className={cn(theme.messages.base, {
          [theme.messages.companion]: isCompact,
          [theme.messages.console]: !isCompact
        })}
      >
        <div className={cn(theme.messages.inner)}>
          {isCompact && (
            <Button
              variant="text"
              size="small"
              onClick={() => selectSession(null)}
              className={cn(theme.messages.back)}
            >
              Back
            </Button>
          )}
          {children}
        </div>
      </motion.div>
    )
  );
};
