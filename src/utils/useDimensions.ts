import { useCallback, useEffect, useState } from 'react';

export const useDimensions = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  const observe = useCallback((element: HTMLElement | null) => {
    if (element) setRef(element);
  }, []);

  useEffect(() => {
    if (!ref) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(ref);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return { width, observe };
};
