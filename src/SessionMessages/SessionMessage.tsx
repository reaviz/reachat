import { FC, ReactElement, useContext } from 'react';
import { SessionsContext } from '@/SessionsContext';
import { Card, IconButton, cn } from 'reablocks';
import remarkGfm from 'remark-gfm';
import CopyIcon from '@/assets/copy.svg?react';
import ThumbsDownIcon from '@/assets/thumbs-down.svg?react';
import ThumbUpIcon from '@/assets/thumbs-up.svg?react';
import RefreshIcon from '@/assets/refresh.svg?react';
import { PluggableList } from 'react-markdown/lib';
import { Markdown } from '@/Markdown';
import remarkYoutube from 'remark-youtube';
import { Conversation } from '@/types';
import { MessageSource } from './MessageSource';

export interface SessionMessageProps extends Conversation {
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
}

export const SessionMessage: FC<SessionMessageProps> = ({
  question = '',
  response = '',
  copyIcon = <CopyIcon />,
  thumbsUpIcon = <ThumbUpIcon />,
  thumbsDownIcon = <ThumbsDownIcon />,
  refreshIcon = <RefreshIcon />,
  sources,
  onUpvote,
  onDownvote,
  onRefresh
}) => {
  const { theme, remarkPlugins = [remarkGfm, remarkYoutube] } = useContext(SessionsContext);

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
    <Card className={cn(theme.messages.message.base)}>
      <div className={cn(theme.messages.message.question)}>
        <Markdown remarkPlugins={remarkPlugins as PluggableList[]}>
          {question}
        </Markdown>
      </div>
      <div className={cn(theme.messages.message.response)}>
        <Markdown remarkPlugins={remarkPlugins as PluggableList[]}>
          {response}
        </Markdown>
      </div>
      {sources && sources.length > 0 && (
        <figure className={cn(theme.messages.message.sources.base)}>
          {sources.map((source, index) => (
            <MessageSource key={index} {...source} />
          ))}
        </figure>
      )}
      {(copyIcon || thumbsDownIcon || thumbsUpIcon || refreshIcon) && (
        <div className={cn(theme.messages.message.footer.base)}>
          {copyIcon && (
            <IconButton
              variant="text"
              disablePadding
              title="Copy question and response"
              className={cn(theme.messages.message.footer.copy)}
              onClick={() => handleCopy(`${question}\n${response}`)}
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
        </div>
      )}
    </Card>
  );
};
