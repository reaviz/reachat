import { useState } from 'react';
import { Meta } from '@storybook/react';
import {
  Chat,
  SessionsList,
  NewSessionButton,
  SessionMessages,
  SessionGroups,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader,
  Session,
  FollowUpQuestions,
  FollowUp
} from '../src';
import {
  defaultFollowUpQuestions,
  sessionWithFollowUps
} from './examples';
import Placeholder from './assets/placeholder.svg?react';
import PlaceholderDark from './assets/placeholder-dark.svg?react';
import SparklesIcon from './assets/sparkles.svg?react';
import ArrowIcon from './assets/arrow-right.svg?react';

export default {
  title: 'Components/FollowUpQuestions',
  component: FollowUpQuestions
} as Meta;

export const Basic = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionWithFollowUps);
  const [activeId, setActiveId] = useState<string>('session-followups');

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={(message) => {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === activeId
                ? {
                    ...session,
                    conversations: [
                      ...session.conversations,
                      {
                        id: Date.now().toString(),
                        question: message,
                        response: 'This is a response to your question.',
                        createdAt: new Date()
                      }
                    ]
                  }
                : session
            )
          );
        }}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <FollowUpQuestions questions={defaultFollowUpQuestions} />
          <ChatInput placeholder="Type a message..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const WithIcons = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionWithFollowUps);
  const [activeId, setActiveId] = useState<string>('session-followups');

  const followUpQuestions: FollowUp[] = [
    { id: '1', question: 'Explain this in simpler terms' },
    { id: '2', question: 'What are the alternatives?' },
    { id: '3', question: 'Show me a code example' }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={(message) => {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === activeId
                ? {
                    ...session,
                    conversations: [
                      ...session.conversations,
                      {
                        id: Date.now().toString(),
                        question: message,
                        response: 'This is a response to your question.',
                        createdAt: new Date()
                      }
                    ]
                  }
                : session
            )
          );
        }}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <FollowUpQuestions
            questions={followUpQuestions}
            icon={<SparklesIcon />}
          />
          <ChatInput placeholder="Type a message..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const EmptySession = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string>();

  const initialQuestions: FollowUp[] = [
    { id: '1', question: 'What can you help me with?' },
    { id: '2', question: 'Tell me about your capabilities' },
    { id: '3', question: 'How do I get started?' },
    { id: '4', question: 'Show me some examples' }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onNewSession={() => {
          const newId = Date.now().toString();
          setSessions((prev) => [
            ...prev,
            {
              id: newId,
              title: 'New Session',
              createdAt: new Date(),
              conversations: []
            }
          ]);
          setActiveId(newId);
        }}
        onSendMessage={(message) => {
          if (!activeId) {
            const newId = Date.now().toString();
            setSessions([
              {
                id: newId,
                title: message.substring(0, 30),
                createdAt: new Date(),
                conversations: [
                  {
                    id: '1',
                    question: message,
                    response: 'This is a response to your question.',
                    createdAt: new Date()
                  }
                ]
              }
            ]);
            setActiveId(newId);
          } else {
            setSessions((prev) =>
              prev.map((session) =>
                session.id === activeId
                  ? {
                      ...session,
                      conversations: [
                        ...session.conversations,
                        {
                          id: Date.now().toString(),
                          question: message,
                          response: 'This is a response to your question.',
                          createdAt: new Date()
                        }
                      ]
                    }
                  : session
              )
            );
          }
        }}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <div className="flex-1 h-full flex flex-col">
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col gap-4 items-center justify-center h-full">
                <Placeholder className="w-48 block dark:hidden" />
                <PlaceholderDark className="w-48 hidden dark:block" />
                <p className="text-gray-500 max-w-[400px] text-center">
                  Welcome! Start a conversation or choose one of the suggestions below.
                </p>
                <FollowUpQuestions
                  questions={initialQuestions}
                  icon={<ArrowIcon />}
                />
              </div>
            }
          />
          <ChatInput placeholder="Type a message..." />
        </div>
      </Chat>
    </div>
  );
};

export const Companion = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionWithFollowUps);
  const [activeId, setActiveId] = useState<string>('session-followups');

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        width: 350,
        height: 500,
        padding: 20,
        borderRadius: 5
      }}
    >
      <Chat
        viewType="companion"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={(message) => {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === activeId
                ? {
                    ...session,
                    conversations: [
                      ...session.conversations,
                      {
                        id: Date.now().toString(),
                        question: message,
                        response: 'This is a response to your question.',
                        createdAt: new Date()
                      }
                    ]
                  }
                : session
            )
          );
        }}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <FollowUpQuestions questions={defaultFollowUpQuestions} />
          <ChatInput placeholder="Type a message..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const CustomItemRendering = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionWithFollowUps);
  const [activeId, setActiveId] = useState<string>('session-followups');

  const followUpQuestions: FollowUp[] = [
    { id: '1', question: 'How does this work?' },
    { id: '2', question: 'What are the limitations?' },
    { id: '3', question: 'Can you explain further?' }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={(message) => {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === activeId
                ? {
                    ...session,
                    conversations: [
                      ...session.conversations,
                      {
                        id: Date.now().toString(),
                        question: message,
                        response: 'This is a response to your question.',
                        createdAt: new Date()
                      }
                    ]
                  }
                : session
            )
          );
        }}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <FollowUpQuestions questions={followUpQuestions}>
            <CustomFollowUpItem />
          </FollowUpQuestions>
          <ChatInput placeholder="Type a message..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

const CustomFollowUpItem = ({ question, onClick }: { question?: string; onClick?: (q: string) => void }) => (
  <button
    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
    onClick={() => onClick?.(question || '')}
  >
    <span className="flex items-center gap-2">
      <SparklesIcon className="w-4 h-4" />
      {question}
    </span>
  </button>
);

export const DynamicFollowUps = () => {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 'session-1',
      title: 'Dynamic Follow-ups Demo',
      createdAt: new Date(),
      conversations: []
    }
  ]);
  const [activeId, setActiveId] = useState<string>('session-1');
  const [followUps, setFollowUps] = useState<FollowUp[]>([
    { id: '1', question: 'What is machine learning?' },
    { id: '2', question: 'Explain neural networks' },
    { id: '3', question: 'What is deep learning?' }
  ]);

  const questionResponseMap: Record<string, { response: string; nextFollowUps: FollowUp[] }> = {
    'What is machine learning?': {
      response: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience.',
      nextFollowUps: [
        { id: '4', question: 'What are the types of machine learning?' },
        { id: '5', question: 'How is ML different from AI?' },
        { id: '6', question: 'What are common ML algorithms?' }
      ]
    },
    'Explain neural networks': {
      response: 'Neural networks are computing systems inspired by biological neural networks in the human brain.',
      nextFollowUps: [
        { id: '7', question: 'How do neurons work in a network?' },
        { id: '8', question: 'What is backpropagation?' },
        { id: '9', question: 'What are activation functions?' }
      ]
    },
    'What is deep learning?': {
      response: 'Deep learning is a type of machine learning based on artificial neural networks with multiple layers.',
      nextFollowUps: [
        { id: '10', question: 'What are CNNs?' },
        { id: '11', question: 'What are RNNs?' },
        { id: '12', question: 'What is a transformer model?' }
      ]
    }
  };

  const handleSendMessage = (message: string) => {
    const mapping = questionResponseMap[message];
    const response = mapping?.response || 'Thank you for your question. Here is a helpful response.';
    const nextFollowUps = mapping?.nextFollowUps || [
      { id: Date.now().toString(), question: 'Tell me more' },
      { id: (Date.now() + 1).toString(), question: 'Can you clarify?' }
    ];

    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeId
          ? {
              ...session,
              conversations: [
                ...session.conversations,
                {
                  id: Date.now().toString(),
                  question: message,
                  response,
                  createdAt: new Date()
                }
              ]
            }
          : session
      )
    );

    setFollowUps(nextFollowUps);
  };

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={handleSendMessage}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <FollowUpQuestions
            questions={followUps}
            icon={<SparklesIcon />}
            onQuestionClick={(question) => console.log('Follow-up clicked:', question)}
          />
          <ChatInput placeholder="Type a message..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
