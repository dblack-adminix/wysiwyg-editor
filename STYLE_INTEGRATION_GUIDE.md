# 🎨 Руководство по интеграции стилей редактора

## Обзор

Редактор теперь полностью гибкий и может приспосабливаться к любому стилю вашего сайта благодаря:
- CSS переменным
- Встроенным темам
- Пользовательским цветам
- Пользовательским классам и стилям

## 1️⃣ Способ 1: Встроенные темы

### Светлая тема (Light)

```tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import 'wysiwyg-editor-3lab/style.css';

export function MyEditor() {
  return (
    <WysiwygEditor
      themeName="light"
      onChange={(html) => console.log(html)}
    />
  );
}
```

**Результат:** Редактор автоматически использует светлую тему с белым фоном и темным текстом.

### Темная тема (Dark)

```tsx
<WysiwygEditor
  themeName="dark"
  onChange={(html) => console.log(html)}
/>
```

**Результат:** Редактор использует темную тему с темным фоном и светлым текстом.

### Минималистичная тема (Minimal)

```tsx
<WysiwygEditor
  themeName="minimal"
  onChange={(html) => console.log(html)}
/>
```

**Результат:** Редактор использует минималистичный дизайн без теней и с серифным шрифтом.

### Яркая тема (Colorful)

```tsx
<WysiwygEditor
  themeName="colorful"
  onChange={(html) => console.log(html)}
/>
```

**Результат:** Редактор использует яркую тему с красными акцентами и закругленными углами.

---

## 2️⃣ Способ 2: Пользовательские цвета

### Адаптация к цветам вашего сайта

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#007bff',           // Основной цвет вашего сайта
    primaryDark: '#0056b3',       // Темнее
    primaryLight: '#e7f1ff',      // Светлее
    bgPrimary: '#ffffff',         // Основной фон
    bgSecondary: '#f8f9fa',       // Вторичный фон
    textPrimary: '#212529',       // Основной текст
    textSecondary: '#6c757d',     // Вторичный текст
    borderRadius: '4px',          // Скругление углов
    borderWidth: '1px',           // Толщина границ
    fontFamily: 'Arial, sans-serif', // Шрифт
    fontSize: '14px',             // Размер шрифта
    shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  }}
/>
```

### Пример: Интеграция с Bootstrap

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#0d6efd',           // Bootstrap primary
    bgPrimary: '#ffffff',
    textPrimary: '#212529',
    borderRadius: '0.375rem',     // Bootstrap border-radius
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }}
/>
```

### Пример: Интеграция с Material Design

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#1976d2',           // Material primary
    bgPrimary: '#ffffff',
    textPrimary: '#212121',
    borderRadius: '4px',          // Material border-radius
    fontFamily: '"Roboto", sans-serif',
    shadowMd: '0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12)',
  }}
/>
```

### Пример: Интеграция с Tailwind CSS

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#3b82f6',           // Tailwind blue-500
    bgPrimary: '#ffffff',
    textPrimary: '#1f2937',       // Tailwind gray-900
    borderRadius: '0.5rem',       // Tailwind rounded-lg
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }}
/>
```

---

## 3️⃣ Способ 3: CSS переменные (глобальные)

### Установка CSS переменных на уровне сайта

```css
/* В вашем главном CSS файле */
:root {
  /* Цвета */
  --primary: #007bff;
  --primary-dark: #0056b3;
  --primary-light: #e7f1ff;
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  
  /* Стили */
  --border-radius: 4px;
  --border-width: 1px;
  --font-family: Arial, sans-serif;
  --font-size: 14px;
  
  /* Тени */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### Использование в редакторе

```tsx
<WysiwygEditor
  themeName="custom"
  // Редактор автоматически использует CSS переменные из :root
/>
```

---

## 4️⃣ Способ 4: Пользовательские классы и стили

### С пользовательским классом

```tsx
<WysiwygEditor
  customClassName="my-custom-editor"
  onChange={(html) => console.log(html)}
/>
```

```css
/* В вашем CSS файле */
.my-custom-editor {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 900px;
}
```

### С встроенными стилями

```tsx
<WysiwygEditor
  customStyles={{
    maxWidth: '900px',
    margin: '0 auto',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  }}
/>
```

### Комбинирование

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#ff6b6b',
    bgPrimary: '#fff5f5',
  }}
  customClassName="my-editor"
  customStyles={{
    maxWidth: '900px',
    margin: '20px auto',
  }}
/>
```

---

## 5️⃣ Способ 5: Адаптивный дизайн

### Адаптация к размеру экрана

```tsx
import { useState, useEffect } from 'react';

export function ResponsiveEditor() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <WysiwygEditor
      themeName={isMobile ? 'light' : 'dark'}
      previewPosition={isMobile ? 'bottom' : 'right'}
      previewHeight={isMobile ? '300px' : undefined}
      mobileOptimized={true}
    />
  );
}
```

### Адаптация к темной/светлой теме системы

```tsx
import { useEffect, useState } from 'react';

export function SystemThemeEditor() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    darkModeQuery.addEventListener('change', handleChange);
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <WysiwygEditor
      themeName={isDark ? 'dark' : 'light'}
    />
  );
}
```

---

## 6️⃣ Примеры интеграции с популярными фреймворками

### Next.js

```tsx
// app/editor/page.tsx
'use client';

import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import 'wysiwyg-editor-3lab/style.css';

export default function EditorPage() {
  return (
    <WysiwygEditor
      themeName="light"
      customClassName="max-w-4xl mx-auto"
    />
  );
}
```

### Nuxt 3

```vue
<!-- pages/editor.vue -->
<template>
  <div class="container">
    <WysiwygEditor
      theme-name="light"
      custom-class-name="max-w-4xl mx-auto"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import 'wysiwyg-editor-3lab/style.css';

const handleChange = (html) => {
  console.log('Content changed:', html);
};
</script>
```

### Svelte

```svelte
<!-- Editor.svelte -->
<script>
  import { WysiwygEditor } from 'wysiwyg-editor-3lab';
  import 'wysiwyg-editor-3lab/style.css';

  let content = '';

  function handleChange(event) {
    content = event.detail.html;
  }
</script>

<WysiwygEditor
  themeName="light"
  customClassName="max-w-4xl mx-auto"
  on:change={handleChange}
/>

<style>
  :global(.my-editor) {
    border-radius: 12px;
  }
</style>
```

---

## 7️⃣ Примеры для разных типов сайтов

### Блог

```tsx
<WysiwygEditor
  themeName="light"
  customTheme={{
    primary: '#2563eb',
    fontFamily: '"Georgia", serif',
    fontSize: '16px',
  }}
  customStyles={{
    maxWidth: '800px',
    margin: '0 auto',
  }}
  enablePreviewPanel={true}
  previewPosition="right"
/>
```

### E-commerce

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#ff6b35',           // Оранжевый
    bgPrimary: '#ffffff',
    textPrimary: '#1a1a1a',
    borderRadius: '8px',
  }}
  customStyles={{
    maxWidth: '600px',
  }}
  enablePreviewPanel={false}
/>
```

### CMS админ-панель

```tsx
<WysiwygEditor
  themeName="dark"
  customTheme={{
    primary: '#6366f1',
    bgPrimary: '#1f2937',
    textPrimary: '#f3f4f6',
  }}
  enablePreviewPanel={true}
  enableSourceTab={true}
  enableFindReplace={true}
/>
```

### Документация

```tsx
<WysiwygEditor
  themeName="light"
  customTheme={{
    primary: '#0ea5e9',
    fontFamily: '"Fira Code", monospace',
  }}
  customStyles={{
    maxWidth: '1000px',
  }}
  enablePreviewPanel={true}
  previewPosition="bottom"
/>
```

---

## 8️⃣ Проверка интеграции

### Тест 1: Проверьте, что цвета применяются

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#ff0000',  // Красный - должен быть виден
  }}
/>
```

**Ожидаемый результат:** Кнопки и акценты должны быть красными.

### Тест 2: Проверьте, что шрифт применяется

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    fontFamily: '"Comic Sans MS", cursive',  // Необычный шрифт для теста
  }}
/>
```

**Ожидаемый результат:** Текст должен быть в Comic Sans.

### Тест 3: Проверьте, что стили применяются

```tsx
<WysiwygEditor
  customStyles={{
    border: '5px solid red',  // Красная граница для теста
  }}
/>
```

**Ожидаемый результат:** Редактор должен иметь красную границу.

---

## 9️⃣ Советы по интеграции

### ✅ Делайте так:

1. **Используйте встроенные темы** для быстрого старта
2. **Переопределяйте CSS переменные** для глобальной кастомизации
3. **Комбинируйте методы** для максимальной гибкости
4. **Тестируйте на разных устройствах** для адаптивности
5. **Документируйте** ваши кастомизации

### ❌ Не делайте так:

1. **Не переопределяйте CSS классы** напрямую (используйте переменные)
2. **Не смешивайте** встроенные темы с пользовательскими (выберите один подход)
3. **Не забывайте** импортировать CSS файл редактора
4. **Не используйте** !important в ваших стилях (может конфликтовать)

---

## 🔟 Часто задаваемые вопросы

### Q: Как изменить цвет кнопок?

**A:** Используйте `primary` в `customTheme`:

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#your-color',
  }}
/>
```

### Q: Как изменить шрифт?

**A:** Используйте `fontFamily` в `customTheme`:

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    fontFamily: '"Your Font", sans-serif',
  }}
/>
```

### Q: Как изменить размер редактора?

**A:** Используйте `customStyles`:

```tsx
<WysiwygEditor
  customStyles={{
    maxWidth: '900px',
    minHeight: '500px',
  }}
/>
```

### Q: Как сделать редактор адаптивным?

**A:** Используйте `mobileOptimized` и условные стили:

```tsx
<WysiwygEditor
  mobileOptimized={true}
  previewPosition={isMobile ? 'bottom' : 'right'}
/>
```

### Q: Как интегрировать с Tailwind CSS?

**A:** Используйте `customClassName`:

```tsx
<WysiwygEditor
  customClassName="rounded-lg shadow-lg max-w-4xl mx-auto"
/>
```

---

## 📚 Дополнительные ресурсы

- [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) - Полное руководство по кастомизации
- [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md) - Примеры интеграции
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Быстрая справка
- [README.md](./README.md) - Основная документация

---

## ✨ Итог

Редактор теперь полностью гибкий и может приспосабливаться к любому стилю вашего сайта! Выберите подходящий способ интеграции и наслаждайтесь красивым редактором, который идеально вписывается в ваш дизайн.

**Статус:** ✅ Полностью готово к интеграции в любой проект
