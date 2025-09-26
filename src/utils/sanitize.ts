/**
 * Sanitizes cell content to prevent CSV injection and other potential vulnerabilities.
 * Based on the documentation of OWASP for CSV Injection
 * https://owasp.org/www-community/attacks/CSV_Injection
 * @param cell The cell content to sanitize.
 * @returns The sanitized cell content.
 */
export const sanitizeSVGCell = (cell: string): string => {
  const trimmed = cell.trim();
  // Escape double quotes by doubling them
  const escaped = trimmed.replace(/"/g, '""');
  // Add single quote prefix only for potentially dangerous content
  const prefix = /^[=+\-@]/.test(trimmed) ? "'" : '';
  // Only wrap in quotes if the content contains special characters
  const needsQuotes = /[",\n\r]/.test(escaped) || prefix;

  return needsQuotes ? `"${prefix}${escaped}"` : escaped;
};
