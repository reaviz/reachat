import { Meta } from '@storybook/react';
import { useState, useCallback, useRef } from 'react';
import {
  Chat,
  SessionMessages,
  ChatInputContentEditable,
  ChatInputContentEditableRef,
  SessionMessagePanel,
  Session,
  MentionItem,
  SlashCommandItem
} from '../src';
import { fakeSessions } from './examples';

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
  title: 'Demos/ContentEditable Input',
  component: ChatInputContentEditable
} as Meta;

const sampleUsers: MentionItem[] = [
  {
    id: '1',
    label: 'John Doe',
    description: 'Engineering',
    icon: <UserIcon />
  },
  { id: '2', label: 'Jane Smith', description: 'Design', icon: <UserIcon /> },
  { id: '3', label: 'Bob Wilson', description: 'Product', icon: <UserIcon /> },
  {
    id: '4',
    label: 'Alice Brown',
    description: 'Marketing',
    icon: <UserIcon />
  },
  {
    id: '5',
    label: 'Charlie Davis',
    description: 'Sales',
    icon: <UserIcon />
  }
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

export const BasicInput = () => {
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
          <ChatInputContentEditable placeholder="Type a message (contenteditable)..." />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

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
          <ChatInputContentEditable
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
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInputContentEditable
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
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInputContentEditable
            placeholder="Type @ for mentions, / for commands..."
            mentions={{
              items: sampleUsers,
              renderHeader: () => <span>Team Members</span>
            }}
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

export const WithAsyncSearch = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  const searchUsers = useCallback(
    async (query: string): Promise<MentionItem[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));

      const filtered = sampleUsers.filter(
        user =>
          user.label.toLowerCase().includes(query.toLowerCase()) ||
          user.description?.toLowerCase().includes(query.toLowerCase())
      );

      return filtered;
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
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInputContentEditable
            placeholder="Type @ to search team members (async)..."
            mentions={{
              items: sampleUsers,
              onSearch: searchUsers,
              renderHeader: () => <span>Search Team Members</span>,
              renderEmpty: query => (
                <span>No users found matching "{query}"</span>
              )
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const WithMaxHeight = () => {
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
          <ChatInputContentEditable
            placeholder="Type multiple lines - max height 100px..."
            minHeight={40}
            maxHeight={100}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const CustomTrigger = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  const emojiItems = [
    { id: '1', label: 'smile', metadata: { value: '😀' } },
    { id: '2', label: 'heart', metadata: { value: '❤️' } },
    { id: '3', label: 'thumbsup', metadata: { value: '👍' } },
    { id: '4', label: 'fire', metadata: { value: '🔥' } },
    { id: '5', label: 'rocket', metadata: { value: '🚀' } },
    { id: '6', label: 'star', metadata: { value: '⭐' } },
    { id: '7', label: 'check', metadata: { value: '✅' } },
    { id: '8', label: 'thinking', metadata: { value: '🤔' } }
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
          <ChatInputContentEditable
            placeholder="Type : for emojis..."
            triggers={[
              {
                trigger: ':',
                items: emojiItems,
                renderHeader: () => <span>Emoji</span>,
                onSelect: (item, insertText) => {
                  const value =
                    (item.metadata as { value?: string })?.value || item.label;
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

export const ImperativeHandle = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);
  const inputRef = useRef<ChatInputContentEditableRef>(null);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 500, height: 500, padding: 20, borderRadius: 5 }}
    >
      <div className="mb-4 flex gap-2 flex-wrap">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          onClick={() => inputRef.current?.focus()}
        >
          Focus
        </button>
        <button
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          onClick={() => inputRef.current?.setValue('Hello, world!')}
        >
          Set Value
        </button>
        <button
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
          onClick={() => inputRef.current?.insertText(' [inserted] ')}
        >
          Insert Text
        </button>
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
          onClick={() => alert(inputRef.current?.getValue())}
        >
          Get Value
        </button>
      </div>
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInputContentEditable
            ref={inputRef}
            placeholder="Test imperative handle..."
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const MultiLineTest = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <div className="mb-2 text-sm text-gray-500">
        Test: Shift+Enter for new line, Enter to send
      </div>
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInputContentEditable
            placeholder="Test multi-line input (Shift+Enter for new line)..."
            minHeight={40}
            maxHeight={150}
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

export const PasteTest = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{ width: 600, height: 500, padding: 20, borderRadius: 5 }}
    >
      <div className="mb-2 text-sm text-gray-500">
        Test: Paste rich text from web pages - should paste as plain text
      </div>
      <Chat
        viewType="chat"
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
      >
        <SessionMessagePanel>
          <SessionMessages />
          <ChatInputContentEditable
            placeholder="Try pasting rich text here..."
            minHeight={40}
            maxHeight={200}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const ComparisonWithTextarea = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div className="flex gap-4">
      <div
        className="dark:bg-gray-950 bg-white"
        style={{ width: 400, height: 400, padding: 20, borderRadius: 5 }}
      >
        <h3 className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
          ContentEditable (New)
        </h3>
        <Chat
          viewType="chat"
          sessions={sessions}
          activeSessionId={activeId}
          onSelectSession={setActiveId}
        >
          <SessionMessagePanel>
            <SessionMessages />
            <ChatInputContentEditable
              placeholder="Type @ to mention..."
              mentions={{
                items: sampleUsers,
                renderHeader: () => <span>Team Members</span>
              }}
            />
          </SessionMessagePanel>
        </Chat>
      </div>
    </div>
  );
};
