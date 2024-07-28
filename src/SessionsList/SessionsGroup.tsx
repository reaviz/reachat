import { FC, PropsWithChildren, useContext } from 'react';
import { SessionsContext } from '@/SessionsContext';
import { ListItem, cn } from 'reablocks';

interface SessionsGroupProps extends PropsWithChildren {
  heading?: string;
}

export const SessionsGroup: FC<SessionsGroupProps> = ({
  heading,
  children
}) => {
  const { theme } = useContext(SessionsContext);
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
