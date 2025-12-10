import {
  FC,
  ReactElement,
  useContext,
  cloneElement,
  isValidElement
} from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { Suggestion } from '@/types';
import { ChatSuggestion } from './ChatSuggestion';

export interface ChatSuggestionsProps {
  /**
   * Array of suggestions to display.
   */
  suggestions: Suggestion[];

  /**
   * Custom class name to apply to the container.
   */
  className?: string;

  /**
   * Callback when a suggestion is clicked.
   */
  onSuggestionClick?: (suggestion: string) => void;

  /**
   * Custom render function for each suggestion item.
   * Receives the suggestion data and onClick handler.
   */
  children?: ReactElement;
}

export const ChatSuggestions: FC<ChatSuggestionsProps> = ({
  suggestions,
  className,
  onSuggestionClick,
  children
}) => {
  const { theme } = useContext(ChatContext);

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className={cn(theme.suggestions.base, className)}>
      {suggestions.map(suggestion => {
        if (children && isValidElement(children)) {
          return cloneElement(children as ReactElement<any>, {
            key: suggestion.id,
            ...suggestion,
            onClick: onSuggestionClick
          });
        }

        return (
          <ChatSuggestion
            key={suggestion.id}
            {...suggestion}
            onClick={onSuggestionClick}
          />
        );
      })}
    </div>
  );
};
