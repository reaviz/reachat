import React from 'react';
import { Meta } from '@storybook/react';
import { Sessions, Session } from '../src';

export default {
  title: 'Examples',
  component: Sessions
} as Meta;

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

export const Console = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        activeSessionId="1"
        isLoading={false}
        responseTransformers={[]}
      />
    </div>
  );
};

export const Companion = () => {
  return (
    <div style={{ width: 350 }}>
      <Sessions
        viewType="companion"
        sessions={fakeSessions}
        activeSessionId="1"
        isLoading={false}
        responseTransformers={[]}
      />
    </div>
  );
};

export const ResponseTransformer = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        activeSessionId="1"
        isLoading={false}
        responseTransformers={[
          (response, next) => next(response.toUpperCase())
        ]}
      />
    </div>
  );
};

export const Loading = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        activeSessionId="1"
        isLoading={true}
        responseTransformers={[]}
      />
    </div>
  );
};

export const FileUploads = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        activeSessionId="1"
        allowedFiles={['.pdf', '.docx']}
      />
    </div>
  );
};

export const DefaultInputValue = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20 }}>
      <Sessions
        viewType="console"
        inputDefaultValue="Pre-populate the prompt via the default value property"
        sessions={fakeSessions}
        activeSessionId="1"
      />
    </div>
  );
};
