import { Meta } from '@storybook/react';
import {
  Chat,
  SessionsList,
  NewSessionButton,
  SessionMessages,
  SessionGroups,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader,
  Session,
  AppBar,
  SessionListItem
} from '../src';
import {
  fakeSessions,
  sessionWithSources,
  sessionsWithFiles,
  chatTemplates
} from './examples';
import { useState, memo, useCallback } from 'react';
import { IconButton } from 'reablocks';

import Placeholder from '@/assets/placeholder.svg?react';
import PlaceholderDark from '@/assets/placeholder-dark.svg?react';
import ReachatLogo from '@/assets/logo/logo.svg?react';
import IconSearch from '@/assets/search.svg?react';
import IconClose from '@/assets/close-fill.svg?react';

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

export const WithAppBar = () => {
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

const AppBarContent = memo(({ onClose }: { onClose?: () => void }) => (
  <div className="flex items-center justify-between w-full">
    <div className="flex-shrink-0">
      <IconButton size="small" variant="outline" className='rounded-full p-3'>
        <IconSearch className="size-4" />
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
        onClick={onClose}
      >
        <IconClose className='w-4 h-4' />
      </IconButton>
    </div>
  </div>
));

export const TemplatesView = () => {
  const [activeId, setActiveId] = useState<string>();
  const [sessions, setSessions] = useState<Session[]>(
    chatTemplates.map(template => ({
      id: template.id,
      title: template.title,
      createdAt: new Date(),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question: template.message,
          createdAt: new Date()
        }
      ]
    }))
  );

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
        onSelectSession={setActiveId}
        onDeleteSession={() => alert('delete!')}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <SessionsList>
              <SessionGroups>
                {(groups) => (
                  <>
                    {groups.map(({ sessions }) => (
                      sessions.map(session => (
                        <SessionListItem key={session.id} session={session} deletable={false} />
                      ))
                    ))}
                  </>
                )}
              </SessionGroups>
            </SessionsList>
          </div>
          {!activeId && <ChatInput />}
          {activeId && (
            <SessionMessagePanel>
              <SessionMessagesHeader />
              <SessionMessages />
              <ChatInput />
            </SessionMessagePanel>
          )}
        </div>
      </Chat>
    </div>
  );
};

export const TemplatesViewWithTitle = () => {
  const [activeId, setActiveId] = useState<string>();
  const [sessions, setSessions] = useState<Session[]>(
    chatTemplates.map(template => ({
      id: template.id,
      title: template.title,
      createdAt: new Date(),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question: template.message,
          createdAt: new Date()
        }
      ]
    }))
  );

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
        onSelectSession={setActiveId}
        onDeleteSession={() => alert('delete!')}
      >
        <div className="dark:text-white text-gray-500 w-full h-full overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 items-center justify-center py-8">
              <p className="text-gray-500 max-w-[400px] text-center mb-4">
                Welcome to Reachat, a UI library for effortlessly building and
                customizing chat experiences with Tailwind.
              </p>
            </div>
            <SessionsList>
              <SessionGroups>
                {(groups) => (
                  <>
                    {groups.map(({ sessions }) => (
                      sessions.map(session => (
                        <SessionListItem key={session.id} session={session} deletable={false} />
                      ))
                    ))}
                  </>
                )}
              </SessionGroups>
            </SessionsList>
          </div>
          {!activeId && <ChatInput />}
          {activeId && (
            <SessionMessagePanel>
              <SessionMessagesHeader />
              <SessionMessages />
              <ChatInput />
            </SessionMessagePanel>
          )}
        </div>
      </Chat>
    </div>
  );
};

export const TemplatesViewWithAppBar = () => {
  const [activeId, setActiveId] = useState<string>();
  const [sessions, setSessions] = useState<Session[]>(
    chatTemplates.map(template => ({
      id: template.id,
      title: template.title,
      createdAt: new Date(),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question: template.message,
          createdAt: new Date()
        }
      ]
    }))
  );

  const handleClose = useCallback(() => {
    setActiveId(undefined);
  }, []);

  return (
    <div
      className="dark:bg-gray-950 bg-white flex flex-col"
      style={{
        width: 350,
        height: 500,
        borderRadius: 5,
        overflow: 'hidden'
      }}
    >
      <AppBar content={<AppBarContent onClose={handleClose} />} />
      <div className="flex-1 p-5">
        <Chat
          viewType="companion"
          sessions={sessions}
          activeSessionId={activeId}
          onSelectSession={setActiveId}
          onDeleteSession={() => alert('delete!')}
        >
          <div className="dark:text-white text-gray-500 w-full h-full overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-2 items-center justify-center pb-2">
                <p className="text-gray-500 max-w-[400px] text-center mb-4">
                  Welcome to Reachat, a UI library for effortlessly building and
                  customizing chat experiences with Tailwind.
                </p>
              </div>
              <SessionsList>
                <SessionGroups>
                  {(groups) => (
                    <>
                      {groups.map(({ sessions }) => (
                        sessions.map(session => (
                          <SessionListItem key={session.id} session={session} deletable={false} />
                        ))
                      ))}
                    </>
                  )}
                </SessionGroups>
              </SessionsList>
            </div>
            {!activeId && <ChatInput />}
            <SessionMessagePanel allowBack={false}>
              <SessionMessagesHeader />
              <SessionMessages />
              <ChatInput />
            </SessionMessagePanel>
          </div>
        </Chat>
      </div>
    </div>
  );
};
