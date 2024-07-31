import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import OpenAI from 'openai';
import { Meta } from '@storybook/react';
import {
  Chat,
  Session,
  SessionsList,
  SessionsGroup,
  SessionListItem,
  NewSessionButton,
  SessionMessages,
  SessionGroups,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader,
  SessionMessage
} from '../src';
import {
  Input,
} from 'reablocks';

export default {
  title: 'Demos/Integrations',
  component: Chat
} as Meta;

export const _OpenAI = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const openai = useRef<OpenAI | null>(null);

  useEffect(() => {
    if (apiKey) {
      openai.current = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // For demo purposes only
      });
    }
  }, [apiKey]);

  const handleNewMessage = useCallback(
    async (message: string, sessionId: string = '1') => {
      setIsLoading(true);
      try {
        const response = await openai.current.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }]
        });

        const aiResponse =
          response.choices[0]?.message?.content ||
          'Sorry, I couldnt generate a response.';

        setSessions(prevSessions => {
          const sessionIndex = prevSessions.findIndex(s => s.id === sessionId);
          if (sessionIndex === -1) {
            // Create a new session
            return [
              ...prevSessions,
              {
                id: sessionId,
                title: message.slice(0, 30),
                createdAt: new Date(),
                updatedAt: new Date(),
                conversations: [
                  {
                    id: Date.now().toString(),
                    question: message,
                    response: aiResponse,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  }
                ]
              }
            ];
          } else {
            // Add to existing session
            const updatedSessions = [...prevSessions];
            updatedSessions[sessionIndex] = {
              ...updatedSessions[sessionIndex],
              updatedAt: new Date(),
              conversations: [
                ...updatedSessions[sessionIndex].conversations,
                {
                  id: Date.now().toString(),
                  question: message,
                  response: aiResponse,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]
            };
            return updatedSessions;
          }
        });

        setActiveSessionId(sessionId);
      } catch (error) {
        console.error('Error calling OpenAI API:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [openai]
  );

  const handleDeleteSession = useCallback((sessionId: string) => {
    setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20
      }}
    >
      <Input
        fullWidth
        placeholder="OpenAI API Key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
      />
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 20,
          margin: 20,
          background: '#02020F',
          borderRadius: 5
        }}
      >
        <Chat
          viewType="console"
          sessions={sessions}
          isLoading={isLoading}
          disabled={!apiKey}
          onDeleteSession={handleDeleteSession}
          onSendMessage={handleNewMessage}
          activeSessionId={activeSessionId}
        >
          <SessionsList>
            <NewSessionButton />
            <SessionGroups>
              {groups =>
                groups.map(({ heading, sessions }) => (
                  <SessionsGroup heading={heading} key={heading}>
                    {sessions.map(s => (
                      <SessionListItem key={s.id} session={s} />
                    ))}
                  </SessionsGroup>
                ))
              }
            </SessionGroups>
          </SessionsList>

          <SessionMessagePanel>
            <SessionMessagesHeader />
            <SessionMessages>
              {conversations =>
                conversations.map(conversation => (
                  <SessionMessage
                    key={conversation.id}
                    conversation={conversation}
                  />
                ))
              }
            </SessionMessages>
            <ChatInput />
          </SessionMessagePanel>
        </Chat>
      </div>
    </div>
  );
};
