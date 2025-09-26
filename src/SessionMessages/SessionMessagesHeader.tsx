import { Slot } from '@radix-ui/react-slot';
import { cn, DateFormat, Ellipsis } from 'reablocks';
import type { FC, PropsWithChildren } from 'react';
import { useContext } from 'react';

import { ChatContext } from '@/ChatContext';

export const SessionMessagesHeader: FC<PropsWithChildren> = ({ children }) => {
  const { activeSession, theme } = useContext(ChatContext);
  const Comp = children ? Slot : 'header';

  if (!activeSession) {
    return null;
  }

  return (
    <Comp className={cn(theme.messages.header)}>
      {children || (
        <>
          <h2 className={cn(theme.messages.title)}>
            <Ellipsis limit={125} value={activeSession.title} />
          </h2>
          <DateFormat
            className={cn(theme.messages.date)}
            date={activeSession.createdAt}
          />
        </>
      )}
    </Comp>
  );
};
