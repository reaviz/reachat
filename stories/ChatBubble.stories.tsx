import type { Meta, StoryObj } from '@storybook/react';
import { ChatBubble } from '../src/ChatBubble';
import {
  Chat,
  SessionsList,
  NewSessionButton,
  SessionMessages,
  SessionGroups,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader,
  Session
} from '../src';
import { useState } from 'react';
import { IconButton } from 'reablocks';
import IconChat from '@/assets/chat-voice-fill.svg?react';
import {
  fakeSessions,
  sessionsWithFiles,
  sessionWithSources
} from './examples';

export default {
  title: 'Demos/ChatBubble',
  component: ChatBubble,
  args: {
    position: 'right-end',
    bubbleContent: (
      <IconButton
        size="medium"
        variant="outline"
        className="rounded-full p-3 hover:scale-110 transition-transform"
      >
        <IconChat />
      </IconButton>
    )
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['top',
        'top-start',
        'top-end',
        'right',
        'right-start',
        'right-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end'
      ],
      description: 'The position of the chat bubble'
    },
    className: {
      description: 'Additional CSS classes'
    },
    children: {
      description: 'Main content (chat/companion interface)'
    },
    bubbleContent: {
      description: 'Content to show in the trigger bubble'
    },
    modifiers: {
      description: 'Custom position modifiers'
    },
  }
} as Meta<typeof ChatBubble>;

type Story = StoryObj<typeof ChatBubble>;

export const Basic: Story = {
  render: (args) => <ChatBubble {...args} />
};

export const PortalExample: Story = {
  render: (args) =>  (
    <>
      <div className="relative w-[400px] h-[300px] border-2 border-gray-300 flex justify-center items-center">
        <p className="text-gray-600">The ChatBubble will portal here!</p>
        <ChatBubble
          className='absolute left-5 bottom-5'
          {...args}
        />
      </div>
    </>
  )
};

export const WithChildren: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState<string>();
    const [sessions, setSessions] = useState<Session[]>([
      ...fakeSessions,
      ...sessionsWithFiles,
      ...sessionWithSources
    ]);

    return (
      <div className='fixed left-5 bottom-5'>
        <ChatBubble {...args}>
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
        </ChatBubble></div>
    );
  }
};

export const WithChildrenPortal: Story = {
  render: (args) => {
    const [activeId, setActiveId] = useState<string>();
    const [sessions, setSessions] = useState<Session[]>([
      ...fakeSessions,
      ...sessionsWithFiles,
      ...sessionWithSources
    ]);

    return (
      <>
        <div className="relative w-[400px] h-[300px] border-2 border-gray-300 flex flex-col justify-center items-center">
          <p className="text-gray-600">The ChatBubble will portal here!</p>
          <ChatBubble {...args} className='absolute left-5 bottom-5'>
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
          </ChatBubble>
        </div>
      </>
    );
  }
};
