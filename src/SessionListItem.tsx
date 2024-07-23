import { FC } from 'react';
import { ListItem, IconButton } from 'reablocks';
import { Session } from './types';
import TrashIcon from '@/assets/trash.svg?react';

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
          <IconButton
            size="small"
            variant="text"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteSession(session.id);
            }}
          >
            <TrashIcon className="w-4 h-4" />
          </IconButton>
        )}
      </>
    }
  >
    {session.title}
  </ListItem>
);
