import { FC, useContext } from 'react';
import { cn } from 'reablocks';
import { ChatContext } from '../ChatContext';
import { chatTheme } from '../theme';

interface PreBuiltOption {
  id: string;
  response: string;
}

interface ChatPreBuiltResponsesProps {
  options: PreBuiltOption[];
  headerText?: string;
  onSelectOption?: (option: PreBuiltOption) => void;
  isLoading?: boolean;
  avatarUrl?: string;
}

export const ChatPreBuiltResponses: FC<ChatPreBuiltResponsesProps> = ({
  options,
  headerText = 'Hi, What can I help you with?',
  onSelectOption,
  isLoading = false,
  avatarUrl = '/stories/assets/chatbot.png'
}) => {
  const { theme = chatTheme } = useContext(ChatContext);

  return (
    <div className={cn(theme.preBuiltResponses.base)}>
      <div className={cn(theme.preBuiltResponses.header.base)}>
        <div className={cn(theme.preBuiltResponses.header.avatar)}>
          <img
            src={avatarUrl}
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>
        <p className={cn(theme.preBuiltResponses.header.text)}>{headerText}</p>
      </div>
      <div className={cn(theme.preBuiltResponses.options.base)}>
        {isLoading ? (
          <div className={cn(theme.preBuiltResponses.options.loading)}>
            Loading...
          </div>
        ) : (
          options?.map(option => (
            <button
              key={option.id}
              className={cn(theme.preBuiltResponses.options.button)}
              onClick={() => onSelectOption?.(option)}
            >
              {option.response}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
