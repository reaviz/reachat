import { FC, Fragment, useContext, useMemo } from 'react';
import { SessionListItem } from './SessionListItem';
import { List, ListItem, Button, cn, Divider } from 'reablocks';
import { groupSessionsByDate } from './utils';
import { SessionsContext } from './SessionsContext';

interface SessionsListProps {
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
  newSessionText = 'New Session',
  onSelectSession,
  onDeleteSession,
  onCreateNewSession
}) => {
  const { theme, activeSessionId, sessions } = useContext(SessionsContext);
  const groups = useMemo(() => groupSessionsByDate(sessions), [sessions]);

  return (
    <List className={cn(theme.sessions.base)}>
      <ListItem disableGutters disablePadding>
        <Button
          fullWidth
          disableMargins
          color="primary"
          className={cn(theme.sessions.create)}
          onClick={onCreateNewSession}
        >
          {newSessionText}
        </Button>
      </ListItem>
      <Divider />
      {Object.keys(groups).map(k => (
        <Fragment key={k}>
          <ListItem disableGutters disablePadding className={cn(theme.sessions.group)}>
            {k}
          </ListItem>
          {groups[k].map(s => (
            <SessionListItem
              key={s.id}
              session={s}
              theme={theme}
              isActive={s.id === activeSessionId}
              onSelectSession={onSelectSession}
              onDeleteSession={onDeleteSession}
            />
          ))}
        </Fragment>
      ))}
    </List>
  );
};
