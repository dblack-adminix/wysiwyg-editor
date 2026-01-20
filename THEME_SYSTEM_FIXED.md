# Система тем - Исправлено ✅

## Проблема
CSS переменные не применялись к элементам редактора, несмотря на множество попыток. Причина была в том, что React не позволяет напрямую устанавливать CSS переменные через объект стилей.

## Решение
Используется `useEffect` с `setProperty()` для прямого применения CSS переменных к DOM элементу:

```typescript
const wrapperRef = useRef<HTMLDivElement>(null);

// Apply CSS variables to wrapper element
useEffect(() => {
  if (wrapperRef.current) {
    Object.entries(themeConfig).forEach(([key, value]) => {
      if (value) {
        const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        wrapperRef.current?.style.setProperty(cssVarName, value);
      }
    });
  }
}, [themeConfig]);
```

## Как это работает

### 1. Структура CSS переменных
Все переменные определены в `.wysiwyg-editor-wrapper`:

```css
.wysiwyg-editor-wrapper {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --bg-primary: #ffffff;
  --text-primary: #212529;
  /* и т.д. */
}
```

### 2. Применение темы
Когда компонент монтируется или меняется `customTheme`, переменные применяются:

```typescript
// Пример: пользовательская тема
<WysiwygEditor
  customTheme={{
    primary: '#ff6b6b',
    bgPrimary: '#1a1a2e',
    textPrimary: '#eaeaea',
  }}
/>
```

### 3. Наследование переменных
Все дочерние элементы наследуют переменные от `.wysiwyg-editor-wrapper`:

```css
.wysiwyg-toolbar-btn {
  color: var(--text-secondary);
  background: transparent;
}

.wysiwyg-toolbar-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary);
}
```

## Доступные темы

### 1. Dark (по умолчанию)
```typescript
theme="dark"
```
- Тёмный фон (#1e1e1e)
- Синие кнопки (#0d6efd)
- Светлый текст (#e0e0e0)

### 2. Light
```typescript
theme="light"
```
- Белый фон (#ffffff)
- Синие кнопки (#007bff)
- Тёмный текст (#212529)

### 3. Minimal
```typescript
theme="minimal"
```
- Минималистичный дизайн
- Чёрные кнопки
- Serif шрифт (Georgia)

### 4. Colorful
```typescript
theme="colorful"
```
- Красные кнопки (#ff6b6b)
- Светлый розовый фон (#fff5f5)
- Закруглённые углы (8px)

### 5. Custom
```typescript
theme="dark"
customTheme={{
  primary: '#ff6b6b',
  primaryDark: '#ee5a52',
  primaryLight: '#ffe0e0',
  bgPrimary: '#1a1a2e',
  bgSecondary: '#16213e',
  textPrimary: '#eaeaea',
  textSecondary: '#b0b0b0',
  borderRadius: '4px',
  borderWidth: '1px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '14px',
  shadowSm: '0 1px 2px rgba(0, 0, 0, 0.3)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 10px 15px rgba(0, 0, 0, 0.5)',
}}
```

## Примеры использования

### Пример 1: Красная тема
```typescript
<WysiwygEditor
  theme="dark"
  customTheme={{
    primary: '#ff6b6b',
    primaryDark: '#ee5a52',
    bgPrimary: '#1a1a2e',
    bgSecondary: '#16213e',
    textPrimary: '#eaeaea',
  }}
/>
```

### Пример 2: Зелёная тема
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
  }}
/>
```

### Пример 3: Фиолетовая тема
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
  }}
/>
```

## Доступные переменные

| Переменная | Описание | Пример |
|-----------|---------|--------|
| `primary` | Основной цвет (кнопки, ссылки) | `#6366f1` |
| `primaryDark` | Тёмный вариант основного цвета | `#4f46e5` |
| `primaryLight` | Светлый вариант основного цвета | `#e7f1ff` |
| `bgPrimary` | Основной фон | `#ffffff` |
| `bgSecondary` | Вторичный фон (панели, модали) | `#f8f9fa` |
| `textPrimary` | Основной текст | `#212529` |
| `textSecondary` | Вторичный текст (подсказки) | `#6c757d` |
| `borderRadius` | Радиус скругления углов | `4px` |
| `borderWidth` | Толщина границ | `1px` |
| `fontFamily` | Семейство шрифтов | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` |
| `fontSize` | Размер шрифта | `14px` |
| `shadowSm` | Маленькая тень | `0 1px 2px rgba(0, 0, 0, 0.05)` |
| `shadowMd` | Средняя тень | `0 4px 6px rgba(0, 0, 0, 0.1)` |
| `shadowLg` | Большая тень | `0 10px 15px rgba(0, 0, 0, 0.1)` |

## Как это работает в CSS

### Применение переменных
```css
.wysiwyg-toolbar-btn {
  color: var(--text-secondary);
  background: transparent;
  border: none;
  border-radius: var(--border-radius);
  transition: all 0.2s ease;
}

.wysiwyg-toolbar-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary);
  transform: translateY(-1px);
}

.wysiwyg-toolbar-btn.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}
```

### Наследование
Все дочерние элементы автоматически наследуют переменные:

```css
.wysiwyg-editor-wrapper {
  --primary: #6366f1;
  /* ... другие переменные ... */
}

/* Дочерние элементы используют переменные */
.wysiwyg-toolbar {
  background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
}

.wysiwyg-editor-content {
  color: var(--text-primary);
  background: var(--bg-primary);
}
```

## Тестирование

Откройте демо на `http://localhost:5176/` и прокрутите вниз до раздела "Custom Theme Test (CSS Variables)". Вы должны увидеть редактор с красной темой:

- Кнопки: красные (#ff6b6b)
- Фон: тёмный (#1a1a2e)
- Текст: светлый (#eaeaea)

## Файлы, которые были изменены

1. **src/components/WysiwygEditor.tsx**
   - Добавлен `wrapperRef` для доступа к DOM элементу
   - Добавлен `useEffect` для применения CSS переменных
   - Переменные применяются через `setProperty()`

2. **src/WysiwygEditor.global.css**
   - Переменные перемещены из `:root` в `.wysiwyg-editor-wrapper`
   - Все стили используют CSS переменные

3. **demo/App.tsx**
   - Добавлен тест пользовательской темы

## Почему это работает

1. **Прямое применение к DOM**: `setProperty()` напрямую устанавливает CSS переменные на элемент
2. **Наследование CSS**: Все дочерние элементы наследуют переменные от родителя
3. **Реактивность**: `useEffect` срабатывает при изменении `themeConfig`
4. **Производительность**: Переменные применяются один раз при монтировании и при изменении темы

## Следующие шаги

- ✅ CSS переменные работают
- ✅ Пользовательские темы применяются
- ✅ Наследование работает правильно
- 📝 Можно добавить больше встроенных тем
- 📝 Можно добавить сохранение пользовательской темы в localStorage
