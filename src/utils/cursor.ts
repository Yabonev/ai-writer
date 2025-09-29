import type { CursorPosition } from "~/types/editor";

/**
 * Utilities for managing cursor position in ContentEditable elements
 */

/**
 * Get the plain text content from a ContentEditable element
 */
export function getTextContent(element: HTMLElement): string {
  return element.textContent || "";
}

/**
 * Set text content in a ContentEditable element
 */
export function setTextContent(element: HTMLElement, content: string): void {
  // Clear existing content
  element.textContent = content;
}

/**
 * Get current cursor position in a ContentEditable element
 */
export function getCursorPosition(element: HTMLElement): CursorPosition | null {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);

  // Calculate offset from start of element
  const preRange = document.createRange();
  preRange.setStart(element, 0);
  preRange.setEnd(range.startContainer, range.startOffset);

  const offset = preRange.toString().length;

  return {
    offset,
    node: range.startContainer,
  };
}

/**
 * Set cursor position in a ContentEditable element
 */
export function setCursorPosition(
  element: HTMLElement,
  position: CursorPosition,
): void {
  const { offset } = position;

  // Create a TreeWalker to traverse text nodes
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  let currentOffset = 0;
  let targetNode: Node | null = null;
  let targetOffset = 0;

  // Find the target text node and offset
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const nodeLength = node.textContent?.length ?? 0;

    if (currentOffset + nodeLength >= offset) {
      targetNode = node;
      targetOffset = offset - currentOffset;
      break;
    }

    currentOffset += nodeLength;
  }

  // If no text node found, use the element itself
  if (!targetNode) {
    targetNode = element;
    targetOffset = 0;
  }

  // Set the cursor position
  const selection = window.getSelection();
  const range = document.createRange();

  try {
    range.setStart(
      targetNode,
      Math.min(targetOffset, targetNode.textContent?.length ?? 0),
    );
    range.collapse(true);

    selection?.removeAllRanges();
    selection?.addRange(range);
  } catch (error) {
    console.warn("Failed to set cursor position:", error);
  }
}

/**
 * Save current cursor position
 */
export function saveCursorPosition(
  element: HTMLElement,
): CursorPosition | null {
  return getCursorPosition(element);
}

/**
 * Restore cursor position
 */
export function restoreCursorPosition(
  element: HTMLElement,
  position: CursorPosition | null,
): void {
  if (position) {
    setCursorPosition(element, position);
  }
}

/**
 * Fast cursor positioning utility for efficient paragraph navigation
 */
export function setCursorAtOffset(
  element: HTMLElement,
  targetOffset: number,
): void {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  let currentPos = 0;
  let targetNode: Node | null = null;
  let nodeOffset = 0;

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const nodeLength = node.textContent?.length ?? 0;

    if (currentPos + nodeLength >= targetOffset) {
      targetNode = node;
      nodeOffset = targetOffset - currentPos;
      break;
    }
    currentPos += nodeLength;
  }

  if (targetNode) {
    const selection = window.getSelection();
    const range = document.createRange();

    try {
      range.setStart(
        targetNode,
        Math.min(nodeOffset, targetNode.textContent?.length ?? 0),
      );
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    } catch (error) {
      console.warn("Failed to set cursor position:", error);
    }
  }
}
