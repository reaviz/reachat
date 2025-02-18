import { FC, PropsWithChildren, useContext } from 'react';
import { List, cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { motion } from 'motion/react';
import { Template } from '@/types';
import { SessionListItem } from './SessionListItem';

export interface SessionsListProps extends PropsWithChildren {
  /**
   * Templates to show when no session is active
   */
  templates?: Template[];
}

export const SessionsList: FC<SessionsListProps> = ({
  children,
  templates
}) => {
  const { theme, isCompact, activeSessionId, createSession } =
    useContext(ChatContext);
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
        {templates && !activeSessionId && (
          <div className="mt-4">
            {templates.map(template => (
              <div key={template.id} onClick={() => createSession?.()}>
                <SessionListItem
                  session={{
                    id: template.id,
                    title: template.title,
                    conversations: []
                  }}
                  chatIcon={template.icon}
                  deletable={false}
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    )
  );
};
