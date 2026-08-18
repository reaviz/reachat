# Proposal: Message-Based Data Model

**Status:** Approved for implementation
**Branch:** `claude/data-model-agentic-workflows-pijb23`

## Problem

The current data model assumes a strict request/reply structure. A `Session`
contains `Conversation[]`, and each `Conversation` couples exactly one user
`question` with at most one assistant `response`:

```typescript
interface Conversation {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
  question: string;      // exactly one user turn
  response?: string;     // at most one assistant turn
  sources?: ConversationSource[];
  files?: ConversationFile[];
}
```

Agentic workflows break this assumption. Real agent transcripts contain:

- Multiple consecutive assistant messages (plan → tool call → result → answer)
- Tool call/result messages between user turns
- System/status messages
- Assistant messages that are not a reply to any user message (proactive
  updates, streamed intermediate steps)
- Multiple user messages in a row (user sends follow-ups before a reply)

None of these can be represented today. `useAgUi` already has to flatten
tool-call events into a single `response` string, losing structure.

## Design

### 1. New core types (`src/types.ts`)

Replace the question/reply pair with a flat, ordered list of role-tagged
messages:

```typescript
export type MessageRole =
  | 'user'
  | 'assistant'
  | 'system'
  | 'tool'
  | (string & {}); // open-ended for custom roles

export interface Message {
  /** Unique identifier for the message */
  id: string;

  /** Who authored the message */
  role: MessageRole;

  /** Markdown content of the message */
  content: string;

  createdAt?: Date;
  updatedAt?: Date;

  /** Sources referenced by this message (typically assistant messages) */
  sources?: ConversationSource[];

  /** Files attached to this message (typically user messages) */
  files?: ConversationFile[];

  /** Arbitrary structured data, e.g. tool call info: { toolCallId, toolCallName, args } */
  metadata?: Record<string, any>;
}

export interface Session {
  id: string;
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;

  /** Ordered list of messages in this session */
  messages?: Message[];

  /** @deprecated Use `messages`. Kept for backwards compatibility; converted internally via conversationsToMessages(). */
  conversations?: Conversation[];
}
```

`Conversation`, `ConversationSource`, and `ConversationFile` remain exported.
`Conversation` is marked `@deprecated`. The `ConversationSource` /
`ConversationFile` names are kept unchanged (renaming to `MessageFile` would
collide with the existing `MessageFile` component).

### 2. Backwards compatibility layer (`src/utils/messages.ts`)

```typescript
/** Converts legacy Conversation pairs into a flat Message list. */
export function conversationsToMessages(conversations: Conversation[]): Message[];
// each conversation becomes:
//   { id: `${c.id}-question`, role: 'user', content: c.question, files: c.files, createdAt: c.createdAt }
//   and, when c.response !== undefined:
//   { id: `${c.id}-response`, role: 'assistant', content: c.response, sources: c.sources, createdAt: c.createdAt, updatedAt: c.updatedAt }

/** Returns session.messages, falling back to converting session.conversations. */
export function getSessionMessages(session?: Session | null): Message[];
```

All internal consumers read messages exclusively through
`getSessionMessages()`, so existing apps that pass `conversations` keep
working unmodified. If both are present, `messages` wins.

### 3. Component changes (`src/SessionMessages/`)

- **`SessionMessages`** — iterates `getSessionMessages(activeSession)`.
  Pagination (`limit`, show-more) operates on messages. The render-prop
  signature changes: `children?: (messages: Message[]) => ReactNode`.
  When `isLoading` is true and the last message has `role: 'user'`, a pending
  assistant placeholder (blinking cursor) is rendered after it — previously
  the cursor lived on the same conversation's empty response.

- **`SessionMessage`** — props change from `conversation: Conversation` to
  `message: Message` (plus existing `isLast`). It renders role-appropriately:
  - `user` → files + markdown + long-content expand overlay (current
    question presentation)
  - `assistant` → markdown + sources + actions + loading cursor when
    `isLast && isLoading` (current response presentation)
  - `system` / `tool` / custom roles → assistant-style presentation with a
    role-specific theme class; consumers override via the existing
    `children` slot or the `SessionMessages` render prop.
  Each message renders in its own card; a session is now a stream of
  message cards rather than question/response pair cards.

- **`MessageQuestion` / `MessageResponse`** — kept as thin `@deprecated`
  wrappers so existing custom renderers keep compiling. `MessageQuestion`
  renders user-style content (accepts `question` prop), `MessageResponse`
  renders assistant-style content (accepts `response` prop).

- **`MessageActions`** — props change from `{ question, response }` to
  `{ message: Message }`. Copy copies `message.content`. By default it is
  rendered on assistant messages only.

- **`MessageFiles` / `MessageSources` / `MessageFile`** — unchanged.

### 4. Theme changes (`src/theme.ts`)

`theme.messages.message.question` / `.response` are renamed to role keys,
with new roles added:

```typescript
message: {
  base: string;
  user: string;        // was: question
  assistant: string;   // was: assistant/response
  system: string;      // new — muted, centered informational style
  tool: string;        // new — compact monospace-ish style for tool activity
  // ...rest unchanged (cursor, overlay, expand, files, sources, markdown, footer, scrollToBottom)
}
```

This is a breaking change for custom themes, documented in the migration
guide. Default values for `user`/`assistant` are the current
`question`/`response` values; `system`/`tool` get sensible new defaults.

### 5. `useAgUi` rework (`src/useAgUi/`)

- Session state is message-based. `sendMessage` appends a `role: 'user'`
  message, then creates a streaming `role: 'assistant'` message whose
  `content` grows with each text delta.
- Tool calls become first-class: on `TOOL_CALL_END`, a pending
  `role: 'tool'` activity message is appended with
  `metadata: { toolCallId, toolCallName, args, toolCallStatus }` (the
  `onToolCall` callback is still invoked). `TOOL_CALL_RESULT` replaces its
  content with the execution result before it is included in later AG-UI
  history.
- Text deltas are accumulated by AG-UI `messageId`, preserving the protocol's
  START/CONTENT/END boundaries and allowing consecutive assistant messages.
- Helpers renamed: `addConversationToSession` → `addMessageToSession`,
  `updateConversationInSession` → `updateMessageInSession` (old names removed;
  they were exported utilities but are internal in spirit — note in migration
  guide).
- `sessionsToAgUiMessages` maps completed messages by role instead of splitting
  conversations (completed tool messages map to AG-UI `tool`; pending tool
  activity is omitted).

### 6. Everything else

- `SessionsList` new-session stub uses `messages: []`.
- Tests updated: `useAgUi.spec.ts`, `grouping.spec.ts`, plus new
  `src/utils/messages.spec.ts` covering the conversion/normalization layer.
- Stories/examples updated to the message model, plus a new agentic demo
  showing tool messages, consecutive assistant messages, and a system message.
- Docs updated: `CLAUDE.md`, `src/useAgUi/README.md`, `stories/Changelog.mdx`
  (2.0 entry with migration guide).

## Migration guide (summary)

| Before | After |
|---|---|
| `session.conversations: Conversation[]` | `session.messages: Message[]` (legacy `conversations` still accepted, auto-converted) |
| `{ question, response }` | two messages: `{ role: 'user', content }`, `{ role: 'assistant', content }` |
| `<SessionMessages>{convos => ...}</SessionMessages>` | `<SessionMessages>{messages => ...}</SessionMessages>` |
| `<SessionMessage conversation={c} />` | `<SessionMessage message={m} />` |
| `<MessageActions question response />` | `<MessageActions message={m} />` |
| `theme.messages.message.question/.response` | `theme.messages.message.user/.assistant` (+ new `system`, `tool`) |
| `addConversationToSession` / `updateConversationInSession` | `addMessageToSession` / `updateMessageInSession` |

## Addendum: participant identity (multi-user / multi-agent)

Implemented as a follow-up on the same branch. `role` alone cannot tell two
humans (both `role: 'user'`) or two agents apart, so `Message` gains an
optional author:

```typescript
export interface MessageAuthor {
  /** Stable identifier for the participant, eg. a user or agent id */
  id?: string;
  /** Display name rendered in the message header */
  name: string;
  /** Avatar for the participant — an image URL or a custom node */
  avatar?: string | ReactNode;
}

interface Message {
  // ...
  author?: MessageAuthor;
}
```

- `role` describes *what kind* of participant wrote the message (and picks
  the presentation); `author` describes *who* (and renders identity).
- When `author` is set, `SessionMessage` renders a `MessageAuthorBadge`
  (avatar + name, themed via `theme.messages.message.author`) above the
  default message body. Opt out per message with `showAuthor={false}`. Custom
  `children` replace the entire default template; compose the exported
  `MessageAuthorBadge` when a custom template should retain the author header.
- Custom roles are now fully assistant-like: in addition to falling back to
  the assistant theme class, they get the `MessageActions` footer and the
  streaming cursor (`isLast && isLoading`). `system` and `tool` still get
  neither. This makes named agents on custom roles first-class rather than
  a degraded assistant.
- Multiple humans: same `role: 'user'`, different `author`s. Multiple
  agents: shared `role: 'assistant'` or per-agent custom roles; per-agent
  styling hangs off `message.author.id` via the render prop (see
  `stories/MultiParty.stories.tsx`).

## Non-goals

- Multi-part message content (text + images + structured blocks in one
  message). `content` stays a markdown string; structured data goes in
  `metadata`. Parts can be layered on later without another model change.
- Branching/threaded conversations. The list stays linear.
- Persisting/streaming APIs. State management remains the consumer's job
  (or `useAgUi`).
