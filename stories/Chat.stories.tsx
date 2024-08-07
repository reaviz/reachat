import { Meta } from '@storybook/react';
import {
  Chat,
  SessionsList,
  SessionsGroup,
  SessionListItem,
  NewSessionButton,
  SessionMessages,
  SessionGroups,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader,
  SessionMessage,
  Session
} from '../src';
import {
  fakeSessions,
  sessionWithSources,
  sessionsWithFiles
} from './examples';
import { useState } from 'react';
import Placeholder from '@/assets/placeholder.svg?react';
import PlaceholderDark from '@/assets/placeholder-dark.svg?react';

export default {
  title: 'Demos/Chat',
  component: Chat
} as Meta;

export const Compact = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>([
    ...fakeSessions,
    ...sessionsWithFiles,
    ...sessionWithSources
  ]);

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
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onNewSession={() => {
          const newId = (sessions.length + 1).toLocaleString();
          setSessions([
            ...sessions,
            {
              id: newId,
              title: `New Session #${newId}`,
              createdAt: new Date(),
              updatedAt: new Date(),
              conversations: []
            }
          ]);
          setActiveId(newId);
        }}
        onSelectSession={setActiveId}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionMessagePanel>
          <SessionMessages>
            {conversations =>
              conversations.map((conversation, index) => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                  isLast={index === conversations.length - 1}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const FullScreen = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>([
    ...fakeSessions,
    ...sessionsWithFiles,
    ...sessionWithSources
  ]);

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
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onNewSession={() => {
          const newId = (sessions.length + 1).toLocaleString();
          setSessions([
            ...sessions,
            {
              id: newId,
              title: `New Session #${newId}`,
              createdAt: new Date(),
              updatedAt: new Date(),
              conversations: []
            }
          ]);
          setActiveId(newId);
        }}
        onSelectSession={setActiveId}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionMessagePanel>
          <SessionMessages>
            {conversations =>
              conversations.map((conversation, index) => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                  isLast={index === conversations.length - 1}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const Empty = () => {
  const [activeId, setActiveId] = useState<string>();
  const [sessions, setSessions] = useState<Session[]>([]);

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
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onNewSession={() => {
          const newId = (sessions.length + 1).toLocaleString();
          setSessions([
            ...sessions,
            {
              id: newId,
              title: `New Session #${newId}`,
              createdAt: new Date(),
              updatedAt: new Date(),
              conversations: []
            }
          ]);
          setActiveId(newId);
        }}
        onSelectSession={setActiveId}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionMessagePanel>
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col gap-2 items-center justify-center h-full">
                <Placeholder className="h-[50%] block dark:hidden max-w-[100%]" />
                <PlaceholderDark className="h-[50%] hidden dark:block max-w-[100%]" />
                <p className="text-gray-500 max-w-[400px] text-center">
                  Welcome to Reachat, a UI library for effortlessly building and
                  customizing chat experiences with Tailwind.
                </p>
              </div>
            }
          >
            {conversations =>
              conversations.map((conversation, index) => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                  isLast={index === conversations.length - 1}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
