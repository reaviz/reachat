import { FC, PropsWithChildren, useContext } from 'react';
import { List, cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { motion } from 'framer-motion';

export const SessionsList: FC<PropsWithChildren> = ({ children }) => {
  const { theme, isCompact, activeSessionId } = useContext(ChatContext);
  const isVisible = isCompact && !activeSessionId;

  return (
    (!isCompact || isVisible) && (
      <motion.div
        initial={{ translateX: '-100%' }}
        animate={{
          translateX: '0%',
          transition: {
            type: 'tween',
            ease: 'linear',
            duration: 0.2,
            when: 'beforeChildren'
          }
        }}
        exit={{ translateX: '-100%' }}
        className={cn(theme.sessions.base, {
          [theme.sessions.companion]: isCompact,
          [theme.sessions.console]: !isCompact
        })}
      >
        <List>{children}</List>
      </motion.div>
    )
  );
};
