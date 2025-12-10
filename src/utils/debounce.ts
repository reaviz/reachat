/**
 * Debounce a function.
 * @param func - The function to debounce.
 * @param wait - The wait time in milliseconds.
 * @returns The debounced function.
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};
