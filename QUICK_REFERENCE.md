# Quick Reference - Customization

## Basic Usage

```tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';
import 'wysiwyg-editor-3lab/style.css';

<WysiwygEditor onChange={(html) => console.log(html)} />
```

## Themes

```tsx
// Built-in themes
<WysiwygEditor themeName="light" />
<WysiwygEditor themeName="dark" />
<WysiwygEditor themeName="minimal" />
<WysiwygEditor themeName="colorful" />

// Custom theme
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#007bff',
    bgPrimary: '#ffffff',
    textPrimary: '#212529',
  }}
/>
```

## Preview Panel

```tsx
// Enable/disable
<WysiwygEditor enablePreviewPanel={true} />

// Position
<WysiwygEditor previewPosition="right" />    // 'right' | 'bottom' | 'none'

// Size
<WysiwygEditor previewWidth={400} previewHeight={600} />

// Standalone
import { PreviewPanel } from 'wysiwyg-editor-3lab';
<PreviewPanel html={content} theme="light" {...handlers} />
```

## Features

```tsx
<WysiwygEditor
  // Content
  enablePreviewPanel={true}
  enableSourceTab={true}
  enableFindReplace={true}
  enablePrint={true}
  enableFullscreen={true}
  
  // Media
  allowImages={true}
  allowImageUpload={true}
  allowVideoEmbeds={true}
  allowTables={true}
  
  // Autosave
  enableAutosave={true}
  autosaveKey="my-editor"
  autosaveIntervalMs={2000}
/>
```

## Styling

```tsx
// Custom CSS class
<WysiwygEditor customClassName="my-editor" />

// Inline styles
<WysiwygEditor customStyles={{ maxWidth: '900px' }} />

// CSS variables (global)
:root {
  --primary: #007bff;
  --bg-primary: #ffffff;
  --text-primary: #212529;
}
```

## Theme Colors

```typescript
interface ThemeConfig {
  primary?: string;           // Main color
  primaryDark?: string;       // Darker shade
  primaryLight?: string;      // Lighter shade
  bgPrimary?: string;         // Main background
  bgSecondary?: string;       // Secondary background
  textPrimary?: string;       // Main text
  textSecondary?: string;     // Secondary text
  borderRadius?: string;      // Border radius
  borderWidth?: string;       // Border width
  fontFamily?: string;        // Font
  fontSize?: string;          // Font size
  shadowSm?: string;          // Small shadow
  shadowMd?: string;          // Medium shadow
  shadowLg?: string;          // Large shadow
}
```

## Common Patterns

### Blog Editor
```tsx
<WysiwygEditor
  themeName="light"
  enablePreviewPanel={true}
  previewPosition="right"
  enableAutosave={true}
  allowImages={true}
  allowVideoEmbeds={true}
  allowTables={true}
/>
```

### Comment Editor
```tsx
<WysiwygEditor
  themeName="light"
  enablePreviewPanel={false}
  enableFindReplace={false}
  enablePrint={false}
  enableFullscreen={false}
  allowImages={false}
  allowVideoEmbeds={false}
  allowTables={false}
/>
```

### Admin Panel
```tsx
<WysiwygEditor
  themeName="dark"
  enablePreviewPanel={true}
  enableSourceTab={true}
  enableFindReplace={true}
  enablePrint={true}
  enableFullscreen={true}
  allowImages={true}
  allowImageUpload={true}
  allowVideoEmbeds={true}
  allowVideoUpload={true}
  allowTables={true}
/>
```

### Branded Editor
```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#ff6b6b',        // Your brand color
    bgPrimary: '#fff5f5',
    textPrimary: '#2d3748',
    borderRadius: '8px',
  }}
  customClassName="my-brand-editor"
/>
```

## Callbacks

```tsx
<WysiwygEditor
  onChange={(html, meta) => {
    console.log('HTML:', html);
    console.log('Stats:', meta);  // { wordCount, charCount, paragraphCount }
  }}
  onImageUpload={async (file) => {
    const url = await uploadToServer(file);
    return url;
  }}
  onVideoUpload={async (file) => {
    const url = await uploadToServer(file);
    return url;
  }}
/>
```

## Responsive

```tsx
const isMobile = window.innerWidth < 768;

<WysiwygEditor
  previewPosition={isMobile ? 'bottom' : 'right'}
  previewHeight={isMobile ? '300px' : undefined}
  mobileOptimized={true}
/>
```

## Dark Mode

```tsx
const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

<WysiwygEditor themeName={isDark ? 'dark' : 'light'} />
```

## Documentation

- **Full Guide**: [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)
- **Examples**: [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md)
- **API Docs**: [README.md](./README.md)
- **GitHub**: https://github.com/dblack-adminix/wysiwyg-editor

## Support

- 📖 Read the guides
- 🔍 Check examples
- 💬 Open an issue on GitHub
- 📧 Check the README for contact info
