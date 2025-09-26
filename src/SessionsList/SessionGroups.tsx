import type { FC, ReactNode } from 'react';
import { useContext, useMemo } from 'react';

import { ChatContext } from '@/ChatContext';
import type { GroupedSessions } from '@/utils/grouping';
import { groupSessionsByDate } from '@/utils/grouping';

import { SessionListItem } from './SessionListItem';
import { SessionsGroup } from './SessionsGroup';

export interface SessionGroupsProps {
  /**
   * Render function for the session groups.
   */
  children?: (groups: GroupedSessions[]) => ReactNode;
}

export const SessionGroups: FC<SessionGroupsProps> = ({ children }) => {
  const { sessions } = useContext(ChatContext);
  const groups = useMemo(() => groupSessionsByDate(sessions), [sessions]);

  return (
    <>
      {children
        ? children(groups)
        : groups.map(({ heading, sessions }) => (
            <SessionsGroup key={heading} heading={heading}>
              {sessions.map(session => (
                <SessionListItem key={session.id} session={session} />
              ))}
            </SessionsGroup>
          ))}
    </>
  );
};
