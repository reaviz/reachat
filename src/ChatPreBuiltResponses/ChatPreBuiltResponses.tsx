import { FC, useState, useContext } from 'react';
import { ChatContext } from '../ChatContext';

interface PreBuiltOption {
  id: string;
  response: string;
}

interface ChatPreBuiltResponsesProps {
  options: PreBuiltOption[];
  headerText?: string;
  onSelectOption?: (option: PreBuiltOption) => void;
  isLoading?: boolean;
}

export const ChatPreBuiltResponses: FC<ChatPreBuiltResponsesProps> = ({
  options,
  headerText = 'Hi, What can I help you with?',
  onSelectOption,
  isLoading = false
}) => {
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
        {isLoading ? (
          <p className="dark:border-gray-700/50 dark:text-gray-200 dark:bg-gray-950 dark:hover:bg-blue-950/40 hover:bg-blue-100 hover:shadow-sm shadow-blue-500 hover:border-blue-500 border border-gray-200 h-12 rounded-md flex items-center justify-center">
            Start a new conversation
          </p>
        ) : (
          options?.map(option => (
            <button
              key={option.id}
              className="dark:border-gray-700/50 dark:text-gray-200 dark:bg-gray-950 dark:hover:bg-blue-950/40 hover:bg-blue-100 hover:shadow-sm shadow-blue-500 hover:border-blue-500 border border-gray-200 h-12 rounded-md flex items-center justify-center"
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
