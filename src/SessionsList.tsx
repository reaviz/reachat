import { FC } from 'react';
import { SessionListItem } from './SessionListItem';
import { Session } from './types';
import { List, ListItem, Button, cn } from 'reablocks';
import { ChatTheme } from './theme';

interface SessionsListProps {
  sessions: Session[];
  activeSessionId?: string;
  className?: string;
  theme?: ChatTheme;
  newSessionText?: string;
  isLoading?: boolean;
  onSelectSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onCreateNewSession?: () => void;
}

export const SessionsList: FC<SessionsListProps> = ({
  sessions,
  theme,
  className,
  newSessionText = 'New Session',
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onCreateNewSession,
  isLoading
}) => {
  return (
    <List className={cn(theme.list.base, className)}>
      <ListItem disableGutters disablePadding>
        <Button
          fullWidth
          disableMargins
          className={cn(theme.list.create)}
          onClick={onCreateNewSession}
          disabled={isLoading}
        >
          {newSessionText}
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
