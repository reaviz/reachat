import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { RichTextInput, MentionItem, SlashCommandItem } from '../src';
import { ChatContext } from '../src/ChatContext';
import { chatTheme } from '../src/theme';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const sampleMentions: MentionItem[] = [
  { id: '1', label: 'John Doe', description: 'Engineering', icon: <UserIcon /> },
  { id: '2', label: 'Jane Smith', description: 'Design', icon: <UserIcon /> },
  { id: '3', label: 'Bob Wilson', description: 'Product', icon: <UserIcon /> }
];

const sampleCommands: SlashCommandItem[] = [
  { id: 'help', label: 'help', description: 'Show available commands', icon: <HelpIcon />, shortcut: '?' },
  { id: 'clear', label: 'clear', description: 'Clear the conversation', icon: <ClearIcon /> },
  { id: 'image', label: 'image', description: 'Generate an image', icon: <ImageIcon /> },
  { id: 'code', label: 'code', description: 'Generate code snippet', icon: <CodeIcon /> }
];

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChatContext.Provider value={{ sessions: [], activeSessionId: null, theme: chatTheme }}>
    {children}
  </ChatContext.Provider>
);

export default {
  title: 'Components/RichTextInput',
  component: RichTextInput,
  decorators: [
    (Story) => (
      <Wrapper>
        <Story />
      </Wrapper>
    )
  ],
  parameters: {
    layout: 'centered'
  }
} as Meta<typeof RichTextInput>;

type Story = StoryObj<typeof RichTextInput>;

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState('');

    return (
      <div className="w-[400px] space-y-4">
        <div className="p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-700">
          <RichTextInput
            placeholder="Type a message..."
            value={value}
            onChange={setValue}
            onSubmit={(text) => {
              setSubmitted(text);
              setValue('');
            }}
          />
        </div>
        <div className="text-sm space-y-2">
          <div className="flex gap-2">
            <span className="text-gray-500 w-20">onChange:</span>
            <code className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded flex-1 min-h-[24px]">
              {value || '(empty)'}
            </code>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-20">onSubmit:</span>
            <code className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded flex-1 min-h-[24px]">
              {submitted || '(press Enter to submit)'}
            </code>
          </div>
        </div>
      </div>
    );
  }
};

export const WithMentions: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState('');

    return (
      <div className="w-[400px] space-y-4">
        <div className="p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-700">
          <RichTextInput
            placeholder="Type @ to mention someone..."
            value={value}
            onChange={setValue}
            mentions={{
              trigger: '@',
              items: sampleMentions
            }}
            onSubmit={(text) => {
              setSubmitted(text);
              setValue('');
            }}
          />
        </div>
        <div className="text-sm space-y-2">
          <div className="flex gap-2">
            <span className="text-gray-500 w-20">onChange:</span>
            <code className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded flex-1 min-h-[24px]">
              {value || '(empty)'}
            </code>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-20">onSubmit:</span>
            <code className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded flex-1 min-h-[24px]">
              {submitted || '(press Enter to submit)'}
            </code>
          </div>
        </div>
      </div>
    );
  }
};

export const WithSlashCommands: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState('');

    return (
      <div className="w-[400px] space-y-4">
        <div className="p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-700">
          <RichTextInput
            placeholder="Type / for commands..."
            value={value}
            onChange={setValue}
            commands={{
              trigger: '/',
              items: sampleCommands
            }}
            onSubmit={(text) => {
              setSubmitted(text);
              setValue('');
            }}
          />
        </div>
        <div className="text-sm space-y-2">
          <div className="flex gap-2">
            <span className="text-gray-500 w-20">onChange:</span>
            <code className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded flex-1 min-h-[24px]">
              {value || '(empty)'}
            </code>
          </div>
          <div className="flex gap-2">
            <span className="text-gray-500 w-20">onSubmit:</span>
            <code className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded flex-1 min-h-[24px]">
              {submitted || '(press Enter to submit)'}
            </code>
          </div>
        </div>
      </div>
    );
  }
};
