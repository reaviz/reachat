import { Meta } from '@storybook/react';
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
import { fakeSessions } from './examples';

// Icons for demo
const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CommandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </svg>
);

const HelpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ClearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
    <line x1="18" y1="9" x2="12" y2="15" />
    <line x1="12" y1="9" x2="18" y2="15" />
  </svg>
);

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

export default {
  title: 'Demos/Enhanced Input',
  component: ChatInput
} as Meta;

// Sample data for mentions
const sampleUsers: MentionItem[] = [
  { id: '1', label: 'John Doe', description: 'Engineering', icon: <UserIcon /> },
  { id: '2', label: 'Jane Smith', description: 'Design', icon: <UserIcon /> },
  { id: '3', label: 'Bob Wilson', description: 'Product', icon: <UserIcon /> },
  { id: '4', label: 'Alice Brown', description: 'Marketing', icon: <UserIcon /> },
  { id: '5', label: 'Charlie Davis', description: 'Sales', icon: <UserIcon /> },
];

// Sample data for slash commands
const sampleCommands: SlashCommandItem[] = [
  { id: 'help', label: 'help', description: 'Show available commands', icon: <HelpIcon />, shortcut: '?' },
  { id: 'clear', label: 'clear', description: 'Clear the conversation', icon: <ClearIcon /> },
  { id: 'image', label: 'image', description: 'Generate an image', icon: <ImageIcon />, type: 'action' },
  { id: 'code', label: 'code', description: 'Insert a code block', icon: <CommandIcon />, type: 'insert', value: '```\n\n```' },
  { id: 'summarize', label: 'summarize', description: 'Summarize the conversation', icon: <CommandIcon /> },
];

export const WithMentions = () => {
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
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type @ to mention someone..."
            mentions={{
              items: sampleUsers,
              renderHeader: () => <span>Team Members</span>
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const WithSlashCommands = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  const handleCommandSelect = useCallback((item: SlashCommandItem, insertText: (text: string) => void) => {
    if (item.type === 'action') {
      console.log('Executing action:', item.label);
      // For action commands, insert nothing
      insertText('');
    } else if (item.value) {
      insertText(item.value);
    }
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
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type / for commands..."
            commands={{
              items: sampleCommands,
              onSelect: handleCommandSelect,
              renderHeader: () => <span>Commands</span>
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const WithAllFeatures = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  const handleCommandSelect = useCallback((item: SlashCommandItem, insertText: (text: string) => void) => {
    if (item.type === 'action') {
      console.log('Executing action:', item.label);
      insertText('');
    } else if (item.value) {
      insertText(item.value);
    }
  }, []);

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
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type @ for mentions, / for commands. Use Ctrl+B for bold, Ctrl+I for italic..."
            mentions={{
              items: sampleUsers,
              renderHeader: () => <span>Team Members</span>
            }}
            commands={{
              items: sampleCommands,
              onSelect: handleCommandSelect,
              renderHeader: () => <span>Commands</span>
            }}
            formatting={{
              bold: true,
              italic: true,
              code: true
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const WithAsyncSearch = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  // Simulate async search
  const searchUsers = useCallback(async (query: string): Promise<MentionItem[]> => {
    // Simulate network delay
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
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type @ to search team members (async)..."
            mentions={{
              items: sampleUsers,
              onSearch: searchUsers,
              renderHeader: () => <span>Search Team Members</span>,
              renderEmpty: (query) => <span>No users found matching "{query}"</span>
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const CustomTrigger = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  // Custom emoji picker trigger - using metadata for the emoji value
  const emojiItems = [
    { id: '1', label: 'smile', metadata: { value: '😀' } },
    { id: '2', label: 'heart', metadata: { value: '❤️' } },
    { id: '3', label: 'thumbsup', metadata: { value: '👍' } },
    { id: '4', label: 'fire', metadata: { value: '🔥' } },
    { id: '5', label: 'rocket', metadata: { value: '🚀' } },
    { id: '6', label: 'star', metadata: { value: '⭐' } },
    { id: '7', label: 'check', metadata: { value: '✅' } },
    { id: '8', label: 'thinking', metadata: { value: '🤔' } },
  ];

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
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInput
            placeholder="Type : for emojis..."
            triggers={[
              {
                trigger: ':',
                items: emojiItems,
                renderHeader: () => <span>Emoji</span>,
                onSelect: (item, insertText) => {
                  // Use metadata.value if present, otherwise use label
                  const value = (item.metadata as { value?: string })?.value || item.label;
                  insertText(value);
                }
              }
            ]}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
