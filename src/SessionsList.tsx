import { FC } from 'react';
import { SessionListItem } from './SessionListItem';
import { Session } from './types';
import { List, ListItem, Button, cn } from 'reablocks';
import { ChatTheme } from './theme';

interface SessionsListProps {
  /**
   * Sessions to display.
   */
  sessions: Session[];

  /**
   * ID of the currently active session.
   */
  activeSessionId?: string;

  /**
   * Additional class name to apply to the list.
   */
  className?: string;

  /**
   * Theme to use for the sessions list.
   */
  theme?: ChatTheme;

  /**
   * Text to show for the new session button.
   */
  newSessionText?: string;

  /**
   * Callback function to handle session selection, receives the session ID
   */
  onSelectSession?: (sessionId: string) => void;

  /**
   * Callback function to handle session deletion, receives the session ID
   */
  onDeleteSession?: (sessionId: string) => void;

  /**
   * Callback function to handle creating a new session.
   */
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
  onCreateNewSession
}) => {
  return (
    <List className={cn(theme.sessions.base, className)}>
      <ListItem disableGutters disablePadding>
        <Button
          fullWidth
          disableMargins
          className={cn(theme.sessions.create)}
          onClick={onCreateNewSession}
        >
          {newSessionText}
        </Button>
      </ListItem>
      {sessions?.map((session) => (
        <SessionListItem
          key={session.id}
          session={session}
          theme={theme}
          isActive={session.id === activeSessionId}
          onSelectSession={onSelectSession}
          onDeleteSession={onDeleteSession}
        />
      ))}
    </List>
  );
};
