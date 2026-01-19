# Примеры использования WYSIWYG Editor

## 📝 Базовые примеры

### 1. Простейший редактор

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

function SimpleEditor() {
  return <WysiwygEditor />;
}
```

### 2. Controlled компонент

```tsx
import { useState } from 'react';
import { WysiwygEditor, EditorMeta } from '@your-org/wysiwyg-editor';

function ControlledEditor() {
  const [content, setContent] = useState('<p>Начальный текст</p>');
  const [meta, setMeta] = useState<EditorMeta>({
    wordCount: 0,
    charCount: 0,
    paragraphCount: 0
  });

  const handleChange = (html: string, newMeta: EditorMeta) => {
    setContent(html);
    setMeta(newMeta);
  };

  return (
    <div>
      <WysiwygEditor value={content} onChange={handleChange} />
      <div>Слов: {meta.wordCount}</div>
    </div>
  );
}
```

### 3. Uncontrolled с автосохранением

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

function AutosaveEditor() {
  return (
    <WysiwygEditor
      defaultValue="<p>Этот контент автоматически сохраняется</p>"
      enableAutosave={true}
      autosaveKey="my-document"
      autosaveIntervalMs={5000}
    />
  );
}
```

## 🎨 Кастомизация

### 4. Светлая тема

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

function LightThemeEditor() {
  return <WysiwygEditor theme="light" />;
}
```

### 5. Минимальная конфигурация

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

function MinimalEditor() {
  return (
    <WysiwygEditor
      enablePreviewPanel={false}
      enableFindReplace={false}
      allowVideoEmbeds={false}
      allowTables={false}
      placeholder="Простой текстовый редактор..."
    />
  );
}
```

### 6. Только текст (без медиа)

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

function TextOnlyEditor() {
  return (
    <WysiwygEditor
      allowImages={false}
      allowVideoEmbeds={false}
      allowTables={false}
      placeholder="Только текстовое форматирование..."
    />
  );
}
```

## 📋 Интеграция с формами

### 7. Форма создания статьи

```tsx
import { useState } from 'react';
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

interface Article {
  title: string;
  content: string;
  author: string;
}

function ArticleForm() {
  const [article, setArticle] = useState<Article>({
    title: '',
    content: '',
    author: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Отправка на сервер
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article)
    });
    
    if (response.ok) {
      alert('Статья опубликована!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Заголовок"
        value={article.title}
        onChange={(e) => setArticle({ ...article, title: e.target.value })}
        required
      />
      
      <input
        type="text"
        placeholder="Автор"
        value={article.author}
        onChange={(e) => setArticle({ ...article, author: e.target.value })}
        required
      />
      
      <WysiwygEditor
        value={article.content}
        onChange={(html) => setArticle({ ...article, content: html })}
        placeholder="Содержание статьи..."
      />
      
      <button type="submit">Опубликовать</button>
    </form>
  );
}
```

### 8. Форма с валидацией

```tsx
import { useState } from 'react';
import { WysiwygEditor, stripHtml } from '@your-org/wysiwyg-editor';

function ValidatedForm() {
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const validate = (html: string) => {
    const newErrors: string[] = [];
    const text = stripHtml(html);
    
    if (text.length < 50) {
      newErrors.push('Минимум 50 символов');
    }
    
    if (text.length > 10000) {
      newErrors.push('Максимум 10000 символов');
    }
    
    if (!html.includes('<h1>') && !html.includes('<h2>')) {
      newErrors.push('Добавьте хотя бы один заголовок');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (html: string) => {
    setContent(html);
    validate(html);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate(content)) {
      console.log('Форма валидна, отправляем:', content);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <WysiwygEditor value={content} onChange={handleChange} />
      
      {errors.length > 0 && (
        <div style={{ color: 'red', marginTop: '8px' }}>
          {errors.map((error, i) => (
            <div key={i}>• {error}</div>
          ))}
        </div>
      )}
      
      <button type="submit" disabled={errors.length > 0}>
        Отправить
      </button>
    </form>
  );
}
```

## 🔧 Использование Hook

### 9. Кастомный редактор с хуком

```tsx
import { useWysiwygEditor } from '@your-org/wysiwyg-editor';

function CustomEditor() {
  const {
    editorRef,
    controller,
    meta,
    isFullscreen,
    theme,
    handleChange,
    toggleFullscreen,
    toggleTheme,
    exportHtml,
    print
  } = useWysiwygEditor({
    defaultValue: '<p>Hello World</p>',
    onChange: (html, meta) => {
      console.log('Changed:', { html, meta });
    }
  });

  return (
    <div>
      {/* Кастомный тулбар */}
      <div style={{ padding: '8px', background: '#f0f0f0' }}>
        <button onClick={() => controller.execCommand('bold')}>Bold</button>
        <button onClick={() => controller.execCommand('italic')}>Italic</button>
        <button onClick={toggleFullscreen}>Fullscreen</button>
        <button onClick={toggleTheme}>Theme</button>
        <button onClick={exportHtml}>Export</button>
        <button onClick={print}>Print</button>
      </div>

      {/* Редактор */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleChange}
        style={{
          minHeight: '300px',
          padding: '16px',
          border: '1px solid #ccc',
          background: theme === 'light' ? 'white' : '#1e1e2e',
          color: theme === 'light' ? 'black' : 'white'
        }}
      />

      {/* Статистика */}
      <div style={{ padding: '8px', background: '#f0f0f0' }}>
        Words: {meta.wordCount} | Chars: {meta.charCount} | Paras: {meta.paragraphCount}
      </div>
    </div>
  );
}
```

### 10. Программное управление

```tsx
import { useRef } from 'react';
import { useWysiwygEditor } from '@your-org/wysiwyg-editor';

function ProgrammaticEditor() {
  const { editorRef, controller, handleChange } = useWysiwygEditor();

  const insertTemplate = () => {
    controller.setHtml(`
      <h1>Шаблон документа</h1>
      <p>Введение...</p>
      <h2>Раздел 1</h2>
      <p>Содержание раздела 1...</p>
      <h2>Раздел 2</h2>
      <p>Содержание раздела 2...</p>
    `);
    handleChange();
  };

  const insertCurrentDate = () => {
    const date = new Date().toLocaleDateString('ru-RU');
    controller.insertHtml(`<p><strong>Дата:</strong> ${date}</p>`);
    handleChange();
  };

  const makeHeading = () => {
    controller.setFormatBlock('h2');
    handleChange();
  };

  return (
    <div>
      <div style={{ marginBottom: '8px' }}>
        <button onClick={insertTemplate}>Вставить шаблон</button>
        <button onClick={insertCurrentDate}>Вставить дату</button>
        <button onClick={makeHeading}>Сделать заголовком</button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleChange}
        style={{ minHeight: '300px', padding: '16px', border: '1px solid #ccc' }}
      />
    </div>
  );
}
```

## 🔒 Безопасность

### 11. С санитизацией

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

function SecureEditor() {
  return (
    <WysiwygEditor
      sanitizeHtml={true}
      normalizeHtml={true}
      onChange={(html) => {
        // HTML уже очищен от опасного контента
        console.log('Safe HTML:', html);
      }}
    />
  );
}
```

### 12. Серверная санитизация

```tsx
import { useState } from 'react';
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import DOMPurify from 'dompurify';

function ServerSanitizedEditor() {
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    // Санитизация на клиенте перед отправкой
    const cleanHtml = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: []
    });

    await fetch('/api/content', {
      method: 'POST',
      body: JSON.stringify({ content: cleanHtml })
    });
  };

  return (
    <div>
      <WysiwygEditor value={content} onChange={setContent} />
      <button onClick={handleSubmit}>Сохранить</button>
    </div>
  );
}
```

## 📱 Адаптивность

### 13. Мобильная версия

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

function MobileEditor() {
  return (
    <WysiwygEditor
      style={{
        maxWidth: '100%',
        margin: '0 auto'
      }}
      enablePreviewPanel={false} // Скрыть на мобильных
    />
  );
}
```

## 🎯 Специальные случаи

### 14. Комментарии

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

function CommentEditor() {
  return (
    <WysiwygEditor
      placeholder="Напишите комментарий..."
      enablePreviewPanel={false}
      allowImages={false}
      allowVideoEmbeds={false}
      allowTables={false}
      style={{ maxHeight: '200px' }}
    />
  );
}
```

### 15. Email редактор

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

function EmailEditor() {
  return (
    <WysiwygEditor
      placeholder="Текст письма..."
      allowVideoEmbeds={false}
      allowTables={true}
      sanitizeHtml={true}
      normalizeHtml={true}
    />
  );
}
```

### 16. Markdown экспорт

```tsx
import { useState } from 'react';
import { WysiwygEditor, stripHtml } from '@your-org/wysiwyg-editor';

function MarkdownExportEditor() {
  const [html, setHtml] = useState('');

  const exportToMarkdown = () => {
    // Простая конвертация (для production используйте библиотеку)
    let md = html;
    md = md.replace(/<h1>(.*?)<\/h1>/g, '# $1\n');
    md = md.replace(/<h2>(.*?)<\/h2>/g, '## $1\n');
    md = md.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    md = md.replace(/<em>(.*?)<\/em>/g, '*$1*');
    md = md.replace(/<p>(.*?)<\/p>/g, '$1\n\n');
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
  };

  return (
    <div>
      <WysiwygEditor value={html} onChange={setHtml} />
      <button onClick={exportToMarkdown}>Export to Markdown</button>
    </div>
  );
}
```

## 🧪 Тестирование

### 17. Тестовый пример

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

describe('WysiwygEditor', () => {
  it('should render with placeholder', () => {
    render(<WysiwygEditor placeholder="Test placeholder" />);
    expect(screen.getByText('Test placeholder')).toBeInTheDocument();
  });

  it('should call onChange when content changes', () => {
    const handleChange = vi.fn();
    render(<WysiwygEditor onChange={handleChange} />);
    
    const editor = screen.getByRole('textbox');
    fireEvent.input(editor, { target: { innerHTML: '<p>Test</p>' } });
    
    expect(handleChange).toHaveBeenCalled();
  });
});
```

---

Больше примеров в [документации](./README.md)!
