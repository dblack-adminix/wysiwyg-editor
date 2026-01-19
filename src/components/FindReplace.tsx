import { useState, useEffect } from 'react';
import { EditorCore } from '../core/EditorCore';
import { Theme } from '../types';
import styles from '../WysiwygEditor.module.css';

interface FindReplaceProps {
  isOpen: boolean;
  onClose: () => void;
  core: EditorCore;
  theme?: Theme;
}

export function FindReplace({ isOpen, onClose, core, theme = 'dark' }: FindReplaceProps) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const isLight = theme === 'light';

  // Автоматически заполнять поле поиска выделенным текстом
  useEffect(() => {
    if (isOpen) {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();
      if (selectedText) {
        setFindText(selectedText);
      }
    } else {
      setFindText('');
      setReplaceText('');
    }
  }, [isOpen]);

  const handleFindNext = () => {
    if (findText) {
      core.commands.find(findText);
    }
  };

  const handleReplace = () => {
    if (findText) {
      core.commands.replace(findText, replaceText);
    }
  };

  const handleReplaceAll = () => {
    if (findText) {
      core.commands.replaceAll(findText, replaceText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFindNext();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.findReplace} ${isOpen ? styles.show : ''} ${isLight ? styles.light : ''}`}>
      <input
        type="text"
        className={`${styles.findInput} ${isLight ? styles.light : ''}`}
        placeholder="Найти..."
        value={findText}
        onChange={(e) => setFindText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        type="text"
        className={`${styles.findInput} ${isLight ? styles.light : ''}`}
        placeholder="Заменить на..."
        value={replaceText}
        onChange={(e) => setReplaceText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`} onClick={handleFindNext} title="Найти следующее">
        <i className="fas fa-chevron-down"></i>
      </button>
      <button className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`} onClick={handleReplace}>
        Заменить
      </button>
      <button className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`} onClick={handleReplaceAll}>
        Заменить все
      </button>
      <button className={`${styles.toolbarBtn} ${isLight ? styles.light : ''}`} onClick={onClose} title="Закрыть">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}
