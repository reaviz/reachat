import { useState } from 'react';
import { Meta } from '@storybook/react';
import {
  Chat,
  Session,
  SessionsList,
  NewSessionButton,
  SessionMessages,
  SessionGroups,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader,
  TriggerConfig,
  TriggerOption,
  SelectedTrigger
} from '../src';
import { subHours } from 'date-fns';

export default {
  title: 'Demos/Triggers',
  component: ChatInput
} as Meta;

const baseSession: Session[] = [
  {
    id: 'session-1',
    title: 'Triggers Demo',
    createdAt: subHours(new Date(), 1),
    updatedAt: new Date(),
    conversations: []
  }
];

const mentionOptions: TriggerOption[] = [
  { id: '1', label: 'John Doe', description: 'Engineering' },
  { id: '2', label: 'Jane Smith', description: 'Design' },
  { id: '3', label: 'Bob Wilson', description: 'Product' },
  { id: '4', label: 'Alice Brown', description: 'Marketing' },
  { id: '5', label: 'Charlie Davis', description: 'Sales' }
];

const commandOptions: TriggerOption[] = [
  { id: 'help', label: 'help', description: 'Show available commands' },
  { id: 'clear', label: 'clear', description: 'Clear the conversation' },
  { id: 'export', label: 'export', description: 'Export chat history' },
  { id: 'settings', label: 'settings', description: 'Open settings' },
  { id: 'theme', label: 'theme', description: 'Change theme' }
];

export const BasicMentions = () => {
  const [sessions, setSessions] = useState<Session[]>(baseSession);

  const triggers: TriggerConfig[] = [
    {
      char: '@',
      options: mentionOptions
    }
  ];

  const handleSendMessage = (message: string) => {
    setSessions(prev => [
      {
        ...prev[0],
        conversations: [
          ...prev[0].conversations,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            question: message,
            response: `You mentioned someone in your message: "${message}"`
          }
        ]
      }
    ]);
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
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={handleSendMessage}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Type @ to mention someone</p>
              </div>
            }
          />
          <ChatInput
            placeholder="Type @ to mention someone..."
            triggers={triggers}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const BasicCommands = () => {
  const [sessions, setSessions] = useState<Session[]>(baseSession);

  const triggers: TriggerConfig[] = [
    {
      char: '/',
      options: commandOptions
    }
  ];

  const handleSendMessage = (message: string) => {
    setSessions(prev => [
      {
        ...prev[0],
        conversations: [
          ...prev[0].conversations,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            question: message,
            response: `Command received: "${message}"`
          }
        ]
      }
    ]);
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
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={handleSendMessage}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Type / to use a command</p>
              </div>
            }
          />
          <ChatInput
            placeholder="Type / to use a command..."
            triggers={triggers}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const MentionsAndCommands = () => {
  const [sessions, setSessions] = useState<Session[]>(baseSession);
  const [lastTriggers, setLastTriggers] = useState<SelectedTrigger[]>([]);

  const triggers: TriggerConfig[] = [
    {
      char: '@',
      options: mentionOptions
    },
    {
      char: '/',
      options: commandOptions
    }
  ];

  const handleSendMessage = (message: string) => {
    setSessions(prev => [
      {
        ...prev[0],
        conversations: [
          ...prev[0].conversations,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            question: message,
            response:
              lastTriggers.length > 0
                ? `Triggers used: ${lastTriggers.map(t => `${t.trigger}${t.option.label}`).join(', ')}`
                : `Message received: "${message}"`
          }
        ]
      }
    ]);
    setLastTriggers([]);
  };

  const handleTriggerSelect = (trigger: SelectedTrigger) => {
    setLastTriggers(prev => [...prev, trigger]);
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
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={handleSendMessage}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Type @ to mention someone or / for commands</p>
              </div>
            }
          />
          <ChatInput
            placeholder="Type @ or / ..."
            triggers={triggers}
            onTriggerSelect={handleTriggerSelect}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const AsyncOptions = () => {
  const [sessions, setSessions] = useState<Session[]>(baseSession);

  const fetchUsers = async (query: string): Promise<TriggerOption[]> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const allUsers: TriggerOption[] = [
      { id: '1', label: 'Alice Johnson', description: 'alice@example.com' },
      { id: '2', label: 'Bob Smith', description: 'bob@example.com' },
      { id: '3', label: 'Carol Williams', description: 'carol@example.com' },
      { id: '4', label: 'David Brown', description: 'david@example.com' },
      { id: '5', label: 'Eve Davis', description: 'eve@example.com' },
      { id: '6', label: 'Frank Miller', description: 'frank@example.com' },
      { id: '7', label: 'Grace Wilson', description: 'grace@example.com' },
      { id: '8', label: 'Henry Taylor', description: 'henry@example.com' }
    ];

    if (!query) return allUsers;

    return allUsers.filter(
      user =>
        user.label.toLowerCase().includes(query.toLowerCase()) ||
        user.description?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const triggers: TriggerConfig[] = [
    {
      char: '@',
      getOptions: fetchUsers,
      loadingText: 'Searching users...',
      noResultsText: 'No users found'
    }
  ];

  const handleSendMessage = (message: string) => {
    setSessions(prev => [
      {
        ...prev[0],
        conversations: [
          ...prev[0].conversations,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            question: message,
            response: `Message with async mentions: "${message}"`
          }
        ]
      }
    ]);
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
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={handleSendMessage}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Type @ to search users (async loading)</p>
              </div>
            }
          />
          <ChatInput
            placeholder="Type @ to search users..."
            triggers={triggers}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const CustomTrigger = () => {
  const [sessions, setSessions] = useState<Session[]>(baseSession);

  const emojiOptions: TriggerOption[] = [
    { id: 'smile', label: '😊', description: 'Smile' },
    { id: 'laugh', label: '😂', description: 'Laugh' },
    { id: 'heart', label: '❤️', description: 'Heart' },
    { id: 'thumbsup', label: '👍', description: 'Thumbs up' },
    { id: 'fire', label: '🔥', description: 'Fire' },
    { id: 'rocket', label: '🚀', description: 'Rocket' },
    { id: 'star', label: '⭐', description: 'Star' },
    { id: 'check', label: '✅', description: 'Check mark' }
  ];

  const triggers: TriggerConfig[] = [
    {
      char: ':',
      options: emojiOptions,
      noResultsText: 'No emojis found'
    }
  ];

  const handleSendMessage = (message: string) => {
    setSessions(prev => [
      {
        ...prev[0],
        conversations: [
          ...prev[0].conversations,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            question: message,
            response: `Message with emojis: "${message}"`
          }
        ]
      }
    ]);
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
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={handleSendMessage}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Type : to insert an emoji</p>
              </div>
            }
          />
          <ChatInput placeholder="Type : for emojis..." triggers={triggers} />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const AllowSpaces = () => {
  const [sessions, setSessions] = useState<Session[]>(baseSession);

  const projectOptions: TriggerOption[] = [
    {
      id: '1',
      label: 'Project Alpha',
      description: 'Main development project'
    },
    { id: '2', label: 'Project Beta', description: 'Testing environment' },
    { id: '3', label: 'Project Gamma', description: 'Production release' },
    { id: '4', label: 'Internal Tools', description: 'Developer utilities' },
    { id: '5', label: 'Customer Portal', description: 'Client-facing app' }
  ];

  const triggers: TriggerConfig[] = [
    {
      char: '#',
      options: projectOptions,
      allowSpaces: true,
      noResultsText: 'No projects found'
    }
  ];

  const handleSendMessage = (message: string) => {
    setSessions(prev => [
      {
        ...prev[0],
        conversations: [
          ...prev[0].conversations,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            question: message,
            response: `Project reference: "${message}"`
          }
        ]
      }
    ]);
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
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={handleSendMessage}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Type # to reference a project (supports spaces)</p>
              </div>
            }
          />
          <ChatInput
            placeholder="Type # to reference a project..."
            triggers={triggers}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const WithMetadata = () => {
  const [sessions, setSessions] = useState<Session[]>(baseSession);
  const [selectedInfo, setSelectedInfo] = useState<string>('');

  const teamOptions: TriggerOption[] = [
    {
      id: '1',
      label: 'Engineering',
      description: '12 members',
      metadata: { memberCount: 12, lead: 'John Doe', budget: 500000 }
    },
    {
      id: '2',
      label: 'Design',
      description: '8 members',
      metadata: { memberCount: 8, lead: 'Jane Smith', budget: 300000 }
    },
    {
      id: '3',
      label: 'Product',
      description: '5 members',
      metadata: { memberCount: 5, lead: 'Bob Wilson', budget: 200000 }
    }
  ];

  const triggers: TriggerConfig[] = [
    {
      char: '@',
      options: teamOptions
    }
  ];

  const handleSendMessage = (message: string) => {
    setSessions(prev => [
      {
        ...prev[0],
        conversations: [
          ...prev[0].conversations,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            question: message,
            response: selectedInfo || `Message: "${message}"`
          }
        ]
      }
    ]);
    setSelectedInfo('');
  };

  const handleTriggerSelect = (trigger: SelectedTrigger) => {
    const meta = trigger.option.metadata;
    if (meta) {
      setSelectedInfo(
        `Selected team: ${trigger.option.label}\n` +
          `Members: ${meta.memberCount}\n` +
          `Lead: ${meta.lead}\n` +
          `Budget: $${meta.budget?.toLocaleString()}`
      );
    }
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
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={handleSendMessage}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Type @ to mention a team (includes metadata)</p>
              </div>
            }
          />
          <ChatInput
            placeholder="Type @ to mention a team..."
            triggers={triggers}
            onTriggerSelect={handleTriggerSelect}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const LongList = () => {
  const [sessions, setSessions] = useState<Session[]>(baseSession);

  const manyOptions: TriggerOption[] = Array.from({ length: 50 }, (_, i) => ({
    id: `user-${i + 1}`,
    label: `User ${i + 1}`,
    description: `user${i + 1}@example.com`
  }));

  const triggers: TriggerConfig[] = [
    {
      char: '@',
      options: manyOptions,
      noResultsText: 'No users found'
    }
  ];

  const handleSendMessage = (message: string) => {
    setSessions(prev => [
      {
        ...prev[0],
        conversations: [
          ...prev[0].conversations,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            question: message,
            response: `Message: "${message}"`
          }
        ]
      }
    ]);
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
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={handleSendMessage}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Type @ to see a scrollable list (50 users)</p>
              </div>
            }
          />
          <ChatInput
            placeholder="Type @ to mention a user..."
            triggers={triggers}
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const CompanionView = () => {
  const [sessions, setSessions] = useState<Session[]>(baseSession);

  const triggers: TriggerConfig[] = [
    {
      char: '@',
      options: mentionOptions
    },
    {
      char: '/',
      options: commandOptions
    }
  ];

  const handleSendMessage = (message: string) => {
    setSessions(prev => [
      {
        ...prev[0],
        conversations: [
          ...prev[0].conversations,
          {
            id: Date.now().toString(),
            createdAt: new Date(),
            question: message,
            response: `Response to: "${message}"`
          }
        ]
      }
    ]);
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
        borderRadius: 5,
        maxWidth: 400,
        margin: '20px auto'
      }}
    >
      <Chat
        viewType="companion"
        sessions={sessions}
        activeSessionId="session-1"
        onSendMessage={handleSendMessage}
      >
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                <p className="text-center">Type @ or / to use triggers</p>
              </div>
            }
          />
          <ChatInput placeholder="Type @ or / ..." triggers={triggers} />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
