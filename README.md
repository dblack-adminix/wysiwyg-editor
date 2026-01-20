# Pro WYSIWYG Editor

[![npm version](https://img.shields.io/npm/v/wysiwyg-editor-3lab)](https://www.npmjs.com/package/wysiwyg-editor-3lab)
[![npm downloads](https://img.shields.io/npm/dm/wysiwyg-editor-3lab)](https://www.npmjs.com/package/wysiwyg-editor-3lab)
[![bundle size](https://img.shields.io/bundlephobia/minzip/wysiwyg-editor-3lab)](https://bundlephobia.com/package/wysiwyg-editor-3lab)
[![license](https://img.shields.io/npm/l/wysiwyg-editor-3lab)](https://github.com/3lab/wysiwyg-editor/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

Профессиональный WYSIWYG редактор для React с headless архитектурой. Полный набор функций для создания богатого текстового контента.

## ✨ Особенности

- 🎨 **Headless архитектура** — разделение логики (core) и UI (components)
- ⚡ **React + TypeScript** — полная типизация
- 🎯 **Controlled & Uncontrolled** — работает в обоих режимах
- 💾 **Автосохранение** — опциональное сохранение в localStorage
- 🌙 **Темная/светлая тема** — переключение тем
- 📱 **Responsive** — адаптивный дизайн
- 🔒 **Безопасность** — опциональная санитизация HTML
- 🎨 **Полная кастомизация** — настройка через props
- 📦 **Без зависимостей** — только React peer dependency
- 💻 **Автоопределение кода** — автоматическая подсветка синтаксиса при вставке кода
- 💬 **ChatEditor** — компактный редактор для чатов и мессенджеров

## 📦 Установка

```bash
npm install wysiwyg-editor-3lab
# или
yarn add wysiwyg-editor-3lab
# или
pnpm add wysiwyg-editor-3lab
```

**Важно:** Добавьте Font Awesome в ваш проект:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

## 🚀 Быстрый старт

### Базовое использование

```tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import 'wysiwyg-editor-3lab/style.css';

function App() {
  return <WysiwygEditor placeholder="Начните печатать..." />;
}
```

### Controlled режим

```tsx
import { useState } from 'react';
import { WysiwygEditor, EditorMeta } from 'wysiwyg-editor-3lab';
import 'wysiwyg-editor-3lab/style.css';

function App() {
  const [html, setHtml] = useState('');
  
  const handleChange = (newHtml: string, meta: EditorMeta) => {
    setHtml(newHtml);
    console.log('Stats:', meta);
  };

  return (
    <WysiwygEditor
      value={html}
      onChange={handleChange}
      placeholder="Введите текст..."
    />
  );
}
```

### Uncontrolled с автосохранением

```tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import 'wysiwyg-editor-3lab/style.css';

function App() {
  return (
    <WysiwygEditor
      defaultValue="<p>Начальный контент</p>"
      enableAutosave={true}
      autosaveKey="my-editor-content"
      autosaveIntervalMs={3000}
    />
  );
}
```

## 💬 ChatEditor — компактный редактор для чатов

Специальный компонент для мессенджеров и чатов с минимальным интерфейсом:

```tsx
import { ChatEditor } from 'wysiwyg-editor-3lab';
import 'wysiwyg-editor-3lab/style.css';

function Chat() {
  return (
    <ChatEditor
      placeholder="Введите сообщение..."
      onSubmit={(html) => {
        console.log('Отправлено:', html);
        // Отправка на сервер
      }}
      submitOnCtrlEnter={true}
      enableEmoji={true}
      enableBold={true}
      enableItalic={true}
      enableCode={true}
      enableLink={true}
      enableTextColor={true}
      enableBgColor={true}
      enableImage={true}
      enableVideo={true}
      enableTable={true}
      maxHeight={150}
    />
  );
}
```

### ChatEditor Props

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `value` | `string` | - | HTML контент (controlled) |
| `defaultValue` | `string` | - | Начальный HTML (uncontrolled) |
| `onChange` | `(html: string, meta: EditorMeta) => void` | - | Callback при изменении |
| `onSubmit` | `(html: string) => void` | - | Callback при отправке |
| `placeholder` | `string` | `"Введите сообщение..."` | Placeholder текст |
| `theme` | `"dark" \| "light"` | `"dark"` | Тема оформления |
| `maxHeight` | `number \| string` | `200` | Максимальная высота |
| `minHeight` | `number \| string` | `40` | Минимальная высота |
| `enableEmoji` | `boolean` | `true` | Эмодзи пикер |
| `enableBold` | `boolean` | `true` | Жирный текст |
| `enableItalic` | `boolean` | `true` | Курсив |
| `enableUnderline` | `boolean` | `false` | Подчёркивание |
| `enableStrike` | `boolean` | `false` | Зачёркивание |
| `enableLink` | `boolean` | `true` | Вставка ссылок |
| `enableCode` | `boolean` | `true` | Блок кода |
| `enableList` | `boolean` | `false` | Списки |
| `enableTextColor` | `boolean` | `false` | Цвет текста |
| `enableBgColor` | `boolean` | `false` | Цвет фона |
| `enableImage` | `boolean` | `false` | Вставка изображений |
| `enableVideo` | `boolean` | `false` | Вставка видео |
| `enableTable` | `boolean` | `false` | Вставка таблиц |
| `onImageUpload` | `(file: File) => Promise<string>` | - | Кастомный загрузчик изображений |
| `submitOnEnter` | `boolean` | `false` | Отправка по Enter |
| `submitOnCtrlEnter` | `boolean` | `true` | Отправка по Ctrl+Enter |
| `submitButtonText` | `string` | `"Отправить"` | Текст кнопки |
| `showSubmitButton` | `boolean` | `true` | Показать кнопку отправки |

## 🎨 Кастомизация

### Встроенные темы

```tsx
<WysiwygEditor themeName="dark" />      // Темная тема
<WysiwygEditor themeName="light" />     // Светлая тема
<WysiwygEditor themeName="minimal" />   // Минималистичная
<WysiwygEditor themeName="colorful" />  // Яркая
```

### Пользовательские цвета

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#ff6b6b',
    bgPrimary: '#fff5f5',
    textPrimary: '#2d3748',
    borderRadius: '8px',
  }}
/>
```

### Управление панелью предпросмотра

```tsx
<WysiwygEditor
  enablePreviewPanel={true}
  previewPosition="right"        // 'right' | 'bottom' | 'none'
  previewWidth={400}
  previewHeight={600}
/>
```

Подробнее в [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) и [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)

## 📖 API

### WysiwygEditor Props

| Prop | Type | Default | Описание |
|------|------|---------|----------|
| `value` | `string` | - | HTML контент (controlled) |
| `defaultValue` | `string` | - | Начальный HTML (uncontrolled) |
| `onChange` | `(html: string, meta: EditorMeta) => void` | - | Callback при изменении |
| `placeholder` | `string` | `"Начните печатать..."` | Placeholder текст |
| `className` | `string` | `""` | CSS класс контейнера |
| `style` | `CSSProperties` | - | Inline стили контейнера |
| `enableAutosave` | `boolean` | `false` | Включить автосохранение |
| `autosaveKey` | `string` | `"wysiwyg-editor-content"` | Ключ localStorage |
| `autosaveIntervalMs` | `number` | `2000` | Интервал автосохранения (мс) |
| `enablePreviewPanel` | `boolean` | `true` | Показать панель предпросмотра |
| `enableSourceTab` | `boolean` | `true` | Показать вкладку HTML кода |
| `enableFindReplace` | `boolean` | `true` | Включить поиск/замену |
| `allowImages` | `boolean` | `true` | Разрешить вставку изображений |
| `allowImageUpload` | `boolean` | `true` | Разрешить загрузку файлов |
| `allowVideoEmbeds` | `boolean` | `true` | Разрешить видео (YouTube/Vimeo) |
| `allowTables` | `boolean` | `true` | Разрешить таблицы |
| `theme` | `"dark" \| "light" \| "auto"` | `"dark"` | Тема оформления |
| `sanitizeHtml` | `boolean` | `false` | Санитизация HTML |
| `normalizeHtml` | `boolean` | `false` | Нормализация HTML |

### EditorMeta

```typescript
interface EditorMeta {
  wordCount: number;        // Количество слов
  charCount: number;        // Количество символов
  paragraphCount: number;   // Количество параграфов
}
```

## 🎯 Использование Hook

Для более гибкого управления используйте хук `useWysiwygEditor`:

```tsx
import { useWysiwygEditor } from '@3lab/wysiwyg-editor';

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
    exportText,
    copyHtml,
    print
  } = useWysiwygEditor({
    defaultValue: '<p>Hello</p>',
    onChange: (html, meta) => console.log(html, meta)
  });

  return (
    <div>
      <button onClick={toggleFullscreen}>Fullscreen</button>
      <button onClick={exportHtml}>Export HTML</button>
      
      <div
        ref={editorRef}
        contentEditable
        onInput={handleChange}
        style={{ minHeight: '300px', padding: '16px' }}
      />
      
      <div>Words: {meta.wordCount}</div>
    </div>
  );
}
```

## 🛠️ EditorController API

Headless контроллер для программного управления редактором:

```typescript
import { EditorController } from '@3lab/wysiwyg-editor';

const controller = new EditorController({
  sanitize: true,
  normalize: true
});

// Команды форматирования
controller.execCommand('bold');
controller.execCommand('italic');
controller.execCommand('underline');

// Вставка контента
controller.insertLink('https://example.com', 'Link text');
controller.insertImage('https://example.com/image.jpg', 'Alt text');
controller.insertTable(3, 4); // 3 строки, 4 столбца
controller.insertEmoji('😀');
controller.insertCodeBlock('const x = 10;');

// Цвета и шрифты
controller.setForeColor('#ff0000');
controller.setBackColor('#ffff00');
controller.setFontName('Arial');
controller.setFontSize('4');
controller.setFormatBlock('h1');

// Поиск и замена
controller.findText('search term');
controller.replaceText('old', 'new');
controller.replaceAllText('old', 'new');

// Получение данных
const html = controller.getHtml();
const meta = controller.getMeta();
const isActive = controller.queryCommandState('bold');

// Управление selection
controller.saveSelection();
controller.restoreSelection();
```

## ⌨️ Горячие клавиши

| Клавиши | Действие |
|---------|----------|
| `Ctrl+B` | Жирный текст |
| `Ctrl+I` | Курсив |
| `Ctrl+U` | Подчёркивание |
| `Ctrl+K` | Вставить ссылку |
| `Ctrl+F` | Поиск и замена |
| `Ctrl+S` | Сохранить |
| `F11` | Полноэкранный режим |
| `Escape` | Закрыть модалки/выйти из fullscreen |

## 💻 Автоматическое определение кода

Редактор автоматически определяет программный код при вставке и применяет подсветку синтаксиса с цветной рамкой.

### Поддерживаемые языки (48 типов)

**Web / Frontend:** HTML, XML, SVG, CSS, SCSS, Less, JavaScript, TypeScript, JSX, TSX, JSON, JSONC, Markdown, MDX

**Backend:** Python, Go, PHP, Ruby, Java, C#, C++, C, Rust

**DevOps / Config:** YAML, TOML, INI, .env, Dockerfile, Docker Compose, Nginx, Apache, Caddyfile, Kubernetes, Terraform, Ansible

**Databases:** SQL, PostgreSQL, MySQL

**Shell:** Bash, PowerShell, CMD/Batch

**Logs / Data:** Generic Log, Nginx Access/Error Logs, JSON Lines, CSV

### Как это работает

Просто вставьте код в редактор (Ctrl+V), и он автоматически:
1. Определит, что это код (по характерным признакам)
2. Распознает язык программирования или тип конфига
3. Обернёт код в блок с подсветкой синтаксиса
4. Добавит цветную рамку и бейдж с названием языка

### Пример

Вставьте этот Dockerfile:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
```

Он автоматически превратится в красиво оформленный блок кода с подсветкой синтаксиса и бейджем "Dockerfile".

### Ручная вставка кода

Также можно использовать кнопку "Code" на панели инструментов для вставки блока кода вручную.

### Подробнее

См. `ADVANCED_CODE_DETECTOR.md` для полной документации и `FIXTURES_ALL_LANGUAGES.md` для примеров всех поддерживаемых языков.

## 🎨 Кастомизация стилей

### Через CSS модули

```tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import styles from './MyEditor.module.css';

<WysiwygEditor className={styles.myEditor} />
```

### Через inline стили

```tsx
<WysiwygEditor
  style={{
    maxWidth: '800px',
    margin: '0 auto'
  }}
/>
```

### Переопределение CSS переменных

```css
:root {
  --primary: #your-color;
  --primary-dark: #your-dark-color;
  --dark-bg: #your-bg;
  --dark-surface: #your-surface;
  --dark-border: #your-border;
}
```

## 🔧 Утилиты

### HTML утилиты

```typescript
import {
  sanitizeHtml,
  normalizeHtml,
  stripHtml,
  countWords,
  countParagraphs
} from '@3lab/wysiwyg-editor';

const clean = sanitizeHtml('<script>alert("xss")</script><p>Safe</p>');
const normalized = normalizeHtml('<p></p><p>Text</p>');
const text = stripHtml('<p><strong>Bold</strong> text</p>');
const words = countWords('Hello world');
const paras = countParagraphs('<p>One</p><p>Two</p>');
```

### Видео парсер

```typescript
import { parseVideoUrl, createVideoEmbed } from '@3lab/wysiwyg-editor';

const result = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
// { embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', provider: 'youtube' }

const embedHtml = createVideoEmbed(result.embedUrl);
```

## 📝 Примеры использования

### В форме

```tsx
import { useState } from 'react';
import { WysiwygEditor } from '@3lab/wysiwyg-editor';

function ArticleForm() {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting:', formData);
    // Отправка на сервер
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Заголовок статьи"
      />
      
      <WysiwygEditor
        value={formData.content}
        onChange={(html) => setFormData({ ...formData, content: html })}
        placeholder="Содержание статьи..."
      />
      
      <button type="submit">Опубликовать</button>
    </form>
  );
}
```

### С валидацией

```tsx
import { useState } from 'react';
import { WysiwygEditor, stripHtml } from '@3lab/wysiwyg-editor';

function ValidatedEditor() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleChange = (html: string) => {
    setContent(html);
    
    const text = stripHtml(html);
    if (text.length < 10) {
      setError('Минимум 10 символов');
    } else if (text.length > 5000) {
      setError('Максимум 5000 символов');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <WysiwygEditor value={content} onChange={handleChange} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}
```

### Только для чтения

```tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';

function ReadOnlyView({ content }: { content: string }) {
  return (
    <div style={{ pointerEvents: 'none' }}>
      <WysiwygEditor
        value={content}
        enablePreviewPanel={false}
      />
    </div>
  );
}
```

## 🧪 Тестирование

### Unit тесты

```bash
npm test
```

### Пример теста

```typescript
import { describe, it, expect } from 'vitest';
import { parseVideoUrl } from '@3lab/wysiwyg-editor';

describe('parseVideoUrl', () => {
  it('should parse YouTube URL', () => {
    const result = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result?.provider).toBe('youtube');
    expect(result?.embedUrl).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('should parse Vimeo URL', () => {
    const result = parseVideoUrl('https://vimeo.com/123456789');
    expect(result?.provider).toBe('vimeo');
    expect(result?.embedUrl).toBe('https://player.vimeo.com/video/123456789');
  });
});
```

## 🏗️ Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера с демо
npm run dev

# Сборка библиотеки
npm run build

# Запуск тестов
npm test

# Линтинг
npm run lint
```

## 📂 Структура проекта

```
wysiwyg-editor/
├── src/
│   ├── components/          # React компоненты
│   │   ├── WysiwygEditor.tsx
│   │   ├── Toolbar.tsx
│   │   ├── StatusBar.tsx
│   │   ├── FindReplace.tsx
│   │   ├── PreviewPanel.tsx
│   │   ├── LinkModal.tsx
│   │   ├── ImageModal.tsx
│   │   ├── VideoModal.tsx
│   │   └── TableModal.tsx
│   ├── core/                # Headless логика
│   │   └── EditorController.ts
│   ├── hooks/               # React hooks
│   │   └── useWysiwygEditor.ts
│   ├── utils/               # Утилиты
│   │   ├── htmlUtils.ts
│   │   ├── videoParser.ts
│   │   └── selection.ts
│   ├── types.ts             # TypeScript типы
│   ├── constants.ts         # Константы
│   ├── WysiwygEditor.module.css  # Стили
│   └── index.ts             # Главный экспорт
├── demo/                    # Демо приложение
│   ├── App.tsx
│   ├── main.tsx
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔒 Безопасность

По умолчанию редактор **не санитизирует** HTML для максимальной гибкости. Для production рекомендуется:

1. Включить санитизацию:
```tsx
<WysiwygEditor sanitizeHtml={true} />
```

2. Или использовать DOMPurify на сервере:
```typescript
import DOMPurify from 'dompurify';

const cleanHtml = DOMPurify.sanitize(userHtml);
```

## 🤝 Вклад в проект

Приветствуются pull requests! Для крупных изменений сначала откройте issue.

## 📄 Лицензия

MIT

## 🙏 Благодарности

- Font Awesome для иконок
- React команда за отличный фреймворк
- Сообщество open source

---

Сделано с ❤️ для разработчиков
