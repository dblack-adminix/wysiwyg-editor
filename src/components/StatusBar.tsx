import { EditorMeta, Theme } from '../types';
import styles from '../WysiwygEditor.module.css';

interface StatusBarProps {
  meta: EditorMeta;
  theme: Theme;
  enableAutosave?: boolean;
  lastSaveTime?: Date | null;
}

export function StatusBar({ meta, theme, enableAutosave, lastSaveTime }: StatusBarProps) {
  const isLight = theme === 'light';
  
  const formatSaveTime = (date: Date | null | undefined) => {
    if (!date) return 'Автосохранение включено';
    return `Сохранено ${date.toLocaleTimeString()}`;
  };

  return (
    <div className={`${styles.statusBar} ${isLight ? styles.light : ''}`}>
      {enableAutosave && (
        <div className={styles.autosaveIndicator}>
          <div className={styles.autosaveDot}></div>
          <span>{formatSaveTime(lastSaveTime)}</span>
        </div>
      )}
      {!enableAutosave && <div></div>}
      <div className={styles.statsGroup}>
        <div className={styles.statItem}>
          <span>Слов:</span>
          <strong>{meta.wordCount}</strong>
        </div>
        <div className={styles.statItem}>
          <span>Символов:</span>
          <strong>{meta.charCount}</strong>
        </div>
        <div className={styles.statItem}>
          <span>Параграфов:</span>
          <strong>{meta.paragraphCount}</strong>
        </div>
      </div>
    </div>
  );
}
