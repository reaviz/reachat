import TestCSV from '@/data/sample.csv?raw';

/**
 * Parses a CSV string from a local file and returns an array of rows.
 * Sanitizes cell data to prevent injection attacks.
 * @param csvString The raw CSV string content to parse.
 * @returns The parsed CSV data as a 2D array of strings.
 */
export const parseCSV = (csvString: string = TestCSV): string[][] => {
  try {
    const rows = csvString.split('\n');
    return rows.map((row) => row.split(',').map((cell) => sanitizeCell(cell)));
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw new Error('Failed to parse CSV file.');
  }
};

/**
 * Sanitizes cell content to prevent CSV injection and other potential vulnerabilities.
 * Strips or encodes harmful characters that could be used in an attack.
 * @param cell The cell content to sanitize.
 * @returns The sanitized cell content.
 */
const sanitizeCell = (cell: string): string => {
  return cell.trim().replace(/^[=+\-@]/, '');
};
