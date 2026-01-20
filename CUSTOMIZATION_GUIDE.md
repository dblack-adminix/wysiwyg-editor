# Customization Guide

The WYSIWYG Editor is highly customizable to fit your website's design and branding. This guide shows you how to customize themes, colors, layout, and component visibility.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Theme System](#theme-system)
3. [Custom Colors](#custom-colors)
4. [Preview Panel Control](#preview-panel-control)
5. [Component Visibility](#component-visibility)
6. [CSS Variables](#css-variables)
7. [Examples](#examples)

## Quick Start

### Using a Built-in Theme

```tsx
import { WysiwygEditor } from 'wysiwyg-editor-3lab';

export function MyEditor() {
  return (
    <WysiwygEditor
      themeName="dark"
      onChange={(html) => console.log(html)}
    />
  );
}
```

Available themes: `light`, `dark`, `minimal`, `colorful`, `custom`

### Custom Colors

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#ff6b6b',
    bgPrimary: '#fff5f5',
    textPrimary: '#2d3748',
    borderRadius: '8px',
  }}
/>
```

## Theme System

### Built-in Themes

#### Light Theme
Clean, professional appearance with light backgrounds and dark text.

```tsx
<WysiwygEditor themeName="light" />
```

#### Dark Theme
Modern dark interface with light text on dark backgrounds.

```tsx
<WysiwygEditor themeName="dark" />
```

#### Minimal Theme
Minimalist design with no shadows and serif fonts.

```tsx
<WysiwygEditor themeName="minimal" />
```

#### Colorful Theme
Vibrant design with rounded corners and colorful accents.

```tsx
<WysiwygEditor themeName="colorful" />
```

#### Custom Theme
Create your own theme by providing custom colors and styles.

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#007bff',
    primaryDark: '#0056b3',
    primaryLight: '#e7f1ff',
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    textPrimary: '#212529',
    textSecondary: '#6c757d',
    borderRadius: '4px',
    borderWidth: '1px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    shadowSm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    shadowMd: '0 4px 6px rgba(0, 0, 0, 0.1)',
    shadowLg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  }}
/>
```

## Custom Colors

### Available Color Properties

```typescript
interface ThemeConfig {
  primary?: string;              // Main brand color
  primaryDark?: string;          // Darker shade of primary
  primaryLight?: string;         // Lighter shade of primary
  bgPrimary?: string;            // Main background color
  bgSecondary?: string;          // Secondary background (toolbar, etc)
  textPrimary?: string;          // Main text color
  textSecondary?: string;        // Secondary text (labels, hints)
  borderRadius?: string;         // Border radius for elements
  borderWidth?: string;          // Border width
  fontFamily?: string;           // Font family
  fontSize?: string;             // Base font size
  shadowSm?: string;             // Small shadow
  shadowMd?: string;             // Medium shadow
  shadowLg?: string;             // Large shadow
}
```

### Example: Brand Colors

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#1e40af',           // Your brand blue
    bgPrimary: '#ffffff',
    textPrimary: '#1f2937',
    borderRadius: '6px',
    fontFamily: '"Inter", sans-serif',
  }}
/>
```

## Preview Panel Control

### Disable Preview Panel

```tsx
<WysiwygEditor
  enablePreviewPanel={false}
/>
```

### Position Preview Panel

```tsx
// Right side (default)
<WysiwygEditor previewPosition="right" />

// Bottom
<WysiwygEditor previewPosition="bottom" />

// Disabled
<WysiwygEditor previewPosition="none" />
```

### Customize Preview Size

```tsx
<WysiwygEditor
  previewPosition="right"
  previewWidth={400}        // pixels
  previewHeight={600}       // pixels
/>

// Or use CSS units
<WysiwygEditor
  previewPosition="bottom"
  previewWidth="100%"
  previewHeight="300px"
/>
```

### Use Preview Panel Separately

```tsx
import { WysiwygEditor, PreviewPanel } from 'wysiwyg-editor-3lab';
import { useRef } from 'react';

export function CustomLayout() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState('');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <WysiwygEditor
          enablePreviewPanel={false}
          value={html}
          onChange={(newHtml) => setHtml(newHtml)}
        />
      </div>
      <div>
        <PreviewPanel
          html={html}
          theme="light"
          onExportHtml={() => {}}
          onExportText={() => {}}
          onCopyHtml={() => {}}
        />
      </div>
    </div>
  );
}
```

## Component Visibility

### Enable/Disable Features

```tsx
<WysiwygEditor
  // Preview
  enablePreviewPanel={true}
  enableSourceTab={true}
  
  // Toolbar features
  enableFindReplace={true}
  enablePrint={true}
  enableFullscreen={true}
  
  // Content features
  allowImages={true}
  allowImageUpload={true}
  allowVideoEmbeds={true}
  allowVideoUpload={false}
  allowTables={true}
  
  // Autosave
  enableAutosave={true}
  autosaveKey="my-editor-content"
  autosaveIntervalMs={2000}
/>
```

## CSS Variables

The editor uses CSS variables for theming. You can override them globally:

```css
:root {
  --primary: #007bff;
  --bg-primary: #ffffff;
  --text-primary: #212529;
  --border-radius: 4px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-size: 14px;
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## Examples

### Example 1: Minimal Dark Editor

```tsx
<WysiwygEditor
  themeName="minimal"
  enablePreviewPanel={false}
  enableFindReplace={false}
  enablePrint={false}
  enableFullscreen={false}
/>
```

### Example 2: Branded Editor

```tsx
<WysiwygEditor
  themeName="custom"
  customTheme={{
    primary: '#e74c3c',           // Red brand color
    bgPrimary: '#ecf0f1',         // Light gray background
    textPrimary: '#2c3e50',       // Dark text
    borderRadius: '8px',
    fontFamily: '"Segoe UI", Roboto, sans-serif',
  }}
  previewPosition="bottom"
  previewHeight="300px"
/>
```

### Example 3: Embedded in Blog

```tsx
<WysiwygEditor
  themeName="light"
  enablePreviewPanel={true}
  previewPosition="right"
  previewWidth={350}
  enableAutosave={true}
  autosaveKey="blog-post-draft"
  allowImages={true}
  allowImageUpload={true}
  allowTables={true}
  allowVideoEmbeds={true}
/>
```

### Example 4: Comment Editor

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
  placeholder="Write your comment..."
  style={{ maxHeight: '300px' }}
/>
```

### Example 5: Full-Featured Admin Editor

```tsx
<WysiwygEditor
  themeName="dark"
  customTheme={{
    primary: '#3b82f6',
    bgPrimary: '#1f2937',
    textPrimary: '#f3f4f6',
  }}
  enablePreviewPanel={true}
  previewPosition="right"
  enableSourceTab={true}
  enableFindReplace={true}
  enablePrint={true}
  enableFullscreen={true}
  allowImages={true}
  allowImageUpload={true}
  allowVideoEmbeds={true}
  allowVideoUpload={true}
  allowTables={true}
  enableAutosave={true}
  autosaveIntervalMs={1000}
/>
```

## Integration Tips

### Tailwind CSS Integration

```tsx
<WysiwygEditor
  customClassName="rounded-lg shadow-lg"
  customStyles={{
    maxWidth: '900px',
    margin: '0 auto',
  }}
/>
```

### Responsive Design

```tsx
<WysiwygEditor
  themeName="light"
  mobileOptimized={true}
  previewPosition={window.innerWidth > 768 ? 'right' : 'bottom'}
  previewWidth={window.innerWidth > 768 ? 400 : '100%'}
/>
```

### Dark Mode Support

```tsx
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

<WysiwygEditor
  themeName={isDarkMode ? 'dark' : 'light'}
/>
```

## API Reference

### WysiwygEditorProps

```typescript
interface WysiwygEditorProps {
  // Content
  value?: string;
  defaultValue?: string;
  onChange?: (html: string, meta: EditorMeta) => void;
  placeholder?: string;

  // Layout
  className?: string;
  style?: React.CSSProperties;
  customClassName?: string;
  customStyles?: React.CSSProperties;

  // Theme
  theme?: 'dark' | 'light' | 'auto';
  themeName?: 'light' | 'dark' | 'minimal' | 'colorful' | 'custom';
  customTheme?: ThemeConfig;

  // Preview Panel
  enablePreviewPanel?: boolean;
  previewPosition?: 'right' | 'bottom' | 'none';
  previewWidth?: string | number;
  previewHeight?: string | number;

  // Features
  enableSourceTab?: boolean;
  enableFindReplace?: boolean;
  enablePrint?: boolean;
  enableFullscreen?: boolean;
  enableAutosave?: boolean;
  autosaveKey?: string;
  autosaveIntervalMs?: number;

  // Content Features
  allowImages?: boolean;
  allowImageUpload?: boolean;
  allowVideoEmbeds?: boolean;
  allowVideoUpload?: boolean;
  allowTables?: boolean;

  // Callbacks
  onImageUpload?: (file: File) => Promise<string>;
  onVideoUpload?: (file: File) => Promise<string>;

  // Other
  mobileOptimized?: boolean;
  sanitizeHtml?: boolean;
  normalizeHtml?: boolean;
}
```

## Troubleshooting

### Colors not applying?
Make sure you're using valid CSS color values (hex, rgb, hsl, etc.)

### Preview panel not showing?
Check that `enablePreviewPanel={true}` and `previewPosition !== 'none'`

### Styles not updating?
Clear your browser cache and rebuild your project

## Support

For more help, visit the [GitHub repository](https://github.com/dblack-adminix/wysiwyg-editor) or check the [README](./README.md).
