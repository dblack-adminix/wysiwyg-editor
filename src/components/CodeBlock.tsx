/**
 * CodeBlock.tsx - Code block renderer with Shiki highlighting and UI controls
 */

import { useState, useEffect, useRef } from 'react';
import { highlightToHtml, getSupportedLanguages, normalizeLang } from '../utils/codeHighlight';
import { getLanguageDisplayName } from '../utils/detectLanguage';
import styles from './CodeBlock.module.css';

interface CodeBlockProps {
  code: string;
  language: string;
  theme: 'light' | 'dark';
  onLanguageChange?: (newLang: string) => void;
  editable?: boolean;
}

export function CodeBlock({ 
  code, 
  language, 
  theme, 
  onLanguageChange,
  editable = false 
}: CodeBlockProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [wrapLines, setWrapLines] = useState(true); // По умолчанию включен перенос
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langBadgeRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // Highlight code when it changes
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    console.log('[CodeBlock] Starting highlight:', { language, theme, codeLength: code.length });

    // Add timeout fallback
    const timeoutId = setTimeout(() => {
      if (!cancelled) {
        console.warn('[CodeBlock] Highlighting timeout, using fallback');
        setHighlightedHtml(`<pre style="background: #1e1e1e; color: #d4d4d4; padding: 1em; border-radius: 4px; overflow-x: auto;"><code>${escapeHtml(code)}</code></pre>`);
        setIsLoading(false);
      }
    }, 5000);

    highlightToHtml(code, language, theme)
      .then(html => {
        clearTimeout(timeoutId);
        if (!cancelled) {
          console.log('[CodeBlock] Highlight success, html length:', html.length);
          setHighlightedHtml(html);
          setIsLoading(false);
        }
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.error('[CodeBlock] Highlighting failed:', err);
        if (!cancelled) {
          setHighlightedHtml(`<pre style="background: #1e1e1e; color: #d4d4d4; padding: 1em; border-radius: 4px; overflow-x: auto;"><code>${escapeHtml(code)}</code></pre>`);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [code, language, theme]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          langBadgeRef.current && !langBadgeRef.current.contains(e.target as Node)) {
        setShowLangDropdown(false);
      }
    };

    if (showLangDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showLangDropdown]);

  // Position dropdown relative to button
  useEffect(() => {
    if (showLangDropdown && langBadgeRef.current) {
      const rect = langBadgeRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 200 // Align right edge
      });
    }
  }, [showLangDropdown]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleLanguageSelect = (newLang: string) => {
    setShowLangDropdown(false);
    onLanguageChange?.(newLang);
  };

  const displayName = getLanguageDisplayName(language);
  const supportedLangs = getSupportedLanguages();

  return (
    <div className={`${styles.codeBlockWrapper} ${theme === 'light' ? styles.light : styles.dark}`}>
      {/* Controls bar */}
      <div className={styles.controls}>
        {/* Language badge/selector */}
        <div className={styles.languageSelector}>
          <button
            ref={langBadgeRef}
            className={styles.langBadge}
            onClick={() => editable && setShowLangDropdown(!showLangDropdown)}
            disabled={!editable}
            title={editable ? 'Change language' : displayName}
          >
            {displayName}
            {editable && <span className={styles.chevron}>▼</span>}
          </button>

          {showLangDropdown && editable && (
            <div 
              ref={dropdownRef}
              className={styles.langDropdown}
              style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
            >
              <div className={styles.langDropdownScroll}>
                {supportedLangs.map(lang => (
                  <button
                    key={lang}
                    className={`${styles.langOption} ${normalizeLang(lang) === normalizeLang(language) ? styles.active : ''}`}
                    onClick={() => handleLanguageSelect(lang)}
                  >
                    {getLanguageDisplayName(lang)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => setWrapLines(!wrapLines)}
            title={wrapLines ? 'Disable line wrap' : 'Enable line wrap'}
          >
            {wrapLines ? '↔' : '⤸'}
          </button>

          <button
            className={styles.actionBtn}
            onClick={handleCopy}
            title="Copy code"
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
      </div>

      {/* Code content */}
      <div 
        className={`${styles.codeContent} ${wrapLines ? styles.wrap : ''}`}
      >
        {isLoading ? (
          <pre style={{ background: '#1e1e1e', color: '#888', padding: '1em', margin: 0, border: 'none' }}>
            <code>Initializing highlighter...</code>
          </pre>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        )}
      </div>
    </div>
  );
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
