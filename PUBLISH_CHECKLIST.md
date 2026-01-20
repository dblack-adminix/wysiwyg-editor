# Чеклист публикации @3lab/wysiwyg-editor

## ✅ Подготовка завершена

- [x] package.json обновлен с именем `@3lab/wysiwyg-editor`
- [x] Добавлено поле `exports` для современного module resolution
- [x] Добавлено поле `sideEffects` для tree-shaking
- [x] Добавлен script `prepublishOnly` для автоматической сборки
- [x] vite.config.ts настроен для library mode
- [x] Добавлена генерация ESM и CJS форматов
- [x] Настроена сборка CSS в один файл (style.css)
- [x] Включены source maps для отладки
- [x] tsconfig.build.json создан для генерации .d.ts файлов
- [x] LICENSE файл создан (MIT)
- [x] CHANGELOG.md создан с версией 1.0.0
- [x] Документация обновлена

## 📋 Перед публикацией

### 1. Сборка и проверка

```bash
# Очистить предыдущую сборку
rm -rf dist

# Собрать пакет
npm run build

# Проверить содержимое dist/
dir dist
```

**Ожидаемые файлы:**
- `index.js` - CommonJS bundle
- `index.js.map` - Source map для CJS
- `index.esm.js` - ES Module bundle
- `index.esm.js.map` - Source map для ESM
- `index.d.ts` - TypeScript declarations
- `style.css` - Bundled CSS

### 2. Проверка размера

```bash
# PowerShell
Get-ChildItem dist -Recurse | Measure-Object -Property Length -Sum

# Должно быть примерно 200-400 KB
```

### 3. Dry-run публикации

```bash
# Проверить, что будет опубликовано
npm pack --dry-run

# Создать .tgz файл для проверки
npm pack

# Проверить размер
dir *.tgz

# Распаковать и проверить содержимое
tar -xzf 3lab-wysiwyg-editor-1.0.0.tgz
dir package
```

**Убедитесь:**
- Размер пакета разумный (<500KB)
- Включены только: dist/, README.md, LICENSE, CHANGELOG.md
- Не включены: src/, demo/, node_modules/, тесты

### 4. Тестирование локально

```bash
# В папке с редактором
npm link

# Создать тестовый проект
cd ..
npm create vite@latest test-editor -- --template react-ts
cd test-editor
npm install

# Подключить локальный пакет
npm link @3lab/wysiwyg-editor
```

**Создать test-editor/src/App.tsx:**

```tsx
import { WysiwygEditor } from '@3lab/wysiwyg-editor';
import '@3lab/wysiwyg-editor/style.css';
import { useState } from 'react';

function App() {
  const [content, setContent] = useState('<p>Привет, мир!</p>');

  return (
    <div style={{ padding: '20px' }}>
      <h1>Тест @3lab/wysiwyg-editor</h1>
      <WysiwygEditor
        value={content}
        onChange={(html, meta) => {
          setContent(html);
          console.log('Слов:', meta.wordCount);
        }}
        placeholder="Начните печатать..."
      />
    </div>
  );
}

export default App;
```

**Запустить и проверить:**

```bash
npm run dev
```

- [ ] Редактор отображается корректно
- [ ] Стили применяются
- [ ] TypeScript автодополнение работает
- [ ] Все кнопки работают
- [ ] Вставка кода работает
- [ ] Подсветка синтаксиса работает
- [ ] Нет ошибок в консоли
- [ ] Нет предупреждений TypeScript

### 5. Регистрация в npm

Если у вас еще нет аккаунта:
1. Зайдите на https://www.npmjs.com/signup
2. Создайте аккаунт
3. Подтвердите email

```bash
# Войти в npm
npm login

# Проверить
npm whoami
```

### 6. Публикация

```bash
# Вернуться в папку с редактором
cd ../wysiwyg-editor

# Опубликовать (prepublishOnly автоматически запустит сборку)
npm publish --access public
```

**Ожидаемый результат:**

```
+ @3lab/wysiwyg-editor@1.0.0
```

### 7. Проверка публикации

1. Откройте страницу пакета:
   ```
   https://www.npmjs.com/package/@3lab/wysiwyg-editor
   ```

2. Установите из npm в новом проекте:
   ```bash
   npm install @3lab/wysiwyg-editor
   ```

3. Проверьте, что все работает

### 8. Git теги и релизы

```bash
# Создать git tag
git tag v1.0.0

# Отправить tag на GitHub
git push origin v1.0.0

# Или все теги
git push --tags
```

**Создать GitHub Release:**
1. Зайдите на GitHub → Releases → Create a new release
2. Выберите тег v1.0.0
3. Заголовок: "v1.0.0 - Первый релиз"
4. Описание: скопируйте из CHANGELOG.md
5. Нажмите "Publish release"

### 9. Обновление README

Добавьте бейджи в начало README.md:

```markdown
# Pro WYSIWYG Editor

![npm version](https://img.shields.io/npm/v/@3lab/wysiwyg-editor)
![npm downloads](https://img.shields.io/npm/dm/@3lab/wysiwyg-editor)
![bundle size](https://img.shields.io/bundlephobia/minzip/@3lab/wysiwyg-editor)
![license](https://img.shields.io/npm/l/@3lab/wysiwyg-editor)
![typescript](https://img.shields.io/badge/TypeScript-Ready-blue)
```

## 🎉 Готово!

Ваш пакет опубликован и доступен:

```bash
npm install @3lab/wysiwyg-editor
```

## 📊 После публикации

### Мониторинг
- Количество загрузок: https://npm-stat.com/charts.html?package=@3lab/wysiwyg-editor
- Issues на GitHub
- Вопросы пользователей

### Продвижение
- [ ] Написать статью на Medium/Habr
- [ ] Поделиться в Twitter/X
- [ ] Добавить в awesome-react списки
- [ ] Создать демо сайт (Vercel/Netlify)
- [ ] Добавить в Product Hunt

## 🔄 Обновление версии

Для публикации новой версии:

```bash
# 1. Внести изменения в код
# 2. Обновить CHANGELOG.md

# 3. Обновить версию
npm version patch  # 1.0.0 -> 1.0.1 (исправления)
npm version minor  # 1.0.0 -> 1.1.0 (новые функции)
npm version major  # 1.0.0 -> 2.0.0 (breaking changes)

# 4. Опубликовать (prepublishOnly автоматически соберет)
npm publish

# 5. Отправить теги
git push --tags
```

## 📚 Полезные команды

```bash
# Проверить версию пакета
npm view @3lab/wysiwyg-editor version

# Проверить все версии
npm view @3lab/wysiwyg-editor versions

# Проверить информацию о пакете
npm view @3lab/wysiwyg-editor

# Отменить публикацию (только в течение 72 часов)
npm unpublish @3lab/wysiwyg-editor@1.0.0

# Пометить версию как deprecated
npm deprecate @3lab/wysiwyg-editor@1.0.0 "Use version 1.0.1 instead"
```

## 🆘 Решение проблем

### Ошибка: "You must sign up for private packages"
```bash
npm publish --access public
```

### Ошибка: "Package name already exists"
Выберите другое имя или добавьте scope (@3lab/)

### Ошибка: "You do not have permission to publish"
```bash
npm login
npm whoami
```

### Ошибка при сборке TypeScript
```bash
# Проверить конфигурацию
tsc --project tsconfig.build.json --noEmit

# Исправить ошибки и пересобрать
npm run build
```

## 💡 Рекомендации

1. **Версионирование**: Следуйте Semantic Versioning
2. **Changelog**: Обновляйте перед каждым релизом
3. **Тестирование**: Всегда тестируйте локально перед публикацией
4. **Документация**: Держите README актуальным
5. **Issues**: Отвечайте на вопросы пользователей
6. **Security**: Регулярно обновляйте зависимости
7. **Breaking changes**: Увеличивайте major версию
8. **Deprecation**: Используйте npm deprecate для устаревших версий

## 📞 Поддержка

Если возникли вопросы:
- GitHub Issues: https://github.com/3lab/wysiwyg-editor/issues
- npm: https://www.npmjs.com/package/@3lab/wysiwyg-editor
- Email: support@3lab.com (замените на реальный)

---

**Удачи с публикацией! 🚀**
