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
      style={{
        width: 350,
        height: 500,
        padding: 20,
        background: '#02020F',
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
  );
};

export const Empty = () => {
  return (
    <div
      style={{
        width: 350,
        height: 500,
        padding: 20,
        background: '#02020F',
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
  );
};
