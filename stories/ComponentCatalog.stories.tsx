import { Meta } from '@storybook/react';
import { subHours } from 'date-fns';
import {
  Chat,
  Session,
  SessionsList,
  SessionGroups,
  NewSessionButton,
  SessionMessages,
  ChatInput,
  SessionMessagePanel,
  SessionMessagesHeader,
  componentCatalog
} from '../src';

export default {
  title: 'Demos/ComponentCatalog',
  component: Chat
} as Meta;

// ---------------------------------------------------------------------------
// Simple Zod-like schemas (inline, no zod dependency needed for stories)
// ---------------------------------------------------------------------------

function zodString() {
  const schema = {
    _def: { typeName: 'ZodString', description: undefined as string | undefined },
    parse: (v: unknown) => String(v),
    safeParse: (v: unknown) => {
      if (typeof v === 'string') return { success: true as const, data: v };
      return {
        success: false as const,
        error: { issues: [{ message: 'Expected string', path: [] }] }
      };
    },
    describe(d: string) {
      return { ...schema, _def: { ...schema._def, description: d } };
    }
  };
  return schema;
}

function zodNumber() {
  const schema = {
    _def: { typeName: 'ZodNumber', description: undefined as string | undefined },
    parse: (v: unknown) => Number(v),
    safeParse: (v: unknown) => {
      if (typeof v === 'number') return { success: true as const, data: v };
      return {
        success: false as const,
        error: { issues: [{ message: 'Expected number', path: [] }] }
      };
    },
    describe(d: string) {
      return { ...schema, _def: { ...schema._def, description: d } };
    }
  };
  return schema;
}

function zodEnum(values: string[]) {
  const schema = {
    _def: { typeName: 'ZodEnum', values, description: undefined as string | undefined },
    parse: (v: unknown) => String(v),
    safeParse: (v: unknown) => {
      if (values.includes(String(v)))
        return { success: true as const, data: String(v) };
      return {
        success: false as const,
        error: {
          issues: [
            { message: `Expected one of: ${values.join(', ')}`, path: [] }
          ]
        }
      };
    },
    describe(d: string) {
      return { ...schema, _def: { ...schema._def, description: d } };
    }
  };
  return schema;
}

function zodOptional(inner: any) {
  return {
    _def: { typeName: 'ZodOptional', innerType: inner },
    parse: (v: unknown) => (v === undefined ? undefined : inner.parse(v)),
    safeParse: (v: unknown) => {
      if (v === undefined) return { success: true as const, data: undefined };
      return inner.safeParse(v);
    }
  };
}

function zodArray(inner: any) {
  return {
    _def: { typeName: 'ZodArray', type: inner },
    parse: (v: unknown) => (v as any[]).map(inner.parse),
    safeParse: (v: unknown) => {
      if (!Array.isArray(v))
        return {
          success: false as const,
          error: { issues: [{ message: 'Expected array', path: [] }] }
        };
      const results: any[] = [];
      for (let i = 0; i < v.length; i++) {
        const r = inner.safeParse(v[i]);
        if (!r.success) {
          return {
            success: false as const,
            error: {
              issues: r.error.issues.map((issue: any) => ({
                ...issue,
                path: [i, ...issue.path]
              }))
            }
          };
        }
        results.push(r.data);
      }
      return { success: true as const, data: results };
    }
  };
}

function zodObject(shape: Record<string, any>) {
  return {
    _def: { typeName: 'ZodObject', shape },
    parse: (v: unknown) => {
      const obj = v as Record<string, unknown>;
      const result: Record<string, any> = {};
      for (const [key, schema] of Object.entries(shape)) {
        result[key] = schema.parse(obj[key]);
      }
      return result;
    },
    safeParse: (v: unknown) => {
      try {
        if (!v || typeof v !== 'object') {
          return {
            success: false as const,
            error: { issues: [{ message: 'Expected object', path: [] }] }
          };
        }
        const obj = v as Record<string, unknown>;
        const result: Record<string, any> = {};
        for (const [key, schema] of Object.entries(shape)) {
          const r = schema.safeParse(obj[key]);
          if (!r.success) {
            return {
              success: false as const,
              error: {
                issues: r.error.issues.map((i: any) => ({
                  ...i,
                  path: [key, ...i.path]
                }))
              }
            };
          }
          result[key] = r.data;
        }
        return { success: true as const, data: result };
      } catch {
        return {
          success: false as const,
          error: { issues: [{ message: 'Validation failed', path: [] }] }
        };
      }
    }
  };
}

// ---------------------------------------------------------------------------
// Sample components
// ---------------------------------------------------------------------------

const WeatherCard = ({
  city,
  temperature,
  condition
}: {
  city: string;
  temperature: number;
  condition: string;
}) => (
  <div
    style={{
      padding: '16px',
      borderRadius: '12px',
      background:
        condition === 'sunny'
          ? 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
          : condition === 'rainy'
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      color: condition === 'rainy' ? '#fff' : '#1a1a2e',
      minWidth: 200
    }}
  >
    <div style={{ fontSize: '14px', opacity: 0.8 }}>{condition}</div>
    <div style={{ fontSize: '24px', fontWeight: 700 }}>{city}</div>
    <div style={{ fontSize: '36px', fontWeight: 300 }}>{temperature}°F</div>
  </div>
);

const AlertBox = ({
  title,
  message,
  severity
}: {
  title: string;
  message: string;
  severity: string;
}) => {
  const colors: Record<string, { bg: string; border: string; text: string }> = {
    info: { bg: '#e3f2fd', border: '#90caf9', text: '#1565c0' },
    warning: { bg: '#fff3e0', border: '#ffcc80', text: '#e65100' },
    error: { bg: '#ffebee', border: '#ef9a9a', text: '#c62828' },
    success: { bg: '#e8f5e9', border: '#a5d6a7', text: '#2e7d32' }
  };
  const c = colors[severity] || colors.info;
  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        border: `1px solid ${c.border}`,
        background: c.bg,
        color: c.text
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: '14px' }}>{message}</div>
    </div>
  );
};

const StatusBadge = ({
  label,
  status
}: {
  label: string;
  status: string;
}) => {
  const colors: Record<string, string> = {
    online: '#22c55e',
    offline: '#ef4444',
    away: '#f59e0b',
    busy: '#ef4444'
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: '999px',
        background: `${colors[status] || '#6b7280'}20`,
        color: colors[status] || '#6b7280',
        fontSize: '13px',
        fontWeight: 500
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: colors[status] || '#6b7280'
        }}
      />
      {label}
    </span>
  );
};

const DataCard = ({
  title,
  value,
  unit,
  trend
}: {
  title: string;
  value: number;
  unit?: string;
  trend?: string;
}) => (
  <div
    style={{
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      background: '#fff',
      minWidth: 160
    }}
  >
    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: 4 }}>
      {title}
    </div>
    <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>
      {value}
      {unit && (
        <span style={{ fontSize: '14px', fontWeight: 400, marginLeft: 2 }}>
          {unit}
        </span>
      )}
    </div>
    {trend && (
      <div
        style={{
          fontSize: '12px',
          color: trend.startsWith('+') ? '#22c55e' : '#ef4444',
          marginTop: 4
        }}
      >
        {trend}
      </div>
    )}
  </div>
);

const RowLayout = ({
  children
}: {
  children?: React.ReactNode;
}) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{children}</div>
);

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

const catalog = componentCatalog({
  WeatherCard: {
    description: 'Displays current weather conditions for a city',
    props: zodObject({
      city: zodString().describe('City name'),
      temperature: zodNumber().describe('Temperature in Fahrenheit'),
      condition: zodEnum(['sunny', 'cloudy', 'rainy']).describe(
        'Current weather condition'
      )
    }),
    component: WeatherCard as any
  },
  AlertBox: {
    description: 'Displays an alert or notification box',
    props: zodObject({
      title: zodString().describe('Alert title'),
      message: zodString().describe('Alert message body'),
      severity: zodEnum(['info', 'warning', 'error', 'success']).describe(
        'Severity level'
      )
    }),
    component: AlertBox as any
  },
  StatusBadge: {
    description: 'Displays a status indicator badge',
    props: zodObject({
      label: zodString().describe('Display label'),
      status: zodEnum(['online', 'offline', 'away', 'busy']).describe(
        'Current status'
      )
    }),
    component: StatusBadge as any
  },
  DataCard: {
    description: 'Displays a single metric or KPI',
    props: zodObject({
      title: zodString().describe('Metric name'),
      value: zodNumber().describe('Metric value'),
      unit: zodOptional(zodString()),
      trend: zodOptional(zodString())
    }),
    component: DataCard as any
  },
  Row: {
    description:
      'A horizontal flex layout container — use as a parent to lay out child components side-by-side',
    props: zodObject({}),
    component: RowLayout as any
  }
});

// ---------------------------------------------------------------------------
// Session data
// ---------------------------------------------------------------------------

const weatherSpec = {
  type: 'WeatherCard',
  props: { city: 'San Francisco', temperature: 68, condition: 'cloudy' }
};

const alertSpec = {
  type: 'AlertBox',
  props: {
    title: 'Deployment Successful',
    message:
      'Version 2.4.1 has been deployed to production. All health checks passing.',
    severity: 'success'
  }
};

const multiWeatherSpec = [
  {
    type: 'WeatherCard',
    props: { city: 'San Francisco', temperature: 68, condition: 'cloudy' }
  },
  {
    type: 'WeatherCard',
    props: { city: 'New York', temperature: 45, condition: 'rainy' }
  },
  {
    type: 'WeatherCard',
    props: { city: 'Miami', temperature: 82, condition: 'sunny' }
  }
];

const dashboardSpec = {
  type: 'Row',
  props: {},
  children: [
    {
      type: 'DataCard',
      props: {
        title: 'Revenue',
        value: 12450,
        unit: '$',
        trend: '+12.5% from last month'
      }
    },
    {
      type: 'DataCard',
      props: {
        title: 'Active Users',
        value: 8423,
        trend: '+5.2% from last week'
      }
    },
    {
      type: 'DataCard',
      props: { title: 'Error Rate', value: 0.3, unit: '%', trend: '-0.1%' }
    }
  ]
};

const sessions: Session[] = [
  {
    id: 'session-1',
    title: 'Dynamic Components Demo',
    createdAt: subHours(new Date(), 2),
    updatedAt: new Date(),
    conversations: [
      {
        id: 'conv-1',
        question: "What's the weather in San Francisco?",
        response: `Here's the current weather:

\`\`\`component
${JSON.stringify(weatherSpec, null, 2)}
\`\`\`

Looks like a typical foggy day in the city!`,
        createdAt: subHours(new Date(), 2)
      },
      {
        id: 'conv-2',
        question: 'Show me weather for multiple cities',
        response: `Here's a comparison of weather across three cities:

\`\`\`component
${JSON.stringify(multiWeatherSpec, null, 2)}
\`\`\`

San Francisco is mild, New York is rainy, and Miami is warm and sunny.`,
        createdAt: subHours(new Date(), 1.5)
      },
      {
        id: 'conv-3',
        question: 'Any deployment updates?',
        response: `Yes! Here's the latest update:

\`\`\`component
${JSON.stringify(alertSpec, null, 2)}
\`\`\`

Everything looks good. All services are healthy.`,
        createdAt: subHours(new Date(), 1)
      },
      {
        id: 'conv-4',
        question: 'Show me the dashboard metrics',
        response: `Here's your dashboard overview with nested components:

\`\`\`component
${JSON.stringify(dashboardSpec, null, 2)}
\`\`\`

Revenue is trending up and error rates are down. Looking great!`,
        createdAt: subHours(new Date(), 0.5)
      }
    ]
  }
];

const errorSessions: Session[] = [
  {
    id: 'session-errors',
    title: 'Error Handling Demo',
    createdAt: subHours(new Date(), 1),
    updatedAt: new Date(),
    conversations: [
      {
        id: 'conv-err-1',
        question: 'Show me an unknown component',
        response: `Here's a component that doesn't exist in the catalog:

\`\`\`component
{ "type": "NonExistentWidget", "props": { "foo": "bar" } }
\`\`\`

The error should be displayed gracefully above.`,
        createdAt: subHours(new Date(), 1)
      },
      {
        id: 'conv-err-2',
        question: 'Show me invalid JSON',
        response: `Here's some broken JSON:

\`\`\`component
{ type: WeatherCard, props: invalid }
\`\`\`

The parser should handle this gracefully.`,
        createdAt: subHours(new Date(), 0.5)
      },
      {
        id: 'conv-err-3',
        question: 'Show me invalid props',
        response: `Here's a valid component type with wrong props:

\`\`\`component
{ "type": "WeatherCard", "props": { "city": 123, "temperature": "not-a-number", "condition": "unknown" } }
\`\`\`

Zod validation should catch the prop type mismatches.`,
        createdAt: new Date()
      }
    ]
  }
];

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

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

export const BasicExample = () => (
  <div className="dark:bg-gray-950 bg-white" style={storyStyle}>
    <Chat
      viewType="console"
      sessions={sessions}
      activeSessionId="session-1"
      components={catalog}
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

export const ErrorHandling = () => (
  <div className="dark:bg-gray-950 bg-white" style={storyStyle}>
    <Chat
      viewType="console"
      sessions={errorSessions}
      activeSessionId="session-errors"
      components={catalog}
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

export const ChatViewOnly = () => (
  <div
    className="dark:bg-gray-950 bg-white"
    style={{ ...storyStyle, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}
  >
    <Chat
      viewType="chat"
      sessions={sessions}
      activeSessionId="session-1"
      components={catalog}
    >
      <SessionMessagePanel>
        <SessionMessagesHeader />
        <SessionMessages />
        <ChatInput />
      </SessionMessagePanel>
    </Chat>
  </div>
);

export const SystemPromptPreview = () => {
  const prompt = catalog.systemPrompt();
  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 600 }}>
        Generated LLM System Prompt
      </h2>
      <p style={{ marginBottom: 16, color: '#6b7280', fontSize: 14 }}>
        This is what <code>catalog.systemPrompt()</code> generates.
        Include this in your LLM system message so it knows how to use
        your registered components.
      </p>
      <pre
        style={{
          padding: 20,
          borderRadius: 8,
          background: '#1e1e2e',
          color: '#cdd6f4',
          fontSize: 13,
          lineHeight: 1.6,
          overflow: 'auto',
          whiteSpace: 'pre-wrap'
        }}
      >
        {prompt}
      </pre>
    </div>
  );
};
