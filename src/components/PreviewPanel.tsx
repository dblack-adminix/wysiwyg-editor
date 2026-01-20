import { useState, useEffect, useRef } from 'react';
import { Theme } from '../types';
import { highlightToHtml } from '../utils/codeHighlight';
import styles from '../WysiwygEditor.module.css';

interface PreviewPanelProps {
  html: string;
  theme?: Theme;
  onExportHtml?: () => void;
  onExportText?: () => void;
  onCopyHtml?: () => void;
  enableSourceTab?: boolean;
  // Headless mode - no built-in styles
  headless?: boolean;
  // Custom class names for styling
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  buttonClassName?: string;
}

export function PreviewPanel({
  html,
  theme = 'dark',
  onExportHtml,
  onExportText,
  onCopyHtml,
  enableSourceTab = true,
  headless = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
  tabClassName = '',
  activeTabClassName = '',
  buttonClassName = '',
}: PreviewPanelProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'source'>('preview');
  const previewRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  // Highlight code blocks in preview
  useEffect(() => {
    if (!previewRef.current || activeTab !== 'preview') return;

    const highlightCodeBlocks = async () => {
      const codeBlocks = previewRef.current?.querySelectorAll('pre.code-block');
      if (!codeBlocks) return;

      for (const pre of Array.from(codeBlocks)) {
        const codeElement = pre.querySelector('code');
        if (!codeElement) continue;

        const language = pre.getAttribute('data-language') || 'plain-text';
        const code = codeElement.textContent || '';
        
        try {
          const highlightedHtml = await highlightToHtml(code, language, theme === 'auto' ? 'dark' : theme);
          
          // Replace pre content with highlighted HTML
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = highlightedHtml;
          const newPre = tempDiv.querySelector('pre');
          
          if (newPre) {
            // Copy only safe attributes
            const language = pre.getAttribute('data-language');
            const displayName = pre.getAttribute('data-display-name');
            
            if (language) newPre.setAttribute('data-language', language);
            if (displayName) newPre.setAttribute('data-display-name', displayName);
            newPre.className = 'code-block';
            
            // Replace
            pre.replaceWith(newPre);
          }
        } catch (err) {
          console.error('Preview highlighting failed:', err);
        }
      }
    };

    highlightCodeBlocks();
  }, [html, theme, activeTab]);

  // Add copy functionality to code blocks
  useEffect(() => {
    if (!previewRef.current) return;

    const handleCodeCopy = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const pre = target.closest('pre');
      
      if (pre && target === pre) {
        const code = pre.querySelector('code');
        if (code) {
          navigator.clipboard.writeText(code.textContent || '');
        }
      }
    };

    previewRef.current.addEventListener('click', handleCodeCopy);
    return () => {
      previewRef.current?.removeEventListener('click', handleCodeCopy);
    };
  }, [activeTab]);

  // Headless mode - minimal markup, no styles
  if (headless) {
    return (
      <div className={className} data-preview-panel>
        {(onExportHtml || onExportText || onCopyHtml || enableSourceTab) && (
          <div className={headerClassName} data-preview-header>
            <div data-preview-tabs>
              <button
                className={`${tabClassName} ${activeTab === 'preview' ? activeTabClassName : ''}`}
                onClick={() => setActiveTab('preview')}
                data-tab="preview"
                data-active={activeTab === 'preview'}
              >
                Предпросмотр
              </button>
              {enableSourceTab && (
                <button
                  className={`${tabClassName} ${activeTab === 'source' ? activeTabClassName : ''}`}
                  onClick={() => setActiveTab('source')}
                  data-tab="source"
                  data-active={activeTab === 'source'}
                >
                  HTML код
                </button>
              )}
            </div>
            <div data-preview-actions>
              {onExportHtml && (
                <button className={buttonClassName} onClick={onExportHtml} data-action="export-html">
                  Экспорт HTML
                </button>
              )}
              {onExportText && (
                <button className={buttonClassName} onClick={onExportText} data-action="export-text">
                  Экспорт TXT
                </button>
              )}
              {onCopyHtml && (
                <button className={buttonClassName} onClick={onCopyHtml} data-action="copy-html">
                  Копировать
                </button>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'preview' && (
          <div
            ref={previewRef}
            className={contentClassName}
            dangerouslySetInnerHTML={{ __html: html }}
            data-preview-content
          />
        )}
        
        {activeTab === 'source' && (
          <pre className={contentClassName} data-preview-source>
            {html}
          </pre>
        )}
      </div>
    );
  }

  // Default styled mode (backward compatible)
  return (
    <div className={`${styles.previewPanel} ${isLight ? styles.light : ''} ${className}`}>
      <div className={`${styles.previewHeader} ${headerClassName}`}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'preview' ? styles.active : ''} ${tabClassName}`}
            onClick={() => setActiveTab('preview')}
          >
            <i className="fas fa-eye" style={{ marginRight: '8px' }}></i>
            Предпросмотр
          </button>
          {enableSourceTab && (
            <button
              className={`${styles.tabBtn} ${activeTab === 'source' ? styles.active : ''} ${tabClassName}`}
              onClick={() => setActiveTab('source')}
            >
              <i className="fas fa-code" style={{ marginRight: '8px' }}></i>
              HTML код
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onExportHtml && (
            <button
              className={`${styles.toolbarBtn} ${buttonClassName}`}
              onClick={onExportHtml}
              title="Экспорт HTML"
              style={{ color: 'white' }}
            >
              <i className="fas fa-file-code"></i>
            </button>
          )}
          {onExportText && (
            <button
              className={`${styles.toolbarBtn} ${buttonClassName}`}
              onClick={onExportText}
              title="Экспорт TXT"
              style={{ color: 'white' }}
            >
              <i className="fas fa-file-alt"></i>
            </button>
          )}
          {onCopyHtml && (
            <button
              className={`${styles.toolbarBtn} ${buttonClassName}`}
              onClick={onCopyHtml}
              title="Копировать HTML"
              style={{ color: 'white' }}
            >
              <i className="fas fa-copy"></i>
            </button>
          )}
        </div>
      </div>
      
      {activeTab === 'preview' && (
        <div
          ref={previewRef}
          className={`${styles.previewContent} ${isLight ? styles.light : ''} ${contentClassName}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      
      {activeTab === 'source' && (
        <pre className={`${styles.sourceCode} ${styles.show} ${contentClassName}`}>
          {html}
        </pre>
      )}
    </div>
  );
}
