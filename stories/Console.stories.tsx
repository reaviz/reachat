import { useState, useRef, FC, useContext } from 'react';
import { Meta } from '@storybook/react';
import {
  Chat,
  Session,
  remarkCve,
  SessionsList,
  SessionsGroup,
  SessionListItem,
  NewSessionButton,
  SessionMessages,
  SessionGroups,
  ChatInput,
  SessionListItemProps,
  SessionMessagePanel,
  SessionMessagesHeader,
  ChatContext,
  SessionMessage,
  Conversation
} from '../src';
import {
  Card,
  Chip,
  cn,
  DateFormat,
  Divider,
  IconButton,
  List,
  ListItem,
  Menu
} from 'reablocks';
import { subDays, subMinutes, subHours } from 'date-fns';
import MenuIcon from '@/assets/menu.svg?react';
import Placeholder from '@/assets/placeholder.svg?react';
import PlaceholderDark from '@/assets/placeholder-dark.svg?react';
import { MessageActions } from '@/SessionMessages';
import { MessageFiles } from '@/SessionMessages';
import { MessageQuestion } from '@/SessionMessages';
import { MessageResponse } from '@/SessionMessages';
import { MessageSources } from '@/SessionMessages';
import {
  fakeSessions,
  fakeSessionsWithEmbeds,
  sessionWithSources,
  sessionsWithFiles,
  sessionsWithPartialConversation
} from './examples';

export default {
  title: 'Demos/Console',
  component: Chat
} as Meta;

export const Basic = () => {
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
        sessions={fakeSessions}
        viewType="console"
        onDeleteSession={() => alert('delete!')}
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

export const Embeds = () => {
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
        sessions={fakeSessionsWithEmbeds}
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
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const DefaultSession = () => {
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
        sessions={fakeSessions}
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
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const Loading = () => {
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
        isLoading
        viewType="console"
        sessions={sessionsWithPartialConversation}
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
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const FileUploads = () => {
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
        sessions={sessionsWithFiles}
        activeSessionId="session-files"
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput allowedFiles={['.pdf', '.docx']} />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const DefaultInputValue = () => {
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
        sessions={fakeSessions}
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
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const UndeleteableSessions = () => {
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
      <Chat viewType="console" sessions={fakeSessions} activeSessionId="1">
        <SessionsList>
          <NewSessionButton />
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} deletable={false} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
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

export const SessionGrouping = () => {
  const createSessionWithDate = (
    id: string,
    title: string,
    daysAgo: number
  ): Session => ({
    id,
    title,
    createdAt: subDays(new Date(), daysAgo),
    updatedAt: subDays(new Date(), daysAgo),
    conversations: [
      {
        id: `${id}-1`,
        question: 'Sample question',
        response: 'Sample response',
        createdAt: subDays(new Date(), daysAgo),
        updatedAt: subDays(new Date(), daysAgo)
      }
    ]
  });

  const sessionsWithVariousDates: Session[] = [
    createSessionWithDate('1', 'Today Session', 0),
    createSessionWithDate('2', 'Yesterday Session', 1),
    createSessionWithDate('3', 'Yesterday Session 2', 1),
    createSessionWithDate('4', 'Last Week Session', 6),
    createSessionWithDate('5', 'Two Weeks Ago Session', 14),
    createSessionWithDate('6', 'Last Month Session', 32),
    createSessionWithDate('7', 'Two Months Ago Session', 65),
    createSessionWithDate('8', 'Six Months Ago Session', 180),
    createSessionWithDate('9', 'Last Year Session', 370),
    createSessionWithDate('10', 'Two Years Ago Session', 740)
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
        sessions={sessionsWithVariousDates}
        isLoading={false}
        onDeleteSession={() => {}}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput placeholder="Send a message" />
        </SessionMessagePanel>
      </Chat>
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
      <Chat viewType="console" sessions={hundredSessions}>
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

export const HundredConversations = () => {
  const generateFakeConversations = (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `conv-${index + 1}`,
      question: `Question ${index + 1}: What is the meaning of life, the universe, and everything?`,
      response: `Answer ${index + 1}: According to The Hitchhiker's Guide to the Galaxy, it's 42. But in reality, that's a complex philosophical question that has puzzled humanity for centuries.`,
      createdAt: subMinutes(new Date(), count - index),
      updatedAt: subMinutes(new Date(), count - index)
    }));
  };

  const sessionWithHundredConversations: Session[] = [
    {
      id: 'session-100',
      title: 'Session with 100 Conversations',
      createdAt: subHours(new Date(), 5),
      updatedAt: new Date(),
      conversations: generateFakeConversations(100)
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
        sessions={sessionWithHundredConversations}
        activeSessionId="session-100"
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

export const LongSessionNames = () => {
  const generateFakeSessionsWithLongNames = (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `session-${index + 1}`,
      title: `Session ${index + 1}: This is a very long session name to test how the UI handles overflow and text wrapping in the session list. It should be truncated or wrapped appropriately to ensure a good user experience.`,
      createdAt: subHours(new Date(), count - index),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question:
            'Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics?',
          response:
            'Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics? Can you provide an in-depth explanation of the theory of relativity, including its historical context, key principles, mathematical foundations, experimental evidence, and its implications for our understanding of space, time, and gravity? Additionally, how does it relate to quantum mechanics, and what are the current challenges in reconciling these two fundamental theories of physics?',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }));
  };

  const sessionsWithLongNames = generateFakeSessionsWithLongNames(10);

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
        sessions={sessionsWithLongNames}
        activeSessionId="session-10"
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

export const MarkdownShowcase = () => {
  const markdownQuestion = `
  **What is the purpose of life?**
  `;

  const markdownResponse = `
  **The purpose of life is a philosophical question concerning the significance of life or existence in general.**

  1. Burning of fossil fuels (coal, oil, and natural gas)
  2. Deforestation and land-use changes
  3. Industrial processes
  4. Agriculture and livestock farming

  or

  - Burning
  - Deforestation
  - Industrial
  - Agriculture

  Here is a table to illustrate different perspectives:

  | Perspective       | Description                                                                 |
  |-------------------|-----------------------------------------------------------------------------|
  | Religious         | Belief in a higher power or divine purpose.                                 |
  | Philosophical     | Various theories including existentialism, nihilism, and absurdism.         |
  | Scientific        | Understanding life through biology, evolution, and the universe.            |
  | Personal          | Individual goals, happiness, and fulfillment.                               |

  \`\`\`python
  def purpose_of_life():
      return 42
  \`\`\`

  \`\`\`json
  {
    "perspectives": [
      {
        "type": "Religious",
        "description": "Belief in a higher power or divine purpose."
      },
      {
        "type": "Philosophical",
        "description": "Various theories including existentialism, nihilism, and absurdism."
      },
      {
        "type": "Scientific",
        "description": "Understanding life through biology, evolution, and the universe."
      },
      {
        "type": "Personal",
        "description": "Individual goals, happiness, and fulfillment."
      }
    ]
  }
  \`\`\`

  The answer to the ultimate question of life, the universe, and everything is **42**.

  \`\`\`math
  L = \\frac{1}{2} \\rho v^2 S C_L
  \`\`\`

  [Perspective](https://en.wikipedia.org/wiki/Philosophical_question)
  `;

  const sessionWithMarkdown: Session[] = [
    {
      id: 'session-markdown',
      title: 'Markdown Showcase',
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
        sessions={sessionWithMarkdown}
        activeSessionId="session-markdown"
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

export const CVEExample = () => {
  const markdownQuestion = `# Security Report

  Please review the following CVEs:

  - CVE-2021-34527
  - CVE-2021-44228
  - CVE-2021-45046
  `;

  const markdownResponse = `## Analysis

  The listed CVEs are critical vulnerabilities that need immediate attention.

  - CVE-2021-34527
  - CVE-2021-44228
  - CVE-2021-45046
  `;

  const sessionWithMarkdown: Session[] = [
    {
      id: 'session-cve',
      title: 'CVE Showcase',
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
        sessions={sessionWithMarkdown}
        activeSessionId="session-cve"
        remarkPlugins={[remarkCve as any]}
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

export const Empty = () => {
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
        sessions={[]}
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups>
            {groups => (
              <>
                {groups.map(({ heading, sessions }) => (
                  <SessionsGroup heading={heading} key={heading}>
                    {sessions.map(s => (
                      <SessionListItem key={s.id} session={s} />
                    ))}
                  </SessionsGroup>
                ))}
                {groups.length === 0 && (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-gray-500">
                      No sessions yet. Start a new session!
                    </p>
                  </div>
                )}
              </>
            )}
          </SessionGroups>
        </SessionsList>
        <div className="flex-1 h-full flex flex-col">
          <SessionMessages
            newSessionContent={
              <div className="flex flex-col gap-2 items-center justify-center h-full">
                <Placeholder className="block dark:hidden" />
                <PlaceholderDark className="hidden dark:block" />
                <p className="text-gray-500 max-w-[400px] text-center">
                  Welcome to Reachat, a UI library for effortlessly building and
                  customizing chat experiences with Tailwind.
                </p>
              </div>
            }
          />
          <ChatInput />
        </div>
      </Chat>
    </div>
  );
};

export const ConversationSources = () => {
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
        sessions={sessionWithSources}
        activeSessionId="session-sources"
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

const CustomMessagesHeader: FC<any> = () => {
  const { activeSession } = useContext(ChatContext);

  return (
    <div>
      <h6 className="text-gray-400">
        <DateFormat date={activeSession.createdAt} format="MMMM dd, yyyy" />
      </h6>
      <h1 className="text-2xl font-semibold">{activeSession?.title}</h1>
    </div>
  );
};

const CustomMessageQuestion: FC<any> = ({ question, files }) => (
  <>
    <span className="text-lg font-semibold text-blue-500">
      This is my question: {question}
    </span>
    <MessageFiles files={files}>
      <CustomMessageFile />
    </MessageFiles>
  </>
);

const CustomMessageResponse: FC<any> = ({ response }) => (
  <blockquote className="border-l border-blue-500 pl-2">
    This is the response: {response}
  </blockquote>
);

const CustomMessageFile: FC<any> = ({ name, type }) => (
  <Chip size="small" className="rounded-full border border-gray-700">
    {name || type}
  </Chip>
);

const CustomMessageSource: FC<any> = ({ title, url, image }) => {
  const { theme } = useContext(ChatContext);
  return (
    <Chip
      size="small"
      className="rounded-full border border-blue-500 border-opacity-50"
      onClick={() => alert('take me to ' + url)}
      start={
        image && (
          <img
            src={image}
            alt={title}
            className={cn(theme.messages.message.sources.source.image)}
          />
        )
      }
    >
      {title || url}
    </Chip>
  );
};

const CustomSessionListItem: FC<SessionListItemProps> = ({
  session,
  children,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  return (
    <>
      <ListItem
        {...rest}
        end={
          <IconButton
            ref={btnRef}
            size="small"
            variant="text"
            onClick={e => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
        }
      >
        <span className="truncate">{session.title}</span>
      </ListItem>
      <Menu
        open={open}
        onClose={() => setOpen(false)}
        reference={btnRef}
        appendToBody={false}
      >
        <Card disablePadding>
          <List>
            <ListItem onClick={() => alert('rename')}>Rename</ListItem>
            <ListItem onClick={() => alert('delete')}>Delete</ListItem>
          </List>
        </Card>
      </Menu>
    </>
  );
};

export const CustomComponents = () => {
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
        sessions={[
          ...fakeSessions,
          ...sessionsWithFiles,
          ...sessionWithSources
        ]}
        activeSessionId="1"
      >
        <SessionsList>
          <NewSessionButton>
            <button className="text-blue-500">New Session</button>
          </NewSessionButton>
          <Divider variant="secondary" />
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s}>
                      <CustomSessionListItem session={s} />
                    </SessionListItem>
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader>
            <CustomMessagesHeader />
          </SessionMessagesHeader>
          <SessionMessages>
            {conversations =>
              conversations.map((conversation, index) => (
                <SessionMessage
                  conversation={conversation}
                  isLast={index === conversations.length - 1}
                  key={conversation.id}
                >
                  <MessageQuestion
                    question={conversation.question}
                    files={conversation.files}
                  >
                    <CustomMessageQuestion />
                  </MessageQuestion>
                  <MessageResponse response={conversation.response}>
                    <CustomMessageResponse />
                  </MessageResponse>
                  <MessageSources sources={conversation.sources}>
                    <CustomMessageSource />
                  </MessageSources>
                  <MessageActions
                    question={conversation.question}
                    response={conversation.response}
                  />
                </SessionMessage>
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const ImageFiles = () => {
  const staticImageFiles = [
    {
      id: '1',
      name: 'landscape.jpg',
      type: 'image/jpeg',
      url: 'https://www.goodcode.us/static/austin-d1a2c5249336c31662b8ee6d4e169b2b.jpg'
    },
    {
      id: '2',
      name: 'portrait.jpg',
      type: 'image/jpeg',
      url: 'https://www.goodcode.us/static/andrew-173d57ca7681c7107c57b3fca0d88a99.jpeg'
    },
    {
      id: '3',
      name: 'abstract.png',
      type: 'image/jpg',
      url: 'https://www.goodcode.us/static/kyle-8e17430c6e35774780e01183c6d4086f.jpg'
    },
    {
      id: '4',
      name: 'nature.jpg',
      type: 'image/jpeg',
      url: 'https://www.goodcode.us/static/steph-1ffd4f0dd3c0100ad9019cae8d7954eb.jpg'
    }
  ];

  const sessionWithImages: Session[] = [
    {
      id: 'session-images',
      title: 'Multiple Image Files Showcase',
      createdAt: subHours(new Date(), 1),
      updatedAt: new Date(),
      conversations: [
        {
          id: 'conversation-1',
          question: 'Analyze these images and describe what you see.',
          response:
            "I'm sorry, but as an AI language model, I cannot actually see or analyze images. I can only process and respond to text input. If you'd like me to describe or analyze images, you would need to provide detailed textual descriptions of the images.",
          createdAt: new Date(),
          files: staticImageFiles
        },
        {
          id: 'conversation-2',
          question: 'Analyze these images and describe what you see.',
          response:
            "I'm sorry, but as an AI language model, I cannot actually see or analyze images. I can only process and respond to text input. If you'd like me to describe or analyze images, you would need to provide detailed textual descriptions of the images.",
          createdAt: new Date(),
          files: [staticImageFiles[0]]
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
        sessions={sessionWithImages}
        activeSessionId="session-images"
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
