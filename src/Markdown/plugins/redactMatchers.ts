import type { RedactMatcher } from './remarkRedact';

/**
 * Matcher for Social Security Numbers (SSN).
 * Matches patterns like: 123-45-6789
 */
export const ssnMatcher: RedactMatcher = {
  name: 'SSN',
  pattern: /\b\d{3}-\d{2}-\d{4}\b/g
};

/**
 * Matcher for Credit Card numbers.
 * Matches patterns like: 1234-5678-9012-3456 or 1234 5678 9012 3456
 * Supports common formats with spaces, dashes, or no separators.
 */
export const creditCardMatcher: RedactMatcher = {
  name: 'Credit Card',
  pattern: /\b(?:\d[ -]*?){13,19}\b/g,
  validate: (match: string) => {
    // Exclude numbers that are clearly not credit cards
    if (/(?:years?|year|yr|yrs|old|age|phone|tel|call)/.test(match)) {
      return false;
    }

    const cardNumber = match.replace(/[ -]/g, '');
    // Basic length check to reduce false positives
    return cardNumber.length >= 13 && cardNumber.length <= 19;
  }
};

/**
 * Matcher for Bitcoin addresses.
 * Matches Bitcoin addresses (starts with 1 or 3, 26-35 alphanumeric characters).
 */
export const bitcoinMatcher: RedactMatcher = {
  name: 'Bitcoin',
  pattern: /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/g
};

/**
 * Common redaction matchers for sensitive data.
 */
export const commonRedactMatchers: RedactMatcher[] = [
  ssnMatcher,
  creditCardMatcher,
  bitcoinMatcher
];
