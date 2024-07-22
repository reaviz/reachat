import { FC } from 'react';
import { SessionListItem } from './SessionListItem';
import { Session } from './types';

interface SessionsListProps {
  sessions: Session[];
  activeSessionId?: string;
  onSelectSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
}

export const SessionsList: FC<SessionsListProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession
}) => {
  return (
    <div>
      {sessions.map((session) => (
        <SessionListItem
          key={session.id}
          session={session}
          isActive={session.id === activeSessionId}
          onSelectSession={onSelectSession}
          onDeleteSession={onDeleteSession}
        />
      ))}
    </div>
  );
};