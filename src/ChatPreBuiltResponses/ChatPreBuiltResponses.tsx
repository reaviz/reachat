import { FC, useState } from 'react';

interface ChatPreBuiltResponsesProps {
  initialResponses: { id: string; response: string }[];
  followUpResponses: { id: string; response: string }[];
  onSelectResponse: (response: string) => void;
}

export const ChatPreBuiltResponses: FC<ChatPreBuiltResponsesProps> = ({
  initialResponses,
  followUpResponses
}) => {
  // pre-built will need to be a prop in the Chat component as optional

  //1. Define the pre built responses for intial and follow up (decided to have this be in the stories version)
  // Will move these to a separate file later

  //2. Build the chat component with the pre built responses which will be props passed in

  //3. Add a conditional to set the response to initial or followUp
  const [response, setResponse] = useState<'initial' | 'followUp'>('initial');

  const currentResponses =
    response === 'initial' ? initialResponses : followUpResponses;

  //4. Change response options to buttons and an event handler to toggle the response between initial and followUp

  return (
    <div>
      <div className="h-30 rounded-md p-4 bg-gradient-to-bl from-transparent from-40% via-blue-500 via-70% to-indigo-500 to-80%">
        {/* will add option for image later*/}
        {/* Will refactor later to use theme colors and need to do dark and light mode*/}
        {/* Will need a compact size and a full size look. flex col to flex row*/}
        <p className="text-white text-lg font-bold">
          Hi, What can I help you with?
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="dark:border-gray-700/50 dark:text-gray-200 dark:bg-gray-950 dark:hover:bg-blue-950/40 hover:bg-blue-100 hover:shadow-sm shadow-blue-500 hover:border-blue-500 border border-gray-200 h-12 rounded-md flex items-center justify-center">
          option one
        </div>{' '}
        {/* will add in a click handler later and change to button */}
        <div className="dark:border-gray-700/50 dark:text-gray-200 dark:bg-gray-950 dark:hover:bg-blue-950/40 hover:bg-blue-100 hover:shadow-sm shadow-blue-500 hover:border-blue-500 border border-gray-200 h-12 rounded-md flex items-center justify-center">
          option two
        </div>
      </div>
    </div>
  );
};
