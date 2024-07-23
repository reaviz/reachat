import { FC, ReactElement } from 'react';
import { ListItem, IconButton, cn } from 'reablocks';
import { Session } from './types';
import TrashIcon from '@/assets/trash.svg?react';
import { ChatTheme } from './theme';

interface SessionListItemProps {
  /**
   * Theme to use for the session list item.
   */
  theme?: ChatTheme;

  /**
   * Session to display.
   */
  session: Session;

  /**
   * Indicates whether this session is currently active
   */
  isActive: boolean;

  /**
   * Icon to show for delete.
   */
  deleteIcon?: ReactElement;

  /**
   * Callback function to handle session selection, receives the session ID
   */
  onSelectSession?: (sessionId: string) => void;

  /**
   * Callback function to handle session deletion, receives the session ID
   */
  onDeleteSession?: (sessionId: string) => void;
}

export const SessionListItem: FC<SessionListItemProps> = ({
  session,
  isActive,
  theme,
  onSelectSession,
  onDeleteSession,
  deleteIcon = <TrashIcon className={cn(theme.sessions.session.delete)} />
}) => (
  <ListItem
    disableGutters
    active={isActive}
    className={cn(theme.sessions.session.base)}
    onClick={() => onSelectSession?.(session.id)}
    end={
      <>
        {onDeleteSession && (
          <IconButton
            size="small"
            variant="text"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSession(session.id);
            }}
          >
            {deleteIcon}
          </IconButton>
        )}
      </>
    }
  >
    {session.title}
  </ListItem>
);
