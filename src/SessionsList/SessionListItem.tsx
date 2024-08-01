import { FC, PropsWithChildren, ReactElement, useContext } from 'react';
import { ListItem, IconButton, cn, Ellipsis } from 'reablocks';
import { Session } from '@/types';
import TrashIcon from '@/assets/trash.svg?react';
import ChatIcon from '@/assets/chat.svg?react';
import { ChatContext } from '@/ChatContext';
import { Slot } from '@radix-ui/react-slot';

export interface SessionListItemProps extends PropsWithChildren {
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

  /**
   * Icon to show for chat.
   */
  chatIcon?: ReactElement;

  /**
   * Limit for the ellipsis.
   */
  limit?: number;
}

export const SessionListItem: FC<SessionListItemProps> = ({
  children,
  session,
  deletable = true,
  limit = 100,
  deleteIcon = <TrashIcon />,
  chatIcon = <ChatIcon className="mr-1" />
}) => {
  const { activeSessionId, selectSession, deleteSession, theme } =
    useContext(ChatContext);
  const Comp = children ? Slot : ListItem;

  return (
    <Comp
      dense
      disableGutters
      active={session.id === activeSessionId}
      className={cn(theme.sessions.session.base, {
        [theme.sessions.session.active]: session.id === activeSessionId
      })}
      onClick={() => selectSession?.(session.id)}
      start={chatIcon}
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
      {children || <Ellipsis value={session.title} limit={limit} />}
    </Comp>
  );
};
