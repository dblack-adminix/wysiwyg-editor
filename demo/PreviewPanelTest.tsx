import { useState } from 'react';
import { WysiwygEditor, PreviewPanel } from '../src';
import '../src/WysiwygEditor.module.css';

/**
 * Тест независимости панели предпросмотра
 * 
 * Этот компонент демонстрирует, что PreviewPanel теперь полностью независима:
 * 1. Может использоваться отдельно от редактора
 * 2. Может быть размещена в любом месте
 * 3. Может иметь собственный стиль и тему
 * 4. Может работать с контентом из разных источников
 */

export function PreviewPanelTest() {
  const [editorContent, setEditorContent] = useState('<p>Введите текст в редактор...</p>');
  const [externalContent, setExternalContent] = useState('<h2>Внешний контент</h2><p>Это контент из другого источника</p>');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Тест независимости панели предпросмотра</h1>

      {/* ТЕСТ 1: Редактор БЕЗ панели предпросмотра */}
      <section style={{ marginBottom: '40px', border: '2px solid #007bff', padding: '20px', borderRadius: '8px' }}>
        <h2>✅ Тест 1: Редактор БЕЗ встроенной панели</h2>
        <p>Панель предпросмотра отключена (enablePreviewPanel=false)</p>
        
        <WysiwygEditor
          value={editorContent}
          onChange={(html) => setEditorContent(html)}
          enablePreviewPanel={false}
          themeName="light"
          placeholder="Редактируйте текст здесь..."
          style={{ minHeight: '300px', marginBottom: '20px' }}
        />
        
        <p style={{ color: '#666', fontSize: '12px' }}>
          ✓ Редактор работает БЕЗ панели предпросмотра
        </p>
      </section>

      {/* ТЕСТ 2: Редактор с панелью справа */}
      <section style={{ marginBottom: '40px', border: '2px solid #28a745', padding: '20px', borderRadius: '8px' }}>
        <h2>✅ Тест 2: Редактор с панелью СПРАВА</h2>
        <p>Панель предпросмотра позиционирована справа (previewPosition="right")</p>
        
        <WysiwygEditor
          value={editorContent}
          onChange={(html) => setEditorContent(html)}
          enablePreviewPanel={true}
          previewPosition="right"
          previewWidth={400}
          themeName="light"
          placeholder="Редактируйте текст здесь..."
        />
        
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
          ✓ Панель предпросмотра справа от редактора
        </p>
      </section>

      {/* ТЕСТ 3: Редактор с панелью снизу */}
      <section style={{ marginBottom: '40px', border: '2px solid #ffc107', padding: '20px', borderRadius: '8px' }}>
        <h2>✅ Тест 3: Редактор с панелью СНИЗУ</h2>
        <p>Панель предпросмотра позиционирована снизу (previewPosition="bottom")</p>
        
        <WysiwygEditor
          value={editorContent}
          onChange={(html) => setEditorContent(html)}
          enablePreviewPanel={true}
          previewPosition="bottom"
          previewHeight={300}
          themeName="light"
          placeholder="Редактируйте текст здесь..."
        />
        
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
          ✓ Панель предпросмотра снизу от редактора
        </p>
      </section>

      {/* ТЕСТ 4: Отдельная панель предпросмотра */}
      <section style={{ marginBottom: '40px', border: '2px solid #dc3545', padding: '20px', borderRadius: '8px' }}>
        <h2>✅ Тест 4: ОТДЕЛЬНАЯ панель предпросмотра</h2>
        <p>PreviewPanel используется как независимый компонент</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3>Редактор (без панели)</h3>
            <WysiwygEditor
              value={editorContent}
              onChange={(html) => setEditorContent(html)}
              enablePreviewPanel={false}
              themeName="light"
              placeholder="Редактируйте текст..."
              style={{ minHeight: '400px' }}
            />
          </div>
          
          <div>
            <h3>Отдельная панель предпросмотра</h3>
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
              minHeight: '400px',
            }}>
              <PreviewPanel
                html={editorContent}
                theme="light"
                onExportHtml={() => console.log('Export HTML:', editorContent)}
                onExportText={() => console.log('Export Text')}
                onCopyHtml={() => {
                  navigator.clipboard.writeText(editorContent);
                  alert('HTML скопирован в буфер обмена!');
                }}
                enableSourceTab={true}
              />
            </div>
          </div>
        </div>
        
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
          ✓ Редактор и панель предпросмотра полностью независимы
          <br/>✓ Панель может быть размещена в любом месте
          <br/>✓ Панель может отображать контент из разных источников
        </p>
      </section>

      {/* ТЕСТ 5: Несколько панелей с разным контентом */}
      <section style={{ marginBottom: '40px', border: '2px solid #17a2b8', padding: '20px', borderRadius: '8px' }}>
        <h2>✅ Тест 5: НЕСКОЛЬКО независимых панелей</h2>
        <p>Несколько PreviewPanel компонентов с разным контентом</p>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Редактор</h3>
          <WysiwygEditor
            value={externalContent}
            onChange={(html) => setExternalContent(html)}
            enablePreviewPanel={false}
            themeName="light"
            placeholder="Редактируйте контент..."
            style={{ minHeight: '250px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3>Панель 1: Светлая тема</h3>
            <div style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
              minHeight: '300px',
            }}>
              <PreviewPanel
                html={externalContent}
                theme="light"
                onExportHtml={() => {}}
                onExportText={() => {}}
                onCopyHtml={() => {}}
                enableSourceTab={false}
              />
            </div>
          </div>

          <div>
            <h3>Панель 2: Темная тема</h3>
            <div style={{
              border: '1px solid #444',
              borderRadius: '8px',
              overflow: 'hidden',
              backgroundColor: '#1e1e2e',
              minHeight: '300px',
            }}>
              <PreviewPanel
                html={externalContent}
                theme="dark"
                onExportHtml={() => {}}
                onExportText={() => {}}
                onCopyHtml={() => {}}
                enableSourceTab={false}
              />
            </div>
          </div>
        </div>
        
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
          ✓ Несколько панелей могут отображать один контент
          <br/>✓ Каждая панель может иметь свою тему
          <br/>✓ Панели полностью независимы друг от друга
        </p>
      </section>

      {/* ТЕСТ 6: Панель с пользовательским стилем */}
      <section style={{ marginBottom: '40px', border: '2px solid #6f42c1', padding: '20px', borderRadius: '8px' }}>
        <h2>✅ Тест 6: Панель с ПОЛЬЗОВАТЕЛЬСКИМ стилем</h2>
        <p>PreviewPanel может быть стилизована независимо</p>
        
        <div style={{
          border: '3px solid #6f42c1',
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: '#f8f9fa',
          minHeight: '300px',
          boxShadow: '0 4px 12px rgba(111, 66, 193, 0.2)',
        }}>
          <PreviewPanel
            html={editorContent}
            theme="light"
            onExportHtml={() => console.log('Export')}
            onExportText={() => {}}
            onCopyHtml={() => {}}
            enableSourceTab={true}
          />
        </div>
        
        <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
          ✓ Панель может быть обернута в пользовательский контейнер
          <br/>✓ Может иметь собственные стили и оформление
          <br/>✓ Полностью независима от редактора
        </p>
      </section>

      {/* ИТОГИ */}
      <section style={{ 
        marginBottom: '40px', 
        border: '3px solid #20c997', 
        padding: '20px', 
        borderRadius: '8px',
        backgroundColor: '#f0fdf4'
      }}>
        <h2>📊 Итоги тестирования</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3>✅ Что работает:</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>✓ Редактор без панели предпросмотра</li>
              <li>✓ Панель справа от редактора</li>
              <li>✓ Панель снизу от редактора</li>
              <li>✓ Отдельная независимая панель</li>
              <li>✓ Несколько панелей одновременно</li>
              <li>✓ Разные темы для разных панелей</li>
              <li>✓ Пользовательское оформление</li>
            </ul>
          </div>

          <div>
            <h3>🎯 Преимущества:</h3>
            <ul style={{ lineHeight: '1.8' }}>
              <li>✓ Полная гибкость в размещении</li>
              <li>✓ Независимость от редактора</li>
              <li>✓ Возможность использования в разных контекстах</li>
              <li>✓ Поддержка разных тем</li>
              <li>✓ Легкая интеграция в любой проект</li>
              <li>✓ Полный контроль над стилем</li>
              <li>✓ Масштабируемость</li>
            </ul>
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#fff', 
          borderRadius: '6px',
          border: '1px solid #20c997'
        }}>
          <strong>Вывод:</strong> Панель предпросмотра теперь полностью независима от редактора и может использоваться в любых сценариях!
        </div>
      </section>
    </div>
  );
}
