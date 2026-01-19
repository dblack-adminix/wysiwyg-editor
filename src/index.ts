// ============================================
// HEADLESS CORE (Pure JS/TS, NO React)
// ============================================
export { EditorCore } from './core/EditorCore';
export type { EditorCoreAPI, EditorCoreOptions } from './core/EditorCore';

export { Commands } from './core/Commands';
export type { CommandsAPI, BasicCommand } from './core/Commands';

export { SelectionManager } from './core/SelectionManager';

export { Stats } from './core/Stats';
export type { EditorStats } from './core/Stats';

export { Autosave } from './core/Autosave';
export type { AutosaveOptions } from './core/Autosave';

export { DragDrop } from './core/DragDrop';
export type { DragDropCallback } from './core/DragDrop';

export { Export } from './core/Export';

// ============================================
// REACT ADAPTER
// ============================================
export { useWysiwygEditor } from './hooks/useWysiwygEditor';
export type { UseWysiwygEditorOptions, UseWysiwygEditorReturn } from './hooks/useWysiwygEditor';

// ============================================
// UI COMPONENTS (Optional)
// ============================================
export { WysiwygEditor } from './components/WysiwygEditor';

// ============================================
// UTILS
// ============================================
export {
  sanitizeHtml,
  normalizeHtml,
  stripHtml,
  countWords,
  countParagraphs
} from './utils/htmlUtils';

export {
  parseVideoUrl,
  createVideoEmbed
} from './utils/videoParser';

export {
  saveSelection,
  restoreSelection
} from './utils/selection';

// ============================================
// CONSTANTS
// ============================================
export { COLORS, EMOJIS, DEFAULT_CONTENT } from './constants';

// ============================================
// TYPES (Legacy compatibility)
// ============================================
export type {
  Theme,
  EditorCommand,
  EditorMeta,
  ToolbarGroup,
  ToolbarButton,
  ToolbarConfig,
  WysiwygEditorProps,
  EditorState,
  VideoEmbedResult
} from './types';
