import {
  useState,
  useCallback,
  useRef,
  useEffect,
  FC,
  useContext
} from 'react';
import OpenAI from 'openai';
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
  SessionMessage
} from '../src';
import {
  Card,
  Chip,
  cn,
  DateFormat,
  Divider,
  IconButton,
  Input,
  List,
  ListItem,
  Menu
} from 'reablocks';
import { subDays, subMinutes, subHours } from 'date-fns';
import MenuIcon from '@/assets/menu.svg?react';
import { MessageActions } from '@/SessionMessages/MessageActions';
import { MessageFiles } from '@/SessionMessages/MessageFiles';
import { MessageQuestion } from '@/SessionMessages/MessageQuestion';
import { MessageResponse } from '@/SessionMessages/MessageResponse';
import { MessageSources } from '@/SessionMessages/MessageSources';

export default {
  title: 'Demos',
  component: Chat
} as Meta;

const fakeSessions: Session[] = [
  {
    id: '1',
    title: 'Session 1',
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: [
      {
        id: '1',
        question: 'What is React?',
        response: 'React is a JavaScript library for building user interfaces.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        question: 'What is JSX?',
        response: 'JSX is a syntax extension for JavaScript.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    id: '2',
    title: 'Session 2',
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: [
      {
        id: '1',
        question: 'What is TypeScript?',
        response: 'TypeScript is a typed superset of JavaScript.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        question: 'What is a component?',
        response: 'A component is a reusable piece of UI.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

export const Console = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const Companion = () => {
  return (
    <div
      style={{
        width: 350,
        height: 500,
        padding: 20,
        background: '#02020F',
        borderRadius: 5
      }}
    >
      <Chat
        sessions={[
          ...fakeSessions,
          ...sessionsWithFiles,
          ...sessionWithSources
        ]}
        viewType="companion"
        onDeleteSession={() => alert('delete!')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const Embeds = () => {
  const fakeSessionsWithEmbeds: Session[] = [
    {
      id: '1',
      title: 'Session with Embeds',
      createdAt: new Date(),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question: 'Can you show me a video about React?',
          response: `
  ## Watch this video

  https://youtu.be/enTFE2c68FQ

  https://www.youtube.com/watch?v=enTFE2c68FQ

  These links showcase a video about React basics. You can click on either link to watch the video.`,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          question: 'Do you have another video recommendation?',
          response: `
  Certainly! Here's another great video about web development:

  ## Check out this tutorial

  https://www.youtube.com/watch?v=dQw4w9WgXcQ

  This video covers some interesting web development concepts.`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const DefaultSession = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const Loading = () => {
  const sessionsWithPartialConversation: Session[] = [
    {
      id: '1',
      title: 'Session with Partial Conversation',
      createdAt: new Date(),
      updatedAt: new Date(),
      conversations: [
        {
          id: '1',
          question: 'What is the capital of France?',
          response: 'The capital of France is Paris.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          question: 'What is the largest planet in our solar system?',
          response: null, // No response yet
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map((conversation, index) => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                  isLast={index === conversations.length - 1}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

const sessionsWithFiles: Session[] = [
  {
    id: 'session-files',
    title: 'Session with Files',
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: [
      {
        id: '1',
        question: 'Here are some files I uploaded',
        response:
          'Ive received your files. Let me know if you have any questions about them.',
        createdAt: new Date(),
        updatedAt: new Date(),
        files: [
          { name: 'document.pdf', size: 1024000, type: 'application/pdf' },
          {
            name: 'report.docx',
            size: 512000,
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        ]
      }
    ]
  }
];

export const FileUploads = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>
        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
          <ChatInput allowedFiles={['.pdf', '.docx']} />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const DefaultInputValue = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const UndeleteableSessions = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
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
    createSessionWithDate('2', 'Yesterday Session 2', 1),
    createSessionWithDate('3', 'Last Week Session', 6),
    createSessionWithDate('4', 'Two Weeks Ago Session', 14),
    createSessionWithDate('5', 'Last Month Session', 32),
    createSessionWithDate('6', 'Two Months Ago Session', 65),
    createSessionWithDate('7', 'Six Months Ago Session', 180),
    createSessionWithDate('8', 'Last Year Session', 370),
    createSessionWithDate('9', 'Two Years Ago Session', 740)
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
        borderRadius: 5
      }}
    >
      <Chat viewType="console" sessions={hundredSessions}>
        <SessionsList>
          <NewSessionButton />
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
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
      conversations: []
    }));
  };

  const sessionsWithLongNames = generateFakeSessionsWithLongNames(10);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const OpenAIIntegration = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [apiKey, setApiKey] = useState('');

  const openai = useRef<OpenAI | null>(null);

  useEffect(() => {
    if (apiKey) {
      openai.current = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // For demo purposes only
      });
    }
  }, [apiKey]);

  const handleNewMessage = useCallback(
    async (message: string, sessionId: string = '1') => {
      setIsLoading(true);
      try {
        const response = await openai.current.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }]
        });

        const aiResponse =
          response.choices[0]?.message?.content ||
          'Sorry, I couldnt generate a response.';

        setSessions(prevSessions => {
          const sessionIndex = prevSessions.findIndex(s => s.id === sessionId);
          if (sessionIndex === -1) {
            // Create a new session
            return [
              ...prevSessions,
              {
                id: sessionId,
                title: message.slice(0, 30),
                createdAt: new Date(),
                updatedAt: new Date(),
                conversations: [
                  {
                    id: Date.now().toString(),
                    question: message,
                    response: aiResponse,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  }
                ]
              }
            ];
          } else {
            // Add to existing session
            const updatedSessions = [...prevSessions];
            updatedSessions[sessionIndex] = {
              ...updatedSessions[sessionIndex],
              updatedAt: new Date(),
              conversations: [
                ...updatedSessions[sessionIndex].conversations,
                {
                  id: Date.now().toString(),
                  question: message,
                  response: aiResponse,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              ]
            };
            return updatedSessions;
          }
        });

        setActiveSessionId(sessionId);
      } catch (error) {
        console.error('Error calling OpenAI API:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [openai]
  );

  const handleDeleteSession = useCallback((sessionId: string) => {
    setSessions(prevSessions => prevSessions.filter(s => s.id !== sessionId));
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20
      }}
    >
      <Input
        fullWidth
        placeholder="OpenAI API Key"
        value={apiKey}
        onChange={e => setApiKey(e.target.value)}
      />
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 20,
          margin: 20,
          background: '#02020F',
          borderRadius: 5
        }}
      >
        <Chat
          viewType="console"
          sessions={sessions}
          isLoading={isLoading}
          disabled={!apiKey}
          onDeleteSession={handleDeleteSession}
          onSendMessage={handleNewMessage}
          activeSessionId={activeSessionId}
        >
          <SessionsList>
            <NewSessionButton />
            <SessionGroups>
              {groups =>
                groups.map(({ heading, sessions }) => (
                  <SessionsGroup heading={heading} key={heading}>
                    {sessions.map(s => (
                      <SessionListItem key={s.id} session={s} />
                    ))}
                  </SessionsGroup>
                ))
              }
            </SessionGroups>
          </SessionsList>

          <SessionMessagePanel>
            <SessionMessagesHeader />
            <SessionMessages>
              {conversations =>
                conversations.map(conversation => (
                  <SessionMessage
                    key={conversation.id}
                    conversation={conversation}
                  />
                ))
              }
            </SessionMessages>
            <ChatInput />
          </SessionMessagePanel>
        </Chat>
      </div>
    </div>
  );
};

export const EmptyState = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  No messages yet. Start a new conversation!
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

const sessionWithSources: Session[] = [
  {
    id: 'session-sources',
    title: 'Session with Sources',
    createdAt: subHours(new Date(), 1),
    updatedAt: new Date(),
    conversations: [
      {
        id: 'conversation-1',
        question: 'What are the main causes of climate change?',
        response: `Climate change is primarily caused by human activities that release greenhouse gases into the atmosphere. The main causes include:

1. Burning of fossil fuels (coal, oil, and natural gas)
2. Deforestation and land-use changes
3. Industrial processes
4. Agriculture and livestock farming

These activities increase the concentration of greenhouse gases in the atmosphere, leading to the greenhouse effect and global warming.`,
        createdAt: new Date(),
        updatedAt: new Date(),
        sources: [
          {
            title: 'NASA: Causes of Climate Change',
            image:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/1224px-NASA_logo.svg.png',
            url: 'https://climate.nasa.gov/causes/'
          },
          {
            title:
              'IPCC: Climate Change 2021: The Physical Science Basis and Global Warming Is the Last War We will Fight',
            url: 'https://www.ipcc.ch/report/ar6/wg1/'
          }
        ]
      }
    ]
  }
];

export const ConversationSources = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <SessionGroups>
            {groups =>
              groups.map(({ heading, sessions }) => (
                <SessionsGroup heading={heading} key={heading}>
                  {sessions.map(s => (
                    <SessionListItem key={s.id} session={s} />
                  ))}
                </SessionsGroup>
              ))
            }
          </SessionGroups>
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages>
            {conversations =>
              conversations.map(conversation => (
                <SessionMessage
                  key={conversation.id}
                  conversation={conversation}
                />
              ))
            }
          </SessionMessages>
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

const CustomMessageQuestion: FC<any> = ({ question }) => (
  <span className="text-lg font-semibold text-blue-500">
    This is my question: {question}
  </span>
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
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        margin: 20,
        background: '#02020F',
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
          <Divider />
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
                  <MessageQuestion question={conversation.question}>
                    <CustomMessageQuestion />
                  </MessageQuestion>
                  <MessageFiles files={conversation.files}>
                    <CustomMessageFile />
                  </MessageFiles>
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
