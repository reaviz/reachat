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
import { useRef, useEffect, useState } from 'react';
import { IconButton } from 'reablocks';
import IconChat from '@/assets/chat-voice-fill.svg?react';
import { motion } from 'motion/react';
import { fakeSessions, sessionsWithFiles, sessionWithSources } from './examples';

export default {
    title: 'Demos/ChatBubble',
    component: ChatBubble,
    args: {
        position: 'bottom-left',
        bubbleContent: (
        <motion.div
            key="bubble"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <IconButton size="medium" variant="outline" className='rounded-full p-3'>
            <IconChat />
            </IconButton>
        </motion.div>
        )
    },
    argTypes: {
        position: {
        control: 'select',
        options: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
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
        customPosition: {
        description: 'Custom positioning styles'
        },
        portalTarget: {
        description: 'The DOM element where the chat bubble should be rendered'
        }
    }
} as Meta<typeof ChatBubble>;

type Story = StoryObj<typeof ChatBubble>;

export const Basic: Story = {
  render: (args) => <ChatBubble {...args} />
};

export const PortalExample: Story = {
  render: (args) => {
    const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (containerRef.current) {
        setPortalTarget(containerRef.current);
      }
    }, []);

    return (
        <>
            <div ref={containerRef} className="relative w-[400px] h-[300px] border-2 border-gray-300 flex justify-center items-center">
                <p className="text-gray-600">The ChatBubble will portal here!</p>
            </div>
            <ChatBubble
                {...args}
                portalTarget={portalTarget}
            />
        </>
    );
  }
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
            </ChatBubble>
    );
  }
};

export const WithChildrenPortal: Story = {
  render: (args) => {
    const [portalTarget, setPortalTarget] = useState<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeId, setActiveId] = useState<string>();
    const [sessions, setSessions] = useState<Session[]>([
        ...fakeSessions,
        ...sessionsWithFiles,
        ...sessionWithSources
    ]);

    return (
        <>
            <div ref={(el) => {
              containerRef.current = el;
              setPortalTarget(el);
            }} className="relative w-[400px] h-[300px] border-2 border-gray-300 flex justify-center items-center">
                <p className="text-gray-600">The ChatBubble will portal here!</p>
            </div>
            <ChatBubble {...args} portalTarget={portalTarget}>
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
        </>
    );
  }
};
