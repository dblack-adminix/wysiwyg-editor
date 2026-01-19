# NPM Package Publication Guide

## 📦 Подготовка к публикации

Этот документ описывает шаги для публикации WYSIWYG редактора как npm пакета.

## 🎯 Текущее состояние

### ✅ Что уже готово:
- Headless архитектура (core + components)
- TypeScript с полной типизацией
- Vite конфигурация для library mode
- Экспорты в src/index.ts
- Базовая документация в README.md
- package.json с основными полями

### 🔧 Что нужно доработать:
1. Обновить package.json (exports, repository, author)
2. Проверить сборку и TypeScript declarations
3. Дополнить документацию примерами интеграции
4. Создать CHANGELOG.md
5. Протестировать в отдельном проекте
6. Опубликовать в npm

## 📋 Пошаговая инструкция

### Шаг 1: Обновление package.json

```json
{
  "name": "@your-org/wysiwyg-editor",
  "version": "1.0.0",
  "description": "Professional WYSIWYG editor for React with headless architecture and Shiki syntax highlighting",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/wysiwyg-editor.git"
  },
  "bugs": {
    "url": "https://github.com/your-org/wysiwyg-editor/issues"
  },
  "homepage": "https://github.com/your-org/wysiwyg-editor#readme",
  "keywords": [
    "wysiwyg",
    "editor",
    "react",
    "contenteditable",
    "rich-text",
    "markdown",
    "headless",
    "typescript",
    "shiki",
    "syntax-highlighting",
    "code-editor"
  ],
  "main": "./dist/index.js",
  "module": "./dist/index.esm.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./style.css": "./dist/style.css"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "sideEffects": [
    "*.css"
  ]
}
```

**Что изменить:**
- `@your-org/wysiwyg-editor` → ваше имя пакета
- `author` → ваше имя и email
- `repository` → ваш GitHub репозиторий
- Добавить поле `exports` для современного module resolution
- Добавить `sideEffects` для tree-shaking

### Шаг 2: Проверка Vite конфигурации

Текущая конфигурация уже настроена для library mode:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WysiwygEditor',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

**Что проверить:**
- ✅ Entry point: `src/index.ts`
- ✅ External: React и ReactDOM не включены в bundle
- ✅ Output formats: ESM и UMD

**Что добавить для CSS:**

```typescript
build: {
  lib: { /* ... */ },
  rollupOptions: {
    external: ['react', 'react-dom'],
    output: {
      globals: { /* ... */ },
      assetFileNames: (assetInfo) => {
        if (assetInfo.name === 'style.css') return 'style.css';
        return assetInfo.name;
      }
    }
  },
  cssCodeSplit: false
}
```

### Шаг 3: Генерация TypeScript declarations

Обновите `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Declaration */
    "declaration": true,
    "declarationDir": "./dist",
    "emitDeclarationOnly": true,
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "demo", "**/*.test.ts", "**/*.test.tsx"]
}
```

**Важно:**
- `declaration: true` — генерировать .d.ts файлы
- `declarationDir: "./dist"` — куда складывать типы
- `exclude` — исключить тесты и demo

### Шаг 4: Создание LICENSE файла

```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Шаг 5: Создание CHANGELOG.md

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-19

### Added
- Initial release
- Headless architecture with EditorCore
- React components (WysiwygEditor, Toolbar, Modals)
- useWysiwygEditor hook
- Shiki syntax highlighting for 48+ languages
- Automatic code detection on paste
- Image upload support (URL and file)
- Video embed support (YouTube, Vimeo)
- Table insertion
- Find and replace
- Print and PDF export
- Dark/light theme support
- Mobile responsive design
- Autosave functionality
- Full TypeScript support
- Comprehensive documentation

### Features
- Bold, italic, underline, strikethrough formatting
- Headings (H1-H6), paragraphs, blockquotes
- Ordered and unordered lists
- Text alignment (left, center, right, justify)
- Text and background colors
- Font family and size selection
- Link insertion
- Image insertion (URL and upload)
- Video embedding (YouTube, Vimeo)
- Table creation
- Code blocks with syntax highlighting
- Emoji picker
- Find and replace
- Undo/redo
- Fullscreen mode
- Preview panel
- HTML source view
- Word/character/paragraph count
- Export to HTML, text, PDF
- Copy HTML to clipboard
- Print functionality

### Supported Languages for Code Highlighting
- Web: HTML, CSS, JavaScript, TypeScript, JSX, TSX, JSON, Markdown
- Backend: Python, Go, PHP, Ruby, Java, C#, C++, C, Rust
- DevOps: YAML, TOML, Dockerfile, Nginx, Terraform, Kubernetes
- Databases: SQL, PostgreSQL, MySQL
- Shell: Bash, PowerShell, CMD
- And 30+ more languages

[1.0.0]: https://github.com/your-org/wysiwyg-editor/releases/tag/v1.0.0
```

### Шаг 6: Дополнение README примерами интеграции

Добавьте в README.md раздел с примерами для разных фреймворков:

```markdown
## 🚀 Интеграция с фреймворками

### Next.js (App Router)

```tsx
// app/editor/page.tsx
'use client';

import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

export default function EditorPage() {
  const [content, setContent] = useState('');

  return (
    <div>
      <h1>My Editor</h1>
      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
      />
    </div>
  );
}
```

### Next.js (Pages Router)

```tsx
// pages/editor.tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

export default function EditorPage() {
  const [content, setContent] = useState('');

  return (
    <div>
      <h1>My Editor</h1>
      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
      />
    </div>
  );
}
```

### Vite + React

```tsx
// src/App.tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('');

  return (
    <div className="App">
      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
      />
    </div>
  );
}

export default App;
```

### Create React App

```tsx
// src/App.js
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('');

  return (
    <div className="App">
      <WysiwygEditor
        value={content}
        onChange={(html) => setContent(html)}
      />
    </div>
  );
}

export default App;
```

### SSR Considerations

Редактор использует `contentEditable` и требует DOM, поэтому для SSR:

```tsx
// Next.js dynamic import
import dynamic from 'next/dynamic';

const WysiwygEditor = dynamic(
  () => import('@your-org/wysiwyg-editor').then(mod => mod.WysiwygEditor),
  { ssr: false }
);

export default function Page() {
  return <WysiwygEditor />;
}
```
```

### Шаг 7: Сборка пакета

```bash
# Очистить предыдущую сборку
rm -rf dist

# Собрать пакет
npm run build

# Проверить содержимое dist/
ls -la dist/
```

**Ожидаемые файлы в dist/:**
- `index.js` — CommonJS bundle
- `index.esm.js` — ES Module bundle
- `index.d.ts` — TypeScript declarations
- `style.css` — Bundled CSS
- `*.map` — Source maps

### Шаг 8: Тестирование в отдельном проекте

Создайте тестовый проект:

```bash
# Создать новый React проект
npm create vite@latest test-editor -- --template react-ts
cd test-editor

# Установить ваш пакет локально
npm install ../path/to/wysiwyg-editor

# Или использовать npm link
cd ../wysiwyg-editor
npm link
cd ../test-editor
npm link @your-org/wysiwyg-editor
```

Протестируйте в `test-editor/src/App.tsx`:

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('<p>Hello World!</p>');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Editor</h1>
      <WysiwygEditor
        value={content}
        onChange={(html, meta) => {
          setContent(html);
          console.log('Words:', meta.wordCount);
        }}
      />
    </div>
  );
}

export default App;
```

**Проверьте:**
- ✅ Редактор отображается
- ✅ Стили применяются
- ✅ TypeScript автодополнение работает
- ✅ Все функции работают
- ✅ Нет ошибок в консоли

### Шаг 9: Dry-run публикации

```bash
# Проверить, что будет опубликовано
npm pack --dry-run

# Создать .tgz файл для проверки
npm pack

# Проверить размер пакета
ls -lh *.tgz

# Распаковать и проверить содержимое
tar -xzf your-org-wysiwyg-editor-1.0.0.tgz
ls -la package/
```

**Проверьте:**
- Размер пакета разумный (<500KB)
- Включены только нужные файлы (dist/, README.md, LICENSE)
- Не включены исходники (src/), тесты, demo

### Шаг 10: Публикация в npm

```bash
# Войти в npm (если еще не вошли)
npm login

# Проверить, что вы вошли
npm whoami

# Опубликовать пакет
npm publish --access public

# Для scoped пакетов (@your-org/...)
npm publish --access public
```

**После публикации:**
1. Проверьте страницу пакета: https://www.npmjs.com/package/@your-org/wysiwyg-editor
2. Установите из npm: `npm install @your-org/wysiwyg-editor`
3. Создайте git tag: `git tag v1.0.0 && git push --tags`
4. Создайте GitHub Release

### Шаг 11: Обновление документации

После публикации обновите README.md:

```markdown
## 📦 Установка

```bash
npm install @your-org/wysiwyg-editor
```

## 📊 Статистика

![npm version](https://img.shields.io/npm/v/@your-org/wysiwyg-editor)
![npm downloads](https://img.shields.io/npm/dm/@your-org/wysiwyg-editor)
![bundle size](https://img.shields.io/bundlephobia/minzip/@your-org/wysiwyg-editor)
![license](https://img.shields.io/npm/l/@your-org/wysiwyg-editor)
```

## 🔄 Обновление пакета

Для публикации новой версии:

```bash
# 1. Внести изменения в код
# 2. Обновить CHANGELOG.md
# 3. Обновить версию
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 4. Собрать
npm run build

# 5. Опубликовать
npm publish

# 6. Создать git tag
git push --tags
```

## 📝 Чеклист перед публикацией

- [ ] package.json обновлен (name, author, repository)
- [ ] LICENSE файл создан
- [ ] CHANGELOG.md создан
- [ ] README.md дополнен примерами
- [ ] Сборка проходит без ошибок (`npm run build`)
- [ ] Тесты проходят (`npm test`)
- [ ] TypeScript компилируется (`tsc --noEmit`)
- [ ] Пакет протестирован в отдельном проекте
- [ ] Размер пакета разумный (<500KB)
- [ ] Все экспорты работают
- [ ] CSS импортируется корректно
- [ ] TypeScript типы доступны
- [ ] Документация полная и понятная
- [ ] Git репозиторий чистый (нет uncommitted changes)
- [ ] Версия обновлена
- [ ] npm login выполнен

## 🎉 Готово!

После публикации ваш пакет будет доступен для установки:

```bash
npm install @your-org/wysiwyg-editor
```

И использования:

```tsx
import { WysiwygEditor } from '@your-org/wysiwyg-editor';
import '@your-org/wysiwyg-editor/style.css';

<WysiwygEditor placeholder="Start typing..." />
```

## 📚 Дополнительные ресурсы

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
