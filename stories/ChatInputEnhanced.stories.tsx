import { useState } from 'react';
import { Meta } from '@storybook/react';
import {
  Chat,
  Session,
  SessionsList,
  SessionGroups,
  NewSessionButton,
  SessionMessages,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader,
  SlashCommand,
  Mention
} from '../src';
import SparklesIcon from './assets/sparkles.svg?react';
import SearchIcon from './assets/search.svg?react';
import CloseIcon from './assets/close-fill.svg?react';

export default {
  title: 'Demos/Enhanced Input',
  component: ChatInput
} as Meta;

// Sample slash commands
const sampleSlashCommands: SlashCommand[] = [
  {
    id: 'help',
    command: 'help',
    label: 'Help',
    description: 'Show available commands and how to use them',
    icon: <SearchIcon />,
    category: 'General',
    shortcut: '⌘H'
  },
  {
    id: 'clear',
    command: 'clear',
    label: 'Clear Chat',
    description: 'Clear the current conversation history',
    icon: <CloseIcon />,
    category: 'General'
  },
  {
    id: 'summarize',
    command: 'summarize',
    label: 'Summarize',
    description: 'Summarize the current conversation',
    icon: <SparklesIcon />,
    category: 'AI Actions'
  },
  {
    id: 'code',
    command: 'code',
    label: 'Code Mode',
    description: 'Switch to code-focused mode for programming tasks',
    icon: <SparklesIcon />,
    category: 'AI Actions'
  },
  {
    id: 'translate',
    command: 'translate',
    label: 'Translate',
    description: 'Translate text to another language',
    category: 'AI Actions'
  },
  {
    id: 'explain',
    command: 'explain',
    label: 'Explain',
    description: 'Explain a concept in simple terms',
    category: 'AI Actions'
  }
];

// Sample mentions
const sampleMentions: Mention[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    description: 'Product Manager',
    avatar: 'https://i.pravatar.cc/150?img=1',
    category: 'Team'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    description: 'Senior Developer',
    avatar: 'https://i.pravatar.cc/150?img=2',
    category: 'Team'
  },
  {
    id: 'user-3',
    name: 'Bob Wilson',
    description: 'Designer',
    avatar: 'https://i.pravatar.cc/150?img=3',
    category: 'Team'
  },
  {
    id: 'doc-1',
    name: 'README.md',
    description: 'Project documentation',
    category: 'Files'
  },
  {
    id: 'doc-2',
    name: 'API Reference',
    description: 'API documentation',
    category: 'Files'
  }
];

const emptySession: Session = {
  id: 'session-1',
  title: 'New Conversation',
  createdAt: new Date(),
  updatedAt: new Date(),
  conversations: []
};

export const SlashCommands = () => {
  const [sessions, setSessions] = useState<Session[]>([emptySession]);
  const [lastCommand, setLastCommand] = useState<string>('');

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
      <div className="mb-4 text-sm text-gray-500">
        <strong>Try it:</strong> Type <code>/</code> to see available commands.
        Use arrow keys to navigate and Enter to select.
        {lastCommand && (
          <div className="mt-2 text-blue-500">
            Last command selected: <code>{lastCommand}</code>
          </div>
        )}
      </div>
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={(message) => {
          setSessions(prev => [{
            ...prev[0],
            conversations: [
              ...prev[0].conversations,
              {
                id: Date.now().toString(),
                createdAt: new Date(),
                question: message,
                response: 'This is a sample response.'
              }
            ]
          }]);
        }}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            placeholder="Type / to see commands..."
            slashCommands={sampleSlashCommands}
            onSlashCommand={(cmd) => {
              setLastCommand(cmd.command);
              console.log('Slash command selected:', cmd);
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const Mentions = () => {
  const [sessions, setSessions] = useState<Session[]>([emptySession]);
  const [lastMention, setLastMention] = useState<string>('');

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
      <div className="mb-4 text-sm text-gray-500">
        <strong>Try it:</strong> Type <code>@</code> to mention someone.
        Use arrow keys to navigate and Enter to select.
        {lastMention && (
          <div className="mt-2 text-blue-500">
            Last mention: <code>@{lastMention}</code>
          </div>
        )}
      </div>
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={(message) => {
          setSessions(prev => [{
            ...prev[0],
            conversations: [
              ...prev[0].conversations,
              {
                id: Date.now().toString(),
                createdAt: new Date(),
                question: message,
                response: 'This is a sample response.'
              }
            ]
          }]);
        }}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            placeholder="Type @ to mention someone..."
            mentions={sampleMentions}
            mentionsMenuProps={{
              groupByCategory: true
            }}
            onMention={(mention) => {
              setLastMention(mention.name);
              console.log('Mention selected:', mention);
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const InlineRichText = () => {
  const [sessions, setSessions] = useState<Session[]>([emptySession]);

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
      <div className="mb-4 text-sm text-gray-500">
        <strong>Inline Rich Text Editor:</strong> Format text directly in the input!
        <ul className="mt-2 list-disc ml-6">
          <li><code>**bold**</code> or <code>Ctrl+B</code> for <strong>bold</strong></li>
          <li><code>*italic*</code> or <code>Ctrl+I</code> for <em>italic</em></li>
          <li><code>`code`</code> for <code>inline code</code></li>
          <li><code>- item</code> for bullet lists</li>
          <li><code>1. item</code> for numbered lists</li>
          <li><code>&gt; quote</code> for blockquotes</li>
          <li><code>```</code> for code blocks</li>
          <li><code>~~strikethrough~~</code> for <del>strikethrough</del></li>
        </ul>
      </div>
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={(message) => {
          setSessions(prev => [{
            ...prev[0],
            conversations: [
              ...prev[0].conversations,
              {
                id: Date.now().toString(),
                createdAt: new Date(),
                question: message,
                response: 'Message received!'
              }
            ]
          }]);
        }}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            placeholder="Try typing formatted text inline..."
            enableRichText
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const AllFeaturesCombined = () => {
  const [sessions, setSessions] = useState<Session[]>([emptySession]);
  const [lastAction, setLastAction] = useState<string>('');

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
      <div className="mb-4 text-sm text-gray-500">
        <strong>All features enabled with inline rich text:</strong>
        <ul className="mt-2 list-disc ml-6">
          <li>Type <code>/</code> for slash commands</li>
          <li>Type <code>@</code> for mentions</li>
          <li>Use markdown formatting inline (bold, italic, lists, code)</li>
        </ul>
        {lastAction && (
          <div className="mt-2 text-blue-500">
            Last action: {lastAction}
          </div>
        )}
      </div>
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={(message) => {
          setSessions(prev => [{
            ...prev[0],
            conversations: [
              ...prev[0].conversations,
              {
                id: Date.now().toString(),
                createdAt: new Date(),
                question: message,
                response: 'This is a sample response with all features.'
              }
            ]
          }]);
          setLastAction(`Sent message: "${message.substring(0, 50)}..."`);
        }}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            placeholder="Type your message... (try / or @ or **bold**)"
            slashCommands={sampleSlashCommands}
            mentions={sampleMentions}
            enableRichText
            onSlashCommand={(cmd) => {
              setLastAction(`Slash command: /${cmd.command}`);
            }}
            onMention={(mention) => {
              setLastAction(`Mentioned: @${mention.name}`);
            }}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const CustomSlashCommandMenu = () => {
  const [sessions, setSessions] = useState<Session[]>([emptySession]);

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
      <div className="mb-4 text-sm text-gray-500">
        <strong>Custom Menu Renderer:</strong> This example shows how to
        use a custom renderer for the slash command menu.
      </div>
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            placeholder="Type / to see custom menu..."
            slashCommands={sampleSlashCommands}
            renderSlashCommandMenu={({ commands, activeIndex, onSelect, onClose }) => (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-1 shadow-xl">
                <div className="bg-gray-900 rounded-md p-2">
                  <div className="text-xs text-gray-400 mb-2 px-2">
                    ✨ Custom Menu Style
                  </div>
                  {commands.map((cmd, index) => (
                    <div
                      key={cmd.id}
                      className={`px-3 py-2 rounded cursor-pointer transition-all ${
                        index === activeIndex
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                      onClick={() => onSelect(cmd)}
                    >
                      <div className="font-medium">/{cmd.command}</div>
                      <div className="text-xs opacity-70">{cmd.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const AsyncMentions = () => {
  const [sessions, setSessions] = useState<Session[]>([emptySession]);

  // Simulated async data fetching
  const fetchMentions = async (query: string): Promise<Mention[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const allMentions: Mention[] = [
      { id: '1', name: 'Alice Johnson', description: 'Engineering' },
      { id: '2', name: 'Bob Smith', description: 'Design' },
      { id: '3', name: 'Charlie Brown', description: 'Product' },
      { id: '4', name: 'Diana Ross', description: 'Marketing' },
      { id: '5', name: 'Edward Norton', description: 'Sales' }
    ];

    if (!query) return allMentions;

    return allMentions.filter(m =>
      m.name.toLowerCase().includes(query.toLowerCase())
    );
  };

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
      <div className="mb-4 text-sm text-gray-500">
        <strong>Async Mentions:</strong> This example demonstrates loading
        mentions from an async data source with a loading indicator.
      </div>
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            placeholder="Type @ to load mentions asynchronously..."
            mentions={[
              {
                trigger: '@',
                data: fetchMentions
              }
            ]}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const DisabledCommands = () => {
  const [sessions, setSessions] = useState<Session[]>([emptySession]);

  const commandsWithDisabled: SlashCommand[] = [
    {
      id: 'active',
      command: 'active',
      label: 'Active Command',
      description: 'This command is available'
    },
    {
      id: 'disabled',
      command: 'disabled',
      label: 'Disabled Command',
      description: 'This command is not available',
      disabled: true
    },
    {
      id: 'premium',
      command: 'premium',
      label: 'Premium Feature',
      description: 'Upgrade to unlock this feature',
      disabled: true
    }
  ];

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
      <div className="mb-4 text-sm text-gray-500">
        <strong>Disabled Commands:</strong> Some commands can be disabled
        (e.g., for premium features or unavailable actions).
      </div>
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            placeholder="Type / to see disabled commands..."
            slashCommands={commandsWithDisabled}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
