import { Meta, StoryFn } from '@storybook/react-vite';
import { useState, useCallback } from 'react';
import {
  Chat,
  SessionMessages,
  ChatInput,
  SessionMessagePanel,
  Session,
  MentionItem,
  SlashCommandItem
} from '../src';
import { fakeSessions, createSendMessageHandler } from './examples';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CommandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
    <line x1="18" y1="9" x2="12" y2="15" />
    <line x1="12" y1="9" x2="18" y2="15" />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export default {
  title: 'Demos/Enhanced Input',
  component: ChatInput
} as Meta;

const sampleUsers: MentionItem[] = [
  { id: '1', label: 'John Doe', description: 'Engineering', icon: <UserIcon /> },
  { id: '2', label: 'Jane Smith', description: 'Design', icon: <UserIcon /> },
  { id: '3', label: 'Bob Wilson', description: 'Product', icon: <UserIcon /> },
  { id: '4', label: 'Alice Brown', description: 'Marketing', icon: <UserIcon /> },
  { id: '5', label: 'Charlie Davis', description: 'Sales', icon: <UserIcon /> }
];

const sampleCommands: SlashCommandItem[] = [
  {
    id: 'help',
    label: 'help',
    description: 'Show available commands',
    icon: <HelpIcon />,
    shortcut: '?'
  },
  {
    id: 'clear',
    label: 'clear',
    description: 'Clear the conversation',
    icon: <ClearIcon />
  },
  {
    id: 'image',
    label: 'image',
    description: 'Generate an image',
    icon: <ImageIcon />,
    type: 'action'
  },
  {
    id: 'code',
    label: 'code',
    description: 'Insert a code block',
    icon: <CommandIcon />,
    type: 'insert',
    value: '```\n\n```'
  },
  {
    id: 'summarize',
    label: 'summarize',
    description: 'Summarize the conversation',
    icon: <CommandIcon />
  }
];

export const WithMentions: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 500, height: 400, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type @ to mention someone..."
            mentions={{
              items: sampleUsers,
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const WithSlashCommands: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  const handleCommandSelect = useCallback(
    (item: SlashCommandItem, insertText: (text: string) => void) => {
      if (item.type === 'action') {
        console.log('Executing action:', item.label);
        insertText('');
      } else if (item.value) {
        insertText(item.value);
      }
    },
    []
  );

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 500, height: 400, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type / for commands..."
            commands={{
              items: sampleCommands,
              onSelect: handleCommandSelect,
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const WithAllFeatures: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  const handleCommandSelect = useCallback(
    (item: SlashCommandItem, insertText: (text: string) => void) => {
      if (item.type === 'action') {
        console.log('Executing action:', item.label);
        insertText('');
      } else if (item.value) {
        insertText(item.value);
      }
    },
    []
  );

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type @ for mentions, / for commands..."
            mentions={{
              items: sampleUsers,
            }}
            commands={{
              items: sampleCommands,
              onSelect: handleCommandSelect,
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const WithAsyncSearch: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  const searchUsers = useCallback(async (query: string): Promise<MentionItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const filtered = sampleUsers.filter(
      user =>
        user.label.toLowerCase().includes(query.toLowerCase()) ||
        user.description?.toLowerCase().includes(query.toLowerCase())
    );

    return filtered;
  }, []);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 500, height: 400, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type @ to search team members (async)..."
            mentions={{
              items: sampleUsers,
              onSearch: searchUsers,
              renderEmpty: query => (
                <span>No users found matching &quot;{query}&quot;</span>
              )
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const MultiLineEmpty: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 500, height: 400, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type a multi-line message (max 4 lines visible)..."
            minHeight={88}
            maxHeight={88}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const MultiLineWithContent: StoryFn = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  const defaultMultiLineText = `This is line one of the input.
This is line two of the input.
This is line three of the input.
This is line four of the input.
This is line five - you should scroll to see this.
This is line six - still scrolling!`;

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 500, height: 400, padding: 20, borderRadius: 5 }}
    >
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type a multi-line message..."
            defaultValue={defaultMultiLineText}
            minHeight={88}
            maxHeight={88}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
