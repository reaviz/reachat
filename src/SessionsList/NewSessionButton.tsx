import { Button, cn } from 'reablocks';
import { FC, PropsWithChildren, ReactNode, useContext } from 'react';
import { SessionsContext } from '@/SessionsContext';
import { Slot } from '@radix-ui/react-slot';

interface NewSessionButtonProps extends PropsWithChildren {
  /**
   * Text for the new session button.
   */
  newSessionText?: string | ReactNode;
}

export const NewSessionButton: FC<NewSessionButtonProps> = ({
  children,
  newSessionText = 'New Session'
}) => {
  const { theme, createSession } = useContext(SessionsContext);
  const Comp = children ? Slot : Button;

  return (
    <Comp
      fullWidth
      disableMargins
      color="primary"
      className={cn(theme.sessions.create)}
      onClick={createSession}
    >
      {children || newSessionText}
    </Comp>
  );
};
