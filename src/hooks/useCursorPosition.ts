import { useCallback, useRef } from "react";
import type { CursorPosition } from "~/types/editor";
import {
  getCursorPosition,
  setCursorPosition,
  saveCursorPosition,
  restoreCursorPosition,
} from "~/utils/cursor";

/**
 * Hook for managing cursor position in ContentEditable elements
 */
export function useCursorPosition(
  elementRef: React.RefObject<HTMLElement | null>,
) {
  const savedPositionRef = useRef<CursorPosition | null>(null);

  const getCursor = useCallback((): CursorPosition | null => {
    if (!elementRef.current) return null;
    return getCursorPosition(elementRef.current);
  }, [elementRef]);

  const setCursor = useCallback(
    (position: CursorPosition): void => {
      if (!elementRef.current) return;
      setCursorPosition(elementRef.current, position);
    },
    [elementRef],
  );

  const saveCursor = useCallback((): void => {
    if (!elementRef.current) return;
    savedPositionRef.current = saveCursorPosition(elementRef.current);
  }, [elementRef]);

  const restoreCursor = useCallback((): void => {
    if (!elementRef.current || !savedPositionRef.current) return;
    restoreCursorPosition(elementRef.current, savedPositionRef.current);
  }, [elementRef]);

  return {
    getCursor,
    setCursor,
    saveCursor,
    restoreCursor,
  };
}
