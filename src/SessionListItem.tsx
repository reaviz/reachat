import { FC } from 'react';
import { ListItem, Button } from 'reablocks';
import { Session } from './types';

interface SessionListItemProps {
  session: Session;
  isActive: boolean;
  onSelectSession?: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
}

export const SessionListItem: FC<SessionListItemProps> = ({
  session,
  isActive,
  onSelectSession,
  onDeleteSession
}) => (
  <ListItem
    disableGutters
    active={isActive}
    className="mb-4"
    onClick={() => onSelectSession && onSelectSession(session.id)}
    end={
      <>
        {onDeleteSession && (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSession(session.id);
            }}
          >
            Delete
          </Button>
        )}
      </>
    }
  >
    {session.title}
  </ListItem>
);
