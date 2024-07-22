import { FC } from 'react';
import { ResponseTransformer } from './types';

interface SessionMessageProps {
  question: string;
  response: string;
  responseTransformers?: ResponseTransformer[];
}

export const SessionMessage: FC<SessionMessageProps> = ({
  question,
  response,
  responseTransformers = []
}) => {
  const transformResponse = (response: string): string => {
    const applyTransformers = (index: number, response: string): string => {
      if (index >= responseTransformers.length) return response;
      const transformer = responseTransformers[index];
      return transformer(response, (transformedResponse) => applyTransformers(index + 1, transformedResponse));
    };
    return applyTransformers(0, response);
  };

  return (
    <div className="conversation mb-2">
      <p className="question font-semibold">{question}</p>
      <p className="response text-gray-700">{transformResponse(response)}</p>
    </div>
  );
};