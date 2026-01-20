# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-01-20

### Added
- **ChatEditor** — новый компактный компонент для чатов и мессенджеров
  - Минимальный тулбар с компактными кнопками (28x28px)
  - Поддержка форматирования: жирный, курсив, подчёркивание, зачёркивание
  - Цвет текста и фона с палитрой из 24 цветов
  - Вставка ссылок через модальное окно
  - Вставка изображений (загрузка файла или кастомный handler)
  - Вставка видео YouTube/Vimeo через модальное окно
  - Вставка таблиц с выбором строк/столбцов
  - Эмодзи пикер
  - Блок кода
  - Отправка по Ctrl+Enter или Enter
  - Кастомизация через props (включение/отключение функций)

### Changed
- **PreviewPanel** — убраны хардкодные стили, теперь наследует тему
- **CSS Variables** — применяются локально к каждому редактору, а не глобально
- Тёмная тема по умолчанию

### Fixed
- Исправлено применение CSS переменных в React (использование setProperty)
- Исправлены z-index для всплывающих окон (цвета, эмодзи)
- Модальные окна теперь открываются поверх всего контента

## [1.0.0] - 2025-01-19

### Added
- Initial release of @3lab/wysiwyg-editor
- Headless architecture with EditorCore for framework-agnostic logic
- React components (WysiwygEditor, Toolbar, StatusBar, Modals)
- useWysiwygEditor hook for custom implementations
- Shiki syntax highlighting for 48+ programming languages
- Automatic code detection on paste with language recognition
- Image support (URL and file upload with custom handler)
- Video embedding (YouTube, Vimeo) with URL and file upload
- Table insertion and editing
- Find and replace functionality
- Print and PDF export capabilities
- Dark/light theme support with auto-detection
- Mobile responsive design with optimized touch controls
- Autosave functionality with localStorage
- Full TypeScript support with complete type definitions
- Comprehensive documentation in English and Russian

### Features

#### Text Formatting
- Bold, italic, underline, strikethrough
- Subscript and superscript
- Text and background colors
- Font family and size selection
- Headings (H1-H6)
- Paragraphs and blockquotes
- Text alignment (left, center, right, justify)

#### Lists and Structure
- Ordered (numbered) lists
- Unordered (bulleted) lists
- Indent and outdent
- Remove formatting

#### Rich Content
- Link insertion with custom text
- Image insertion (URL or file upload)
- Video embedding (YouTube, Vimeo, or file upload)
- Table creation with custom rows/columns
- Code blocks with syntax highlighting
- Emoji picker with categories

#### Editor Features
- Find and replace with match highlighting
- Undo/redo functionality
- Fullscreen mode
- Preview panel with live rendering
- HTML source view
- Word/character/paragraph count
- Export to HTML, plain text, PDF
- Copy HTML to clipboard
- Print functionality with A4 preview

#### Code Highlighting
- Automatic code detection on paste
- 48+ supported languages including:
  - Web: HTML, CSS, JavaScript, TypeScript, JSX, TSX, JSON, Markdown
  - Backend: Python, Go, PHP, Ruby, Java, C#, C++, C, Rust
  - DevOps: YAML, TOML, Dockerfile, Nginx, Terraform, Kubernetes, Ansible
  - Databases: SQL, PostgreSQL, MySQL
  - Shell: Bash, PowerShell, CMD/Batch
  - And many more
- VS Code quality syntax highlighting powered by Shiki
- Light/dark theme support for code blocks
- Language badge and selector
- Copy code button
- Line wrapping toggle

#### Customization
- Controlled and uncontrolled modes
- Custom toolbar configuration
- Custom image upload handler
- Custom video upload handler
- Configurable features (enable/disable components)
- Theme customization (dark/light/auto)
- CSS variable overrides
- Mobile optimization toggle
- HTML sanitization options

#### Developer Experience
- Full TypeScript support
- Headless core for custom implementations
- React hooks for easy integration
- Comprehensive API documentation
- Integration examples for Next.js, Vite, CRA, Remix
- Form integration examples (React Hook Form, Formik)
- Validation examples
- Custom upload handler examples

### Technical Details
- Built with React 18+ and TypeScript
- Vite for fast development and optimized builds
- Shiki for syntax highlighting
- html2canvas and jspdf for PDF generation
- Zero dependencies except React peer dependency
- Tree-shakeable ESM and CommonJS builds
- Source maps for debugging
- CSS modules for style isolation

### Documentation
- Comprehensive README with examples
- API reference for all components and hooks
- Integration guides for popular frameworks
- Code detection documentation
- Shiki highlighting documentation
- Troubleshooting guide
- Contributing guidelines

[1.0.0]: https://github.com/3lab/wysiwyg-editor/releases/tag/v1.0.0
