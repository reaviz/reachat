/**
 * Gets the cursor position as a DOMRect from a Tiptap/ProseMirror editor.
 * Used for positioning suggestion popups near the cursor.
 */
export const getCursorRect = (editor: any): DOMRect => {
  const { view } = editor;
  const { state } = view;
  const { from } = state.selection;

  // Get coordinates from the editor view at the current cursor position
  const coords = view.coordsAtPos(from);

  // Create a virtual rect at the cursor position
  return new DOMRect(coords.left, coords.top, 1, coords.bottom - coords.top);
};
