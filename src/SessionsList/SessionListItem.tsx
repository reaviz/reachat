import { FC, ReactElement, ReactNode, useContext } from 'react';
import { ListItem, IconButton, cn, Ellipsis } from 'reablocks';
import { Session } from '@/types';
import TrashIcon from '@/assets/trash.svg?react';
import { SessionsContext } from '@/SessionsContext';
import { Slot } from '@radix-ui/react-slot';

interface SessionListItemProps {
  children?: ReactNode;

  /**
   * Session to display.
   */
  session: Session;

  /**
   * Indicates whether the session is deletable.
   */
  deletable?: boolean;

  /**
   * Icon to show for delete.
   */
  deleteIcon?: ReactElement;
}

export const SessionListItem: FC<SessionListItemProps> = ({
  children,
  session,
  deletable = true,
  deleteIcon = <TrashIcon />
}) => {
  const { activeSessionId, selectSession, deleteSession, theme } =
    useContext(SessionsContext);
  const Comp = children ? Slot : ListItem;
  return (
    <Comp
      dense
      disableGutters
      active={session.id === activeSessionId}
      className={cn(theme.sessions.session.base)}
      onClick={() => selectSession?.(session.id)}
      end={
        <>
          {deletable && (
            <IconButton
              size="small"
              variant="text"
              onClick={e => {
                e.stopPropagation();
                deleteSession(session.id);
              }}
              className={cn(theme.sessions.session.delete)}
            >
              {deleteIcon}
            </IconButton>
          )}
        </>
      }
    >
      {children || <Ellipsis value={session.title} limit={100} />}
    </Comp>
  );
};
