# Тестирование CSS переменных

## Как проверить, что CSS переменные работают

### 1. Откройте DevTools браузера
- Нажмите `F12` или `Ctrl+Shift+I`
- Перейдите на вкладку "Elements" (Элементы)

### 2. Найдите элемент `.wysiwyg-editor-wrapper`
- Нажмите на иконку "Select element" (стрелка в левом верхнем углу)
- Кликните на редактор
- Вы должны увидеть элемент с классом `wysiwyg-editor-wrapper`

### 3. Проверьте CSS переменные
В панели "Styles" (Стили) вы должны увидеть:

```css
.wysiwyg-editor-wrapper {
  --primary: #ff6b6b;
  --primary-dark: #ee5a52;
  --primary-light: #ffe0e0;
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --text-primary: #eaeaea;
  --text-secondary: #b0b0b0;
  /* ... и другие переменные ... */
}
```

### 4. Проверьте в консоли
Откройте консоль (вкладка "Console") и выполните:

```javascript
// Получить элемент редактора
const editor = document.querySelector('.wysiwyg-editor-wrapper');

// Получить все CSS переменные
const styles = getComputedStyle(editor);
console.log('Primary color:', styles.getPropertyValue('--primary'));
console.log('Background:', styles.getPropertyValue('--bg-primary'));
console.log('Text color:', styles.getPropertyValue('--text-primary'));

// Или получить все переменные сразу
const allVars = {};
for (let i = 0; i < styles.length; i++) {
  const prop = styles[i];
  if (prop.startsWith('--')) {
    allVars[prop] = styles.getPropertyValue(prop);
  }
}
console.table(allVars);
```

### 5. Проверьте, что цвета применяются
- Кнопки должны быть красными (#ff6b6b)
- Фон должен быть тёмным (#1a1a2e)
- Текст должен быть светлым (#eaeaea)

## Ожидаемый результат

Если всё работает правильно, вы должны увидеть:

```
Primary color: #ff6b6b
Background: #1a1a2e
Text color: #eaeaea
```

И редактор должен выглядеть так:
- Кнопки в панели инструментов: красные
- Фон редактора: тёмный
- Текст: светлый

## Если что-то не работает

### Проблема: Переменные не видны в DevTools
**Решение**: 
1. Очистите кэш браузера (Ctrl+Shift+Delete)
2. Перезагрузите страницу (Ctrl+F5)
3. Проверьте консоль на ошибки

### Проблема: Цвета не меняются
**Решение**:
1. Проверьте, что `customTheme` передан правильно
2. Откройте консоль и выполните:
   ```javascript
   const editor = document.querySelector('.wysiwyg-editor-wrapper');
   console.log(editor.style.cssText);
   ```
3. Вы должны увидеть CSS переменные в `cssText`

### Проблема: Переменные есть, но не применяются к элементам
**Решение**:
1. Проверьте, что CSS использует `var(--primary)` и т.д.
2. Откройте файл `src/WysiwygEditor.global.css`
3. Убедитесь, что все стили используют переменные

## Тестовые сценарии

### Сценарий 1: Красная тема
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

**Ожидается**:
- Кнопки красные
- Фон тёмный
- Текст светлый

### Сценарий 2: Зелёная тема
```typescript
<WysiwygEditor
  theme="light"
  customTheme={{
    primary: '#10b981',
    primaryDark: '#059669',
    bgPrimary: '#f0fdf4',
    textPrimary: '#065f46',
  }}
/>
```

**Ожидается**:
- Кнопки зелёные
- Фон светлый
- Текст тёмный

### Сценарий 3: Встроенная тема
```typescript
<WysiwygEditor theme="dark" />
```

**Ожидается**:
- Кнопки синие (по умолчанию)
- Фон тёмный
- Текст светлый

## Команды для тестирования в консоли

```javascript
// 1. Получить элемент
const editor = document.querySelector('.wysiwyg-editor-wrapper');

// 2. Проверить, что переменные установлены
const style = getComputedStyle(editor);
console.log('--primary:', style.getPropertyValue('--primary'));

// 3. Проверить, что кнопки используют переменные
const btn = document.querySelector('.wysiwyg-toolbar-btn');
const btnStyle = getComputedStyle(btn);
console.log('Button color:', btnStyle.color);

// 4. Проверить все переменные
const vars = {};
for (let i = 0; i < style.length; i++) {
  const prop = style[i];
  if (prop.startsWith('--')) {
    vars[prop] = style.getPropertyValue(prop);
  }
}
console.table(vars);

// 5. Изменить переменную в реальном времени
editor.style.setProperty('--primary', '#00ff00');
// Кнопки должны стать зелёными!
```

## Файлы для проверки

1. **src/components/WysiwygEditor.tsx**
   - Проверьте, что `wrapperRef` используется
   - Проверьте, что `useEffect` применяет переменные

2. **src/WysiwygEditor.global.css**
   - Проверьте, что переменные определены в `.wysiwyg-editor-wrapper`
   - Проверьте, что все стили используют `var(--...)`

3. **demo/App.tsx**
   - Проверьте, что `customTheme` передан в компонент

## Результат

Если всё работает правильно, вы должны увидеть:

✅ CSS переменные применяются к элементу
✅ Дочерние элементы наследуют переменные
✅ Цвета меняются при изменении `customTheme`
✅ Встроенные темы работают правильно
