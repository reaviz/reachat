import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Sessions, SessionsProps, Session } from '../src';

export default {
  title: 'Components/Sessions',
  component: Sessions,
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

export const Default = Template.bind({});

Default.args = {
  viewType: 'full',
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
