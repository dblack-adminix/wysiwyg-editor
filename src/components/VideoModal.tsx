import { useState, useEffect } from 'react';
import styles from '../WysiwygEditor.module.css';
import { parseVideoUrl, createVideoEmbed } from '../utils/videoParser';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (embedHtml: string) => void;
  onUpload?: (file: File) => Promise<string>; // Callback для загрузки на сервер
  allowUpload?: boolean;
}

export function VideoModal({ 
  isOpen, 
  onClose, 
  onInsert,
  onUpload,
  allowUpload = false 
}: VideoModalProps) {
  const [url, setUrl] = useState('');
  const [uploadMode, setUploadMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setUrl('');
      setUploadMode(false);
      setUploading(false);
      setUploadProgress(0);
    }
  }, [isOpen]);

  const handleInsert = () => {
    if (url) {
      const parsed = parseVideoUrl(url);
      if (parsed) {
        const embedHtml = createVideoEmbed(parsed.embedUrl);
        onInsert(embedHtml);
        onClose();
      } else {
        // Если не YouTube/Vimeo, вставляем как прямую ссылку на видео
        const videoHtml = `
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1em 0;">
            <video controls style="position:absolute;top:0;left:0;width:100%;height:100%;">
              <source src="${url}" type="video/mp4">
              Ваш браузер не поддерживает видео.
            </video>
          </div>
        `;
        onInsert(videoHtml);
        onClose();
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('video/')) {
      alert('Пожалуйста, выберите видео файл');
      return;
    }

    // Проверка размера (макс 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('Файл слишком большой. Максимальный размер: 100MB');
      return;
    }

    if (!onUpload) {
      alert('Загрузка видео не настроена. Пожалуйста, настройте onUpload callback.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Симуляция прогресса (в реальности прогресс должен приходить от XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Вызываем callback для загрузки
      const videoUrl = await onUpload(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Вставляем видео
      const videoHtml = `
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:1em 0;">
          <video controls style="position:absolute;top:0;left:0;width:100%;height:100%;">
            <source src="${videoUrl}" type="${file.type}">
            Ваш браузер не поддерживает видео.
          </video>
        </div>
      `;
      onInsert(videoHtml);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Ошибка загрузки видео: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !uploading) {
      handleInsert();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.show : ''}`} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>🎥 Вставить видео</h3>
        
        {allowUpload && (
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
            <button
              className={`${styles.modalBtn} ${!uploadMode ? styles.modalBtnPrimary : styles.modalBtnSecondary}`}
              onClick={() => setUploadMode(false)}
              style={{ flex: 1 }}
            >
              URL
            </button>
            <button
              className={`${styles.modalBtn} ${uploadMode ? styles.modalBtnPrimary : styles.modalBtnSecondary}`}
              onClick={() => setUploadMode(true)}
              style={{ flex: 1 }}
            >
              Загрузить файл
            </button>
          </div>
        )}

        {!uploadMode ? (
          <>
            <input
              type="text"
              className={styles.modalInput}
              placeholder="URL видео (YouTube, Vimeo или прямая ссылка)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
              Поддерживаются: YouTube, Vimeo, прямые ссылки на .mp4
            </p>
          </>
        ) : (
          <>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '8px',
                border: '2px dashed #6366f1',
                borderRadius: '8px',
                cursor: uploading ? 'not-allowed' : 'pointer'
              }}
            />
            {uploading && (
              <div style={{ marginTop: '12px' }}>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#2d2d3f',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: '#6366f1',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <p style={{ fontSize: '12px', color: '#888', marginTop: '8px', textAlign: 'center' }}>
                  Загрузка... {uploadProgress}%
                </p>
              </div>
            )}
            <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
              Максимальный размер: 100MB. Форматы: MP4, WebM, OGG
            </p>
          </>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button 
            className={`${styles.modalBtn} ${styles.modalBtnSecondary}`} 
            onClick={onClose}
            disabled={uploading}
          >
            Отмена
          </button>
          {!uploadMode && (
            <button 
              className={`${styles.modalBtn} ${styles.modalBtnPrimary}`} 
              onClick={handleInsert}
              disabled={uploading}
            >
              Вставить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
