import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { BasicInput } from '../src';
import { ChatContext } from '../src/ChatContext';
import { chatTheme } from '../src/theme';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChatContext.Provider
    value={{ sessions: [], activeSessionId: null, theme: chatTheme }}
  >
    {children}
  </ChatContext.Provider>
);

export default {
  title: 'Components/BasicInput',
  component: BasicInput,
  decorators: [
    Story => (
      <Wrapper>
        <Story />
      </Wrapper>
    )
  ],
  parameters: {
    layout: 'centered'
  }
} as Meta<typeof BasicInput>;

type Story = StoryObj<typeof BasicInput>;

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [submitted, setSubmitted] = useState('');

    return (
      <div className="w-[400px] space-y-4">
        <div className="p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-700">
          <BasicInput
            placeholder="Type a message..."
            value={value}
            onChange={setValue}
            onSubmit={text => {
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

export const WithDefaultValue: Story = {
  render: () => {
    const [value, setValue] = useState('Hello, this is a pre-filled message!');
    const [submitted, setSubmitted] = useState('');

    return (
      <div className="w-[400px] space-y-4">
        <div className="p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-700">
          <BasicInput
            placeholder="Type a message..."
            value={value}
            onChange={setValue}
            onSubmit={text => {
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

export const MultiLine: Story = {
  render: () => {
    const [value, setValue] = useState(
      `Line one of the message.
Line two of the message.
Line three of the message.
Line four - you should scroll to see this.`
    );

    return (
      <div className="w-[400px] space-y-4">
        <div className="p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-700">
          <BasicInput
            placeholder="Type a multi-line message..."
            value={value}
            onChange={setValue}
            minRows={4}
            maxRows={4}
            onSubmit={text => {
              console.log('Submitted:', text);
              setValue('');
            }}
          />
        </div>
      </div>
    );
  }
};

export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-[400px]">
        <div className="p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-700">
          <BasicInput
            placeholder="This input is disabled..."
            disabled
          />
        </div>
      </div>
    );
  }
};
