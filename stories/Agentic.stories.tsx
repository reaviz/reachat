import { FC, useEffect, useState } from 'react';
import { Meta } from '@storybook/react-vite';
import { subMinutes } from 'date-fns';
import {
  Chat,
  ChatInput,
  Message,
  NewSessionButton,
  Session,
  SessionGroups,
  SessionMessage,
  SessionMessagePanel,
  SessionMessages,
  SessionMessagesHeader,
  SessionsList
} from '../src';

export default {
  title: 'Demos/Agentic',
  component: Chat
} as Meta;

const storyStyle = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  padding: 20,
  margin: 20,
  borderRadius: 5
};

// ---------------------------------------------------------------------------
// Transcript data
//
// An agent run is just an ordered list of role tagged messages: a system
// notice, the user ask, an assistant plan, the tool calls it made, and the
// assistant messages that follow — no question/response pairing required.
// ---------------------------------------------------------------------------

const agenticMessages: Message[] = [
  {
    id: 'msg-system-start',
    role: 'system',
    content:
      'Revenue Analyst agent connected. Tools available: `query_warehouse`, `detect_anomalies`.',
    createdAt: subMinutes(new Date(), 6)
  },
  {
    id: 'msg-user-1',
    role: 'user',
    content:
      'Compare our Q3 revenue against the forecast and flag anything unusual.',
    createdAt: subMinutes(new Date(), 5)
  },
  {
    id: 'msg-assistant-plan',
    role: 'assistant',
    content: `Here's how I'll approach this:

1. Pull Q3 actuals and the committed forecast per segment from the warehouse
2. Run anomaly detection on the weekly series
3. Summarize the deltas and call out anything worth a second look`,
    createdAt: subMinutes(new Date(), 5)
  },
  {
    id: 'msg-tool-1',
    role: 'tool',
    content: 'query_warehouse — returned 4 segments, 13 weeks (86ms)',
    createdAt: subMinutes(new Date(), 4),
    metadata: {
      toolCallId: 'call_01H9Z',
      toolCallName: 'query_warehouse',
      args: {
        sql: 'select segment, week, actual, forecast from revenue where quarter = 2025-Q3',
        limit: 500
      }
    }
  },
  {
    id: 'msg-assistant-interim',
    role: 'assistant',
    content:
      'The pull came back clean — 4 segments across 13 weeks. Running anomaly detection on the weekly series now.',
    createdAt: subMinutes(new Date(), 4)
  },
  {
    id: 'msg-tool-2',
    role: 'tool',
    content: 'detect_anomalies — 2 anomalies found (z > 2.5)',
    createdAt: subMinutes(new Date(), 3),
    metadata: {
      toolCallId: 'call_01H9Q',
      toolCallName: 'detect_anomalies',
      args: {
        series: 'revenue.weekly',
        method: 'zscore',
        threshold: 2.5
      }
    }
  },
  {
    id: 'msg-assistant-final',
    role: 'assistant',
    content: `Q3 finished **4.1% above forecast**, but the beat is not evenly distributed:

| Segment | Forecast | Actual | Delta |
| --- | --- | --- | --- |
| Enterprise | $4.20M | $4.83M | +15.0% |
| Mid-Market | $2.10M | $2.06M | -1.9% |
| SMB | $1.35M | $1.29M | -4.4% |
| Partner | $0.65M | $0.71M | +9.2% |

Two anomalies worth a second look:

- **Week 7, Enterprise** — a single $610K deal closed early, pulling revenue in from Q4
- **Week 11, SMB** — a 22% drop that lines up with the billing outage on Sept 12

Netting out the pulled-forward deal, the quarter lands closer to +1.3%.`,
    createdAt: subMinutes(new Date(), 2),
    sources: [
      {
        title: 'Warehouse: revenue.weekly',
        url: 'https://example.com/warehouse/revenue'
      },
      {
        title: 'Incident report: billing outage Sept 12',
        url: 'https://example.com/incidents/2025-09-12'
      }
    ]
  },
  {
    id: 'msg-system-end',
    role: 'system',
    content: 'Run complete — 2 tool calls, 4.2s, 1,284 tokens.',
    createdAt: subMinutes(new Date(), 2)
  }
];

const agenticSessions: Session[] = [
  {
    id: 'agentic-1',
    title: 'Q3 Revenue Review',
    createdAt: subMinutes(new Date(), 6),
    updatedAt: new Date(),
    messages: agenticMessages
  }
];

/**
 * A full agent transcript rendered with the default components. Each role
 * gets its own presentation via `theme.messages.message.{user,assistant,
 * system,tool}`.
 */
export const Transcript = () => (
  <div className="dark:bg-gray-950 bg-white" style={storyStyle}>
    <Chat
      viewType="console"
      sessions={agenticSessions}
      activeSessionId="agentic-1"
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

const ToolCall: FC<{ message: Message }> = ({ message }) => {
  const { toolCallName, args } = message.metadata ?? {};

  return (
    <div className="my-1 rounded-lg border border-blue-500/30 bg-blue-500/5 px-3 py-2">
      <div className="flex items-center gap-2 text-xs font-semibold text-blue-500">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
        {toolCallName}
      </div>
      <pre className="mt-1 overflow-x-auto text-xs text-gray-500 dark:text-gray-400">
        {JSON.stringify(args, null, 2)}
      </pre>
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {message.content}
      </div>
    </div>
  );
};

/**
 * Tool messages carry structured data on `metadata`, so a render prop can
 * present them however the app likes while everything else falls back to
 * the default message rendering.
 */
export const CustomToolRendering = () => (
  <div className="dark:bg-gray-950 bg-white" style={storyStyle}>
    <Chat
      viewType="console"
      sessions={agenticSessions}
      activeSessionId="agentic-1"
    >
      <SessionsList>
        <NewSessionButton />
        <SessionGroups />
      </SessionsList>
      <SessionMessagePanel>
        <SessionMessagesHeader />
        <SessionMessages>
          {messages =>
            messages.map((message, index) =>
              message.role === 'tool' ? (
                <SessionMessage key={message.id} message={message}>
                  <ToolCall message={message} />
                </SessionMessage>
              ) : (
                <SessionMessage
                  key={message.id}
                  message={message}
                  isLast={index === messages.length - 1}
                />
              )
            )
          }
        </SessionMessages>
        <ChatInput />
      </SessionMessagePanel>
    </Chat>
  </div>
);

// ---------------------------------------------------------------------------
// Simulated streaming run
// ---------------------------------------------------------------------------

const STREAM_SESSION_ID = 'agentic-stream';

const streamPlan = `Let me work through this. I'll pull the Q3 actuals against forecast first, then look for outliers in the weekly series.`;

const streamAnswer = `Q3 came in **4.1% above forecast**. Enterprise carried the quarter at +15%, while SMB finished 4.4% short after the September billing outage. One $610K Enterprise deal closed a week early, so roughly 2.8 points of the beat were pulled forward from Q4.`;

/**
 * Simulates a live agent run: the assistant streams a plan, calls two tools,
 * then streams a follow-up answer as a second assistant message.
 */
export const StreamingRun = () => {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: STREAM_SESSION_ID,
      title: 'Live Agent Run',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: 'stream-system',
          role: 'system',
          content: 'Revenue Analyst agent connected.',
          createdAt: new Date()
        },
        {
          id: 'stream-user',
          role: 'user',
          content:
            'Compare our Q3 revenue against the forecast and flag anything unusual.',
          createdAt: new Date()
        }
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const wait = (ms: number) =>
      new Promise<void>(resolve => {
        timers.push(setTimeout(resolve, ms));
      });

    const updateMessages = (updater: (messages: Message[]) => Message[]) =>
      setSessions(prev =>
        prev.map(session =>
          session.id === STREAM_SESSION_ID
            ? {
                ...session,
                updatedAt: new Date(),
                messages: updater(session.messages)
              }
            : session
        )
      );

    const appendMessage = (message: Message) =>
      updateMessages(messages => [...messages, message]);

    const streamAssistant = async (id: string, content: string) => {
      appendMessage({
        id,
        role: 'assistant',
        content: '',
        createdAt: new Date()
      });

      for (const word of content.split(' ')) {
        await wait(40);
        if (cancelled) {
          return;
        }

        updateMessages(messages =>
          messages.map(message =>
            message.id === id
              ? {
                  ...message,
                  content: message.content
                    ? `${message.content} ${word}`
                    : word,
                  updatedAt: new Date()
                }
              : message
          )
        );
      }
    };

    const run = async () => {
      await wait(900);
      if (cancelled) {
        return;
      }

      await streamAssistant('stream-plan', streamPlan);
      if (cancelled) {
        return;
      }

      await wait(700);
      if (cancelled) {
        return;
      }

      appendMessage({
        id: 'stream-tool-1',
        role: 'tool',
        content: 'query_warehouse — returned 4 segments, 13 weeks (86ms)',
        createdAt: new Date(),
        metadata: {
          toolCallId: 'call_stream_01',
          toolCallName: 'query_warehouse',
          args: { quarter: '2025-Q3', groupBy: 'segment' }
        }
      });

      await wait(1200);
      if (cancelled) {
        return;
      }

      appendMessage({
        id: 'stream-tool-2',
        role: 'tool',
        content: 'detect_anomalies — 2 anomalies found (z > 2.5)',
        createdAt: new Date(),
        metadata: {
          toolCallId: 'call_stream_02',
          toolCallName: 'detect_anomalies',
          args: { series: 'revenue.weekly', threshold: 2.5 }
        }
      });

      await wait(800);
      if (cancelled) {
        return;
      }

      await streamAssistant('stream-answer', streamAnswer);
      if (cancelled) {
        return;
      }

      appendMessage({
        id: 'stream-system-end',
        role: 'system',
        content: 'Run complete — 2 tool calls, 4.2s.',
        createdAt: new Date()
      });

      setIsLoading(false);
    };

    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="dark:bg-gray-950 bg-white" style={storyStyle}>
      <Chat
        viewType="console"
        sessions={sessions}
        activeSessionId={STREAM_SESSION_ID}
        isLoading={isLoading}
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
