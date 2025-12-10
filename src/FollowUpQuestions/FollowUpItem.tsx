import { FC, ReactElement, useContext } from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { FollowUp } from '@/types';

export interface FollowUpItemProps extends FollowUp {
  /**
   * Icon to display next to the question.
   */
  icon?: ReactElement;

  /**
   * Callback when the follow-up question is clicked.
   */
  onClick?: (question: string) => void;
}

export const FollowUpItem: FC<FollowUpItemProps> = ({
  question,
  icon,
  onClick
}) => {
  const { theme, setInputValue, disabled, isLoading } = useContext(ChatContext);

  const handleClick = () => {
    if (disabled || isLoading) return;

    setInputValue?.(question);
    onClick?.(question);
  };

  return (
    <button
      type="button"
      className={cn(theme.followUpQuestions.item.base, {
        'opacity-50 cursor-not-allowed': disabled || isLoading
      })}
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {icon && (
        <span className={cn(theme.followUpQuestions.item.icon)}>{icon}</span>
      )}
      <span className={cn(theme.followUpQuestions.item.text)}>{question}</span>
    </button>
  );
};
