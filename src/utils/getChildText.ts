import React from 'react';

/**
 * Recursively extracts text content from React children.
 * Handles strings, numbers, arrays, and React elements by traversing
 * their children props.
 *
 * @param children - The React children to extract text from
 * @returns The concatenated text content as a string
 */
export function getChildText(children: React.ReactNode): string {
  if (children === null || children === undefined) {
    return '';
  }
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getChildText).join('');
  }
  if (typeof children === 'object') {
    if (
      'props' in children &&
      (children as React.ReactElement<{ children?: React.ReactNode }>).props
    ) {
      const element = children as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      return getChildText(element.props.children);
    }
  }
  return '';
}
