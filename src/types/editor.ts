/**
 * Types for the ContentEditable editor component
 */

export interface CursorPosition {
  offset: number;
  node?: Node;
  line?: number;
  column?: number;
}

export interface EditorProps {
  /** Current text content */
  content: string;
  /** Callback when content changes */
  onChange: (content: string) => void;
  /** Callback when cursor position changes */
  onCursorChange?: (position: CursorPosition | null) => void;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Disable editing */
  disabled?: boolean;
  /** Minimum height */
  minHeight?: number;
}

export interface EditorState {
  content: string;
  cursorPosition: CursorPosition | null;
  isFocused: boolean;
  isComposing: boolean;
}
