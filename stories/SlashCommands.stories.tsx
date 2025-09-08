import { useState } from 'react';
import { Meta } from '@storybook/react';
import {
  Chat,
  Session,
  SessionsList,
  SessionsGroup,
  SessionListItem,
  NewSessionButton,
  SessionMessages,
  SessionGroups,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader,
  SlashCommand
} from '../src';
import { subHours } from 'date-fns';
import HelpIcon from './assets/menu.svg?react';
import CodeIcon from './assets/file.svg?react';

export default {
  title: 'Demos/Slash Commands',
  component: Chat
} as Meta;

const BugIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const ClearIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

export const SimpleCommands = () => {
  const simpleCommands: SlashCommand[] = [
    { id: '1', label: 'help', value: 'help' },
    { id: '2', label: 'clear', value: 'clear' },
    { id: '3', label: 'settings', value: 'settings' },
    { id: '4', label: 'about', value: 'about' },
    { id: '5', label: 'version', value: 'version' }
  ];

  const sessions: Session[] = [
    {
      id: '1',
      title: 'Slash Commands Demo',
      createdAt: subHours(new Date(), 1),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question: 'How do slash commands work?',
          response: 'Type "/" to trigger the command menu. You can filter commands by typing after the slash.',
          createdAt: new Date()
        }
      ]
    }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        position: 'absolute',
        inset: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        sessions={sessions}
        activeSessionId="1"
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            commands={simpleCommands}
            onCommandSelect={(cmd) => console.log('Selected command:', cmd)}
            placeholder="Type / for commands"
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const RichCommands = () => {
  const richCommands: SlashCommand[] = [
    {
      id: 'bug',
      label: 'bug',
      value: 'Bug Report:\nDescription:\nSteps to Reproduce:\n1. ',
      description: 'Create a bug report',
      icon: <BugIcon />
    },
    {
      id: 'code',
      label: 'code',
      value: '```\n\n```',
      description: 'Insert code block',
      icon: <CodeIcon />
    },
    {
      id: 'help',
      label: 'help',
      value: 'How can I help you today?',
      description: 'Get help',
      icon: <HelpIcon />
    },
    {
      id: 'clear',
      label: 'clear',
      value: '/clear',
      description: 'Clear the chat',
      icon: <ClearIcon />,
      action: () => alert('Clear action triggered!')
    }
  ];

  const sessions: Session[] = [
    {
      id: '1',
      title: 'Rich Commands Demo',
      createdAt: subHours(new Date(), 1),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question: 'What are rich commands?',
          response: 'Rich commands can include descriptions, icons, and custom actions. Try typing "/" to see them!',
          createdAt: new Date()
        }
      ]
    }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        position: 'absolute',
        inset: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        sessions={sessions}
        activeSessionId="1"
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            commands={richCommands}
            onCommandSelect={(cmd) => console.log('Selected command:', cmd)}
            placeholder="Type / for commands"
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const ConditionalCommands = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const conditionalCommands: SlashCommand[] = [
    { id: '1', label: 'help', value: 'help', description: 'Get help' },
    { id: '2', label: 'clear', value: 'clear', description: 'Clear the chat' },
    {
      id: '3',
      label: 'admin',
      value: 'admin',
      description: 'Admin commands',
      visible: isAdmin
    },
    {
      id: '4',
      label: 'debug',
      value: 'debug',
      description: 'Debug mode',
      visible: () => isAdmin
    }
  ];

  const sessions: Session[] = [
    {
      id: '1',
      title: 'Conditional Commands',
      createdAt: subHours(new Date(), 1),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question: 'How do conditional commands work?',
          response: 'Commands can be shown or hidden based on conditions. Toggle admin mode above to see admin commands.',
          createdAt: new Date()
        }
      ]
    }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        position: 'absolute',
        inset: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <div style={{ marginBottom: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          {' '}Admin Mode
        </label>
      </div>

      <Chat
        sessions={sessions}
        activeSessionId="1"
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            commands={conditionalCommands}
            onCommandSelect={(cmd) => console.log('Selected command:', cmd)}
            placeholder="Type / for commands"
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const FilteredCommands = () => {
  const manyCommands: SlashCommand[] = Array.from({ length: 20 }, (_, i) => ({
    id: `cmd-${i}`,
    label: `command${i}`,
    value: `Command ${i} executed`,
    description: `This is command number ${i}`
  }));

  const customFilter = (command: SlashCommand, query: string) => {
    return command.label.includes(query) ||
           ('description' in command && command.description && command.description.toLowerCase().includes(query.toLowerCase()));
  };

  const sessions: Session[] = [
    {
      id: '1',
      title: 'Filtered Commands',
      createdAt: subHours(new Date(), 1),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question: 'How does filtering work?',
          response: 'Commands are filtered using fuzzy search. You can also provide a custom filter function.',
          createdAt: new Date()
        }
      ]
    }
  ];

  return (
    <div
      className="dark:bg-gray-950 bg-white"
      style={{
        position: 'absolute',
        inset: 0,
        padding: 20,
        margin: 20,
        borderRadius: 5
      }}
    >
      <Chat
        sessions={sessions}
        activeSessionId="1"
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput
            commands={manyCommands}
            commandFilter={customFilter}
            maxCommandsVisible={5}
            onCommandSelect={(cmd) => console.log('Selected command:', cmd)}
            placeholder="Type / for commands (showing max 5)"
          />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
