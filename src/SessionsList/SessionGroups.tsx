import { FC, ReactNode, useContext, useMemo } from 'react';
import { GroupedSessions, groupSessionsByDate } from '@/utils/grouping';
import { ChatContext } from '@/ChatContext';
import { SessionsGroup } from './SessionsGroup';
import { SessionListItem } from './SessionListItem';

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
            <SessionsGroup heading={heading}>
              {sessions.map(session => (
                <SessionListItem key={session.id} session={session} />
              ))}
            </SessionsGroup>
          ))}
    </>
  );
};
