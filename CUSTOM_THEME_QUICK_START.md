# Быстрый старт: Пользовательские темы

## Установка

```bash
npm install wysiwyg-editor-3lab
```

## Базовое использование

### Встроенная тема
```typescript
import { WysiwygEditor } from 'wysiwyg-editor-3lab';

export function MyEditor() {
  return (
    <WysiwygEditor
      theme="dark"
      placeholder="Начните печатать..."
    />
  );
}
```

### Пользовательская тема
```typescript
import { WysiwygEditor } from 'wysiwyg-editor-3lab';

export function MyEditor() {
  return (
    <WysiwygEditor
      theme="dark"
      customTheme={{
        primary: '#ff6b6b',
        primaryDark: '#ee5a52',
        bgPrimary: '#1a1a2e',
        bgSecondary: '#16213e',
        textPrimary: '#eaeaea',
        textSecondary: '#b0b0b0',
      }}
      placeholder="Начните печатать..."
    />
  );
}
```

## Доступные встроенные темы

### 1. Dark (по умолчанию)
```typescript
<WysiwygEditor theme="dark" />
```
- Тёмный фон
- Синие кнопки
- Светлый текст

### 2. Light
```typescript
<WysiwygEditor theme="light" />
```
- Белый фон
- Синие кнопки
- Тёмный текст

### 3. Minimal
```typescript
<WysiwygEditor theme="minimal" />
```
- Минималистичный дизайн
- Чёрные кнопки
- Serif шрифт

### 4. Colorful
```typescript
<WysiwygEditor theme="colorful" />
```
- Красные кнопки
- Светлый розовый фон
- Закруглённые углы

## Примеры пользовательских тем

### Красная тема
```typescript
<WysiwygEditor
  theme="dark"
  customTheme={{
    primary: '#ff6b6b',
    primaryDark: '#ee5a52',
    primaryLight: '#ffe0e0',
    bgPrimary: '#1a1a2e',
    bgSecondary: '#16213e',
    textPrimary: '#eaeaea',
    textSecondary: '#b0b0b0',
  }}
/>
```

### Зелёная тема
```typescript
<WysiwygEditor
  theme="light"
  customTheme={{
    primary: '#10b981',
    primaryDark: '#059669',
    primaryLight: '#d1fae5',
    bgPrimary: '#f0fdf4',
    bgSecondary: '#e6f7f1',
    textPrimary: '#065f46',
    textSecondary: '#047857',
  }}
/>
```

### Фиолетовая тема
```typescript
<WysiwygEditor
  theme="dark"
  customTheme={{
    primary: '#a855f7',
    primaryDark: '#9333ea',
    primaryLight: '#f3e8ff',
    bgPrimary: '#1e1b4b',
    bgSecondary: '#312e81',
    textPrimary: '#e9d5ff',
    textSecondary: '#c4b5fd',
  }}
/>
```

### Оранжевая тема
```typescript
<WysiwygEditor
  theme="light"
  customTheme={{
    primary: '#f97316',
    primaryDark: '#ea580c',
    primaryLight: '#fed7aa',
    bgPrimary: '#fffbeb',
    bgSecondary: '#fef3c7',
    textPrimary: '#92400e',
    textSecondary: '#b45309',
  }}
/>
```

### Голубая тема
```typescript
<WysiwygEditor
  theme="dark"
  customTheme={{
    primary: '#06b6d4',
    primaryDark: '#0891b2',
    primaryLight: '#cffafe',
    bgPrimary: '#0c2d3d',
    bgSecondary: '#164e63',
    textPrimary: '#ecf0f1',
    textSecondary: '#cbd5e1',
  }}
/>
```

## Все доступные переменные

```typescript
customTheme={{
  // Основные цвета
  primary: '#6366f1',           // Основной цвет (кнопки, ссылки)
  primaryDark: '#4f46e5',       // Тёмный вариант
  primaryLight: '#e7f1ff',      // Светлый вариант
  
  // Фоны
  bgPrimary: '#ffffff',         // Основной фон
  bgSecondary: '#f8f9fa',       // Вторичный фон
  
  // Текст
  textPrimary: '#212529',       // Основной текст
  textSecondary: '#6c757d',     // Вторичный текст
  
  // Стили
  borderRadius: '4px',          // Радиус скругления
  borderWidth: '1px',           // Толщина границ
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',             // Размер шрифта
  
  // Тени
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px rgba(0, 0, 0, 0.1)',
}}
```

## Использование с состоянием

```typescript
import { useState } from 'react';
import { WysiwygEditor } from 'wysiwyg-editor-3lab';

export function MyEditor() {
  const [theme, setTheme] = useState('dark');
  
  const themes = {
    dark: {
      primary: '#0d6efd',
      bgPrimary: '#1e1e1e',
      textPrimary: '#e0e0e0',
    },
    light: {
      primary: '#007bff',
      bgPrimary: '#ffffff',
      textPrimary: '#212529',
    },
    red: {
      primary: '#ff6b6b',
      bgPrimary: '#1a1a2e',
      textPrimary: '#eaeaea',
    },
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setTheme('dark')}>Dark</button>
        <button onClick={() => setTheme('light')}>Light</button>
        <button onClick={() => setTheme('red')}>Red</button>
      </div>
      
      <WysiwygEditor
        theme="dark"
        customTheme={themes[theme]}
      />
    </div>
  );
}
```

## Сохранение темы в localStorage

```typescript
import { useState, useEffect } from 'react';
import { WysiwygEditor } from 'wysiwyg-editor-3lab';

export function MyEditor() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('editor-theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('editor-theme', theme);
  }, [theme]);

  const themes = {
    dark: { primary: '#0d6efd', bgPrimary: '#1e1e1e', textPrimary: '#e0e0e0' },
    light: { primary: '#007bff', bgPrimary: '#ffffff', textPrimary: '#212529' },
    red: { primary: '#ff6b6b', bgPrimary: '#1a1a2e', textPrimary: '#eaeaea' },
  };

  return (
    <WysiwygEditor
      theme="dark"
      customTheme={themes[theme]}
    />
  );
}
```

## Интеграция с системой дизайна

```typescript
// theme.ts
export const editorTheme = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  primaryLight: '#e7f1ff',
  bgPrimary: '#ffffff',
  bgSecondary: '#f8f9fa',
  textPrimary: '#212529',
  textSecondary: '#6c757d',
};

// MyEditor.tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import { editorTheme } from './theme';

export function MyEditor() {
  return (
    <WysiwygEditor
      theme="light"
      customTheme={editorTheme}
    />
  );
}
```

## Адаптивные темы

```typescript
import { useMediaQuery } from 'react-responsive';
import { WysiwygEditor } from 'wysiwyg-editor-3lab';

export function MyEditor() {
  const isDark = useMediaQuery({ query: '(prefers-color-scheme: dark)' });

  return (
    <WysiwygEditor
      theme={isDark ? 'dark' : 'light'}
      customTheme={isDark ? {
        primary: '#0d6efd',
        bgPrimary: '#1e1e1e',
        textPrimary: '#e0e0e0',
      } : {
        primary: '#007bff',
        bgPrimary: '#ffffff',
        textPrimary: '#212529',
      }}
    />
  );
}
```

## Проверка в браузере

1. Откройте `http://localhost:5176/`
2. Прокрутите вниз до раздела "Custom Theme Test (CSS Variables)"
3. Вы должны увидеть редактор с красной темой

## Тестирование в DevTools

```javascript
// Откройте консоль браузера (F12)
const editor = document.querySelector('.wysiwyg-editor-wrapper');
const style = getComputedStyle(editor);

// Проверьте переменные
console.log('Primary:', style.getPropertyValue('--primary'));
console.log('Background:', style.getPropertyValue('--bg-primary'));
console.log('Text:', style.getPropertyValue('--text-primary'));
```

## Советы и трюки

### 1. Использование CSS переменных в других элементах
```css
.my-element {
  color: var(--text-primary);
  background: var(--bg-primary);
  border-color: var(--primary);
}
```

### 2. Динамическое изменение темы
```typescript
const editor = document.querySelector('.wysiwyg-editor-wrapper');
editor.style.setProperty('--primary', '#ff6b6b');
```

### 3. Комбинирование тем
```typescript
const baseTheme = themes.dark;
const customTheme = {
  ...baseTheme,
  primary: '#ff6b6b', // Переопределить только основной цвет
};
```

## Часто задаваемые вопросы

**Q: Как изменить только один цвет?**
A: Передайте только нужные переменные в `customTheme`:
```typescript
<WysiwygEditor
  theme="dark"
  customTheme={{ primary: '#ff6b6b' }}
/>
```

**Q: Как вернуться к встроенной теме?**
A: Просто не передавайте `customTheme`:
```typescript
<WysiwygEditor theme="dark" />
```

**Q: Как сделать тему, которая соответствует моему сайту?**
A: Используйте цвета вашего сайта:
```typescript
<WysiwygEditor
  theme="light"
  customTheme={{
    primary: '#your-brand-color',
    bgPrimary: '#your-bg-color',
    textPrimary: '#your-text-color',
  }}
/>
```

## Дополнительные ресурсы

- [THEME_SYSTEM_FIXED.md](./THEME_SYSTEM_FIXED.md) - Подробное описание системы тем
- [TEST_CSS_VARIABLES.md](./TEST_CSS_VARIABLES.md) - Инструкции по тестированию
- [CSS_VARIABLES_FIXED_REPORT.md](./CSS_VARIABLES_FIXED_REPORT.md) - Технический отчёт
