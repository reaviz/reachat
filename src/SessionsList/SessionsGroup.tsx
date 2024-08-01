import { FC, PropsWithChildren, ReactNode, useContext } from 'react';
import { ChatContext } from '@/ChatContext';
import { Divider, ListItem, cn } from 'reablocks';

interface SessionsGroupProps extends PropsWithChildren {
  /**
   * Heading for the session group.
   */
  heading?: string | ReactNode;

  /**
   * Divider to render between the children.
   */
  divider?: ReactNode;
}

export const SessionsGroup: FC<SessionsGroupProps> = ({
  heading,
  children,
  divider = <Divider variant="secondary" />
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
      {divider}
    </>
  );
};
