import { Plugin } from 'unified';
import { findAndReplace } from 'mdast-util-find-and-replace';

// Define matchers for sensitive data patterns
const matchers: { name: string; pattern: RegExp }[] = [
  { name: 'SSN', pattern: /\b\d{3}-\d{2}-\d{4}\b/g }, // SSN pattern
  { name: 'Credit Card', pattern: /\b(?:\d[ -]*?){13,16}\b/g }, // Credit card pattern
  { name: 'Bitcoin', pattern: /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g } // Bitcoin address pattern
];

// Redaction Plugin using `mdast-util-find-and-replace`
export const redactPlugin: Plugin = () => {
  return (tree: any) => {
    findAndReplace(
      tree,
      matchers.map(({ pattern }) => [pattern, '[REDACTED]'])
    );
    // *** uncomment to inject Redact component but it's not being picked up by the markdown renderer ***
    //   matchers.map(({ pattern }) => [
    //     pattern,
    //     (value: string) => `<Redact value="${value}"/>`,
    //   ])
    // );
  };
};
