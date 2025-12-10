import { FC, useContext } from 'react';
import { Button, cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { Suggestion } from '@/types';

export interface ChatSuggestionProps extends Suggestion {
  /**
   * Callback when the suggestion is clicked.
   */
  onClick?: (suggestion: string) => void;
}

export const ChatSuggestion: FC<ChatSuggestionProps> = ({
  content,
  onClick
}) => {
  const { theme, disabled, isLoading } = useContext(ChatContext);

  const handleClick = () => {
    if (disabled || isLoading) return;
    onClick?.(content);
  };

  return (
    <Button
      type="button"
      variant="outline"
      disableMargins
      className={cn(theme.suggestions.item.base, {
        'opacity-50 cursor-not-allowed': disabled || isLoading
      })}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      <span className={cn(theme.suggestions.item.text)}>{content}</span>
    </Button>
  );
};
