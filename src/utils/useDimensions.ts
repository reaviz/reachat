import { useCallback, useEffect, useRef, useState } from 'react';

export const useDimensions = () => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const rafId = useRef<number | null>(null);

  const observe = useCallback((element: HTMLElement | null) => {
    if (element) setRef(element);
  }, []);

  useEffect(() => {
    if (!ref) return;

    const resizeObserver = new ResizeObserver(entries => {
      // Batch updates with requestAnimationFrame to avoid layout thrashing
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(() => {
        for (const entry of entries) {
          setWidth(entry.contentRect.width);
        }
        rafId.current = null;
      });
    });

    resizeObserver.observe(ref);

    return () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      resizeObserver.disconnect();
    };
  }, [ref]);

  return { width, observe };
};
