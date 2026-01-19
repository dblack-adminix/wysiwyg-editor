export type Theme = 'dark' | 'light' | 'auto';

export type EditorCommand =
  | 'bold' | 'italic' | 'underline' | 'strikeThrough'
  | 'subscript' | 'superscript' | 'undo' | 'redo'
  | 'justifyLeft' | 'justifyCenter' | 'justifyRight' | 'justifyFull'
  | 'insertUnorderedList' | 'insertOrderedList'
  | 'indent' | 'outdent' | 'removeFormat';

export interface EditorMeta {
  wordCount: number;
  charCount: number;
  paragraphCount: number;
}

export interface ToolbarGroup {
  name: string;
  buttons: ToolbarButton[];
}

export interface ToolbarButton {
  command?: EditorCommand;
  icon: string;
  tooltip: string;
  onClick?: () => void;
  active?: boolean;
}

export interface ToolbarConfig {
  groups: ToolbarGroup[];
}

export interface WysiwygEditorProps {
  value?: string;
  defaultValue?: string;
  onChange?: (html: string, meta: EditorMeta) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  
  // Features
  enableAutosave?: boolean;
  autosaveKey?: string;
  autosaveIntervalMs?: number;
  enablePreviewPanel?: boolean;
  enableSourceTab?: boolean;
  enableFindReplace?: boolean;
  enablePrint?: boolean;
  enableFullscreen?: boolean;
  
  // Permissions
  allowImages?: boolean;
  allowImageUpload?: boolean;
  allowVideoEmbeds?: boolean;
  allowVideoUpload?: boolean;
  allowTables?: boolean;
  
  // Callbacks
  onImageUpload?: (file: File) => Promise<string>;
  onVideoUpload?: (file: File) => Promise<string>;
  
  // Appearance
  theme?: Theme;
  toolbarConfig?: Partial<ToolbarConfig>;
  mobileOptimized?: boolean;
  
  // Sanitization
  sanitizeHtml?: boolean;
  normalizeHtml?: boolean;
}

export interface EditorState {
  html: string;
  meta: EditorMeta;
  isFullscreen: boolean;
  theme: Theme;
  savedSelection: Range | null;
}

export interface VideoEmbedResult {
  embedUrl: string;
  provider: 'youtube' | 'vimeo' | 'unknown';
}
