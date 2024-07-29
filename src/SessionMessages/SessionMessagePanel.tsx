import { FC, PropsWithChildren, useContext } from 'react';
import { cn } from 'reablocks';
import { SessionsContext } from '@/SessionsContext';
import { SessionMessagesHeader } from './SessionMessagesHeader';
import { SessionMessages } from './SessionMessages';
import { SessionInput } from '@/SessionInput';

export const SessionMessagePanel: FC<PropsWithChildren> = ({ children }) => {
  const { theme } = useContext(SessionsContext);

  return (
    <div className={cn(theme.messages.base)}>
      <div className="flex-1 h-full flex flex-col">
        {children ?? (
          <>
            <SessionMessagesHeader />
            <SessionMessages />
            <SessionInput />
          </>
        )}
      </div>
    </div>
  );
};
