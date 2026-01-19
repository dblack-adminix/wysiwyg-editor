import { useState, useEffect, useRef } from 'react';
import styles from '../WysiwygEditor.module.css';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (src: string, alt: string) => void;
  allowUpload?: boolean;
  onUpload?: (file: File) => Promise<string>;
}

export function ImageModal({ isOpen, onClose, onInsert, allowUpload = true, onUpload }: ImageModalProps) {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setUrl('');
      setAlt('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  const handleInsert = async () => {
    const file = fileInputRef.current?.files?.[0];
    
    if (file) {
      // Если предоставлен кастомный обработчик загрузки
      if (onUpload) {
        try {
          const uploadedUrl = await onUpload(file);
          onInsert(uploadedUrl, alt || 'Image');
          onClose();
        } catch (error) {
          console.error('Image upload failed:', error);
          alert('Ошибка загрузки изображения');
        }
      } else {
        // Иначе используем data URL (по умолчанию)
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onInsert(result, alt || 'Image');
          onClose();
        };
        reader.readAsDataURL(file);
      }
    } else if (url) {
      onInsert(url, alt || 'Image');
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
        <h3>🖼️ Вставить изображение</h3>
        <input
          type="text"
          className={styles.modalInput}
          placeholder="URL изображения"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <input
          type="text"
          className={styles.modalInput}
          placeholder="Альтернативный текст"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {allowUpload && (
          <>
            <div style={{ textAlign: 'center', margin: '16px 0', color: '#6b7280' }}>
              — или —
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.modalInput}
            />
          </>
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
