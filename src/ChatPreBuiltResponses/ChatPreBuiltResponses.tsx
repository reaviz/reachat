import { FC, useState, useContext } from 'react';
import { ChatContext } from '../ChatContext';

interface ChatPreBuiltResponsesProps {
  initialResponses: { id: string; response: string }[];
  followUpResponses: { id: string; response: string }[];
}

export const ChatPreBuiltResponses: FC<ChatPreBuiltResponsesProps> = ({
  initialResponses,
  followUpResponses
}) => {
  const [phase, setPhase] = useState<'initial' | 'followUp'>('initial');
  const { sendMessage } = useContext(ChatContext);

  const currentResponses =
    phase === 'initial' ? initialResponses : followUpResponses;

  const handleSelectResponse = (selectedResponse: string) => {
    sendMessage?.(selectedResponse);
    setPhase(phase === 'initial' ? 'followUp' : 'initial');
  };

  return (
    <div>
      <div className="flex items-center justify- h-30 rounded-md p-4 gap-4 bg-gradient-to-br from-transparent from-40% via-blue-500 via-70% to-indigo-500 to-80%">
        <div className="">
          <img
            src="/stories/assets/chatbot.png"
            alt="logo"
            width={80}
            height={80}
          />
        </div>
        <p className="text-white text-lg font-bold">
          {phase === 'initial'
            ? 'Hi, What can I help you with?'
            : 'What else can I help you with?'}
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {currentResponses?.map(response => (
          <button
            key={response.id}
            className="dark:border-gray-700/50 dark:text-gray-200 dark:bg-gray-950 dark:hover:bg-blue-950/40 hover:bg-blue-100 hover:shadow-sm shadow-blue-500 hover:border-blue-500 border border-gray-200 h-12 rounded-md flex items-center justify-center"
            onClick={() => handleSelectResponse(response.response)}
          >
            {response.response}
          </button>
        ))}
      </div>
    </div>
  );
};
