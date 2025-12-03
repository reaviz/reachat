export const ChatPreBuiltResponses = () => {
  // will refactor later to add in initialResponses and followUpResponses as props
  // pre-built will need to be a prop in the Chat component as optional

  //1. Define the pre built responses for intial and follow up
  // Will move these to a separate file later
  const initialResponses = [
    {
      id: 'greeting',
      response: 'Hello, how can I help you today?'
    },
    {
      id: 'weather',
      response: 'Would you like to know the weather in your area?'
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
      <div className="bg-pink-500 h-30 rounded-md">
        Hi, What can I help you with?
      </div>
      <div className="mt-4 flex flex-col gap-4 bg-purple-400">
        <div className="bg-blue-400 h-12 rounded-md border-2 flex items-center justify-center">
          option one
        </div>{' '}
        {/* will add in a click handler later and change to button */}
        <div className="bg-blue-400 h-12 rounded-md border-2 flex items-center justify-center">
          option two
        </div>
      </div>
    </div>
  );
};
