import { FC, ReactElement, useContext } from 'react';
import { Button, cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { Suggestion } from '@/types';

export interface ChatSuggestionProps extends Suggestion {
  /**
   * Icon to display next to the suggestion.
   */
  icon?: ReactElement;

  /**
   * Callback when the suggestion is clicked.
   */
  onClick?: (suggestion: string) => void;
}

export const ChatSuggestion: FC<ChatSuggestionProps> = ({
  content,
  icon,
  onClick
}) => {
  const { theme, setInputValue, disabled, isLoading } = useContext(ChatContext);

  const handleClick = () => {
    if (disabled || isLoading) return;

    setInputValue?.(content);
    onClick?.(content);
  };

  return (
    <Button
      type="button"
      variant="outline"
      disableMargins
      startAdornment={icon}
      className={cn(theme.chatSuggestions.item.base, {
        'opacity-50 cursor-not-allowed': disabled || isLoading
      })}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      <span className={cn(theme.chatSuggestions.item.text)}>{content}</span>
    </Button>
  );
};
