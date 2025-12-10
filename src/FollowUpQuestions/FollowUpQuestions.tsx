import {
  FC,
  ReactElement,
  useContext,
  cloneElement,
  isValidElement
} from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '@/ChatContext';
import { FollowUp } from '@/types';
import { FollowUpItem } from './FollowUpItem';

export interface FollowUpQuestionsProps {
  /**
   * Array of follow-up questions to display.
   */
  questions: FollowUp[];

  /**
   * Icon to display for each question. Applied to all questions unless
   * custom children are provided.
   */
  icon?: ReactElement;

  /**
   * Custom class name to apply to the container.
   */
  className?: string;

  /**
   * Callback when a follow-up question is clicked.
   */
  onQuestionClick?: (question: string) => void;

  /**
   * Custom render function for each follow-up question item.
   * Receives the follow-up data and onClick handler.
   */
  children?: ReactElement;
}

export const FollowUpQuestions: FC<FollowUpQuestionsProps> = ({
  questions,
  icon,
  className,
  onQuestionClick,
  children
}) => {
  const { theme } = useContext(ChatContext);

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className={cn(theme.followUpQuestions.base, className)}>
      {questions.map(followUp => {
        if (children && isValidElement(children)) {
          return cloneElement(children as ReactElement<any>, {
            key: followUp.id,
            ...followUp,
            onClick: onQuestionClick
          });
        }

        return (
          <FollowUpItem
            key={followUp.id}
            {...followUp}
            icon={icon}
            onClick={onQuestionClick}
          />
        );
      })}
    </div>
  );
};
