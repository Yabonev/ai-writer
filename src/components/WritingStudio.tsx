"use client";

import React, { useState } from "react";
import { Editor } from "~/components/ui/Editor";
import { Toast } from "~/components/ui/Toast";
import type { CursorPosition } from "~/types/editor";

/**
 * Clean, minimal writing studio with constrained text width and lots of whitespace
 */
export const WritingStudio: React.FC = () => {
  const [content, setContent] = useState("");
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(
    null,
  );
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);

    // Update statistics
    const words =
      newContent.trim() === "" ? 0 : newContent.trim().split(/\s+/).length;
    setWordCount(words);
    setCharCount(newContent.length);
  };

  const handleCursorChange = (position: CursorPosition | null) => {
    setCursorPosition(position);
  };

  const insertSampleText = () => {
    const sampleText = `The old castle stood majestically on the hill, its weathered stones telling stories of centuries past. Below, the village nestled in the valley, smoke rising from chimneys as the sun began to set behind the mountains.

This is a sample text to demonstrate the ContentEditable editor with proper cursor management, keyboard navigation, and text formatting features.

Try using Ctrl+Home to jump to the beginning, Ctrl+End to jump to the end, and Ctrl+Arrow keys for word navigation.`;

    setContent(sampleText);
  };

  const clearEditor = () => {
    setContent("");
  };

  return (
    <div className="relative h-screen w-screen bg-white">
      {/* Main Editor - Constrained width in center with lots of whitespace */}
      <section
        aria-label="Text Editor"
        className="flex h-full w-full justify-center"
      >
        <div
          className="relative h-full w-full max-w-none"
          style={{ width: "40%" }}
        >
          <div className="h-full py-16">
            <Editor
              content={content}
              onChange={handleContentChange}
              onCursorChange={handleCursorChange}
              placeholder="Once upon a time..."
              autoFocus={true}
              minHeight={0}
              className="h-full text-xl leading-relaxed text-gray-800"
            />
          </div>
        </div>
      </section>

      {/* Floating Controls - Top Right */}
      <aside
        aria-label="Editor Controls"
        className="fixed top-6 right-6 z-10 flex gap-2"
      >
        <button
          onClick={insertSampleText}
          className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-black/10"
          data-testid="insert-sample-btn"
          aria-label="Insert sample text into the editor"
        >
          Sample
        </button>
        <button
          onClick={clearEditor}
          className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-gray-600 transition-colors duration-200 hover:bg-black/10"
          data-testid="clear-editor-btn"
          aria-label="Clear all text from the editor"
        >
          Clear
        </button>
      </aside>

      {/* Floating Stats Toggle - Bottom Right */}
      <aside
        aria-label="Statistics Controls"
        className="fixed right-6 bottom-6 z-10"
      >
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-gray-500 transition-all duration-200 hover:bg-black/10 hover:text-gray-700"
          aria-label={
            showStats ? "Hide writing statistics" : "Show writing statistics"
          }
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </button>

        {/* Stats Panel */}
        {showStats && (
          <div
            className="absolute right-0 bottom-14 min-w-[160px] rounded-lg border border-gray-200/50 bg-white/90 p-4 shadow-lg backdrop-blur-sm"
            role="region"
            aria-label="Writing Statistics"
          >
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Words</span>
                <span
                  className="font-mono font-medium"
                  data-testid="word-count"
                >
                  {wordCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Characters</span>
                <span
                  className="font-mono font-medium"
                  data-testid="char-count"
                >
                  {charCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Position</span>
                <span
                  className="font-mono font-medium"
                  data-testid="cursor-position"
                >
                  {cursorPosition?.offset ?? "—"}
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Floating Shortcuts Info - Bottom Left (only show if content exists) */}
      {content.length > 0 && (
        <aside
          aria-label="Keyboard Shortcuts"
          className="fixed bottom-6 left-6 z-10"
        >
          <div
            className="max-w-xs rounded-lg border border-gray-200/50 bg-white/90 p-3 text-xs text-gray-500 shadow-lg backdrop-blur-sm"
            role="region"
            aria-label="Available keyboard shortcuts"
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span>
                <kbd className="rounded bg-gray-100 px-1 text-[10px]">⌘←</kbd>{" "}
                Word
              </span>
              <span>
                <kbd className="rounded bg-gray-100 px-1 text-[10px]">⌘→</kbd>{" "}
                Word
              </span>
              <span>
                <kbd className="rounded bg-gray-100 px-1 text-[10px]">⌘↑</kbd>{" "}
                Para ↑
              </span>
              <span>
                <kbd className="rounded bg-gray-100 px-1 text-[10px]">⌘↓</kbd>{" "}
                Para ↓
              </span>
            </div>
          </div>
        </aside>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
