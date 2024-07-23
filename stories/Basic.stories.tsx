import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Sessions, SessionsProps, Session } from '../src';

export default {
  title: 'Examples',
  component: Sessions,
  decorators: [
    (Story) => (
      <div style={{ width: '750px' }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

const Template: StoryFn<SessionsProps> = (args) => <Sessions {...args} />;

const fakeSessions: Session[] = [
  {
    id: '1',
    title: 'Session 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: [
      { id: '1', question: 'What is React?', response: 'React is a JavaScript library for building user interfaces.', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', question: 'What is JSX?', response: 'JSX is a syntax extension for JavaScript.', createdAt: new Date(), updatedAt: new Date() },
    ],
  },
  {
    id: '2',
    title: 'Session 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: [
      { id: '1', question: 'What is TypeScript?', response: 'TypeScript is a typed superset of JavaScript.', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', question: 'What is a component?', response: 'A component is a reusable piece of UI.', createdAt: new Date(), updatedAt: new Date() },
    ],
  },
];

export const Console = Template.bind({});
Console.args = {
  viewType: 'console',
  sessions: fakeSessions,
  activeSessionId: '1',
  isLoading: false,
  onSelectSession: (sessionId: string) => console.log(`Selected session: ${sessionId}`),
  onDeleteSession: (sessionId: string) => console.log(`Deleted session: ${sessionId}`),
  onSendMessage: (message: string) => console.log(`Sent message: ${message}`),
  responseTransformers: []
};

export const Companion = Template.bind({});
Companion.args = {
  viewType: 'companion',
  sessions: fakeSessions,
  activeSessionId: '1',
  isLoading: false,
  onSelectSession: (sessionId: string) => console.log(`Selected session: ${sessionId}`),
  onDeleteSession: (sessionId: string) => console.log(`Deleted session: ${sessionId}`),
  onSendMessage: (message: string) => console.log(`Sent message: ${message}`),
  responseTransformers: []
};

export const ResponseTransformer = Template.bind({});
ResponseTransformer.args = {
  viewType: 'console',
  sessions: fakeSessions,
  activeSessionId: '1',
  isLoading: false,
  onSelectSession: (sessionId: string) => console.log(`Selected session: ${sessionId}`),
  onDeleteSession: (sessionId: string) => console.log(`Deleted session: ${sessionId}`),
  onSendMessage: (message: string) => console.log(`Sent message: ${message}`),
  responseTransformers: [
    (response, next) => next(response.toUpperCase()), // Example transformer
  ],
};
