import { useState, useEffect } from 'react';
import styles from '../WysiwygEditor.module.css';

interface TableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (rows: number, cols: number) => void;
}

export function TableModal({ isOpen, onClose, onInsert }: TableModalProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  useEffect(() => {
    if (!isOpen) {
      setRows(3);
      setCols(3);
    }
  }, [isOpen]);

  const handleInsert = () => {
    if (rows > 0 && cols > 0) {
      onInsert(rows, cols);
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
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>📊 Вставить таблицу</h3>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#9ca3af', fontSize: '14px' }}>Строк</label>
            <input
              type="number"
              className={styles.modalInput}
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              onKeyDown={handleKeyDown}
              min="1"
              max="20"
              autoFocus
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#9ca3af', fontSize: '14px' }}>Столбцов</label>
            <input
              type="number"
              className={styles.modalInput}
              value={cols}
              onChange={(e) => setCols(parseInt(e.target.value) || 1)}
              onKeyDown={handleKeyDown}
              min="1"
              max="10"
            />
          </div>
        </div>
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
