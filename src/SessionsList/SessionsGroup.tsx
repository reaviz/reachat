import { FC, PropsWithChildren, ReactNode, useContext } from 'react';
import { ChatContext } from '@/ChatContext';
import { ListItem, cn } from 'reablocks';

interface SessionsGroupProps extends PropsWithChildren {
  /**
   * Heading for the session group.
   */
  heading?: string | ReactNode;
}

export const SessionsGroup: FC<SessionsGroupProps> = ({
  heading,
  children
}) => {
  const { theme } = useContext(ChatContext);
  return (
    <>
      {heading && (
        <ListItem
          disableGutters
          disablePadding
          className={cn(theme.sessions.group)}
        >
          {heading}
        </ListItem>
      )}
      {children}
    </>
  );
};
