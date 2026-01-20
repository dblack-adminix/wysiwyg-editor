# 🎯 Headless WYSIWYG Editor

Профессиональный WYSIWYG редактор с **настоящей headless архитектурой**. Core полностью независим от React и может использоваться в любом JS/TS проекте.

## 🏗️ Архитектура

```
┌─────────────────────────────────────┐
│         HEADLESS CORE               │
│      (Pure JS/TS, NO React)         │
├─────────────────────────────────────┤
│  • EditorCore                       │
│  • Commands API                     │
│  • SelectionManager                 │
│  • Stats                            │
│  • Autosave                         │
│  • DragDrop                         │
│  • Export                           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│        REACT ADAPTER                │
│     (Thin wrapper hook)             │
├─────────────────────────────────────┤
│  • useWysiwygEditor()               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         UI LAYER                    │
│      (Optional components)          │
├─────────────────────────────────────┤
│  • <WysiwygEditor />                │
│  • <Toolbar />                      │
│  • Modals                           │
└─────────────────────────────────────┘
```

## 📦 Установка

```bash
npm install @your-org/wysiwyg-editor
```

## 🚀 Использование

### 1. Pure JS (без React)

```javascript
import { EditorCore } from '@your-org/wysiwyg-editor';

// Создаём core
const core = new EditorCore({
  placeholder: 'Начните печатать...',
  onChange: (html, stats) => {
    console.log('Content:', html);
    console.log('Stats:', stats);
  },
  autosave: {
    enabled: true,
    key: 'my-editor',
    intervalMs: 3000
  }
});

// Монтируем к DOM элементу
const editorElement = document.getElementById('editor');
core.mount(editorElement);

// Используем API
core.commands.exec('bold');
core.commands.insertLink('https://example.com', 'Link');
core.commands.insertImage('https://example.com/image.jpg');

// Получаем контент
const html = core.getHTML();
const stats = core.getStats();

// Экспорт
core.export.downloadHTML();
core.export.print();

// Cleanup
core.unmount();
```

### 2. React Hook (headless)

```tsx
import { useWysiwygEditor } from '@your-org/wysiwyg-editor';

function CustomEditor() {
  const { editorRef, core, stats } = useWysiwygEditor({
    placeholder: 'Type here...',
    onChange: (html, stats) => console.log(html, stats)
  });

  return (
    <div>
      {/* Кастомный тулбар */}
      <div>
        <button onClick={() => core.commands.exec('bold')}>Bold</button>
        <button onClick={() => core.commands.exec('italic')}>Italic</button>
        <button onClick={() => core.export.downloadHTML()}>Export</button>
      </div>

      {/* Редактор */}
      <div ref={editorRef} style={{ minHeight: '300px', border: '1px solid #ccc' }} />

      {/* Статистика */}
      <div>Words: {stats.wordCount}</div>
    </div>
  );
}
```

### 3. React Component (с UI)

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';

function App() {
  const [html, setHtml] = useState('');

  return (
    <WysiwygEditor
      value={html}
      onChange={setHtml}
      placeholder="Start typing..."
    />
  );
}
```

## 🎯 Core API

### EditorCore

```typescript
const core = new EditorCore(options);

// Lifecycle
core.mount(element: HTMLElement);
core.unmount();

// Content
core.getHTML(): string;
core.setHTML(html: string);
core.clear();

// Stats
core.getStats(): { wordCount, charCount, paragraphCount };

// Focus
core.focus();
```

### Commands API

```typescript
// Basic formatting
core.commands.exec('bold');
core.commands.exec('italic');
core.commands.exec('underline');
core.commands.exec('strikeThrough');
core.commands.exec('undo');
core.commands.exec('redo');

// Query state
const isBold = core.commands.queryState('bold');

// Text styling
core.commands.setForeColor('#ff0000');
core.commands.setBackColor('#ffff00');
core.commands.setFontName('Arial');
core.commands.setFontSize('4');
core.commands.setFormatBlock('h1');

// Alignment
core.commands.exec('justifyLeft');
core.commands.exec('justifyCenter');
core.commands.exec('justifyRight');
core.commands.exec('justifyFull');

// Lists
core.commands.exec('insertUnorderedList');
core.commands.exec('insertOrderedList');
core.commands.exec('indent');
core.commands.exec('outdent');

// Insert content
core.commands.insertHTML('<p>Custom HTML</p>');
core.commands.insertText('Plain text');
core.commands.insertLink('https://example.com', 'Link text');
core.commands.insertImage('https://example.com/img.jpg', 'Alt text');
core.commands.insertVideo('https://youtube.com/embed/xxx');
core.commands.insertTable(3, 4); // 3 rows, 4 cols
core.commands.insertCodeBlock('const x = 10;');
core.commands.insertEmoji('😀');
core.commands.insertHR();

// Find & Replace
core.commands.find('search term');
core.commands.replace('old', 'new');
core.commands.replaceAll('old', 'new');

// Clear formatting
core.commands.exec('removeFormat');
```

### Selection Manager

```typescript
// Save selection before opening modal
core.selection.save();

// Restore selection after modal closes
core.selection.restore();

// Check if has saved selection
if (core.selection.hasSaved()) {
  core.selection.restore();
}

// Clear saved selection
core.selection.clear();
```

### Export

```typescript
// Get content
const html = core.export.toHTML();
const text = core.export.toText();

// Download
core.export.downloadHTML('document.html');
core.export.downloadText('document.txt');

// Copy to clipboard
await core.export.copyHTML();

// Print
core.export.print();
```

### Autosave

```typescript
// Enable/disable
core.enableAutosave();
core.disableAutosave();

// Manual save
core.saveNow();

// Load saved
const saved = core.loadSaved();
if (saved) {
  core.setHTML(saved);
}
```

### Drag & Drop

```typescript
// Enable drag & drop for images
core.enableDragDrop((dataUrl, fileName) => {
  core.commands.insertImage(dataUrl, fileName);
});

// Disable
core.disableDragDrop();
```

## 📝 Примеры

### Controlled режим

```tsx
import { useState } from 'react';
import { useWysiwygEditor } from '@your-org/wysiwyg-editor';

function ControlledEditor() {
  const [content, setContent] = useState('<p>Initial</p>');
  
  const { editorRef, core } = useWysiwygEditor({
    value: content,
    onChange: (html) => setContent(html)
  });

  return <div ref={editorRef} />;
}
```

### Uncontrolled с автосохранением

```tsx
import { useWysiwygEditor } from '@your-org/wysiwyg-editor';

function AutosaveEditor() {
  const { editorRef } = useWysiwygEditor({
    defaultValue: '<p>Start</p>',
    autosave: {
      enabled: true,
      key: 'my-doc',
      intervalMs: 5000
    }
  });

  return <div ref={editorRef} />;
}
```

### Кастомный тулбар

```tsx
import { useWysiwygEditor } from '@your-org/wysiwyg-editor';

function CustomToolbarEditor() {
  const { editorRef, core, stats } = useWysiwygEditor();

  const insertTemplate = () => {
    core.setHTML(`
      <h1>Document Title</h1>
      <p>Introduction...</p>
      <h2>Section 1</h2>
      <p>Content...</p>
    `);
  };

  return (
    <div>
      <div style={{ padding: '8px', background: '#f0f0f0' }}>
        <button onClick={() => core.commands.exec('bold')}>B</button>
        <button onClick={() => core.commands.exec('italic')}>I</button>
        <button onClick={() => core.commands.exec('underline')}>U</button>
        <button onClick={() => core.commands.setFormatBlock('h1')}>H1</button>
        <button onClick={() => core.commands.setFormatBlock('h2')}>H2</button>
        <button onClick={() => core.commands.insertTable(3, 3)}>Table</button>
        <button onClick={insertTemplate}>Template</button>
        <button onClick={() => core.export.downloadHTML()}>Export</button>
      </div>

      <div ref={editorRef} style={{ minHeight: '400px', padding: '16px', border: '1px solid #ccc' }} />

      <div style={{ padding: '8px', background: '#f0f0f0' }}>
        Words: {stats.wordCount} | Chars: {stats.charCount} | Paras: {stats.paragraphCount}
      </div>
    </div>
  );
}
```

### Программное управление

```tsx
import { useWysiwygEditor } from '@your-org/wysiwyg-editor';

function ProgrammaticEditor() {
  const { editorRef, core } = useWysiwygEditor();

  const actions = {
    makeBold: () => core.commands.exec('bold'),
    insertDate: () => {
      const date = new Date().toLocaleDateString();
      core.commands.insertText(date);
    },
    insertSignature: () => {
      core.commands.insertHTML(`
        <div style="margin-top: 2em;">
          <p>Best regards,<br/>John Doe</p>
        </div>
      `);
    },
    clearAll: () => core.clear()
  };

  return (
    <div>
      <button onClick={actions.makeBold}>Bold</button>
      <button onClick={actions.insertDate}>Insert Date</button>
      <button onClick={actions.insertSignature}>Insert Signature</button>
      <button onClick={actions.clearAll}>Clear</button>
      
      <div ref={editorRef} style={{ minHeight: '300px' }} />
    </div>
  );
}
```

### Модалки с сохранением selection

```tsx
import { useState } from 'react';
import { useWysiwygEditor } from '@your-org/wysiwyg-editor';

function EditorWithModals() {
  const { editorRef, core } = useWysiwygEditor();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const openLinkModal = () => {
    core.selection.save(); // ВАЖНО: сохраняем selection
    setShowLinkModal(true);
  };

  const insertLink = () => {
    core.selection.restore(); // Восстанавливаем selection
    core.commands.insertLink(linkUrl, linkUrl);
    setShowLinkModal(false);
    setLinkUrl('');
  };

  return (
    <div>
      <button onClick={openLinkModal}>Insert Link</button>
      <div ref={editorRef} style={{ minHeight: '300px' }} />

      {showLinkModal && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
          <h3>Insert Link</h3>
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
          />
          <button onClick={insertLink}>Insert</button>
          <button onClick={() => setShowLinkModal(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
```

### Vanilla JS (без фреймворков)

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    #editor {
      min-height: 300px;
      padding: 16px;
      border: 1px solid #ccc;
    }
    #editor:empty::before {
      content: attr(data-placeholder);
      color: #999;
    }
  </style>
</head>
<body>
  <div id="toolbar">
    <button onclick="editor.commands.exec('bold')">Bold</button>
    <button onclick="editor.commands.exec('italic')">Italic</button>
    <button onclick="editor.export.downloadHTML()">Export</button>
  </div>

  <div id="editor"></div>

  <div id="stats"></div>

  <script type="module">
    import { EditorCore } from './dist/index.esm.js';

    const editor = new EditorCore({
      placeholder: 'Start typing...',
      onChange: (html, stats) => {
        document.getElementById('stats').textContent = 
          `Words: ${stats.wordCount} | Chars: ${stats.charCount}`;
      }
    });

    editor.mount(document.getElementById('editor'));
    window.editor = editor; // For toolbar buttons
  </script>
</body>
</html>
```

## 🔧 TypeScript

Полная типизация из коробки:

```typescript
import { 
  EditorCore, 
  EditorCoreAPI, 
  CommandsAPI,
  EditorStats,
  BasicCommand 
} from '@your-org/wysiwyg-editor';

const core: EditorCoreAPI = new EditorCore();
const stats: EditorStats = core.getStats();
const commands: CommandsAPI = core.commands;
```

## 🎨 Стилизация

Core не содержит стилей — вы полностью контролируете внешний вид:

```css
/* Базовые стили для contenteditable */
[contenteditable] {
  min-height: 300px;
  padding: 16px;
  border: 1px solid #ccc;
  outline: none;
}

[contenteditable]:empty::before {
  content: attr(data-placeholder);
  color: #999;
  pointer-events: none;
}

/* Стили контента */
[contenteditable] h1 { font-size: 2em; }
[contenteditable] h2 { font-size: 1.5em; }
[contenteditable] img { max-width: 100%; }
[contenteditable] table { border-collapse: collapse; }
[contenteditable] td, [contenteditable] th { border: 1px solid #ccc; padding: 8px; }
```

## 🔒 Безопасность

```typescript
// Включить санитизацию HTML
const core = new EditorCore({
  sanitize: true // Удаляет <script> и event handlers
});

// Или использовать утилиту
import { sanitizeHtml } from '@your-org/wysiwyg-editor';
const clean = sanitizeHtml(userHtml);
```

## 📚 Полная документация

- [README.md](./README.md) - полная документация
- [EXAMPLES.md](./EXAMPLES.md) - больше примеров

## 🤝 Преимущества headless

1. **Независимость от фреймворка** - используй в React, Vue, Angular, Vanilla JS
2. **Полный контроль UI** - создай любой дизайн
3. **Тестируемость** - core легко тестировать без DOM
4. **Переиспользуемость** - один core для всех проектов
5. **Производительность** - минимальные зависимости

---

Сделано с ❤️ для разработчиков
