import React from 'react';
import { Meta } from '@storybook/react';
import { Sessions, Session } from '../src';
import { Card } from 'reablocks';
import { subDays, subWeeks, subMonths, subYears } from 'date-fns';

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
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: 'black', borderRadius: 5 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        isLoading={false}
        responseTransformers={[]}
        onDeleteSession={() => {}}
      />
    </div>
  );
};

export const NewSessionContent = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: 'black', borderRadius: 5 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        isLoading={false}
        newSessionContent={
          <div className="text-lg w-full text-center">
            Type a question to get a response...
          </div>
        }
        responseTransformers={[]}
        onDeleteSession={() => {}}
      />
    </div>
  );
};

export const DefaultSession = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: 'black', borderRadius: 5 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        activeSessionId="1"
        isLoading={false}
        responseTransformers={[]}
        onDeleteSession={() => {}}
      />
    </div>
  );
};

export const Companion = () => {
  return (
    <Card style={{ width: 350 }} disablePadding>
      <Sessions
        viewType="companion"
        sessions={fakeSessions}
        isLoading={false}
        responseTransformers={[]}
        onDeleteSession={() => {}}
      />
    </Card>
  );
};

export const ResponseTransformer = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: 'black', borderRadius: 5 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        activeSessionId="1"
        isLoading={false}
        responseTransformers={[
          (response, next) => next(response.toUpperCase())
        ]}
        onDeleteSession={() => {}}
      />
    </div>
  );
};

export const Loading = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: 'black', borderRadius: 5 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        isLoading={true}
        responseTransformers={[]}
        onDeleteSession={() => {}}
      />
    </div>
  );
};

export const FileUploads = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: 'black', borderRadius: 5 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        activeSessionId="1"
        allowedFiles={['.pdf', '.docx']}
        onDeleteSession={() => {}}
      />
    </div>
  );
};

export const DefaultInputValue = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: 'black', borderRadius: 5 }}>
      <Sessions
        viewType="console"
        inputDefaultValue="Pre-populate the prompt via the default value property"
        sessions={fakeSessions}
        activeSessionId="1"
        onDeleteSession={() => {}}
      />
    </div>
  );
};

export const UndeleteableSessions = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: 'black', borderRadius: 5 }}>
      <Sessions
        viewType="console"
        sessions={fakeSessions}
        activeSessionId="1"
        onDeleteSession={null}
      />
    </div>
  );
};

export const SessionGrouping = () => {
  const createSessionWithDate = (id: string, title: string, daysAgo: number): Session => ({
    id,
    title,
    createdAt: subDays(new Date(), daysAgo),
    updatedAt: subDays(new Date(), daysAgo),
    conversations: [
      { id: `${id}-1`, question: 'Sample question', response: 'Sample response', createdAt: subDays(new Date(), daysAgo), updatedAt: subDays(new Date(), daysAgo) },
    ],
  });

  const sessionsWithVariousDates: Session[] = [
    createSessionWithDate('1', 'Today Session', 0),
    createSessionWithDate('2', 'Yesterday Session', 1),
    createSessionWithDate('2', 'Yesterday Session 2', 1),
    createSessionWithDate('3', 'Last Week Session', 6),
    createSessionWithDate('4', 'Two Weeks Ago Session', 14),
    createSessionWithDate('5', 'Last Month Session', 32),
    createSessionWithDate('6', 'Two Months Ago Session', 65),
    createSessionWithDate('7', 'Six Months Ago Session', 180),
    createSessionWithDate('8', 'Last Year Session', 370),
    createSessionWithDate('9', 'Two Years Ago Session', 740),
  ];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: 'black', borderRadius: 5 }}>
      <Sessions
        viewType="console"
        sessions={sessionsWithVariousDates}
        isLoading={false}
        responseTransformers={[]}
        onDeleteSession={() => {}}
      />
    </div>
  );
};

export const HundredSessions = () => {
  const generateFakeSessions = (count: number): Session[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `session-${index + 1}`,
      title: `Session ${index + 1}`,
      createdAt: subDays(new Date(), index),
      updatedAt: subDays(new Date(), index),
      conversations: [
        {
          id: `conv-${index}-1`,
          question: `Question for session ${index + 1}`,
          response: `Response for session ${index + 1}`,
          createdAt: subDays(new Date(), index),
          updatedAt: subDays(new Date(), index)
        }
      ]
    }));
  };

  const hundredSessions = generateFakeSessions(100);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 20, margin: 20, background: 'black', borderRadius: 5 }}>
      <Sessions
        viewType="console"
        sessions={hundredSessions}
        isLoading={false}
        responseTransformers={[]}
        onDeleteSession={() => {}}
      />
    </div>
  );
};
