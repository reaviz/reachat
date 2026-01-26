import { Meta } from '@storybook/react';
import {
  Chat,
  SessionMessages,
  ChatInput,
  SessionMessagePanel,
  SessionsList,
  NewSessionButton,
  SessionGroups,
  SessionMessagesHeader,
  Session,
  remarkRedact,
  commonRedactMatchers
} from '../src';
import { subHours } from 'date-fns';

export default {
  title: 'Demos/Redact',
  component: Chat
} as Meta;

export const RedactExample = () => {
  const markdownQuestion = `# User Information

Please help me with the following sensitive data:

- My SSN is 123-45-6789
- Credit card: 4532-1234-5678-9010
- Bitcoin address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

Can you help me process this information?`;

  const markdownResponse = `## Analysis

I can see you've provided:
- SSN: 123-45-6789
- Credit Card: 4532-1234-5678-9010
- Bitcoin: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa

**Note:** All sensitive information has been automatically redacted in the UI for your security.`;

  const sessionWithRedaction: Session[] = [
    {
      id: 'session-redact',
      title: 'Redaction Showcase',
      createdAt: subHours(new Date(), 1),
      updatedAt: new Date(),
      conversations: [
        {
          id: 'conversation-1',
          question: markdownQuestion,
          response: markdownResponse,
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
        sessions={sessionWithRedaction}
        activeSessionId="session-redact"
        remarkPlugins={[remarkRedact(commonRedactMatchers)]}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const CustomMatchers = () => {
  const markdownQuestion = `# Custom Redaction

This example shows custom matchers:

- Email: test@example.com
- Phone: (555) 123-4567
- Custom pattern: SECRET-12345`;

  const markdownResponse = `I can see you've provided:
- Email: test@example.com
- Phone: (555) 123-4567
- Custom: SECRET-12345`;

  // Custom matchers using the new pattern-based API
  const customMatchers = [
    {
      name: 'Email',
      pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    },
    {
      name: 'Phone',
      pattern: /\b\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g
    },
    {
      name: 'Secret Code',
      pattern: /\bSECRET-\d+\b/g
    },
    ...commonRedactMatchers
  ];

  const sessionWithCustom: Session[] = [
    {
      id: 'session-custom',
      title: 'Custom Matchers',
      createdAt: subHours(new Date(), 1),
      updatedAt: new Date(),
      conversations: [
        {
          id: 'conversation-1',
          question: markdownQuestion,
          response: markdownResponse,
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
        sessions={sessionWithCustom}
        activeSessionId="session-custom"
        remarkPlugins={[remarkRedact(customMatchers)]}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};
