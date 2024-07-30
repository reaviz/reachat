import { SessionsContext } from '@/SessionsContext';
import { Slot } from '@radix-ui/react-slot';
import { cn, IconButton } from 'reablocks';
import {
  FC,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext
} from 'react';
import CopyIcon from '@/assets/copy.svg?react';
import ThumbsDownIcon from '@/assets/thumbs-down.svg?react';
import ThumbUpIcon from '@/assets/thumbs-up.svg?react';
import RefreshIcon from '@/assets/refresh.svg?react';

export interface MessageActionsProps extends PropsWithChildren {
  /**
   * Question to be copied
   */
  question: string;

  /**
   * Response to be copied
   */
  response?: string;

  /**
   * Icon to show for copy.
   */
  copyIcon?: ReactElement;

  /**
   * Icon to show for thumbs up.
   */
  thumbsUpIcon?: ReactElement;

  /**
   * Icon to show for thumbs down.
   */
  thumbsDownIcon?: ReactElement;

  /**
   * Icon to show for refresh.
   */
  refreshIcon?: ReactElement;

  /**
   * Callback function to handle copying.
   */
  onCopy?: () => void;

  /**
   * Callback function to handle upvoting.
   */
  onUpvote?: () => void;

  /**
   * Callback function to handle downvoting.
   */
  onDownvote?: () => void;

  /**
   * Callback function to handle refreshing.
   */
  onRefresh?: () => void;

  /**
   * Children to render as MessageAction slot.
   */
  children?: ReactNode;
}

export const MessageActions: FC<MessageActionsProps> = ({
  children,
  ...props
}) => {
  const { theme } = useContext(SessionsContext);
  const {
    question,
    response,
    copyIcon = <CopyIcon />,
    thumbsUpIcon = <ThumbUpIcon />,
    thumbsDownIcon = <ThumbsDownIcon />,
    refreshIcon = <RefreshIcon />,
    onCopy,
    onUpvote,
    onDownvote,
    onRefresh
  } = props;
  const Comp = children ? Slot : 'div';

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    (copyIcon || thumbsDownIcon || thumbsUpIcon || refreshIcon) && (
      <Comp className={cn(theme.messages.message.footer.base)}>
        {children || (
          <>
            {copyIcon && (
              <IconButton
                variant="text"
                disablePadding
                title="Copy question and response"
                className={cn(theme.messages.message.footer.copy)}
                onClick={
                  onCopy ? onCopy : () => handleCopy(`${question}\n${response}`)
                }
              >
                {copyIcon}
              </IconButton>
            )}
            {thumbsUpIcon && (
              <IconButton
                variant="text"
                disablePadding
                title="Upvote"
                className={cn(theme.messages.message.footer.upvote)}
                onClick={onUpvote}
              >
                {thumbsUpIcon}
              </IconButton>
            )}
            {thumbsDownIcon && (
              <IconButton
                variant="text"
                disablePadding
                title="Downvote"
                className={cn(theme.messages.message.footer.downvote)}
                onClick={onDownvote}
              >
                {thumbsDownIcon}
              </IconButton>
            )}
            {refreshIcon && (
              <IconButton
                variant="text"
                disablePadding
                title="Refresh"
                className={cn(theme.messages.message.footer.refresh)}
                onClick={onRefresh}
              >
                {refreshIcon}
              </IconButton>
            )}
          </>
        )}
      </Comp>
    )
  );
};
