import { motion } from 'motion/react';
import { Button, cn } from 'reablocks';
import type { FC, PropsWithChildren } from 'react';
import { useContext } from 'react';

import BackIcon from '@/assets/back.svg?react';
import { ChatContext } from '@/ChatContext';

interface SessionMessagePanelProps extends PropsWithChildren {
  allowBack?: boolean;
}

export const SessionMessagePanel: FC<SessionMessagePanelProps> = ({
  children,
  allowBack = true
}) => {
  const { activeSessionId, theme, isCompact, selectSession, viewType } =
    useContext(ChatContext);
  const isVisible =
    (isCompact && activeSessionId) || viewType === 'chat' || !isCompact;

  return (
    isVisible && (
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
          {allowBack && isCompact && viewType !== 'chat' && (
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
