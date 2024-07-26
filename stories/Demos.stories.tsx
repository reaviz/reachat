import { useState, useCallback, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import { Meta } from '@storybook/react';
import {
  Sessions,
  Session,
  remarkCve,
  SessionsList,
  SessionsGroup,
  SessionListItem,
  NewSessionButton,
  SessionMessages,
  SessionMessage,
  SessionMessageProps,
  SessionInput
} from '../src';
import { Card, Input } from 'reablocks';
import { subDays, subMinutes, subHours } from 'date-fns';
import { groupSessionsByDate } from '@/utils';

export default {
  title: 'Demos',
  component: Sessions
} as Meta;

const fakeSessions: Session[] = [
  {
    id: '1',
    title: 'Session 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: [
      {
        id: '1',
        question: 'What is React?',
        response: 'React is a JavaScript library for building user interfaces.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        question: 'What is JSX?',
        response: 'JSX is a syntax extension for JavaScript.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: '2',
    title: 'Session 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: [
      {
        id: '1',
        question: 'What is TypeScript?',
        response: 'TypeScript is a typed superset of JavaScript.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        question: 'What is a component?',
        response: 'A component is a reusable piece of UI.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export const Console = () => {
  const groups = groupSessionsByDate(fakeSessions);
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
        borderRadius: 5
      }}
    >
      <Sessions
        sessions={fakeSessions}
        viewType="console"
        isLoading={false}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          {Object.keys(groups).map(k => (
            <SessionsGroup heading={k}>
              {groups[k].map(s => (
                <SessionListItem key={s.id} session={s} />
              ))}
            </SessionsGroup>
          ))}
        </SessionsList>
        <div className="flex-1 h-full flex flex-col">
          <SessionMessages />
          <SessionInput />
        </div>
      </Sessions>
    </div>
  );
};

const CustomSessionMessage: React.FC<SessionMessageProps> = ({
  question,
  response
}) => (
  <div className="p-4 border border-blue-500 rounded mb-4">
    <span className="text-lg font-semibold text-blue-500">
      This is my question: {question}
    </span>
    <br />
    This is the response: {response}
  </div>
);

export const Slots = () => {
  const groups = groupSessionsByDate(fakeSessions);
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
        borderRadius: 5
      }}
    >
      <Sessions sessions={fakeSessions} viewType="console">
        <SessionsList>
          <NewSessionButton />
          {Object.keys(groups).map(k => (
            <SessionsGroup heading={k}>
              {groups[k].map(s => (
                <SessionListItem key={s.id} session={s} />
              ))}
            </SessionsGroup>
          ))}
        </SessionsList>
        <div className="flex-1 h-full flex flex-col">
          <SessionMessages>
            <CustomSessionMessage />
          </SessionMessages>
          <SessionInput />
        </div>
      </Sessions>
    </div>
  );
};

// export const NewSessionContent = () => {
//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={fakeSessions}
//         isLoading={false}
//         newSessionContent={
//           <div className="text-lg w-full text-center">
//             Type a question to get a response...
//           </div>
//         }
//         onDeleteSession={() => {}}
//       />
//     </div>
//   );
// };

// export const DefaultSession = () => {
//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={fakeSessions}
//         activeSessionId="1"
//         isLoading={false}
//         onDeleteSession={() => {}}
//       />
//     </div>
//   );
// };

// export const Companion = () => {
//   return (
//     <Card style={{ width: 350 }} disablePadding>
//       <Sessions
//         viewType="companion"
//         sessions={fakeSessions}
//         isLoading={false}
//         onDeleteSession={() => {}}
//       />
//     </Card>
//   );
// };

// export const Loading = () => {
//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={fakeSessions}
//         isLoading={true}
//         onDeleteSession={() => {}}
//       />
//     </div>
//   );
// };

// export const FileUploads = () => {
//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={fakeSessions}
//         activeSessionId="1"
//         allowedFiles={['.pdf', '.docx']}
//         onDeleteSession={() => {}}
//       />
//     </div>
//   );
// };

// export const DefaultInputValue = () => {
//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         inputDefaultValue="Pre-populate the prompt via the default value property"
//         sessions={fakeSessions}
//         activeSessionId="1"
//         onDeleteSession={() => {}}
//       />
//     </div>
//   );
// };

// export const UndeleteableSessions = () => {
//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={fakeSessions}
//         activeSessionId="1"
//         onDeleteSession={null}
//       />
//     </div>
//   );
// };

// export const SessionGrouping = () => {
//   const createSessionWithDate = (id: string, title: string, daysAgo: number): Session => ({
//     id,
//     title,
//     createdAt: subDays(new Date(), daysAgo),
//     updatedAt: subDays(new Date(), daysAgo),
//     conversations: [
//       { id: `${id}-1`, question: 'Sample question', response: 'Sample response', createdAt: subDays(new Date(), daysAgo), updatedAt: subDays(new Date(), daysAgo) },
//     ],
//   });

//   const sessionsWithVariousDates: Session[] = [
//     createSessionWithDate('1', 'Today Session', 0),
//     createSessionWithDate('2', 'Yesterday Session', 1),
//     createSessionWithDate('2', 'Yesterday Session 2', 1),
//     createSessionWithDate('3', 'Last Week Session', 6),
//     createSessionWithDate('4', 'Two Weeks Ago Session', 14),
//     createSessionWithDate('5', 'Last Month Session', 32),
//     createSessionWithDate('6', 'Two Months Ago Session', 65),
//     createSessionWithDate('7', 'Six Months Ago Session', 180),
//     createSessionWithDate('8', 'Last Year Session', 370),
//     createSessionWithDate('9', 'Two Years Ago Session', 740),
//   ];

//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={sessionsWithVariousDates}
//         isLoading={false}
//         onDeleteSession={() => {}}
//       />
//     </div>
//   );
// };

// export const HundredSessions = () => {
//   const generateFakeSessions = (count: number): Session[] => {
//     return Array.from({ length: count }, (_, index) => ({
//       id: `session-${index + 1}`,
//       title: `Session ${index + 1}`,
//       createdAt: subDays(new Date(), index),
//       updatedAt: subDays(new Date(), index),
//       conversations: [
//         {
//           id: `conv-${index}-1`,
//           question: `Question for session ${index + 1}`,
//           response: `Response for session ${index + 1}`,
//           createdAt: subDays(new Date(), index),
//           updatedAt: subDays(new Date(), index)
//         }
//       ]
//     }));
//   };

//   const hundredSessions = generateFakeSessions(100);

//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={hundredSessions}
//         isLoading={false}
//         onDeleteSession={() => {}}
//       />
//     </div>
//   );
// };

// export const HundredConversations = () => {
//   const generateFakeConversations = (count: number) => {
//     return Array.from({ length: count }, (_, index) => ({
//       id: `conv-${index + 1}`,
//       question: `Question ${index + 1}: What is the meaning of life, the universe, and everything?`,
//       response: `Answer ${index + 1}: According to The Hitchhiker's Guide to the Galaxy, it's 42. But in reality, that's a complex philosophical question that has puzzled humanity for centuries.`,
//       createdAt: subMinutes(new Date(), count - index),
//       updatedAt: subMinutes(new Date(), count - index)
//     }));
//   };

//   const sessionWithHundredConversations: Session[] = [{
//     id: 'session-100',
//     title: 'Session with 100 Conversations',
//     createdAt: subHours(new Date(), 5),
//     updatedAt: new Date(),
//     conversations: generateFakeConversations(100)
//   }];

//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={sessionWithHundredConversations}
//         activeSessionId="session-100"
//         isLoading={false}
//         onDeleteSession={() => {}}
//       />
//     </div>
//   );
// };

// export const LongSessionNames = () => {
//   const generateFakeSessionsWithLongNames = (count: number) => {
//     return Array.from({ length: count }, (_, index) => ({
//       id: `session-${index + 1}`,
//       title: `Session ${index + 1}: This is a very long session name to test how the UI handles overflow and text wrapping in the session list. It should be truncated or wrapped appropriately to ensure a good user experience.`,
//       createdAt: subHours(new Date(), count - index),
//       updatedAt: new Date(),
//       conversations: []
//     }));
//   };

//   const sessionsWithLongNames = generateFakeSessionsWithLongNames(10);

//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={sessionsWithLongNames}
//         isLoading={false}
//         onDeleteSession={() => {}}
//       />
//     </div>
//   );
// };

// export const MarkdownShowcase = () => {
//   const markdownQuestion = `
//   **What is the purpose of life?**
//   `;

//   const markdownResponse = `
//   **The purpose of life is a philosophical question concerning the significance of life or existence in general.**

//   Here is a table to illustrate different perspectives:

//   | Perspective       | Description                                                                 |
//   |-------------------|-----------------------------------------------------------------------------|
//   | Religious         | Belief in a higher power or divine purpose.                                 |
//   | Philosophical     | Various theories including existentialism, nihilism, and absurdism.         |
//   | Scientific        | Understanding life through biology, evolution, and the universe.            |
//   | Personal          | Individual goals, happiness, and fulfillment.                               |

//   \`\`\`python
//   def purpose_of_life():
//       return 42
//   \`\`\`

//   \`\`\`json
//   {
//     "perspectives": [
//       {
//         "type": "Religious",
//         "description": "Belief in a higher power or divine purpose."
//       },
//       {
//         "type": "Philosophical",
//         "description": "Various theories including existentialism, nihilism, and absurdism."
//       },
//       {
//         "type": "Scientific",
//         "description": "Understanding life through biology, evolution, and the universe."
//       },
//       {
//         "type": "Personal",
//         "description": "Individual goals, happiness, and fulfillment."
//       }
//     ]
//   }
//   \`\`\`

//   The answer to the ultimate question of life, the universe, and everything is **42**.

//   [Perspective](https://en.wikipedia.org/wiki/Philosophical_question)
//   `;

//   const sessionWithMarkdown: Session[] = [{
//     id: 'session-markdown',
//     title: 'Markdown Showcase',
//     createdAt: subHours(new Date(), 1),
//     updatedAt: new Date(),
//     conversations: [{
//       id: 'conversation-1',
//       question: markdownQuestion,
//       response: markdownResponse,
//       createdAt: new Date()
//     }]
//   }];

//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={sessionWithMarkdown}
//         activeSessionId="session-markdown"
//         isLoading={false}
//         onDeleteSession={() => {}}
//       />
//     </div>
//   );
// };

// export const CVEExample = () => {
//   const markdownQuestion = `# Security Report

//   Please review the following CVEs:

//   - CVE-2021-34527
//   - CVE-2021-44228
//   - CVE-2021-45046
//   `;

//   const markdownResponse = `## Analysis

//   The listed CVEs are critical vulnerabilities that need immediate attention.

//   - CVE-2021-34527
//   - CVE-2021-44228
//   - CVE-2021-45046
//   `;

//   const sessionWithMarkdown: Session[] = [{
//     id: 'session-cve',
//     title: 'CVE Showcase',
//     createdAt: subHours(new Date(), 1),
//     updatedAt: new Date(),
//     conversations: [{
//       id: 'conversation-1',
//       question: markdownQuestion,
//       response: markdownResponse,
//       createdAt: new Date()
//     }]
//   }];

//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//       <Sessions
//         viewType="console"
//         sessions={sessionWithMarkdown}
//         activeSessionId="session-cve"
//         isLoading={false}
//         onDeleteSession={() => {}}
//         remarkPlugins={[remarkCve as any]}
//       />
//     </div>
//   );
// };

// export const OpenAIIntegration = () => {
//   const [sessions, setSessions] = useState<Session[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeSessionId, setActiveSessionId] = useState(null);
//   const [apiKey, setApiKey] = useState('');

//   const openai = useRef<OpenAI | null>(null);

//   useEffect(() => {
//     if (apiKey) {
//       openai.current = new OpenAI({
//         apiKey: apiKey,
//         dangerouslyAllowBrowser: true // For demo purposes only
//       });
//     }
//   }, [apiKey]);

//   const handleNewMessage = useCallback(async (message: string, sessionId: string = '1') => {
//     setIsLoading(true);
//     try {
//       const response = await openai.current.chat.completions.create({
//         model: 'gpt-3.5-turbo',
//         messages: [{ role: 'user', content: message }],
//       });

//       const aiResponse = response.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

//       setSessions(prevSessions => {
//         const sessionIndex = prevSessions.findIndex(s => s.id === sessionId);
//         if (sessionIndex === -1) {
//           // Create a new session
//           return [...prevSessions, {
//             id: sessionId,
//             title: message.slice(0, 30),
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             conversations: [{
//               id: Date.now().toString(),
//               question: message,
//               response: aiResponse,
//               createdAt: new Date(),
//               updatedAt: new Date()
//             }]
//           }];
//         } else {
//           // Add to existing session
//           const updatedSessions = [...prevSessions];
//           updatedSessions[sessionIndex] = {
//             ...updatedSessions[sessionIndex],
//             updatedAt: new Date(),
//             conversations: [
//               ...updatedSessions[sessionIndex].conversations,
//               {
//                 id: Date.now().toString(),
//                 question: message,
//                 response: aiResponse,
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//               }
//             ]
//           };
//           return updatedSessions;
//         }
//       });

//       setActiveSessionId(sessionId);;
//     } catch (error) {
//       console.error('Error calling OpenAI API:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [openai]);

//   const handleDeleteSession = useCallback((sessionId: string) => {
//     setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
//   }, []);

//   return (
//     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20 }}>
//       <Input fullWidth placeholder="OpenAI API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
//       <div style={{ position: 'absolute', top: 50, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: '#02020F', borderRadius: 5 }}>
//         <Sessions
//           viewType="console"
//           sessions={sessions}
//           isLoading={isLoading}
//           onDeleteSession={handleDeleteSession}
//           onSendMessage={handleNewMessage}
//           activeSessionId={activeSessionId}
//         />
//       </div>
//     </div>
//   );
// };
