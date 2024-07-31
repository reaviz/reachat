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
  SessionMessage
} from '../src';
import { fakeSessions, sessionWithSources, sessionsWithFiles } from './examples';

export default {
  title: 'Demos/Companion',
  component: Chat
} as Meta;

export const Basic = () => {
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
        sessions={[
          ...fakeSessions,
          ...sessionsWithFiles,
          ...sessionWithSources
        ]}
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
