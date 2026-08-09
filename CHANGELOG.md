# 4.0.0 - 8/9/26
- [breaking] replace the question/response `Conversation` model with a flat, role-based `Message` list to support agentic workflows
- [breaking] `SessionMessage` prop `conversation` renamed to `message`; rendering is now driven by `message.role`
- [breaking] `SessionMessages` render prop now receives `Message[]` instead of `Conversation[]`
- [breaking] `MessageActions` props `question`/`response` replaced by a single `message`
- [breaking] theme keys `messages.message.question`/`.response` renamed to `.user`/`.assistant`
- [breaking] `useAgUi` helpers `addConversationToSession`/`updateConversationInSession` renamed to `addMessageToSession`/`updateMessageInSession`
- [feature] new `Message` and `MessageRole` types — `user`, `assistant`, `system`, `tool` and custom role strings
- [feature] new theme keys `messages.message.system` and `messages.message.tool`
- [feature] `useAgUi` records tool calls as `role: 'tool'` messages with `metadata: { toolCallId, toolCallName, args }`, and streams text following a tool call into a new assistant message
- [feature] new `conversationsToMessages()` and `getSessionMessages()` utilities for normalizing session data
- [deprecation] `Conversation`, `Session.conversations`, `MessageQuestion` and `MessageResponse` are deprecated but still work

## Migration Guide

The legacy `conversations` array is still accepted and converted internally, so
**existing apps that only pass session data keep working without changes.** The
breaking parts are the component props and theme keys.

| Before | After |
|---|---|
| `session.conversations: Conversation[]` | `session.messages: Message[]` (legacy `conversations` still accepted, auto-converted) |
| `{ question, response }` | two messages: `{ role: 'user', content }` and `{ role: 'assistant', content }` |
| `<SessionMessages>{convos => ...}</SessionMessages>` | `<SessionMessages>{messages => ...}</SessionMessages>` |
| `<SessionMessage conversation={c} />` | `<SessionMessage message={m} />` |
| `<MessageActions question={q} response={r} />` | `<MessageActions message={m} />` |
| `<MessageQuestion question={q} />` / `<MessageResponse response={r} />` | `<SessionMessage message={m} />` (wrappers kept, deprecated) |
| `theme.messages.message.question` / `.response` | `theme.messages.message.user` / `.assistant` (plus new `system`, `tool`) |
| `addConversationToSession` / `updateConversationInSession` | `addMessageToSession` / `updateMessageInSession` |

### Session data

Do nothing and rely on the deprecated auto-conversion:

```tsx
// Still works — converted via getSessionMessages() internally
const sessions = [
  {
    id: '1',
    title: 'Weather',
    conversations: [
      {
        id: 'c1',
        createdAt: new Date(),
        question: 'What is the weather?',
        response: 'Sunny and 72°F.'
      }
    ]
  }
];
```

Or move to messages:

```tsx
import type { Session } from 'reachat';

const sessions: Session[] = [
  {
    id: '1',
    title: 'Weather',
    messages: [
      {
        id: 'm1',
        role: 'user',
        content: 'What is the weather?',
        createdAt: new Date()
      },
      {
        id: 'm2',
        role: 'assistant',
        content: 'Sunny and 72°F.',
        createdAt: new Date()
      }
    ]
  }
];
```

To convert stored data up front, use the exported helpers:

```tsx
import { conversationsToMessages, getSessionMessages } from 'reachat';

// Convert a legacy conversation array
const converted = conversationsToMessages(session.conversations);

// Or normalize any session, new or legacy, into a Message[]
const messages = getSessionMessages(session);
```

`getSessionMessages()` returns `session.messages` when present and falls back to
converting `session.conversations`. Prefer it anywhere you read messages off a
session.

### Custom renderers

```tsx
// Before
<SessionMessages>
  {conversations =>
    conversations.map((conversation, i) => (
      <SessionMessage
        key={conversation.id}
        conversation={conversation}
        isLast={i === conversations.length - 1}
      />
    ))
  }
</SessionMessages>

// After
<SessionMessages>
  {messages =>
    messages.map((message, i) => (
      <SessionMessage
        key={message.id}
        message={message}
        isLast={i === messages.length - 1}
      />
    ))
  }
</SessionMessages>
```

Each message renders in its own card, so a session is now a stream of message
cards rather than question/response pair cards. `SessionMessage` picks its
presentation from `message.role`: `user` renders files plus the expandable
markdown content, `assistant` renders markdown with sources, actions and the
loading cursor, and `system`/`tool`/custom roles use assistant-style content
with their own theme class.

### Custom themes

```tsx
// Before
const theme = {
  messages: { message: { question: '...', response: '...' } }
};

// After
const theme = {
  messages: {
    message: {
      user: '...',
      assistant: '...',
      system: '...', // new — muted, centered informational style
      tool: '...' // new — compact style for tool activity
    }
  }
};
```

### useAgUi

`useAgUi`'s public API (`sessions`, `sendMessage`, `stopMessage`, …) is
unchanged, but the sessions it produces are now message-based and tool calls
appear as `role: 'tool'` messages:

```tsx
[
  { id: '…', role: 'user', content: 'Weather in Paris?' },
  { id: '…', role: 'assistant', content: 'Let me check.' },
  {
    id: '…',
    role: 'tool',
    content: 'get_weather',
    metadata: { toolCallId: 'call_1', toolCallName: 'get_weather', args: '{"location":"Paris"}' }
  },
  { id: '…', role: 'assistant', content: 'It is 18°C and sunny.' }
]
```

Text that arrives after a tool call starts a *new* assistant message, so a
single run can produce multiple consecutive assistant messages. The module-level
helpers `addConversationToSession`/`updateConversationInSession` were renamed to
`addMessageToSession`/`updateMessageInSession`; the old names are removed. See
`src/useAgUi/README.md` for details.

# 3.4.1 - 6/15/26
- [chore] improve `Markdown` to supply its own defaults rather than rely on `Chat` to provide them

# 3.4.0 - 6/15/26
- [chore] decouple `Markdown` from `ChatContext` and `ChatTheme` so it can live on its own.

# 3.3.0 - 6/9/26
- [breaking] Remove UMD build (ESM-only) and modernize build tooling — Vite 8/Rolldown, ESLint 9 flat config, TypeScript 6, Vitest 4 #100

# 3.2.3 - 6/2/26
- [chore] improve docs

# 3.2.2 - 5/7/26
- [chore] upgrade depedencies

# 3.2.1 - 5/6/26
- [feature] Add onMessageChange callback to ChatInput #96
- [fix] Fix remarkCve to produce valid inline link nodes #97
- [fix] Add className prop to ChatInput component #95

# 3.2.0 - 5/5/26
- [feature] Add autoScroll for SessionMessages #93 
- [feature] Add multi-file support #91 
- [feature] Extend Markdown theme and CodeHighlighter functionality #90 
- [fix] export PartialChatTheme #94
- [fix] Misc Improvements #92

# 3.1.0 - 3/18/26
- [breaking] upgrade reablocks to v10 (Button `startAdornment`/`endAdornment` renamed to `start`/`end`)
- [breaking] upgrade React to v19
- [breaking] upgrade Storybook to v10
- [breaking] upgrade Vite to v7
- [chore] upgrade react-markdown to v10
- [chore] upgrade vitest to v3
- [chore] upgrade TypeScript to v5.9
- [chore] upgrade @vitejs/plugin-react to v5
- [chore] switch tsconfig moduleResolution to bundler
- [chore] add @tiptap/suggestion and @tiptap/extensions as dependencies
- [chore] remove deprecated @types/classnames
- [chore] remove consolidated Storybook packages (addon-essentials, addon-mdx-gfm, addon-storysource, manager-api, preview-api, theming)
- [chore] update CI workflows to Node.js 22
- [feature] add visual regression testing with @storybook/test-runner


# 3.0.0 - 2/24/26
- [feature] implement component catalog for dynamic components
- [breaking] update charts components to leverage new component library
- [chore] upgrade typescript

# 2.2.0 - 2/17/26
- [feature] ag-ui protocol adapter
- [feature] redact plugin and support for other plugins
- [improvement] improve performance and rendering

# 2.1.2 - 1/29/26
- [fix] bump vuln package

# 2.1.1 - 1/14/26
- [fix] improve lodash import for esm

# 2.1.0 - 1/13/26
- [feature] Add RichTextInput component with Tiptap v3 integration #78
- [feature] Add @mentions support with floating suggestion popup
- [feature] Add /slash commands support with keyboard navigation
- [feature] Add MentionList component for autocomplete suggestions
- [feature] Add SuggestionConfig type for dynamic/async search
- [feature] Add Floating UI integration for smart popup positioning
- [feature] Add ARIA accessibility attributes to suggestion popups
- [feature] Add ChartRenderer component with 7 chart types support #73
- [feature] Add bar, line, area, pie, radialBar, radialArea, and sparkline charts
- [feature] Add remarkChart plugin for markdown chart rendering
- [feature] Add ChartError component for validation and error handling
- [feature] Add chart theme customization support
- [feature] Add data validation for chart configurations
- [feature] Add reaviz integration for chart visualizations
- [feature] Add markdownComponents prop to Chat for custom component overrides
- [feature] Add ChatSuggestions component for clickable suggestion chips
- [feature] Add custom render support for suggestion items
- [feature] Add MessageStatus component with loading/complete/error states
- [feature] Add multi-step status display with animated transitions
- [feature] Add MessageStatusItem and StatusIcon for status visualization

# 2.0.2 - 7/23/25
- [chore] Export stories for docs website #56

# 2.0.1 - 4/07/25
- [feature] Update ChatBubble component

# 2.0.0 - 3/24/25
- [feature] Tailwind 4 Upgrade

# 2.0.0-beta.2 - 3/24/25
- [feature] export styles

# 2.0.0-beta.1 - 3/24/25
- [feature] Add ChatBubble component

- 
# 2.0.0-beta.0 - 2/17/25
- [feature] Tailwind 4 Upgrade
 
# 1.7.1 - 2/19/25
- [fix] fix ChatBubble global export

# 1.7.0
- [feature] Add AppBar component for customizable headers
- [feature] Add Templates support to predefined user prompts
- [feature] Add ChatBubble component for floating chat interfaces

# 1.6.1
- [chore] chore: update dependencies and fix vulnerabilities #44

# 1.6.0
- [feature] Add CSV Viewer to MessageFiles #42

# 1.5.1
- [chore] Update motion lib
- [chore] fix broken images
- [chore] update reablocks

# 1.5.0
- [feature] add masonary grid on image uploads

# 1.4.2
- [fix] fix katex failing next builds

# 1.4.1
- [fix] fix focus on session change

# 1.4.0
- [feature] simplify code setup

# 1.0.5
- [chore] Update theme

# 0.0.1
- [chore] First publish
