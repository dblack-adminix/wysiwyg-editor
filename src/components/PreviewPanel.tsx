import { useState, useEffect, useRef } from 'react';
import { Theme } from '../types';
import { highlightToHtml } from '../utils/codeHighlight';
import styles from '../WysiwygEditor.module.css';

interface PreviewPanelProps {
  html: string;
  theme: Theme;
  onExportHtml: () => void;
  onExportText: () => void;
  onCopyHtml: () => void;
  enableSourceTab?: boolean;
}

export function PreviewPanel({
  html,
  theme,
  onExportHtml,
  onExportText,
  onCopyHtml,
  enableSourceTab = true
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
          // Show feedback
          const originalContent = pre.style.getPropertyValue('--copy-feedback') || '📋';
          pre.style.setProperty('--copy-feedback', '✓');
          setTimeout(() => {
            pre.style.setProperty('--copy-feedback', originalContent);
          }, 2000);
        }
      }
    };

    previewRef.current.addEventListener('click', handleCodeCopy);
    return () => {
      previewRef.current?.removeEventListener('click', handleCodeCopy);
    };
  }, [activeTab]);

  return (
    <div className={`${styles.previewPanel} ${isLight ? styles.light : ''}`}>
      <div className={styles.previewHeader}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`${styles.tabBtn} ${activeTab === 'preview' ? styles.active : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <i className="fas fa-eye" style={{ marginRight: '8px' }}></i>
            Предпросмотр
          </button>
          {enableSourceTab && (
            <button
              className={`${styles.tabBtn} ${activeTab === 'source' ? styles.active : ''}`}
              onClick={() => setActiveTab('source')}
            >
              <i className="fas fa-code" style={{ marginRight: '8px' }}></i>
              HTML код
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={styles.toolbarBtn}
            onClick={onExportHtml}
            title="Экспорт HTML"
            style={{ color: 'white' }}
          >
            <i className="fas fa-file-code"></i>
          </button>
          <button
            className={styles.toolbarBtn}
            onClick={onExportText}
            title="Экспорт TXT"
            style={{ color: 'white' }}
          >
            <i className="fas fa-file-alt"></i>
          </button>
          <button
            className={styles.toolbarBtn}
            onClick={onCopyHtml}
            title="Копировать HTML"
            style={{ color: 'white' }}
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
      </div>
      
      {activeTab === 'preview' && (
        <div
          ref={previewRef}
          className={`${styles.previewContent} ${isLight ? styles.light : ''}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
      
      {activeTab === 'source' && (
        <pre className={`${styles.sourceCode} ${styles.show}`}>
          {html}
        </pre>
      )}
    </div>
  );
}
