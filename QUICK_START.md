# Быстрый старт @3lab/wysiwyg-editor

## 🚀 Установка и первый запуск

### 1. Установите пакет

```bash
npm install @3lab/wysiwyg-editor
```

### 2. Импортируйте в ваш компонент

```tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import '@3lab/wysiwyg-editor/style.css';
```

### 3. Используйте редактор

```tsx
function App() {
  return <WysiwygEditor placeholder="Начните печатать..." />;
}
```

## 📝 Базовые примеры

### Controlled режим (рекомендуется)

```tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import '@3lab/wysiwyg-editor/style.css';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('');

  return (
    <WysiwygEditor
      value={content}
      onChange={(html) => setContent(html)}
      placeholder="Введите текст..."
    />
  );
}
```

### С метаданными (подсчет слов)

```tsx
import { WysiwygEditor, EditorMeta } from '@3lab/wysiwyg-editor';
import '@3lab/wysiwyg-editor/style.css';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('');
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
      <div>Слов: {meta.wordCount} | Символов: {meta.charCount}</div>
    </div>
  );
}
```

### С автосохранением

```tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import '@3lab/wysiwyg-editor/style.css';

function App() {
  return (
    <WysiwygEditor
      defaultValue="<p>Начальный контент</p>"
      enableAutosave={true}
      autosaveKey="my-article"
      autosaveIntervalMs={2000}
      placeholder="Ваш текст автоматически сохраняется..."
    />
  );
}
```

### Минимальная конфигурация

```tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import '@3lab/wysiwyg-editor/style.css';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('');

  return (
    <WysiwygEditor
      value={content}
      onChange={(html) => setContent(html)}
      // Отключить дополнительные функции
      enablePreviewPanel={false}
      enableSourceTab={false}
      enableFindReplace={false}
      enablePrint={false}
      enableFullscreen={false}
      allowVideoEmbeds={false}
      allowTables={false}
      placeholder="Простой редактор"
    />
  );
}
```

## 🎨 Темы

### Темная тема (по умолчанию)

```tsx
<WysiwygEditor theme="dark" />
```

### Светлая тема

```tsx
<WysiwygEditor theme="light" />
```

### Автоматическая тема (системная)

```tsx
<WysiwygEditor theme="auto" />
```

## 📱 Мобильная оптимизация

По умолчанию включена. Для отключения:

```tsx
<WysiwygEditor mobileOptimized={false} />
```

## 🖼️ Загрузка изображений

### С кастомным обработчиком

```tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import '@3lab/wysiwyg-editor/style.css';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('');

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.url; // URL загруженного изображения
  };

  return (
    <WysiwygEditor
      value={content}
      onChange={(html) => setContent(html)}
      allowImageUpload={true}
      onImageUpload={handleImageUpload}
    />
  );
}
```

## 🎬 Видео

### YouTube и Vimeo (встроенная поддержка)

Просто нажмите кнопку "Video" и вставьте URL:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://vimeo.com/VIDEO_ID`

### Загрузка видео файлов

```tsx
const handleVideoUpload = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('video', file);

  const response = await fetch('/api/upload/video', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.url;
};

<WysiwygEditor
  allowVideoUpload={true}
  onVideoUpload={handleVideoUpload}
/>
```

## 💾 Сохранение и экспорт

### Получить HTML

```tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('');

  const handleSave = () => {
    console.log('HTML:', content);
    // Отправить на сервер
    fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  };

  return (
    <div>
      <WysiwygEditor value={content} onChange={(html) => setContent(html)} />
      <button onClick={handleSave}>Сохранить</button>
    </div>
  );
}
```

### Экспорт в PDF

Встроенная функция - просто нажмите кнопку "Print" → "Save PDF"

## 🔍 Поиск и замена

Включено по умолчанию. Горячая клавиша: `Ctrl+F`

Для отключения:

```tsx
<WysiwygEditor enableFindReplace={false} />
```

## ⌨️ Горячие клавиши

- `Ctrl+B` - Жирный
- `Ctrl+I` - Курсив
- `Ctrl+U` - Подчеркивание
- `Ctrl+K` - Вставить ссылку
- `Ctrl+F` - Поиск и замена
- `Ctrl+S` - Сохранить (если настроено)
- `F11` - Полноэкранный режим
- `Escape` - Закрыть модалки

## 💻 Автоопределение кода

Просто вставьте код (Ctrl+V) - редактор автоматически:
1. Определит, что это код
2. Распознает язык (48+ языков)
3. Применит подсветку синтаксиса Shiki

Поддерживаемые языки:
- JavaScript, TypeScript, Python, Go, PHP, Ruby, Java, C#, C++, Rust
- HTML, CSS, JSON, YAML, TOML, Markdown
- Bash, PowerShell, SQL, Dockerfile, Nginx
- И многие другие!

## 🎯 TypeScript

Полная поддержка TypeScript с автодополнением:

```tsx
import { 
  WysiwygEditor, 
  EditorMeta, 
  WysiwygEditorProps,
  useWysiwygEditor 
} from '@3lab/wysiwyg-editor';
```

## 🔧 Интеграция с формами

### React Hook Form

```tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import '@3lab/wysiwyg-editor/style.css';
import { useForm, Controller } from 'react-hook-form';

function ArticleForm() {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log('Content:', data.content);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <WysiwygEditor
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <button type="submit">Отправить</button>
    </form>
  );
}
```

## 🌐 Next.js

### App Router

```tsx
// app/editor/page.tsx
'use client';

import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import '@3lab/wysiwyg-editor/style.css';
import { useState } from 'react';

export default function EditorPage() {
  const [content, setContent] = useState('');

  return (
    <WysiwygEditor
      value={content}
      onChange={(html) => setContent(html)}
    />
  );
}
```

### Pages Router

```tsx
// pages/editor.tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import '@3lab/wysiwyg-editor/style.css';
import { useState } from 'react';

export default function EditorPage() {
  const [content, setContent] = useState('');

  return (
    <WysiwygEditor
      value={content}
      onChange={(html) => setContent(html)}
    />
  );
}
```

### SSR (если нужно)

```tsx
import dynamic from 'next/dynamic';

const WysiwygEditor = dynamic(
  () => import('@3lab/wysiwyg-editor').then(mod => mod.WysiwygEditor),
  { ssr: false }
);
```

## 📚 Дополнительная документация

- [README.md](./README.md) - Полная документация
- [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md) - Примеры интеграции
- [EXAMPLES.md](./EXAMPLES.md) - Дополнительные примеры

## 🆘 Помощь

Если что-то не работает:

1. Убедитесь, что импортировали CSS:
   ```tsx
   import '@3lab/wysiwyg-editor/style.css';
   ```

2. Проверьте версию React (нужна 18+):
   ```bash
   npm list react
   ```

3. Для Next.js добавьте в `next.config.js`:
   ```js
   module.exports = {
     transpilePackages: ['@3lab/wysiwyg-editor']
   };
   ```

4. Откройте issue на GitHub или напишите в поддержку

## 🎉 Готово!

Теперь у вас есть полнофункциональный WYSIWYG редактор с:
- ✅ Подсветкой синтаксиса для 48+ языков
- ✅ Автоопределением кода
- ✅ Темной/светлой темой
- ✅ Мобильной адаптацией
- ✅ Экспортом в PDF
- ✅ И многим другим!

Удачи в разработке! 🚀
