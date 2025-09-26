import { sanitizeSVGCell } from './sanitize';

/**
 * Parses a CSV string from a local file and returns an array of rows.
 * Sanitizes cell data to prevent injection attacks.
 * @param csvString The raw CSV string content to parse.
 * @returns The parsed CSV data as a 2D array of strings.
 */
export const parseCSV = (csvString: string): string[][] => {
  try {
    const rows = csvString.split('\n');
    return rows.map(row => row.split(',').map(cell => sanitizeSVGCell(cell)));
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV file.');
  }
};
