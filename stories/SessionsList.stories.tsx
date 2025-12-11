import type { Meta } from '@storybook/react';
import { subDays } from 'date-fns';

import {
  Chat,
  ChatInput,
  NewSessionButton,
  type Session,
  SessionGroups,
  SessionListItem,
  SessionMessagePanel,
  SessionMessages,
  SessionMessagesHeader,
  SessionsGroup,
  SessionsList
} from '../src';
import { fakeSessions } from './examples';

export default {
  title: 'Demos/SessionList',
  component: SessionsList
} as Meta;

export const DefaultSession = () => {
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
        sessions={fakeSessions}
        activeSessionId="1"
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

export const UndeleteableSessions = () => {
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
      <Chat viewType="console" sessions={fakeSessions} activeSessionId="1">
        <SessionsList>
          <NewSessionButton />
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} deletable={false} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
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

export const HundredSessions = () => {
  const generateFakeSessions = (count: number): Session[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `session-${index + 1}`,
      title: `Session ${index + 1}`,
      createdAt: subDays(new Date(), index),
      updatedAt: subDays(new Date(), index),
      conversations: [
        {
          id: `conv-${index}-1`,
          question: `Question for session ${index + 1}`,
          response: `Response for session ${index + 1}`,
          createdAt: subDays(new Date(), index),
          updatedAt: subDays(new Date(), index)
        }
      ]
    }));
  };

  const hundredSessions = generateFakeSessions(100);

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
      <Chat viewType="console" sessions={hundredSessions}>
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

export const LongSessionNames = () => {
  const generateFakeSessionsWithLongNames = (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `session-${index + 1}`,
      title: `Session ${index + 1}: This is a very long session name to test how the UI handles overflow and text wrapping in the session list. It should be truncated or wrapped appropriately to ensure a good user experience.`,
      createdAt: subDays(new Date(), count - index),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question:
            'Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics?',
          response:
            'Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics?',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }));
  };

  const sessionsWithLongNames = generateFakeSessionsWithLongNames(10);

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
        sessions={sessionsWithLongNames}
        activeSessionId="session-10"
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

export const SessionGrouping = () => {
  const createSessionWithDate = (
    id: string,
    title: string,
    daysAgo: number
  ): Session => ({
    id,
    title,
    createdAt: subDays(new Date(), daysAgo),
    updatedAt: subDays(new Date(), daysAgo),
    conversations: [
      {
        id: `${id}-1`,
        question: 'Sample question',
        response: 'Sample response',
        createdAt: subDays(new Date(), daysAgo),
        updatedAt: subDays(new Date(), daysAgo)
      }
    ]
  });

  const sessionsWithVariousDates: Session[] = [
    createSessionWithDate('1', 'Today Session', 0),
    createSessionWithDate('2', 'Yesterday Session', 1),
    createSessionWithDate('3', 'Yesterday Session 2', 1),
    createSessionWithDate('4', 'Last Week Session', 6),
    createSessionWithDate('5', 'Two Weeks Ago Session', 14),
    createSessionWithDate('6', 'Last Month Session', 32),
    createSessionWithDate('7', 'Two Months Ago Session', 65),
    createSessionWithDate('8', 'Six Months Ago Session', 180),
    createSessionWithDate('9', 'Last Year Session', 370),
    createSessionWithDate('10', 'Two Years Ago Session', 740)
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
        sessions={sessionsWithVariousDates}
        isLoading={false}
        onDeleteSession={() => {}}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput placeholder="Send a message" />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
