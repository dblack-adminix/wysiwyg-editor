import { useState } from 'react';
import { useWysiwygEditor, EditorCore } from '../src';

/**
 * DEMO 1: Headless с кастомным тулбаром
 */
function CustomToolbarDemo() {
  const { editorRef, core, stats } = useWysiwygEditor({
    placeholder: 'Кастомный редактор...',
    onChange: (html, stats) => console.log('Changed:', { html, stats })
  });

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ color: 'white', marginBottom: '16px' }}>
        1. Headless с кастомным тулбаром
      </h2>
      
      {/* Кастомный тулбар */}
      <div style={{
        background: '#2d2d3f',
        padding: '12px',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => core.commands.exec('bold')}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer' }}
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => core.commands.exec('italic')}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer' }}
        >
          <em>I</em>
        </button>
        <button
          onClick={() => core.commands.exec('underline')}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer' }}
        >
          <u>U</u>
        </button>
        <button
          onClick={() => core.commands.setFormatBlock('h1')}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#8b5cf6', color: 'white', cursor: 'pointer' }}
        >
          H1
        </button>
        <button
          onClick={() => core.commands.setFormatBlock('h2')}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#8b5cf6', color: 'white', cursor: 'pointer' }}
        >
          H2
        </button>
        <button
          onClick={() => core.commands.insertTable(3, 3)}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer' }}
        >
          Table 3x3
        </button>
        <button
          onClick={() => core.export.downloadHTML()}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#f59e0b', color: 'white', cursor: 'pointer' }}
        >
          Export HTML
        </button>
        <button
          onClick={() => core.export.print()}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer' }}
        >
          Print
        </button>
      </div>

      {/* Редактор */}
      <div
        ref={editorRef}
        style={{
          minHeight: '200px',
          padding: '16px',
          background: 'white',
          color: '#1e293b',
          borderRadius: '0 0 8px 8px',
          outline: 'none'
        }}
      />

      {/* Статистика */}
      <div style={{
        marginTop: '8px',
        padding: '8px 16px',
        background: '#2d2d3f',
        borderRadius: '8px',
        color: '#9ca3af',
        fontSize: '14px',
        display: 'flex',
        gap: '24px'
      }}>
        <span>Words: <strong style={{ color: 'white' }}>{stats.wordCount}</strong></span>
        <span>Chars: <strong style={{ color: 'white' }}>{stats.charCount}</strong></span>
        <span>Paras: <strong style={{ color: 'white' }}>{stats.paragraphCount}</strong></span>
      </div>
    </div>
  );
}

/**
 * DEMO 2: Программное управление
 */
function ProgrammaticDemo() {
  const { editorRef, core } = useWysiwygEditor({
    placeholder: 'Программное управление...'
  });

  const insertTemplate = () => {
    core.setHTML(`
      <h1>📄 Шаблон документа</h1>
      <p><strong>Дата:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
      <h2>Введение</h2>
      <p>Здесь будет введение...</p>
      <h2>Основная часть</h2>
      <p>Здесь будет основная часть...</p>
      <h2>Заключение</h2>
      <p>Здесь будет заключение...</p>
    `);
  };

  const insertSignature = () => {
    core.commands.insertHTML(`
      <div style="margin-top: 2em; border-top: 1px solid #ccc; padding-top: 1em;">
        <p><strong>С уважением,</strong><br/>
        Иван Иванов<br/>
        <em>Senior Developer</em></p>
      </div>
    `);
  };

  const insertCurrentTime = () => {
    const time = new Date().toLocaleTimeString('ru-RU');
    core.commands.insertText(`[${time}] `);
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ color: 'white', marginBottom: '16px' }}>
        2. Программное управление
      </h2>
      
      <div style={{
        background: '#2d2d3f',
        padding: '12px',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={insertTemplate}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer' }}
        >
          📄 Вставить шаблон
        </button>
        <button
          onClick={insertSignature}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#8b5cf6', color: 'white', cursor: 'pointer' }}
        >
          ✍️ Вставить подпись
        </button>
        <button
          onClick={insertCurrentTime}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#10b981', color: 'white', cursor: 'pointer' }}
        >
          🕐 Вставить время
        </button>
        <button
          onClick={() => core.clear()}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer' }}
        >
          🗑️ Очистить
        </button>
      </div>

      <div
        ref={editorRef}
        style={{
          minHeight: '200px',
          padding: '16px',
          background: 'white',
          color: '#1e293b',
          borderRadius: '0 0 8px 8px',
          outline: 'none'
        }}
      />
    </div>
  );
}

/**
 * DEMO 3: Controlled режим
 */
function ControlledDemo() {
  const [content, setContent] = useState('<p>Controlled content</p>');
  const [showSource, setShowSource] = useState(false);

  const { editorRef, core } = useWysiwygEditor({
    value: content,
    onChange: (html) => setContent(html)
  });

  return (
    <div style={{ marginBottom: '48px' }}>
      <h2 style={{ color: 'white', marginBottom: '16px' }}>
        3. Controlled режим
      </h2>
      
      <div style={{
        background: '#2d2d3f',
        padding: '12px',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setShowSource(!showSource)}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer' }}
        >
          {showSource ? '👁️ Preview' : '💻 Source'}
        </button>
        <button
          onClick={() => setContent('<p>Reset content</p>')}
          style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer' }}
        >
          Reset
        </button>
        <span style={{ color: '#9ca3af', marginLeft: 'auto' }}>
          Content length: <strong style={{ color: 'white' }}>{content.length}</strong> chars
        </span>
      </div>

      {!showSource ? (
        <div
          ref={editorRef}
          style={{
            minHeight: '200px',
            padding: '16px',
            background: 'white',
            color: '#1e293b',
            borderRadius: '0 0 8px 8px',
            outline: 'none'
          }}
        />
      ) : (
        <pre style={{
          minHeight: '200px',
          padding: '16px',
          background: '#1e1e2e',
          color: '#a0ffa0',
          borderRadius: '0 0 8px 8px',
          overflow: 'auto',
          margin: 0,
          fontFamily: 'monospace',
          fontSize: '13px'
        }}>
          {content}
        </pre>
      )}
    </div>
  );
}

/**
 * Main Demo App
 */
export default function HeadlessDemo() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d3f 100%)',
      padding: '32px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '12px'
          }}>
            🎯 Headless WYSIWYG Editor
          </h1>
          <p style={{ fontSize: '18px', color: '#9ca3af' }}>
            Pure JS Core + React Adapter = Полная свобода
          </p>
        </header>

        <CustomToolbarDemo />
        <ProgrammaticDemo />
        <ControlledDemo />

        <div style={{
          background: '#2d2d3f',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '48px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>
            💡 Ключевые особенности
          </h3>
          <ul style={{ color: '#9ca3af', lineHeight: '1.8' }}>
            <li>✅ <strong style={{ color: 'white' }}>Headless Core</strong> - чистый JS/TS без React</li>
            <li>✅ <strong style={{ color: 'white' }}>Полный контроль UI</strong> - создай любой дизайн</li>
            <li>✅ <strong style={{ color: 'white' }}>Программное API</strong> - все команды доступны</li>
            <li>✅ <strong style={{ color: 'white' }}>Selection Manager</strong> - сохранение/восстановление</li>
            <li>✅ <strong style={{ color: 'white' }}>Controlled/Uncontrolled</strong> - оба режима</li>
            <li>✅ <strong style={{ color: 'white' }}>TypeScript</strong> - полная типизация</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
