import { Meta } from '@storybook/react-vite';
import {
  Markdown,
  chatTheme,
  commonRedactMatchers,
  remarkCve,
  remarkRedact
} from '../src';

const markdownTheme = chatTheme.messages.message.markdown;

const showcaseMarkdown = `# Markdown Showcase

This is **bold**, *italic*, and \`inline code\`.

## Lists

- Item one
- Item two
- Item three

1. First
2. Second
3. Third

## Table

| Name | Value |
| ---- | ----- |
| Alpha | 10 |
| Beta | 20 |

## Code

\`\`\`ts
export const sum = (a: number, b: number) => a + b;
\`\`\`

[Read the docs](https://reachat.dev)
`;

const cveAndRedactMarkdown = `# Security Findings

Potential incidents:
- CVE-2021-44228
- CVE-2023-4863

Sensitive details:
- SSN: 123-45-6789
- Credit card: 4532-1234-5678-9010
- Email: security@example.com
`;

export default {
  title: 'Components/Markdown',
  component: Markdown
} as Meta<typeof Markdown>;

export const Basic = () => (
  <div className="bg-white dark:bg-gray-950 p-6 rounded-md max-w-4xl">
    <Markdown theme={markdownTheme}>{showcaseMarkdown}</Markdown>
  </div>
);

export const WithPlugins = () => (
  <div className="bg-white dark:bg-gray-950 p-6 rounded-md max-w-4xl">
    <Markdown
      theme={markdownTheme}
      remarkPlugins={[remarkCve, remarkRedact(commonRedactMatchers)]}
    >
      {cveAndRedactMarkdown}
    </Markdown>
  </div>
);

export const CustomComponents = () => (
  <div className="bg-white dark:bg-gray-950 p-6 rounded-md max-w-4xl">
    <Markdown
      theme={markdownTheme}
      customComponents={{
        p: props => <p {...props} className="mb-4 text-indigo-300" />,
        h2: props => <h2 {...props} className="text-2xl mb-3 text-cyan-300" />
      }}
    >
      {`# Overrides

## Styled Heading

This paragraph is rendered through custom markdown components.`}
    </Markdown>
  </div>
);
