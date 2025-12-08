import type { Meta, StoryObj } from '@storybook/react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { Markdown, remarkCve } from '../src/Markdown';
import { chatTheme } from '../src/theme';

export default {
  title: 'Components/Markdown',
  component: Markdown,
  args: {
    theme: chatTheme,
    remarkPlugins: [remarkGfm, remarkMath]
  }
} as Meta<typeof Markdown>;

type Story = StoryObj<typeof Markdown>;

const riskTableMarkdown = `
Austin, based strictly on the provided organizational profile of Acme Controls International plc and the Dragos Q2 2025 ransomware threat intelligence, I have created a concise Risk Table illustrating key risk areas, their impact domains, likelihood, and priority levels for your strategic assessment.

| Risk Category                  | Description                                                                                                  | Impacted Areas                           | Likelihood      | Priority Level  | Remarks/Notes                                                                                                                     |
|-------------------------------|--------------------------------------------------------------------------------------------------------------|----------------------------------------|-----------------|-----------------|----------------------------------------------------------------------------------------------------------------------------------|
| Ransomware Attacks             | CVE-2024-21762 High-volume ransomware targeting manufacturing and industrial control systems; sophisticated groups like Qilin, SafePay, Devman active | Manufacturing, ICS, Supply Chains       | Highly Likely   | Critical        | Qilin alone accounted for ~15% of all industrial ransomware incidents Q2 2025; ties to nation-state actors increase strategic risk|
| Critical Vulnerability Exploits| Exploitation of unpatched Fortinet, SAP Netweaver, SimpleHelp vulnerabilities leading to network compromise | IT-OT networks, Remote Access Points    | Highly Likely   | High            | Notable CVEs: CVE-2024-21762 (Fortinet), CVE-2025-31324 (SAP); patch management is critical                                     |
| Supply Chain Disruptions        | Ransomware, component shortages, geopolitical conflict impact supply and finance operations                   | Supply Chain, Procurement, Vendors      | Likely          | High            | Includes semiconductor shortages, geopolitical events in Middle East and Russia/Ukraine impacting component availability        |
| Social Engineering Attacks      | Increased phishing, vishing, and helpdesk impersonation leading to credential theft and initial access       | Employees, IT helpdesk                   | Likely          | High            | Attackers use voice spoofing, Teams calls, and email bombing; training and awareness crucial                                      |
| AI-driven Attack Enhancements   | Emerging use of AI for phishing, evasion, and automated reconnaissance reducing detection windows            | Security Operations, SOC                 | Medium Likely   | Medium          | Threat actors enhance sophistication, requiring advanced detection technologies                                                 |
| Data Privacy and Compliance Risks| Potential violations of GDPR, US state privacy laws and sector-specific reporting obligations due to breaches | Legal, Compliance Departments            | Even Chance     | Medium          | Incident impacts can trigger complex regulatory reporting and fines                                                               |
| Environmental and Product Liability Litigation| PFAS contamination and asbestos-related claims risk operational and reputational impact               | Legal, Environmental Compliance, Public Affairs | Even Chance     | Medium          | Ongoing remediation and litigation in Wisconsin sites; impacts company reputation and financial reserves                         |
| Competitor-led Market Shifts     | Competition from Honeywell, Siemens, Schneider Electric in smart building and cooling systems sectors        | Product Development, Strategic Planning | Medium          | Low             | Market dynamics but outside direct cybersecurity scope                                                                             |

This risk table uses Dragos ransomware intelligence trends along with Acme Controls' industrial, geographic, regulatory, and operational context to prioritize risks most pertinent for strategic decision-making.

Let me know your next question or if you want me to elaborate on specific risks before we proceed to complete the Strategic Risk Assessment.`;

export const RiskAssessmentTable: Story = {
  render: args => (
    <div className="p-8 bg-background-neutral-canvas-base max-w-full overflow-x-auto">
      <Markdown {...args} remarkPlugins={[remarkGfm, remarkMath, remarkCve]}>
        {riskTableMarkdown}
      </Markdown>
    </div>
  )
};

export const SimpleTable: Story = {
  render: args => (
    <div className="p-8 bg-background-neutral-canvas-base">
      <Markdown {...args}>
        {`
| Name | Age | Location |
|------|-----|----------|
| Alice | 30 | New York |
| Bob | 25 | London |
| Charlie | 35 | Tokyo |
`}
      </Markdown>
    </div>
  )
};

export const TableWithMarkdown: Story = {
  render: args => (
    <div className="p-8 bg-background-neutral-canvas-base">
      <Markdown {...args}>
        {`
## Security Vulnerabilities

| CVE ID | Severity | Description | Fix Available |
|--------|----------|-------------|---------------|
| CVE-2024-21762 | **Critical** | Remote code execution in Fortinet SSL VPN | Yes - Patch v7.2.3 |
| CVE-2025-31324 | **High** | SQL injection in SAP Netweaver | Yes - Update required |
| CVE-2024-12345 | *Medium* | XSS vulnerability in web interface | Yes - v2.1.0+ |
`}
      </Markdown>
    </div>
  )
};

export const InlineAndCodeBlocks: Story = {
  render: args => (
    <div className="p-8 bg-background-neutral-canvas-base max-w-4xl">
      <Markdown {...args}>
        {`
# Inline Code vs Code Blocks

## Inline Code Examples

Use inline code when referencing code elements within sentences:

- Call the \`useState\` hook to manage component state
- Import the component with \`import { Button } from 'reablocks'\`
- Set the variable using \`const name = 'John'\`
- The function \`calculateTotal()\` returns a number
- Access the property with \`user.email\`
- Use the className \`bg-blue-500\` for styling

You can also use inline code for short commands like \`npm install\` or file paths like \`/src/components/App.tsx\`.

## Code Block Examples

Use code blocks for multi-line code snippets:
\`\`\`
Hello, world!
\`\`\`

### TypeScript/React Component

\`\`\`typescript
import { useState } from 'react';
import { Button } from 'reablocks';

interface UserProps {
  name: string;
  email: string;
}

export const UserProfile = ({ name, email }: UserProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="p-4 border rounded">
      <h2>{name}</h2>
      <p>{email}</p>
      <Button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Save' : 'Edit'}
      </Button>
    </div>
  );
};
\`\`\`

### JavaScript

\`\`\`javascript
function fetchUserData(userId) {
  return fetch(\`/api/users/\${userId}\`)
    .then(response => response.json())
    .then(data => {
      console.log('User data:', data);
      return data;
    })
    .catch(error => {
      console.error('Error fetching user:', error);
    });
}
\`\`\`

### Python

\`\`\`python
def calculate_total(items):
    total = sum(item['price'] * item['quantity'] for item in items)
    return round(total, 2)

items = [
    {'name': 'Book', 'price': 12.99, 'quantity': 2},
    {'name': 'Pen', 'price': 1.50, 'quantity': 5}
]

print(f"Total: $\{calculate_total(items)}")
\`\`\`

### JSON

\`\`\`json
{
  "name": "reachat",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.3.0",
    "reablocks": "^8.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
\`\`\`

### CSS/Tailwind

\`\`\`css
.chat-bubble {
  padding: 1rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chat-bubble:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}
\`\`\`

### Bash/Shell

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
\`\`\`

### SQL

\`\`\`sql
SELECT
  u.id,
  u.name,
  u.email,
  COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name, u.email
ORDER BY order_count DESC
LIMIT 10;
\`\`\`

## Mixed Usage

You can combine inline code and code blocks in the same content:

To create a new React component, first import \`React\` and \`useState\`:

\`\`\`tsx
import React, { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
\`\`\`

Then use it in your app by importing it with \`import { Counter } from './Counter'\` and rendering \`<Counter />\` in your JSX.
`}
      </Markdown>
    </div>
  )
};

export const AllMarkdownFeatures: Story = {
  render: args => (
    <div className="p-8 bg-background-neutral-canvas-base max-w-4xl">
      <Markdown {...args}>
        {`
# Comprehensive Markdown Test

## Tables

### Simple Table
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

### Table with Alignment
| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Text         | Text           | Text          |
| More text    | More text      | More text     |

---

## Text Formatting

**Bold text** and *italic text* and ***bold italic***.

## Links

Check out [this link](https://example.com).

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

## Code

Inline \`code\` example.

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Headings

# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading
`}
      </Markdown>
    </div>
  )
};
