import { FC, ReactNode, useContext, useMemo } from 'react';
import { GroupedSessions, groupSessionsByDate } from '@/utils';
import { SessionsContext } from '@/SessionsContext';


export interface SessionGroupsProps {
  children: (groups: GroupedSessions[]) => ReactNode;
}

export const SessionGroups: FC<SessionGroupsProps> = ({ children }) => {
  const { sessions } = useContext(SessionsContext);
  const groups = useMemo(() => groupSessionsByDate(sessions), [sessions]);
  return children(groups);
};
