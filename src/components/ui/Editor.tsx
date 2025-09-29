"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import type { EditorProps } from "~/types/editor";
import { useCursorPosition } from "~/hooks/useCursorPosition";
import {
  getTextContent,
  setTextContent,
  getCursorPosition,
  setCursorAtOffset,
} from "~/utils/cursor";

/**
 * Clean, minimal ContentEditable text editor
 *
 * Features:
 * - Preserves cursor position during programmatic content updates
 * - Keyboard navigation (Ctrl+Home/End, Ctrl+Arrow for word jumping)
 * - Proper line break handling (prevents div creation)
 * - Minimal, distraction-free design
 * - Auto-focus capability
 */
export const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  onCursorChange,
  placeholder = "Start writing...",
  className = "",
  autoFocus = false,
  disabled = false,
  minHeight = 300,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);
  const { saveCursor, restoreCursor, getCursor } = useCursorPosition(editorRef);

  // Sync external content changes while preserving cursor
  useEffect(() => {
    if (!editorRef.current || isComposing) return;

    const currentContent = getTextContent(editorRef.current);

    if (currentContent !== content) {
      const wasFocused = document.activeElement === editorRef.current;

      if (wasFocused) {
        saveCursor();
      }

      setTextContent(editorRef.current, content);

      if (wasFocused) {
        requestAnimationFrame(() => {
          restoreCursor();
        });
      }
    }
  }, [content, saveCursor, restoreCursor, isComposing]);

  // Auto-focus on mount only
  useEffect(() => {
    if (autoFocus && editorRef.current && !disabled) {
      editorRef.current.focus();
      if (content.length > 0) {
        setTimeout(() => {
          if (editorRef.current) {
            setCursorAtOffset(editorRef.current, content.length);
          }
        }, 0);
      }
    }
  }, [autoFocus, disabled, content.length]);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      if (disabled) return;

      const newContent = getTextContent(e.currentTarget);
      onChange(newContent);

      if (onCursorChange) {
        const position = getCursor();
        onCursorChange(position);
      }
    },
    [onChange, onCursorChange, getCursor, disabled],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "Home":
            e.preventDefault();
            if (editorRef.current) {
              const selection = window.getSelection();
              const range = document.createRange();
              range.setStart(editorRef.current, 0);
              range.collapse(true);
              selection?.removeAllRanges();
              selection?.addRange(range);
            }
            break;

          case "End":
            e.preventDefault();
            if (editorRef.current) {
              const selection = window.getSelection();
              const range = document.createRange();
              range.selectNodeContents(editorRef.current);
              range.collapse(false);
              selection?.removeAllRanges();
              selection?.addRange(range);
            }
            break;

          case "ArrowUp":
            e.preventDefault();
            if (editorRef.current) {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const content = editorRef.current.textContent || "";
                const currentOffset =
                  getCursorPosition(editorRef.current)?.offset ?? 0;

                let paragraphStart = 0;
                let foundParagraphBreak = false;

                for (let i = currentOffset - 1; i >= 0; i--) {
                  if (content[i] === "\n") {
                    if (i === 0 || content[i - 1] === "\n") {
                      paragraphStart = i + 1;
                      foundParagraphBreak = true;
                      break;
                    }
                  }
                }

                if (!foundParagraphBreak) {
                  paragraphStart = 0;
                }

                let targetPosition = paragraphStart;

                if (Math.abs(currentOffset - paragraphStart) <= 1) {
                  if (paragraphStart > 0) {
                    for (let i = paragraphStart - 2; i >= 0; i--) {
                      if (content[i] !== "\n") {
                        targetPosition = i + 1;
                        break;
                      }
                      if (i === 0) {
                        targetPosition = 0;
                        break;
                      }
                    }
                  } else {
                    targetPosition = content.length;
                  }
                }

                setCursorAtOffset(editorRef.current, targetPosition);
              }
            }
            break;

          case "ArrowDown":
            e.preventDefault();
            if (editorRef.current) {
              const selection = window.getSelection();
              if (selection && selection.rangeCount > 0) {
                const content = editorRef.current.textContent || "";
                const currentOffset =
                  getCursorPosition(editorRef.current)?.offset ?? 0;

                let paragraphEnd = content.length;
                for (let i = currentOffset; i < content.length; i++) {
                  if (
                    content[i] === "\n" &&
                    (i === content.length - 1 || content[i + 1] === "\n")
                  ) {
                    paragraphEnd = i;
                    break;
                  }
                }

                let targetPosition = paragraphEnd;

                if (currentOffset === paragraphEnd) {
                  if (paragraphEnd < content.length) {
                    for (let i = paragraphEnd + 1; i < content.length; i++) {
                      if (content[i - 1] === "\n" && content[i - 2] === "\n") {
                        targetPosition = i;
                        break;
                      }
                      if (content[i] !== "\n") {
                        targetPosition = i;
                        break;
                      }
                    }
                  } else {
                    targetPosition = 0;
                  }
                }

                setCursorAtOffset(editorRef.current, targetPosition);
              }
            }
            break;

          case "ArrowLeft":
          case "ArrowRight":
            break;
        }
      }

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();

          const lineBreak = document.createTextNode("\n");
          range.insertNode(lineBreak);

          range.setStartAfter(lineBreak);
          range.collapse(true);

          selection.removeAllRanges();
          selection.addRange(range);

          const event = new Event("input", { bubbles: true });
          editorRef.current?.dispatchEvent(event);
        }
      }
    },
    [disabled],
  );

  const handleFocus = useCallback(() => {
    // Focus handler for potential future use
  }, []);

  const handleBlur = useCallback(() => {
    // Blur handler for potential future use
  }, []);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  const showPlaceholder = content.trim() === "";

  return (
    <div className="relative h-full w-full" data-testid="editor-container">
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        className={`relative h-full w-full bg-transparent font-serif break-words whitespace-pre-wrap text-gray-900 selection:bg-blue-200/50 selection:text-blue-900 focus:outline-none ${disabled ? "cursor-not-allowed text-gray-400" : ""} ${className} `}
        style={{
          minHeight: `${minHeight}px`,
          lineHeight: "1.8",
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
        suppressContentEditableWarning={true}
        role="textbox"
        aria-label="Text editor"
        aria-multiline="true"
        aria-disabled={disabled}
        data-testid="editor-input"
      />

      {showPlaceholder && (
        <div
          className="pointer-events-none absolute top-0 left-0 font-serif text-xl text-gray-600 select-none"
          style={{
            lineHeight: "1.8",
          }}
          data-testid="editor-placeholder"
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};
