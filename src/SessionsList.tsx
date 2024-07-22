import { FC } from 'react';
import { SessionListItem } from './SessionListItem';
import { Session } from './types';

interface SessionsListProps {
  sessions: Session[];
  activeSessionId?: string;
  onSelectSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onCreateNewSession?: () => void;
}

export const SessionsList: FC<SessionsListProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onCreateNewSession
}) => {
  return (
    <div className="sessions-list">
      <button
        className="w-full mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        onClick={onCreateNewSession}
      >
        Create New Session
      </button>
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
