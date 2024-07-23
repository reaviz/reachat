import { FC } from 'react';
import { SessionListItem } from './SessionListItem';
import { Session } from './types';
import { List, ListItem, Button } from 'reablocks';

interface SessionsListProps {
  sessions: Session[];
  activeSessionId?: string;
  className?: string;
  onSelectSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onCreateNewSession?: () => void;
}

export const SessionsList: FC<SessionsListProps> = ({
  sessions,
  className,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onCreateNewSession
}) => {
  return (
    <List className={className}>
      <ListItem>
        <Button
          fullWidth
          className="mb-4 px-4 py-2"
          onClick={onCreateNewSession}
        >
          Create New Session
        </Button>
      </ListItem>
      {sessions?.map((session) => (
        <SessionListItem
          key={session.id}
          session={session}
          isActive={session.id === activeSessionId}
          onSelectSession={onSelectSession}
          onDeleteSession={onDeleteSession}
        />
      ))}
    </List>
  );
};
