import { FC, ReactElement, useContext } from 'react';
import { ResponseTransformer } from './types';
import ReactMarkdown from 'react-markdown';
import { SessionsContext } from './SessionsContext';
import { IconButton, cn } from 'reablocks';
import CopyIcon from '@/assets/copy.svg?react';

interface SessionMessageProps {
  /**
   * Question to display.
   */
  question: string;

  /**
   * Response to display.
   */
  response: string;

  /**
   * Response transformers to apply to the response.
   */
  responseTransformers?: ResponseTransformer[];

  /**
   * Icon to show for copy.
   */
  copyIcon?: ReactElement;
}

export const SessionMessage: FC<SessionMessageProps> = ({
  question,
  response,
  responseTransformers = [],
  copyIcon = <CopyIcon />
}) => {
  const { theme } = useContext(SessionsContext);

  const transformResponse = (response: string): string => {
    const applyTransformers = (index: number, response: string): string => {
      if (index >= responseTransformers.length) return response;
      const transformer = responseTransformers[index];
      return transformer(response, (transformedResponse) => applyTransformers(index + 1, transformedResponse));
    };
    return applyTransformers(0, response);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className={cn(theme.messages.message.base)}>
      <div className={cn(theme.messages.message.question)}>
        <ReactMarkdown>
          {transformResponse(question)}
        </ReactMarkdown>
      </div>
      <div className={cn(theme.messages.message.response)}>
        <ReactMarkdown>
          {transformResponse(response)}
        </ReactMarkdown>
      </div>
      <div className={cn(theme.messages.message.footer.base)}>
        <IconButton
          variant="text"
          disablePadding
          title="Copy question and response"
          className={cn(theme.messages.message.footer.copy)}
          onClick={() => handleCopy(`${question}\n${response}`)}
        >
          {copyIcon}
        </IconButton>
      </div>
    </div>
  );
};
