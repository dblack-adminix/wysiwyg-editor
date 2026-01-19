/**
 * useWysiwygEditor - React adapter для EditorCore (headless)
 * Тонкая обёртка без бизнес-логики
 */

import { useRef, useEffect, useCallback, useState } from 'react';
import { EditorCore, EditorCoreOptions } from '../core/EditorCore';
import { EditorStats } from '../core/Stats';

export interface UseWysiwygEditorOptions extends Omit<EditorCoreOptions, 'theme'> {
  value?: string;
  defaultValue?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export interface UseWysiwygEditorReturn {
  editorRef: React.RefObject<HTMLDivElement>;
  core: EditorCore;
  stats: EditorStats;
  isFullscreen: boolean;
  theme: 'light' | 'dark' | 'auto';
  toggleFullscreen: () => void;
  toggleTheme: () => void;
}

export function useWysiwygEditor(
  options: UseWysiwygEditorOptions = {}
): UseWysiwygEditorReturn {
  const {
    value,
    defaultValue,
    theme: initialTheme = 'dark',
    ...coreOptions
  } = options;

  const editorRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<EditorCore>(new EditorCore());
  
  const [stats, setStats] = useState<EditorStats>({
    wordCount: 0,
    charCount: 0,
    paragraphCount: 0
  });
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>(initialTheme);

  const isControlled = value !== undefined;

  // Initialize core
  useEffect(() => {
    if (!editorRef.current) return;

    // Configure core with onChange wrapper and theme
    const configuredCore = new EditorCore({
      ...coreOptions,
      theme: theme === 'auto' ? 'dark' : theme,
      onChange: (html, newStats) => {
        setStats(newStats);
        coreOptions.onChange?.(html, newStats);
      }
    });

    configuredCore.mount(editorRef.current);
    coreRef.current = configuredCore;

    // Set initial content
    if (value) {
      configuredCore.setHTML(value);
    } else if (defaultValue) {
      configuredCore.setHTML(defaultValue);
    }

    return () => {
      configuredCore.unmount();
    };
  }, []);

  // Update theme in core when it changes
  useEffect(() => {
    if (coreRef.current) {
      (coreRef.current as any).options.theme = theme === 'auto' ? 'dark' : theme;
    }
  }, [theme]);

  // Sync controlled value
  useEffect(() => {
    if (isControlled && value !== undefined && coreRef.current) {
      const currentHTML = coreRef.current.getHTML();
      if (currentHTML !== value) {
        coreRef.current.setHTML(value);
      }
    }
  }, [value, isControlled]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  return {
    editorRef,
    core: coreRef.current,
    stats,
    isFullscreen,
    theme,
    toggleFullscreen,
    toggleTheme
  };
}
