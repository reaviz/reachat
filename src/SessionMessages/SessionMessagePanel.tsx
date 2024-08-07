import { FC, PropsWithChildren, useContext } from 'react';
import { Button, cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { motion } from 'framer-motion';
import BackIcon from '@/assets/back.svg?react';

export const SessionMessagePanel: FC<PropsWithChildren> = ({ children }) => {
  const { activeSessionId, theme, isCompact, selectSession, viewType } =
    useContext(ChatContext);
  const isVisible = isCompact && activeSessionId;

  return (
    (!isCompact || isVisible) && (
      <motion.div
        initial={{ translateX: '200%' }}
        animate={{
          translateX: '0%',
          transition: {
            type: 'tween',
            ease: 'linear',
            duration: 0.2,
            when: 'beforeChildren'
          }
        }}
        exit={{ translateX: '200%' }}
        className={cn(theme.messages.base, {
          [theme.messages.companion]: isCompact,
          [theme.messages.console]: !isCompact
        })}
      >
        <div className={cn(theme.messages.inner)}>
          {(isCompact && viewType !== 'chat') && (
            <Button
              variant="text"
              size="small"
              onClick={() => selectSession(null)}
              className={cn(theme.messages.back)}
            >
              <BackIcon />
              Back
            </Button>
          )}
          {children}
        </div>
      </motion.div>
    )
  );
};
