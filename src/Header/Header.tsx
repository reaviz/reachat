import { ReactNode, FC, useContext } from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '../ChatContext';

interface HeaderProps {
  /**
   * Content to display in the left section of the header
   */
  contentLeft?: ReactNode;

  /**
   * Content to display in the center section of the header
   */
  contentCenter?: ReactNode;

  /**
   * Content to display in the right section of the header
   */
  contentRight?: ReactNode;
}

export const Header: FC<HeaderProps> = ({
  contentLeft,
  contentCenter,
  contentRight
}) => {
  const { theme } = useContext(ChatContext);

  return (
    <div className={cn(theme.header.base)}>
      <div className="flex items-center justify-between w-full">
        <div className="flex-shrink-0">{contentLeft}</div>
        <div className="flex-grow flex justify-center items-center">
          {contentCenter}
        </div>
        <div className="flex-shrink-0">{contentRight}</div>
      </div>
    </div>
  );
};
