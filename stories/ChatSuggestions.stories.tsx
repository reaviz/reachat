import type { Meta } from '@storybook/react';
import { useState } from 'react';

import {
  Chat,
  ChatInput,
  ChatSuggestions,
  NewSessionButton,
  type Session,
  SessionGroups,
  SessionMessagePanel,
  SessionMessages,
  SessionMessagesHeader,
  SessionsList,
  type Suggestion
} from '../src';
import { defaultSuggestions, sessionWithSuggestions } from './examples';
import Placeholder from './assets/placeholder.svg?react';
import PlaceholderDark from './assets/placeholder-dark.svg?react';
import SparklesIcon from './assets/sparkles.svg?react';

export default {
  title: 'Demos/Suggestions',
  component: ChatSuggestions
} as Meta;

export const Basic = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionWithSuggestions);
  const [activeId, setActiveId] = useState<string>('session-suggestions');

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
        onSendMessage={message => {
          setSessions(prev =>
            prev.map(session =>
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
          <ChatSuggestions suggestions={defaultSuggestions} />
          <ChatInput placeholder="Type a message..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const LongSuggestions = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionWithSuggestions);
  const [activeId, setActiveId] = useState<string>('session-suggestions');

  const longSuggestions: Suggestion[] = [
    {
      id: '1',
      content:
        'Can you explain in detail how machine learning algorithms work and what are the key differences between supervised and unsupervised learning?'
    },
    {
      id: '2',
      content:
        'What are the best practices for building scalable and maintainable React applications with TypeScript?'
    },
    {
      id: '3',
      content:
        'How do I implement authentication and authorization in a modern web application using OAuth 2.0 and OpenID Connect?'
    },
    {
      id: '4',
      content: 'Short one'
    }
  ];

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
        onSendMessage={message => {
          setSessions(prev =>
            prev.map(session =>
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
          <ChatSuggestions suggestions={longSuggestions} />
          <ChatInput placeholder="Type a message..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const EmptySession = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string>();

  const initialSuggestions: Suggestion[] = [
    { id: '1', content: 'What can you help me with?' },
    { id: '2', content: 'Tell me about your capabilities' },
    { id: '3', content: 'How do I get started?' },
    { id: '4', content: 'Show me some examples' }
  ];

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
          setSessions(prev => [
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
        onSendMessage={message => {
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
            setSessions(prev =>
              prev.map(session =>
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
                  Welcome! Start a conversation or choose one of the suggestions
                  below.
                </p>
                <ChatSuggestions suggestions={initialSuggestions} />
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
  const [sessions, setSessions] = useState<Session[]>(sessionWithSuggestions);
  const [activeId, setActiveId] = useState<string>('session-suggestions');

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
        onSendMessage={message => {
          setSessions(prev =>
            prev.map(session =>
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
          <ChatSuggestions suggestions={defaultSuggestions} />
          <ChatInput placeholder="Type a message..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const CustomItemRendering = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionWithSuggestions);
  const [activeId, setActiveId] = useState<string>('session-suggestions');

  const suggestions: Suggestion[] = [
    { id: '1', content: 'How does this work?' },
    { id: '2', content: 'What are the limitations?' },
    { id: '3', content: 'Can you explain further?' }
  ];

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
        onSendMessage={message => {
          setSessions(prev =>
            prev.map(session =>
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
          <ChatSuggestions suggestions={suggestions}>
            <CustomSuggestionItem />
          </ChatSuggestions>
          <ChatInput placeholder="Type a message..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

const CustomSuggestionItem = ({
  content,
  onClick
}: {
  content?: string;
  onClick?: (c: string) => void;
}) => (
  <button
    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
    onClick={() => onClick?.(content || '')}
  >
    <span className="flex items-center gap-2">
      <SparklesIcon className="w-4 h-4" />
      {content}
    </span>
  </button>
);

export const DynamicSuggestions = () => {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 'session-1',
      title: 'Dynamic Suggestions Demo',
      createdAt: new Date(),
      conversations: []
    }
  ]);
  const [activeId, setActiveId] = useState<string>('session-1');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    { id: '1', content: 'What is machine learning?' },
    { id: '2', content: 'Explain neural networks' },
    { id: '3', content: 'What is deep learning?' }
  ]);

  const suggestionResponseMap: Record<
    string,
    { response: string; nextSuggestions: Suggestion[] }
  > = {
    'What is machine learning?': {
      response:
        'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience.',
      nextSuggestions: [
        { id: '4', content: 'What are the types of machine learning?' },
        { id: '5', content: 'How is ML different from AI?' },
        { id: '6', content: 'What are common ML algorithms?' }
      ]
    },
    'Explain neural networks': {
      response:
        'Neural networks are computing systems inspired by biological neural networks in the human brain.',
      nextSuggestions: [
        { id: '7', content: 'How do neurons work in a network?' },
        { id: '8', content: 'What is backpropagation?' },
        { id: '9', content: 'What are activation functions?' }
      ]
    },
    'What is deep learning?': {
      response:
        'Deep learning is a type of machine learning based on artificial neural networks with multiple layers.',
      nextSuggestions: [
        { id: '10', content: 'What are CNNs?' },
        { id: '11', content: 'What are RNNs?' },
        { id: '12', content: 'What is a transformer model?' }
      ]
    }
  };

  const handleSendMessage = (message: string) => {
    const mapping = suggestionResponseMap[message];
    const response =
      mapping?.response ||
      'Thank you for your question. Here is a helpful response.';
    const nextSuggestions = mapping?.nextSuggestions || [
      { id: Date.now().toString(), content: 'Tell me more' },
      { id: (Date.now() + 1).toString(), content: 'Can you clarify?' }
    ];

    setSessions(prev =>
      prev.map(session =>
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

    setSuggestions(nextSuggestions);
  };

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
          <ChatSuggestions
            suggestions={suggestions}
            onSuggestionClick={suggestion =>
              console.log('Suggestion clicked:', suggestion)
            }
          />
          <ChatInput placeholder="Type a message..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
