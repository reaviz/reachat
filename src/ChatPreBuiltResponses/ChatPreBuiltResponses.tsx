import { FC, useState, useContext } from 'react';
import { ChatContext } from '../ChatContext';

interface PreBuiltOption {
  id: string;
  response: string;
  followUps?: PreBuiltOption[];
  followUpHeaderText?: string;
}

interface ChatPreBuiltResponsesProps {
  responses: PreBuiltOption[];
}

export const ChatPreBuiltResponses: FC<ChatPreBuiltResponsesProps> = ({
  responses
}) => {
  const [currentOptions, setCurrentOptions] =
    useState<PreBuiltOption[]>(responses);
  const [headerText, setHeaderText] = useState('Hi, What can I help you with?');
  const [isDismissed, setIsDismissed] = useState(false);
  const { sendMessage } = useContext(ChatContext);

  const handleSelectResponse = (option: PreBuiltOption) => {
    if (option.id === 'start_over') {
      handleStartOver();
      return;
    }

    sendMessage?.(option.response);

    if (option.followUps && option.followUps.length > 0) {
      setCurrentOptions(option.followUps);
      setHeaderText(
        option.followUpHeaderText || 'What else can I help you with?'
      );
    } else {
      setIsDismissed(true);
      setHeaderText('Thanks for stopping by!');
    }
  };

  const handleStartOver = () => {
    setCurrentOptions(responses);
    setHeaderText('Hi, What can I help you with?');
    setIsDismissed(false);
  };

  return (
    <div>
      <div className="flex items-center rounded-md gap-3 p-3 sm:gap-4 sm:p-4 bg-gradient-to-br from-transparent from-40% via-blue-500 via-70% to-indigo-500 to-80%">
        <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
          <img
            src="/stories/assets/chatbot.png"
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-white text-sm sm:text-base md:text-lg font-bold flex-1">
          {headerText}
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {isDismissed ? (
          <button
            className="dark:border-gray-700/50 dark:text-gray-200 dark:bg-gray-950 dark:hover:bg-blue-950/40 hover:bg-blue-100 hover:shadow-sm shadow-blue-500 hover:border-blue-500 border border-gray-200 h-12 rounded-md flex items-center justify-center"
            onClick={handleStartOver}
          >
            Start a new conversation
          </button>
        ) : (
          currentOptions?.map(option => (
            <button
              key={option.id}
              className="dark:border-gray-700/50 dark:text-gray-200 dark:bg-gray-950 dark:hover:bg-blue-950/40 hover:bg-blue-100 hover:shadow-sm shadow-blue-500 hover:border-blue-500 border border-gray-200 h-12 rounded-md flex items-center justify-center"
              onClick={() => handleSelectResponse(option)}
            >
              {option.response}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
