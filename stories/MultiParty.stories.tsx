import { Meta } from '@storybook/react-vite';
import { subMinutes } from 'date-fns';
import {
  Chat,
  ChatInput,
  Message,
  MessageAuthor,
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
  title: 'Demos/MultiParty',
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
// Participants
//
// `role` says what kind of participant wrote a message; `author` says who.
// Multiple humans share `role: 'user'` and multiple agents can either share
// `role: 'assistant'` or use their own custom role strings.
// ---------------------------------------------------------------------------

const austin: MessageAuthor = {
  id: 'user-austin',
  name: 'Austin',
  avatar: (
    <span className="flex h-full w-full items-center justify-center bg-blue-500 text-[10px] font-bold text-white">
      A
    </span>
  )
};

const priya: MessageAuthor = {
  id: 'user-priya',
  name: 'Priya',
  avatar: (
    <span className="flex h-full w-full items-center justify-center bg-emerald-500 text-[10px] font-bold text-white">
      P
    </span>
  )
};

const researcher: MessageAuthor = {
  id: 'agent-researcher',
  name: 'Research Agent',
  avatar: <span className="text-xs">🔎</span>
};

const coder: MessageAuthor = {
  id: 'agent-coder',
  name: 'Coding Agent',
  avatar: <span className="text-xs">🤖</span>
};

// ---------------------------------------------------------------------------
// Multi-agent transcript: two named agents collaborate on one thread. Each
// agent uses its own custom role (falls back to the assistant presentation,
// including actions and the streaming cursor) plus an author identity.
// ---------------------------------------------------------------------------

const multiAgentMessages: Message[] = [
  {
    id: 'ma-user-1',
    role: 'user',
    author: austin,
    content: 'Find out why checkout p99 latency doubled yesterday and fix it.',
    createdAt: subMinutes(new Date(), 12)
  },
  {
    id: 'ma-researcher-1',
    role: 'researcher',
    author: researcher,
    content:
      "I'll dig through the traces and deploy history first, then hand findings to the coding agent.",
    createdAt: subMinutes(new Date(), 11)
  },
  {
    id: 'ma-tool-1',
    role: 'tool',
    author: researcher,
    content: 'query_traces — 1,214 spans sampled from checkout (312ms)',
    createdAt: subMinutes(new Date(), 10),
    metadata: {
      toolCallId: 'call_tr_01',
      toolCallName: 'query_traces',
      args: { service: 'checkout', percentile: 99, window: '24h' }
    }
  },
  {
    id: 'ma-researcher-2',
    role: 'researcher',
    author: researcher,
    content: `Found it. The latency jump lines up with yesterday's 14:05 deploy — the new tax lookup calls the rates service **per line item** instead of batching:

- p99 before: 420ms → after: 890ms
- 96% of the added time is in \`tax.getRate\` fan-out

Handing off to the coding agent to batch the lookup.`,
    createdAt: subMinutes(new Date(), 9)
  },
  {
    id: 'ma-coder-1',
    role: 'coder',
    author: coder,
    content:
      'On it — batching the rate lookups into a single call per checkout.',
    createdAt: subMinutes(new Date(), 8)
  },
  {
    id: 'ma-tool-2',
    role: 'tool',
    author: coder,
    content: 'open_pr — PR #482 opened against main',
    createdAt: subMinutes(new Date(), 6),
    metadata: {
      toolCallId: 'call_pr_01',
      toolCallName: 'open_pr',
      args: {
        title: 'Batch tax rate lookups in checkout',
        branch: 'fix/tax-batching'
      }
    }
  },
  {
    id: 'ma-coder-2',
    role: 'coder',
    author: coder,
    content: `Done — [PR #482](https://example.com/pr/482) replaces the per-item fan-out with one batched \`tax.getRates\` call. Local benchmark puts checkout p99 back at ~430ms.`,
    createdAt: subMinutes(new Date(), 5)
  },
  {
    id: 'ma-system-1',
    role: 'system',
    content: 'Run complete — 2 agents, 2 tool calls, 6m 40s.',
    createdAt: subMinutes(new Date(), 5)
  }
];

const multiAgentSessions: Session[] = [
  {
    id: 'multi-agent-1',
    title: 'Checkout latency triage',
    createdAt: subMinutes(new Date(), 12),
    updatedAt: new Date(),
    messages: multiAgentMessages
  }
];

/**
 * Two named agents collaborating in one session. Each agent has its own
 * custom role and an `author` identity, so every message shows who wrote
 * it — including the tool calls each agent made.
 */
export const MultiAgent = () => (
  <div className="dark:bg-gray-950 bg-white" style={storyStyle}>
    <Chat
      viewType="console"
      sessions={multiAgentSessions}
      activeSessionId="multi-agent-1"
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

// ---------------------------------------------------------------------------
// Group chat: multiple humans plus one assistant in the same session. Both
// humans use `role: 'user'`; the author identity tells them apart.
// ---------------------------------------------------------------------------

const groupChatMessages: Message[] = [
  {
    id: 'gc-austin-1',
    role: 'user',
    author: austin,
    content: 'Can we get a summary of the support tickets from last week?',
    createdAt: subMinutes(new Date(), 9)
  },
  {
    id: 'gc-priya-1',
    role: 'user',
    author: priya,
    content: 'And break it down by product area, please.',
    createdAt: subMinutes(new Date(), 8)
  },
  {
    id: 'gc-assistant-1',
    role: 'assistant',
    author: { id: 'agent-support', name: 'Support Copilot' },
    content: `Here's last week at a glance — **147 tickets**, down 12% week over week:

| Area | Tickets | Trend |
| --- | --- | --- |
| Billing | 58 | ▲ +21% |
| Auth | 34 | ▼ -30% |
| Dashboard | 31 | ▼ -8% |
| API | 24 | ▲ +4% |

Billing drove the increase — 19 tickets trace back to Tuesday's invoice email formatting bug.`,
    createdAt: subMinutes(new Date(), 7)
  },
  {
    id: 'gc-priya-2',
    role: 'user',
    author: priya,
    content: 'Is the invoice bug fixed?',
    createdAt: subMinutes(new Date(), 3)
  },
  {
    id: 'gc-assistant-2',
    role: 'assistant',
    author: { id: 'agent-support', name: 'Support Copilot' },
    content:
      'Yes — the fix shipped Thursday in v2.14.1, and no new invoice-formatting tickets have come in since.',
    createdAt: subMinutes(new Date(), 2)
  }
];

const groupChatSessions: Session[] = [
  {
    id: 'group-chat-1',
    title: 'Support review',
    createdAt: subMinutes(new Date(), 9),
    updatedAt: new Date(),
    messages: groupChatMessages
  }
];

/**
 * Multiple people and one assistant sharing a session. Both humans are
 * `role: 'user'` — the `author` field is what tells them apart.
 */
export const GroupChat = () => (
  <div className="dark:bg-gray-950 bg-white" style={storyStyle}>
    <Chat
      viewType="console"
      sessions={groupChatSessions}
      activeSessionId="group-chat-1"
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

/**
 * Per-participant styling via the render prop: each author id maps to a
 * class applied to its messages, so agents are visually distinct beyond
 * the author header.
 */
export const PerAgentStyling = () => (
  <div className="dark:bg-gray-950 bg-white" style={storyStyle}>
    <Chat
      viewType="console"
      sessions={multiAgentSessions}
      activeSessionId="multi-agent-1"
    >
      <SessionsList>
        <NewSessionButton />
        <SessionGroups />
      </SessionsList>
      <SessionMessagePanel>
        <SessionMessagesHeader />
        <SessionMessages>
          {messages =>
            messages.map((message, index) => (
              <SessionMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
                className={
                  {
                    'agent-researcher':
                      'border-l-2 border-amber-500/60 pl-3 rounded-none',
                    'agent-coder':
                      'border-l-2 border-blue-500/60 pl-3 rounded-none'
                  }[message.author?.id ?? '']
                }
              />
            ))
          }
        </SessionMessages>
        <ChatInput />
      </SessionMessagePanel>
    </Chat>
  </div>
);
