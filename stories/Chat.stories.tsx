import { QuickActions } from '@/QuickActions';
import { Meta } from '@storybook/react';
import {
  Chat,
  SessionMessages,
  ChatInput,
  SessionMessagePanel,
  SessionMessage,
  Session,
  AppBar
} from '../src';
import {
  fakeSessions,
  sessionWithSources,
  sessionsWithFiles
} from './examples';
import { useCallback, useEffect, useRef, useState } from 'react';
import Placeholder from './assets/placeholder.svg?react';
import PlaceholderDark from './assets/placeholder-dark.svg?react';
import ReachatLogo from './assets/logo.svg?react';
import IconSearch from './assets/search.svg?react';
import IconClose from './assets/close-fill.svg?react';
import { DotsLoader, IconButton, List, ListItem, NestedMenu } from 'reablocks';

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
          <SessionMessages />
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
          <SessionMessages />
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

export const WithAppBar = () => {
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
        width: 800,
        height: 600,
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
        <div className="flex flex-col h-full">
          <AppBar
            content={
              <div className="flex items-center justify-between w-full">
                <div className="flex-shrink-0">
                  <IconButton size="small" variant="outline" className='rounded-full p-3'>
                    <IconSearch className='w-4 h-4' />
                  </IconButton>
                </div>
                <div className="flex-grow flex justify-center items-center">
                  <ReachatLogo className="h-6 w-auto" />
                </div>
                <div className="flex-shrink-0">
                  <IconButton
                    variant="text"
                    size="small"
                    className='rounded-full p-3'
                  >
                    <IconClose className='w-4 h-4' />
                  </IconButton>
                </div>
              </div>
            }
          />
          <SessionMessagePanel>
            <SessionMessages />
            <ChatInput />
          </SessionMessagePanel>
        </div>
      </Chat>
    </div>
  );
};

export const ActionsMenu = () => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>([
    ...fakeSessions,
    ...sessionsWithFiles,
    ...sessionWithSources
  ]);

  const onSelectAction = (action: string) => {
    if (inputRef.current) {
      inputRef.current.value = action;
      inputRef.current.focus();
    }
  }

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
          <SessionMessages />
          <ChatInput placeholder="Type '/' to call actions menu" inputRef={inputRef} />
          <QuickActions
            trigger="/"
            inputRef={inputRef}
          >
            {({ close: closeMain }) => (
              <List className="bg-gray-800">
                <NestedMenu label="Functions">
                  {({ close: closeNested}) => (
                    <List className="bg-gray-800">
                      <ListItem value="Function 1" onClick={() => {
                        onSelectAction('Function 1');
                        closeNested();
                        closeMain();
                      }}>Fn 1</ListItem>
                      <ListItem value="Function 2" onClick={() => {
                        onSelectAction('Function 2');
                        closeNested();
                        closeMain();
                      }}>Fn 2</ListItem>
                    </List>
                  )}
                </NestedMenu>
                <NestedMenu label="Actions">
                  {({ close: closeNested}) => (
                    <List className="bg-gray-800">
                      <ListItem value="Action 1" onClick={() => {
                        onSelectAction('Action 1');
                        closeNested();
                        closeMain();
                      }}>Action 1</ListItem>
                      <ListItem value="Action 2" onClick={() => {
                        onSelectAction('Action 2');
                        closeNested();
                        closeMain();
                      }}>Action 2</ListItem>
                    </List>
                  )}
                </NestedMenu>
              </List>
            )}
          </QuickActions>
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const ActionsMenuAsync = () => {
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>([
    ...fakeSessions,
    ...sessionsWithFiles,
    ...sessionWithSources
  ]);

  const onSelectAction = (action: string) => {
    if (inputRef.current) {
      inputRef.current.value = action;
      inputRef.current.focus();
    }
  }

  const renderAsyncNested = useCallback((name: string, onClick: (index: string) => void) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
      return (
        <List className="bg-gray-800 flex items-center justify-center p-2">
          <DotsLoader size="small" />
        </List>
      );
    }

    return (
      <List className="bg-gray-800">
        <ListItem value={`${name} 1`} onClick={() => onClick('1')}>{name} 1</ListItem>
        <ListItem value={`${name} 2`} onClick={() => onClick('1')}>{name} 2</ListItem>
      </List>
    )
  }, []);

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
          <SessionMessages />
          <ChatInput placeholder="Type '/' to call actions menu" inputRef={inputRef} />
          <QuickActions
            placement="bottom-start"
            trigger="/"
            inputRef={inputRef}
          >
            {({ close: closeMain }) => (
              <List className="bg-gray-800">
                <NestedMenu label="Functions">
                  {({ close: closeNested}) => (
                    renderAsyncNested('Function', (index) => {
                      onSelectAction(`Function ${index}`);
                      closeNested();
                      closeMain();
                    })
                  )}
                </NestedMenu>
                <NestedMenu label="Actions">
                  {({ close: closeNested}) => (
                    renderAsyncNested('Action', (index) => {
                      onSelectAction(`Action ${index}`);
                      closeNested();
                      closeMain();
                    })
                  )}
                </NestedMenu>
              </List>
            )}
          </QuickActions>
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
