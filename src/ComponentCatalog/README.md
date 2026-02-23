# ComponentCatalog

The ComponentCatalog system lets LLMs render **custom React components** in chat
responses. Instead of static markdown, the LLM emits a JSON specification inside
a fenced code block and reachat validates, instantiates, and renders the
matching React component automatically.

## Quick Start

```tsx
import { Chat, componentCatalog, SessionMessages, ChatInput } from 'reachat';
import { z } from 'zod';

// 1. Define your components
const catalog = componentCatalog({
  WeatherCard: {
    description: 'Displays current weather for a city',
    props: z.object({
      city: z.string(),
      temperature: z.number(),
      condition: z.enum(['sunny', 'cloudy', 'rainy'])
    }),
    component: ({ city, temperature, condition }) => (
      <div className="weather-card">
        <h3>{city}</h3>
        <p>
          {temperature}°F &mdash; {condition}
        </p>
      </div>
    )
  }
});

// 2. Pass the catalog to <Chat>
function App() {
  return (
    <Chat sessions={sessions} activeSessionId={id} components={catalog}>
      <SessionMessages />
      <ChatInput />
    </Chat>
  );
}

// 3. Include the system prompt in your LLM call
const systemPrompt = catalog.systemPrompt();
// Send this as part of your system message so the LLM knows
// which components are available and how to use them.
```

When the LLM responds with a fenced code block like this:

````
Here's the current weather:

```component
{ "type": "WeatherCard", "props": { "city": "San Francisco", "temperature": 68, "condition": "cloudy" } }
```
````

...reachat will render your `WeatherCard` React component inline in the chat.

## Installation

The ComponentCatalog requires **zod** as a peer dependency for runtime prop
validation. If you use the built-in chart helper, **reaviz** is also needed.

```bash
npm install reachat zod
# Optional, for chart support:
npm install reaviz
```

## API Reference

### `componentCatalog(definitions, options?)`

The main entry point. Creates a catalog object you can pass directly to `<Chat>`.

```ts
import { componentCatalog } from 'reachat';

const catalog = componentCatalog(definitions, options);
```

**Parameters:**

| Name          | Type                      | Description                         |
| ------------- | ------------------------- | ----------------------------------- |
| `definitions` | `ComponentDefinitions`    | Map of component name to definition |
| `options`     | `ComponentCatalogOptions` | Optional configuration              |

**Returns** a `ComponentCatalog` object with:

| Property         | Type                   | Description                                   |
| ---------------- | ---------------------- | --------------------------------------------- |
| `remarkPlugin`   | `Plugin`               | Remark plugin for markdown processing         |
| `components`     | `Components`           | Markdown component overrides (`{ pre: ... }`) |
| `systemPrompt()` | `() => string`         | Generates LLM instructions                    |
| `definitions`    | `ComponentDefinitions` | The original definitions                      |

### `ComponentDefinition`

Each entry in the definitions map:

```ts
interface ComponentDefinition<TProps> {
  /** Human-readable description included in the LLM system prompt. */
  description: string;

  /** Zod schema for runtime validation of LLM-provided props. */
  props: z.ZodType<TProps>;

  /** React component to render. Receives validated props, optional
      children (for nested specs), and a sendMessage callback. */
  component: FC<
    TProps & {
      children?: ReactNode;
      sendMessage?: (message: string) => void;
    }
  >;
}
```

### `ComponentCatalogOptions`

```ts
interface ComponentCatalogOptions {
  /** Fenced code block language tag. Default: 'component' */
  language?: string;

  /** Custom error handler. Return a ReactNode to replace the
      default error UI, or undefined to keep it. */
  onError?: (error: ComponentCatalogError) => ReactNode | undefined;
}
```

### `ComponentCatalogError`

Passed to the `onError` callback when validation or rendering fails:

```ts
interface ComponentCatalogError {
  type: 'invalid_json' | 'unknown_component' | 'invalid_props' | 'render_error';
  message: string;
  raw: string;
  componentType?: string;
  issues?: { message: string; path: (string | number)[] }[];
}
```

## Defining Components

### Basic Component

```tsx
import { z } from 'zod';

const definitions = {
  AlertBox: {
    description: 'Displays an alert or notification',
    props: z.object({
      title: z.string().describe('Alert title'),
      message: z.string().describe('Alert body text'),
      severity: z.enum(['info', 'warning', 'error', 'success'])
    }),
    component: ({ title, message, severity }) => (
      <div className={`alert alert-${severity}`}>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
    )
  }
};
```

Use `.describe()` on Zod fields to provide hints in the generated system prompt.

### Layout Component with Children

Components can receive nested children via the `children` prop. Register a
layout component with an empty props schema:

```tsx
const definitions = {
  Row: {
    description:
      'A horizontal flex layout — use as a parent to arrange children side-by-side',
    props: z.object({}),
    component: ({ children }) => (
      <div style={{ display: 'flex', gap: 12 }}>{children}</div>
    )
  },
  DataCard: {
    description: 'Displays a single metric',
    props: z.object({
      title: z.string(),
      value: z.number(),
      unit: z.string().optional()
    }),
    component: ({ title, value, unit }) => (
      <div className="data-card">
        <span className="label">{title}</span>
        <span className="value">
          {value}
          {unit}
        </span>
      </div>
    )
  }
};
```

The LLM can then compose them:

```json
{
  "type": "Row",
  "props": {},
  "children": [
    {
      "type": "DataCard",
      "props": { "title": "Revenue", "value": 12450, "unit": "$" }
    },
    { "type": "DataCard", "props": { "title": "Users", "value": 8423 } }
  ]
}
```

### Interactive Component with `sendMessage`

Every component receives a `sendMessage` callback from the chat context. Use it
to let rendered components send follow-up messages:

```tsx
const definitions = {
  ActionButton: {
    description: 'A button that sends a follow-up chat message when clicked',
    props: z.object({
      label: z.string(),
      message: z.string()
    }),
    component: ({ label, message, sendMessage }) => (
      <button onClick={() => sendMessage?.(message)}>{label}</button>
    )
  }
};
```

### Built-in Chart Component

reachat ships a ready-made chart component definition powered by
[reaviz](https://github.com/reaviz/reaviz). Both `zod` and `reaviz` must be
installed:

```tsx
import { componentCatalog, createChartComponentDef } from 'reachat';

const catalog = componentCatalog({
  Chart: createChartComponentDef()
  // ...other components
});
```

The LLM can then emit:

```json
{
  "type": "Chart",
  "props": {
    "type": "bar",
    "data": [
      { "key": "Q1", "data": 100 },
      { "key": "Q2", "data": 200 },
      { "key": "Q3", "data": 150 }
    ],
    "title": "Quarterly Revenue"
  }
}
```

Supported chart types: `bar`, `line`, `area`, `pie`, `radialBar`, `radialArea`,
`sparkline`.

## JSON Spec Format

The LLM emits JSON inside a fenced code block tagged with the configured
language (default: `component`).

### Single Component

````
```component
{ "type": "WeatherCard", "props": { "city": "NYC", "temperature": 45 } }
```
````

### Multiple Components (array)

````
```component
[
  { "type": "WeatherCard", "props": { "city": "NYC", "temperature": 45 } },
  { "type": "WeatherCard", "props": { "city": "LA", "temperature": 78 } }
]
```
````

### Nested Children

````
```component
{
  "type": "Row",
  "props": {},
  "children": [
    { "type": "DataCard", "props": { "title": "Revenue", "value": 9000 } },
    { "type": "DataCard", "props": { "title": "Users", "value": 420 } }
  ]
}
```
````

## Wiring into `<Chat>`

### Simple (recommended)

Pass the catalog to the `components` prop. This automatically sets up the remark
plugin and markdown component overrides:

```tsx
<Chat sessions={sessions} activeSessionId={id} components={catalog}>
  <SessionMessages />
  <ChatInput />
</Chat>
```

### Advanced (manual wiring)

For fine-grained control, use the catalog's individual pieces:

```tsx
<Chat
  sessions={sessions}
  activeSessionId={id}
  remarkPlugins={[remarkGfm, catalog.remarkPlugin]}
  markdownComponents={{ ...catalog.components, ...myOtherOverrides }}
>
  <SessionMessages />
  <ChatInput />
</Chat>
```

## System Prompt Generation

Call `catalog.systemPrompt()` to get a pre-formatted instruction string that
tells the LLM which components are available, what props they accept, and how to
format the JSON. Include this in your LLM system message:

````ts
const systemPrompt = catalog.systemPrompt();

// Example output:
// When you need to render a dynamic UI component in your response,
// use a fenced code block with language `component` containing a JSON object:
//
// ```component
// { "type": "ComponentName", "props": { ... } }
// ```
//
// Available components:
//
// - **WeatherCard**: Displays current weather for a city
//   Props: { city: string, temperature: number, condition: "sunny" | "cloudy" | "rainy" }
````

### Custom Language Tag

Use a different code block language if `component` conflicts with your setup:

```ts
const catalog = componentCatalog(definitions, { language: 'ui' });
```

The LLM will then use ` ```ui ` blocks instead.

## Error Handling

The system validates every JSON spec before rendering. Four error types exist:

| Type                | When                                   |
| ------------------- | -------------------------------------- |
| `invalid_json`      | Malformed JSON or missing `type` field |
| `unknown_component` | Component name not found in catalog    |
| `invalid_props`     | Zod schema validation failed           |
| `render_error`      | Runtime error during React rendering   |

### Default Error UI

By default, errors render as an inline error box via `<ComponentError>`.

### Custom Error Handler

Provide an `onError` callback to replace or suppress the default UI:

```tsx
const catalog = componentCatalog(definitions, {
  onError: error => {
    if (error.type === 'unknown_component') {
      return <div>Component not available: {error.componentType}</div>;
    }
    // Return undefined to use default error UI
    return undefined;
  }
});
```

### Error Boundary

Each rendered component is wrapped in a React error boundary. If a component
throws during rendering, the error is caught and displayed without crashing the
rest of the chat interface.

## Validation Pipeline

The validation pipeline runs in order:

1. **JSON parse** &mdash; checks for syntactically valid JSON
2. **Structure check** &mdash; verifies `type` is a string
3. **Catalog lookup** &mdash; confirms the component exists in definitions
4. **Zod validation** &mdash; validates and strips props through the Zod schema
5. **Recursive children** &mdash; repeats steps 2-4 for nested children

All validation happens via `validateSpec()`, which is also exported for direct
use in testing or server-side validation:

```ts
import { validateSpec } from 'reachat';

const result = validateSpec(jsonString, catalog.definitions);
if (result.ok) {
  console.log('Valid specs:', result.specs);
} else {
  console.error('Validation error:', result.error);
}
```

## Lower-Level APIs

These are exported for advanced use cases:

| Export               | Description                                                  |
| -------------------- | ------------------------------------------------------------ |
| `ComponentRenderer`  | React component that validates and renders a raw JSON string |
| `ComponentError`     | Error display component used by the default error UI         |
| `createComponentPre` | Creates the `<pre>` override that intercepts code blocks     |
| `validateSpec`       | Validates a JSON string against definitions                  |
| `generatePrompt`     | Generates LLM system prompt from definitions                 |

## Full Example

See `stories/ComponentCatalog.stories.tsx` for a complete working example with
weather cards, alert boxes, status badges, data cards, and nested layouts.

````tsx
import { z } from 'zod';
import {
  Chat,
  SessionMessages,
  ChatInput,
  SessionMessagePanel,
  componentCatalog,
  createChartComponentDef
} from 'reachat';

// Define components with Zod schemas
const catalog = componentCatalog({
  WeatherCard: {
    description: 'Displays current weather conditions for a city',
    props: z.object({
      city: z.string().describe('City name'),
      temperature: z.number().describe('Temperature in Fahrenheit'),
      condition: z
        .enum(['sunny', 'cloudy', 'rainy'])
        .describe('Weather condition')
    }),
    component: ({ city, temperature, condition }) => (
      <div className="p-4 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white">
        <div className="text-sm opacity-80">{condition}</div>
        <div className="text-2xl font-bold">{city}</div>
        <div className="text-4xl font-light">{temperature}°F</div>
      </div>
    )
  },
  Chart: createChartComponentDef(),
  Row: {
    description: 'Horizontal flex layout for arranging children side-by-side',
    props: z.object({}),
    component: ({ children }) => (
      <div className="flex gap-3 flex-wrap">{children}</div>
    )
  }
});

// Wire into Chat
function App() {
  return (
    <Chat
      sessions={sessions}
      activeSessionId={activeId}
      components={catalog}
      onSendMessage={handleSend}
    >
      <SessionMessagePanel>
        <SessionMessages />
        <ChatInput />
      </SessionMessagePanel>
    </Chat>
  );
}

// Include in your LLM call
async function handleSend(message: string) {
  const response = await callLLM({
    system: catalog.systemPrompt(),
    messages: [{ role: 'user', content: message }]
  });
  // The response can include ```component blocks that render automatically
}
````
