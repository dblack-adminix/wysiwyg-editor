import { useState } from 'react';
import { WysiwygEditor, EditorMeta, DEFAULT_CONTENT } from '../src';
import { PreviewPanelTest } from './PreviewPanelTest';

function App() {
  const [html, setHtml] = useState('');
  const [meta, setMeta] = useState<EditorMeta>({ wordCount: 0, charCount: 0, paragraphCount: 0 });
  const [showTest, setShowTest] = useState(false);

  const handleChange = (newHtml: string, newMeta: EditorMeta) => {
    setHtml(newHtml);
    setMeta(newMeta);
    console.log('Content changed:', { html: newHtml, meta: newMeta });
  };

  // Пример функции загрузки изображения
  const handleImageUpload = async (file: File): Promise<string> => {
    console.log('Uploading image:', file.name);
    
    // Для демо используем FileReader для создания data URL
    // В продакшене загружайте на сервер!
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Пример функции загрузки видео
  const handleVideoUpload = async (file: File): Promise<string> => {
    console.log('Uploading video:', file.name, file.size, 'bytes');
    
    // ВАЖНО: Это демо версия с data URL
    // В продакшене используйте загрузку на сервер!
    // См. VIDEO_UPLOAD_EXAMPLE.md для примеров
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('Video uploaded successfully');
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    /* Пример для продакшена:
    const formData = new FormData();
    formData.append('video', file);
    
    const response = await fetch('/api/upload/video', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.url;
    */
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d3f 100%)',
      padding: '32px'
    }}>
      {showTest ? (
        <div>
          <button
            onClick={() => setShowTest(false)}
            style={{
              padding: '10px 20px',
              marginBottom: '20px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            ← Вернуться к примерам
          </button>
          <PreviewPanelTest />
        </div>
      ) : (
        <>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ 
                fontSize: '48px', 
                fontWeight: 'bold', 
                color: 'white',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <span>✨</span>
                Pro WYSIWYG Editor
              </h1>
              <p style={{ fontSize: '18px', color: '#9ca3af' }}>
                Профессиональный редактор с полным набором функций
              </p>
            </header>

        {/* Controlled Example */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>Controlled Mode (с загрузкой видео)</h2>
          <WysiwygEditor
            value={html}
            onChange={handleChange}
            placeholder="Начните печатать..."
            theme="dark"
            enablePreviewPanel={true}
            enableSourceTab={true}
            enableFindReplace={true}
            allowImages={true}
            allowImageUpload={true}
            onImageUpload={handleImageUpload}
            allowVideoEmbeds={true}
            allowVideoUpload={true}
            onVideoUpload={handleVideoUpload}
            allowTables={true}
          />
          <div style={{ 
            marginTop: '12px', 
            padding: '12px', 
            background: 'rgba(99, 102, 241, 0.1)',
            borderRadius: '8px',
            color: '#a0a0b0',
            fontSize: '13px'
          }}>
            💡 <strong>Совет:</strong> Нажмите на кнопку видео, выберите "Загрузить файл" и выберите видео с вашего компьютера.
            <br />
            ⚠️ <strong>Примечание:</strong> В демо используется data URL. Для продакшена настройте загрузку на сервер (см. VIDEO_UPLOAD_EXAMPLE.md)
          </div>
        </div>

        {/* Uncontrolled with Autosave */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>Uncontrolled Mode with Autosave</h2>
          <WysiwygEditor
            defaultValue={DEFAULT_CONTENT}
            enableAutosave={true}
            autosaveKey="demo-editor"
            autosaveIntervalMs={3000}
            theme="light"
            placeholder="Ваш контент автоматически сохраняется..."
          />
        </div>

        {/* Minimal Configuration */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ color: 'white', marginBottom: '16px' }}>Minimal Configuration</h2>
          <WysiwygEditor
            placeholder="Минимальная конфигурация..."
            enablePreviewPanel={false}
            enableFindReplace={false}
            enablePrint={false}
            enableFullscreen={false}
            allowVideoEmbeds={false}
            allowTables={false}
            theme="dark"
          />
        </div>

        {/* Current State Display */}
        <div style={{
          background: '#2d2d3f',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '32px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>Current Editor State (Controlled)</h3>
          <div style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '14px' }}>
            <div>Words: {meta.wordCount}</div>
            <div>Characters: {meta.charCount}</div>
            <div>Paragraphs: {meta.paragraphCount}</div>
            <div style={{ marginTop: '16px' }}>
              <strong>HTML Preview:</strong>
              <pre style={{ 
                background: '#1e1e2e', 
                padding: '12px', 
                borderRadius: '8px',
                marginTop: '8px',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {html || '(empty)'}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Test Button */}
      <div style={{ maxWidth: '1200px', margin: '32px auto 0' }}>
        <button
          onClick={() => setShowTest(true)}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#20c997',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '32px'
          }}
        >
          🧪 Тест независимости панели предпросмотра
        </button>
      </div>
    </div>
      )}
    </div>
  );
}

export default App;
