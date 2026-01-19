import { useState, useEffect } from 'react';
import { Theme } from '../types';
import styles from '../WysiwygEditor.module.css';

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, text: string) => void;
  theme?: Theme;
}

export function LinkModal({ isOpen, onClose, onInsert, theme = 'dark' }: LinkModalProps) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [hasSelection, setHasSelection] = useState(false);
  const isLight = theme === 'light';

  // Автоматически заполнять поле текста выделенным текстом
  useEffect(() => {
    if (isOpen) {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();
      if (selectedText) {
        setText(selectedText);
        setHasSelection(true);
      } else {
        setHasSelection(false);
      }
    } else {
      setUrl('');
      setText('');
      setHasSelection(false);
    }
  }, [isOpen]);

  const handleInsert = () => {
    if (url) {
      onInsert(url, text || url);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInsert();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.show : ''}`} onClick={onClose}>
      <div className={`${styles.modal} ${isLight ? styles.light : ''}`} onClick={(e) => e.stopPropagation()}>
        <h3>🔗 Вставить ссылку</h3>
        
        <input
          type="text"
          className={`${styles.modalInput} ${isLight ? styles.light : ''}`}
          placeholder="URL (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        
        {!hasSelection && (
          <input
            type="text"
            className={`${styles.modalInput} ${isLight ? styles.light : ''}`}
            placeholder="Текст ссылки (необязательно)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button className={`${styles.modalBtn} ${styles.modalBtnSecondary}`} onClick={onClose}>
            Отмена
          </button>
          <button className={`${styles.modalBtn} ${styles.modalBtnPrimary}`} onClick={handleInsert}>
            Вставить
          </button>
        </div>
      </div>
    </div>
  );
}
