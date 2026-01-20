# CLAUDE.md - AI Assistant Guide for reachat

## Project Overview

**reachat** is a React UI library for building chat/LLM experiences. It provides customizable, composable components for building chat interfaces with support for markdown rendering, rich text input with mentions and slash commands, file uploads, session management, and theming via Tailwind CSS.

- **Repository**: reaviz/reachat
- **License**: Apache-2.0
- **Package Manager**: pnpm (v9.5.0)
- **Documentation**: https://reachat.dev
- **Storybook**: https://storybook.reachat.dev

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | UI framework |
| TypeScript | 4.9.5 | Type safety |
| Tailwind CSS | 4.x | Styling |
| Vite | 5.x | Build tool & dev server |
| Storybook | 8.x | Component development |
| Vitest | 1.x | Testing |
| reablocks | 9.x | Base UI components |
| Tiptap | 3.x | Rich text editor framework |
| Floating UI | 0.27.x | Popup positioning |
| motion | 12.x | Animations |

## Directory Structure

```
reachat/
├── src/                    # Source code
│   ├── index.ts           # Main entry point - exports all public APIs
│   ├── types.ts           # Core TypeScript interfaces
│   ├── theme.ts           # Theme system definitions
│   ├── Chat.tsx           # Root Chat component
│   ├── ChatContext.ts     # React context for chat state
│   ├── AppBar/            # App bar component
│   ├── ChatBubble/        # Chat bubble component
│   ├── ChatInput/         # Input field components
│   ├── ChatSuggestions/   # Suggestion chips component
│   ├── Markdown/          # Markdown rendering (code, tables, etc.)
│   ├── MessageStatus/     # Loading/status indicators
│   ├── SessionMessages/   # Message display components
│   ├── SessionsList/      # Session list/grouping components
│   ├── utils/             # Utility functions
│   └── assets/            # SVG icons
├── stories/               # Storybook stories and examples
├── .storybook/            # Storybook configuration
├── dist/                  # Build output (generated)
└── scripts/               # Build scripts
```

## Quick Commands

```bash
# Install dependencies
npm install

# Start Storybook development server (port 9009)
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build library for production
npm run build

# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code with Prettier
npm run prettier

# Build Storybook for deployment
npm run build-storybook
```

## Core Concepts

### Component Architecture

The library uses a **composable slot-based architecture**. The main `Chat` component wraps children and provides context:

```tsx
<Chat sessions={sessions} activeSessionId={activeId}>
  <SessionMessagePanel>
    <SessionMessages />
    <ChatInput />
  </SessionMessagePanel>
</Chat>
```

### Key Data Types

```typescript
// Core data structures in src/types.ts
interface Session {
  id: string;
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
  conversations: Conversation[];
}

interface Conversation {
  id: string;
  createdAt: Date;
  question: string;
  response?: string | string[];
  sources?: ConversationSource[];
  files?: ConversationFile[];
}
```

### View Types

Three view modes are supported:
- `console` - Full screen with sessions sidebar
- `companion` - Compact/mobile view
- `chat` - Chat only, no sessions list

### Theme System

The theme is defined in `src/theme.ts` using a typed object with Tailwind classes:

```typescript
const chatTheme: ChatTheme = {
  base: 'dark:text-white text-gray-500',
  console: 'flex w-full gap-4 h-full',
  // ... nested theme objects for each component
};
```

Components use the theme via `useComponentTheme` from reablocks:
```typescript
const theme = useComponentTheme<ChatTheme>('chat', customTheme);
```

### Rich Text Input Features

The library includes an advanced rich text input system built on **Tiptap v3** with support for mentions and slash commands.

#### RichTextInput Component

Located in `src/ChatInput/RichTextInput.tsx`, this component provides:

- **Auto-expanding textarea** with configurable min/max heights
- **Mentions support** - Trigger with `@` to mention users, files, or custom entities
- **Slash commands** - Trigger with `/` for quick actions
- **Custom keyboard handling** - Shift+Enter for multi-line, Enter to submit
- **Floating suggestions** - Smart popup positioning using Floating UI
- **Keyboard navigation** - Arrow keys, Enter/Tab to select, Escape to close

**Exposed Methods via Ref:**
```typescript
interface RichTextInputRef {
  focus: () => void;
  getValue: () => string;
  setValue: (value: string) => void;
  insertText: (text: string) => void;
}
```

**Usage Example:**
```tsx
<ChatInput
  mentions={{
    trigger: '@',
    items: [
      { id: '1', label: 'John Doe', description: 'Product Manager' },
      { id: '2', label: 'Jane Smith', description: 'Engineer' }
    ]
  }}
  commands={{
    trigger: '/',
    items: [
      { id: 'help', label: 'Help', description: 'Get help', type: 'action' },
      { id: 'search', label: 'Search', description: 'Search docs', type: 'insert' }
    ]
  }}
/>
```

#### MentionList Component

Located in `src/ChatInput/MentionList.tsx`, this floating popup component:

- Displays suggestion items with keyboard navigation
- Auto-scrolls to keep selected item visible
- Supports custom rendering via `renderItem` and `renderEmpty` callbacks
- Full ARIA accessibility attributes
- Smart positioning to stay within viewport bounds

#### Suggestion Types

Core types defined in `src/ChatInput/types.ts`:

```typescript
// Base suggestion item
interface SuggestionItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  metadata?: Record<string, any>;
}

// For @mentions
interface MentionItem extends SuggestionItem {
  value?: string; // Override display value
}

// For /commands
interface SlashCommandItem extends SuggestionItem {
  shortcut?: string; // Keyboard shortcut hint
  type?: 'insert' | 'action';
}

// Configuration for suggestions
interface SuggestionConfig<T = SuggestionItem> {
  trigger: string;
  items?: T[];
  onSearch?: (query: string) => Promise<T[]>;
  onSelect?: (item: T) => void;
  maxResults?: number;
  renderItem?: (item: T) => ReactNode;
  renderEmpty?: () => ReactNode;
}
```

#### Theme Support

New theme sections in `src/theme.ts`:

```typescript
input: {
  popup: {
    base: string;        // Popup container styles
    content: string;     // List content wrapper
    item: string;        // Individual item
    itemHighlighted: string; // Active/selected item
    itemIcon: string;    // Icon wrapper
    itemContent: string; // Text content wrapper
    itemLabel: string;   // Primary label
    itemDescription: string; // Secondary description
    itemShortcut: string; // Shortcut hint
    empty: string;       // Empty state
    loading: string;     // Loading state
  },
  tag: {
    base: string;        // Tag styles in editor
    mention: string;     // Mention-specific styles
    command: string;     // Command-specific styles
  },
  editor: {
    base: string;        // Editor wrapper
    container: string;   // Content container
    placeholder: string; // Placeholder text
  }
}
```

## Code Conventions

### Import Aliases

Use `@/` for absolute imports from `src/`:
```typescript
// Good
import { ChatContext } from '@/ChatContext';

// Avoid relative paths across directories
import { ChatContext } from '../../../ChatContext'; // Bad
```

The ESLint rule `no-relative-import-paths` enforces this (same folder imports are allowed).

### Component Patterns

1. **Functional Components with TypeScript**:
```typescript
interface ComponentProps {
  /** JSDoc comment for prop */
  propName: string;
}

export const Component: FC<ComponentProps> = ({ propName }) => {
  // ...
};
```

2. **Forward Refs when exposing methods**:
```typescript
export interface ComponentRef {
  focus: () => void;
}

export const Component = forwardRef<ComponentRef, ComponentProps>((props, ref) => {
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus()
  }));
});
```

3. **Context consumption**:
```typescript
const { theme, isLoading, sendMessage } = useContext(ChatContext);
```

### File Organization

Each component module follows this structure:
```
ComponentName/
├── index.ts           # Re-exports public APIs
├── ComponentName.tsx  # Main component
└── SubComponent.tsx   # Related sub-components
```

### Styling Conventions

1. Use Tailwind CSS classes via the theme system
2. Use `cn()` from reablocks for conditional class merging:
```typescript
<div className={cn(theme.base, { [theme.active]: isActive })} />
```

3. Dark mode uses `dark:` prefix in Tailwind classes
4. Theme tokens defined in `src/index.css` using `@theme inline`

### Code Style

- **Semicolons**: Required
- **Quotes**: Single quotes
- **Trailing commas**: None
- **Indentation**: 2 spaces
- **Line width**: 80 characters

## Testing

Tests use Vitest with jsdom environment. Test files are co-located with source:

```
utils/
├── grouping.ts
└── grouping.spec.ts
```

Run tests:
```bash
npm test              # Watch mode
npm run test:coverage # With coverage report
```

## Storybook

Stories are located in `/stories/` directory and follow the pattern:

```typescript
import { Meta } from '@storybook/react';

export default {
  title: 'Demos/ComponentName',
  component: ComponentName
} as Meta;

export const Default = () => <ComponentName />;
export const WithProps = () => <ComponentName prop="value" />;
```

## Build Process

The build creates three outputs:
1. **ESM** (`dist/index.js`) - Modern ES modules
2. **UMD** (`dist/index.umd.cjs`) - Universal module
3. **CSS** (`dist/index.css`) - Tailwind-compiled styles
4. **Types** (`dist/index.d.ts`) - TypeScript declarations

## Key Dependencies

- **reablocks**: Base component library (Button, Textarea, etc.)
- **reakeys**: Keyboard shortcuts
- **react-markdown**: Markdown rendering
- **react-syntax-highlighter**: Code highlighting
- **date-fns**: Date utilities
- **lodash**: Utility functions
- **@tiptap/react**: Rich text editor framework (v3.x) with extensions for:
  - Document/paragraph/text structure
  - Hard breaks and placeholders
  - Mention support for @mentions
- **@floating-ui/react**: Smart popup positioning for suggestion dropdowns

## Common Tasks

### Adding a New Component

1. Create directory: `src/NewComponent/`
2. Create main component file: `NewComponent.tsx`
3. Create index.ts with exports
4. Add theme properties to `ChatTheme` in `src/theme.ts`
5. Export from `src/index.ts`
6. Create story in `stories/NewComponent.stories.tsx`

### Modifying the Theme

1. Update interface in `src/theme.ts` (ChatTheme)
2. Add default values in `chatTheme` object
3. Use via `theme.newProperty` in components

### Adding Markdown Features

1. Check existing plugins in `src/Markdown/plugins/`
2. Add new remark/rehype plugins to the `remarkPlugins` prop
3. Custom renderers go in the Markdown component

### Configuring Mentions and Slash Commands

The `ChatInput` component accepts `mentions` and `commands` props for rich text functionality:

**Static Items:**
```tsx
<ChatInput
  mentions={{
    trigger: '@',
    items: [
      { id: '1', label: 'User Name', description: 'Role', icon: <Icon /> }
    ]
  }}
/>
```

**Dynamic Search:**
```tsx
<ChatInput
  commands={{
    trigger: '/',
    onSearch: async (query) => {
      const results = await searchAPI(query);
      return results.map(r => ({ id: r.id, label: r.name }));
    },
    maxResults: 10
  }}
/>
```

**Custom Selection Handler:**
```tsx
<ChatInput
  mentions={{
    trigger: '@',
    items: mentionItems,
    onSelect: (item) => {
      console.log('Selected:', item);
      // Handle custom logic
    }
  }}
/>
```

**Custom Rendering:**
```tsx
<ChatInput
  commands={{
    trigger: '/',
    items: commandItems,
    renderItem: (item) => (
      <div>
        <strong>{item.label}</strong>
        <span>{item.shortcut}</span>
      </div>
    ),
    renderEmpty: () => <div>No commands found</div>
  }}
/>
```

## Important Notes

- The library is designed for React 18+
- All components support dark/light themes
- CSS is injected via JS for library builds (vite-plugin-css-injected-by-js)
- SVGs are imported as React components using vite-plugin-svgr
- The package uses ES modules (`"type": "module"`)
- **Rich text input** uses Tiptap v3 with a document/paragraph/text node structure
- **Suggestion popups** use Floating UI with flip/shift middleware for smart positioning
- **Accessibility**: All interactive components include proper ARIA attributes

## Git Workflow

- Pre-commit hooks run via Husky
- Prettier formats staged files automatically
- Follow conventional commit messages
