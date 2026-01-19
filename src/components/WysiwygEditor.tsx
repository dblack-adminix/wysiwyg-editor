import { useState, useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { useWysiwygEditor } from '../hooks/useWysiwygEditor';
import { useIsMobile } from '../hooks/useIsMobile';
import { WysiwygEditorProps } from '../types';
import { Toolbar } from './Toolbar';
import { StatusBar } from './StatusBar';
import { FindReplace } from './FindReplace';
import { PreviewPanel } from './PreviewPanel';
import { LinkModal } from './LinkModal';
import { ImageModal } from './ImageModal';
import { VideoModal } from './VideoModal';
import { TableModal } from './TableModal';
import { PrintModal } from './PrintModal';
import { CodeBlock } from './CodeBlock';
import styles from '../WysiwygEditor.module.css';

export function WysiwygEditor(props: WysiwygEditorProps) {
  const {
    value,
    defaultValue,
    onChange,
    placeholder = 'Начните печатать или перетащите изображение...',
    className = '',
    style,
    enableAutosave = false,
    autosaveKey = 'wysiwyg-editor-content',
    autosaveIntervalMs = 2000,
    enablePreviewPanel = true,
    enableSourceTab = true,
    enableFindReplace = true,
    enablePrint = true,
    enableFullscreen = true,
    allowImages = true,
    allowImageUpload = true,
    allowVideoEmbeds = true,
    allowVideoUpload = false,
    allowTables = true,
    onImageUpload,
    onVideoUpload,
    theme: initialTheme = 'dark',
    sanitizeHtml = false,
    mobileOptimized = true
  } = props;

  const isMobile = useIsMobile();
  const shouldOptimizeForMobile = mobileOptimized && isMobile;

  const {
    editorRef,
    core,
    stats,
    isFullscreen,
    theme,
    toggleFullscreen
  } = useWysiwygEditor({
    value,
    defaultValue,
    onChange,
    placeholder,
    autosave: {
      enabled: enableAutosave,
      key: autosaveKey,
      intervalMs: autosaveIntervalMs
    },
    sanitize: sanitizeHtml,
    theme: initialTheme
  });

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const codeBlockRootsRef = useRef<Map<Element, Root>>(new Map());

  const isLight = theme === 'light';

  // Render CodeBlock components for all code blocks
  useEffect(() => {
    if (!editorRef.current) return;

    const renderCodeBlocks = () => {
      const codeBlocks = editorRef.current?.querySelectorAll('pre.code-block');
      if (!codeBlocks) return;

      const currentRoots = codeBlockRootsRef.current;
      const processedElements = new Set<Element>();

      codeBlocks.forEach((pre) => {
        processedElements.add(pre);
        
        const codeElement = pre.querySelector('code');
        if (!codeElement) return;

        const language = pre.getAttribute('data-language') || 'plain-text';
        
        // Декодируем сохраненный код из base64
        const savedCodeBase64 = pre.getAttribute('data-original-code');
        let code = '';
        
        if (savedCodeBase64) {
          try {
            code = decodeURIComponent(escape(atob(savedCodeBase64)));
          } catch (e) {
            console.error('Failed to decode base64 code:', e);
            code = codeElement.textContent || '';
          }
        } else {
          code = codeElement.textContent || '';
        }
        
        // Если код пустой, пропускаем
        if (!code || code.trim().length === 0) {
          console.warn('[CodeBlock] Empty code, skipping');
          return;
        }
        
        // Если нет сохраненного кода, сохраняем текущий в base64
        if (!savedCodeBase64 && code) {
          try {
            const base64Code = btoa(unescape(encodeURIComponent(code)));
            pre.setAttribute('data-original-code', base64Code);
          } catch (e) {
            console.error('Failed to encode code to base64:', e);
          }
        }
        
        // Create unique key for this code block (without theme to avoid re-render on theme change)
        const blockKey = `${language}:${code.substring(0, 50)}`;
        const existingKey = pre.getAttribute('data-block-key');
        const isRendered = pre.getAttribute('data-rendered') === 'true';
        
        // Skip if already rendered with same content
        if (existingKey === blockKey && isRendered && currentRoots.has(pre)) {
          return;
        }
        
        pre.setAttribute('data-block-key', blockKey);
        pre.setAttribute('data-rendered', 'true');

        // Create or reuse React root
        let root = currentRoots.get(pre);
        if (!root) {
          root = createRoot(pre);
          currentRoots.set(pre, root);
        }

        // Render CodeBlock component directly into pre (replacing its content)
        root.render(
          <CodeBlock
            code={code}
            language={language}
            theme={theme === 'auto' ? 'dark' : theme}
            editable={true}
            onLanguageChange={(newLang) => {
              pre.setAttribute('data-language', newLang);
              pre.removeAttribute('data-block-key'); // Force re-render
              pre.removeAttribute('data-rendered'); // Reset rendered flag
              // Keep the original code in base64
              if (code) {
                try {
                  const base64Code = btoa(unescape(encodeURIComponent(code)));
                  pre.setAttribute('data-original-code', base64Code);
                } catch (e) {
                  console.error('Failed to encode code:', e);
                }
              }
              if (codeElement) {
                codeElement.className = `language-${newLang}`;
                codeElement.textContent = code; // Restore code
              }
              // Trigger re-render
              setTimeout(() => renderCodeBlocks(), 0);
            }}
          />
        );
      });

      // Cleanup removed code blocks - only if element is not in DOM
      const toDelete: Array<[Element, Root]> = [];
      currentRoots.forEach((root, element) => {
        if (!processedElements.has(element) && !document.contains(element)) {
          toDelete.push([element, root]);
        }
      });
      
      // Defer cleanup to avoid race condition
      if (toDelete.length > 0) {
        queueMicrotask(() => {
          toDelete.forEach(([element, root]) => {
            root.unmount();
            currentRoots.delete(element);
          });
        });
      }
    };

    // Initial render
    renderCodeBlocks();

    // Re-render on content changes (debounced)
    let timeoutId: number;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(renderCodeBlocks, 100);
    });

    observer.observe(editorRef.current, {
      childList: true,
      subtree: true
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      // Cleanup all roots on unmount - defer to avoid race condition
      queueMicrotask(() => {
        codeBlockRootsRef.current.forEach(root => root.unmount());
        codeBlockRootsRef.current.clear();
      });
    };
  }, [editorRef]); // Removed theme dependency

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            core.commands.exec('bold');
            break;
          case 'i':
            e.preventDefault();
            core.commands.exec('italic');
            break;
          case 'u':
            e.preventDefault();
            core.commands.exec('underline');
            break;
          case 'k':
            e.preventDefault();
            core.selection.save();
            setShowLinkModal(true);
            break;
          case 'f':
            e.preventDefault();
            setShowFindReplace(prev => !prev);
            break;
          case 's':
            e.preventDefault();
            core.saveNow();
            break;
        }
      }

      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }

      if (e.key === 'Escape') {
        setShowLinkModal(false);
        setShowImageModal(false);
        setShowVideoModal(false);
        setShowTableModal(false);
        setShowPrintModal(false);
        setShowFindReplace(false);
        if (isFullscreen) {
          toggleFullscreen();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [core, isFullscreen, toggleFullscreen]);

  // Drag & Drop
  useEffect(() => {
    if (allowImages && allowImageUpload) {
      core.enableDragDrop((dataUrl, fileName) => {
        core.commands.insertImage(dataUrl, fileName);
      });
    }
    return () => core.disableDragDrop();
  }, [core, allowImages, allowImageUpload]);

  // Modal handlers
  const handleLinkInsert = (url: string, text: string) => {
    core.selection.restore();
    core.commands.insertLink(url, text);
  };

  const handleImageInsert = (src: string, alt: string) => {
    core.selection.restore();
    core.commands.insertImage(src, alt);
  };

  const handleVideoInsert = (embedHtml: string) => {
    core.selection.restore();
    core.commands.insertHTML(embedHtml);
  };

  const handleTableInsert = (rows: number, cols: number) => {
    console.log('[WysiwygEditor] Inserting table:', { rows, cols });
    console.log('[WysiwygEditor] Has saved selection:', core.selection.hasSaved());
    
    // Focus editor first
    if (editorRef.current) {
      editorRef.current.focus();
    }
    
    // Restore selection
    core.selection.restore();
    
    // Insert table
    core.commands.insertTable(rows, cols);
    
    console.log('[WysiwygEditor] Table inserted');
  };

  const openLinkModal = () => {
    core.selection.save();
    setShowLinkModal(true);
  };

  const openImageModal = () => {
    core.selection.save();
    setShowImageModal(true);
  };

  const openVideoModal = () => {
    core.selection.save();
    setShowVideoModal(true);
  };

  const openTableModal = () => {
    console.log('[WysiwygEditor] Opening table modal, saving selection');
    core.selection.save();
    setShowTableModal(true);
  };

  return (
    <>
      <div
        className={`${styles.editorWrapper} ${isLight ? styles.light : ''} ${isFullscreen ? styles.fullscreen : ''} ${className}`}
        style={style}
      >
        <Toolbar
          core={core}
          theme={theme}
          onLinkClick={openLinkModal}
          onImageClick={openImageModal}
          onVideoClick={openVideoModal}
          onTableClick={openTableModal}
          onFindClick={() => setShowFindReplace(prev => !prev)}
          onFullscreenClick={toggleFullscreen}
          onPrintClick={() => setShowPrintModal(true)}
          isFullscreen={isFullscreen}
          allowImages={allowImages}
          allowVideoEmbeds={allowVideoEmbeds}
          allowTables={allowTables}
          enableFindReplace={enableFindReplace}
          enablePrint={enablePrint}
          enableFullscreen={enableFullscreen}
          isMobile={shouldOptimizeForMobile}
        />

        {enableFindReplace && (
          <FindReplace
            isOpen={showFindReplace}
            onClose={() => setShowFindReplace(false)}
            core={core}
            theme={theme}
          />
        )}

        <div
          ref={editorRef}
          className={`${styles.editorContent} ${isLight ? styles.light : ''} ${isFullscreen ? styles.fullscreen : ''}`}
          style={{ outline: 'none' }}
        />

        <StatusBar
          meta={stats}
          theme={theme}
          enableAutosave={enableAutosave}
          lastSaveTime={null}
        />
      </div>

      {enablePreviewPanel && (
        <PreviewPanel
          html={core.getHTML()}
          theme={theme}
          onExportHtml={() => core.export.downloadHTML()}
          onExportText={() => core.export.downloadText()}
          onCopyHtml={() => core.export.copyHTML()}
          enableSourceTab={enableSourceTab}
        />
      )}

      <LinkModal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onInsert={handleLinkInsert}
        theme={theme}
      />

      {allowImages && (
        <ImageModal
          isOpen={showImageModal}
          onClose={() => setShowImageModal(false)}
          onInsert={handleImageInsert}
          allowUpload={allowImageUpload}
          onUpload={onImageUpload}
        />
      )}

      {allowVideoEmbeds && (
        <VideoModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          onInsert={handleVideoInsert}
          onUpload={onVideoUpload}
          allowUpload={allowVideoUpload}
        />
      )}

      {allowTables && (
        <TableModal
          isOpen={showTableModal}
          onClose={() => setShowTableModal(false)}
          onInsert={handleTableInsert}
        />
      )}

      <PrintModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        html={core.getHTML()}
        theme={theme}
      />
    </>
  );
}
