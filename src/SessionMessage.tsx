import { FC, useContext } from 'react';
import { ResponseTransformer } from './types';
import ReactMarkdown from 'react-markdown';
import { SessionsContext } from './SessionsContext';
import { cn } from 'reablocks';

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
}

export const SessionMessage: FC<SessionMessageProps> = ({
  question,
  response,
  responseTransformers = []
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
    </div>
  );
};
