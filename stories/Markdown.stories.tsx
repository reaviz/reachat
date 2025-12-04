import type { Meta, StoryObj } from '@storybook/react';
import { Markdown } from '../src/Markdown';
import { chatTheme } from '../src/theme';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

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
| Ransomware Attacks             | High-volume ransomware targeting manufacturing and industrial control systems; sophisticated groups like Qilin, SafePay, Devman active | Manufacturing, ICS, Supply Chains       | Highly Likely   | Critical        | Qilin alone accounted for ~15% of all industrial ransomware incidents Q2 2025; ties to nation-state actors increase strategic risk|
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
      <Markdown {...args}>{riskTableMarkdown}</Markdown>
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

