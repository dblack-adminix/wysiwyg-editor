# 🎨 План кастомизации и гибкости дизайна

## 🔴 Выявленные проблемы

### 1. Preview Panel жестко привязан к редактору
**Проблема:**
- Preview панель не отделена от основного редактора
- Нельзя отключить или переместить
- Стили preview жестко закодированы

**Решение:**
- Сделать preview опциональным компонентом
- Позволить отключать через props
- Экспортировать отдельный компонент PreviewPanel
- Позволить встраивать preview в другие места

### 2. Стили дизайна жестко привязаны
**Проблема:**
- CSS переменные не полностью кастомизируемы
- Цвета, размеры, шрифты жестко закодированы
- Сложно адаптировать под дизайн сайта

**Решение:**
- Расширить CSS переменные
- Добавить theme props
- Позволить передавать custom CSS
- Создать систему тем

---

## ✅ План реализации

### Фаза 1: Отделение Preview Panel

#### 1.1 Сделать preview опциональным

**Файл: src/components/WysiwygEditor.tsx**

```tsx
interface WysiwygEditorProps {
  // ... существующие props
  enablePreviewPanel?: boolean;        // ✅ Добавить
  previewPosition?: 'right' | 'bottom' | 'none'; // ✅ Добавить
  previewWidth?: string | number;      // ✅ Добавить
  previewHeight?: string | number;     // ✅ Добавить
}
```

#### 1.2 Экспортировать PreviewPanel отдельно

**Файл: src/index.ts**

```tsx
export { PreviewPanel } from './components/PreviewPanel';
export type { PreviewPanelProps } from './components/PreviewPanel';
```

**Использование:**
```tsx
import { WysiwygEditor, PreviewPanel } from 'wysiwyg-editor-3lab';

function App() {
  const [html, setHtml] = useState('');
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <WysiwygEditor 
        value={html}
        onChange={setHtml}
        enablePreviewPanel={false}  // Отключить встроенный preview
      />
      <PreviewPanel html={html} />  {/* Использовать отдельно */}
    </div>
  );
}
```

#### 1.3 Позволить встраивать preview в custom layout

```tsx
import { useWysiwygEditor } from 'wysiwyg-editor-3lab';

function CustomLayout() {
  const { editorRef, controller, getHTML } = useWysiwygEditor();
  const [html, setHtml] = useState('');
  
  return (
    <div className="my-custom-layout">
      <aside className="sidebar">
        {/* Мой sidebar */}
      </aside>
      
      <main className="editor-area">
        <div ref={editorRef} contentEditable />
      </main>
      
      <section className="my-preview">
        <PreviewPanel html={html} />
      </section>
    </div>
  );
}
```

---

### Фаза 2: Гибкая система стилей

#### 2.1 Расширить CSS переменные

**Файл: src/WysiwygEditor.module.css**

```css
:root {
  /* Основные цвета */
  --primary: #007bff;
  --primary-dark: #0056b3;
  --primary-light: #e7f1ff;
  
  /* Фон и текст */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #212529;
  --text-secondary: #6c757d;
  
  /* Темная тема */
  --dark-bg-primary: #1e1e1e;
  --dark-bg-secondary: #2d2d2d;
  --dark-text-primary: #e0e0e0;
  --dark-text-secondary: #a0a0a0;
  
  /* Размеры */
  --border-radius: 4px;
  --border-width: 1px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  
  /* Шрифты */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  
  /* Тени */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

#### 2.2 Добавить theme prop

**Файл: src/components/WysiwygEditor.tsx**

```tsx
interface WysiwygEditorProps {
  // ... существующие props
  theme?: 'light' | 'dark' | 'auto' | 'custom';
  customTheme?: {
    primary?: string;
    primaryDark?: string;
    bgPrimary?: string;
    bgSecondary?: string;
    textPrimary?: string;
    textSecondary?: string;
    borderRadius?: string;
    fontFamily?: string;
    fontSize?: string;
  };
  customClassName?: string;
  customStyles?: CSSProperties;
}
```

#### 2.3 Позволить переопределять CSS переменные

```tsx
function App() {
  return (
    <WysiwygEditor
      theme="custom"
      customTheme={{
        primary: '#ff6b6b',
        bgPrimary: '#f5f5f5',
        textPrimary: '#333333',
        fontFamily: 'Inter, sans-serif',
      }}
      customClassName="my-editor-theme"
      customStyles={{
        maxWidth: '900px',
        margin: '0 auto',
      }}
    />
  );
}
```

#### 2.4 Создать систему тем

**Файл: src/themes/index.ts**

```tsx
export const themes = {
  light: {
    primary: '#007bff',
    bgPrimary: '#ffffff',
    textPrimary: '#212529',
  },
  dark: {
    primary: '#0d6efd',
    bgPrimary: '#1e1e1e',
    textPrimary: '#e0e0e0',
  },
  minimal: {
    primary: '#000000',
    bgPrimary: '#ffffff',
    textPrimary: '#000000',
  },
  colorful: {
    primary: '#ff6b6b',
    bgPrimary: '#fff5f5',
    textPrimary: '#2d3748',
  },
};

export type ThemeName = keyof typeof themes;
```

---

### Фаза 3: Компонентная гибкость

#### 3.1 Сделать компоненты опциональными

```tsx
interface WysiwygEditorProps {
  // Видимость компонентов
  showToolbar?: boolean;
  showStatusBar?: boolean;
  showPreviewPanel?: boolean;
  showFindReplace?: boolean;
  
  // Позиции компонентов
  toolbarPosition?: 'top' | 'bottom' | 'floating';
  statusBarPosition?: 'top' | 'bottom';
}
```

#### 3.2 Позволить кастомные компоненты

```tsx
interface WysiwygEditorProps {
  customToolbar?: React.ComponentType<ToolbarProps>;
  customStatusBar?: React.ComponentType<StatusBarProps>;
  customPreviewPanel?: React.ComponentType<PreviewPanelProps>;
}
```

#### 3.3 Пример использования

```tsx
function CustomToolbar(props: ToolbarProps) {
  return (
    <div className="my-custom-toolbar">
      {/* Мой дизайн toolbar */}
    </div>
  );
}

function App() {
  return (
    <WysiwygEditor
      customToolbar={CustomToolbar}
      showStatusBar={false}
      showPreviewPanel={false}
    />
  );
}
```

---

### Фаза 4: CSS-in-JS поддержка

#### 4.1 Поддержка styled-components

```tsx
import styled from 'styled-components';
import { WysiwygEditor } from 'wysiwyg-editor-3lab';

const StyledEditor = styled(WysiwygEditor)`
  .editor-toolbar {
    background: ${props => props.theme.primary};
  }
  
  .editor-content {
    font-family: ${props => props.theme.fontFamily};
  }
`;

function App() {
  return <StyledEditor />;
}
```

#### 4.2 Поддержка Tailwind CSS

```tsx
<WysiwygEditor
  customClassName="
    rounded-lg 
    border-2 
    border-gray-300 
    shadow-lg
    dark:bg-gray-900
    dark:text-white
  "
/>
```

---

## 📋 Реализация по приоритетам

### v1.1.0 (High Priority)
- [ ] Сделать preview опциональным
- [ ] Экспортировать PreviewPanel отдельно
- [ ] Расширить CSS переменные
- [ ] Добавить theme prop
- [ ] Позволить customClassName и customStyles

### v1.2.0 (Medium Priority)
- [ ] Система тем (light, dark, minimal, colorful)
- [ ] Сделать компоненты опциональные
- [ ] Позволить кастомные компоненты
- [ ] Документация по кастомизации

### v1.3.0 (Low Priority)
- [ ] CSS-in-JS поддержка
- [ ] Tailwind CSS примеры
- [ ] Конструктор тем (UI)
- [ ] Экспорт/импорт тем

---

## 🔧 Технические детали

### Структура CSS модулей

```
src/
├── styles/
│   ├── variables.css      # CSS переменные
│   ├── themes/
│   │   ├── light.css
│   │   ├── dark.css
│   │   ├── minimal.css
│   │   └── colorful.css
│   └── components/
│       ├── toolbar.css
│       ├── preview.css
│       └── editor.css
└── components/
    └── WysiwygEditor.tsx
```

### Props для кастомизации

```tsx
interface CustomizationProps {
  // Видимость
  enablePreviewPanel?: boolean;
  enableToolbar?: boolean;
  enableStatusBar?: boolean;
  
  // Позиции
  previewPosition?: 'right' | 'bottom' | 'none';
  toolbarPosition?: 'top' | 'bottom';
  
  // Размеры
  previewWidth?: string | number;
  previewHeight?: string | number;
  
  // Стили
  theme?: 'light' | 'dark' | 'auto' | 'custom';
  customTheme?: ThemeConfig;
  customClassName?: string;
  customStyles?: CSSProperties;
  
  // Компоненты
  customToolbar?: React.ComponentType;
  customStatusBar?: React.ComponentType;
  customPreviewPanel?: React.ComponentType;
}
```

---

## 📚 Документация

### Для пользователей

**CUSTOMIZATION_GUIDE.md**
- Как отключить preview
- Как использовать preview отдельно
- Как менять цвета
- Как использовать свои темы
- Примеры интеграции

### Для разработчиков

**CUSTOMIZATION_API.md**
- API для кастомизации
- Props reference
- CSS переменные
- Примеры кода

---

## 🎯 Примеры использования

### Пример 1: Минимальный редактор

```tsx
<WysiwygEditor
  enablePreviewPanel={false}
  showStatusBar={false}
  showFindReplace={false}
/>
```

### Пример 2: Встроенный в сайт

```tsx
<WysiwygEditor
  theme="custom"
  customTheme={{
    primary: '#2563eb',
    bgPrimary: '#f3f4f6',
  }}
  customClassName="site-editor"
  enablePreviewPanel={false}
/>
```

### Пример 3: Полнофункциональный

```tsx
<WysiwygEditor
  theme="dark"
  enablePreviewPanel={true}
  previewPosition="right"
  showToolbar={true}
  showStatusBar={true}
/>
```

### Пример 4: Custom layout

```tsx
function CustomApp() {
  const [html, setHtml] = useState('');
  
  return (
    <div className="custom-layout">
      <header>Мой редактор</header>
      
      <div className="editor-wrapper">
        <WysiwygEditor
          value={html}
          onChange={setHtml}
          enablePreviewPanel={false}
          customClassName="my-editor"
        />
        
        <aside className="my-sidebar">
          <PreviewPanel html={html} />
        </aside>
      </div>
      
      <footer>Статистика: {html.length} символов</footer>
    </div>
  );
}
```

---

## ✅ Чеклист реализации

### Фаза 1: Preview Panel
- [ ] Сделать preview опциональным
- [ ] Добавить previewPosition prop
- [ ] Экспортировать PreviewPanel
- [ ] Написать примеры
- [ ] Обновить документацию

### Фаза 2: CSS переменные
- [ ] Расширить переменные
- [ ] Добавить theme prop
- [ ] Добавить customTheme prop
- [ ] Добавить customClassName prop
- [ ] Добавить customStyles prop

### Фаза 3: Компоненты
- [ ] Сделать компоненты опциональные
- [ ] Позволить кастомные компоненты
- [ ] Написать примеры
- [ ] Обновить документацию

### Фаза 4: Тестирование
- [ ] Тесты для кастомизации
- [ ] Примеры для разных сайтов
- [ ] Проверка производительности
- [ ] Проверка совместимости

---

## 🚀 Следующие шаги

1. **Создать issue на GitHub** с описанием проблем
2. **Создать ветку** `feature/customization`
3. **Реализовать Фазу 1** (Preview Panel)
4. **Создать PR** с примерами
5. **Собрать обратную связь**
6. **Реализовать остальные фазы**

---

*Этот план решит проблемы с жесткой привязкой и позволит использовать редактор на любых сайтах!*
