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
  title: 'Demos/Companion',
  component: Chat
} as Meta;

export const Basic = () => {
  const [activeId, setActiveId] = useState<string>();
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
        viewType="companion"
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
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const Empty = () => {
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
        sessions={[]}
        viewType="companion"
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <div className="flex-1 h-full flex flex-col">
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col gap-2 items-center justify-center h-full">
                <Placeholder className="h-[50%] block dark:hidden" />
                <PlaceholderDark className="h-[50%] hidden dark:block" />
                <p className="text-gray-500 max-w-[400px] text-center">
                  Welcome to Reachat, a UI library for effortlessly building and
                  customizing chat experiences with Tailwind.
                </p>
              </div>
            }
          />
        </div>
        <ChatInput />
      </Chat>
    </div>
  );
};
