# useAgUi

A React hook that connects reachat to any [AG-UI protocol](https://docs.ag-ui.com) compatible agent endpoint. It handles SSE streaming, session management, and state — returning everything the `<Chat>` component needs as props.

**No extra dependencies required.** The hook implements SSE parsing with the native Fetch API, so you don't need `@ag-ui/client`, RxJS, or any other AG-UI packages.

## Quick Start

```tsx
import {
  Chat,
  SessionsList,
  SessionGroups,
  SessionMessages,
  SessionMessagePanel,
  ChatInput,
  NewSessionButton,
  useAgUi
} from 'reachat';

function App() {
  const agui = useAgUi({
    agent: 'https://my-agent.example.com/run'
  });

  return (
    <Chat
      sessions={agui.sessions}
      activeSessionId={agui.activeSessionId}
      isLoading={agui.isLoading}
      onSelectSession={agui.selectSession}
      onDeleteSession={agui.deleteSession}
      onNewSession={agui.createSession}
      onSendMessage={agui.sendMessage}
      onStopMessage={agui.stopMessage}
    >
      <SessionsList>
        <NewSessionButton />
        <SessionGroups />
      </SessionsList>
      <SessionMessagePanel>
        <SessionMessages />
        <ChatInput />
      </SessionMessagePanel>
    </Chat>
  );
}
```

## How It Works

1. When the user sends a message, the hook sends an HTTP POST to your agent endpoint with a `RunAgentInput` payload containing the conversation history, tools, and context.
2. The agent responds with a Server-Sent Events (SSE) stream of AG-UI events.
3. The hook parses the stream in real-time, accumulating `TEXT_MESSAGE_CONTENT` deltas into the conversation response so the UI updates token-by-token.
4. Sessions and conversations are managed internally — a new session is auto-created on first message if none is active.

```
Browser                          Agent Endpoint
  │                                    │
  │  POST {threadId, messages, ...}    │
  │ ──────────────────────────────────>│
  │                                    │
  │  SSE: TEXT_MESSAGE_START           │
  │ <──────────────────────────────────│
  │  SSE: TEXT_MESSAGE_CONTENT (delta) │
  │ <──────────────────────────────────│
  │  SSE: TEXT_MESSAGE_CONTENT (delta) │
  │ <──────────────────────────────────│
  │  SSE: TEXT_MESSAGE_END             │
  │ <──────────────────────────────────│
  │  SSE: RUN_FINISHED                 │
  │ <──────────────────────────────────│
```

## Options

```typescript
interface UseAgUiOptions {
  /** URL of the AG-UI compatible agent endpoint. */
  agent: string;

  /** Initial sessions to populate the chat. */
  initialSessions?: Session[];

  /** Initial active session ID. */
  initialActiveSessionId?: string;

  /** Tools to expose to the agent. */
  tools?: AgUiTool[];

  /** Context to send with each run. */
  context?: AgUiContext[];

  /** Additional properties forwarded to the agent. */
  forwardedProps?: Record<string, unknown>;

  /** Custom headers for the HTTP request. */
  headers?: Record<string, string>;

  /** Called when a tool call is received. Return the result as a string. */
  onToolCall?: (toolCall: AgUiToolCallInfo) => Promise<string> | string;

  /** Called when the agent run encounters an error. */
  onError?: (error: Error) => void;

  /** Called for every AG-UI event received (useful for debugging). */
  onEvent?: (event: AgUiEvent) => void;
}
```

## Return Value

All return values map directly to `<Chat>` component props:

| Property          | Type                        | Description                               |
| ----------------- | --------------------------- | ----------------------------------------- |
| `sessions`        | `Session[]`                 | All chat sessions                         |
| `activeSessionId` | `string \| null`            | Currently active session                  |
| `isLoading`       | `boolean`                   | Whether the agent is streaming a response |
| `selectSession`   | `(id: string) => void`      | Select a session                          |
| `deleteSession`   | `(id: string) => void`      | Delete a session                          |
| `createSession`   | `() => void`                | Create a new empty session                |
| `sendMessage`     | `(message: string) => void` | Send a message to the agent               |
| `stopMessage`     | `() => void`                | Cancel the in-flight request              |

## Examples

### With Authentication

```tsx
const agui = useAgUi({
  agent: 'https://my-agent.example.com/run',
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### With Tool Calls

Define tools using JSON Schema parameters and handle them with the `onToolCall` callback:

```tsx
const agui = useAgUi({
  agent: 'https://my-agent.example.com/run',
  tools: [
    {
      name: 'get_weather',
      description: 'Get the current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'City name' }
        },
        required: ['location']
      }
    }
  ],
  onToolCall: async toolCall => {
    if (toolCall.toolCallName === 'get_weather') {
      const { location } = JSON.parse(toolCall.args);
      const weather = await fetchWeather(location);
      return JSON.stringify(weather);
    }
    return '{}';
  }
});
```

### With Context

Send additional context to the agent alongside the conversation history:

```tsx
const agui = useAgUi({
  agent: 'https://my-agent.example.com/run',
  context: [
    {
      description: 'Current user profile',
      value: JSON.stringify({ name: 'Jane', role: 'admin' })
    },
    {
      description: 'Application state',
      value: JSON.stringify({ page: '/dashboard' })
    }
  ]
});
```

### With Error Handling

```tsx
const agui = useAgUi({
  agent: 'https://my-agent.example.com/run',
  onError: error => {
    toast.error(`Agent error: ${error.message}`);
  }
});
```

### Debugging with onEvent

Log every raw AG-UI event for debugging:

```tsx
const agui = useAgUi({
  agent: 'https://my-agent.example.com/run',
  onEvent: event => {
    console.log(`[AG-UI] ${event.type}`, event);
  }
});
```

### Pre-populated Sessions

Start with existing conversation history:

```tsx
const agui = useAgUi({
  agent: 'https://my-agent.example.com/run',
  initialSessions: [
    {
      id: 'session-1',
      title: 'Previous chat',
      createdAt: new Date(),
      updatedAt: new Date(),
      conversations: [
        {
          id: 'conv-1',
          question: 'Hello!',
          response: 'Hi there! How can I help?',
          createdAt: new Date()
        }
      ]
    }
  ],
  initialActiveSessionId: 'session-1'
});
```

## Supported AG-UI Events

The hook handles the following AG-UI event types:

| Event                  | Behavior                                    |
| ---------------------- | ------------------------------------------- |
| `TEXT_MESSAGE_CONTENT` | Appends delta to the streaming response     |
| `TEXT_MESSAGE_CHUNK`   | Same as above (convenience event)           |
| `TOOL_CALL_START`      | Begins tracking a tool call                 |
| `TOOL_CALL_ARGS`       | Accumulates streamed tool arguments         |
| `TOOL_CALL_END`        | Invokes `onToolCall` with the complete call |
| `RUN_ERROR`            | Invokes `onError` callback                  |
| `RUN_FINISHED`         | Marks the run as complete                   |

Other events (`RUN_STARTED`, `STEP_STARTED`, `STEP_FINISHED`, `STATE_SNAPSHOT`, etc.) are passed through to the `onEvent` callback but don't affect the chat state directly.

## Agent Endpoint Contract

Your agent endpoint must accept a POST request and respond with an SSE stream:

**Request:**

```
POST /your-agent-endpoint
Content-Type: application/json
Accept: text/event-stream

{
  "threadId": "abc123",
  "runId": "run_456",
  "messages": [
    { "id": "msg-1", "role": "user", "content": "Hello" }
  ],
  "tools": [],
  "context": [],
  "state": null,
  "forwardedProps": {}
}
```

**Response (SSE stream):**

```
data: {"type":"RUN_STARTED","threadId":"abc123","runId":"run_456"}

data: {"type":"TEXT_MESSAGE_START","messageId":"resp-1","role":"assistant"}

data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"resp-1","delta":"Hello"}

data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"resp-1","delta":"! How can I help?"}

data: {"type":"TEXT_MESSAGE_END","messageId":"resp-1"}

data: {"type":"RUN_FINISHED","threadId":"abc123","runId":"run_456"}
```

This is the standard AG-UI protocol contract. Any framework that implements it (LangGraph, Mastra, CrewAI, custom) will work out of the box.

## Exported Types

All AG-UI types are re-exported from `reachat` for convenience:

```tsx
import {
  useAgUi,
  AgUiEventType,
  // Event types
  type AgUiEvent,
  type AgUiBaseEvent,
  type AgUiRunStartedEvent,
  type AgUiRunFinishedEvent,
  type AgUiRunErrorEvent,
  type AgUiTextMessageStartEvent,
  type AgUiTextMessageContentEvent,
  type AgUiTextMessageEndEvent,
  type AgUiTextMessageChunkEvent,
  type AgUiToolCallStartEvent,
  type AgUiToolCallArgsEvent,
  type AgUiToolCallEndEvent,
  type AgUiToolCallResultEvent,
  type AgUiToolCallInfo,
  // Message/input types
  type AgUiMessage,
  type AgUiTool,
  type AgUiContext,
  type AgUiRunAgentInput,
  type AgUiRole,
  // Hook types
  type UseAgUiOptions,
  type UseAgUiReturn
} from 'reachat';
```
