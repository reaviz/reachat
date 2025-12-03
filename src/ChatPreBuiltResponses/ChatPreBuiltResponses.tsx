export const ChatPreBuiltResponses = () => {
  // will refactor later to add in initialResponses and followUpResponses as props
  // pre-built will need to be a prop in the Chat component as optional

  //1. Define the pre built responses for intial and follow up
  // Will move these to a separate file later
  const initialResponses = [
    {
      id: 'no_thanks',
      response: "I'm just browsing, thanks for asking."
    },
    {
      id: 'support',
      response: 'I need support with my account.'
    }
  ];

  const followUpResponses = [
    {
      id: 'more_help',
      response: 'What else can I help you with?'
    },
    {
      id: 'thanks',
      response: "You're welcome! Have a great day!"
    }
  ];

  //2. Build the chat component with the pre built responses

  return (
    <div>
      <div className="border-gray-500 h-30 rounded-md p-4 bg-gradient-to-bl from-transparent from-30% via-blue-950 via-60% to-indigo-500 to-85">
        {/* will add option for image later*/}
        {/* Will refactor later to use theme colors and need to do dark and light mode*/}
        {/* Will need to add a conditional to check if the response is initial or followup */}
        <p className="text-white text-lg font-bold">
          Hi, What can I help you with?
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="dark:border-gray-700/50 dark:text-gray-200 dark:bg-gray-950 dark:hover:bg-blue-950/40 hover:bg-blue-100 hover:border-blue-500 border border-gray-200 h-12 rounded-md flex items-center justify-center">
          option one
        </div>{' '}
        {/* will add in a click handler later and change to button */}
        <div className="dark:border-gray-700/50 dark:text-gray-200 dark:bg-gray-950 dark:hover:bg-blue-950/40 hover:bg-blue-100 hover:border-blue-500 border border-gray-200 h-12 rounded-md flex items-center justify-center">
          option two
        </div>
      </div>
    </div>
  );
};
