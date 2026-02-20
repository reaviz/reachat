import { useState, useRef, FC, useContext, useEffect } from 'react';
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
  SessionListItemProps,
  SessionMessagePanel,
  SessionMessagesHeader,
  ChatContext,
  SessionMessage,
  MessageStatus,
  MessageStatusStep,
  MessageStatusState
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
import { subMinutes, subHours } from 'date-fns';
import MenuIcon from './assets/menu.svg?react';
import Placeholder from './assets/placeholder.svg?react';
import PlaceholderDark from './assets/placeholder-dark.svg?react';
import { MessageActions } from '@/SessionMessages';
import { MessageFiles } from '@/SessionMessages';
import { MessageQuestion } from '@/SessionMessages';
import { MessageResponse } from '@/SessionMessages';
import { MessageSources } from '@/SessionMessages';
import {
  createSendMessageHandler,
  fakeSessions,
  sessionWithCSVFiles,
  sessionWithSources,
  sessionsWithFiles,
  sessionsWithPartialConversation
} from './examples';

export default {
  title: 'Demos/Console',
  component: Chat
} as Meta;

export const Basic = () => {
  const [activeId, setActiveId] = useState<string>(fakeSessions[0].id);
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
        sessions={sessions}
        activeSessionId={activeId}
        viewType="console"
        onSelectSession={setActiveId}
        onDeleteSession={() => alert('delete!')}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
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
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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

export const DefaultInputValue = () => {
  const [activeId, setActiveId] = useState<string>('1');
  const [sessions, setSessions] = useState<Session[]>(fakeSessions);

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onDeleteSession={() => alert('delete!')}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput defaultValue="Hello, tell me more" />
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
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
          <SessionMessages showScrollBottomButton />
          <ChatInput />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const Empty = () => {
  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
  const [activeId, setActiveId] = useState<string>('session-sources');
  const [sessions, setSessions] = useState<Session[]>(sessionWithSources);

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
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
        <DateFormat date={activeSession?.createdAt} format="MMMM dd, yyyy" />
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
            className={cn(theme?.messages?.message?.sources?.source?.image)}
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
  const [activeId, setActiveId] = useState<string>('1');
  const [sessions, setSessions] = useState<Session[]>([
    ...fakeSessions,
    ...sessionsWithFiles,
    ...sessionWithSources
  ]);

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
        sessions={sessions}
        activeSessionId={activeId}
        onSelectSession={setActiveId}
        onSendMessage={createSendMessageHandler(setSessions, activeId)}
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

export const CSVPreview = () => {
  const [sessions, setSessions] = useState<Session[]>(sessionWithCSVFiles);

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
        onSendMessage={createSendMessageHandler(setSessions, '1')}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
          <SessionMessages />
          <ChatInput allowedFiles={['.pdf', '.docx', '.csv']} />
        </SessionMessagePanel>
      </Chat>
    </div>
  );
};

export const WithToolStatus = () => {
  const [status, setStatus] = useState<MessageStatusState>('loading');
  const [steps, setSteps] = useState<MessageStatusStep[]>([
    { id: '1', text: 'Reading src/index.ts', status: 'loading' }
  ]);

  useEffect(() => {
    const timeline = [
      {
        delay: 1500,
        action: () => {
          setSteps(prev =>
            prev.map(s => (s.id === '1' ? { ...s, status: 'complete' as const } : s))
          );
        }
      },
      {
        delay: 2000,
        action: () => {
          setSteps(prev => [
            ...prev,
            { id: '2', text: 'Searching for dependencies', status: 'loading' as const }
          ]);
        }
      },
      {
        delay: 3500,
        action: () => {
          setSteps(prev =>
            prev.map(s => (s.id === '2' ? { ...s, status: 'complete' as const } : s))
          );
        }
      },
      {
        delay: 4000,
        action: () => {
          setSteps(prev => [
            ...prev,
            { id: '3', text: 'Analyzing code patterns', status: 'loading' as const }
          ]);
        }
      },
      {
        delay: 6000,
        action: () => {
          setSteps(prev =>
            prev.map(s => (s.id === '3' ? { ...s, status: 'complete' as const } : s))
          );
          setStatus('complete');
        }
      }
    ];

    const timeouts = timeline.map(item => setTimeout(item.action, item.delay));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const sessionWithToolStatus: Session[] = [
    {
      id: 'session-tool-status',
      title: 'Tool Status Demo',
      createdAt: subHours(new Date(), 1),
      updatedAt: new Date(),
      conversations: [
        {
          id: 'conversation-1',
          question: 'Can you analyze my codebase and find any issues?',
          response:
            'I\'ll analyze your codebase now. Let me read through the files and check for any potential issues.',
          createdAt: new Date()
        }
      ]
    }
  ];

  return (
    <div
      className="dark:bg-(--color-background-basic-black) bg-(--color-background-basic-white)"
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
        sessions={sessionWithToolStatus}
        activeSessionId="session-tool-status"
        isLoading={status === 'loading'}
      >
        <SessionsList>
          <NewSessionButton />
          <SessionGroups />
        </SessionsList>

        <SessionMessagePanel>
          <SessionMessagesHeader />
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
                  />
                  <MessageResponse response={conversation.response} />
                  <div className="mt-4">
                    <MessageStatus
                      status={status}
                      text={status === 'complete' ? 'Analysis complete' : 'Analyzing codebase...'}
                      steps={steps}
                    />
                  </div>
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
