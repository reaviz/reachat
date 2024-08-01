import { Button, cn, Divider } from 'reablocks';
import { FC, PropsWithChildren, ReactNode, useContext } from 'react';
import { ChatContext } from '@/ChatContext';
import { Slot } from '@radix-ui/react-slot';

import PlusIcon from '@/assets/plus.svg?react';

interface NewSessionButtonProps extends PropsWithChildren {
  /**
   * Text for the new session button.
   */
  newSessionText?: string | ReactNode;

  /**
   * Divider to render between the new session button and SessionsGroup.
   */
  divider?: ReactNode;
}

export const NewSessionButton: FC<NewSessionButtonProps> = ({
  children,
  newSessionText = 'New Session',
  divider = <Divider variant="secondary" />
}) => {
  const { theme, createSession, disabled } = useContext(ChatContext);
  const Comp = children ? Slot : Button;

  return (
    <>
      <Comp
        fullWidth
        disableMargins
        color="primary"
        startAdornment={<PlusIcon />}
        className={cn(theme.sessions.create)}
        disabled={disabled}
        onClick={createSession}
      >
        {children || newSessionText}
      </Comp>
      {divider}
    </>
  );
};
